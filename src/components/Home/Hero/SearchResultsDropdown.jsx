import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Car, MapPin, Loader2, Sparkles, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SearchResultsDropdown({
  isOpen,
  vehicles = [],
  isLoading = false,
  extractedParams = {},
  onClose,
}) {
  const navigate = useNavigate();

  const formatPrice = (price) => {
    if (!price) return "Price N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatMileage = (odometer) => {
    if (!odometer) return null;
    return new Intl.NumberFormat("en-US").format(odometer) + " mi";
  };

  const getVehicleImage = (vehicle) => {
    if (vehicle.photos && Array.isArray(vehicle.photos) && vehicle.photos.length > 0) {
      return vehicle.photos[0];
    }
    return null;
  };

  const handleVehicleClick = (vehicle) => {
    onClose();
    navigate(`/reverse-bidding/results?vin=${vehicle.vin}`);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="absolute top-full left-0 right-0 mt-2 z-[9999]"
        >
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden backdrop-blur-xl">
            {/* Header */}
            <div className="bg-gradient-to-r from-cyan-50 to-blue-50 px-4 py-3 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      {isLoading ? "Searching..." : "Search Results"}
                    </h3>
                    {!isLoading && vehicles.length > 0 && (
                      <p className="text-xs text-slate-600">
                        {vehicles.length} vehicle{vehicles.length !== 1 ? "s" : ""} found
                      </p>
                    )}
                  </div>
                </div>
                {Object.keys(extractedParams).length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {extractedParams.make && (
                      <span className="px-2 py-0.5 bg-white/80 rounded-full text-xs font-medium text-slate-700 border border-slate-200">
                        {extractedParams.make}
                      </span>
                    )}
                    {extractedParams.year && (
                      <span className="px-2 py-0.5 bg-white/80 rounded-full text-xs font-medium text-slate-700 border border-slate-200">
                        {extractedParams.year}
                      </span>
                    )}
                    {extractedParams.max_price && (
                      <span className="px-2 py-0.5 bg-white/80 rounded-full text-xs font-medium text-slate-700 border border-slate-200">
                        Under {formatPrice(extractedParams.max_price)}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="max-h-[500px] overflow-y-auto">
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-12 px-4"
                  >
                    <Loader2 className="h-8 w-8 animate-spin text-cyan-500 mb-3" />
                    <p className="text-sm text-slate-600 font-medium">Finding matches...</p>
                  </motion.div>
                ) : vehicles.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-12 px-4 text-center"
                  >
                    <div className="p-3 bg-slate-100 rounded-xl mb-3">
                      <Car className="h-8 w-8 text-slate-400" />
                    </div>
                    <p className="text-sm font-medium text-slate-900 mb-1">No vehicles found</p>
                    <p className="text-xs text-slate-600">
                      Try adjusting your search criteria
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="divide-y divide-slate-100"
                  >
                    {vehicles.map((vehicle, index) => {
                      const imageUrl = getVehicleImage(vehicle);
                      return (
                        <motion.div
                          key={vehicle.id || index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.03 }}
                          onClick={() => handleVehicleClick(vehicle)}
                          className="group px-4 py-3 hover:bg-gradient-to-r hover:from-cyan-50/50 hover:to-blue-50/50 cursor-pointer transition-all duration-200"
                        >
                          <div className="flex items-center gap-3">
                            {/* Vehicle Image */}
                            <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-slate-100">
                              {imageUrl ? (
                                <img
                                  src={imageUrl}
                                  alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                  onError={(e) => {
                                    e.target.style.display = "none";
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                                  <Car className="h-6 w-6 text-slate-400" />
                                </div>
                              )}
                            </div>

                            {/* Vehicle Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <h4 className="text-sm font-bold text-slate-900 group-hover:text-cyan-600 transition-colors truncate">
                                  {vehicle.year} {vehicle.make} {vehicle.model}
                                </h4>
                                <p className="text-sm font-bold text-cyan-600 flex-shrink-0">
                                  {formatPrice(vehicle.price)}
                                </p>
                              </div>
                              <div className="flex items-center gap-3 text-xs text-slate-600">
                                {vehicle.body && (
                                  <span className="truncate">{vehicle.body}</span>
                                )}
                                {vehicle.odometer !== null && (
                                  <span>• {formatMileage(vehicle.odometer)}</span>
                                )}
                                {vehicle.transmission && (
                                  <span className="truncate">• {vehicle.transmission}</span>
                                )}
                              </div>
                              {vehicle.dealer_name && (
                                <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
                                  <MapPin className="h-3 w-3" />
                                  <span className="truncate">
                                    {vehicle.dealer_name}
                                    {vehicle.dealer_city && ` • ${vehicle.dealer_city}`}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Arrow Icon */}
                            <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-cyan-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
                          </div>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer - Show more button if there are results */}
            {!isLoading && vehicles.length > 0 && (
              <div className="px-4 py-3 bg-slate-50 border-t border-slate-200">
                <button
                  onClick={() => {
                    onClose();
                    // Navigate to full search results
                    const params = new URLSearchParams();
                    if (extractedParams.make) params.append("make", extractedParams.make);
                    if (extractedParams.model) params.append("model", extractedParams.model);
                    if (extractedParams.year) params.append("year", extractedParams.year);
                    if (extractedParams.max_price) params.append("max_price", extractedParams.max_price);
                    navigate(`/reverse-bidding/results?${params.toString()}`);
                  }}
                  className="w-full text-center text-sm font-semibold text-cyan-600 hover:text-cyan-700 transition-colors"
                >
                  View all results →
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

