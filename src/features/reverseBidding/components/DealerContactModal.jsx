import { AnimatePresence, motion } from 'framer-motion';
import { X, Mail, Phone, Building2 } from 'lucide-react';

export default function DealerContactModal({ open, onClose, dealerContact, vehicleInfo }) {
    if (!open || !dealerContact) return null;

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
                        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
                            {/* Header */}
                            <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-white">Contact Dealer</h2>
                                <button
                                    onClick={onClose}
                                    className="p-1.5 rounded-lg hover:bg-white/20 transition-colors text-white"
                                    aria-label="Close"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-6">
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
                                {dealerContact.name && (
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 rounded-lg bg-orange-100">
                                            <Building2 className="w-5 h-5 text-orange-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-neutral-600 mb-1">Dealer</p>
                                            <p className="text-base font-semibold text-neutral-900">{dealerContact.name}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Email */}
                                {dealerContact.email && (
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 rounded-lg bg-blue-100">
                                            <Mail className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-neutral-600 mb-1">Email</p>
                                            <a
                                                href={`mailto:${dealerContact.email}`}
                                                className="text-base font-medium text-blue-600 hover:text-blue-700 hover:underline break-all"
                                            >
                                                {dealerContact.email}
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {/* Phone */}
                                {dealerContact.phone && (
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 rounded-lg bg-green-100">
                                            <Phone className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-neutral-600 mb-1">Phone</p>
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
                                {!dealerContact.email && !dealerContact.phone && (
                                    <div className="text-center py-4">
                                        <p className="text-sm text-neutral-500">
                                            Contact information not available for this dealer.
                                        </p>
                                    </div>
                                )}

                                {/* Footer */}
                                <div className="pt-4 border-t border-neutral-200">
                                    <button
                                        onClick={onClose}
                                        className="w-full bg-neutral-900 text-white py-3 px-4 rounded-lg font-semibold hover:bg-neutral-800 transition-colors"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

