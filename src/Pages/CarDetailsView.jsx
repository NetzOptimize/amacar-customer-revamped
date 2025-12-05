import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Car,
  MapPin,
  DollarSign,
  Clock,
  User,
  Calendar,
  Gavel,
  Image as ImageIcon,
  CheckCircle,
  XCircle,
  AlertCircle,
  Phone,
  Mail,
  Star,
  Award,
  Shield,
  ArrowLeft,
} from "lucide-react";
import { formatCurrency, formatDate } from "../lib/utils";
import api from "../lib/api";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import BoundingBox from "../components/damage/BoundingBox";

const CarDetailsView = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const productId = state?.productId;
  const [vehicleData, setVehicleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [remainingTime, setRemainingTime] = useState(null);
  const [imageDimensions, setImageDimensions] = useState({});

  // Fetch vehicle details
  useEffect(() => {
    console.log("productId", productId);
    const fetchVehicleDetails = async () => {
      if (!productId) {
        setError("No product ID available");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        console.log("productId", productId);
        console.log("before api call");
        const response = await api.get(`/vehicle/details/${productId}`);

        if (response.data.success) {
          setVehicleData(response.data.vehicle);
          setRemainingTime(
            response.data.vehicle?.auction?.remaining_seconds || 0
          );
          console.log("response.data.vehicle", response.data.vehicle);
          console.log("vehicleData", vehicleData);
        } else {
          setError(response.data.message || "Failed to fetch vehicle details");
        }
      } catch (err) {
        console.error("Error fetching vehicle details:", err);
        setError(
          err.response?.data?.message ||
          err.message ||
          "Failed to fetch vehicle details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchVehicleDetails();
  }, [productId]);

  // Countdown timer effect
  useEffect(() => {
    if (remainingTime === null || remainingTime <= 0) return;

    const timer = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [remainingTime]);

  // Format remaining time
  const formatRemainingTime = (seconds) => {
    if (!seconds) return "N/A";

    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m ${secs}s`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  // Format bid status
  const getBidStatusIcon = (status) => {
    switch (status) {
      case "accepted":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "pending":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  // Format bid status text
  const getBidStatusText = (status) => {
    switch (status) {
      case "accepted":
        return "Accepted";
      case "rejected":
        return "Rejected";
      case "pending":
        return "Pending";
      default:
        return "Unknown";
    }
  };

  // Container variants for animations
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

  // Loading state
  if (loading) {
    return (
      <div className="mt-16 min-h-screen bg-gradient-hero">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6 sm:space-y-8">
            {/* Header Skeleton */}
            <div className="px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 lg:pt-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                <div className="flex-1 min-w-0">
                  <div className="h-6 sm:h-8 lg:h-10 bg-gray-200 rounded w-64 sm:w-80 lg:w-96 mb-2"></div>
                  <div className="h-4 sm:h-5 lg:h-6 bg-gray-200 rounded w-48 sm:w-64 lg:w-80"></div>
                </div>
                <div className="h-8 sm:h-10 w-full sm:w-20 bg-gray-200 rounded-lg"></div>
              </div>
            </div>

            {/* Carousel and Info Section Skeleton */}
            <div className="px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Carousel Skeleton - 2 columns */}
                <div className="lg:col-span-2">
                  <div className="aspect-[4/3] sm:aspect-[3/2] lg:aspect-[4/3] w-full bg-gray-200 rounded-lg sm:rounded-xl"></div>
                </div>

                {/* Right Side Info Skeleton - 1 column */}
                <div className="space-y-4 sm:space-y-6">
                  {/* Auction Details Skeleton */}
                  <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-3 sm:mb-4">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 rounded-lg"></div>
                      <div>
                        <div className="h-4 sm:h-5 bg-gray-200 rounded w-24 sm:w-32 mb-1"></div>
                        <div className="h-3 sm:h-4 bg-gray-200 rounded w-20 sm:w-24"></div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="bg-gray-100 p-2 sm:p-3 rounded-lg"
                        >
                          <div className="h-3 bg-gray-200 rounded w-12 sm:w-16 mb-2"></div>
                          <div className="h-3 sm:h-4 bg-gray-200 rounded w-16 sm:w-20"></div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Cash Offer Skeleton */}
                  <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border-2 border-gray-200">
                    <div className="flex items-center gap-2 mb-3 sm:mb-4">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 rounded-lg"></div>
                      <div>
                        <div className="h-4 sm:h-5 bg-gray-200 rounded w-20 sm:w-24 mb-1"></div>
                        <div className="h-3 sm:h-4 bg-gray-200 rounded w-16 sm:w-20"></div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-gray-100 p-2 sm:p-3 rounded-lg">
                        <div className="h-3 bg-gray-200 rounded w-16 sm:w-20 mb-2"></div>
                        <div className="h-5 sm:h-6 bg-gray-200 rounded w-24 sm:w-32"></div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-gray-100 p-2 sm:p-3 rounded-lg">
                          <div className="h-3 bg-gray-200 rounded w-10 sm:w-12 mb-2"></div>
                          <div className="h-3 sm:h-4 bg-gray-200 rounded w-12 sm:w-16"></div>
                        </div>
                        <div className="bg-gray-100 p-2 sm:p-3 rounded-lg">
                          <div className="h-3 bg-gray-200 rounded w-12 sm:w-16 mb-2"></div>
                          <div className="h-3 sm:h-4 bg-gray-200 rounded w-16 sm:w-20"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Skeleton */}
            <div className="px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Vehicle Overview Skeleton - Full width */}
                <div className="lg:col-span-3 bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm">
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gray-200 rounded-lg sm:rounded-xl"></div>
                    <div>
                      <div className="h-5 sm:h-6 bg-gray-200 rounded w-32 sm:w-40 mb-2"></div>
                      <div className="h-3 sm:h-4 bg-gray-200 rounded w-40 sm:w-48"></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="bg-gray-100 p-3 sm:p-4 rounded-lg"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gray-200 rounded"></div>
                          <div className="h-3 sm:h-4 bg-gray-200 rounded w-20 sm:w-24"></div>
                        </div>
                        <div className="space-y-2">
                          {[1, 2, 3].map((j) => (
                            <div
                              key={j}
                              className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0"
                            >
                              <div className="h-3 sm:h-4 bg-gray-200 rounded w-16 sm:w-20"></div>
                              <div className="h-3 sm:h-4 bg-gray-200 rounded w-20 sm:w-24"></div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Condition Assessment Skeleton */}
            <div className="px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8">
              <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm">
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gray-200 rounded-lg sm:rounded-xl"></div>
                  <div>
                    <div className="h-5 sm:h-6 bg-gray-200 rounded w-40 sm:w-48 mb-2"></div>
                    <div className="h-3 sm:h-4 bg-gray-200 rounded w-48 sm:w-56"></div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div key={i} className="bg-gray-100 p-3 sm:p-4 rounded-lg">
                      <div className="h-3 sm:h-4 bg-gray-200 rounded w-16 sm:w-20 mb-2"></div>
                      <div className="h-4 sm:h-5 bg-gray-200 rounded w-20 sm:w-24"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-hero p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Car className="w-12 h-12 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-800 mb-2">
              Error Loading Vehicle Details
            </h3>
            <p className="text-neutral-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No data state
  if (!vehicleData) {
    return (
      <div className="min-h-screen bg-gradient-hero p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Car className="w-12 h-12 text-neutral-400" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-800 mb-2">
              No Vehicle Data
            </h3>
            <p className="text-neutral-600">
              No vehicle details available for this product.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const {
    basic_info,
    location,
    cash_offer,
    auction,
    user,
    condition_assessment,
    bids,
    images,
  } = vehicleData;

  return (
    <div className="mt-8 lg:mt-16 min-h-screen bg-gradient-hero">
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6 sm:space-y-8"
        >
          {/* Header */}
          <motion.div
            variants={itemVariants}
            className="px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 lg:pt-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-800 mb-2 truncate">
                  {basic_info?.title || "Vehicle Details"}
                </h1>
                <p className="text-neutral-600 text-sm sm:text-base lg:text-lg">
                  Complete vehicle information and auction details
                </p>
              </div>
              <button
                onClick={() => navigate(-1)}
                className="cursor-pointer flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-white hover:bg-neutral-50 border border-neutral-200 rounded-lg shadow-sm transition-colors duration-200 w-full sm:w-auto"
              >
                <ArrowLeft className="w-4 h-4 text-neutral-600" />
                <span className="text-neutral-700 font-medium text-sm sm:text-base">
                  Back
                </span>
              </button>
            </div>
          </motion.div>

          {/* Images Carousel and Key Info Section */}
          <div className="px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Images Carousel - Takes 2 columns */}
              {images && images.length > 0 ? (
                <motion.div 
                  variants={itemVariants} 
                  className="lg:col-span-2 relative" 
                  style={{ overflow: 'visible' }}
                  ref={(el) => {
                    // Store reference for tooltip positioning
                    if (el) el.setAttribute('data-carousel-container', 'true');
                  }}
                >
                  <Carousel
                    className="shadow-lg w-full"
                    opts={{
                      align: "start",
                      loop: true,
                    }}
                    plugins={[
                      Autoplay({
                        delay: 3000,
                        stopOnInteraction: false,
                        stopOnMouseEnter: true,
                      }),
                    ]}
                  >
                    <CarouselContent>
                      {images.map((image, index) => (
                        <CarouselItem key={image.attachment_id || index}>
                          <div 
                            className="aspect-[4/3] sm:aspect-[3/2] lg:aspect-[4/3] w-full rounded-lg sm:rounded-xl shadow-sm relative" 
                            style={{ overflow: 'visible', position: 'relative' }}
                            ref={(el) => {
                              if (el) el.setAttribute('data-image-container', 'true');
                            }}
                          >
                            <div className="w-full h-full rounded-lg sm:rounded-xl overflow-hidden" style={{ position: 'relative' }}>
                              <img
                                src={image.url}
                                alt={image.name || `Vehicle image ${index + 1}`}
                                className="w-full h-full object-contain"
                                onLoad={(e) => {
                                  const img = e.target;
                                  setImageDimensions((prev) => ({
                                    ...prev,
                                    [image.attachment_id]: {
                                      width: img.clientWidth,
                                      height: img.clientHeight,
                                    },
                                  }));
                                }}
                                onError={(e) => {
                                  e.target.style.display = "none";
                                  e.target.nextSibling.style.display = "flex";
                                }}
                              />
                            </div>
                            {/* Damage Bounding Boxes - Outside image container so tooltips can extend */}
                            {image.damage_data?.hasDamage &&
                              image.damage_data?.damages &&
                              image.damage_data.damages.length > 0 &&
                              imageDimensions[image.attachment_id] &&
                              image.damage_data.damages.map((damage, damageIndex) => (
                                <BoundingBox
                                  key={damageIndex}
                                  box={damage.boundingBox}
                                  imageDims={imageDimensions[image.attachment_id]}
                                  index={damageIndex}
                                  description={damage.description}
                                />
                              ))}
                            <div
                              className="w-full h-full bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center"
                              style={{ display: "none" }}
                            >
                              <ImageIcon className="w-12 h-12 sm:w-16 sm:h-16 text-neutral-400" />
                            </div>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-1 sm:left-2 bg-white/90 hover:bg-white shadow-lg border-0 cursor-pointer w-8 h-8 sm:w-10 sm:h-10" />
                    <CarouselNext className="right-1 sm:right-2 bg-white/90 hover:bg-white shadow-lg border-0 cursor-pointer w-8 h-8 sm:w-10 sm:h-10" />
                  </Carousel>
                </motion.div>
              ) : (
                <motion.div variants={itemVariants} className="lg:col-span-2">
                  <div className="aspect-[4/3] sm:aspect-[3/2] lg:aspect-[4/3] w-full bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-lg sm:rounded-xl flex items-center justify-center shadow-sm">
                    <div className="text-center">
                      <ImageIcon className="w-12 h-12 sm:w-16 sm:h-16 text-neutral-400 mx-auto mb-2 sm:mb-4" />
                      <p className="text-neutral-600 text-sm sm:text-base">
                        No images available
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Auction Details and Cash Offer - Takes 1 column */}
              <div className="space-y-4 sm:space-y-6">
                {/* Auction Information */}
                <motion.div variants={itemVariants} className="card p-3 sm:p-4">
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Gavel className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-neutral-800">
                        Auction Details
                      </h2>
                      <p className="text-xs sm:text-sm text-neutral-600">
                        Status and timing
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-3 sm:p-4 rounded-lg">
                      <p className="text-xs sm:text-sm font-medium text-neutral-600 mb-2">
                        Status
                      </p>
                      <span
                        className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${auction?.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                          }`}
                      >
                        {auction?.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-3 sm:p-4 rounded-lg">
                      <p className="text-xs sm:text-sm font-medium text-neutral-600 mb-2">
                        Started
                      </p>
                      <p className="text-sm sm:text-base font-semibold text-neutral-800 break-words">
                        {auction?.auction_started_at
                          ? formatDate(auction.auction_started_at)
                          : "N/A"}
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-3 sm:p-4 rounded-lg">
                      <p className="text-xs sm:text-sm font-medium text-neutral-600 mb-2">
                        Ends
                      </p>
                      <p className="text-sm sm:text-base font-semibold text-neutral-800 break-words">
                        {auction?.auction_ends_at
                          ? formatDate(auction.auction_ends_at)
                          : "N/A"}
                      </p>
                    </div>

                    {auction?.is_active && (
                      <div className="bg-gradient-to-r from-red-50 to-red-100 p-3 sm:p-4 rounded-lg">
                        <p className="text-xs sm:text-sm font-medium text-neutral-600 mb-2">
                          Time Left
                        </p>
                        <p className="text-sm sm:text-base font-semibold text-neutral-800 font-mono">
                          {formatRemainingTime(remainingTime)}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Cash Offer - Highlighted */}
                <motion.div
                  variants={itemVariants}
                  className="card p-3 sm:p-4 bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200"
                >
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-neutral-800">
                        Cash Offer
                      </h2>
                      <p className="text-xs sm:text-sm text-neutral-600">
                        Current offer
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-white p-2 sm:p-3 rounded-lg shadow-sm">
                      <p className="text-xs font-medium text-neutral-600 mb-1">
                        Offer Amount
                      </p>
                      <p className="text-lg sm:text-xl font-bold text-orange-600">
                        {cash_offer?.offer_amount
                          ? formatCurrency(cash_offer.offer_amount)
                          : "N/A"}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                      <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm">
                        <p className="text-xs sm:text-sm font-medium text-neutral-600 mb-2">
                          Date
                        </p>
                        <p className="text-sm sm:text-base font-semibold text-neutral-800 break-words">
                          {cash_offer?.offer_date
                            ? formatDate(cash_offer.offer_date)
                            : "N/A"}
                        </p>
                      </div>

                      <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm">
                        <p className="text-xs sm:text-sm font-medium text-neutral-600 mb-2">
                          Expires
                        </p>
                        <p className="text-sm sm:text-base font-semibold text-neutral-800 break-words">
                          {cash_offer?.offer_expiration || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Vehicle Overview - Most Important Info */}
              <motion.div
                variants={itemVariants}
                className="lg:col-span-3 card p-4 sm:p-6"
              >
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center">
                    <Car className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-neutral-800">
                      Vehicle Overview
                    </h2>
                    <p className="text-sm sm:text-base text-neutral-600">
                      Key details about this vehicle
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-3 sm:p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <Star className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                      <span className="font-semibold text-blue-800 text-sm sm:text-base">
                        Vehicle Details
                      </span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex flex-col gap-1">
                        <span className="text-neutral-600 text-xs sm:text-sm">
                          Year/Make/Model:
                        </span>
                        <span className="font-semibold text-neutral-800 text-sm sm:text-base">
                          {basic_info?.year} {basic_info?.make}{" "}
                          {basic_info?.model}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-neutral-600 text-xs sm:text-sm">
                          Trim:
                        </span>
                        <span className="font-semibold text-neutral-800 text-sm sm:text-base">
                          {basic_info?.trim || "N/A"}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-neutral-600 text-xs sm:text-sm">
                          VIN:
                        </span>
                        <span className="font-semibold text-neutral-800 text-sm sm:text-base">
                          {basic_info?.vin || "N/A"}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-neutral-600 text-xs sm:text-sm">
                          Mileage:
                        </span>
                        <span className="font-semibold text-neutral-800 text-sm sm:text-base">
                          {basic_info?.mileage
                            ? `${basic_info.mileage.toLocaleString()} miles`
                            : "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-green-100 p-3 sm:p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                      <span className="font-semibold text-green-800 text-sm sm:text-base">
                        Condition
                      </span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex flex-col gap-1">
                        <span className="text-neutral-600 text-xs sm:text-sm">
                          Body Type:
                        </span>
                        <span className="font-semibold text-neutral-800 text-sm sm:text-base">
                          {basic_info?.body_type || "N/A"}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-neutral-600 text-xs sm:text-sm">
                          Exterior:
                        </span>
                        <span className="font-semibold text-neutral-800 text-sm sm:text-base">
                          {basic_info?.exterior_color || "N/A"}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-neutral-600 text-xs sm:text-sm">
                          Interior:
                        </span>
                        <span className="font-semibold text-neutral-800 text-sm sm:text-base">
                          {basic_info?.interior_color || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-3 sm:p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <Award className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                      <span className="font-semibold text-purple-800 text-sm sm:text-base">
                        Performance
                      </span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex flex-col gap-1">
                        <span className="text-neutral-600 text-xs sm:text-sm">
                          Transmission:
                        </span>
                        <span className="font-semibold text-neutral-800 text-sm sm:text-base">
                          {basic_info?.transmission || "N/A"}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-neutral-600 text-xs sm:text-sm">
                          Engine:
                        </span>
                        <span className="font-semibold text-neutral-800 text-sm sm:text-base">
                          {basic_info?.engine_type || "N/A"}
                        </span>
                      </div>
                      {basic_info?.powertrain_description && (
                        <div className="mt-3">
                          <span className="text-xs sm:text-sm text-neutral-600">
                            Powertrain:
                          </span>
                          <p className="text-xs sm:text-sm font-medium text-neutral-800 mt-1">
                            {basic_info.powertrain_description}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-teal-50 to-teal-100 p-3 sm:p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600" />
                      <span className="font-semibold text-teal-800 text-sm sm:text-base">
                        Location
                      </span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex flex-col gap-1">
                        <span className="text-neutral-600 text-xs sm:text-sm">
                          City, State:
                        </span>
                        <span className="font-semibold text-neutral-800 text-sm sm:text-base">
                          {location?.city && location?.state
                            ? `${location.city}, ${location.state}`
                            : "N/A"}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-neutral-600 text-xs sm:text-sm">
                          ZIP Code:
                        </span>
                        <span className="font-semibold text-neutral-800 text-sm sm:text-base">
                          {location?.zip_code || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Damages Section */}
              {(() => {
                // Collect all damage data from all images
                const allDamages = [];
                if (images && images.length > 0) {
                  images.forEach((image) => {
                    if (image.damage_data?.hasDamage && image.damage_data?.damages) {
                      image.damage_data.damages.forEach((damage) => {
                        allDamages.push({
                          imageName: image.name || 'Vehicle Image',
                          description: damage.description,
                        });
                      });
                    }
                  });
                }

                // Only show section if there are damages
                if (allDamages.length === 0) {
                  return null;
                }

                return (
                  <motion.div
                    variants={itemVariants}
                    className="lg:col-span-3 card p-4 sm:p-6"
                  >
                    <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-lg sm:rounded-xl flex items-center justify-center">
                        <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-neutral-800">
                          Damages
                        </h2>
                        <p className="text-sm sm:text-base text-neutral-600">
                          AI-detected vehicle damages
                        </p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 sm:p-6 rounded-lg">
                      <div className="space-y-3 sm:space-y-4">
                        {allDamages.map((damage, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 sm:gap-4 bg-white p-3 sm:p-4 rounded-lg shadow-sm"
                          >
                            <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-bold text-sm sm:text-base">
                              {index + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs sm:text-sm font-medium text-neutral-600 mb-1">
                                {damage.imageName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </p>
                              <p className="text-sm sm:text-base text-neutral-800">
                                {damage.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                );
              })()}

              {/* Condition Assessment */}
              {condition_assessment && (
                <motion.div
                  variants={itemVariants}
                  className="lg:col-span-3 card p-4 sm:p-6"
                >
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-lg sm:rounded-xl flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-neutral-800">
                        Condition Assessment
                      </h2>
                      <p className="text-sm sm:text-base text-neutral-600">
                        Complete vehicle condition details
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    <div className="bg-gradient-to-r from-green-50 to-green-100 p-3 sm:p-4 rounded-lg">
                      <p className="text-xs sm:text-sm font-medium text-neutral-600 mb-2">
                        Overall Title
                      </p>
                      <p className="text-sm sm:text-base lg:text-lg font-semibold text-green-800 break-words">
                        {condition_assessment?.title || "N/A"}
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-3 sm:p-4 rounded-lg">
                      <p className="text-xs sm:text-sm font-medium text-neutral-600 mb-2">
                        Cosmetic Condition
                      </p>
                      <p className="text-sm sm:text-base lg:text-lg font-semibold text-blue-800 break-words">
                        {condition_assessment?.cosmetic || "N/A"}
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-3 sm:p-4 rounded-lg">
                      <p className="text-xs sm:text-sm font-medium text-neutral-600 mb-2">
                        Accident History
                      </p>
                      <p className="text-sm sm:text-base lg:text-lg font-semibold text-purple-800 break-words">
                        {condition_assessment?.accident || "N/A"}
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-3 sm:p-4 rounded-lg">
                      <p className="text-xs sm:text-sm font-medium text-neutral-600 mb-2">
                        Tire Tread
                      </p>
                      <p className="text-sm sm:text-base lg:text-lg font-semibold text-orange-800 break-words">
                        {condition_assessment?.tread || "N/A"}
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-red-50 to-red-100 p-3 sm:p-4 rounded-lg">
                      <p className="text-xs sm:text-sm font-medium text-neutral-600 mb-2">
                        Smoked Windows
                      </p>
                      <p className="text-sm sm:text-base lg:text-lg font-semibold text-red-800 break-words">
                        {condition_assessment?.smoked || "N/A"}
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 p-3 sm:p-4 rounded-lg">
                      <p className="text-xs sm:text-sm font-medium text-neutral-600 mb-2">
                        Modifications
                      </p>
                      <p className="text-sm sm:text-base lg:text-lg font-semibold text-indigo-800 break-words">
                        {condition_assessment?.modifications || "N/A"}
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-pink-50 to-pink-100 p-3 sm:p-4 rounded-lg">
                      <p className="text-xs sm:text-sm font-medium text-neutral-600 mb-2">
                        Warning Lights
                      </p>
                      <p className="text-sm sm:text-base lg:text-lg font-semibold text-pink-800 break-words">
                        {condition_assessment?.warning || "N/A"}
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-teal-50 to-teal-100 p-3 sm:p-4 rounded-lg sm:col-span-2 lg:col-span-2">
                      <p className="text-xs sm:text-sm font-medium text-neutral-600 mb-2">
                        Features
                      </p>
                      <p className="text-sm sm:text-base lg:text-lg font-semibold text-teal-800 break-words">
                        {condition_assessment?.features
                          ? Array.isArray(condition_assessment.features)
                            ? condition_assessment.features.join(", ") // normal array
                            : String(condition_assessment.features).replace(
                              /^a:\d+:\{i:\d+;s:\d+:"([^"]+)";\}$/,
                              "$1"
                            ) // serialized PHP string
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Bids Section */}
          {bids && bids.length > 0 && (
            <motion.div
              variants={itemVariants}
              className="px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8"
            >
              <div className="card p-4 sm:p-6">
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-lg sm:rounded-xl flex items-center justify-center">
                    <Gavel className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-neutral-800">
                      Bids ({bids.length})
                    </h2>
                    <p className="text-sm sm:text-base text-neutral-600">
                      Current bids on this vehicle
                    </p>
                  </div>
                </div>

                {/* Mobile Card Layout */}
                <div className="block sm:hidden space-y-3">
                  {bids.map((bid, index) => (
                    <div
                      key={bid.id}
                      className="bg-gradient-to-r from-neutral-50 to-neutral-100 p-4 rounded-lg border border-neutral-200"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-lg font-bold text-green-600">
                          {formatCurrency(bid.amount)}
                        </span>
                        <div className="flex items-center gap-2">
                          {getBidStatusIcon(bid.status)}
                          <span className="font-medium text-sm">
                            {getBidStatusText(bid.status)}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-neutral-600">
                            Bidder:
                          </span>
                          <span className="font-semibold text-sm text-neutral-800">
                            {bid.bidder_display_name}
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-sm text-neutral-600">
                            Email:
                          </span>
                          <span className="text-sm text-neutral-600 truncate max-w-[150px]">
                            {bid.bidder_email}
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-sm text-neutral-600">
                            Date:
                          </span>
                          <span className="font-medium text-sm text-neutral-800">
                            {bid.bid_at?.date}
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-sm text-neutral-600">
                            Time:
                          </span>
                          <span className="text-sm text-neutral-600">
                            {bid.bid_at?.time}
                          </span>
                        </div>


                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Table Layout */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-neutral-200">
                        <th className="text-left py-3 sm:py-4 px-2 sm:px-4 font-semibold text-neutral-700 text-xs sm:text-sm">
                          Amount
                        </th>
                        <th className="text-left py-3 sm:py-4 px-2 sm:px-4 font-semibold text-neutral-700 text-xs sm:text-sm">
                          Bidder
                        </th>
                        <th className="text-left py-3 sm:py-4 px-2 sm:px-4 font-semibold text-neutral-700 text-xs sm:text-sm">
                          Status
                        </th>
                        <th className="text-left py-3 sm:py-4 px-2 sm:px-4 font-semibold text-neutral-700 text-xs sm:text-sm">
                          Date & Time
                        </th>

                      </tr>
                    </thead>
                    <tbody>
                      {bids.map((bid) => (
                        <tr
                          key={bid.id}
                          className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors"
                        >
                          <td className="py-3 sm:py-4 px-2 sm:px-4">
                            <span className="text-lg sm:text-xl font-bold text-green-600">
                              {formatCurrency(bid.amount)}
                            </span>
                          </td>
                          <td className="py-3 sm:py-4 px-2 sm:px-4">
                            <div>
                              <p className="font-semibold text-neutral-800 text-xs sm:text-sm">
                                {bid.bidder_display_name}
                              </p>
                              <p className="text-xs sm:text-sm text-neutral-600 truncate max-w-[120px] sm:max-w-none">
                                {bid.bidder_email}
                              </p>
                            </div>
                          </td>
                          <td className="py-3 sm:py-4 px-2 sm:px-4">
                            <div className="flex items-center gap-1 sm:gap-2">
                              {getBidStatusIcon(bid.status)}
                              <span className="font-medium text-xs sm:text-sm">
                                {getBidStatusText(bid.status)}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 sm:py-4 px-2 sm:px-4">
                            <div>
                              <p className="font-medium text-neutral-800 text-xs sm:text-sm">
                                {bid.bid_at?.date}
                              </p>
                              <p className="text-xs sm:text-sm text-neutral-600">
                                {bid.bid_at?.time}
                              </p>
                            </div>
                          </td>

                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CarDetailsView;
