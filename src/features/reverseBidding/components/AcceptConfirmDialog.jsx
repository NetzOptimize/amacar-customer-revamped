import { AnimatePresence, motion } from 'framer-motion';

export default function AcceptConfirmDialog({ open, bid, onCancel, onConfirm, loading }) {
    return (
        <AnimatePresence>
            {open && bid && (
                <motion.div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onCancel}>
                    <motion.div
                        onClick={(e) => e.stopPropagation()}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ type: 'spring', damping: 24, stiffness: 280 }}
                        className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
                    >
                        <div className="p-6 space-y-3">
                            <div className="text-2xl">⚠️</div>
                            <div className="text-lg font-semibold">Confirm Offer Acceptance</div>
                            <div className="text-sm text-neutral-700">You're about to accept:</div>
                            <div className="rounded-lg border p-3 text-sm">
                                <div><span className="text-neutral-500">Dealer:</span> {bid.dealerName}</div>
                                <div><span className="text-neutral-500">Offer:</span> ${bid.currentOffer.toLocaleString()}</div>
                            </div>
                            <div className="text-xs text-neutral-500">This will close bidding for all other dealers.</div>
                        </div>
                        <div className="p-4 border-t flex items-center justify-between">
                            <button className="cursor-pointer px-3 py-2 rounded-lg border" onClick={onCancel}>Go Back</button>
                            <button className="cursor-pointer px-3 py-2 rounded-lg bg-neutral-900 text-white disabled:opacity-60" disabled={loading} onClick={onConfirm}>{loading ? 'Accepting…' : 'Confirm Accept'}</button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}


