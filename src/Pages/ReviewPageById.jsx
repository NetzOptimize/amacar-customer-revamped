import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  Car, 
  ArrowLeft,
  Rocket,
  CheckCircle,
  Star,
  Trophy,
  Sparkles,
  Camera,
  User
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getOfferByProductId } from '@/redux/slices/carDetailsAndQuestionsSlice';
import AuctionSelectionModal from '@/components/ui/auction-selection-modal';
import LoginModal from '@/components/ui/LoginModal';
import ReviewPage from './ReviewPage';
import ReviewPageSkeleton from '@/components/skeletons/ReviewPageSkeleton';

export default function ReviewPageById() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  // Try multiple possible parameter names
  const urlProductId = searchParams.get('appraised_auction_id') || 
                      searchParams.get('id') || 
                      searchParams.get('product_id') || 
                      searchParams.get('auction_id');
  const [productId, setProductId] = useState(urlProductId);
  const [showAuctionModal, setShowAuctionModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  // Get data from Redux state
  const { vehicleDetails, offer, offerStatus, userExists, loading, error, userInfo } = useSelector((state) => state.carDetailsAndQuestions);
  const userState = useSelector((state) => state.user.user);
  
  // Check if we have the necessary data
  const hasVehicleData = vehicleDetails && Object.keys(vehicleDetails).length > 0;
  const hasOfferData = offer && offer.offerAmount;
  
  // Check if user exists from the offer response
  // const userExists = offer?.userInfo?.user_exists;
  const isUserLoggedIn = Boolean(userState && userState.id);

  // Debug logging
  useEffect(() => {
    console.log('ReviewPageById Debug:', {
      searchParams: searchParams.toString(),
      productId,
      allParams: Object.fromEntries(searchParams.entries()),
      vehicleDetails,
      offer,
      userState,
      isUserLoggedIn,
      userExists,
      userInfo,
      userInfoEmail: userInfo?.user_email
    });
  }, [searchParams, productId, vehicleDetails, offer, userState, isUserLoggedIn, userExists, userInfo]);

  // Update productId when URL changes
  useEffect(() => {
    if (urlProductId && urlProductId !== productId) {
      setProductId(urlProductId);
    }
  }, [urlProductId, productId]);

  // Fetch offer data when component mounts
  useEffect(() => {
    if (productId) {
      console.log('Dispatching getOfferByProductId with:', productId);
      dispatch(getOfferByProductId(productId));
      console.log("isUserLoggedIn", isUserLoggedIn);
      // Hide the query parameter from URL immediately
      navigate('/review', { replace: true });
    } else {
      console.log('No productId found in URL parameters');
    }
  }, [dispatch, productId, navigate]);
  


  const handleLaunchAuction = () => {
    // setShowAuctionModal(true);
    navigate('/local-auction');
  };

  const handleAuctionModalClose = () => {
    setShowAuctionModal(false);
  };

  const handleLoginModalClose = () => {
    setShowLoginModal(false);
  };

  const handleGoBack = () => {
    navigate('/condition-assessment');
  };

  // Show loading state if data is not available
  if (loading || offerStatus === 'loading') {
    return <ReviewPageSkeleton />;
  }

  // Show error state if there's an error
  if (error || offerStatus === 'failed') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">Error Loading Offer</h3>
          <p className="text-slate-600 mb-4">{error || 'Failed to load offer data'}</p>
          <button
            onClick={() => productId && dispatch(getOfferByProductId(productId))}
            className="cursor-pointer inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-6 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:scale-[1.02] hover:shadow-xl"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // If no productId, show the original ReviewPage content
  if (!productId) {
    return <ReviewPage />;
  }

  // Show loading state if no data is available yet
  if (!hasVehicleData && !hasOfferData) {
    return <ReviewPageSkeleton />;
  }

  return (
    <>
      <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100 pt-20 md:pt-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8 sm:py-12">
          
          {/* Congratulations Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <Trophy className="h-8 w-8 sm:h-12 sm:w-12 text-yellow-500" />
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold text-slate-900">
                Congratulations!
              </h2>
              <Sparkles className="h-8 w-8 sm:h-12 sm:w-12 text-yellow-500" />
            </div>
          </motion.div>

          {/* Main Offer Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 p-4 sm:p-8 md:p-12 mb-6 sm:mb-8"
          >
            {/* Vehicle Details */}
            <div className="text-center mb-6 sm:mb-8">
              <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <Car className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                <h2 className="text-xl sm:text-3xl md:text-4xl font-bold text-slate-900">
                  {vehicleDetails.modelyear || vehicleDetails.year || 'N/A'} {vehicleDetails.make || 'Unknown'} {vehicleDetails.model || 'Vehicle'}
                </h2>
              </div>
              
              <div className="flex items-center justify-center gap-4 sm:gap-6 text-sm sm:text-lg text-slate-600 mb-6 sm:mb-8">
                <div className="flex items-center gap-2">
                  <span>Mileage: {vehicleDetails.mileage || vehicleDetails.mileage_km || 'N/A'} km</span>
                </div>
                {vehicleDetails.year && (
                  <div className="flex items-center gap-2">
                    <span>Year: {vehicleDetails.year}</span>
                  </div>
                )}
                {vehicleDetails.exteriorColor && (
                  <div className="flex items-center gap-2">
                    <span>Color: {vehicleDetails.exteriorColor}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Offer Amount - Highlighted */}
            <div className="text-center mb-6 sm:mb-8">
              <div className="inline-block bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl sm:rounded-2xl p-4 sm:p-8">
                <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2">
                  <Star className="h-4 w-4 sm:h-6 sm:w-6 text-green-600" />
                  <span className="text-sm sm:text-lg font-semibold text-green-800">Your Instant Offer</span>
                </div>
                <div className="text-3xl sm:text-5xl md:text-6xl font-bold text-green-600 mb-2">
                  ${hasOfferData ? offer.offerAmount.toLocaleString() : '0'}
                </div>
                <p className="text-xs sm:text-sm text-green-700">Valid for 7 days</p>
              </div>
            </div>


            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              {/* Show login button if user doesn't exist and is not logged in */}
              {/* {
                userExists && !isUserLoggedIn && (
                  <motion.button
                  onClick={() => setShowLoginModal(true)}
                  className="cursor-pointer inline-flex h-10 sm:h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-6 sm:px-8 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:scale-[1.02] hover:shadow-xl"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <User className="h-3 w-3 sm:h-4 sm:w-4" />
                  Login to Continue
                </motion.button>
                )
              }

              {
                userExists && isUserLoggedIn && (
                  <motion.button
                    onClick={handleLaunchAuction}
                    className="cursor-pointer inline-flex h-10 sm:h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#f6851f] to-[#e63946] px-6 sm:px-8 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:scale-[1.02] hover:shadow-xl"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Camera className="h-3 w-3 sm:h-4 sm:w-4" />
                    Auction your ride
                  </motion.button>
                )
              }
              {
                !userExists && (
                  <motion.button
                    onClick={handleLaunchAuction}
                    className="cursor-pointer inline-flex h-10 sm:h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#f6851f] to-[#e63946] px-6 sm:px-8 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:scale-[1.02] hover:shadow-xl"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Camera className="h-3 w-3 sm:h-4 sm:w-4" />
                    Auction your ride
                  </motion.button>
                )
              }  */}
              {isUserLoggedIn === true ? (
                <motion.button
                  onClick={handleLaunchAuction}
                  className="cursor-pointer inline-flex h-10 sm:h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#f6851f] to-[#e63946] px-6 sm:px-8 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:scale-[1.02] hover:shadow-xl"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Camera className="h-3 w-3 sm:h-4 sm:w-4" />
                  Auction your ride
                </motion.button>
              ) : (
                <motion.button
                  onClick={() => setShowLoginModal(true)}
                  className="cursor-pointer inline-flex h-10 sm:h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-6 sm:px-8 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:scale-[1.02] hover:shadow-xl"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <User className="h-3 w-3 sm:h-4 sm:w-4" />
                  Login to Continue
                </motion.button>
              )}
            </div>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-wrap justify-center items-center gap-4 sm:gap-8 text-slate-500"
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm">Secure Transaction</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm">Verified Dealers</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm">Best Price Guarantee</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Auction Selection Modal */}
      <AuctionSelectionModal
        isOpen={showAuctionModal}
        onClose={handleAuctionModalClose}
      />

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={handleLoginModalClose}
        title="Login to Continue"
        description="Please login to access your offer and continue with the auction process"
      />
    </>
  );
}
