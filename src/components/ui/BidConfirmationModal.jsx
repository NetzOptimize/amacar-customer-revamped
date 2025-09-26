import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertTriangle, DollarSign } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { formatCurrency } from "../../lib/utils";
import {
  acceptBid,
  rejectBid,
  clearBidOperationStates,
} from "../../redux/slices/offersSlice";

const BidConfirmationModal = ({
  isOpen,
  onClose,
  onSuccess,
  action,
  bidData,
  auctionData,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const bidOperationLoading = useSelector(
    (state) => state.offers.bidOperationLoading
  );
  const bidOperationError = useSelector(
    (state) => state.offers.bidOperationError
  );
  const bidOperationSuccess = useSelector(
    (state) => state.offers.bidOperationSuccess
  );

  // Local state to manage success display
  const [showSuccess, setShowSuccess] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [hasShownToast, setHasShownToast] = useState(false);

  const isAccept = action === "accept";
  const isReject = action === "reject";

  // Handle API call when user confirms action
  const handleConfirmAction = async () => {
    console.log("Confirming action:", action);
    if (!auctionData) return;

    // Clear any previous errors
    setLocalError(null);

    // Check if this is a cash offer - cash offers cannot be accepted/rejected
    if (bidData.id === "cash-offer") {
      console.log(
        "Cash offers cannot be accepted or rejected through this modal"
      );
      setLocalError(
        "Cash offers cannot be accepted or rejected. Please use the main auction interface."
      );
      return;
    }

    // Handle regular bid acceptance/rejection
    console.log(
      `${action}ing bid:`,
      bidData.amount,
      "for auction:",
      auctionData.id
    );
    const bidDataPayload = {
      bidId: bidData.id,
      productId: auctionData.id || auctionData.product_id,
      bidderId: bidData.bidder_id,
    };

    console.log("Bid data payload:", bidDataPayload);
    try {
      if (isAccept) {
        console.log("Accepting bid:", bidDataPayload);
        await dispatch(acceptBid(bidDataPayload)).unwrap();
        console.log("Accepted bid:", bidDataPayload);
      } else if (isReject) {
        await dispatch(rejectBid(bidDataPayload)).unwrap();
        console.log("Rejected bid:", bidDataPayload);
      } else {
        console.log("Invalid action:", action);
      }
    } catch (error) {
      setLocalError(
        error.message || `Failed to ${action} bid. Please try again.`
      );
      console.error(`Error ${action}ing bid:`, error);
    }
  };

  // Handle success state changes
  useEffect(() => {
    if (bidOperationSuccess && !hasShownToast) {
      setShowSuccess(true);
      if (!hasShownToast) {
        toast.success(`Bid ${action}ed successfully!`);
      }
      setHasShownToast(true);

      // Call onSuccess to let parent know operation completed
      if (onSuccess) {
        onSuccess();
      }

      // Auto-close modal after showing success for 2 seconds
      const timer = setTimeout(() => {
        // onClose(); // Remove this line
        // Clear Redux state after modal closes
        setTimeout(() => {
          dispatch(clearBidOperationStates());
          setShowSuccess(false);
          // setHasShownToast(false);
        }, 300);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [bidOperationSuccess, onSuccess, dispatch]); // Add onSuccess to dependencies

  // Reset success state when modal opens
  useEffect(() => {
    if (isOpen) {
      setShowSuccess(false);
      setLocalError(null);
      setHasShownToast(false);
    }
  }, [isOpen]);

  useEffect(() => {
    console.log("Bid data:", bidData);
    console.log("Auction data:", auctionData);
  }, [bidData, auctionData]);

  if (!isOpen || !bidData) return null;

  const getModalConfig = () => {
    // Cash offers cannot be accepted or rejected through this modal
    if (bidData.id === "cash-offer") {
      return null;
    }

    if (isAccept) {
      return {
        icon: CheckCircle,
        iconColor: "text-success",
        iconBg: "bg-success/10",
        title: "Accept This Bid?",
        description: `Are you sure you want to accept this bid of ${formatCurrency(
          parseFloat(bidData.amount)
        )}?`,
        confirmText: "Yes, Accept Bid",
        confirmClass: "bg-success hover:bg-success/90 text-white",
        cancelText: "Cancel",
        accentColor: "border-success/20",
        bgGradient: "from-success/5 to-success/10",
      };
    } else if (isReject) {
      return {
        icon: XCircle,
        iconColor: "text-red-500",
        iconBg: "bg-red-50",
        title: "Reject This Bid?",
        description: `Are you sure you want to reject this bid of ${formatCurrency(
          parseFloat(bidData.amount)
        )}? This action cannot be undone.`,
        confirmText: "Yes, Reject Bid",
        confirmClass: "bg-red-500 hover:bg-red-600 text-white",
        cancelText: "Cancel",
        accentColor: "border-red-200",
        bgGradient: "from-red-50 to-red-100",
      };
    }
    return null;
  };

  const config = getModalConfig();
  if (!config) return null;

  const IconComponent = config.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`bg-white rounded-2xl shadow-2xl max-w-md w-full mx-2 sm:mx-0 border-2 ${config.accentColor} overflow-hidden`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with gradient background */}
            <div
              className={`bg-gradient-to-r ${config.bgGradient} p-4 sm:p-6 border-b ${config.accentColor}`}
            >
              <div className="flex items-center justify-center mb-4">
                <div
                  className={`w-16 h-16 ${config.iconBg} rounded-full flex items-center justify-center`}
                >
                  <IconComponent className={`w-8 h-8 ${config.iconColor}`} />
                </div>
              </div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-neutral-800 text-center mb-2">
                {config.title}
              </h2>
              <p className="text-neutral-600 text-center text-xs sm:text-sm leading-relaxed">
                {config.description}
              </p>
            </div>

            {/* Error Display */}
            {(bidOperationError || localError) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-xl"
              >
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <p className="text-red-700 text-sm font-medium">
                    {localError || bidOperationError}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Success Display */}
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mx-6 mt-4 p-4 bg-green-50 border border-green-200 rounded-xl"
              >
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <p className="text-green-700 text-sm font-medium">
                    {isAccept
                      ? "Bid accepted successfully!"
                      : "Bid rejected successfully!"}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Bid Details */}
            <div className="p-6 bg-neutral-50">
              <div className="bg-white rounded-xl p-4 border border-neutral-200">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-neutral-800">
                      {bidData.bidder_display_name || "Unknown Bidder"}
                    </h3>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-2xl font-bold ${
                        isAccept ? "text-success" : "text-red-500"
                      }`}
                    >
                      {formatCurrency(parseFloat(bidData.amount))}
                    </div>
                  </div>
                </div>

                {bidData.notes && (
                  <div className="mt-3 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                    <span className="text-neutral-500 text-sm">Notes:</span>
                    <p className="text-neutral-800 text-sm mt-1">
                      {bidData.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-neutral-200 bg-white">
              <button
                onClick={onClose}
                disabled={bidOperationLoading || showSuccess}
                className="cursor-pointer px-6 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {showSuccess ? "Close" : config.cancelText}
              </button>
              {!showSuccess && (
                <button
                  onClick={handleConfirmAction}
                  disabled={bidOperationLoading}
                  className={`cursor-pointer px-6 py-2.5 ${config.confirmClass} rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transform hover:scale-105`}
                >
                  {bidOperationLoading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <IconComponent className="w-4 h-4" />
                      <span>{config.confirmText}</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BidConfirmationModal;
