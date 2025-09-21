import { useState, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, Clock, DollarSign, Users, CheckCircle, X, Eye, AlertCircle, RefreshCw, ArrowUpDown, ArrowUp, ArrowDown, ChevronDown, Search } from 'lucide-react';
import { formatCurrency, formatDate, formatTimeRemaining } from '../lib/utils';
import {
  fetchPendingOffers,
  fetchDashboardSummary,
  acceptBid,
  rejectBid,
  clearBidOperationStates,
  selectPendingOffers,
  selectDashboardSummary,
  selectOffersLoading,
  selectOffersError,
  selectBidOperationLoading,
  selectBidOperationError,
  selectBidOperationSuccess
} from '../redux/slices/offersSlice';
import { useSearch } from '../context/SearchContext';
import PendingOffersSkeleton from '../components/skeletons/PendingOffersSkeleton';
import OffersListSkeleton from '../components/skeletons/OffersListSkeleton';
import LoadMore from '../components/ui/load-more';
import useLoadMore from '../hooks/useLoadMore';
import BidConfirmationModal from '../components/ui/BidConfirmationModal';
import BidsModal from '../components/ui/BidsModal';
import StatsCards from '../components/ui/StatsCards';
import { useNavigate } from 'react-router-dom';

const PendingOffersPage = () => {
  const dispatch = useDispatch();
  const pendingOffersData = useSelector(selectPendingOffers);
  const dashboardSummary = useSelector(selectDashboardSummary);
  const loading = useSelector(selectOffersLoading);
  const error = useSelector(selectOffersError);
  const bidOperationLoading = useSelector(selectBidOperationLoading);
  const bidOperationError = useSelector(selectBidOperationError);
  const bidOperationSuccess = useSelector(selectBidOperationSuccess);

  // Search context
  const { getSearchResults, searchQuery, clearSearch } = useSearch();

  // Sorting state
  const [sortBy, setSortBy] = useState('date-desc');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSorting, setIsSorting] = useState(false);
  const [sortProgress, setSortProgress] = useState(0);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  // Load more configuration
  const itemsPerPage = 5;

  // Transform API data to match component structure
  const transformOffersData = (offers) => {
    if (!offers || !Array.isArray(offers)) return [];

    return offers.map(offer => {
      // Find the highest bid from active bids only
      const activeBids = offer.bid?.filter(bid => !bid.is_expired && bid.status === 'pending') || [];
      const highestBid = activeBids.reduce((max, bid) =>
        parseFloat(bid.amount) > parseFloat(max.amount) ? bid : max,
        activeBids[0] || { amount: '0' }
      );

      // Check if any bid is urgent (expires soon)
      const now = new Date();
      const urgentBid = activeBids.find(bid => {
        const endTime = new Date(bid.end_timestamp);
        const timeDiff = endTime - now;
        return timeDiff > 0 && timeDiff < 2 * 60 * 60 * 1000; // Less than 2 hours
      });

      // Parse auction end time safely
      let auctionEndTime;
      try {
        auctionEndTime = new Date(offer.auction_ends_at);
        if (isNaN(auctionEndTime.getTime())) {
          auctionEndTime = new Date();
        }
      } catch (e) {
        auctionEndTime = new Date();
      }

      return {
        id: offer.product_id?.toString() || 'unknown',
        vehicle: `${offer.year || 'N/A'} ${offer.make || 'Unknown'} ${offer.model || 'Vehicle'}`,
        year: parseInt(offer.year) || 0,
        make: offer.make || 'Unknown',
        model: offer.model || 'Unknown',
        trim: offer.trim || 'N/A',
        vin: offer.vin || 'N/A',
        mileage: 'N/A', // Not provided in API
        highestBid: parseFloat(highestBid?.amount || '0'),
        bidCount: activeBids.length,
        timeRemaining: auctionEndTime,
        status: urgentBid ? 'urgent' : 'pending',
        dealer: highestBid?.bidder_display_name || 'No Active Bids',
        dealerRating: 4.5, // Not provided in API, using default
        dealerBidCount: activeBids.filter(bid => bid.bidder_id === highestBid?.bidder_id).length,
        images: offer.images && offer.images.length > 0
          ? offer.images.map(img => img.url)
          : offer.image_url
            ? [offer.image_url]
            : ['/api/placeholder/400/300'],
        description: offer.title || 'Vehicle description not available',
        auctionEndTime: auctionEndTime,
        cashOffer: parseFloat(offer.cash_offer || '0'),
        auctionStatus: offer.auction_status || 'unknown',
        bids: offer.bid || [],
        highestBidData: highestBid,
        totalBids: offer.bid?.length || 0
      };
    });
  };

  // Get search results for pending offers
  const searchResults = getSearchResults('pendingOffers');
  const pendingOffers = transformOffersData(searchResults);

  // Modal state
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [isBidsModalOpen, setIsBidsModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [confirmationData, setConfirmationData] = useState(null);

  useEffect(() => {
    dispatch(fetchDashboardSummary());
    dispatch(fetchPendingOffers());
  }, [dispatch]);

  // Handle bid operation success
  useEffect(() => {
    if (bidOperationSuccess) {
      // Refresh pending offers to get updated data
      dispatch(fetchPendingOffers());

      // Auto-close modal after a short delay to show success message
      const timer = setTimeout(() => {
        setIsConfirmationModalOpen(false);
        setIsBidsModalOpen(false);
        setConfirmationData(null);
        dispatch(clearBidOperationStates());
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [bidOperationSuccess, dispatch]);

  useEffect(() => {
    console.log("Selected offer:", selectedOffer);
  }, [selectedOffer]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleAcceptOffer = (offer) => {
    // Only accept actual bids, not cash offers
    const hasActiveBids = offer.bidCount > 0;

    // Check if there are active bids to accept
    if (!hasActiveBids) {
      console.warn('No active bids to accept for:', offer.id);
      return;
    }

    // Accept highest bid only
    const bidToAccept = offer.highestBidData || {
      id: 'highest-bid',
      amount: offer.highestBid.toString(),
      bidder_display_name: offer.dealer,
      bidder_id: offer.highestBidData?.bidder_id || 'unknown',
      notes: 'Highest active bid'
    };

    setConfirmationData({ bid: bidToAccept, action: 'accept', offer: offer });
    setIsConfirmationModalOpen(true);
  };

  const handleRejectOffer = (offer) => {
    // Only reject actual bids, not cash offers
    const hasActiveBids = offer.bidCount > 0;

    // Check if there are active bids to reject
    if (!hasActiveBids) {
      console.warn('No active bids to reject for:', offer.id);
      return;
    }

    // Reject highest bid only
    const bidToReject = offer.highestBidData || {
      id: 'highest-bid',
      amount: offer.highestBid.toString(),
      bidder_display_name: offer.dealer,
      bidder_id: offer.highestBidData?.bidder_id || 'unknown',
      notes: 'Highest active bid'
    };

    setConfirmationData({ bid: bidToReject, action: 'reject', offer: offer });
    setIsConfirmationModalOpen(true);
  };

  // Handle show bids modal
  const handleShowBids = (offer) => {
    setSelectedOffer(offer);
    setIsBidsModalOpen(true);
  };

  // Close bids modal
  const handleCloseBidsModal = () => {
    setIsBidsModalOpen(false);
    setSelectedOffer(null);
  };



  // Handle close confirmation modal
  const handleCloseConfirmationModal = () => {
    setIsConfirmationModalOpen(false);
    setConfirmationData(null);
    // Clear any bid operation states
    dispatch(clearBidOperationStates());
  };

  // Sort options
  const sortOptions = [
    { value: 'date-desc', label: 'Newest First', icon: ArrowDown, description: 'Most recent offers' },
    { value: 'date-asc', label: 'Oldest First', icon: ArrowUp, description: 'Earliest offers' },
    { value: 'amount-desc', label: 'Highest Amount', icon: ArrowDown, description: 'Highest to lowest' },
    { value: 'amount-asc', label: 'Lowest Amount', icon: ArrowUp, description: 'Lowest to highest' },
    { value: 'urgent-first', label: 'Urgent First', icon: AlertCircle, description: 'Urgent offers first' },
  ];

  // Get current selected option
  const selectedOption = sortOptions.find(option => option.value === sortBy) || sortOptions[0];

  // Handle sort selection with loading animation
  const handleSortSelect = (value) => {
    if (value === sortBy) {
      setIsDropdownOpen(false);
      return;
    }

    setIsSorting(true);
    setSortProgress(0);
    setIsDropdownOpen(false);

    // Simulate sorting process with random delay and progress
    const randomDelay = Math.random() * 1000 + 500; // 500-1500ms
    const progressInterval = 50; // Update progress every 50ms

    const progressTimer = setInterval(() => {
      setSortProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressTimer);
          return 90;
        }
        return prev + Math.random() * 15;
      });
    }, progressInterval);

    setTimeout(() => {
      clearInterval(progressTimer);
      setSortProgress(100);
      setSortBy(value);

      // Reset after a short delay
      setTimeout(() => {
        setIsSorting(false);
        setSortProgress(0);
      }, 200);
    }, randomDelay);
  };

  // Sort offers based on selected options
  const sortedOffers = useMemo(() => {
    if (!pendingOffers || pendingOffers.length === 0) return [];

    // Sort the offers
    return [...pendingOffers].sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return b.auctionEndTime - a.auctionEndTime;
        case 'date-asc':
          return a.auctionEndTime - b.auctionEndTime;
        case 'amount-desc':
          return Math.max(b.highestBid, b.cashOffer) - Math.max(a.highestBid, a.cashOffer);
        case 'amount-asc':
          return Math.max(a.highestBid, a.cashOffer) - Math.max(b.highestBid, b.cashOffer);
        case 'urgent-first':
          if (a.status === 'urgent' && b.status !== 'urgent') return -1;
          if (b.status === 'urgent' && a.status !== 'urgent') return 1;
          return b.auctionEndTime - a.auctionEndTime; // Then by date
        default:
          return 0;
      }
    });
  }, [pendingOffers, sortBy]);

  // Use load more hook
  const {
    paginatedItems: paginatedOffers,
    hasMoreItems,
    remainingItems,
    isLoadingMore,
    handleLoadMore
  } = useLoadMore(sortedOffers, itemsPerPage);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'urgent':
        return 'bg-error/10 text-error border-error/20';
      case 'pending':
        return 'bg-warning/10 text-warning border-warning/20';
      default:
        return 'bg-neutral-100 text-neutral-600 border-neutral-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'urgent':
        return <AlertCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  // Loading state
  if (loading) {
    return <PendingOffersSkeleton />;
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-hero p-8">
        <div className="max-w-8xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-error" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-800 mb-2">Error Loading Offers</h3>
              <p className="text-neutral-600 mb-4">{error}</p>
              <button
                onClick={() => dispatch(fetchPendingOffers())}
                className="btn-primary"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-16 min-h-screen bg-gradient-hero p-8 ">
      <div className="max-w-8xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <motion.h1 variants={itemVariants} className="text-3xl font-bold text-neutral-800 mb-2">
                Pending Offers
              </motion.h1>
              <motion.p variants={itemVariants} className="text-neutral-600">
                Review and respond to offers from dealers on your vehicles.
              </motion.p>
            </div>
            <motion.button
              variants={itemVariants}
              onClick={() => dispatch(fetchPendingOffers())}
              disabled={loading}
              className="cursor-pointer btn-ghost flex items-center space-x-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <StatsCards
          data={dashboardSummary}
          loading={loading}
          className="mb-8"
          showAcceptedOffers={true}
          showActiveAuctions={true}
          showTotalVehicles={true}
          showUpcomingAppointments={true}
          showTotalBidValue={true}
        />


        {/* Search Indicator */}
        {searchQuery && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mb-4"
          >
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Search className="w-5 h-5 text-primary-600" />
                  <span className="text-sm font-medium text-primary-800">
                    Showing {pendingOffers.length} results for "{searchQuery}"
                  </span>
                </div>
                <button
                  onClick={clearSearch}
                  className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                >
                  Clear Search
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Sorting Section */}
        {!loading && !error && searchResults.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mb-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-neutral-800 mb-1">Pending Offers</h2>
                <p className="text-sm text-neutral-600">{searchResults.length} offers pending review</p>
              </div>

              {/* Modern Sort Dropdown */}
              <motion.div
                variants={containerVariants}
                className="relative w-[200px]"
                ref={dropdownRef}
              >
                {/* Dropdown Trigger */}
                <button
                  onClick={() => !isSorting && setIsDropdownOpen(!isDropdownOpen)}
                  disabled={isSorting}
                  className={`cursor-pointer flex items-center gap-3 bg-white border border-neutral-200 rounded-xl px-4 py-3 hover:border-neutral-300 hover:shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent group ${isSorting ? 'opacity-75 cursor-not-allowed' : ''
                    }`}
                >
                  <div className="flex items-center gap-2">
                    {isSorting ? (
                      <RefreshCw className="w-4 h-4 text-orange-500 animate-spin" />
                    ) : (
                      <ArrowUpDown className="w-4 h-4 text-neutral-500 group-hover:text-orange-500 transition-colors" />
                    )}
                    <div className="text-left">
                      <div className="text-sm font-medium text-neutral-700">
                        {isSorting ? 'Sorting...' : selectedOption.label}
                      </div>
                    </div>
                  </div>
                  {!isSorting && (
                    <ChevronDown
                      className={`w-4 h-4 text-neutral-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''
                        }`}
                    />
                  )}
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute top-full left-0 right-0 mt-2 bg-white border border-neutral-200 rounded-xl shadow-lg z-50 overflow-hidden"
                    >
                      {sortOptions.map((option, index) => {
                        const IconComponent = option.icon;
                        const isSelected = option.value === sortBy;

                        return (
                          <button
                            key={option.value}
                            onClick={() => handleSortSelect(option.value)}
                            className={`cursor-pointer w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-neutral-50 transition-colors duration-150 ${isSelected ? 'bg-orange-50 text-orange-700' : 'text-neutral-700'
                              } ${index !== sortOptions.length - 1 ? 'border-b border-neutral-100' : ''}`}
                          >
                            <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-orange-100' : 'bg-neutral-100'
                              }`}>
                              <IconComponent className={`w-3.5 h-3.5 ${isSelected ? 'text-orange-600' : 'text-neutral-500'
                                }`} />
                            </div>
                            <div className="flex-1">
                              <div className={`text-sm font-medium ${isSelected ? 'text-orange-700' : 'text-neutral-700'
                                }`}>
                                {option.label}
                              </div>
                            </div>
                            {isSelected && (
                              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            )}
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Pending Offers List or Sorting Loading */}
        {!loading && !error && searchResults.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Sorting Loading State - Show skeleton for offers list */}
            {isSorting && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <OffersListSkeleton />
              </motion.div>
            )}

            {/* Offers List - Hidden during sorting */}
            {!isSorting && (
              <>
                {paginatedOffers.map((offer) => (
                  <motion.div
                    key={offer.id}
                    variants={itemVariants}
                    className={`card p-6 border-l-4 ${offer.status === 'urgent' ? 'border-error' : 'border-warning'
                      }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-neutral-200 rounded-lg flex items-center justify-center overflow-hidden">
                          {(() => {
                            // Extract front view image from images array, fallback to first image, then to placeholder
                            const getFrontViewImage = () => {
                              if (offer.images && offer.images.length > 0) {
                                const frontViewImage = offer.images.find(img => img.name === 'front_view');
                                return frontViewImage ? frontViewImage.url : offer.images[0];
                              }
                              return null;
                            };

                            const imageUrl = getFrontViewImage();

                            return imageUrl ? (
                              <img
                                src={imageUrl}
                                alt={offer.vehicle}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Car className="w-8 h-8 text-neutral-400" />
                            );
                          })()}
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-neutral-800">{offer.vehicle}</h3>
                          <p className="text-sm text-neutral-600">{offer.mileage} miles • {offer.description}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className="text-sm text-neutral-500">
                              {formatDate(offer.auctionEndTime)} • {offer.bidCount} active bids
                            </span>
                            {offer.totalBids > offer.bidCount && (
                              <span className="text-sm text-neutral-400">
                                ({offer.totalBids - offer.bidCount} expired)
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        {/* Highest Bid or Cash Offer Badge */}
                        <div className="mb-2">
                          {(() => {
                            const hasActiveBids = offer.bidCount > 0;
                            const cashOfferHigher = offer.cashOffer > offer.highestBid;
                            const showCashOffer = !hasActiveBids || cashOfferHigher;

                            return (
                              <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-semibold ${showCashOffer
                                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                : 'bg-green-100 text-green-800 border border-green-200'
                                }`}>
                                <DollarSign className="w-4 h-4" />
                                <span>
                                  {showCashOffer
                                    ? `Cash: ${formatCurrency(offer.cashOffer)}`
                                    : `Highest: ${formatCurrency(offer.highestBid)}`
                                  }
                                </span>
                              </div>
                            );
                          })()}
                        </div>

                        <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(offer.status)}`}>
                          {getStatusIcon(offer.status)}
                          <span className="capitalize">{offer.status}</span>
                        </div>
                      </div>
                    </div>

                    {/* Dealer Information */}
                    <div className="bg-neutral-50 rounded-lg p-4 mb-4">
                      <h4 className="font-semibold text-neutral-800 mb-2">
                        {offer.bidCount > 0 ? 'Highest Bidder' : 'Offer Information'}
                      </h4>
                      <div className="flex items-center justify-between">
                        <div>
                          {offer.bidCount > 0 ? (
                            <>
                              <p className="font-medium text-neutral-700">{offer.dealer}</p>
                              <div className="flex items-center space-x-2 text-sm text-neutral-600">
                                <span>Rating: {offer.dealerRating}/5</span>
                                <span>•</span>
                                <span>{offer.dealerBidCount} bids placed</span>
                                {offer.highestBidData?.bidder_email && (
                                  <>
                                    <span>•</span>
                                    <span>{offer.highestBidData.bidder_email}</span>
                                  </>
                                )}
                              </div>
                              {offer.highestBidData?.bid_at && (
                                <p className="text-xs text-neutral-500 mt-1">
                                  Bid placed: {offer.highestBidData.bid_at.date} at {offer.highestBidData.bid_at.time}
                                </p>
                              )}
                            </>
                          ) : (
                            <>
                              <p className="font-medium text-neutral-700">
                                {offer.cashOffer > 0 ? 'Cash Offer Available' : 'No Active Bids'}
                              </p>
                              <div className="flex items-center space-x-2 text-sm text-neutral-600">
                                <span>Total Bids: {offer.totalBids}</span>
                                {offer.totalBids > 0 && (
                                  <>
                                    <span>•</span>
                                    <span className="text-warning">All expired</span>
                                  </>
                                )}
                              </div>
                              {offer.totalBids > 0 && (
                                <p className="text-xs text-neutral-500 mt-1">
                                  Previous highest bid: {formatCurrency(offer.highestBid)}
                                </p>
                              )}
                            </>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-neutral-600">Auction Status</p>
                          <p className="font-semibold text-warning">
                            {offer.auctionStatus === 'active' ? formatTimeRemaining(offer.timeRemaining) : offer.auctionStatus}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        <button onClick={() => navigate('/car-details', { state: { productId: offer.id } })} className="cursor-pointer btn-ghost flex items-center space-x-2">
                          <Eye className="w-4 h-4" />
                          <span>View Details</span>
                        </button>
                        <button
                          className="cursor-pointer btn-secondary flex items-center space-x-2"
                          onClick={() => handleShowBids(offer)}
                          disabled={offer.totalBids === 0}
                        >
                          View All Bids ({offer.totalBids})
                        </button>
                      </div>

                      {/* Show different UI based on offer status */}
                      {offer.bidCount > 0 ? (
                        // Show accept/reject buttons when there are active bids
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleRejectOffer(offer)}
                            className="cursor-pointer btn-ghost text-error hover:bg-error/10 flex items-center space-x-2"
                          >
                            <X className="w-4 h-4" />
                            <span>Reject</span>
                          </button>
                          <button
                            onClick={() => handleAcceptOffer(offer)}
                            className="btn-primary flex items-center space-x-2"
                          >
                            <CheckCircle className="w-4 h-4" />
                            <span>Accept Bid</span>
                          </button>
                        </div>
                      ) : offer.cashOffer > 0 ? (
                        // Show cash offer info when only cash offer is available
                        <div className="flex flex-col items-end space-y-2">

                          <div className="flex space-x-2">
                            <button
                              onClick={() => navigate('/car-details', { state: { productId: offer.id } })}
                              className="cursor-pointer btn-ghost text-primary hover:bg-primary/10 flex items-center space-x-2"
                            >
                              <Eye className="w-4 h-4" />
                              <span>View Details</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        // Show alternative UI when all bids are expired/rejected
                        <div className="flex flex-col items-end space-y-2">
                          <div className="flex items-center space-x-2 text-neutral-500">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm">All offers expired</span>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => navigate('/car-details', { state: { productId: offer.id } })}
                              className="cursor-pointer btn-ghost text-primary hover:bg-primary/10 flex items-center space-x-2"
                            >
                              <RefreshCw className="w-4 h-4" />
                              <span>Relist Vehicle</span>
                            </button>
                            <button
                              onClick={() => navigate('/auction')}
                              className="btn-primary flex items-center space-x-2"
                            >
                              <Car className="w-4 h-4" />
                              <span>Start New Auction</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </>
            )}
          </motion.div>
        )}

        {/* Load More Component */}
        {!loading && !error && searchResults.length > 0 && (
          <LoadMore
            items={sortedOffers}
            itemsPerPage={itemsPerPage}
            onLoadMore={handleLoadMore}
            isLoadingMore={isLoadingMore}
            hasMoreItems={hasMoreItems}
            remainingItems={remainingItems}
            SkeletonComponent={OffersListSkeleton}
            buttonText="Load More Offers"
            loadingText="Loading offers..."
            showRemainingCount={true}
          />
        )}

        {/* Empty State */}
        {!loading && !error && searchResults.length === 0 && (
          <motion.div
            variants={itemVariants}
            className="flex -mt-16 items-center justify-center min-h-[60vh]"
          >
            <div className="text-center max-w-md mx-auto">
              {/* Modern Icon Container */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative mb-4"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-primary-50 to-primary-100 rounded-3xl flex items-center justify-center mx-auto shadow-soft border border-primary-200">
                  <Clock className="w-8 h-8 text-primary-500" />
                </div>
                {/* Decorative elements */}
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-warning/20 rounded-full animate-pulse-slow"></div>
                <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-accent/20 rounded-full animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
              </motion.div>

              {/* Content */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                className="space-y-4"
              >
                <h3 className="text-2xl font-bold text-neutral-800 font-display">
                  No Pending Offers
                </h3>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
                className="flex flex-col sm:flex-row gap-4 mt-4"
              >
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  onClick={() => navigate('/auction')}
                  className="cursor-pointer w-60 px-4 h-16 group relative bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:shadow-xl hover:shadow-primary-500/25 focus:outline-none focus:ring-4 focus:ring-primary-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <div className="flex items-center justify-between ">
                    <Car className="transition-transform duration-300 group-hover:scale-110" />
                    <span className="text-md">Start New Auction</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  onClick={() => navigate('/dashboard')}
                  className="cursor-pointer w-60 px-4 h-16 group relative overflow-hidden bg-white hover:bg-neutral-50 text-neutral-700 font-semibold py-4 rounded-2xl border-2 border-neutral-200 hover:border-neutral-300 transition-all duration-300 transform hover:shadow-lg hover:shadow-neutral-500/10 focus:outline-none focus:ring-4 focus:ring-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <div className="flex items-center justify-center space-x-3">
                    <Eye className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                    <span className="text-lg">View Dashboard</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-neutral-100/0 via-neutral-100/50 to-neutral-100/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
                </motion.button>
              </motion.div>

            </div>
          </motion.div>
        )}
      </div>

      {/* Bids Modal */}
      <BidsModal
        isOpen={isBidsModalOpen}
        onClose={handleCloseBidsModal}
        auctionData={selectedOffer}
        isLoading={loading}
        error={error}
      />

      {/* Bid Confirmation Modal */}
      <BidConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={handleCloseConfirmationModal}
        action={confirmationData?.action}
        bidData={confirmationData?.bid}
        auctionData={confirmationData?.offer}
      />
    </div>
  );
};

export default PendingOffersPage;
