import { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import 'photoswipe/dist/photoswipe.css';
import { Gallery, Item } from 'react-photoswipe-gallery';
import ReverseBiddingConfirmDialog from './ReverseBiddingConfirmDialog';
import LoginModal from '../../../components/ui/LoginModal';

export default function VehicleCard({ car, onStart, loading = false }) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [pendingAction, setPendingAction] = useState(false); // Track if we need to open dialog after login
    const [isSaved, setIsSaved] = useState(false); // Track if vehicle is saved

    const { user } = useSelector((state) => state.user);
    const isLoggedIn = !!user;
    const navigate = useNavigate();

    // Prepare images array for PhotoSwipe
    const images = useMemo(() => {
        if (!car.images?.length) return [];

        return car.images.map((img, index) => {
            let url = '';
            let thumbnail = '';

            if (typeof img === 'string') {
                // Old structure: array of strings
                url = img;
                thumbnail = img;
            } else if (img?.url) {
                // New structure: object with url (full resolution)
                url = img.url;
                thumbnail = img.thumbnail || img.url;
            } else if (img?.thumbnail) {
                // New structure: object with thumbnail only
                thumbnail = img.thumbnail;
                url = img.url || img.thumbnail;
            }

            return {
                src: url, // Full resolution image URL
                thumbnail: thumbnail || url, // Thumbnail URL, fallback to full URL
                width: img.width || 1200,
                height: img.height || 800,
                alt: car.title || `${car.year} ${car.make} ${car.model} - Image ${index + 1}`,
                isPrimary: img?.is_primary || index === 0, // Track primary image
            };
        });
    }, [car.images, car.title, car.year, car.make, car.model]);

    // Get the primary image (marked as primary or first image)
    const primaryImage = images.find(img => img.isPrimary) || images[0];
    // Always use full resolution image (src) for display, not thumbnail
    const imageUrl = primaryImage?.src || '';
    const imageCount = images.length;

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
            <Gallery>
                <div className="relative h-72 overflow-hidden bg-neutral-100">
                    {imageUrl && images.length > 0 ? (
                        <>
                            {/* Render all images but only show the first one */}
                            {images.map((image, index) => (
                                <Item
                                    key={`gallery-${index}`}
                                    original={image.src}
                                    thumbnail={image.thumbnail || image.src}
                                    width={image.width}
                                    height={image.height}
                                    alt={image.alt}
                                >
                                    {({ ref, open }) => (
                                        <img
                                            ref={ref}
                                            onClick={open}
                                            src={index === 0 ? image.src : image.thumbnail || image.src}
                                            alt={image.alt}
                                            className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 cursor-pointer ${index === 0 ? 'block' : 'hidden'}`}
                                            loading={index === 0 ? 'eager' : 'lazy'}
                                        />
                                    )}
                                </Item>
                            ))}
                        </>
                    ) : (
                        <>
                            <div className="w-full h-full flex items-center justify-center bg-neutral-200 text-neutral-400">
                                <span>No Image</span>
                            </div>
                            {/* Overlay effect for missing images */}
                            <div className="absolute inset-0 bg-gradient-to-br from-neutral-800/70 via-neutral-700/60 to-neutral-800/70 backdrop-blur-sm flex items-center justify-center z-20">
                                <div className="text-center px-4">
                                    <p className="text-white text-sm font-medium">request vehicle image?</p>
                                </div>
                            </div>
                        </>
                    )}
                    {/* Heart/Save Button - Top Left */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsSaved(!isSaved);
                            // TODO: Implement save vehicle functionality
                        }}
                        className={`absolute top-4 left-4 p-2 rounded-full backdrop-blur-md transition-all duration-200 hover:scale-110 z-30 ${isSaved
                            ? 'bg-red-500/90 text-white shadow-lg'
                            : 'bg-white/90 text-neutral-700 hover:bg-red-50 hover:text-red-600 shadow-md'
                            }`}
                        aria-label={isSaved ? 'Remove from saved' : 'Save vehicle'}
                    >
                        <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                    </button>
                    {/* Condition Badge - Top Right */}
                    <div className={`absolute top-4 right-4 px-2 py-1 rounded-md text-xs font-medium backdrop-blur-md text-white z-30 ${conditionColor}`}>
                        {conditionBadge}
                    </div>
                    {/* Image Count Badge - Bottom Right */}
                    {imageCount > 0 && (
                        <div className="absolute bottom-4 right-4 px-2.5 py-1 rounded-md text-xs font-semibold backdrop-blur-md bg-black/60 text-white z-30 pointer-events-none">
                            {`1/${imageCount}`}
                        </div>
                    )}
                </div>
            </Gallery>
            <div className="p-5 space-y-3">
                <h3 className="text-base sm:text-lg font-semibold tracking-tight truncate">
                    {car.year} {car.make} {car.model}
                </h3>
                {price === 0 ? (
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 ">
                        <span className="text-lg  font-semibold text-neutral-400">Price not available</span>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                // TODO: Implement request price functionality
                            }}
                            className="text-xs sm:text-sm font-medium text-orange-600 hover:text-orange-700 underline cursor-pointer transition-colors whitespace-nowrap self-start sm:self-auto"
                        >
                            Request for price
                        </button>
                    </div>
                ) : (
                    <div className="flex items-baseline gap-2">
                        <span className="text-xl sm:text-2xl font-bold">${price.toLocaleString()}</span>
                        <span className="text-xs text-neutral-500">MSRP</span>
                    </div>
                )}
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs sm:text-sm text-neutral-600">
                    <span className="truncate">{location}</span>
                    {car.vin && (
                        <span className="text-xs text-neutral-400 truncate">• VIN: {car.vin}</span>
                    )}
                </div>
                <div className="flex flex-col sm:flex-row gap-2 mt-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/reverse-bidding/vehicles/${car.id}`);
                        }}
                        className="cursor-pointer w-full sm:flex-1 inline-flex items-center justify-center rounded-lg px-3 py-2 text-xs sm:text-sm border border-neutral-300 bg-white text-neutral-700 font-medium hover:bg-neutral-50 hover:border-neutral-400 transition-colors"
                    >
                        View details
                    </button>
                    <button
                        onClick={handleStartBidding}
                        className="cursor-pointer w-full sm:flex-1 inline-flex items-center justify-center rounded-lg px-3 py-2 text-xs sm:text-sm bg-neutral-900 text-white font-medium hover:bg-neutral-800 transition-colors group/btn"
                    >
                        <span className="truncate">Start Reverse Bidding</span>
                        <span className="ml-2 transition-transform group-hover/btn:translate-x-1 flex-shrink-0">→</span>
                    </button>
                </div>
            </div>

            <ReverseBiddingConfirmDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onConfirm={async (formData) => {
                    if (!loading) {
                        await onStart(car, formData);
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


