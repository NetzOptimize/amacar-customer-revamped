import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, AlertTriangle, X, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ConfirmRelistVehicleModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  vehicleName,
  vehicleData = null, // Contains product_id, vin, zip, etc.
  isLoading = false 
}) => {
  const [hasChanges, setHasChanges] = useState(null); // null, true, false
  const navigate = useNavigate();

  const handleRelist = () => {
    if (hasChanges === null) return;
    
    console.log('=== RELIST VEHICLE DEBUG ===');
    console.log('hasChanges:', hasChanges);
    console.log('vehicleData:', vehicleData);
    console.log('vehicleName:', vehicleName);
    
    if (hasChanges === true) {
      // User selected "Yes" - redirect to auction page with data
      console.log('User selected YES - redirecting to auction page');
      
      const auctionData = {
        product_id: vehicleData?.product_id,
        vin: vehicleData?.vin,
        zip: vehicleData?.zip,
        vehicleName: vehicleName,
        vehicleType: vehicleData?.vehicleType || vehicleData?.make + ' ' + vehicleData?.model,
        hasChanges: true
      };
      
      console.log('Auction data to be passed:', auctionData);
      
      // Simulate loading state
      setTimeout(() => {
        console.log('Redirecting to /auction-page with data:', auctionData);
        navigate('/auction-page', { state: auctionData });
        onClose();
      }, 500);
    } else if (hasChanges === false) {
      // User selected "No" - call the existing re-auction API
      console.log('User selected NO - calling re-auction API');
      
      const relistData = {
        hasChanges,
        vehicleData,
        vehicleName
      };
      
      console.log('Relist data to be passed to onConfirm:', relistData);
      console.log('Calling onConfirm with relistData...');
      
      onConfirm(relistData);
    }
  };

  const resetModal = () => {
    setHasChanges(null);
  };

  // Reset modal when it opens/closes
  useEffect(() => {
    if (isOpen) {
      resetModal();
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4"
          onClick={isLoading ? undefined : onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start sm:items-center justify-between p-4 sm:p-6 border-b border-neutral-200">
              <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <RefreshCw className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg sm:text-2xl font-bold text-neutral-800 leading-tight">Any Change in Your Vehicle?</h2>
                  <p className="text-xs sm:text-sm text-neutral-600 mt-1">Please let us know if anything has changed</p>
                </div>
              </div>
              <button
                onClick={onClose}
                disabled={isLoading}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 ml-2"
              >
                <X className="w-5 h-5 text-neutral-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 sm:p-6">
              {/* Vehicle Info */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-neutral-800 text-sm sm:text-base truncate">{vehicleName}</h3>
                    <p className="text-xs sm:text-sm text-neutral-600">Ready for relisting</p>
                  </div>
                </div>
              </div>

              {/* Question */}
              <div className="mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg font-semibold text-neutral-800 mb-4 text-center leading-tight">
                  Has anything changed with your vehicle since the last assessment?
                </h3>
                
                {/* Yes/No Buttons */}
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 justify-center">
                  <button
                    onClick={() => {
                      console.log('YES button clicked');
                      setHasChanges(true);
                    }}
                    disabled={isLoading}
                    className={`px-6 sm:px-8 py-3 rounded-xl font-semibold transition-all duration-200 border-2 cursor-pointer w-full sm:w-auto ${
                      hasChanges === true
                        ? 'bg-green-500 text-white shadow-lg transform scale-105 border-green-600'
                        : 'bg-green-100 text-green-700 hover:bg-green-200 border-green-300'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => {
                      console.log('NO button clicked');
                      setHasChanges(false);
                    }}
                    disabled={isLoading}
                    className={`px-6 sm:px-8 py-3 rounded-xl font-semibold transition-all duration-200 border-2 cursor-pointer w-full sm:w-auto ${
                      hasChanges === false
                        ? 'bg-red-500 text-white shadow-lg transform scale-105 border-red-600'
                        : 'bg-red-100 text-red-700 hover:bg-red-200 border-red-300'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    No
                  </button>
                </div>
              </div>

              {/* Light line above footer */}
              <div className="border-t border-neutral-200 mb-4 sm:mb-6"></div>

              {/* Action Buttons */}
              <div className="flex gap-2 sm:flex-row items-stretch sm:items-center justify-between space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                  onClick={() => {
                    console.log('RELIST button clicked');
                    console.log('Current hasChanges state:', hasChanges);
                    console.log('isLoading:', isLoading);
                    handleRelist();
                  }}
                  disabled={isLoading || hasChanges === null}
                  className="px-6 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none border-2 border-primary-600 hover:border-primary-700 cursor-pointer w-full sm:w-auto order-1 sm:order-2 mb-0"
                >
                  {isLoading ? (
                    <>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>Relist Vehicle</span>
                    </>
                  )}
                </button>
                <button
                  onClick={onClose}
                  disabled={isLoading}
                  className="px-6 py-3 text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium border-2 border-neutral-300 hover:border-neutral-400 cursor-pointer w-full sm:w-auto order-2 sm:order-1"
                >
                  Cancel
                </button>
               
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmRelistVehicleModal;
