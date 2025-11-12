import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Car,
  Clock,
  Users,
  DollarSign,
  Eye,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronDown,
  RefreshCw,
  AlertCircle,
  Sparkles,
  Timer,
  Award,
  MapPin,
  TrendingDown,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCustomerSessionsThunk } from "../redux/reverseBidSlice";
import useLoadMore from "../../../hooks/useLoadMore";
import LoadMore from "../../../components/ui/load-more";
import LiveAuctionsSkeleton from "../../../components/skeletons/LiveAuctionsSkeleton";
import LiveAuctionsSortingSkeleton from "@/components/skeletons/LiveAuctionsSortingSkeleton";
import apiRev from "../../../lib/apiRev";

const ActiveSessionsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { customerSessions, loading } = useSelector((s) => s.reverseBid);
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Sorting state
  const [sortBy, setSortBy] = useState("time-asc");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSorting, setIsSorting] = useState(false);
  const [sortProgress, setSortProgress] = useState(0);
  const dropdownRef = useRef(null);

  // Load more configuration
  const itemsPerPage = 6;

  // Fetch sessions on mount
  useEffect(() => {
    dispatch(fetchCustomerSessionsThunk({ status: 'running', page: 1, per_page: 100 }));
  }, [dispatch]);

  // Real-time countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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

  // State for vehicle images
  const [vehicleImages, setVehicleImages] = useState({});

  // Fetch vehicle images for sessions
  useEffect(() => {
    const fetchVehicleImages = async () => {
      const sessions = customerSessions.data || [];
      const imagePromises = sessions.map(async (session) => {
        if (!session.primary_vehicle_id) return null;
        try {
          const response = await apiRev.get(`/vehicles/${session.primary_vehicle_id}`);
          if (response.data?.success && response.data?.data) {
            const vehicle = response.data.data;
            const images = vehicle.images || [];
            const primaryImage = images.find(img => img?.is_primary) || images[0];
            return {
              sessionId: session.id,
              image: primaryImage?.url || primaryImage || null
            };
          }
        } catch (err) {
          console.error(`Error fetching vehicle image for session ${session.id}:`, err);
        }
        return null;
      });

      const results = await Promise.all(imagePromises);
      const imagesMap = {};
      results.forEach(result => {
        if (result && result.sessionId) {
          imagesMap[result.sessionId] = result.image;
        }
      });
      setVehicleImages(imagesMap);
    };

    if (customerSessions.data.length > 0) {
      fetchVehicleImages();
    }
  }, [customerSessions.data]);

  // Transform API data to match component structure
  const transformSessionsData = (sessions) => {
    if (!sessions || !Array.isArray(sessions)) return [];

    return sessions.map((session) => {
      const criteria = session.criteria || {};
      const timeRemaining = session.time_remaining || {};
      
      // Calculate time remaining timestamp
      let timeRemainingTimestamp = Date.now() + (timeRemaining.seconds || 0) * 1000;
      if (session.end_at) {
        timeRemainingTimestamp = new Date(session.end_at).getTime();
      }

      // Get best offer from leaderboard
      const leaderboard = session.leaderboard || [];
      const bestOffer = leaderboard.length > 0 
        ? Math.min(...leaderboard.map(bid => parseFloat(bid.amount || 0)))
        : null;

      return {
        id: session.id?.toString() || "unknown",
        sessionId: session.id,
        vehicle: `${criteria.year || "N/A"} ${criteria.make || "Unknown"} ${criteria.model || "Vehicle"}`,
        year: parseInt(criteria.year) || 0,
        make: criteria.make || "Unknown",
        model: criteria.model || "Unknown",
        price: parseFloat(criteria.price || 0),
        zipCode: criteria.zip_code || session.zip_code || "N/A",
        currentBid: bestOffer || 0,
        timeRemaining: timeRemainingTimestamp,
        bidCount: session.total_bids || 0,
        status: session.status || "pending",
        dealerPreference: session.dealer_preference || "local",
        primaryVehicleId: session.primary_vehicle_id,
        alternativeVehicleIds: session.alternative_vehicle_ids || [],
        criteria: criteria,
        timeRemainingData: timeRemaining,
        image: vehicleImages[session.id] || null,
      };
    });
  };

  const allSessions = transformSessionsData(customerSessions.data);
  
  // Filter only running/pending sessions
  const activeSessions = allSessions.filter(
    (session) => session.status === "running" || session.status === "pending"
  );

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
      description: "Most active sessions",
    },
    {
      value: "bids-asc",
      label: "Least Bids",
      icon: Users,
      description: "Least active sessions",
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

    const randomDelay = Math.random() * 1000 + 500;
    const progressInterval = 50;

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

      setTimeout(() => {
        setIsSorting(false);
        setSortProgress(0);
      }, 200);
    }, randomDelay);
  };

  // Sort sessions based on selected options
  const sortedSessions = useMemo(() => {
    if (!activeSessions || activeSessions.length === 0) return [];

    return [...activeSessions].sort((a, b) => {
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
  }, [activeSessions, sortBy]);

  // Use load more hook
  const {
    paginatedItems: paginatedSessions,
    hasMoreItems,
    remainingItems,
    isLoadingMore,
    handleLoadMore,
  } = useLoadMore(sortedSessions, itemsPerPage);

  // Format time remaining
  const formatTimeRemaining = (timestamp) => {
    if (!timestamp) return "N/A";
    const remaining = Math.max(0, timestamp - currentTime);
    if (remaining <= 0) return "Expired";

    const hours = Math.floor(remaining / 3600000);
    const minutes = Math.floor((remaining % 3600000) / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount || amount === 0) return "$0";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Get status badge info
  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { label: "Pending", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
      running: { label: "Live", color: "bg-green-100 text-green-700 border-green-200" },
      closed: { label: "Closed", color: "bg-neutral-100 text-neutral-700 border-neutral-200" },
      cancelled: { label: "Cancelled", color: "bg-red-100 text-red-700 border-red-200" },
    };
    return statusMap[status] || statusMap.pending;
  };

  const handleViewSession = (sessionId) => {
    navigate(`/reverse-bidding/session/${sessionId}`);
  };

  const handleRefresh = () => {
    dispatch(fetchCustomerSessionsThunk({ status: 'running', page: 1, per_page: 100 }));
  };

  // Loading state
  if (loading.customerSessions && customerSessions.data.length === 0) {
    return <LiveAuctionsSkeleton />;
  }

  // Error state
  if (!loading.customerSessions && customerSessions.data.length === 0 && activeSessions.length === 0) {
    return (
      <div className="lg:mt-16 min-h-screen bg-gradient-hero px-4 sm:px-6 lg:px-8 py-8 sm:py-6 lg:py-8">
        <div className="max-w-8xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-error" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-800 mb-2">
                No Active Sessions
              </h3>
              <p className="text-neutral-600 mb-4">
                You don't have any active reverse bidding sessions at the moment.
              </p>
              <button
                onClick={() => navigate("/reverse-bidding")}
                className="cursor-pointer btn-primary"
              >
                Start New Session
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:mt-16 min-h-screen bg-gradient-hero px-4 sm:px-6 lg:px-8 py-8 sm:py-6 lg:py-8">
      <div className="max-w-8xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-6 sm:mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <motion.h1
                variants={itemVariants}
                className="text-2xl sm:text-3xl font-bold text-neutral-800 mb-2"
              >
                Active Reverse Bidding Sessions
              </motion.h1>
              <motion.p variants={itemVariants} className="text-sm sm:text-base text-neutral-600">
                Monitor your active reverse bidding sessions and track dealer offers in real-time.
              </motion.p>
            </div>
            <motion.button
              variants={itemVariants}
              onClick={handleRefresh}
              disabled={loading.customerSessions}
              className="cursor-pointer btn-ghost flex items-center justify-center sm:justify-start space-x-2 w-full sm:w-auto"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading.customerSessions ? "animate-spin" : ""}`}
              />
              <span className="text-sm sm:text-base">Refresh</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Sorting Section */}
        {!loading.customerSessions && activeSessions.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mb-4 sm:mb-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-neutral-800 mb-1">
                  Active Sessions
                </h2>
                <p className="text-xs sm:text-sm text-neutral-600">
                  {activeSessions.length} active session{activeSessions.length !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Modern Sort Dropdown */}
              <motion.div
                variants={containerVariants}
                className="relative w-full sm:w-[200px]"
                ref={dropdownRef}
              >
                <button
                  onClick={() =>
                    !isSorting && setIsDropdownOpen(!isDropdownOpen)
                  }
                  disabled={isSorting}
                  className={`flex items-center gap-2 sm:gap-3 bg-white border border-neutral-200 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 hover:border-neutral-300 hover:shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent group ${
                    isSorting ? "opacity-75 cursor-not-allowed" : "cursor-pointer"
                  }`}
                >
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-1">
                    {isSorting ? (
                      <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-500 animate-spin" />
                    ) : (
                      <ArrowUpDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-500 group-hover:text-orange-500 transition-colors" />
                    )}
                    <div className="text-left flex-1 min-w-0">
                      <div className="text-xs sm:text-sm font-medium text-neutral-700 truncate">
                        {isSorting ? "Sorting..." : selectedOption.label}
                      </div>
                    </div>
                  </div>
                  {!isSorting && (
                    <ChevronDown
                      className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-400 transition-transform duration-200 flex-shrink-0 ${
                        isDropdownOpen ? "rotate-180" : ""
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
                      className="absolute top-full left-0 right-0 mt-2 bg-white border border-neutral-200 rounded-xl shadow-lg z-50 overflow-hidden max-h-80 overflow-y-auto"
                    >
                      {sortOptions.map((option, index) => {
                        const IconComponent = option.icon;
                        const isSelected = option.value === sortBy;

                        return (
                          <button
                            key={option.value}
                            onClick={() => handleSortSelect(option.value)}
                            className={`cursor-pointer w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 text-left hover:bg-neutral-50 transition-colors duration-150 ${
                              isSelected
                                ? "bg-orange-50 text-orange-700"
                                : "text-neutral-700"
                            } ${
                              index !== sortOptions.length - 1
                                ? "border-b border-neutral-100"
                                : ""
                            }`}
                          >
                            <div
                              className={`p-1 sm:p-1.5 rounded-lg ${
                                isSelected ? "bg-orange-100" : "bg-neutral-100"
                              }`}
                            >
                              <IconComponent
                                className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${
                                  isSelected
                                    ? "text-orange-600"
                                    : "text-neutral-500"
                                }`}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div
                                className={`text-xs sm:text-sm font-medium ${
                                  isSelected
                                    ? "text-orange-700"
                                    : "text-neutral-700"
                                }`}
                              >
                                {option.label}
                              </div>
                            </div>
                            {isSelected && (
                              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-orange-500 rounded-full flex-shrink-0"></div>
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

        {/* Sessions Grid */}
        {!loading.customerSessions && sortedSessions.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6"
          >
            {isSorting && <LiveAuctionsSortingSkeleton />}

            {!isSorting && (
              <>
                {paginatedSessions.map((session) => {
                  const statusBadge = getStatusBadge(session.status);
                  const isLowTime = session.timeRemaining - currentTime < 3600000; // Less than 1 hour
                  const isCriticalTime = session.timeRemaining - currentTime < 900000; // Less than 15 minutes

                  return (
                    <motion.div
                      key={session.id}
                      variants={itemVariants}
                      className="card hover:shadow-medium relative cursor-pointer"
                      onClick={() => handleViewSession(session.sessionId)}
                    >
                      {/* Status Badge */}
                      <div className="absolute top-4 left-4 z-10">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold border ${statusBadge.color}`}
                        >
                          {statusBadge.label}
                        </span>
                      </div>

                      {/* Vehicle Image */}
                      <div className="relative h-48 sm:h-56 lg:h-80 xl:h-86 bg-gradient-to-br from-orange-100 to-orange-50 overflow-hidden rounded-t-xl">
                        {session.image ? (
                          <img
                            src={session.image}
                            alt={session.vehicle}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextElementSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div 
                          className={`absolute inset-0 flex items-center justify-center ${session.image ? 'hidden' : 'flex'}`}
                        >
                          <div className="text-center">
                            <Car className="w-16 h-16 sm:w-20 sm:h-20 text-orange-400 mx-auto mb-2" />
                            <p className="text-xs text-orange-600 font-medium">
                              {session.vehicle}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4 sm:p-5 lg:p-4 xl:p-6">
                        {/* Vehicle Info */}
                        <div className="mb-4 sm:mb-5 lg:mb-4 xl:mb-6">
                          <h3 className="text-base sm:text-lg lg:text-lg xl:text-xl font-bold text-neutral-800 mb-2">
                            {session.vehicle}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-neutral-500">
                            <MapPin className="w-3 h-3" />
                            <span>ZIP: {session.zipCode}</span>
                            {session.dealerPreference && (
                              <>
                                <span>•</span>
                                <span>{session.dealerPreference === 'local' ? 'Local' : 'All'} Dealers</span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Stats Badges */}
                        <div className="flex flex-wrap gap-2 mb-4 sm:mb-5 lg:mb-4 xl:mb-6">
                          {/* Base Price Badge */}
                          <div className="inline-flex items-center gap-1 sm:gap-1.5 lg:gap-1 xl:gap-2 bg-neutral-100 text-neutral-700 px-2 sm:px-2.5 lg:px-2 xl:px-3 py-1.5 sm:py-1.5 lg:py-1.5 xl:py-2 rounded-full border border-neutral-200">
                            <DollarSign className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-3 xl:w-4 xl:h-4" />
                            <span className="text-xs sm:text-sm lg:text-xs xl:text-sm font-semibold">
                              Base: {formatCurrency(session.price)}
                            </span>
                          </div>

                          {/* Best Offer Badge */}
                          {session.currentBid > 0 ? (
                            <div className="inline-flex items-center gap-1 sm:gap-1.5 lg:gap-1 xl:gap-2 bg-green-50 text-green-700 px-2 sm:px-2.5 lg:px-2 xl:px-3 py-1.5 sm:py-1.5 lg:py-1.5 xl:py-2 rounded-full border border-green-200">
                              <Award className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-3 xl:w-4 xl:h-4" />
                              <span className="text-xs sm:text-sm lg:text-xs xl:text-sm font-semibold">
                                Best: {formatCurrency(session.currentBid)}
                              </span>
                            </div>
                          ) : (
                            <div className="inline-flex items-center gap-1 sm:gap-1.5 lg:gap-1 xl:gap-2 bg-neutral-100 text-neutral-500 px-2 sm:px-2.5 lg:px-2 xl:px-3 py-1.5 sm:py-1.5 lg:py-1.5 xl:py-2 rounded-full border border-neutral-200">
                              <DollarSign className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-3 xl:w-4 xl:h-4" />
                              <span className="text-xs sm:text-sm lg:text-xs xl:text-sm font-semibold">
                                No bids yet
                              </span>
                            </div>
                          )}

                          {/* Bid Count Badge */}
                          <div className="inline-flex items-center gap-1 sm:gap-1.5 lg:gap-1 xl:gap-2 bg-blue-50 text-blue-700 px-2 sm:px-2.5 lg:px-2 xl:px-3 py-1.5 sm:py-1.5 lg:py-1.5 xl:py-2 rounded-full border border-blue-200">
                            <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-3 xl:w-4 xl:h-4" />
                            <span className="text-xs sm:text-sm lg:text-xs xl:text-sm font-semibold">
                              {session.bidCount} bid{session.bidCount !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>

                        {/* Time Remaining */}
                        <div className="flex items-center justify-between mb-4 sm:mb-5 lg:mb-4 xl:mb-6">
                          <div className="flex items-center space-x-2">
                            <Timer className={`w-4 h-4 sm:w-4 sm:h-4 lg:w-4 xl:w-5 xl:h-5 ${
                              isCriticalTime ? 'text-red-500' : isLowTime ? 'text-orange-500' : 'text-blue-500'
                            }`} />
                            <span className={`text-xs sm:text-sm lg:text-xs xl:text-sm font-semibold font-mono ${
                              isCriticalTime ? 'text-red-600' : isLowTime ? 'text-orange-600' : 'text-blue-600'
                            }`}>
                              {formatTimeRemaining(session.timeRemaining)}
                            </span>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-neutral-500">
                              Time remaining
                            </p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex space-x-2 sm:space-x-2.5 lg:space-x-2 xl:space-x-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewSession(session.sessionId);
                            }}
                            className="cursor-pointer flex-1 py-2 sm:py-2.5 lg:py-2 xl:py-2.5 px-3 sm:px-3.5 lg:px-3 xl:px-4 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium transition-colors duration-200 flex items-center justify-center space-x-1 sm:space-x-1.5 lg:space-x-1 xl:space-x-2 text-xs sm:text-sm lg:text-xs xl:text-sm"
                          >
                            <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-3 xl:w-4 xl:h-4" />
                            <span>View Session</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </>
            )}
          </motion.div>
        )}

        {/* Load More Component */}
        {!loading.customerSessions && sortedSessions.length > 0 && (
          <LoadMore
            items={sortedSessions}
            itemsPerPage={itemsPerPage}
            onLoadMore={handleLoadMore}
            isLoadingMore={isLoadingMore}
            hasMoreItems={hasMoreItems}
            remainingItems={remainingItems}
            SkeletonComponent={LiveAuctionsSortingSkeleton}
            buttonText="Load More Sessions"
            loadingText="Loading sessions..."
            showRemainingCount={true}
          />
        )}

        {/* Empty State */}
        {!loading.customerSessions && activeSessions.length === 0 && (
          <motion.div
            variants={itemVariants}
            className="flex -mt-8 sm:-mt-12 lg:-mt-16 items-center justify-center min-h-[50vh] sm:min-h-[60vh] px-4"
          >
            <div className="text-center max-w-sm sm:max-w-md mx-auto">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative mb-4 sm:mb-6"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary-50 to-primary-100 rounded-3xl flex items-center justify-center mx-auto shadow-soft border border-primary-200">
                  <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-primary-500" />
                </div>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                className="space-y-3 sm:space-y-4"
              >
                <h3 className="text-xl sm:text-2xl font-bold text-neutral-800 font-display">
                  No Active Sessions
                </h3>
                <p className="text-sm sm:text-base text-neutral-600">
                  Start a new reverse bidding session to get the best offers for your vehicle
                </p>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8"
              >
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  onClick={() => navigate("/reverse-bidding")}
                  className="cursor-pointer w-full sm:w-60 px-4 h-12 sm:h-16 group relative bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:shadow-xl hover:shadow-primary-500/25 focus:outline-none focus:ring-4 focus:ring-primary-200"
                >
                  <div className="flex items-center justify-center sm:justify-between space-x-2 sm:space-x-0">
                    <Car className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:scale-110" />
                    <span className="text-sm sm:text-base">Start New Session</span>
                  </div>
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ActiveSessionsPage;

