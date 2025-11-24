import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    Clock, 
    Users, 
    TrendingDown, 
    Award, 
    Car, 
    MapPin, 
    Calendar,
    CheckCircle2,
    AlertCircle,
    Timer,
    DollarSign,
    Sparkles,
    ArrowLeft
} from 'lucide-react';
import LeaderboardTable from '../components/LeaderboardTable';
import BidDetailsDialog from '../components/BidDetailsDialog';
import AcceptConfirmDialog from '../components/AcceptConfirmDialog';
import CertificateDialog from '../components/CertificateDialog';
import AppointmentModal from '../../../components/ui/AppointmentModal';
import { acceptBidThunk, simulateLiveBidsThunk, fetchSessionDetailsThunk, fetchLeaderboardThunk } from '../redux/reverseBidSlice';
import { generateCertificatePDF } from '../utils/pdfGenerator';
import apiRev from '../../../lib/apiRev';

export default function SessionPage() {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { activeSession, loading } = useSelector((s) => s.reverseBid);
    const [viewBid, setViewBid] = useState(null);
    const [confirmBid, setConfirmBid] = useState(null);
    const [showCert, setShowCert] = useState(false);
    const [showAppointmentModal, setShowAppointmentModal] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [sessionData, setSessionData] = useState(null);
    const [primaryVehicle, setPrimaryVehicle] = useState(null);
    const [alternativeVehicles, setAlternativeVehicles] = useState([]);
    const [loadingVehicles, setLoadingVehicles] = useState(false);

    // Fetch vehicle details
    const fetchVehicleDetails = async (primaryId, alternativeIds = []) => {
        setLoadingVehicles(true);
        try {
            // Fetch primary vehicle
            const primaryResponse = await apiRev.get(`/vehicles/${primaryId}`);
            if (primaryResponse.data?.success && primaryResponse.data?.data) {
                setPrimaryVehicle(primaryResponse.data.data);
            }
            
            // Fetch alternative vehicles
            if (alternativeIds.length > 0) {
                const altPromises = alternativeIds.map(id => 
                    apiRev.get(`/vehicles/${id}`).catch(() => null)
                );
                const altResponses = await Promise.all(altPromises);
                const vehicles = altResponses
                    .filter(res => res?.data?.success && res?.data?.data)
                    .map(res => res.data.data);
                setAlternativeVehicles(vehicles);
            }
        } catch (err) {
            console.error('Error fetching vehicles:', err);
        } finally {
            setLoadingVehicles(false);
        }
    };

    // Fetch session details on component mount or when sessionId changes
    useEffect(() => {
        const fetchSessionData = async () => {
            if (!sessionId) return;
            
            try {
                const response = await apiRev.get(`/sessions/${sessionId}`);
                if (response.data?.success && response.data?.data) {
                    const data = response.data.data;
                    setSessionData(data);
                    
                    // Update time remaining from API
                    if (data.time_remaining) {
                        setTimeRemaining(data.time_remaining.seconds || 0);
                    }
                    
                    // Fetch vehicle details
                    if (data.primary_vehicle_id) {
                        fetchVehicleDetails(data.primary_vehicle_id, data.alternative_vehicle_ids || []);
                    }
                }
            } catch (err) {
                console.error('Error fetching session:', err);
            }
        };
        
        fetchSessionData();
    }, [sessionId]);

    // Set up SSE connection for real-time updates
    useEffect(() => {
        if (!sessionId) return;
        
        // Only connect if session is running
        if (sessionData?.status !== 'running') return;

        const token = localStorage.getItem('authToken');
        if (!token) {
            console.error('No auth token found for SSE connection');
            return;
        }

        // Build SSE URL with token as query parameter (EventSource doesn't support custom headers)
        const baseURL = import.meta.env.VITE_BASE_URL_REVERSE_BID || '';
        const sseUrl = `${baseURL}/sse/session/${sessionId}?token=${encodeURIComponent(token)}`;
        
        // Create EventSource connection
        const eventSource = new EventSource(sseUrl);
        let reconnectTimeout = null;
        let reconnectAttempts = 0;
        const maxReconnectAttempts = 5;
        let fallbackInterval = null;
        let isConnected = false;

        // Handle connection opened
        eventSource.onopen = () => {
            console.log('SSE connection opened for session', sessionId);
            reconnectAttempts = 0; // Reset on successful connection
            isConnected = true;
        };

        // Handle leaderboard updates
        eventSource.addEventListener('leaderboard_updated', (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.session_id === parseInt(sessionId) && data.leaderboard) {
                    // Update session data with new leaderboard
                    setSessionData(prev => ({
                        ...prev,
                        leaderboard: data.leaderboard,
                        total_bids: data.leaderboard?.length || 0
                    }));
                }
            } catch (err) {
                console.error('Error parsing leaderboard_updated event:', err);
            }
        });

        // Handle bid received
        eventSource.addEventListener('bid_received', (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.session_id === parseInt(sessionId)) {
                    // Refresh session data to get updated leaderboard
                    apiRev.get(`/sessions/${sessionId}`)
                        .then(response => {
                            if (response.data?.success && response.data?.data) {
                                setSessionData(response.data.data);
                                if (response.data.data.time_remaining) {
                                    setTimeRemaining(response.data.data.time_remaining.seconds || 0);
                                }
                            }
                        })
                        .catch(err => console.error('Error refreshing session after bid:', err));
                }
            } catch (err) {
                console.error('Error parsing bid_received event:', err);
            }
        });

        // Handle bid revised
        eventSource.addEventListener('bid_revised', (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.session_id === parseInt(sessionId)) {
                    // Refresh session data to get updated leaderboard
                    apiRev.get(`/sessions/${sessionId}`)
                        .then(response => {
                            if (response.data?.success && response.data?.data) {
                                setSessionData(response.data.data);
                                if (response.data.data.time_remaining) {
                                    setTimeRemaining(response.data.data.time_remaining.seconds || 0);
                                }
                            }
                        })
                        .catch(err => console.error('Error refreshing session after bid revision:', err));
                }
            } catch (err) {
                console.error('Error parsing bid_revised event:', err);
            }
        });

        // Handle session ended
        eventSource.addEventListener('session_ended', (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.session_id === parseInt(sessionId)) {
                    // Refresh session data to get final status
                    apiRev.get(`/sessions/${sessionId}`)
                        .then(response => {
                            if (response.data?.success && response.data?.data) {
                                setSessionData(response.data.data);
                            }
                        })
                        .catch(err => console.error('Error refreshing session after end:', err));
                }
            } catch (err) {
                console.error('Error parsing session_ended event:', err);
            }
        });

        // Handle connected event
        eventSource.addEventListener('connected', (event) => {
            console.log('SSE connected event received');
            isConnected = true;
        });

        // Handle disconnected event
        eventSource.addEventListener('disconnected', (event) => {
            console.log('SSE disconnected event received');
            isConnected = false;
        });

        // Handle heartbeat (keep connection alive)
        eventSource.addEventListener('heartbeat', (event) => {
            // Connection is alive, no action needed
        });

        // Handle connection errors
        eventSource.onerror = (error) => {
            // Only handle error if connection was previously open (to avoid handling initial connection errors)
            if (eventSource.readyState === EventSource.CLOSED) {
                console.error('SSE connection closed:', error);
                isConnected = false;
                
                // Close the connection
                eventSource.close();
                
                // Attempt to reconnect if we haven't exceeded max attempts
                if (reconnectAttempts < maxReconnectAttempts) {
                    reconnectAttempts++;
                    const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 10000); // Exponential backoff, max 10s
                    
                    reconnectTimeout = setTimeout(() => {
                        console.log(`Attempting to reconnect SSE (attempt ${reconnectAttempts}/${maxReconnectAttempts})...`);
                        // The effect will re-run when sessionData changes, creating a new connection
                        // For now, just refresh the session data to trigger re-render
                        apiRev.get(`/sessions/${sessionId}`)
                            .then(response => {
                                if (response.data?.success && response.data?.data) {
                                    setSessionData(response.data.data);
                                }
                            })
                            .catch(() => {});
                    }, delay);
                } else {
                    console.error('Max SSE reconnection attempts reached. Falling back to polling.');
                    // Fallback to polling if SSE fails completely
                    fallbackInterval = setInterval(async () => {
                        try {
                            const response = await apiRev.get(`/sessions/${sessionId}`);
                            if (response.data?.success && response.data?.data) {
                                setSessionData(response.data.data);
                                if (response.data.data.time_remaining) {
                                    setTimeRemaining(response.data.data.time_remaining.seconds || 0);
                                }
                            }
                        } catch (err) {
                            console.error('Error in fallback polling:', err);
                        }
                    }, 5000);
                }
            }
        };

        // Cleanup function
        return () => {
            if (reconnectTimeout) {
                clearTimeout(reconnectTimeout);
            }
            if (fallbackInterval) {
                clearInterval(fallbackInterval);
            }
            eventSource.close();
            console.log('SSE connection closed for session', sessionId);
        };
    }, [sessionId, sessionData?.status]);

    // Update timer from session data
    useEffect(() => {
        if (sessionData?.time_remaining) {
            setTimeRemaining(sessionData.time_remaining.seconds || 0);
        } else if (sessionData?.end_at) {
            const endTime = new Date(sessionData.end_at).getTime();
            const now = Date.now();
            const remaining = Math.max(0, Math.floor((endTime - now) / 1000));
            setTimeRemaining(remaining);
        }
    }, [sessionData]);

    // Countdown timer
    useEffect(() => {
        if (timeRemaining <= 0 || sessionData?.status !== 'running') return;

        const timer = setInterval(() => {
            setTimeRemaining((prev) => {
                if (prev <= 1) return 0;
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeRemaining, sessionData?.status]);

    // Note: Commented out simulateLiveBidsThunk as we're using real API now
    // If you want to keep simulated updates for testing, uncomment this:
    // useEffect(() => {
    //     if (activeSession?.id === sessionId && (activeSession.status === 'active' || activeSession.status === 'running')) {
    //         dispatch(simulateLiveBidsThunk(sessionId));
    //     }
    // }, [dispatch, sessionId, activeSession?.id, activeSession?.status]);

    // Parse perks into an array of objects for beautiful display
    const parsePerks = (perks) => {
        if (!perks) return [];
        
        if (typeof perks === 'string') {
            try {
                const parsed = JSON.parse(perks);
                if (typeof parsed === 'object' && parsed !== null) {
                    const result = [];
                    Object.entries(parsed).forEach(([key, value]) => {
                        if (value !== null && value !== '') {
                            const formattedKey = key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');
                            const valueStr = String(value);
                            
                            // Check if value contains commas (comma-separated list)
                            if (valueStr.includes(',')) {
                                // Split by comma and create individual perks
                                const items = valueStr.split(',').map(item => item.trim()).filter(item => item);
                                items.forEach(item => {
                                    result.push({
                                        label: formattedKey,
                                        value: item
                                    });
                                });
                            } else {
                                result.push({
                                    label: formattedKey,
                                    value: valueStr
                                });
                            }
                        }
                    });
                    return result;
                }
                // If it's just a plain string, check if it has commas
                if (perks.includes(',')) {
                    return perks.split(',').map(item => ({
                        label: 'Benefit',
                        value: item.trim()
                    })).filter(item => item.value);
                }
                return [{ label: 'Benefit', value: perks.trim() }];
            } catch {
                // If parsing fails, check if it's comma-separated
                if (perks.includes(',')) {
                    return perks.split(',').map(item => ({
                        label: 'Benefit',
                        value: item.trim()
                    })).filter(item => item.value);
                }
                return [{ label: 'Benefit', value: perks.trim() }];
            }
        }
        
        if (Array.isArray(perks)) {
            return perks.map((perk, index) => ({
                label: 'Benefit',
                value: String(perk).trim()
            })).filter(perk => perk.value);
        }
        
        if (typeof perks === 'object' && perks !== null) {
            const result = [];
            Object.entries(perks).forEach(([key, value]) => {
                if (value !== null && value !== '') {
                    const formattedKey = key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');
                    const valueStr = String(value);
                    
                    // Check if value contains commas (comma-separated list)
                    if (valueStr.includes(',')) {
                        // Split by comma and create individual perks
                        const items = valueStr.split(',').map(item => item.trim()).filter(item => item);
                        items.forEach(item => {
                            result.push({
                                label: formattedKey,
                                value: item
                            });
                        });
                    } else {
                        result.push({
                            label: formattedKey,
                            value: valueStr
                        });
                    }
                }
            });
            return result;
        }
        
        return [];
    };

    const rows = useMemo(() => {
        if (!sessionData?.leaderboard) return [];
        const winningBidId = sessionData?.winning_bid_id ? String(sessionData.winning_bid_id) : null;
        const isSessionClosed = sessionData?.status === 'closed';
        
        return sessionData.leaderboard.map((bid, index) => {
            const basePrice = parseFloat(sessionData.criteria?.price || 0);
            const savings = basePrice > 0 ? basePrice - parseFloat(bid.amount || 0) : 0;
            const bidId = String(bid.bid_id || bid.id);
            const isWinningBid = isSessionClosed && winningBidId && bidId === winningBidId;
            
            return {
                id: bid.bid_id || bid.id,
                dealerId: bid.dealer_id,
                dealerName: bid.dealer_name || 'Unknown Dealer',
                currentOffer: parseFloat(bid.amount || 0),
                perks: bid.perks || {},
                perksArray: parsePerks(bid.perks),
                rank: bid.position || index + 1,
                distance: bid.distance || 0,
                location: bid.distance ? `${bid.distance} miles away` : 'Location unavailable',
                savings: Math.max(0, savings),
                isWinningBid: isWinningBid,
                productId: bid.product_id || null,
            };
        });
    }, [sessionData?.leaderboard, sessionData?.criteria, sessionData?.winning_bid_id, sessionData?.status]);
    
    // Format time remaining
    const formatTime = (seconds) => {
        if (seconds <= 0) return '00:00:00';
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };
    
    // Get status badge info
    const getStatusBadge = () => {
        const status = sessionData?.status || 'pending';
        const statusMap = {
            pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: Clock },
            running: { label: 'Live', color: 'bg-green-100 text-green-700 border-green-200', icon: Sparkles },
            closed: { label: 'Closed', color: 'bg-neutral-100 text-neutral-700 border-neutral-200', icon: CheckCircle2 },
            cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700 border-red-200', icon: AlertCircle },
        };
        return statusMap[status] || statusMap.pending;
    };
    
    const statusBadge = getStatusBadge();
    const StatusIcon = statusBadge.icon;

    const onAcceptFlow = (bid) => {
        setConfirmBid(bid);
        setViewBid(null); // Close BidDetailsDialog when opening AcceptConfirmDialog
    };

    const onConfirmAccept = async () => {
        if (!confirmBid) return;
        const res = await dispatch(acceptBidThunk({ 
            sessionId, 
            bidId: confirmBid.id,
            bidData: confirmBid // Pass the full bid data
        }));
        if (res?.payload?.certificate) {
            setConfirmBid(null);
            setViewBid(null); // Ensure BidDetailsDialog is closed
            setShowCert(true);
        }
    };

    const downloadPDF = async () => {
        // Get certificate data from Redux state
        const certificateData = activeSession?.certificateData || null;
        
        const sessionForPDF = {
            id: sessionData?.id,
            car: certificateData?.vehicle ? {
                year: certificateData.vehicle.year,
                make: certificateData.vehicle.make,
                model: certificateData.vehicle.model,
                title: certificateData.vehicle.title,
                images: certificateData.vehicle.images || []
            } : {
                year: criteria.year,
                make: criteria.make,
                model: criteria.model,
                images: primaryVehicle?.images || []
            },
            acceptedBid: confirmBid,
            certificateData: certificateData
        };
        await generateCertificatePDF(sessionForPDF);
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

    // Early return if no session data
    if (!sessionData) {
        return (
            <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                    <p className="text-neutral-600">Loading session details...</p>
                </div>
            </div>
        );
    }

    // Define criteria and other derived values after sessionData check
    const criteria = sessionData.criteria || {};
    const primaryImage = primaryVehicle?.images?.[0]?.url || primaryVehicle?.images?.[0] || null;

    // Get vehicle info for appointment modal
    const vehicleInfo = criteria.year && criteria.make && criteria.model
        ? `${criteria.year} ${criteria.make} ${criteria.model}`
        : 'Vehicle';

    // Get dealer info from accepted bid
    const dealerName = confirmBid?.dealerName || 'Dealer';
    const dealerId = confirmBid?.dealerId || '';
    const dealerEmail = confirmBid?.dealerEmail || 'contact@dealer.com';

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50"
        >
            {/* Compact Header Section */}
            <div className="border-b border-neutral-200/50 bg-white/80 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
                <div className="mx-auto px-4 sm:px-6 lg:px-8 pt-[calc(var(--header-height-mobile)+1rem)] sm:pt-[calc(var(--header-height-tablet)+1rem)] lg:pt-[calc(var(--header-height-desktop)+1rem)] pb-4" style={{ maxWidth: '1600px' }}>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3">
                            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
                                Reverse Bidding Session
                            </h1>
                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${statusBadge.color} text-xs font-semibold`}>
                                <StatusIcon className="w-3 h-3" />
                                {statusBadge.label}
                            </div>
                            <span className="text-xs text-neutral-500">#{sessionData.id}</span>
                        </div>
                        
                        {/* Time Remaining Card - Compact with All Sessions Button */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => navigate('/active-sessions')}
                                className="flex items-center gap-1.5 px-3 py-2 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 hover:border-orange-300 transition-all duration-200 shadow-sm h-[40px]"
                            >
                                <ArrowLeft className="w-4 h-4 text-neutral-600" />
                                <span className="text-sm font-medium text-neutral-700">All Sessions</span>
                            </button>
                            {sessionData.status === 'running' && (
                                <motion.div
                                    initial={{ scale: 0.95 }}
                                    animate={{ scale: 1 }}
                                    className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg px-3 py-2 shadow-md h-[40px] flex items-center"
                                >
                                    <div className="flex items-center gap-2">
                                        <Timer className="w-4 h-4 text-white" />
                                        <p className="text-white text-lg font-bold font-mono">
                                            {formatTime(timeRemaining)}
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                            {sessionData.status === 'closed' && sessionData.winning_bid_id && (
                                <motion.div
                                    initial={{ scale: 0.95 }}
                                    animate={{ scale: 1 }}
                                    className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg px-3 py-2 shadow-md h-[40px] flex items-center"
                                >
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-white" />
                                        <p className="text-white text-sm font-semibold">
                                            Bid Accepted
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>

                    {/* Compact Stats Row */}
                    <div className="flex items-center gap-4 text-xs text-neutral-600 mb-3">
                        <span className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5" />
                            {sessionData.total_bids || 0} Bids
                        </span>
                        <span className="flex items-center gap-1.5">
                            <TrendingDown className="w-3.5 h-3.5" />
                            {rows.length} Dealers
                        </span>
                        <span className="flex items-center gap-1.5">
                            <DollarSign className="w-3.5 h-3.5" />
                            ${parseFloat(criteria.price || 0).toLocaleString()}
                        </span>
                        {rows.length > 0 && rows[0]?.currentOffer && (
                            <span className="flex items-center gap-1.5 text-green-600 font-semibold">
                                <Award className="w-3.5 h-3.5" />
                                Best: ${rows[0].currentOffer.toLocaleString()}
                            </span>
                        )}
                    </div>

                    {/* Compact Vehicle Info */}
                    <div className="flex items-center gap-3 text-sm">
                        {primaryImage && (
                            <img
                                src={primaryImage}
                                className="w-12 h-12 rounded-lg object-cover border border-neutral-200"
                                alt={`${criteria.year} ${criteria.make} ${criteria.model}`}
                            />
                        )}
                        <div>
                            <span className="font-semibold text-neutral-900">
                                {criteria.year} {criteria.make} {criteria.model}
                            </span>
                            {sessionData.location && (
                                <span className="text-neutral-500 ml-2">
                                    • {[
                                        sessionData.location.city,
                                        sessionData.location.state,
                                        sessionData.location.zip
                                    ].filter(Boolean).join(', ')}
                                </span>
                            )}
                            {!sessionData.location && criteria.zip_code && (
                                <span className="text-neutral-500 ml-2">• {criteria.zip_code}</span>
                            )}
                            {alternativeVehicles.length > 0 && (
                                <span className="text-blue-600 ml-2">• {alternativeVehicles.length} Alternative{alternativeVehicles.length !== 1 ? 's' : ''}</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Leaderboard Section - Main Focus */}
            <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6 min-h-[calc(100vh-300px)]" style={{ maxWidth: '1600px' }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="h-full"
                >
                    {/* Prominent Header */}
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-1 flex items-center gap-2">
                                <Sparkles className="w-6 h-6 text-orange-500" />
                                Live Leaderboard
                            </h2>
                            <p className="text-sm text-neutral-600">
                                {rows.length > 0 
                                    ? `Viewing ${rows.length} active bid${rows.length !== 1 ? 's' : ''} from competing dealers`
                                    : 'Dealers are reviewing your session and will submit bids soon'}
                            </p>
                        </div>
                    </div>
                    
                    {/* Main Leaderboard Content - Takes up most of the space */}
                    {rows.length > 0 ? (
                        <div className="bg-white rounded-2xl border-2 border-neutral-200 shadow-xl overflow-hidden">
                            <LeaderboardTable
                                rows={rows}
                                onView={setViewBid}
                                onAccept={onAcceptFlow}
                                timeRemaining={timeRemaining}
                                vehicleImage={primaryImage}
                                sessionStatus={sessionData?.status}
                                isSessionClosed={sessionData?.status === 'closed'}
                            />
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl border-2 border-neutral-200 shadow-xl p-16 sm:p-20 text-center flex flex-col items-center justify-center min-h-[500px]">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="w-24 h-24 bg-gradient-to-br from-orange-100 to-orange-50 rounded-full flex items-center justify-center mb-6 shadow-lg"
                            >
                                <Clock className="w-12 h-12 text-orange-500" />
                            </motion.div>
                            <h3 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-3">Waiting for Bids</h3>
                            <p className="text-base text-neutral-600 max-w-lg mx-auto mb-6">
                                Dealers have been notified and are reviewing your session. Bids will appear here once dealers submit their competitive offers.
                            </p>
                            <div className="flex items-center gap-2 text-sm text-neutral-500">
                                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                                <span>Dealers are preparing their bids...</span>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>

            <BidDetailsDialog 
                open={!!viewBid} 
                bid={viewBid} 
                onClose={() => setViewBid(null)} 
                onAccept={onAcceptFlow}
                isSessionClosed={sessionData?.status === 'closed'}
            />
            <AcceptConfirmDialog open={!!confirmBid} bid={confirmBid} onCancel={() => setConfirmBid(null)} onConfirm={onConfirmAccept} loading={loading.acceptance} />
            <CertificateDialog
                open={showCert}
                session={{
                    id: sessionData?.id,
                    car: activeSession?.certificateData?.vehicle ? {
                        year: activeSession.certificateData.vehicle.year,
                        make: activeSession.certificateData.vehicle.make,
                        model: activeSession.certificateData.vehicle.model,
                        title: activeSession.certificateData.vehicle.title,
                        images: activeSession.certificateData.vehicle.images || []
                    } : {
                        year: criteria.year,
                        make: criteria.make,
                        model: criteria.model,
                        images: primaryVehicle?.images || []
                    },
                    acceptedBid: confirmBid,
                    certificateData: activeSession?.certificateData || null
                }}
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
                    description={`Now that your offer of ${confirmBid?.currentOffer ? `$${confirmBid.currentOffer.toLocaleString()}` : 'N/A'} has been accepted, let's schedule your appointment to complete the transaction.`}
                />
            )}
        </motion.div>
    );
}


