import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import LeaderboardTable from '../components/LeaderboardTable';
import BidDetailsDialog from '../components/BidDetailsDialog';
import AcceptConfirmDialog from '../components/AcceptConfirmDialog';
import CertificateDialog from '../components/CertificateDialog';
import AppointmentModal from '../../../components/ui/AppointmentModal';
import { acceptBidThunk, simulateLiveBidsThunk } from '../redux/reverseBidSlice';
import { generateCertificatePDF } from '../utils/pdfGenerator';

export default function SessionPage() {
    const { sessionId } = useParams();
    const dispatch = useDispatch();
    const { activeSession, loading } = useSelector((s) => s.reverseBid);
    const [viewBid, setViewBid] = useState(null);
    const [confirmBid, setConfirmBid] = useState(null);
    const [showCert, setShowCert] = useState(false);
    const [showAppointmentModal, setShowAppointmentModal] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(4 * 60 * 60); // 4 hours in seconds

    // Initialize timer when session starts
    useEffect(() => {
        if (activeSession?.id === sessionId && activeSession.status === 'active') {
            // Reset timer to 4 hours when session becomes active
            setTimeRemaining(4 * 60 * 60);
        }
    }, [activeSession?.id, activeSession?.status, sessionId]);

    // Countdown timer
    useEffect(() => {
        if (timeRemaining <= 0) return;

        const timer = setInterval(() => {
            setTimeRemaining((prev) => {
                if (prev <= 1) return 0;
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeRemaining]);

    useEffect(() => {
        if (activeSession?.id === sessionId && activeSession.status === 'active') {
            dispatch(simulateLiveBidsThunk(sessionId));
        }
    }, [dispatch, sessionId, activeSession?.id, activeSession?.status]);

    const rows = useMemo(() => activeSession?.leaderboard || [], [activeSession]);

    const onAcceptFlow = (bid) => {
        setConfirmBid(bid);
        setViewBid(null); // Close BidDetailsDialog when opening AcceptConfirmDialog
    };

    const onConfirmAccept = async () => {
        if (!confirmBid) return;
        const res = await dispatch(acceptBidThunk({ sessionId, bidId: confirmBid.id }));
        if (res?.payload?.certificate) {
            setConfirmBid(null);
            setViewBid(null); // Ensure BidDetailsDialog is closed
            setShowCert(true);
        }
    };

    const downloadPDF = async () => {
        await generateCertificatePDF({ id: activeSession.id, car: activeSession.car, acceptedBid: activeSession.acceptedBid });
        // Open appointment modal after PDF download
        setShowCert(false);
        setShowAppointmentModal(true);
    };

    const handleContinue = () => {
        // Close certificate dialog and open appointment modal
        setShowCert(false);
        setShowAppointmentModal(true);
    };

    const handleAppointmentClose = (open) => {
        if (!open) {
            setShowAppointmentModal(false);
        }
    };

    const handleAppointmentSubmit = () => {
        // After appointment is scheduled, close the modal
        setShowAppointmentModal(false);
    };

    // Get vehicle info for appointment modal
    const vehicleInfo = activeSession?.car
        ? `${activeSession.car.year} ${activeSession.car.make} ${activeSession.car.model}`
        : 'Vehicle';

    // Get dealer info from accepted bid
    const dealerName = activeSession?.acceptedBid?.dealerName || 'Dealer';
    const dealerId = activeSession?.acceptedBid?.id || activeSession?.acceptedBid?.dealerId || '';
    const dealerEmail = activeSession?.acceptedBid?.dealerEmail || 'contact@dealer.com';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="min-h-screen bg-gradient-to-b from-neutral-50 to-white"
        >
            {/* Header Section */}
            <div className="border-b border-neutral-200 bg-gradient-to-r from-white via-neutral-50 to-white pt-[calc(var(--header-height-mobile)+2rem)] sm:pt-[calc(var(--header-height-tablet)+2rem)] lg:pt-[calc(var(--header-height-desktop)+2rem)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <div className="w-full">
                            <div className="flex items-center justify-between">
                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900 mb-2">
                                    Reverse Bidding Session
                                </h1>
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50 text-green-700 text-xs font-semibold shadow-sm animate-pulse">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                    </span>
                                    Live Session
                                </div>
                            </div>
                            <p className="text-neutral-600 text-base sm:text-lg">
                                {rows.length} dealers competing
                            </p>
                        </div>
                    </div>

                    {/* Vehicle Card */}
                    {activeSession?.car && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="relative overflow-hidden rounded-2xl border border-neutral-200/50 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-transparent to-transparent pointer-events-none"></div>
                            <div className="relative p-6 flex items-center gap-6">
                                <div className="relative flex-shrink-0">
                                    <img
                                        src={activeSession.car.images?.[0]}
                                        className="w-28 h-28 sm:w-32 sm:h-32 rounded-xl object-cover border-2 border-neutral-100 shadow-md"
                                        alt={`${activeSession.car.year} ${activeSession.car.make} ${activeSession.car.model}`}
                                    />
                                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-500 rounded-full border-2 border-white"></div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-1">
                                        {activeSession.car.year} {activeSession.car.make} {activeSession.car.model}
                                    </div>
                                    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-lg bg-neutral-100 text-neutral-600 text-sm font-medium">
                                        <span className="text-xs font-semibold text-neutral-500">Session ID:</span>
                                        <span className="font-mono">{activeSession.id}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Leaderboard Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <LeaderboardTable rows={rows} onView={setViewBid} onAccept={onAcceptFlow} timeRemaining={timeRemaining} />
                </motion.div>
            </div>

            <BidDetailsDialog open={!!viewBid} bid={viewBid} onClose={() => setViewBid(null)} onAccept={onAcceptFlow} />
            <AcceptConfirmDialog open={!!confirmBid} bid={confirmBid} onCancel={() => setConfirmBid(null)} onConfirm={onConfirmAccept} loading={loading.acceptance} />
            <CertificateDialog
                open={showCert}
                session={activeSession}
                onDownload={downloadPDF}
                onContinue={handleContinue}
                onClose={() => setShowCert(false)}
            />
            {showAppointmentModal && (
                <AppointmentModal
                    isOpen={showAppointmentModal}
                    onClose={handleAppointmentClose}
                    onParentClose={handleAppointmentClose}
                    dealerName={dealerName}
                    dealerId={dealerId}
                    dealerEmail={dealerEmail}
                    vehicleInfo={vehicleInfo}
                    onAppointmentSubmit={handleAppointmentSubmit}
                    title="Schedule Your Appointment"
                    description={`Now that your offer of ${activeSession?.acceptedBid?.currentOffer ? `$${activeSession.acceptedBid.currentOffer.toLocaleString()}` : 'N/A'} has been accepted, let's schedule your appointment to complete the transaction.`}
                />
            )}
        </motion.div>
    );
}


