import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    CheckCircle2,
    Users,
    DollarSign,
    MapPin,
    Eye,
    ArrowRight,
    Calendar,
    Award,
    Car,
    AlertCircle,
    RefreshCw,
    FileText,
    Bug
} from 'lucide-react';
import { fetchAcceptedReverseBidsThunk } from '../redux/reverseBidSlice';
import { generateCertificatePDFFromSession } from '../utils/pdfGenerator';
import AcceptedBidsSkeleton from '../../../components/skeletons/AcceptedBidsSkeleton';

export default function AcceptedReverseBidsPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { acceptedReverseBids, loading } = useSelector((s) => s.reverseBid);
    const { user } = useSelector((s) => s.user);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    useEffect(() => {
        dispatch(fetchAcceptedReverseBidsThunk({ page: currentPage, per_page: itemsPerPage }));
    }, [dispatch, currentPage]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleViewSession = (sessionId) => {
        navigate(`/reverse-bidding/session/${sessionId}`);
    };

    const handleRefresh = () => {
        dispatch(fetchAcceptedReverseBidsThunk({ page: currentPage, per_page: itemsPerPage }));
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Debug function to download certificate for a specific bid
    const handleDebugDownload = async (bid) => {
        try {
            const session = bid.session || {};
            const product = bid.product || {};
            const location = session.location || {};
            
            // Build session object for PDF generation
            const sessionForPDF = {
                id: session.id,
                car: {
                    year: product.year,
                    make: product.make,
                    model: product.model,
                    title: `${product.year} ${product.make} ${product.model}`,
                    vin: product.vin || session.vin || '',
                    stock: product.stock || product.stock_number || product.sku || '',
                    images: session.primary_vehicle_image ? [session.primary_vehicle_image] : []
                },
                acceptedBid: {
                    currentOffer: bid.amount,
                    dealerName: bid.dealer_name || 'Unknown Dealer',
                    dealer_phone: bid.dealer_phone || '',
                    dealerEmail: bid.dealer_email || '',
                    dealerLocation: location.city && location.state ? `${location.city}, ${location.state}` : ''
                },
                certificateData: {
                    vehicle: {
                        year: product.year,
                        make: product.make,
                        model: product.model,
                        vin: product.vin || session.vin || '',
                        stock: product.stock || product.stock_number || product.sku || '',
                        city: location.city || '',
                        state: location.state || ''
                    },
                    dealer: {
                        name: bid.dealer_name || 'Unknown Dealer',
                        phone: bid.dealer_phone || '',
                        email: bid.dealer_email || ''
                    },
                    bid_amount: bid.amount,
                    marketValue: session.criteria?.price || product.price || bid.amount,
                    onlineMarketValue: session.criteria?.price || product.price || bid.amount,
                    date: bid.accepted_at || new Date().toISOString()
                },
                criteria: session.criteria || {
                    price: session.criteria?.price || product.price || bid.amount
                }
            };
            
            console.log('Debug: Downloading certificate for bid:', bid);
            console.log('Debug: Session data for PDF:', sessionForPDF);
            await generateCertificatePDFFromSession(sessionForPDF, user);
            console.log('Debug: Certificate downloaded successfully');
        } catch (error) {
            console.error('Debug: Error downloading certificate:', error);
            alert('Error generating certificate. Check console for details.');
        }
    };

    if (loading.acceptedReverseBids && acceptedReverseBids.data.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50">
                <div className="mx-auto px-4 sm:px-6 lg:px-8 pt-[calc(var(--header-height-mobile)+1rem)] sm:pt-[calc(var(--header-height-tablet)+1rem)] lg:pt-[calc(var(--header-height-desktop)+2rem)] pb-8" style={{ maxWidth: '1600px' }}>
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Accepted Reverse Bids</h1>
                        <p className="text-neutral-600">All reverse bids you have accepted</p>
                    </div>
                    <AcceptedBidsSkeleton count={6} />
                </div>
            </div>
        );
    }

    const bids = acceptedReverseBids.data || [];
    const pagination = acceptedReverseBids.pagination || {};

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50"
        >
            <div className="mx-auto px-4 sm:px-6 lg:px-8 pt-[calc(var(--header-height-mobile)+1rem)] sm:pt-[calc(var(--header-height-tablet)+1rem)] lg:pt-[calc(var(--header-height-desktop)+2rem)] pb-8" style={{ maxWidth: '1600px' }}>
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-neutral-900 mb-2 flex items-center gap-3">
                                <CheckCircle2 className="w-8 h-8 text-green-500" />
                                Accepted Reverse Bids
                            </h1>
                            <p className="text-neutral-600">
                                All reverse bids that you have accepted
                            </p>
                        </div>
                        <button
                            onClick={handleRefresh}
                            disabled={loading.acceptedReverseBids}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading.acceptedReverseBids ? 'animate-spin' : ''}`} />
                            <span className="text-sm font-medium">Refresh</span>
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-6 text-sm text-neutral-600">
                        <span className="flex items-center gap-2">
                            <Award className="w-4 h-4" />
                            {pagination.total_items || 0} Accepted Bids
                        </span>
                        <span className="flex items-center gap-2">
                            <Car className="w-4 h-4" />
                            {new Set(bids.map(bid => bid.session_id)).size} Sessions
                        </span>
                    </div>
                </div>

                {/* Bids Grid */}
                {loading.acceptedReverseBids && bids.length === 0 ? (
                    <AcceptedBidsSkeleton count={6} />
                ) : loading.acceptedReverseBids && bids.length > 0 ? (
                    <AcceptedBidsSkeleton count={bids.length} />
                ) : bids.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {bids.map((bid, index) => {
                                const session = bid.session || {};
                                const product = bid.product || {};
                                const location = session.location || {};

                                return (
                                    <motion.div
                                        key={bid.bid_id || index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="bg-white rounded-xl border-2 border-green-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
                                    >
                                        {/* Accepted Badge */}
                                        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 flex items-center justify-center gap-2">
                                            <CheckCircle2 className="w-4 h-4" />
                                            <span className="text-sm font-semibold">Accepted</span>
                                        </div>

                                        {/* Vehicle Image */}
                                        {session.primary_vehicle_image && (
                                            <div className="relative h-48 bg-neutral-100 overflow-hidden">
                                                <img
                                                    src={session.primary_vehicle_image}
                                                    alt="Vehicle"
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
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

                                            {/* Accepted Amount */}
                                            <div className="mb-4 p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-xs text-green-700 font-medium mb-1">Accepted Amount</p>
                                                        <p className="text-2xl font-bold text-green-900">
                                                            {formatCurrency(bid.amount)}
                                                        </p>
                                                    </div>
                                                    <Award className="w-8 h-8 text-green-500" />
                                                </div>
                                            </div>

                                            {/* Dealer Info */}
                                            <div className="mb-4 pb-4 border-b border-neutral-200">
                                                <p className="text-xs text-neutral-500 mb-1">Dealer</p>
                                                <p className="text-sm font-medium text-neutral-900">
                                                    {bid.dealer_name || 'Unknown Dealer'}
                                                </p>
                                                {bid.dealer_email && (
                                                    <p className="text-xs text-neutral-500 mt-1">{bid.dealer_email}</p>
                                                )}
                                            </div>

                                            {/* Session Info */}
                                            <div className="mb-4 space-y-2 text-sm">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-neutral-500">Session ID</span>
                                                    <span className="font-medium text-neutral-900">#{session.id}</span>
                                                </div>
                                                {bid.accepted_at && (
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                                                        <span className="text-neutral-500">Accepted:</span>
                                                        <span className="font-medium text-neutral-900">
                                                            {formatDate(bid.accepted_at)}
                                                        </span>
                                                    </div>
                                                )}
                                                {bid.perks && Object.keys(bid.perks).length > 0 && (
                                                    <div className="flex items-center gap-2">
                                                        <FileText className="w-3.5 h-3.5 text-neutral-400" />
                                                        <span className="text-neutral-500">Perks:</span>
                                                        <span className="text-green-600 font-medium">Available</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="space-y-2">
                                                <button
                                                    onClick={() => handleViewSession(session.id)}
                                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    View Session
                                                    <ArrowRight className="w-4 h-4" />
                                                </button>
                                                {/* Debug Button - Commented out for now, will work on this later */}
                                                {/* <button
                                                    onClick={() => handleDebugDownload(bid)}
                                                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg font-medium transition-all duration-200 border border-purple-300 text-sm"
                                                    title="Debug: Download Certificate PDF"
                                                >
                                                    <Bug className="w-4 h-4" />
                                                    Debug: Download Certificate
                                                </button> */}
                                            </div>
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
                                    disabled={!pagination.has_prev || loading.acceptedReverseBids}
                                    className="px-4 py-2 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                >
                                    Previous
                                </button>
                                <span className="px-4 py-2 text-sm text-neutral-600">
                                    Page {pagination.current_page} of {pagination.total_pages}
                                </span>
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={!pagination.has_next || loading.acceptedReverseBids}
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
                            className="w-24 h-24 bg-gradient-to-br from-green-100 to-green-50 rounded-full flex items-center justify-center mb-6 shadow-lg mx-auto"
                        >
                            <AlertCircle className="w-12 h-12 text-green-500" />
                        </motion.div>
                        <h3 className="text-2xl font-bold text-neutral-900 mb-3">No Accepted Bids Yet</h3>
                        <p className="text-base text-neutral-600 max-w-lg mx-auto mb-6">
                            You haven't accepted any reverse bids yet. When you accept a bid from a reverse bidding session, it will appear here.
                        </p>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

