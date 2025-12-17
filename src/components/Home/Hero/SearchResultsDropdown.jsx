import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Car, MapPin, Loader2, Sparkles, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setFilters, fetchMockCarsThunk } from "@/features/reverseBidding/redux/reverseBidSlice";

export default function SearchResultsDropdown({
  isOpen,
  vehicles = [],
  isLoading = false,
  extractedParams = {},
  onClose,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  const handleVehicleClick = (vehicle, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    onClose();
    // Navigate to vehicle details page using vehicle_id (prioritize vehicle_id, then product_id, then id)
    if (vehicle.vehicle_id) {
      navigate(`/reverse-bidding/vehicles/${vehicle.vehicle_id}`);
    } else if (vehicle.product_id) {
      navigate(`/reverse-bidding/vehicles/${vehicle.product_id}`);
    } else if (vehicle.id) {
      navigate(`/reverse-bidding/vehicles/${vehicle.id}`);
    } else {
      // Fallback: navigate to results with VIN if ID is not available
      navigate(`/reverse-bidding/results?vin=${vehicle.vin}`);
    }
  };

  // Map extractedParams to Redux filter format
  const mapExtractedParamsToFilters = (params) => {
    const filters = {
      condition: 'all',
      make: null,
      model: null,
      year: null,
      budgetMin: null,
      budgetMax: null,
      zipCode: '',
      extraFilters: {},
    };

    // Map new_used to condition
    if (params.new_used === 'N') {
      filters.condition = 'new';
    } else if (params.new_used === 'U') {
      filters.condition = 'used';
    }

    // Map basic filters
    if (params.make) filters.make = params.make;
    if (params.model) filters.model = params.model;
    if (params.year) filters.year = String(params.year);
    if (params.min_price) filters.budgetMin = Number(params.min_price);
    if (params.max_price) filters.budgetMax = Number(params.max_price);

    // Map extra filters
    if (params.body) {
      filters.extraFilters.body = Array.isArray(params.body) ? params.body : [params.body];
    }
    if (params.transmission) {
      filters.extraFilters.transmission = Array.isArray(params.transmission) ? params.transmission : [params.transmission];
    }
    if (params.fuel) {
      filters.extraFilters.fuel = Array.isArray(params.fuel) ? params.fuel : [params.fuel];
    }
    if (params.exterior_color) {
      filters.extraFilters.exterior_color = Array.isArray(params.exterior_color) ? params.exterior_color : [params.exterior_color];
    }
    if (params.certified !== null && params.certified !== undefined) {
      filters.extraFilters.certified = [String(params.certified)];
    }

    return filters;
  };

  const handleViewAllResults = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // Map extracted parameters to Redux filter format
    const filters = mapExtractedParamsToFilters(extractedParams);
    
    // Dispatch filters to Redux
    dispatch(setFilters(filters));
    
    // Navigate first (this will unmount the component, so onClose isn't needed)
    navigate('/reverse-bidding/results');
    
    // Fetch results with the filters (don't await - let it happen in background)
    dispatch(fetchMockCarsThunk({ filters, page: 1, perPage: 20 }));
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
          className="search-results-dropdown z-[9999]"
          onClick={(e) => e.stopPropagation()}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden backdrop-blur-xl"
            onClick={(e) => e.stopPropagation()}
          >
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
            <div className="search-dropdown-content">
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
                          onClick={(e) => handleVehicleClick(vehicle, e)}
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
                  type="button"
                  onClick={handleViewAllResults}
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

