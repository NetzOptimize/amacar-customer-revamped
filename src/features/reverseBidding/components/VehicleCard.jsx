import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import ReverseBiddingConfirmDialog from './ReverseBiddingConfirmDialog';
import LoginModal from '../../../components/ui/LoginModal';

export default function VehicleCard({ car, onStart, loading = false }) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [pendingAction, setPendingAction] = useState(false); // Track if we need to open dialog after login

    const { user } = useSelector((state) => state.user);
    const isLoggedIn = !!user;
    // Get the primary image or first available image
    // Handle both new API structure (objects with url/thumbnail) and old structure (array of strings)
    let imageUrl = '';
    if (car.images?.length) {
        const primaryImage = car.images.find(img => img?.is_primary) || car.images[0];
        if (typeof primaryImage === 'string') {
            // Old structure: array of strings
            imageUrl = primaryImage;
        } else if (primaryImage?.url) {
            // New structure: object with url
            imageUrl = primaryImage.url;
        } else if (primaryImage?.thumbnail) {
            // New structure: object with thumbnail
            imageUrl = primaryImage.thumbnail;
        }
    }

    // Determine condition badge - handle both new_used (U/N) and condition (new/used)
    const conditionValue = car.new_used || car.condition || 'new';
    const conditionBadge = conditionValue === 'U' || conditionValue === 'used' ? 'Used' : 'New';
    const conditionColor = conditionValue === 'U' || conditionValue === 'used' ? 'bg-blue-500/80' : 'bg-green-500/80';

    // Format location - handle both new API structure and old dealer structure
    let location = 'Location unavailable';
    if (car.city && car.state) {
        location = `${car.city}, ${car.state}`;
    } else if (car.dealer?.location) {
        // Fallback to old structure
        location = car.dealer.location;
    } else if (car.zip_code) {
        location = car.zip_code;
    }

    // Get price - handle both price and basePrice (old structure)
    const price = car.price || car.basePrice || 0;

    // Handle button click - check authentication first
    const handleStartBidding = () => {
        if (!isLoggedIn) {
            // User not logged in, open login modal
            setPendingAction(true);
            setLoginModalOpen(true);
        } else {
            // User is logged in, open confirmation dialog
            setDialogOpen(true);
        }
    };

    // When user logs in successfully, open the confirmation dialog
    useEffect(() => {
        if (isLoggedIn && pendingAction && !loginModalOpen) {
            // User just logged in and we have a pending action
            setPendingAction(false);
            setDialogOpen(true);
        }
    }, [isLoggedIn, pendingAction, loginModalOpen]);

    // Handle login modal close
    const handleLoginModalClose = (open) => {
        if (!open) {
            setLoginModalOpen(false);
            // If user didn't log in, clear pending action
            if (!isLoggedIn) {
                setPendingAction(false);
            }
        }
    };

    return (
        <motion.div
            className="group overflow-hidden rounded-2xl border border-neutral-200/50 hover:border-orange-400/50 transition-all duration-500 shadow-lg hover:shadow-2xl bg-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className="relative h-56 overflow-hidden bg-neutral-100">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={car.title || `${car.year} ${car.make} ${car.model}`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-neutral-200 text-neutral-400">
                        <span>No Image</span>
                    </div>
                )}
                <div className={`absolute top-4 right-4 px-2 py-1 rounded-md text-xs font-medium backdrop-blur-md text-white ${conditionColor}`}>
                    {conditionBadge}
                </div>
            </div>
            <div className="p-5 space-y-3">
                <h3 className="text-lg font-semibold tracking-tight truncate">
                    {car.year} {car.make} {car.model}
                </h3>
                <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">${price.toLocaleString()}</span>
                    <span className="text-xs text-neutral-500">MSRP</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-neutral-600">
                    <span>{location}</span>
                    {car.vin && (
                        <span className="text-xs text-neutral-400">• VIN: {car.vin.slice(-6)}</span>
                    )}
                </div>
                <button
                    onClick={handleStartBidding}
                    className="cursor-pointer w-full mt-2 inline-flex items-center justify-center rounded-lg px-3 py-2 bg-neutral-900 text-white font-medium hover:bg-neutral-800 transition-colors group/btn"
                >
                    <span>Start Reverse Bidding</span>
                    <span className="ml-2 transition-transform group-hover/btn:translate-x-1">→</span>
                </button>
            </div>

            <ReverseBiddingConfirmDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onConfirm={async () => {
                    if (!loading) {
                        await onStart(car);
                        // Dialog will close when navigation happens or we can close it here
                        // setDialogOpen(false); // Uncomment if needed
                    }
                }}
                car={car}
                loading={loading}
            />

            <LoginModal
                isOpen={loginModalOpen}
                onClose={handleLoginModalClose}
                title="Login Required"
                description="Please log in to start reverse bidding on this vehicle"
            />
        </motion.div>
    );
}


