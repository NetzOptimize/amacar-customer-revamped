import { AnimatePresence, motion } from 'framer-motion';
import { X, CheckCircle2, Building2, DollarSign, AlertTriangle, Loader2 } from 'lucide-react';

export default function AcceptConfirmDialog({ open, bid, onCancel, onConfirm, loading }) {
    if (!open || !bid) return null;

    return (
        <AnimatePresence>
            {open && bid && (
                <motion.div
                    key="accept-confirm-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4"
                    onClick={onCancel}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-2 sm:mx-0 border-2 border-orange-200/50 overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header with gradient background */}
                        <div className="bg-gradient-to-r from-orange-50 to-orange-100/50 p-4 sm:p-5 border-b border-orange-200/50">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center border-2 border-orange-200">
                                        <CheckCircle2 className="w-6 h-6 text-orange-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-neutral-900">Confirm Offer Acceptance</h2>
                                    </div>
                                </div>
                                <button
                                    onClick={onCancel}
                                    disabled={loading}
                                    className="cursor-pointer p-2 rounded-lg hover:bg-white/50 transition-colors duration-200 disabled:opacity-50"
                                >
                                    <X className="w-5 h-5 text-neutral-600" />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-5 sm:p-6 space-y-4 bg-gradient-to-b from-white to-neutral-50/30">


                            {/* Bid Details Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15 }}
                                className="relative overflow-hidden rounded-xl border-2 border-orange-200/50 bg-gradient-to-br from-orange-50/50 to-white p-5 shadow-lg"
                            >
                                <div className="absolute top-0 right-0 w-24 h-24 bg-orange-200/10 rounded-full -mr-12 -mt-12"></div>
                                <div className="relative space-y-3">
                                    {/* Dealer Info */}
                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/60 border border-orange-100">
                                        <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                                            <Building2 className="w-5 h-5 text-orange-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-0.5">Dealer</div>
                                            <div className="font-bold text-neutral-900 truncate">{bid.dealerName}</div>
                                        </div>
                                    </div>

                                    {/* Offer Amount */}
                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/60 border border-orange-100">
                                        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                                            <DollarSign className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-0.5">Current Offer</div>
                                            <div className="text-2xl font-bold text-green-600">
                                                ${bid.currentOffer.toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Warning Message */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 border border-amber-200"
                            >
                                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-amber-800 leading-relaxed">
                                    <span className="font-semibold">Important:</span> Accepting this offer will close bidding for all other dealers. This action cannot be undone.
                                </p>
                            </motion.div>
                        </div>

                        {/* Footer with Action Buttons */}
                        <div className="p-5 border-t border-neutral-200 bg-white flex flex-col sm:flex-row items-center justify-end gap-3">
                            <button
                                onClick={onCancel}
                                disabled={loading}
                                className="cursor-pointer px-6 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl font-medium transition-all duration-200 w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Go Back
                            </button>
                            <button
                                onClick={onConfirm}
                                disabled={loading}
                                className="cursor-pointer px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 w-full sm:w-auto hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Accepting…</span>
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 className="w-4 h-4" />
                                        <span>Confirm Accept</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}


