import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import LeaderboardTable from '../components/LeaderboardTable';
import BidDetailsDialog from '../components/BidDetailsDialog';
import AcceptConfirmDialog from '../components/AcceptConfirmDialog';
import CertificateDialog from '../components/CertificateDialog';
import { acceptBidThunk, simulateLiveBidsThunk } from '../redux/reverseBidSlice';
import { generateCertificatePDF } from '../utils/pdfGenerator';

export default function SessionPage() {
    const { sessionId } = useParams();
    const dispatch = useDispatch();
    const { activeSession, loading } = useSelector((s) => s.reverseBid);
    const [viewBid, setViewBid] = useState(null);
    const [confirmBid, setConfirmBid] = useState(null);
    const [showCert, setShowCert] = useState(false);

    useEffect(() => {
        if (activeSession?.id === sessionId && activeSession.status === 'active') {
            dispatch(simulateLiveBidsThunk(sessionId));
        }
    }, [dispatch, sessionId, activeSession?.id, activeSession?.status]);

    const rows = useMemo(() => activeSession?.leaderboard || [], [activeSession]);

    const onAcceptFlow = (bid) => {
        setConfirmBid(bid);
    };

    const onConfirmAccept = async () => {
        if (!confirmBid) return;
        const res = await dispatch(acceptBidThunk({ sessionId, bidId: confirmBid.id }));
        if (res?.payload?.certificate) {
            setConfirmBid(null);
            setShowCert(true);
        }
    };

    const downloadPDF = async () => {
        await generateCertificatePDF({ id: activeSession.id, car: activeSession.car, acceptedBid: activeSession.acceptedBid });
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="min-h-screen">
            <div className="border-b border-neutral-200 bg-gradient-to-r from-neutral-50 to-white px-6 py-8">
                <div className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium animate-pulse">● Live Session</div>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mt-3">Reverse Bidding Session</h1>
                <p className="text-neutral-600 mt-2">{rows.length} dealers competing • Accept any offer anytime</p>
                {activeSession?.car && (
                    <div className="mt-6 p-4 flex items-center gap-4 rounded-xl border bg-white max-w-xl">
                        <img src={activeSession.car.images?.[0]} className="w-24 h-24 rounded-lg object-cover" />
                        <div>
                            <div className="font-semibold">{activeSession.car.year} {activeSession.car.make} {activeSession.car.model}</div>
                            <div className="text-sm text-neutral-600">Session #{activeSession.id}</div>
                        </div>
                    </div>
                )}
            </div>
            <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
                <LeaderboardTable rows={rows} onView={setViewBid} onAccept={onAcceptFlow} />
            </div>

            <BidDetailsDialog open={!!viewBid} bid={viewBid} onClose={() => setViewBid(null)} onAccept={onAcceptFlow} />
            <AcceptConfirmDialog open={!!confirmBid} bid={confirmBid} onCancel={() => setConfirmBid(null)} onConfirm={onConfirmAccept} loading={loading.acceptance} />
            <CertificateDialog open={showCert} session={activeSession} onDownload={downloadPDF} onContinue={() => setShowCert(false)} onClose={() => setShowCert(false)} />
        </motion.div>
    );
}


