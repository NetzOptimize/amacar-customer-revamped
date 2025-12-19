import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Car,
  MapPin,
  DollarSign,
  Calendar,
  Gauge,
  Sparkles,
  Loader2,
  X,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function RecommendationModal({
  isOpen,
  onClose,
  vehicles = [],
  isLoading = false,
  searchQuery = "",
  extractedParams = {},
}) {
  const navigate = useNavigate();

  const formatPrice = (price) => {
    if (!price) return "Price not available";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatMileage = (odometer) => {
    if (!odometer) return "N/A";
    return new Intl.NumberFormat("en-US").format(odometer) + " mi";
  };

  const getVehicleImage = (vehicle) => {
    if (vehicle.image_url) {
      return vehicle.image_url;
    }
    if (vehicle.image_gallery && Array.isArray(vehicle.image_gallery) && vehicle.image_gallery.length > 0) {
      return vehicle.image_gallery[0];
    }
    return null;
  };

  const handleViewDetails = (vehicle) => {
    onClose();
    // Navigate to vehicle details page or search results
    navigate(`/reverse-bidding/results?vin=${vehicle.vin}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        <div className="bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 p-6 border-b border-slate-200">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-lg">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <DialogTitle className="text-2xl font-bold text-slate-900">
                  Search Recommendations
                </DialogTitle>
                {searchQuery && (
                  <DialogDescription className="text-sm text-slate-600 mt-1">
                    Results for: <span className="font-semibold text-slate-800">"{searchQuery}"</span>
                  </DialogDescription>
                )}
              </div>
            </div>
            
            {Object.keys(extractedParams).length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {extractedParams.make && (
                  <span className="px-3 py-1 bg-white/80 backdrop-blur-sm rounded-full text-xs font-medium text-slate-700 border border-slate-200">
                    Make: {extractedParams.make}
                  </span>
                )}
                {extractedParams.model && (
                  <span className="px-3 py-1 bg-white/80 backdrop-blur-sm rounded-full text-xs font-medium text-slate-700 border border-slate-200">
                    Model: {extractedParams.model}
                  </span>
                )}
                {extractedParams.year && (
                  <span className="px-3 py-1 bg-white/80 backdrop-blur-sm rounded-full text-xs font-medium text-slate-700 border border-slate-200">
                    Year: {extractedParams.year}
                  </span>
                )}
                {extractedParams.max_price && (
                  <span className="px-3 py-1 bg-white/80 backdrop-blur-sm rounded-full text-xs font-medium text-slate-700 border border-slate-200">
                    Max: {formatPrice(extractedParams.max_price)}
                  </span>
                )}
              </div>
            )}
          </DialogHeader>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-12"
              >
                <Loader2 className="h-12 w-12 animate-spin text-cyan-500 mb-4" />
                <p className="text-slate-600 font-medium">Analyzing your search...</p>
                <p className="text-sm text-slate-500 mt-1">Finding the perfect matches</p>
              </motion.div>
            ) : vehicles.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <div className="p-4 bg-slate-100 rounded-2xl mb-4">
                  <Car className="h-12 w-12 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  No vehicles found
                </h3>
                <p className="text-sm text-slate-600 max-w-md">
                  We couldn't find any vehicles matching your search. Try adjusting your criteria or search again.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="mb-4">
                  <p className="text-sm text-slate-600">
                    Found <span className="font-semibold text-slate-900">{vehicles.length}</span> matching vehicle{vehicles.length !== 1 ? 's' : ''}
                  </p>
                </div>

                <div className="grid gap-4">
                  {vehicles.map((vehicle, index) => {
                    const imageUrl = getVehicleImage(vehicle);
                    return (
                      <motion.div
                        key={vehicle.id || index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="group relative bg-white rounded-xl border border-slate-200 hover:border-cyan-300 hover:shadow-lg transition-all duration-300 overflow-hidden"
                      >
                        <div className="flex gap-4 p-4">
                          {/* Vehicle Image */}
                          <div className="relative w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-slate-100">
                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                            ) : null}
                            <div
                              className={`w-full h-full ${imageUrl ? 'hidden' : 'flex'} items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200`}
                            >
                              <Car className="h-8 w-8 text-slate-400" />
                            </div>
                            {vehicle.certified && (
                              <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-lg flex items-center gap-1">
                                <CheckCircle2 className="h-3 w-3" />
                                Certified
                              </div>
                            )}
                          </div>

                          {/* Vehicle Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4 mb-2">
                              <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-bold text-slate-900 group-hover:text-cyan-600 transition-colors">
                                  {vehicle.year} {vehicle.make} {vehicle.model}
                                </h3>
                                {vehicle.body && (
                                  <p className="text-sm text-slate-600 mt-1">{vehicle.body}</p>
                                )}
                              </div>
                              <div className="text-right flex-shrink-0">
                                <p className="text-xl font-bold text-cyan-600">
                                  {formatPrice(vehicle.price)}
                                </p>
                                {vehicle.msrp && vehicle.price && vehicle.msrp > vehicle.price && (
                                  <p className="text-xs text-slate-500 line-through">
                                    {formatPrice(vehicle.msrp)}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                              {vehicle.transmission && (
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                  <Gauge className="h-4 w-4 text-slate-400" />
                                  <span className="truncate">{vehicle.transmission}</span>
                                </div>
                              )}
                              {vehicle.odometer !== null && (
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                  <Gauge className="h-4 w-4 text-slate-400" />
                                  <span>{formatMileage(vehicle.odometer)}</span>
                                </div>
                              )}
                              {vehicle.fuel && (
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                  <Car className="h-4 w-4 text-slate-400" />
                                  <span className="truncate">{vehicle.fuel}</span>
                                </div>
                              )}
                              {vehicle.exterior_color && (
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                  <div
                                    className="h-4 w-4 rounded-full border border-slate-300"
                                    style={{ backgroundColor: vehicle.exterior_color.toLowerCase() }}
                                  />
                                  <span className="truncate">{vehicle.exterior_color}</span>
                                </div>
                              )}
                            </div>

                            {vehicle.dealer_name && (
                              <div className="flex items-center gap-2 mt-3 text-sm text-slate-600">
                                <MapPin className="h-4 w-4 text-slate-400" />
                                <span className="truncate">
                                  {vehicle.dealer_name}
                                  {vehicle.dealer_city && ` • ${vehicle.dealer_city}`}
                                </span>
                              </div>
                            )}

                            <div className="flex items-center gap-2 mt-4">
                              <Button
                                onClick={() => handleViewDetails(vehicle)}
                                className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
                              >
                                View Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}

