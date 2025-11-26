import { AnimatePresence, motion } from 'framer-motion';
import { X, CheckCircle2, Download, ArrowRight, FileText, Calendar, Building2, DollarSign, Hash, Bug } from 'lucide-react';
import { useSelector } from 'react-redux';
import { generateCertificatePDFFromSession } from '../utils/pdfGenerator';

export default function CertificateDialog({ open, session, onDownload, onContinue, onClose }) {
    const { user } = useSelector((s) => s.user);
    if (!open) return null;

    // Debug function to download certificate directly
    const handleDebugDownload = async () => {
        try {
            console.log('Debug: Downloading certificate with session data:', session);
            await generateCertificatePDFFromSession(session, user);
            console.log('Debug: Certificate downloaded successfully');
        } catch (error) {
            console.error('Debug: Error downloading certificate:', error);
            alert('Error generating certificate. Check console for details.');
        }
    };

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    key="certificate-dialog-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-2 sm:mx-0 border-2 border-green-200/50 overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header with Success Icon */}
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 sm:p-5 border-b border-green-200/50">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
                                        <CheckCircle2 className="w-7 h-7 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-neutral-900">Offer Accepted!</h2>
                                        <p className="text-sm text-neutral-600">Your certificate is ready</p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="cursor-pointer p-2 rounded-lg hover:bg-white/50 transition-colors duration-200"
                                >
                                    <X className="w-5 h-5 text-neutral-600" />
                                </button>
                            </div>
                        </div>

                        {/* Compact Certificate */}
                        <div className="p-5 sm:p-6 space-y-4">
                            <div className="relative overflow-hidden rounded-xl border-2 border-green-200/50 bg-gradient-to-br from-green-50/50 to-white p-5 shadow-lg">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-green-200/10 rounded-full -mr-16 -mt-16"></div>
                                <div className="absolute bottom-0 left-0 w-24 h-24 bg-green-200/10 rounded-full -ml-12 -mb-12"></div>

                                <div className="relative space-y-4">
                                    {/* Certificate Header */}
                                    <div className="text-center border-b border-green-200/50 pb-3">
                                        <FileText className="w-8 h-8 text-green-600 mx-auto mb-2" />
                                        <div className="text-lg font-bold text-green-700">AMACAR</div>
                                        <div className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">Certificate of Acceptance</div>
                                    </div>

                                    {/* Certificate Details - Compact Grid */}
                                    <div className="grid grid-cols-1 gap-3 text-sm">
                                        {session?.acceptedBid && (
                                            <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/60 border border-green-100">
                                                <div className="flex items-center gap-2 text-neutral-600">
                                                    <DollarSign className="w-4 h-4" />
                                                    <span className="font-medium">Final Price</span>
                                                </div>
                                                <span className="font-bold text-green-700 text-base">
                                                    ${session.acceptedBid.currentOffer.toLocaleString()}
                                                </span>
                                            </div>
                                        )}

                                        {session?.acceptedBid && (
                                            <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/60 border border-green-100">
                                                <div className="flex items-center gap-2 text-neutral-600">
                                                    <Building2 className="w-4 h-4" />
                                                    <span className="font-medium">Dealer</span>
                                                </div>
                                                <span className="font-semibold text-neutral-900 text-right max-w-[60%] truncate">
                                                    {session.acceptedBid.dealerName}
                                                </span>
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/60 border border-green-100">
                                            <div className="flex items-center gap-2 text-neutral-600">
                                                <Hash className="w-4 h-4" />
                                                <span className="font-medium">Session ID</span>
                                            </div>
                                            <span className="font-mono text-xs font-semibold text-neutral-700">
                                                {session?.id}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/60 border border-green-100">
                                            <div className="flex items-center gap-2 text-neutral-600">
                                                <Calendar className="w-4 h-4" />
                                                <span className="font-medium">Date</span>
                                            </div>
                                            <span className="font-semibold text-neutral-700">
                                                {new Date().toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer with Actions */}
                        <div className="p-5 border-t border-neutral-200 bg-white space-y-3">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                                <button
                                    onClick={onDownload}
                                    className="cursor-pointer px-5 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 w-full sm:w-auto"
                                >
                                    <Download className="w-4 h-4" />
                                    Download PDF
                                </button>
                                <button
                                    onClick={onContinue}
                                    className="cursor-pointer px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 w-full sm:w-auto hover:shadow-lg transform hover:scale-105"
                                >
                                    Continue
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                            {/* Debug Button */}
                            <button
                                onClick={handleDebugDownload}
                                className="w-full px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 text-sm border border-purple-300"
                                title="Debug: Direct PDF download (bypasses normal flow)"
                            >
                                <Bug className="w-4 h-4" />
                                Debug: Download Certificate
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}


