import { useEffect, useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { formatCurrency } from "../../lib/utils";
import {
  acceptBid,
  rejectBid,
  clearBidOperationStates,
} from "../../redux/slices/offersSlice";
import AppointmentModal from "./AppointmentModal";

const BidConfirmationModal = ({
  isOpen,
  onClose,
  onSuccess,
  action,
  bidData,
  auctionData,
}) => {
  const dispatch = useDispatch();
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
  
  // State for AppointmentModal
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  
  // Get the accepted bid data for appointment modal
  const getAcceptedBidData = () => {
    if (!bidData || !auctionData) return null;
    
    // Find the accepted bid in the auction data
    const acceptedBid = auctionData.bids?.find(bid => bid.id === bidData.id);
    if (!acceptedBid) return null;
    
    return {
      dealerName: acceptedBid.bidder_display_name || "Auto Dealer",
      dealerId: acceptedBid.bidder_id,
      dealerEmail: acceptedBid.bidder_email || "contact@dealer.com",
      vehicleInfo: auctionData.year && auctionData.make && auctionData.model 
        ? `${auctionData.year} ${auctionData.make} ${auctionData.model}` 
        : auctionData.vehicle || "Vehicle",
      bidderName: acceptedBid.bidder_display_name || "Bidder",
      bidderEmail: acceptedBid.bidder_email,
      bidAmount: acceptedBid.amount
    };
  };

  // Ref to track if we've already processed the success to prevent multiple triggers
  const hasProcessedSuccess = useRef(false);
  
  // Store action and isAccept in refs to prevent them from changing during the flow
  const actionRef = useRef(action);
  const isAcceptRef = useRef(action === "accept");

  // Update refs when action changes
  useEffect(() => {
    actionRef.current = action;
    isAcceptRef.current = action === "accept";
  }, [action]);

  const isAccept = action === "accept";
  const isReject = action === "reject";

  // Handle API call when user confirms action
  const handleConfirmAction = async () => {
    
    console.log("🚀 handleConfirmAction called:", {
      action,
      isAccept,
      isReject,
      auctionData: auctionData?.id,
      bidData: bidData?.id
    });
    
    if (!auctionData) {
      console.log("❌ No auction data, returning");
      return;
    }

    // Clear any previous errors
    setLocalError(null);
    console.log("🧹 Cleared local error");

    // Check if this is a cash offer - cash offers cannot be accepted/rejected
    if (bidData.id === "cash-offer") {
      console.log("❌ Cash offers cannot be accepted or rejected through this modal");
      setLocalError(
        "Cash offers cannot be accepted or rejected. Please use the main auction interface."
      );
      return;
    }

    // Handle regular bid acceptance/rejection
    console.log(`🔄 ${action}ing bid:`, {
      amount: bidData.amount,
      auctionId: auctionData.id,
      bidId: bidData.id
    });
    
    const bidDataPayload = {
      bidId: bidData.id,
      productId: auctionData.id || auctionData.product_id,
      bidderId: bidData.bidder_id,
    };

    console.log("📦 Bid data payload:", bidDataPayload);
    
    try {
      if (isAccept) {
        console.log("✅ Dispatching acceptBid...");
        const result = await dispatch(acceptBid(bidDataPayload)).unwrap();
        console.log("✅ acceptBid result:", result);
      } else if (isReject) {
        console.log("❌ Dispatching rejectBid...");
        const result = await dispatch(rejectBid(bidDataPayload)).unwrap();
        console.log("❌ rejectBid result:", result);
      } else {
        console.log("❌ Invalid action:", action);
      }
    } catch (error) {
      console.error(`💥 Error ${action}ing bid:`, error);
      setLocalError(
        error.message || `Failed to ${action} bid. Please try again.`
      );
    }
  };

  // Handle success state changes
  useEffect(() => {
    // Don't run this effect if bidOperationSuccess is false
    if (!bidOperationSuccess) {
      console.log("🔄 bidOperationSuccess is false, skipping effect");
      return;
    }

    console.log("🎯 Success effect triggered:", {
      bidOperationSuccess,
      hasShownToast,
      isAccept,
      action,
      showSuccess,
      showAppointmentModal,
      hasProcessedSuccess: hasProcessedSuccess.current
    });

    // Only process when we haven't processed it yet
    if (!hasProcessedSuccess.current) {
      console.log("✅ Processing success for the first time");
      hasProcessedSuccess.current = true;
      
      // Don't show success state, just show toast
      setHasShownToast(true);
      
      if (actionRef.current) {
        toast.success(`Bid ${actionRef.current}ed successfully!`);
        console.log(`🍞 Toast shown: Bid ${actionRef.current}ed successfully!`);
      }

      // Call onSuccess to let parent know operation completed (but not for accepted bids that will show appointment modal)
      if (onSuccess && !isAcceptRef.current) {
        console.log("📞 Calling onSuccess callback for non-accept actions");
        onSuccess();
      } else if (isAcceptRef.current) {
        console.log("📞 Skipping onSuccess for accepted bid - will call after appointment modal");
      }

      // If bid was accepted, open appointment modal immediately
      if (isAcceptRef.current) {
        console.log("📅 Opening appointment modal immediately");
        setShowAppointmentModal(true);
        // Don't close the main modal - let it stay open to show the appointment modal
      } else {
        // For rejected bids, auto-close modal after a short delay
        console.log("❌ Scheduling modal close for rejected bid in 2 seconds");
        const timer = setTimeout(() => {
          console.log("❌ Auto-closing modal for rejected bid");
          // Clear Redux state after modal closes
          setTimeout(() => {
            console.log("🧹 Clearing Redux states");
            dispatch(clearBidOperationStates());
          }, 300);
        }, 2000);

        return () => {
          console.log("🧹 Cleaning up reject timer");
          clearTimeout(timer);
        };
      }
    } else {
      console.log("⏭️ Success already processed, skipping");
    }
  }, [bidOperationSuccess, action, isAccept, onSuccess, dispatch, hasShownToast, showAppointmentModal, showSuccess]);

  // Reset success state when modal opens
  useEffect(() => {
    // Only reset states when modal is first opened (not when appointment modal is open)
    if (isOpen && !hasProcessedSuccess.current && !showAppointmentModal) {
      setShowSuccess(false);
      setLocalError(null);
      setHasShownToast(false);
      setShowAppointmentModal(false);
      hasProcessedSuccess.current = false; // Reset the ref
      // Reset the action refs
      actionRef.current = action;
      isAcceptRef.current = action === "accept";
    }
  }, [isOpen, showAppointmentModal, action]);

  // Reset states when both modals are completely closed
  useEffect(() => {
    if (!isOpen && !showAppointmentModal && hasProcessedSuccess.current) {
      setShowSuccess(false);
      setLocalError(null);
      setHasShownToast(false);
      hasProcessedSuccess.current = false;
    }
  }, [isOpen, showAppointmentModal]);

  // Debug logging removed to prevent excessive console output

  // Handle appointment modal close
  const handleAppointmentClose = () => {
    console.log("🚪 handleAppointmentClose called");
    setShowAppointmentModal(false);
    // Clear Redux state and close main modal
    dispatch(clearBidOperationStates());
    setShowSuccess(false);
    // Call onSuccess now that the full flow is complete
    if (onSuccess) {
      console.log("📞 Calling onSuccess callback after appointment modal close");
      onSuccess();
    }
    onClose();
  };

  // Handle appointment submission success
  const handleAppointmentSuccess = () => {
    console.log("✅ handleAppointmentSuccess called");
    // Close both modals and clear states
    setShowAppointmentModal(false);
    dispatch(clearBidOperationStates());
    setShowSuccess(false);
    // Call onSuccess now that the full flow is complete
    if (onSuccess) {
      console.log("📞 Calling onSuccess callback after appointment success");
      onSuccess();
    }
    onClose();
  };

  // Removed unused handleMainModalClose function

  // Override onClose to prevent closing when appointment modal should be shown
  const handleClose = () => {
    if (showAppointmentModal) {
      console.log("🚪 Preventing close - appointment modal is open");
      return;
    }
    onClose();
  };

  // Don't render if modal is closed and appointment modal is not open
  if (!isOpen && !showAppointmentModal) {
    return null;
  }
  
  // Don't render if no bid data and appointment modal is not open
  if (!bidData && !showAppointmentModal) {
    return null;
  }

  // If appointment modal is open, always render (even if main modal is closed)
  const shouldRenderMainModal = isOpen || showAppointmentModal;

  const getModalConfig = () => {
    // Cash offers cannot be accepted or rejected through this modal
    // if (bidData?.id === "cash-offer") {
    //   return null;
    // }

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
    <>
      <AnimatePresence>
        {shouldRenderMainModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4"
            onClick={handleClose}
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

              {/* Success Display - Removed for accepted bids, only show for rejected bids */}
              {showSuccess && !isAccept && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mx-6 mt-4 p-4 bg-green-50 border border-green-200 rounded-xl"
                >
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <p className="text-green-700 text-sm font-medium">
                      Bid rejected successfully!
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
                  {/* {console.log("auction data", auctionData)} */}
              <button
                onClick={handleClose}
                disabled={bidOperationLoading || (showSuccess && !isAccept)}
                className="cursor-pointer px-6 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                  {(showSuccess && !isAccept) ? "Close" : config.cancelText}
                </button>
                {!(showSuccess && !isAccept) && (
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
      
      {/* Appointment Modal */}
      {showAppointmentModal && (() => {
        const acceptedBidData = getAcceptedBidData();
        return (
          <AppointmentModal
            isOpen={showAppointmentModal}
            onClose={handleAppointmentClose}
            onAppointmentSubmit={handleAppointmentSuccess}
            dealerName={acceptedBidData?.dealerName || "Auto Dealer"}
            dealerId={acceptedBidData?.dealerId}
            dealerEmail={acceptedBidData?.dealerEmail || "contact@dealer.com"}
            vehicleInfo={acceptedBidData?.vehicleInfo || "Vehicle"}
            title="Schedule Your Appointment"
            description={`Now that your bid of ${acceptedBidData?.bidAmount ? formatCurrency(parseFloat(acceptedBidData.bidAmount)) : 'N/A'} has been accepted by ${acceptedBidData?.dealerName || 'the dealer'}, let's schedule your appointment to complete the transaction.`}
          />
        );
      })()}
    </>
  );
};

export default BidConfirmationModal;
