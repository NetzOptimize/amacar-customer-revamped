import { AnimatePresence, motion } from 'framer-motion';

export default function CertificateDialog({ open, session, onDownload, onContinue, onClose }) {
    return (
        <AnimatePresence>
            {open && (
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
                            <div className="font-semibold">✅ Offer Accepted!</div>
                            <button className="cursor-pointer px-2 py-1" onClick={onClose}>✕</button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="text-lg font-semibold">Your Reverse Bidding Certificate</div>
                            <div className="rounded-xl border p-5">
                                <div className="text-center text-xl font-bold">AMACAR REVERSE BIDDING</div>
                                <div className="text-center text-sm mb-4">CERTIFICATE OF ACCEPTANCE</div>
                                <div className="text-sm space-y-1">
                                    <div>Session ID: {session?.id}</div>
                                    <div>Date: {new Date().toLocaleDateString()}</div>
                                    {session?.acceptedBid && (
                                        <>
                                            <div>Dealer: {session.acceptedBid.dealerName}</div>
                                            <div>Final Price: ${session.acceptedBid.currentOffer.toLocaleString()}</div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="p-4 border-t flex items-center justify-between">
                            <button className="cursor-pointer px-3 py-2 rounded-lg border" onClick={onDownload}>Download PDF</button>
                            <button className="cursor-pointer px-3 py-2 rounded-lg bg-neutral-900 text-white" onClick={onContinue}>Continue →</button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}


