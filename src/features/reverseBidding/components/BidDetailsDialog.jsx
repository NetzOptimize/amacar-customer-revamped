import { AnimatePresence, motion } from 'framer-motion';

export default function BidDetailsDialog({ open, bid, onClose, onAccept }) {
    return (
        <AnimatePresence>
            {open && bid && (
                <motion.div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
                    <motion.div
                        onClick={(e) => e.stopPropagation()}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ type: 'spring', damping: 24, stiffness: 280 }}
                        className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden"
                    >
                        <div className="flex items-center justify-between p-4 border-b">
                            <div className="font-semibold">{bid.dealerName}</div>
                            <button className="cursor-pointer px-2 py-1" onClick={onClose}>✕</button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-center gap-4">
                                <img src={bid.dealerLogo} alt="logo" className="w-16 h-16 rounded-lg object-cover" />
                                <div>
                                    <div className="font-semibold">{bid.dealerName}</div>
                                    <div className="text-sm text-neutral-600">{bid.location}</div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="rounded-lg border p-4">
                                    <div className="text-neutral-500 text-sm">Current Offer</div>
                                    <div className="text-2xl font-bold">${bid.currentOffer.toLocaleString()}</div>
                                </div>
                                <div className="rounded-lg border p-4">
                                    <div className="text-neutral-500 text-sm">Estimated Savings</div>
                                    <div className="text-2xl font-bold text-green-600">${(bid.savings || 0).toLocaleString()}</div>
                                </div>
                            </div>
                            <div>
                                <div className="text-sm font-semibold mb-2">What's Included</div>
                                <ul className="list-disc pl-5 text-sm text-neutral-700">
                                    {(bid.perks || []).map((p, i) => <li key={i}>{p}</li>)}
                                </ul>
                            </div>
                            {bid.notes && (
                                <div className="rounded-lg bg-neutral-50 border p-4 text-sm text-neutral-700">{bid.notes}</div>
                            )}
                        </div>
                        <div className="p-4 border-t flex items-center justify-between">
                            <button className="cursor-pointer px-3 py-2 rounded-lg border" onClick={onClose}>Close</button>
                            <button className="cursor-pointer px-3 py-2 rounded-lg bg-neutral-900 text-white" onClick={() => onAccept(bid)}>Accept Offer</button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}


