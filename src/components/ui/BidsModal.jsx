import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, DollarSign, CheckCircle, XCircle } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';
import BidConfirmationModal from './BidConfirmationModal';

const BidsModal = ({ 
  isOpen, 
  onClose, 
  auctionData, 
  isLoading = false,
  error = null
}) => {
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [selectedBid, setSelectedBid] = useState(null);
  const [actionType, setActionType] = useState(null);

  if (!isOpen || !auctionData) return null;

  const handleAcceptBid = (bid) => {
    setSelectedBid(bid);
    setActionType('accept');
    setIsConfirmationModalOpen(true);
  };

  const handleRejectBid = (bid) => {
    setSelectedBid(bid);
    setActionType('reject');
    setIsConfirmationModalOpen(true);
  };

  const handleConfirmAction = () => {
    if (actionType === 'accept' && onAcceptBid) {
      onAcceptBid(selectedBid);
    } else if (actionType === 'reject' && onRejectBid) {
      onRejectBid(selectedBid);
    }
  };

  const handleCloseConfirmationModal = () => {
    setIsConfirmationModalOpen(false);
    setSelectedBid(null);
    setActionType(null);
  };

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
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] sm:max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-neutral-200">
              <div className="flex-1 min-w-0">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-neutral-800 truncate">
                  Bids for {auctionData.vehicle}
                </h2>
                <p className="text-xs sm:text-sm text-neutral-600 mt-1">
                  VIN: {auctionData.vin} • {auctionData.bids?.length || 0} total bids
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors flex-shrink-0 ml-2"
                disabled={isLoading}
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-500" />
              </button>
            </div>

            {/* Error Display */}
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-xl"
              >
                <div className="flex items-center space-x-2">
                  <X className="w-5 h-5 text-red-500" />
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              </motion.div>
            )}

            {/* Modal Content */}
            <div className="p-4 sm:p-6 overflow-y-auto max-h-[60vh]">
              {auctionData.bids && auctionData.bids.length > 0 ? (
                <div className="space-y-4">
                  {[...auctionData.bids]
                    .sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount))
                    .map((bid, index) => (
                    <motion.div
                      key={bid.id || index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`bg-neutral-50 rounded-xl p-4 border ${
                        index === 0 ? 'border-success/30 bg-success/5' : 'border-neutral-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            index === 0 ? 'bg-success/20 text-success' : 'bg-primary-100 text-primary-600'
                          }`}>
                            <span className="font-semibold text-sm">
                              {index + 1}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-neutral-800">
                              {bid.bidder_display_name || 'Unknown Bidder'}
                            </h3>
                            <p className="text-sm text-neutral-600">
                              {bid.bidder_email || 'N/A'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${
                            index === 0 ? 'text-success' : 'text-primary-600'
                          }`}>
                            {formatCurrency(parseFloat(bid.amount))}
                          </div>
                          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            bid.is_accepted 
                              ? 'bg-success/10 text-success'
                              : bid.is_expired
                              ? 'bg-warning/10 text-warning'
                              : bid.status === 'rejected'
                              ? 'bg-error/10 text-error'
                              : 'bg-primary/10 text-primary'
                          }`}>
                            {bid.is_accepted ? 'Accepted' : 
                             bid.is_expired ? 'Expired' : 
                             bid.status === 'rejected' ? 'Rejected' : 'Pending'}
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-neutral-500">Bidder ID:</span>
                          <p className="font-medium text-neutral-800">#{bid.bidder_id || 'N/A'}</p>
                        </div>
                        <div>
                          <span className="text-neutral-500">Bid Date:</span>
                          <p className="font-medium text-neutral-800">
                            {bid.created_at_raw ? new Date(bid.created_at_raw).toLocaleString() : 'N/A'}
                          </p>
                        </div>
                      </div>
                      
                      {bid.notes && (
                        <div className="mt-3 p-3 bg-white rounded-lg border border-neutral-200">
                          <span className="text-neutral-500 text-sm">Notes:</span>
                          <p className="text-neutral-800 text-sm mt-1">{bid.notes}</p>
                        </div>
                      )}

                      {/* Action Buttons for Pending Bids */}
                      {!bid.is_accepted && !bid.is_expired && bid.status !== 'rejected' && (
                        <div className="mt-4 flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleRejectBid(bid)}
                            disabled={isLoading}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <XCircle className="w-4 h-4" />
                            Reject
                          </button>
                          <button
                            onClick={() => handleAcceptBid(bid)}
                            disabled={isLoading}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-success bg-success/10 hover:bg-success/20 border border-success/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Accept
                          </button>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <DollarSign className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-neutral-600 mb-2">No Bids Available</h3>
                  <p className="text-neutral-500">This auction doesn't have any bids yet.</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-neutral-200 bg-neutral-50">
              <button
                onClick={onClose}
                disabled={isLoading}
                className="cursor-pointer btn-ghost disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Bid Confirmation Modal */}
      <BidConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={handleCloseConfirmationModal}
        action={actionType}
        bidData={selectedBid}
        auctionData={auctionData}
      />
    </AnimatePresence>
  );
};

export default BidsModal;
