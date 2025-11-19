import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Clock,
    Users,
    DollarSign,
    MapPin,
    Eye,
    ArrowRight,
    Sparkles,
    Timer,
    Award,
    Car,
    AlertCircle,
    RefreshCw
} from 'lucide-react';
import { fetchReverseBidsThunk } from '../redux/reverseBidSlice';
import LiveAuctionsSkeleton from '../../../components/skeletons/LiveAuctionsSkeleton';

export default function ReverseBidsPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { reverseBids, loading } = useSelector((s) => s.reverseBid);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    useEffect(() => {
        dispatch(fetchReverseBidsThunk({ page: currentPage, per_page: itemsPerPage }));
    }, [dispatch, currentPage]);

    const formatTime = (seconds) => {
        if (!seconds || seconds <= 0) return '00:00:00';
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const handleViewSession = (sessionId) => {
        navigate(`/reverse-bidding/session/${sessionId}`);
    };

    const handleRefresh = () => {
        dispatch(fetchReverseBidsThunk({ page: currentPage, per_page: itemsPerPage }));
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading.reverseBids && reverseBids.data.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50">
                <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8" style={{ maxWidth: '1600px' }}>
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Reverse Bids</h1>
                        <p className="text-neutral-600">Active sessions with available bids</p>
                    </div>
                    <LiveAuctionsSkeleton count={6} />
                </div>
            </div>
        );
    }

    const bids = reverseBids.data || [];
    const pagination = reverseBids.pagination || {};

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50"
        >
            <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8" style={{ maxWidth: '1600px' }}>
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-neutral-900 mb-2 flex items-center gap-3">
                                <Sparkles className="w-8 h-8 text-orange-500" />
                                Reverse Bids
                            </h1>
                            <p className="text-neutral-600">
                                Active sessions with available bids that haven't been accepted yet
                            </p>
                        </div>
                        <button
                            onClick={handleRefresh}
                            disabled={loading.reverseBids}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading.reverseBids ? 'animate-spin' : ''}`} />
                            <span className="text-sm font-medium">Refresh</span>
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-6 text-sm text-neutral-600">
                        <span className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            {pagination.total_items || 0} Total Bids
                        </span>
                        <span className="flex items-center gap-2">
                            <Car className="w-4 h-4" />
                            {new Set(bids.map(bid => bid.session_id)).size} Active Sessions
                        </span>
                    </div>
                </div>

                {/* Bids Grid */}
                {bids.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {bids.map((bid, index) => {
                                const session = bid.session || {};
                                const product = bid.product || {};
                                const timeRemaining = session.time_remaining || {};
                                const location = session.location || {};

                                return (
                                    <motion.div
                                        key={bid.bid_id || index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="bg-white rounded-xl border border-neutral-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
                                    >
                                        {/* Vehicle Image */}
                                        {session.primary_vehicle_image && (
                                            <div className="relative h-48 bg-neutral-100 overflow-hidden">
                                                <img
                                                    src={session.primary_vehicle_image}
                                                    alt="Vehicle"
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                                {timeRemaining.seconds > 0 && (
                                                    <div className="absolute top-3 right-3 bg-orange-500 text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-semibold shadow-lg">
                                                        <Timer className="w-3 h-3" />
                                                        {formatTime(timeRemaining.seconds)}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <div className="p-5">
                                            {/* Vehicle Info */}
                                            <div className="mb-4">
                                                <h3 className="text-lg font-semibold text-neutral-900 mb-1">
                                                    {product.year} {product.make} {product.model}
                                                </h3>
                                                {location.city && location.state && (
                                                    <p className="text-sm text-neutral-500 flex items-center gap-1">
                                                        <MapPin className="w-3.5 h-3.5" />
                                                        {location.city}, {location.state}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Bid Amount */}
                                            <div className="mb-4 p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-xs text-orange-700 font-medium mb-1">Bid Amount</p>
                                                        <p className="text-2xl font-bold text-orange-900">
                                                            {formatCurrency(bid.amount)}
                                                        </p>
                                                    </div>
                                                    <Award className="w-8 h-8 text-orange-500" />
                                                </div>
                                            </div>

                                            {/* Dealer Info */}
                                            <div className="mb-4 pb-4 border-b border-neutral-200">
                                                <p className="text-xs text-neutral-500 mb-1">Dealer</p>
                                                <p className="text-sm font-medium text-neutral-900">
                                                    {bid.dealer_name || 'Unknown Dealer'}
                                                </p>
                                            </div>

                                            {/* Session Info */}
                                            <div className="mb-4 space-y-2 text-sm">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-neutral-500">Session ID</span>
                                                    <span className="font-medium text-neutral-900">#{session.id}</span>
                                                </div>
                                                {bid.perks && Object.keys(bid.perks).length > 0 && (
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-neutral-500">Perks:</span>
                                                        <span className="text-orange-600 font-medium">Available</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Action Button */}
                                            <button
                                                onClick={() => handleViewSession(session.id)}
                                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                                            >
                                                <Eye className="w-4 h-4" />
                                                View Session
                                                <ArrowRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Pagination */}
                        {pagination.total_pages > 1 && (
                            <div className="flex items-center justify-center gap-2">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={!pagination.has_prev || loading.reverseBids}
                                    className="px-4 py-2 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                >
                                    Previous
                                </button>
                                <span className="px-4 py-2 text-sm text-neutral-600">
                                    Page {pagination.current_page} of {pagination.total_pages}
                                </span>
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={!pagination.has_next || loading.reverseBids}
                                    className="px-4 py-2 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="bg-white rounded-2xl border-2 border-neutral-200 shadow-xl p-16 text-center">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="w-24 h-24 bg-gradient-to-br from-orange-100 to-orange-50 rounded-full flex items-center justify-center mb-6 shadow-lg mx-auto"
                        >
                            <AlertCircle className="w-12 h-12 text-orange-500" />
                        </motion.div>
                        <h3 className="text-2xl font-bold text-neutral-900 mb-3">No Reverse Bids Available</h3>
                        <p className="text-base text-neutral-600 max-w-lg mx-auto mb-6">
                            There are currently no active reverse bids. Check back later or start a new reverse bidding session.
                        </p>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

