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
  CheckCircle,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCustomerSessionsThunk, acceptBidThunk } from "../redux/reverseBidSlice";
import useLoadMore from "../../../hooks/useLoadMore";
import LoadMore from "../../../components/ui/load-more";
import LiveAuctionsSkeleton from "../../../components/skeletons/LiveAuctionsSkeleton";
import LiveAuctionsSortingSkeleton from "@/components/skeletons/LiveAuctionsSortingSkeleton";
import apiRev from "../../../lib/apiRev";
import AcceptConfirmDialog from "../components/AcceptConfirmDialog";

const ActiveSessionsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { customerSessions, loading } = useSelector((s) => s.reverseBid);

  // Sorting state
  const [sortBy, setSortBy] = useState("time-asc");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSorting, setIsSorting] = useState(false);
  const [sortProgress, setSortProgress] = useState(0);
  const dropdownRef = useRef(null);

  // Accept offer dialog state
  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false);
  const [selectedBid, setSelectedBid] = useState(null);
  const [selectedSessionId, setSelectedSessionId] = useState(null);

  // Load more configuration
  const itemsPerPage = 6;

  // Fetch sessions on mount
  useEffect(() => {
    dispatch(fetchCustomerSessionsThunk({ status: 'running', page: 1, per_page: 100 }));
  }, [dispatch]);

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
      
      // Rely on API's expired flag - don't calculate client-side
      const isExpired = timeRemaining.expired === true;
      
      // Use API's seconds for sorting (convert to timestamp for comparison)
      const timeRemainingSeconds = timeRemaining.seconds || 0;
      const timeRemainingTimestamp = Date.now() + (timeRemainingSeconds * 1000);

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
        timeRemaining: timeRemainingTimestamp, // For sorting only
        timeRemainingSeconds: timeRemainingSeconds, // Store original seconds from API
        timeRemainingFormatted: timeRemaining.formatted || null, // Use formatted time from API
        timeRemainingHours: timeRemaining.hours || 0,
        timeRemainingMinutes: timeRemaining.minutes || 0,
        timeRemainingSecondsRemaining: timeRemaining.seconds_remaining || 0,
        isExpired: isExpired, // Rely on API's expired flag
        bidCount: parseInt(session.total_bids) || 0,
        status: session.status || "pending",
        dealerPreference: session.dealer_preference || "local",
        primaryVehicleId: session.primary_vehicle_id,
        alternativeVehicleIds: session.alternative_vehicle_ids || [],
        criteria: criteria,
        timeRemainingData: timeRemaining, // Store full time_remaining object
        image: vehicleImages[session.id] || null,
        leaderboard: leaderboard, // Store full leaderboard for best bid details
      };
    });
  };

  const allSessions = transformSessionsData(customerSessions.data);
  
  // Filter only running/pending sessions that are not expired (rely on API's expired flag)
  const activeSessions = allSessions.filter(
    (session) => {
      const isActiveStatus = session.status === "running" || session.status === "pending";
      // Rely on API's expired flag, not client-side calculation
      const isNotExpired = !session.isExpired;
      return isActiveStatus && isNotExpired;
    }
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

  // Component to track live countdown for each session using API's time_remaining
  const LiveCountdown = ({ session }) => {
    const [displayTime, setDisplayTime] = useState(() => {
      if (session.isExpired) return "Expired";
      if (session.timeRemainingFormatted) return session.timeRemainingFormatted;
      return "00:00:00";
    });
    
    useEffect(() => {
      if (session.isExpired) {
        setDisplayTime("Expired");
        return;
      }
      
      // Get initial values from API
      const timeData = session.timeRemainingData;
      if (!timeData || !timeData.seconds) {
        return;
      }
      
      // Store when we start counting
      const startTime = Date.now();
      const initialSeconds = timeData.seconds;
      
      // Update every second
      const interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const remaining = Math.max(0, initialSeconds - elapsed);
        
        if (remaining <= 0) {
          setDisplayTime("Expired");
          clearInterval(interval);
          return;
        }
        
        const h = Math.floor(remaining / 3600);
        const m = Math.floor((remaining % 3600) / 60);
        const s = remaining % 60;
        
        setDisplayTime(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`);
      }, 1000);
      
      return () => clearInterval(interval);
    }, [session.timeRemainingData, session.isExpired]);
    
    return <span>{displayTime}</span>;
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
  const getStatusBadge = (status, isExpired = false) => {
    // If expired, show expired badge regardless of status
    if (isExpired) {
      return { label: "Expired", color: "bg-red-100 text-red-700 border-red-200" };
    }
    
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

  // Handle opening accept offer dialog
  const handleOpenAcceptDialog = (session, e) => {
    if (e) {
      e.stopPropagation();
    }
    
    if (!session.leaderboard || session.leaderboard.length === 0) {
      return;
    }

    // Find the best bid (lowest amount)
    const bestBid = session.leaderboard.reduce((min, bid) => {
      const bidAmount = parseFloat(bid.amount || 0);
      const minAmount = parseFloat(min.amount || 0);
      return bidAmount < minAmount ? bid : min;
    }, session.leaderboard[0]);

    // Format bid data for dialog
    const bidData = {
      bidId: bestBid.bid_id || bestBid.id,
      dealerName: bestBid.dealer_name || 'Unknown Dealer',
      currentOffer: parseFloat(bestBid.amount || 0),
    };

    setSelectedBid(bidData);
    setSelectedSessionId(session.sessionId);
    setAcceptDialogOpen(true);
  };

  // Handle closing accept offer dialog
  const handleCloseAcceptDialog = () => {
    if (!loading.acceptance) {
      setAcceptDialogOpen(false);
      setSelectedBid(null);
      setSelectedSessionId(null);
    }
  };

  // Handle accepting the offer
  const handleAcceptOffer = async () => {
    if (!selectedBid || !selectedSessionId) return;

    try {
      const result = await dispatch(acceptBidThunk({
        sessionId: selectedSessionId,
        bidId: selectedBid.bidId,
        bidData: selectedBid,
      }));

      if (acceptBidThunk.fulfilled.match(result)) {
        // Close dialog first
        handleCloseAcceptDialog();
        // Redirect to accepted reverse bids page
        navigate('/accepted-reverse-bids');
      } else {
        console.error('Failed to accept offer:', result.error);
      }
    } catch (error) {
      console.error('Error accepting offer:', error);
    }
  };

  // Loading state
  if (loading.customerSessions && customerSessions.data.length === 0) {
    return <LiveAuctionsSkeleton />;
  }

  // Error state - Improved with sticky header
  if (!loading.customerSessions && customerSessions.data.length === 0 && activeSessions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50">
        {/* Sticky Header Section */}
        <div className="border-b border-neutral-200/50 bg-white/80 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
          <div className="mx-auto px-4 sm:px-6 lg:px-8 pt-[calc(var(--header-height-mobile)+1rem)] sm:pt-[calc(var(--header-height-tablet)+1rem)] lg:pt-[calc(var(--header-height-desktop)+1rem)] pb-4" style={{ maxWidth: '1600px' }}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-neutral-900 flex items-center gap-3">
                  <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-orange-500" />
                  Active Sessions
                </h1>
              </div>
              <button
                onClick={handleRefresh}
                disabled={loading.customerSessions}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 hover:border-orange-300 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed h-[40px]"
              >
                <RefreshCw className={`w-4 h-4 ${loading.customerSessions ? 'animate-spin' : ''}`} />
                <span className="text-sm font-medium">Refresh</span>
              </button>
            </div>

            {/* Description */}
            <p className="text-sm text-neutral-600 mb-4">
              Monitor your active reverse bidding sessions and track dealer offers in real-time.
            </p>

            {/* Stats Summary Box */}
            <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-4 mb-4">
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <div className="text-xs text-neutral-500 font-medium">Active Sessions</div>
                    <div className="text-lg font-bold text-neutral-900">0</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-xs text-neutral-500 font-medium">Total Bids</div>
                    <div className="text-lg font-bold text-neutral-900">0</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Empty State Content */}
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6" style={{ maxWidth: '1600px' }}>
          <div className="bg-white rounded-2xl border-2 border-neutral-200 shadow-xl p-16 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-24 h-24 bg-gradient-to-br from-orange-100 to-orange-50 rounded-full flex items-center justify-center mb-6 shadow-lg mx-auto"
            >
              <AlertCircle className="w-12 h-12 text-orange-500" />
            </motion.div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-3">No Active Sessions</h3>
            <p className="text-base text-neutral-600 max-w-lg mx-auto mb-6">
              You don't have any active reverse bidding sessions at the moment. Start a new session to get competitive offers from dealers.
            </p>
            <button
              onClick={() => navigate("/reverse-bidding")}
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <Car className="w-5 h-5" />
              Start New Session
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50">
      {/* Sticky Header Section */}
      <div className="border-b border-neutral-200/50 bg-white/80 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 pt-[calc(var(--header-height-mobile)+1rem)] sm:pt-[calc(var(--header-height-tablet)+1rem)] lg:pt-[calc(var(--header-height-desktop)+1rem)] pb-4" style={{ maxWidth: '1600px' }}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-neutral-900 flex items-center gap-3">
                <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-orange-500" />
                Active Sessions
              </h1>
            </div>
            <button
              onClick={handleRefresh}
              disabled={loading.customerSessions}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 hover:border-orange-300 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed h-[40px]"
            >
              <RefreshCw className={`w-4 h-4 ${loading.customerSessions ? 'animate-spin' : ''}`} />
              <span className="text-sm font-medium">Refresh</span>
            </button>
          </div>

          {/* Description */}
          <p className="text-sm text-neutral-600 mb-4">
            Monitor your active reverse bidding sessions and track dealer offers in real-time.
          </p>

          {/* Stats Summary Box */}
          <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-4 mb-4">
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <div className="text-xs text-neutral-500 font-medium">Active Sessions</div>
                  <div className="text-lg font-bold text-neutral-900">{activeSessions.length}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <div className="text-xs text-neutral-500 font-medium">Total Bids</div>
                  <div className="text-lg font-bold text-neutral-900">
                    {activeSessions.reduce((sum, session) => sum + session.bidCount, 0)}
                  </div>
                </div>
              </div>
              {activeSessions.length > 0 && activeSessions.some(s => s.currentBid > 0) && (
                <div className="flex items-center gap-2 ml-auto">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <Award className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <div className="text-xs text-neutral-500 font-medium">Best Offer</div>
                    <div className="text-lg font-bold text-green-600">
                      {formatCurrency(Math.min(...activeSessions.filter(s => s.currentBid > 0).map(s => s.currentBid)))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6" style={{ maxWidth: '1600px' }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-6 sm:mb-8"
        >

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
                  // Rely on API's expired flag, not client-side calculation
                  const isExpired = session.isExpired;
                  
                  // Determine if low/critical time based on API's seconds
                  const totalSeconds = session.timeRemainingSeconds || 0;
                  const isLowTime = totalSeconds < 3600 && totalSeconds > 0; // Less than 1 hour
                  const isCriticalTime = totalSeconds < 900 && totalSeconds > 0; // Less than 15 minutes
                  
                  const statusBadge = getStatusBadge(session.status, isExpired);

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

                          {/* Total Saving Badge - Only show if there's a best offer */}
                          {session.currentBid > 0 && session.price > session.currentBid && (
                            <div className="inline-flex items-center gap-1 sm:gap-1.5 lg:gap-1 xl:gap-2 bg-orange-50 text-orange-700 px-2 sm:px-2.5 lg:px-2 xl:px-3 py-1.5 sm:py-1.5 lg:py-1.5 xl:py-2 rounded-full border border-orange-200">
                              <TrendingDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-3 xl:w-4 xl:h-4" />
                              <span className="text-xs sm:text-sm lg:text-xs xl:text-sm font-semibold">
                                Save: {formatCurrency(session.price - session.currentBid)}
                              </span>
                            </div>
                          )}

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

                        {/* Time Remaining - Real-time countdown */}
                        <div className="flex items-center justify-start mb-4 sm:mb-5 lg:mb-4 xl:mb-6">
                          <div className="flex items-center space-x-2">
                            <Timer className={`w-4 h-4 sm:w-4 sm:h-4 lg:w-4 xl:w-5 xl:h-5 ${
                              isExpired ? 'text-red-500' : isCriticalTime ? 'text-red-500' : isLowTime ? 'text-orange-500' : 'text-blue-500'
                            }`} />
                            <span className={`text-xs sm:text-sm lg:text-xs xl:text-sm font-semibold font-mono ${
                              isExpired ? 'text-red-600' : isCriticalTime ? 'text-red-600' : isLowTime ? 'text-orange-600' : 'text-blue-600'
                            }`}>
                              <LiveCountdown session={session} />
                            </span>
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
                            <span>View Offers</span>
                          </button>
                          <button
                            onClick={(e) => handleOpenAcceptDialog(session, e)}
                            disabled={session.currentBid === 0 || isExpired}
                            className="cursor-pointer flex-1 py-2 sm:py-2.5 lg:py-2 xl:py-2.5 px-3 sm:px-3.5 lg:px-3 xl:px-4 bg-green-500 hover:bg-green-600 disabled:bg-neutral-300 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors duration-200 flex items-center justify-center space-x-1 sm:space-x-1.5 lg:space-x-1 xl:space-x-2 text-xs sm:text-sm lg:text-xs xl:text-sm"
                          >
                            <CheckCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-3 xl:w-4 xl:h-4" />
                            <span>Accept Offer</span>
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
          <div className="bg-white rounded-2xl border-2 border-neutral-200 shadow-xl p-16 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-24 h-24 bg-gradient-to-br from-orange-100 to-orange-50 rounded-full flex items-center justify-center mb-6 shadow-lg mx-auto"
            >
              <AlertCircle className="w-12 h-12 text-orange-500" />
            </motion.div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-3">No Active Sessions</h3>
            <p className="text-base text-neutral-600 max-w-lg mx-auto mb-6">
              You don't have any active reverse bidding sessions at the moment. Start a new session to get competitive offers from dealers.
            </p>
            <button
              onClick={() => navigate("/reverse-bidding")}
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <Car className="w-5 h-5" />
              Start New Session
            </button>
          </div>
        )}
        </motion.div>
      </div>

      {/* Accept Offer Dialog */}
      <AcceptConfirmDialog
        open={acceptDialogOpen}
        bid={selectedBid}
        onCancel={handleCloseAcceptDialog}
        onConfirm={handleAcceptOffer}
        loading={loading.acceptance || false}
      />
    </div>
  );
};

export default ActiveSessionsPage;

