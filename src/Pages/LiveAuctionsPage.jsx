import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Car,
  Clock,
  Users,
  DollarSign,
  Eye,
  MoreVertical,
  Play,
  Pause,
  RefreshCw,
  AlertCircle,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronDown,
  Search,
  X,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { formatCurrency, formatTimeRemaining } from "../lib/utils";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchLiveAuctions,
  fetchDashboardSummary,
  acceptBid,
  rejectBid,
  clearBidOperationStates,
  selectLiveAuctions,
  selectDashboardSummary,
  selectOffersLoading,
  selectOffersError,
  selectHasAuctions,
  selectBidOperationLoading,
  selectBidOperationError,
  selectBidOperationSuccess,
} from "../redux/slices/offersSlice";
import { useSearch } from "../context/SearchContext";
import LiveAuctionsSkeleton from "../components/skeletons/LiveAuctionsSkeleton";
import LiveAuctionsSortingSkeleton from "@/components/skeletons/LiveAuctionsSortingSkeleton";
import LoadMore from "../components/ui/load-more";
import useLoadMore from "../hooks/useLoadMore";
import BidConfirmationModal from "../components/ui/BidConfirmationModal";
import BidsModal from "../components/ui/BidsModal";
import StatsCards from "../components/ui/StatsCards";
import { Carousel, CarouselContent, CarouselItem, CarouselDots } from "../components/ui/carousel";
import Modal from "@/components/ui/modal";

const LiveAuctionsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const liveAuctionsData = useSelector(selectLiveAuctions);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dashboardSummary = useSelector(selectDashboardSummary);
  const loading = useSelector(selectOffersLoading);
  const error = useSelector(selectOffersError);
  const hasAuctions = useSelector(selectHasAuctions);
  const bidOperationLoading = useSelector(selectBidOperationLoading);
  const bidOperationError = useSelector(selectBidOperationError);
  const bidOperationSuccess = useSelector(selectBidOperationSuccess);

  // Search context
  const { getSearchResults, searchQuery, clearSearch } = useSearch();

  // Sorting state
  const [sortBy, setSortBy] = useState("time-asc");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSorting, setIsSorting] = useState(false);
  const [sortProgress, setSortProgress] = useState(0);
  const dropdownRef = useRef(null);

  // Load more configuration
  const itemsPerPage = 6;

  // Transform API data to match component structure
  const transformAuctionsData = (auctions) => {
    if (!auctions || !Array.isArray(auctions)) return [];

    return auctions.map((auction) => {
      // Find the highest active bid (not expired, not accepted, status pending)
      const activeBids =
        auction.bid?.filter(
          (bid) =>
            !bid.is_expired && !bid.is_accepted && bid.status === "pending"
        ) || [];

      const highestBid = activeBids.reduce(
        (max, bid) =>
          parseFloat(bid.amount) > parseFloat(max.amount) ? bid : max,
        activeBids[0] || { amount: "0" }
      );

      // Calculate time remaining from remaining_seconds
      const timeRemaining = Date.now() + auction.remaining_seconds * 1000;

      // Check if auction has any accepted bids
      const hasAcceptedBid =
        auction.bid?.some((bid) => bid.is_accepted) || false;

      return {
        id: auction.product_id?.toString() || "unknown",
        product_id: auction.product_id, // Keep original product_id for navigation
        vehicle: `${auction.year || "N/A"} ${auction.make || "Unknown"} ${auction.model || "Vehicle"
          }`,
        year: parseInt(auction.year) || 0,
        make: auction.make || "Unknown",
        model: auction.model || "Unknown",
        trim: auction.trim || "N/A",
        vin: auction.vin || "N/A",
        mileage: "N/A", // Not provided in API
        currentBid: parseFloat(highestBid?.amount || auction.cash_offer || "0"),
        timeRemaining: timeRemaining,
        bidCount: activeBids.length,
        totalBids: auction.bid?.length || 0,
        highestBidder: highestBid?.bidder_display_name || "No Active Bids",
        status: hasAcceptedBid ? "accepted" : "live",
        images: auction.images && auction.images.length > 0
          ? auction.images.map(img => img.url)
          : auction.image_url
            ? [auction.image_url]
            : ["/api/placeholder/400/300"],
        description: auction.title || "Vehicle description not available",
        cashOffer: parseFloat(auction.cash_offer || "0"),
        cashOfferExpires: auction.cash_offer_expires_in || "",
        auctionEndsAt: auction.auction_ends_at || "",
        inWorkingHours: auction.in_working_hours || false,
        isSentToSalesforce: auction.is_sent_to_salesforce || "",
        bids: auction.bid || [],
        highestBidData: highestBid,
        hasAcceptedBid: hasAcceptedBid,
      };
    });
  };

  // Get search results for live auctions
  const searchResults = getSearchResults("liveAuctions");
  const allAuctions = transformAuctionsData(searchResults);

  // Filter out auctions with accepted bids, but show auctions with rejected bids
  const auctions = allAuctions.filter((auction) => !auction.hasAcceptedBid);

  useEffect(() => {
    dispatch(fetchDashboardSummary());
    dispatch(fetchLiveAuctions());
  }, [dispatch]);

  // Real-time countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Handle bid operation success
  useEffect(() => {
    if (bidOperationSuccess) {
      // Refresh live auctions to get updated data
      dispatch(fetchLiveAuctions());

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [selectedAuction, setSelectedAuction] = useState(null);
  const [isActionDropdownOpen, setIsActionDropdownOpen] = useState(false);
  const [isBidsModalOpen, setIsBidsModalOpen] = useState(false);
  const [selectedAuctionBids, setSelectedAuctionBids] = useState(null);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [confirmationData, setConfirmationData] = useState(null);
  const [currentTime, setCurrentTime] = useState(Date.now());

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

  const dropdownVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.2, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: -10,
      transition: { duration: 0.15, ease: "easeIn" },
    },
  };

  const dropdownItemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.2, ease: "easeOut" },
    },
  };

  // Sort options
  const sortOptions = [
    {
      value: "time-asc",
      label: "Ending Soon",
      icon: Clock,
      description: "Shortest time remaining",
    },
    {
      value: "time-desc",
      label: "Ending Later",
      icon: Clock,
      description: "Longest time remaining",
    },
    {
      value: "amount-desc",
      label: "Highest Bid",
      icon: ArrowDown,
      description: "Highest to lowest",
    },
    {
      value: "amount-asc",
      label: "Lowest Bid",
      icon: ArrowUp,
      description: "Lowest to highest",
    },
    {
      value: "bids-desc",
      label: "Most Bids",
      icon: Users,
      description: "Most active auctions",
    },
    {
      value: "bids-asc",
      label: "Least Bids",
      icon: Users,
      description: "Least active auctions",
    },
  ];

  // Get current selected option
  const selectedOption =
    sortOptions.find((option) => option.value === sortBy) || sortOptions[0];

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
      setSortProgress((prev) => {
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

  // Sort auctions based on selected options
  const sortedAuctions = useMemo(() => {
    if (!auctions || auctions.length === 0) return [];

    // Sort the auctions
    return [...auctions].sort((a, b) => {
      switch (sortBy) {
        case "time-asc":
          return a.timeRemaining - b.timeRemaining;
        case "time-desc":
          return b.timeRemaining - a.timeRemaining;
        case "amount-desc":
          return b.currentBid - a.currentBid;
        case "amount-asc":
          return a.currentBid - b.currentBid;
        case "bids-desc":
          return b.bidCount - a.bidCount;
        case "bids-asc":
          return a.bidCount - b.bidCount;
        default:
          return 0;
      }
    });
  }, [auctions, sortBy]);

  // Use load more hook
  const {
    paginatedItems: paginatedAuctions,
    hasMoreItems,
    remainingItems,
    isLoadingMore,
    handleLoadMore,
  } = useLoadMore(sortedAuctions, itemsPerPage);

  // Debug logging
  // console.log('LiveAuctions Debug:', {
  //   auctionsLength: auctions.length,
  //   sortedAuctionsLength: sortedAuctions.length,
  //   paginatedAuctionsLength: paginatedAuctions.length,
  //   hasMoreItems,
  //   remainingItems,
  //   itemsPerPage
  // });

  const handleEndAuction = (auctionId) => {
    setAuctions((prev) =>
      prev.map((auction) =>
        auction.id === auctionId ? { ...auction, status: "ended" } : auction
      )
    );
    setIsActionDropdownOpen(false);
  };

  const handlePauseAuction = (auctionId) => {
    setAuctions((prev) =>
      prev.map((auction) =>
        auction.id === auctionId ? { ...auction, status: "paused" } : auction
      )
    );
    setIsActionDropdownOpen(false);
  };

  const handleViewDetails = (auctionId) => {
    setSelectedAuction(auctionId);
    setIsActionDropdownOpen(false);
  };

  const handleViewCarDetails = (productId) => {
    navigate("/car-details", { state: { productId } });
  };

  const handleViewAllBids = (auction) => {
    setSelectedAuctionBids(auction);
    setIsBidsModalOpen(true);
  };

  const handleAcceptBid = async (bid) => {
    const bidData = {
      bidId: bid.id,
      productId: selectedAuctionBids?.id,
      bidderId: bid.bidder_id,
    };

    try {
      await dispatch(acceptBid(bidData)).unwrap();
      // Refresh the bids data after successful action
      dispatch(fetchLiveAuctions());
    } catch (error) {
      console.error("Error accepting bid:", error);
    }
  };

  // Handle accepting top bid directly from card
  const handleAcceptTopBid = (auction) => {
    if (!auction.highestBidData) {
      console.error("No highest bid data available");
      return;
    }

    // Set the confirmation data and open the modal
    setConfirmationData({
      bid: auction.highestBidData,
      action: "accept",
    });
    setSelectedAuctionBids(auction);
    setIsConfirmationModalOpen(true);
  };

  // Cash offers cannot be accepted through this interface
  // This function is kept for potential future use but does nothing
  const handleAcceptCashOffer = (auction) => {
    console.log('Cash offers cannot be accepted through this interface');
    // Cash offers are handled separately and cannot be accepted through the bid confirmation modal
  };

  const handleRejectBid = async (bid) => {
    const bidData = {
      bidId: bid.id,
      productId: selectedAuctionBids?.id,
      bidderId: bid.bidder_id,
    };

    try {
      await dispatch(rejectBid(bidData)).unwrap();
      // Refresh the bids data after successful action
      dispatch(fetchLiveAuctions());
    } catch (error) {
      console.error("Error rejecting bid:", error);
    }
  };

  const handleConfirmBidAction = async () => {
    if (!confirmationData) return;

    const { bid, action } = confirmationData;
    const bidData = {
      bidId: bid.id,
      productId: selectedAuctionBids?.id,
      bidderId: bid.bidder_id,
    };

    try {
      if (action === "accept") {
        await dispatch(acceptBid(bidData)).unwrap();
      } else if (action === "reject") {
        await dispatch(rejectBid(bidData)).unwrap();
      }

      // Close modals and reset state on success
      setIsConfirmationModalOpen(false);
      setIsBidsModalOpen(false);
      setConfirmationData(null);
    } catch (error) {
      console.error(`Error ${action}ing bid:`, error);
      // Error is handled by Redux state, no need to do anything here
    }
  };

  const handleCloseConfirmationModal = () => {
    if (!bidOperationLoading) {
      setIsConfirmationModalOpen(false);
      setConfirmationData(null);
      // Clear any bid operation states
      dispatch(clearBidOperationStates());
    }
  };

  const toggleDropdown = (auctionId) => {
    setSelectedAuction(auctionId);
    setIsActionDropdownOpen((prev) =>
      prev && selectedAuction === auctionId ? false : true
    );
  };

  const handleClickOutside = (e) => {
    if (!e.target.closest(".dropdown-container")) {
      setIsActionDropdownOpen(false);
    }
  };

  // Loading state
  if (loading) {
    return <LiveAuctionsSkeleton />;
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
              <h3 className="text-xl font-semibold text-neutral-800 mb-2">
                Error Loading Auctions
              </h3>
              <p className="text-neutral-600 mb-4">{error}</p>
              <button
                onClick={() => dispatch(fetchLiveAuctions())}
                className="cursor-pointer btn-primary"
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
    <div className="mt-16 min-h-screen bg-gradient-hero p-8">
      <div className="max-w-8xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <motion.h1
                variants={itemVariants}
                className="text-3xl font-bold text-neutral-800 mb-2"
              >
                Live Auctions
              </motion.h1>
              <motion.p variants={itemVariants} className="text-neutral-600">
                Monitor your active auctions and manage bidding in real-time.
              </motion.p>
            </div>
            <motion.button
              variants={itemVariants}
              onClick={() => dispatch(fetchLiveAuctions())}
              disabled={loading}
              className="cursor-pointer btn-ghost flex items-center space-x-2"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
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
                    Showing {auctions.length} results for "{searchQuery}"
                  </span>
                </div>
                <button
                  onClick={clearSearch}
                  className="cursor-pointer text-primary-600 hover:text-primary-800 text-sm font-medium"
                >
                  Clear Search
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Sorting Section */}
        {!loading && !error && auctions.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mb-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-neutral-800 mb-1">
                  Live Auctions
                </h2>
                <p className="text-sm text-neutral-600">
                  {auctions.length} active auctions
                </p>
              </div>

              {/* Modern Sort Dropdown */}
              <motion.div
                variants={containerVariants}
                className="relative w-[200px]"
                ref={dropdownRef}
              >
                {/* Dropdown Trigger */}
                <button
                  onClick={() =>
                    !isSorting && setIsDropdownOpen(!isDropdownOpen)
                  }
                  disabled={isSorting}
                  className={`flex items-center gap-3 bg-white border border-neutral-200 rounded-xl px-4 py-3 hover:border-neutral-300 hover:shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent group ${isSorting ? "opacity-75 cursor-not-allowed" : "cursor-pointer"
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
                        {isSorting ? "Sorting..." : selectedOption.label}
                      </div>
                    </div>
                  </div>
                  {!isSorting && (
                    <ChevronDown
                      className={`w-4 h-4 text-neutral-400 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""
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
                            className={`cursor-pointer w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-neutral-50 transition-colors duration-150 ${isSelected
                              ? "bg-orange-50 text-orange-700"
                              : "text-neutral-700"
                              } ${index !== sortOptions.length - 1
                                ? "border-b border-neutral-100"
                                : ""
                              }`}
                          >
                            <div
                              className={`p-1.5 rounded-lg ${isSelected ? "bg-orange-100" : "bg-neutral-100"
                                }`}
                            >
                              <IconComponent
                                className={`w-3.5 h-3.5 ${isSelected
                                  ? "text-orange-600"
                                  : "text-neutral-500"
                                  }`}
                              />
                            </div>
                            <div className="flex-1">
                              <div
                                className={`text-sm font-medium ${isSelected
                                  ? "text-orange-700"
                                  : "text-neutral-700"
                                  }`}
                              >
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

        {/* Auctions Grid or Sorting Loading */}
        {!loading && !error && sortedAuctions.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {/* Sorting Loading State - Show skeleton for auctions grid */}
            {isSorting && (
              // <motion.div
              //   initial={{ opacity: 0, y: 20 }}
              //   animate={{ opacity: 1, y: 0 }}
              //   exit={{ opacity: 0, y: 20 }}
              //   transition={{ duration: 0.3, ease: "easeOut" }}
              //   className="col-span-full"
              // >
              //   <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              //     {Array.from({ length: 3 }).map((_, index) => (
              //       <div key={index} className="card overflow-hidden animate-pulse">
              //         <div className="h-48 bg-neutral-200"></div>
              //         <div className="p-6">
              //           <div className="h-6 bg-neutral-200 rounded-md w-3/4 mb-2"></div>
              //           <div className="h-4 bg-neutral-200 rounded-md w-full mb-2"></div>
              //           <div className="h-3 bg-neutral-200 rounded-md w-1/2 mb-4"></div>
              //           <div className="h-16 bg-neutral-200 rounded-lg mb-4"></div>
              //           <div className="h-4 bg-neutral-200 rounded-md w-1/3 mb-4"></div>
              //           <div className="flex space-x-4">
              //             <div className="h-10 bg-neutral-200 rounded-lg flex-1"></div>
              //             <div className="h-10 bg-neutral-200 rounded-lg flex-1"></div>
              //           </div>
              //         </div>
              //       </div>
              //     ))}
              //   </div>
              // </motion.div>
              <LiveAuctionsSortingSkeleton />
            )}

            {/* Auctions Grid - Hidden during sorting */}
            {!isSorting && (
              <>
                {paginatedAuctions.map((auction) => (
                  <motion.div
                    key={auction.id}
                    variants={itemVariants}
                    className="card hover:shadow-medium relative"
                  >
                    {/* Mobile-optimized card design */}
                    <div className="block lg:hidden">
                      {/* Car Image Carousel */}
                      <div className="relative h-48 bg-neutral-200 overflow-hidden">
                        {auction.images && auction.images.length > 0 && auction.images[0] !== "/api/placeholder/400/300" ? (
                          <Carousel className="w-full h-full">
                            <CarouselContent className="h-full">
                              {auction.images.map((image, index) => (
                                <CarouselItem key={index} className="h-full">
                                  <img
                                    src={image}
                                    alt={`${auction.vehicle} - Image ${index + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                </CarouselItem>
                              ))}
                            </CarouselContent>
                            {auction.images.length > 1 && <CarouselDots className="absolute bottom-4 left-1/2 transform -translate-x-1/2" />}
                          </Carousel>
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Car className="w-16 h-16 text-neutral-400" />
                          </div>
                        )}
                      </div>

                      {/* Card Content */}
                      <div className="p-4">
                        {/* High Demand Banner */}
                        <div className="bg-orange-100 text-orange-800 px-3 py-2 rounded-lg mb-4 text-center">
                          <span className="text-sm font-semibold">
                            Your Car is on high demand
                          </span>
                        </div>

                        {/* Offer Details */}
                        <div className="text-center mb-4">
                          <div className="text-sm text-neutral-600 mb-1">
                            #1 Offer:
                          </div>
                          <div className="text-3xl font-bold text-neutral-800 mb-1">
                            {formatCurrency(auction.currentBid)}
                          </div>
                          <div className="text-sm text-neutral-600">
                            from {auction.highestBidder || "Gotham Motors"}
                          </div>
                        </div>

                        {/* Countdown Timer */}
                        <div className="flex justify-center items-center space-x-2 mb-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-orange-500">
                              {(() => {
                                const timeDiff =
                                  auction.timeRemaining - currentTime;
                                const hours = Math.max(
                                  0,
                                  Math.floor(timeDiff / (1000 * 60 * 60))
                                );

                                return hours.toString().padStart(2, "0");
                              })()}
                            </div>
                            <div className="text-xs text-neutral-600">HRS</div>
                          </div>
                          <div className="text-orange-500 text-2xl font-bold">
                            :
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-orange-500">
                              {Math.max(
                                0,
                                Math.floor(
                                  ((auction.timeRemaining - currentTime) %
                                    (1000 * 60 * 60)) /
                                  (1000 * 60)
                                )
                              )
                                .toString()
                                .padStart(2, "0")}
                            </div>
                            <div className="text-xs text-neutral-600">MIN</div>
                          </div>
                          <div className="text-orange-500 text-2xl font-bold">
                            :
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-orange-500">
                              {Math.max(
                                0,
                                Math.floor(
                                  ((auction.timeRemaining - currentTime) %
                                    (1000 * 60)) /
                                  1000
                                )
                              )
                                .toString()
                                .padStart(2, "0")}
                            </div>
                            <div className="text-xs text-neutral-600">SEC</div>
                          </div>
                        </div>

                        {/* Call to Action Text */}
                        <div className="text-center text-sm text-neutral-600 mb-4">
                          Accept now and secure the top offer before it expires!
                        </div>

                        {/* Accept Button - Only for bids, not cash offers */}
                        {auction.bidCount > 0 && (
                          <button
                            onClick={() => handleAcceptTopBid(auction)}
                            className="cursor-pointer w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
                          >
                            Accept Top Bid
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Desktop view - keep original design */}
                    <div className="hidden lg:block ">
                      {/* Image Carousel */}
                      <div className="relative h-86 bg-neutral-200 overflow-hidden">
                        {auction.images && auction.images.length > 0 && auction.images[0] !== "/api/placeholder/400/300" ? (
                          <Carousel className="w-full h-full">
                            <CarouselContent className="h-full">
                              {auction.images.map((image, index) => (
                                <CarouselItem key={index} className="h-full">
                                  <img
                                    src={image}
                                    alt={`${auction.vehicle} - Image ${index + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                </CarouselItem>
                              ))}
                            </CarouselContent>
                            {auction.images.length > 1 && <CarouselDots className="absolute bottom-4 left-1/2 transform -translate-x-1/2" />}
                          </Carousel>
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Car className="w-16 h-16 text-neutral-400" />
                          </div>
                        )}
                        <div className="absolute top-4 left-4 z-10">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${auction.status === "accepted"
                              ? "bg-success text-white"
                              : "bg-success text-white"
                              }`}
                          >
                            {auction.status === "accepted"
                              ? "ACCEPTED"
                              : "LIVE"}
                          </span>
                        </div>
                        {/* Increase Amount Badge */}
                        {auction.currentBid > auction.cashOffer &&
                          auction.cashOffer > 0 && (
                            <div className="absolute top-4 right-4 z-10">
                              <div className="bg-success text-white px-2 py-1 rounded-full text-md font-semibold flex items-center space-x-1">
                                <ArrowUp className="w-3 h-3" />
                                <span>
                                  +
                                  {formatCurrency(
                                    auction.currentBid - auction.cashOffer
                                  )}
                                </span>
                              </div>
                            </div>
                          )}
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        {/* Vehicle Info */}
                        <div className="mb-6">
                          <h3 className="text-xl font-bold text-neutral-800 mb-2">
                            {auction.vehicle}
                          </h3>
                          <p className="text-neutral-600 text-sm mb-1">
                            {auction.description}
                          </p>
                          <p className="text-neutral-500 text-xs">
                            VIN: {auction.vin}
                          </p>
                        </div>

                        {/* Bids and Offers Badges */}
                        <div className="flex flex-wrap gap-2 mb-6">
                          {/* Highest Bid Badge */}
                          {auction.bidCount > 0 && (
                            <div className="inline-flex items-center gap-2 bg-success/10 text-success px-3 py-2 rounded-full border border-success/20">
                              <DollarSign className="w-4 h-4" />
                              <span className="text-sm font-semibold">
                                {formatCurrency(auction.currentBid)}
                              </span>
                              <span className="text-xs bg-success/20 px-2 py-0.5 rounded-full">
                                {auction.bidCount} active
                              </span>
                            </div>
                          )}

                          {/* Cash Offer Badge */}
                          <div
                            className={`inline-flex items-center gap-2 px-3 py-2 rounded-full border ${auction.cashOffer > 0
                              ? "bg-primary/10 text-primary-600 border-primary/20"
                              : "bg-neutral-100 text-neutral-500 border-neutral-200"
                              }`}
                          >
                            <DollarSign className="w-4 h-4" />
                            <span className="text-sm font-semibold">
                              {auction.cashOffer > 0
                                ? formatCurrency(auction.cashOffer)
                                : "No cash offer"}
                            </span>
                            {auction.cashOffer > 0 && (
                              <span className="text-xs bg-primary/20 px-2 py-0.5 rounded-full">
                                Instant
                              </span>
                            )}
                          </div>
                        </div>


                        {/* Time Remaining */}
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center space-x-2">
                            <Clock className="w-5 h-5 text-warning" />
                            <span className="text-sm font-semibold text-warning">
                              {formatTimeRemaining(
                                new Date(auction.timeRemaining)
                              )}
                            </span>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-neutral-500">
                              Time remaining
                            </p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex  space-x-3">
                          <button
                            onClick={() =>
                              handleViewCarDetails(auction.product_id)
                            }
                            className="cursor-pointer flex-1 py-2.5 px-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                          >
                            <span>View details</span>
                          </button>
                          {auction.totalBids > 0 ? (
                            <button
                              onClick={() => handleViewAllBids(auction)}
                              className="cursor-pointer flex-1 py-2.5 px-4 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                            >
                              <Eye className="w-4 h-4" />
                              <span>View All Bids ({auction.totalBids})</span>
                            </button>
                          ) : (
                            <div className="flex-1 py-2.5 px-4 text-sm font-medium text-neutral-500 bg-neutral-50 rounded-xl flex items-center justify-center space-x-2 border border-neutral-200">
                              <DollarSign className="w-4 h-4" />
                              <span>No bids</span>
                            </div>
                          )}

                        </div>
                      </div>
                      {/* Single Accept Button - Only for bids, not cash offers */}
                      {auction.bidCount > 0 && (
                        <div className="mb-6 mx-4">
                          <button
                            onClick={() => handleAcceptTopBid(auction)}
                            className="cursor-pointer w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                          >
                            <CheckCircle className="w-5 h-5" />
                            <span>Accept Top Bid</span>
                          </button>
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
        {!loading && !error && sortedAuctions.length > 0 && (
          <LoadMore
            items={sortedAuctions}
            itemsPerPage={itemsPerPage}
            onLoadMore={handleLoadMore}
            isLoadingMore={isLoadingMore}
            hasMoreItems={hasMoreItems}
            remainingItems={remainingItems}
            SkeletonComponent={LiveAuctionsSortingSkeleton}
            buttonText="Load More Auctions"
            loadingText="Loading auctions..."
            showRemainingCount={true}
          />
        )}

        {/* Empty State */}
        {!loading && !error && (!hasAuctions || auctions.length === 0) && (
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
                  <Car className="w-8 h-8 text-primary-500" />
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
                  No Active Auctions
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
                  onClick={() => {
                    setIsModalOpen(true)
                  }}
                  className="cursor-pointer w-60 px-4 h-16 group relative bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:shadow-xl hover:shadow-primary-500/25 focus:outline-none focus:ring-4 focus:ring-primary-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <div className="flex items-center justify-between">
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
      {isActionDropdownOpen && (
        <motion.div
          className="fixed inset-0 z-10"
          onClick={handleClickOutside}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}

      {/* Bids Modal */}
      <BidsModal
        isOpen={isBidsModalOpen}
        onClose={() => setIsBidsModalOpen(false)}
        auctionData={selectedAuctionBids}
        isLoading={loading}
        error={error}
      />

      {/* Start new auction Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Start new auction"
        description="Enter your vehicle details to start the auction process"
      />

      {/* Bid Confirmation Modal */}
      <BidConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={handleCloseConfirmationModal}
        onConfirm={handleConfirmBidAction}
        action={confirmationData?.action}
        bidData={confirmationData?.bid}
        isLoading={bidOperationLoading}
        error={bidOperationError}
        success={bidOperationSuccess}
      />
    </div>
  );
};

export default LiveAuctionsPage;
