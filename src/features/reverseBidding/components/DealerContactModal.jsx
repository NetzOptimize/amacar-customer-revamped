import { AnimatePresence, motion } from 'framer-motion';
import { X, Phone, Building2, MapPin, ArrowRight } from 'lucide-react';

export default function DealerContactModal({ open, onClose, dealerContact, vehicleInfo, onStartReverseBidding }) {
    if (!open || !dealerContact) return null;

    // Generate Google Maps URL from address
    const getGoogleMapsUrl = (address) => {
        if (!address) return null;
        const encodedAddress = encodeURIComponent(address);
        return `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    };

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
                            {/* Header */}
                            <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-5 flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-white">Dealer Information</h2>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-lg hover:bg-white/20 transition-colors text-white"
                                    aria-label="Close"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6 sm:p-8 space-y-5">
                                {/* Vehicle Info */}
                                {vehicleInfo && (
                                    <div className="pb-4 border-b border-neutral-200">
                                        <p className="text-sm text-neutral-600 mb-1">Vehicle</p>
                                        <p className="text-lg font-semibold text-neutral-900">
                                            {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model}
                                        </p>
                                        {vehicleInfo.series && (
                                            <p className="text-sm text-neutral-600 mt-1">Trim: {vehicleInfo.series}</p>
                                        )}
                                    </div>
                                )}

                                {/* Dealer Name */}
                                {dealerContact.dealership_name && (
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 rounded-lg bg-orange-100 flex-shrink-0">
                                            <Building2 className="w-6 h-6 text-orange-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-neutral-600 mb-1">Dealership</p>
                                            <p className="text-lg font-semibold text-neutral-900">{dealerContact.dealership_name}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Contact Name */}
                                {dealerContact.name && (
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 rounded-lg bg-orange-100 flex-shrink-0">
                                            <Building2 className="w-6 h-6 text-orange-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-neutral-600 mb-1">Contact Name</p>
                                            <p className="text-lg font-semibold text-neutral-900">{dealerContact.name}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Address - Clickable Google Maps Link */}
                                {dealerContact.address && (
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 rounded-lg bg-blue-100 flex-shrink-0">
                                            <MapPin className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-neutral-600 mb-1">Address</p>
                                            <a
                                                href={getGoogleMapsUrl(dealerContact.address)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-base font-medium text-blue-600 hover:text-blue-700 hover:underline break-words block"
                                            >
                                                {dealerContact.address}
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {/* Phone */}
                                {dealerContact.phone && (
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 rounded-lg bg-green-100 flex-shrink-0">
                                            <Phone className="w-6 h-6 text-green-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-neutral-600 mb-1">Contact Number</p>
                                            <a
                                                href={`tel:${dealerContact.phone}`}
                                                className="text-base font-medium text-green-600 hover:text-green-700 hover:underline"
                                            >
                                                {dealerContact.phone}
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {/* Message if no contact info */}
                                {!dealerContact.address && !dealerContact.phone && !dealerContact.name && !dealerContact.dealership_name && (
                                    <div className="text-center py-4">
                                        <p className="text-sm text-neutral-500">
                                            Contact information not available for this dealer.
                                        </p>
                                    </div>
                                )}

                                {/* Footer */}
                                <div className="pt-6 border-t border-neutral-200">
                                    {onStartReverseBidding ? (
                                        <button
                                            onClick={() => {
                                                onStartReverseBidding();
                                                onClose();
                                            }}
                                            className="w-full bg-neutral-900 text-white py-4 px-6 rounded-lg font-semibold hover:bg-neutral-800 transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02] flex items-center justify-center gap-2"
                                        >
                                            Start Reverse Bidding
                                            <ArrowRight className="w-5 h-5" />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={onClose}
                                            className="w-full bg-neutral-900 text-white py-4 px-6 rounded-lg font-semibold hover:bg-neutral-800 transition-colors"
                                        >
                                            Close
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

