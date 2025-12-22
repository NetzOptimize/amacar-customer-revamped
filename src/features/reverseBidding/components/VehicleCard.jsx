import { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import 'photoswipe/dist/photoswipe.css';
import { Gallery, Item } from 'react-photoswipe-gallery';
import ReverseBiddingConfirmDialog from './ReverseBiddingConfirmDialog';
import LoginModal from '../../../components/ui/LoginModal';
import DealerContactModal from './DealerContactModal';

export default function VehicleCard({ car, onStart, loading = false }) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [pendingAction, setPendingAction] = useState(false); // Track if we need to open dialog after login
    const [isSaved, setIsSaved] = useState(false); // Track if vehicle is saved
    const [currentImageIndex, setCurrentImageIndex] = useState(0); // Track current carousel image
    const [dealerContactModalOpen, setDealerContactModalOpen] = useState(false); // Track dealer contact modal

    const { user } = useSelector((state) => state.user);
    const isLoggedIn = !!user;
    const navigate = useNavigate();

    // Prepare images array for PhotoSwipe
    const images = useMemo(() => {
        // Priority: images > image_gallery > image_url
        let imageSources = [];
        
        if (car.images && Array.isArray(car.images) && car.images.length > 0) {
            imageSources = car.images;
        } else if (car.image_gallery && Array.isArray(car.image_gallery) && car.image_gallery.length > 0) {
            imageSources = car.image_gallery;
        } else if (car.image_url) {
            imageSources = [car.image_url];
        }

        if (!imageSources.length) return [];

        // Sort images to put primary image first (if is_primary property exists)
        const sortedSources = [...imageSources].sort((a, b) => {
            if (typeof a === 'object' && typeof b === 'object') {
                if (a.is_primary && !b.is_primary) return -1;
                if (!a.is_primary && b.is_primary) return 1;
            }
            return 0;
        });

        return sortedSources.map((img, index) => {
            const url = typeof img === 'string' ? img : (img?.url || img?.thumbnail || '');
            const thumbnail = url;

            return {
                src: url,
                thumbnail: thumbnail,
                width: 1200,
                height: 800,
                alt: car.title || `${car.year} ${car.make} ${car.model} - Image ${index + 1}`,
            };
        });
    }, [car.images, car.image_gallery, car.image_url, car.title, car.year, car.make, car.model]);

    const primaryImage = images[0];
    const imageCount = images.length;

    // Reset carousel to first image when images change
    useEffect(() => {
        if (images.length > 0) {
            setCurrentImageIndex(0);
        }
    }, [images.length]);

    // Carousel navigation functions
    const goToNext = (e) => {
        e?.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const goToPrevious = (e) => {
        e?.stopPropagation();
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const goToImage = (index, e) => {
        e?.stopPropagation();
        setCurrentImageIndex(index);
    };

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
    const price = parseFloat(car.price || car.basePrice || 0);

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
                <div className="relative h-72 overflow-hidden bg-neutral-100 group/image-container">
                    {primaryImage && images.length > 0 ? (
                        <>
                            {/* Render all images as PhotoSwipe Items for gallery navigation */}
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
                                        <div
                                            ref={ref}
                                            onClick={index === currentImageIndex ? open : undefined}
                                            className={index === currentImageIndex 
                                                ? 'absolute inset-0 cursor-pointer z-10' 
                                                : 'absolute inset-0 opacity-0 pointer-events-none -z-10'
                                            }
                                        >
                                            <img
                                                src={image.src}
                                                alt={image.alt}
                                                className="w-full h-full"
                                                style={{ objectFit: 'contain' }}
                                                loading={index === 0 ? 'eager' : 'lazy'}
                                            />
                                        </div>
                                    )}
                                </Item>
                            ))}
                            
                            {/* Carousel Image Display - Visible animated layer */}
                            <AnimatePresence mode="wait">
                                {images.map((image, index) => {
                                    if (index !== currentImageIndex) return null;
                                    
                                    return (
                                        <motion.img
                                            key={`carousel-${index}`}
                                            src={image.src}
                                            alt={image.alt}
                                            initial={{ opacity: 0, scale: 1.1 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                            className="absolute inset-0 w-full h-full transition-transform duration-700 group-hover/image-container:scale-110 pointer-events-none z-20"
                                            style={{ objectFit: 'contain' }}
                                            loading={index === 0 ? 'eager' : 'lazy'}
                                        />
                                    );
                                })}
                            </AnimatePresence>

                            {/* Navigation Arrows - Only show if more than 1 image */}
                            {images.length > 1 && (
                                <>
                                    {/* Previous Button */}
                                    <button
                                        onClick={goToPrevious}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 backdrop-blur-md text-neutral-700 hover:bg-white hover:text-orange-600 shadow-lg transition-all duration-200 hover:scale-110 opacity-0 group-hover/image-container:opacity-100 z-30"
                                        aria-label="Previous image"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>

                                    {/* Next Button */}
                                    <button
                                        onClick={goToNext}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 backdrop-blur-md text-neutral-700 hover:bg-white hover:text-orange-600 shadow-lg transition-all duration-200 hover:scale-110 opacity-0 group-hover/image-container:opacity-100 z-30"
                                        aria-label="Next image"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </>
                            )}

                            {/* Carousel Navigation Bar - Bottom Center */}
                            {images.length > 1 && (
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 via-black/40 to-transparent p-3 z-30">
                                    <div className="flex items-center justify-center">
                                        {/* Image Counter */}
                                        <div className="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-semibold">
                                            {currentImageIndex + 1}/{images.length}
                                        </div>
                                    </div>

                                    {/* Dot Indicators */}
                                    {images.length <= 10 && (
                                        <div className="flex items-center justify-center gap-1.5 mt-2">
                                            {images.map((_, index) => (
                                                <button
                                                    key={index}
                                                    onClick={(e) => goToImage(index, e)}
                                                    className={`h-1.5 rounded-full transition-all duration-200 ${
                                                        index === currentImageIndex
                                                            ? 'bg-white w-6'
                                                            : 'bg-white/40 w-1.5 hover:bg-white/60'
                                                    }`}
                                                    aria-label={`Go to image ${index + 1}`}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
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
                        className={`absolute top-4 left-4 p-2 rounded-full backdrop-blur-md transition-all duration-200 hover:scale-110 z-40 ${isSaved
                            ? 'bg-red-500/90 text-white shadow-lg'
                            : 'bg-white/90 text-neutral-700 hover:bg-red-50 hover:text-red-600 shadow-md'
                            }`}
                        aria-label={isSaved ? 'Remove from saved' : 'Save vehicle'}
                    >
                        <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                    </button>
                    
                    {/* Condition Badge - Top Right */}
                    <div className={`absolute top-4 right-4 px-2 py-1 rounded-md text-xs font-medium backdrop-blur-md text-white z-40 ${conditionColor}`}>
                        {conditionBadge}
                    </div>
                </div>
            </Gallery>
            <div className="p-5 space-y-3">
                <h3 className="text-base sm:text-lg font-semibold tracking-tight truncate">
                    {car.year} {car.make} {car.model}
                </h3>
                {/* Trim and Mileage */}
                {(car.series || car.mileage || car.odometer) && (
                    <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-neutral-600">
                        {car.series && (
                            <span className="truncate">
                                <span className="font-medium text-neutral-700">Trim:</span> {car.series}
                            </span>
                        )}
                        {(car.mileage || car.odometer) && (
                            <span className="truncate flex items-center gap-1">
                                {car.series && <span className="text-neutral-400">•</span>}
                                <span className="font-medium text-neutral-700">Mileage:</span>
                                <span>{((car.mileage || car.odometer) || 0).toLocaleString()} mi</span>
                            </span>
                        )}
                    </div>
                )}
                {price === 0 ? (
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 ">
                        <span className="text-lg  font-semibold text-neutral-400">Price not available</span>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setDealerContactModalOpen(true);
                            }}
                            className="text-xs sm:text-sm font-medium text-orange-600 hover:text-orange-700 underline cursor-pointer transition-colors whitespace-nowrap self-start sm:self-auto"
                        >
                            Request for price
                        </button>
                    </div>
                ) : (
                    <div className="flex items-baseline gap-2">
                        <span className="text-xl sm:text-2xl font-bold text-neutral-900">
                            ${Number(price).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                        </span>
                        <span className="text-xs text-neutral-500">
                            {(conditionValue === 'U' || conditionValue === 'used') ? 'Listing Price' : 'MSRP'}
                        </span>
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
                            // Prioritize vehicle_id, then product_id, then id
                            const vehicleId = car.vehicle_id || car.product_id || car.id;
                            if (vehicleId) {
                                navigate(`/reverse-bidding/vehicles/${vehicleId}`);
                            }
                        }}
                        className="cursor-pointer w-full sm:flex-1 inline-flex items-center justify-center rounded-lg px-3 py-2 text-xs sm:text-sm border border-neutral-300 bg-white text-neutral-700 font-medium hover:bg-neutral-50 hover:border-neutral-400 transition-colors"
                    >
                        View details
                    </button>
                    {/* <button
                        onClick={handleStartBidding}
                        className="cursor-pointer w-full sm:flex-1 inline-flex items-center justify-center rounded-lg px-3 py-2 text-xs sm:text-sm bg-neutral-900 text-white font-medium hover:bg-neutral-800 transition-colors group/btn"
                    >
                        <span className="truncate">Start Reverse Bidding</span>
                        <span className="ml-2 transition-transform group-hover/btn:translate-x-1 flex-shrink-0">→</span>
                    </button> */}
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

            <DealerContactModal
                open={dealerContactModalOpen}
                onClose={() => setDealerContactModalOpen(false)}
                dealerContact={car.dealer_contact}
                vehicleInfo={{
                    year: car.year,
                    make: car.make,
                    model: car.model,
                    series: car.series
                }}
            />
        </motion.div>
    );
}


