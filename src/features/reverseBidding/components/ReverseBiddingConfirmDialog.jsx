import { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import axios from 'axios';
import { 
    CheckCircle2, 
    MapPin, 
    Phone, 
    Car, 
    Circle, 
    Check,
    ExternalLink,
    DollarSign,
    Calendar,
    Gauge,
    Fuel,
    Settings,
    FileText,
    Shield,
    Share2,
    X,
    Loader2,
    AlertCircle
} from 'lucide-react';
import 'photoswipe/dist/photoswipe.css';
import { Gallery, Item } from 'react-photoswipe-gallery';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { setFilters } from '../redux/reverseBidSlice';
import { cn } from '../../../lib/utils';
import useDebounce from '../../../hooks/useDebounce';

export default function ReverseBiddingConfirmDialog({
    open,
    onClose,
    onConfirm,
    car,
    alternativeVehicles = [],
    loading = false
}) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { filters } = useSelector((s) => s.reverseBid);
    const { user } = useSelector((s) => s.user);

    // Local state for form data
    const [formData, setFormData] = useState({
        condition: filters.condition || 'new',
        zipCode: filters.zipCode || user?.zip_code || user?.meta?.zip_code || '',
        phone: user?.phone || user?.meta?.phone || '',
        dealerPreference: 'local', // 'local' or 'all'
        selectedAlternatives: [], // Array of vehicle IDs
        consent: {
            terms: false,
            privacy: false,
            dataSharing: false
        }
    });

    // State for city/state lookup
    const [locationData, setLocationData] = useState({
        city: '',
        state: '',
        loading: false,
        error: null
    });

    // Debounce zip code input (500ms delay)
    const debouncedZipCode = useDebounce(formData.zipCode, 500);

    // Initialize form data when dialog opens
    useEffect(() => {
        if (open) {
            setFormData({
                condition: filters.condition || 'new',
                zipCode: filters.zipCode || user?.zip_code || user?.meta?.zip_code || '',
                phone: user?.phone || user?.meta?.phone || '',
                dealerPreference: 'local', // Default to local dealers
                selectedAlternatives: [],
                consent: {
                    terms: false,
                    privacy: false,
                    dataSharing: false
                }
            });
            // Reset location data when dialog opens
            setLocationData({
                city: '',
                state: '',
                loading: false,
                error: null
            });
        }
    }, [open, filters.condition, filters.zipCode, user]);

    // Fetch city/state when debounced zip code changes
    useEffect(() => {
        const fetchCityState = async () => {
            const zipCode = debouncedZipCode?.trim();
            
            // Reset state if zip code is empty
            if (!zipCode) {
                setLocationData({
                    city: '',
                    state: '',
                    loading: false,
                    error: null
                });
                return;
            }

            // Only fetch if zip code is exactly 5 digits
            if (zipCode.length === 5 && /^\d{5}$/.test(zipCode)) {
                setLocationData(prev => ({ ...prev, loading: true, error: null }));
                
                try {
                    const response = await axios.get(
                        `https://dealer.amacar.ai/wp-json/dealer-portal/v1/location/city-state-by-zip?zipcode=${encodeURIComponent(zipCode)}`
                    );

                    if (response.data?.success && response.data?.location) {
                        setLocationData({
                            city: response.data.location.city || '',
                            state: response.data.location.state_name || '',
                            loading: false,
                            error: null
                        });
                    } else {
                        setLocationData({
                            city: '',
                            state: '',
                            loading: false,
                            error: response.data?.message || 'Invalid zip code'
                        });
                    }
                } catch (error) {
                    setLocationData({
                        city: '',
                        state: '',
                        loading: false,
                        error: error.response?.data?.message || error.message || 'Failed to fetch location data'
                    });
                }
            } else if (zipCode.length > 0 && zipCode.length < 5) {
                // Incomplete zip code (less than 5 digits)
                setLocationData({
                    city: '',
                    state: '',
                    loading: false,
                    error: null // Don't show error while typing
                });
            } else if (zipCode.length > 0) {
                // Invalid format but not empty
                setLocationData({
                    city: '',
                    state: '',
                    loading: false,
                    error: 'Please enter a valid 5-digit zip code'
                });
            }
        };

        fetchCityState();
    }, [debouncedZipCode]);

    // Limit to max 4 alternative vehicles
    const displayedAlternatives = alternativeVehicles?.slice(0, 4) || [];

    // Handle close - prevent closing when loading
    const handleClose = () => {
        if (!loading) {
            onClose(false);
        }
    };

    // Toggle alternative vehicle selection
    const toggleAlternative = (vehicleId) => {
        setFormData(prev => {
            const isSelected = prev.selectedAlternatives.includes(vehicleId);
            if (isSelected) {
                return {
                    ...prev,
                    selectedAlternatives: prev.selectedAlternatives.filter(id => id !== vehicleId)
                };
            } else {
                // Max 4 selections
                if (prev.selectedAlternatives.length >= 4) {
                    return prev;
                }
                return {
                    ...prev,
                    selectedAlternatives: [...prev.selectedAlternatives, vehicleId]
                };
            }
        });
    };

    // Toggle consent checkbox
    const toggleConsent = (type) => {
        setFormData(prev => ({
            ...prev,
            consent: {
                ...prev.consent,
                [type]: !prev.consent[type]
            }
        }));
    };

    // Navigate to vehicle details
    const handleViewVehicle = (vehicleId, e) => {
        e.stopPropagation();
        navigate(`/reverse-bidding/vehicles/${vehicleId}`);
    };

    // Handle confirm - update filters and then start bidding
    const handleConfirm = () => {
        // Update Redux filters with the form data
        dispatch(setFilters({
            condition: formData.condition,
            zipCode: formData.zipCode,
        }));
        // Call the original onConfirm with formData including selected alternatives and consent
        onConfirm({
            condition: formData.condition,
            zipCode: formData.zipCode,
            phone: formData.phone,
            dealerPreference: formData.dealerPreference, // 'local' or 'all'
            selectedAlternatives: formData.selectedAlternatives, // Array of vehicle IDs
            consent: formData.consent, // Include consent data
        });
    };

    // Check if form is valid
    const isFormValid = 
        formData.zipCode?.trim() && 
        formData.consent.terms &&
        formData.consent.privacy &&
        formData.consent.dataSharing;

    // Format currency
    const formatCurrency = (amount) => {
        if (!amount || amount === 0) return null;
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    // Prepare images array for PhotoSwipe for a vehicle
    const prepareVehicleImages = (vehicle) => {
        if (!vehicle?.images?.length) return [];
        
        return vehicle.images.map((img, index) => {
            let url = '';
            let thumbnail = '';
            
            if (typeof img === 'string') {
                url = img;
                thumbnail = img;
            } else if (img?.url) {
                // Handle API format: { url: "...", is_primary: true/false }
                url = img.url;
                thumbnail = img.url; // Use same URL for thumbnail
            } else if (img?.full) {
                url = img.full;
                thumbnail = img.thumbnail || img.medium || img.full;
            } else if (img?.thumbnail) {
                thumbnail = img.thumbnail;
                url = img.url || img.medium || img.large || img.thumbnail;
            }
            
            // Only return if we have a valid URL
            if (!url) return null;
            
            return {
                src: url,
                thumbnail: thumbnail || url,
                width: img.width || 1200,
                height: img.height || 800,
                alt: vehicle.title || `${vehicle.year} ${vehicle.make} ${vehicle.model}` || `Vehicle Image ${index + 1}`,
            };
        }).filter(Boolean); // Remove null entries
    };

    // Get primary vehicle image URL (for thumbnail display)
    const getVehicleImageUrl = (vehicle) => {
        if (!vehicle?.images?.length) return '';
        
        // First, try to find primary image
        const primaryImage = vehicle.images.find(img => {
            if (typeof img === 'object' && img.is_primary) return true;
            return false;
        });
        
        if (primaryImage) {
            if (typeof primaryImage === 'string') {
                return primaryImage;
            }
            return primaryImage.url || primaryImage.thumbnail || primaryImage.full || '';
        }
        
        // Fallback to first image
        const firstImage = vehicle.images[0];
        if (typeof firstImage === 'string') {
            return firstImage;
        }
        return firstImage?.url || firstImage?.thumbnail || firstImage?.full || '';
    };

    if (!open) return null;

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    key="reverse-bidding-confirm-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={handleClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className={cn(
                            "bg-white rounded-2xl shadow-2xl max-w-6xl w-full mx-auto border-2 border-orange-200/50 overflow-hidden flex flex-col max-h-[70vh]",
                            loading && "pointer-events-none"
                        )}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-orange-50 to-orange-100/50 p-4 border-b border-orange-200/50 flex-shrink-0">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center">
                                        <Car className="w-6 h-6 text-orange-500" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-neutral-900">
                                            Confirm Reverse Bidding
                                        </h2>
                                        <p className="text-xs text-neutral-600 mt-0.5">
                                            Review your vehicle and preferences
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleClose}
                                    disabled={loading}
                                    className="p-2 rounded-lg hover:bg-neutral-100 transition-colors disabled:opacity-50"
                                    aria-label="Close"
                                >
                                    <X className="w-5 h-5 text-neutral-600" />
                                </button>
                            </div>
                        </div>

                        {/* Two Column Layout */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 flex-1 min-h-0 overflow-hidden">
                            {/* Left Column - Primary Vehicle & Preferences */}
                            <div className="bg-white p-4 overflow-y-auto border-r border-neutral-200">
                                <div className="space-y-4">
                                    {/* Primary Vehicle Info */}
                            <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                                        className="space-y-4"
                                    >
                                        <h3 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
                                            <Car className="w-5 h-5 text-orange-500" />
                                            Primary Vehicle
                                </h3>

                                        {car && (() => {
                                            const carImages = prepareVehicleImages(car);
                                            const primaryImageUrl = getVehicleImageUrl(car);
                                            const carPrice = formatCurrency(car.price);
                                            
                                            return (
                                                <div className="bg-gradient-to-br from-orange-50 to-orange-100/30 rounded-xl border border-orange-200/50 p-5 space-y-4">
                                                    <div className="flex items-start gap-4">
                                                        {primaryImageUrl ? (
                                                            carImages.length > 0 ? (
                                                                <Gallery>
                                                                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-neutral-200 flex-shrink-0 cursor-pointer">
                                                                        {carImages.map((image, imgIndex) => (
                                                                            <Item
                                                                                key={imgIndex}
                                                                                original={image.src}
                                                                                thumbnail={image.thumbnail || image.src}
                                                                                width={image.width}
                                                                                height={image.height}
                                                                                alt={image.alt}
                                                                            >
                                                                                {({ ref, open }) => (
                                                                                    <img
                                                                                        ref={imgIndex === 0 ? ref : null}
                                                                                        onClick={imgIndex === 0 ? open : undefined}
                                                                                        src={imgIndex === 0 ? primaryImageUrl : undefined}
                                                                                        alt={image.alt}
                                                                                        className={`w-full h-full object-cover ${imgIndex === 0 ? 'block' : 'hidden'}`}
                                                                                    />
                                                                                )}
                                                                            </Item>
                                                                        ))}
                                                                    </div>
                                                                </Gallery>
                                                            ) : (
                                                                <div className="w-24 h-24 rounded-lg overflow-hidden bg-neutral-200 flex-shrink-0">
                                                                    <img
                                                                        src={primaryImageUrl}
                                                                        alt={car.title || `${car.year} ${car.make} ${car.model}`}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                </div>
                                                            )
                                                        ) : null}
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="text-lg font-bold text-neutral-900 mb-2">
                                                                {car.year} {car.make} {car.model}
                                                            </h4>
                                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                                {carPrice ? (
                                                                    <div className="flex items-center gap-1.5 text-neutral-700">
                                                                        <DollarSign className="w-4 h-4 text-orange-500" />
                                                                        <span className="font-semibold">{carPrice}</span>
                                                                    </div>
                                                                ) : (
                                                                    <div className="flex items-center gap-1.5 text-neutral-500">
                                                                        <DollarSign className="w-4 h-4" />
                                                                        <span className="text-xs">Price not available</span>
                                                                    </div>
                                                                )}
                                                                {car.year && (
                                                                    <div className="flex items-center gap-1.5 text-neutral-700">
                                                                        <Calendar className="w-4 h-4 text-orange-500" />
                                                                        <span>{car.year}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Vehicle Details Grid */}
                                                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-orange-200/50">
                                                        {car.vin && (
                                                            <div className="col-span-2">
                                                                <span className="text-xs text-neutral-500">VIN</span>
                                                                <p className="text-sm font-medium text-neutral-900 font-mono">{car.vin}</p>
                                                            </div>
                                                        )}
                                                        {car.make && (
                                                            <div>
                                                                <span className="text-xs text-neutral-500">Make</span>
                                                                <p className="text-sm font-medium text-neutral-900">{car.make}</p>
                                                            </div>
                                                        )}
                                                        {car.model && (
                                                            <div>
                                                                <span className="text-xs text-neutral-500">Model</span>
                                                                <p className="text-sm font-medium text-neutral-900">{car.model}</p>
                                                            </div>
                                                        )}
                                                        {car.body_type && (
                                                            <div>
                                                                <span className="text-xs text-neutral-500">Body Type</span>
                                                                <p className="text-sm font-medium text-neutral-900">{car.body_type}</p>
                                                            </div>
                                                        )}
                                                        {car.transmission && (
                                                            <div>
                                                                <span className="text-xs text-neutral-500">Transmission</span>
                                                                <p className="text-sm font-medium text-neutral-900">{car.transmission}</p>
                                                            </div>
                                                        )}
                                                        {car.fuel_type && (
                                                            <div>
                                                                <span className="text-xs text-neutral-500">Fuel Type</span>
                                                                <p className="text-sm font-medium text-neutral-900">{car.fuel_type}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                    </motion.div>

                                    {/* Zip Code Input */}
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.15 }}
                                        className="space-y-1.5"
                                    >
                                        <label className="text-xs font-medium text-neutral-700 flex items-center gap-1.5">
                                            <MapPin className="w-3.5 h-3.5 text-orange-500" />
                                            Zip Code
                                        </label>
                                        <div className="relative">
                                            <Input
                                                type="text"
                                                placeholder="Enter zip code"
                                                value={formData.zipCode}
                                                onChange={(e) => {
                                                    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
                                                    if (value.length <= 5) {
                                                        setFormData(prev => ({ ...prev, zipCode: value }));
                                                    }
                                                }}
                                                className={cn(
                                                    "w-full bg-white border-neutral-200 focus-visible:ring-orange-500/20 h-9 text-sm pr-8",
                                                    locationData.error && "border-red-300 focus-visible:ring-red-500/20",
                                                    locationData.city && locationData.state && !locationData.error && "border-green-300 focus-visible:ring-green-500/20"
                                                )}
                                                maxLength={5}
                                            />
                                            {locationData.loading && (
                                                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                                    <Loader2 className="w-4 h-4 text-orange-500 animate-spin" />
                                                </div>
                                            )}
                                        </div>
                                        
                                        {/* Location Display / Error Message */}
                                        {locationData.loading && formData.zipCode?.trim() && (
                                            <p className="text-xs text-neutral-500 flex items-center gap-1">
                                                <Loader2 className="w-3 h-3 animate-spin" />
                                                Looking up location...
                                            </p>
                                        )}
                                        
                                        {locationData.error && !locationData.loading && (
                                            <p className="text-xs text-red-600 flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" />
                                                {locationData.error}
                                            </p>
                                        )}
                                        
                                        {locationData.city && locationData.state && !locationData.error && !locationData.loading && (
                                            <p className="text-xs text-green-700 flex items-center gap-1">
                                                <CheckCircle2 className="w-3 h-3" />
                                                {locationData.city}, {locationData.state}
                                            </p>
                                        )}
                                    </motion.div>

                                    {/* Dealer Preference */}
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.17 }}
                                        className="space-y-1.5"
                                    >
                                        <label className="text-xs font-medium text-neutral-700 flex items-center gap-1.5">
                                            <Car className="w-3.5 h-3.5 text-orange-500" />
                                            Dealer Preference
                                        </label>
                                        <div className="space-y-1.5">
                                            <label className="flex items-start gap-2 p-2 rounded-md border-2 cursor-pointer transition-all hover:shadow-sm group"
                                                style={{
                                                    borderColor: formData.dealerPreference === 'local' ? '#f97316' : '#e5e7eb',
                                                    backgroundColor: formData.dealerPreference === 'local' ? '#fff7ed' : '#ffffff'
                                                }}
                                            >
                                                <input
                                                    type="radio"
                                                    name="dealerPreference"
                                                    value="local"
                                                    checked={formData.dealerPreference === 'local'}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, dealerPreference: e.target.value }))}
                                                    className="mt-0.5 w-3.5 h-3.5 text-orange-500 border-neutral-300 focus:ring-orange-500"
                                                />
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-1.5 mb-0.5">
                                                        <MapPin className="w-3.5 h-3.5 text-blue-500" />
                                                        <span className="text-xs font-semibold text-neutral-900">Local Dealers</span>
                                                    </div>
                                                    <p className="text-[10px] text-neutral-600 leading-tight">
                                                        Share with verified local dealers in your area
                                                    </p>
                                                </div>
                                            </label>
                                            <label className="flex items-start gap-2 p-2 rounded-md border-2 cursor-pointer transition-all hover:shadow-sm group"
                                                style={{
                                                    borderColor: formData.dealerPreference === 'all' ? '#f97316' : '#e5e7eb',
                                                    backgroundColor: formData.dealerPreference === 'all' ? '#fff7ed' : '#ffffff'
                                                }}
                                            >
                                                <input
                                                    type="radio"
                                                    name="dealerPreference"
                                                    value="all"
                                                    checked={formData.dealerPreference === 'all'}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, dealerPreference: e.target.value }))}
                                                    className="mt-0.5 w-3.5 h-3.5 text-orange-500 border-neutral-300 focus:ring-orange-500"
                                                />
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-1.5 mb-0.5">
                                                        <Share2 className="w-3.5 h-3.5 text-orange-500" />
                                                        <span className="text-xs font-semibold text-neutral-900">All Dealers</span>
                                                    </div>
                                                    <p className="text-[10px] text-neutral-600 leading-tight">
                                                        Share with all dealers across the platform for more competitive offers
                                                    </p>
                                                </div>
                                            </label>
                                        </div>
                                    </motion.div>

                                    {/* Consent Checkboxes - Ultra Compact */}
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="space-y-1.5"
                                    >
                                        <h3 className="text-[10px] font-semibold text-neutral-600 uppercase tracking-wide">
                                            Consent & Agreements
                                        </h3>
                                        
                                        <div className="space-y-1">
                                            {/* Terms of Service */}
                                            <label className="flex items-center gap-2 py-1 cursor-pointer group mb-0">
                                                <div className="relative flex-shrink-0">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.consent.terms}
                                                        onChange={() => toggleConsent('terms')}
                                                        className="sr-only"
                                                    />
                                                    <div className={cn(
                                                        "w-3.5 h-3.5 rounded border-2 flex items-center justify-center transition-all",
                                                        formData.consent.terms
                                                            ? "bg-orange-500 border-orange-500"
                                                            : "bg-white border-neutral-300 group-hover:border-orange-400"
                                                    )}>
                                                        {formData.consent.terms && (
                                                            <Check className="w-2 h-2 text-white" />
                                                        )}
                                                    </div>
                                                </div>
                                                <span className="text-[10px] text-neutral-600 leading-tight">
                                                    I agree to the <a href="#" className="text-orange-600 hover:underline">Terms of Service</a>
                                                </span>
                                            </label>

                                            {/* Privacy Policy */}
                                            <label className="flex items-center gap-2 py-1 cursor-pointer group mb-0">
                                                <div className="relative flex-shrink-0">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.consent.privacy}
                                                        onChange={() => toggleConsent('privacy')}
                                                        className="sr-only"
                                                    />
                                                    <div className={cn(
                                                        "w-3.5 h-3.5 rounded border-2 flex items-center justify-center transition-all",
                                                        formData.consent.privacy
                                                            ? "bg-orange-500 border-orange-500"
                                                            : "bg-white border-neutral-300 group-hover:border-orange-400"
                                                    )}>
                                                        {formData.consent.privacy && (
                                                            <Check className="w-2 h-2 text-white" />
                                                        )}
                                                    </div>
                                                </div>
                                                <span className="text-[10px] text-neutral-600 leading-tight">
                                                    I agree to the <a href="#" className="text-orange-600 hover:underline">Privacy Policy</a>
                                                </span>
                                            </label>

                                            {/* Data Sharing */}
                                            <label className="flex items-center gap-2 py-1 cursor-pointer group mb-0">
                                                <div className="relative flex-shrink-0">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.consent.dataSharing}
                                                        onChange={() => toggleConsent('dataSharing')}
                                                        className="sr-only"
                                                    />
                                                    <div className={cn(
                                                        "w-3.5 h-3.5 rounded border-2 flex items-center justify-center transition-all",
                                                        formData.consent.dataSharing
                                                            ? "bg-orange-500 border-orange-500"
                                                            : "bg-white border-neutral-300 group-hover:border-orange-400"
                                                    )}>
                                                        {formData.consent.dataSharing && (
                                                            <Check className="w-2 h-2 text-white" />
                                                        )}
                                                    </div>
                                                </div>
                                                <span className="text-[10px] text-neutral-600 leading-tight">
                                                    I consent to <a href="#" className="text-orange-600 hover:underline">data sharing</a> with dealers
                                                </span>
                                            </label>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>

                            {/* Right Column - Alternative Vehicles */}
                            <div className="bg-neutral-50 p-4 overflow-y-auto">
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="space-y-3"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-base font-semibold text-neutral-900 flex items-center gap-2">
                                            <Car className="w-4 h-4 text-orange-500" />
                                            Alternative Vehicles
                                        </h3>
                                        {displayedAlternatives.length > 0 && (
                                            <span className="text-xs text-neutral-500 bg-neutral-200 px-2 py-1 rounded-full">
                                                {formData.selectedAlternatives.length} of {displayedAlternatives.length} selected
                                            </span>
                                        )}
                                    </div>

                                    {displayedAlternatives.length === 0 ? (
                                        <div className="text-center py-12">
                                            <Car className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                                            <p className="text-sm text-neutral-500">
                                                No alternative vehicles found
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {displayedAlternatives.map((vehicle, index) => {
                                                const isSelected = formData.selectedAlternatives.includes(vehicle.id);
                                                const vehicleImages = prepareVehicleImages(vehicle);
                                                const imageUrl = getVehicleImageUrl(vehicle);
                                                const vehiclePrice = formatCurrency(vehicle.price);
                                                
                                                return (
                                                    <motion.div
                                                        key={vehicle.id}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: 0.1 + (index * 0.05) }}
                                                        className={cn(
                                                            "relative rounded-xl border-2 p-4 bg-white transition-all cursor-pointer group",
                                                            isSelected
                                                                ? "border-orange-500 bg-orange-50/50 shadow-md"
                                                                : "border-neutral-200 hover:border-orange-300 hover:shadow-sm"
                                                        )}
                                                        onClick={() => toggleAlternative(vehicle.id)}
                                                    >
                                                        {/* Checkbox */}
                                                        <div className="absolute top-4 right-4 z-10">
                                                            <div className={cn(
                                                                "w-6 h-6 rounded border-2 flex items-center justify-center transition-all",
                                                                isSelected
                                                                    ? "bg-orange-500 border-orange-500"
                                                                    : "bg-white border-neutral-300 group-hover:border-orange-400"
                                                            )}>
                                                                {isSelected && (
                                                                    <Check className="w-4 h-4 text-white" />
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="flex gap-4 pr-8">
                                                            {/* Vehicle Image */}
                                                            <div className="w-20 h-20 rounded-lg overflow-hidden bg-neutral-200 flex-shrink-0">
                                                                {imageUrl ? (
                                                                    vehicleImages.length > 0 ? (
                                                                        <Gallery>
                                                                            {vehicleImages.map((image, imgIndex) => (
                                                                                <Item
                                                                                    key={imgIndex}
                                                                                    original={image.src}
                                                                                    thumbnail={image.thumbnail || image.src}
                                                                                    width={image.width}
                                                                                    height={image.height}
                                                                                    alt={image.alt}
                                                                                >
                                                                                    {({ ref, open }) => (
                                                                                        <img
                                                                                            ref={imgIndex === 0 ? ref : null}
                                                                                            onClick={(e) => {
                                                                                                e.stopPropagation();
                                                                                                if (imgIndex === 0) open();
                                                                                            }}
                                                                                            src={imgIndex === 0 ? imageUrl : undefined}
                                                                                            alt={image.alt}
                                                                                            className={`w-full h-full object-cover ${imgIndex === 0 ? 'cursor-pointer block' : 'hidden'}`}
                                                                                        />
                                                                                    )}
                                                                                </Item>
                                                                            ))}
                                                                        </Gallery>
                                                                    ) : (
                                                                        <img
                                                                            src={imageUrl}
                                                                            alt={vehicle.title || `${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                                                                            className="w-full h-full object-cover"
                                                                        />
                                                                    )
                                                                ) : (
                                                                    <div className="w-full h-full flex items-center justify-center">
                                                                        <Car className="w-8 h-8 text-neutral-400" />
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* Vehicle Info */}
                                                            <div className="flex-1 min-w-0">
                                                                <h4 
                                                                    className="text-base font-bold text-neutral-900 mb-1.5 hover:text-orange-600 transition-colors cursor-pointer truncate"
                                                                    onClick={(e) => handleViewVehicle(vehicle.id, e)}
                                                                >
                                                                    {vehicle.year} {vehicle.make} {vehicle.model}
                                                                </h4>
                                                                
                                                                <div className="space-y-1.5">
                                                                    {vehicle.vin && (
                                                                        <div className="text-xs text-neutral-500">
                                                                            <span className="font-medium">VIN: </span>
                                                                            <span className="font-mono text-neutral-700">{vehicle.vin}</span>
                                                                        </div>
                                                                    )}
                                                                    <div className="flex items-center gap-4 text-sm">
                                                                        {vehiclePrice ? (
                                                                            <div className="flex items-center gap-1 text-neutral-700">
                                                                                <DollarSign className="w-3.5 h-3.5 text-orange-500" />
                                                                                <span className="font-semibold">{vehiclePrice}</span>
                                                                                {vehicle.price_difference && vehicle.price_difference > 0 && (
                                                                                    <span className="text-xs text-green-600 font-medium">
                                                                                        (Save {formatCurrency(vehicle.price_difference)})
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                        ) : (
                                                                            <div className="flex items-center gap-1 text-neutral-500">
                                                                                <DollarSign className="w-3.5 h-3.5" />
                                                                                <span className="text-xs font-medium">Price not available</span>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    
                                                                    <div className="flex items-center gap-3 text-xs text-neutral-600 flex-wrap">
                                                                        {vehicle.body_type && (
                                                                            <div className="flex items-center gap-1">
                                                                                <Car className="w-3 h-3" />
                                                                                <span>{vehicle.body_type}</span>
                                                                            </div>
                                                                        )}
                                                                        {vehicle.transmission && (
                                                                            <div className="flex items-center gap-1">
                                                                                <Settings className="w-3 h-3" />
                                                                                <span>{vehicle.transmission}</span>
                                                                            </div>
                                                                        )}
                                                                        {vehicle.fuel_type && (
                                                                            <div className="flex items-center gap-1">
                                                                                <Fuel className="w-3 h-3" />
                                                                                <span>{vehicle.fuel_type}</span>
                                                                            </div>
                                                                        )}
                                                                    </div>

                                                                    {/* Matching indicators */}
                                                                    {(vehicle.matching_attributes_count > 0 || vehicle.price_within_range) && (
                                                                        <div className="flex items-center gap-2 mt-2">
                                                                            {vehicle.price_within_range && (
                                                                                <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">
                                                                                    Price Match
                                                                                </span>
                                                                            )}
                                                                            {vehicle.matching_attributes_count > 0 && (
                                                                                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">
                                                                                    {vehicle.matching_attributes_count} Similar
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                {/* View Details Button */}
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="mt-2 h-7 text-xs text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                                                                    onClick={(e) => handleViewVehicle(vehicle.id, e)}
                                                                >
                                                                    View Details
                                                                    <ExternalLink className="w-3 h-3 ml-1" />
                                                                </Button>
                                    </div>
                                </div>
                            </motion.div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </motion.div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-between gap-4 p-4 border-t border-neutral-200 bg-white flex-shrink-0">
                            <div className="text-sm text-neutral-600">
                                {formData.selectedAlternatives.length > 0 && (
                                    <span>
                                        {formData.selectedAlternatives.length} alternative{formData.selectedAlternatives.length !== 1 ? 's' : ''} selected
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-3">
                                <Button
                                    variant="outline"
                                onClick={handleClose}
                                disabled={loading}
                            >
                                Cancel
                                </Button>
                                <Button
                                onClick={handleConfirm}
                                    disabled={loading || !isFormValid}
                                    className="bg-orange-500 hover:bg-orange-600 text-white"
                            >
                                {loading ? (
                                    <>
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{
                                                duration: 1,
                                                repeat: Infinity,
                                                ease: "linear",
                                            }}
                                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                                        />
                                        <span>Starting...</span>
                                    </>
                                ) : (
                                    <>
                                        <Car className="w-4 h-4" />
                                        <span>Start Reverse Bidding</span>
                                    </>
                                )}
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
