import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    Heart,
    MapPin,
    DollarSign,
    Calendar,
    Star,
    Phone,
    Mail,
    Package,
    Ruler,
    Weight,
    Clock,
    FileText,
    Tag,
    ChevronRight,
    ChevronLeft,
    CheckCircle2
} from 'lucide-react';
import 'photoswipe/dist/photoswipe.css';
import { Gallery, Item } from 'react-photoswipe-gallery';
import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
} from '../../../components/ui/tabs';
import apiRev from '../../../lib/apiRev';
import ReverseBiddingConfirmDialog from '../components/ReverseBiddingConfirmDialog';
import LoginModal from '../../../components/ui/LoginModal';
import DealerContactModal from '../components/DealerContactModal';
import { startReverseBiddingThunk } from '../redux/reverseBidSlice';

export default function VehicleDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [vehicleData, setVehicleData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSaved, setIsSaved] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [pendingAction, setPendingAction] = useState(false);
    const [alternativeVehicles, setAlternativeVehicles] = useState(null);
    const [loadingAlternatives, setLoadingAlternatives] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0); // Track current carousel image
    const [dealerContactModalOpen, setDealerContactModalOpen] = useState(false); // Track dealer contact modal
    const { user } = useSelector((state) => state.user);
    const { loading: reverseBidLoading } = useSelector((state) => state.reverseBid);
    const sessionLoading = reverseBidLoading.session;
    const isLoggedIn = !!user;

    // Fetch vehicle details on mount
    useEffect(() => {
        const fetchVehicleDetails = async () => {
            if (!id) {
                setError('Vehicle ID is required');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                const response = await apiRev.get(`/vehicles/${id}`);

                if (response.data && response.data.success && response.data.data) {
                    setVehicleData(response.data.data);
                } else {
                    setError(response.data?.message || 'Failed to fetch vehicle details');
                }
            } catch (err) {
                console.error('Error fetching vehicle details:', err);
                setError(
                    err.response?.data?.message ||
                    err.message ||
                    'Failed to fetch vehicle details'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchVehicleDetails();
    }, [id]);

    // Function to fetch alternative vehicles
    const fetchAlternativeVehicles = async () => {
        if (!vehicleData) {
            console.log('Alternative vehicles: No vehicle data available');
            return null;
        }
        console.log("vehicle data" , vehicleData);
        
        // Extract Vehicle Details section from description
        const extractVehicleDetailsSection = (desc) => {
            if (!desc) return null;
            const detailsMatch = desc.match(/<h3>Vehicle Details<\/h3>([\s\S]*?)(?=<h3>|$)/i);
            if (detailsMatch) {
                return detailsMatch[1];
            }
            return null;
        };
        
        // Parse value from Vehicle Details HTML (format: <li><strong>Label:</strong> Value</li>)
        const parseDetailValue = (detailsHtml, label) => {
            if (!detailsHtml) return '';
            
            // Escape special regex characters in label
            const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            
            // Pattern 1: <li><strong>Label:</strong> Value</li> or <li><strong>Label</strong> Value</li>
            const pattern1 = new RegExp(`<li[^>]*>\\s*<strong[^>]*>\\s*${escapedLabel}\\s*:?\\s*</strong>\\s*([^<]+?)\\s*</li>`, 'i');
            let match = detailsHtml.match(pattern1);
            if (match && match[1]) {
                return match[1].trim();
            }
            
            // Pattern 2: <strong>Label:</strong> Value (without li tags)
            const pattern2 = new RegExp(`<strong[^>]*>\\s*${escapedLabel}\\s*:?\\s*</strong>\\s*([^<]+)`, 'i');
            match = detailsHtml.match(pattern2);
            if (match && match[1]) {
                return match[1].trim();
            }
            
            return '';
        };
        
        // Extract Vehicle Details section from description
        const vehicleDetailsSection = extractVehicleDetailsSection(vehicleData.description);
        
        // Extract required parameters from vehicleData
        const make = vehicleData.make;
        const model = vehicleData.model || '';
        
        // Extract body, transmission, and fuel_type from Vehicle Details section
        let body = '';
        let transmission = '';
        let fuel_type = '';
        
        if (vehicleDetailsSection) {
            // Try various label formats
            body = parseDetailValue(vehicleDetailsSection, 'Body Type') ||
                   parseDetailValue(vehicleDetailsSection, 'Body') ||
                   parseDetailValue(vehicleDetailsSection, 'Body Style') ||
                   '';
            
            transmission = parseDetailValue(vehicleDetailsSection, 'Transmission') ||
                          parseDetailValue(vehicleDetailsSection, 'Trans') ||
                          '';
            
            fuel_type = parseDetailValue(vehicleDetailsSection, 'Fuel Type') ||
                       parseDetailValue(vehicleDetailsSection, 'Fuel') ||
                       parseDetailValue(vehicleDetailsSection, 'Engine') ||
                       '';
        }
        
        // Fallback to direct fields if not found in description
        if (!body) {
            body = vehicleData.body_type || vehicleData.body || '';
        }
        if (!transmission) {
            transmission = vehicleData.transmission || '';
        }
        if (!fuel_type) {
            fuel_type = vehicleData.fuel_type || vehicleData.fuelType || vehicleData.fueltype || '';
        }
        
        const price = vehicleData.price || vehicleData.regular_price || 0;
        
        // Log extracted values for debugging
        console.log('Extracted vehicle parameters:', {
            make,
            model,
            body,
            transmission,
            fuel_type,
            price,
            hasDescription: !!vehicleData.description,
            hasVehicleDetailsSection: !!vehicleDetailsSection,
            vehicleDetailsSectionLength: vehicleDetailsSection?.length || 0
        });

        // Only fetch if we have required parameters (make and price)
        if (!make || !price || price === 0) {
            console.log('Alternative vehicles: Missing required parameters (make or price)');
            return null;
        }

        try {
            setLoadingAlternatives(true);
            
            // Build query parameters - only include non-empty values
            const params = new URLSearchParams();
            params.append('make', make);
            if (model && model.trim()) params.append('model', model.trim());
            if (body && body.trim()) params.append('body', body.trim());
            if (transmission && transmission.trim()) params.append('transmission', transmission.trim());
            if (fuel_type && fuel_type.trim()) params.append('fuel_type', fuel_type.trim());
            params.append('price', price.toString());

            console.log('Fetching alternative vehicles with params:', {
                make,
                model: model || '(empty)',
                body: body || '(empty)',
                transmission: transmission || '(empty)',
                fuel_type: fuel_type || '(empty)',
                price
            });
            
            console.log('Final URL params:', params.toString());

            const response = await apiRev.get(`/vehicles/alternatives?${params.toString()}`);

            if (response.data && response.data.success) {
                const alternatives = response.data.data?.data || [];
                setAlternativeVehicles(alternatives);
                console.log('Alternative vehicles response:', response.data);
                console.log('Alternative vehicles count:', alternatives.length);
                console.log('Alternative vehicles:', alternatives);
                return alternatives;
            } else {
                console.log('Alternative vehicles: No success response', response.data);
                setAlternativeVehicles([]);
                return [];
            }
        } catch (err) {
            console.error('Error fetching alternative vehicles:', err);
            console.error('Error details:', err.response?.data || err.message);
            setAlternativeVehicles([]);
            return [];
        } finally {
            setLoadingAlternatives(false);
        }
    };

    // Prepare images array for PhotoSwipe
    const images = useMemo(() => {
        if (!vehicleData?.images?.length) return [];

        return vehicleData.images.map((img, index) => {
            let url = '';
            let thumbnail = '';

            if (typeof img === 'string') {
                url = img;
                thumbnail = img;
            } else if (img?.url || img?.full) {
                url = img.url || img.full;
                thumbnail = img.thumbnail || img.medium || img.url || img.full;
            } else if (img?.thumbnail) {
                thumbnail = img.thumbnail;
                url = img.url || img.medium || img.large || img.thumbnail;
            }

            return {
                src: url,
                thumbnail: thumbnail || url,
                width: img.width || 1200,
                height: img.height || 800,
                alt: vehicleData.title || `Vehicle Image ${index + 1}`,
            };
        });
    }, [vehicleData?.images, vehicleData?.title]);

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

    // Check if vehicle is sold
    const isSold = vehicleData?.inventory_status === 'sold';

    // Handle start bidding - Fetch alternatives first, then open dialog
    const handleStartBidding = async (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        // Don't proceed if already loading
        if (sessionLoading || loadingAlternatives) {
            return;
        }

        // Fetch alternative vehicles first
        console.log('Start Reverse Bidding clicked - fetching alternative vehicles...');
        await fetchAlternativeVehicles();

        // Then proceed with the normal flow
        if (!isLoggedIn) {
            setPendingAction(true);
            setLoginModalOpen(true);
        } else {
            // Just open the dialog - user must confirm in dialog to actually start
            setDialogOpen(true);
        }
    };

    useEffect(() => {
        if (isLoggedIn && pendingAction && !loginModalOpen) {
            setPendingAction(false);
            setDialogOpen(true);
        }
    }, [isLoggedIn, pendingAction, loginModalOpen]);

    const handleLoginModalClose = (open) => {
        if (!open) {
            setLoginModalOpen(false);
            if (!isLoggedIn) {
                setPendingAction(false);
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                    <p className="text-neutral-600">Loading vehicle details...</p>
                </div>
            </div>
        );
    }

    if (error || !vehicleData) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center px-6">
                <div className="text-center max-w-md">
                    <p className="text-red-600 mb-4">{error || 'Vehicle not found'}</p>
                    <button
                        onClick={() => navigate('/reverse-bidding/results')}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Results
                    </button>
                </div>
            </div>
        );
    }

    // Condition badge
    const conditionValue = vehicleData.new_used || vehicleData.condition || 'new';
    const conditionBadge = conditionValue === 'U' || conditionValue === 'used' ? 'Used' : 'New';
    const conditionColor = conditionValue === 'U' || conditionValue === 'used'
        ? 'bg-blue-500/80'
        : 'bg-green-500/80';

    // Location
    const location = vehicleData.city && vehicleData.state
        ? `${vehicleData.city}, ${vehicleData.state}`
        : vehicleData.zip_code || 'Location unavailable';

    // Price
    const price = vehicleData.price || vehicleData.regular_price || 0;
    const salePrice = vehicleData.sale_price;
    const onSale = vehicleData.on_sale || (salePrice && salePrice < price);
    const priceHtml = vehicleData.price_html;

    // Extract mileage from description if available (format: "Mileage: X miles" or "X miles")
    const extractMileage = (desc) => {
        if (!desc) return null;
        const mileageMatch = desc.match(/mileage[:\s]*(\d+(?:,\d{3})*)\s*miles?/i);
        if (mileageMatch) {
            return parseInt(mileageMatch[1].replace(/,/g, ''), 10);
        }
        return null;
    };

    // Extract MPG from description if available
    const extractMPG = (desc) => {
        if (!desc) return { city: null, highway: null };
        const mpgMatch = desc.match(/mpg[:\s]*(\d+)\s*city\s*\/\s*(\d+)\s*highway/i);
        if (mpgMatch) {
            return { city: parseInt(mpgMatch[1], 10), highway: parseInt(mpgMatch[2], 10) };
        }
        return { city: null, highway: null };
    };

    const mileage = vehicleData.mileage || vehicleData.odometer || extractMileage(vehicleData.description);
    const mpgData = extractMPG(vehicleData.description);
    const mpgCity = vehicleData.mpg_city || vehicleData.city_mpg || mpgData.city;
    const mpgHighway = vehicleData.mpg_highway || vehicleData.highway_mpg || mpgData.highway;

    // Format dates
    const formatDate = (dateString) => {
        if (!dateString) return null;
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch {
            return dateString;
        }
    };

    // Format currency - with commas, no decimals
    const formatCurrency = (amount) => {
        if (!amount && amount !== 0) return 'N/A';
        return `$${parseFloat(amount).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pt-6">
                {/* Sticky Header Section with Breadcrumbs and Title */}
                <div className="sticky top-0 z-50 bg-white border-b border-neutral-200 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 pt-6 pb-6 mb-8">
                    {/* Breadcrumbs */}
                    <nav className="mb-4 text-sm text-neutral-600">
                        <div className="flex items-center gap-2 flex-wrap">
                            <Link
                                to="/"
                                className="hover:text-orange-600 transition-colors"
                            >
                                Home
                            </Link>
                            <ChevronRight className="w-4 h-4" />

                            <Link
                                to="/reverse-bidding/results"
                                className="hover:text-orange-600 transition-colors"
                            >
                                All Cars
                            </Link>
                            {(vehicleData.vin || vehicleData.stock_number || vehicleData.stockNumber || vehicleData.stock || vehicleData.sku) && (
                                <>
                                    <ChevronRight className="w-4 h-4" />
                                    <div className="flex items-center gap-2 flex-wrap">
                                        {vehicleData.vin && (
                                            <span className="text-neutral-400">VIN: {vehicleData.vin}</span>
                                        )}
                                        {(vehicleData.stock_number || vehicleData.stockNumber || vehicleData.stock || vehicleData.sku) && (
                                            <>
                                                {vehicleData.vin && <span className="text-neutral-400">•</span>}
                                                <span className="text-neutral-400">
                                                    Stock#: {vehicleData.stock_number || vehicleData.stockNumber || vehicleData.stock || vehicleData.sku}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </nav>

                    {/* Header with Back Button and Vehicle Title */}
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0 pr-4">
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-neutral-900 mb-2 truncate">
                                {vehicleData.title || `${vehicleData.year} ${vehicleData.make} ${vehicleData.model}`}
                            </h1>
                            <div className="flex items-center gap-3 text-xs sm:text-sm text-neutral-600 flex-wrap">
                                <span className="px-2 py-1 rounded-md text-xs font-medium bg-neutral-100 whitespace-nowrap">{conditionBadge}</span>
                                {mileage && (
                                    <>
                                        <span>•</span>
                                        <span className="whitespace-nowrap">{mileage.toLocaleString()} mi</span>
                                    </>
                                )}
                                {(mpgCity || mpgHighway) && (
                                    <>
                                        <span>•</span>
                                        <span className="whitespace-nowrap">
                                            {mpgCity && mpgHighway
                                                ? `${mpgCity} city / ${mpgHighway} highway MPG`
                                                : mpgCity
                                                    ? `${mpgCity} city MPG`
                                                    : `${mpgHighway} highway MPG`
                                            }
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                            <button
                                onClick={() => navigate('/reverse-bidding/results')}
                                className="p-2 rounded-lg hover:bg-neutral-100 transition-colors inline-flex items-center"
                                aria-label="Go back"
                            >
                                <ArrowLeft className="w-5 h-5 text-neutral-700" />
                            </button>
                            {!isSold && (
                                <>
                                    {price === 0 ? (
                                        <button
                                            onClick={() => setDealerContactModalOpen(true)}
                                            className="bg-transparent border border-neutral-300 text-neutral-700 px-4 py-2 rounded-lg font-medium hover:bg-neutral-50 hover:border-neutral-400 transition-colors whitespace-nowrap text-sm"
                                        >
                                            Request for price
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => setDealerContactModalOpen(true)}
                                            className="bg-transparent border border-neutral-300 text-neutral-700 px-4 py-2 rounded-lg font-medium hover:bg-neutral-50 hover:border-neutral-400 transition-colors whitespace-nowrap text-sm"
                                        >
                                            Contact dealer
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                    {/* Left Column - Images and Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Image Gallery with Carousel */}
                        <Gallery>
                            <div className="relative bg-neutral-100 rounded-xl overflow-hidden group/image-container">
                                {primaryImage && images.length > 0 ? (
                                    <div className="relative aspect-[4/3]">
                                        {/* Carousel Image Display */}
                                        <AnimatePresence mode="wait">
                                            {images.map((image, index) => {
                                                if (index !== currentImageIndex) return null;
                                                
                                                return (
                                                    <Item
                                                        key={`gallery-${index}`}
                                                        original={image.src}
                                                        thumbnail={image.thumbnail || image.src}
                                                        width={image.width}
                                                        height={image.height}
                                                        alt={image.alt}
                                                    >
                                                        {({ ref, open }) => (
                                                            <motion.img
                                                                ref={ref}
                                                                onClick={open}
                                                                key={index}
                                                                src={image.src}
                                                                alt={image.alt}
                                                                initial={{ opacity: 0, scale: 1.1 }}
                                                                animate={{ opacity: 1, scale: 1 }}
                                                                exit={{ opacity: 0, scale: 0.95 }}
                                                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                                                className="w-full h-full object-cover transition-transform duration-700 group-hover/image-container:scale-110 cursor-pointer"
                                                                loading={index === 0 ? 'eager' : 'lazy'}
                                                            />
                                                        )}
                                                    </Item>
                                                );
                                            })}
                                        </AnimatePresence>

                                        {/* Navigation Arrows - Only show if more than 1 image */}
                                        {images.length > 1 && (
                                            <>
                                                {/* Previous Button */}
                                                <button
                                                    onClick={goToPrevious}
                                                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/90 backdrop-blur-md text-neutral-700 hover:bg-white hover:text-orange-600 shadow-lg transition-all duration-200 hover:scale-110 opacity-0 group-hover/image-container:opacity-100 z-30"
                                                    aria-label="Previous image"
                                                >
                                                    <ChevronLeft className="w-5 h-5" />
                                                </button>

                                                {/* Next Button */}
                                                <button
                                                    onClick={goToNext}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/90 backdrop-blur-md text-neutral-700 hover:bg-white hover:text-orange-600 shadow-lg transition-all duration-200 hover:scale-110 opacity-0 group-hover/image-container:opacity-100 z-30"
                                                    aria-label="Next image"
                                                >
                                                    <ChevronRight className="w-5 h-5" />
                                                </button>
                                            </>
                                        )}

                                        {/* Carousel Navigation Bar - Bottom Center */}
                                        {images.length > 1 && (
                                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 via-black/40 to-transparent p-4 z-30">
                                                <div className="flex items-center justify-center">
                                                    {/* Image Counter */}
                                                    <div className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-semibold">
                                                        {currentImageIndex + 1}/{images.length}
                                                    </div>
                                                </div>

                                                {/* Dot Indicators */}
                                                {images.length <= 20 && (
                                                    <div className="flex items-center justify-center gap-2 mt-3">
                                                        {images.map((_, index) => (
                                                            <button
                                                                key={index}
                                                                onClick={(e) => goToImage(index, e)}
                                                                className={`h-2 rounded-full transition-all duration-200 ${
                                                                    index === currentImageIndex
                                                                        ? 'bg-white w-8'
                                                                        : 'bg-white/40 w-2 hover:bg-white/60'
                                                                }`}
                                                                aria-label={`Go to image ${index + 1}`}
                                                            />
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Heart Button */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setIsSaved(!isSaved);
                                            }}
                                            className={`absolute top-4 left-4 p-2 rounded-full backdrop-blur-md transition-all duration-200 hover:scale-110 z-40 ${isSaved
                                                ? 'bg-red-500/90 text-white shadow-lg'
                                                : 'bg-white/90 text-neutral-700 hover:bg-red-50 hover:text-red-600 shadow-md'
                                                }`}
                                            aria-label={isSaved ? 'Remove from saved' : 'Save vehicle'}
                                        >
                                            <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                                        </button>

                                        {/* Condition Badge */}
                                        <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-md text-sm font-medium backdrop-blur-md text-white z-40 ${conditionColor}`}>
                                            {conditionBadge}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="aspect-[4/3] flex items-center justify-center bg-neutral-200 text-neutral-400">
                                        <span>No Image Available</span>
                                    </div>
                                )}
                            </div>
                        </Gallery>

                        {/* Short Description */}
                        {vehicleData.short_description && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-gradient-to-r from-orange-50 to-orange-100/50 rounded-xl border border-orange-200/50 p-6"
                            >
                                <div
                                    className="text-neutral-700 text-base leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: vehicleData.short_description }}
                                />
                            </motion.div>
                        )}

                        {/* Tabs Section */}
                        {(() => {
                            // Extract Features section from description
                            const extractFeaturesSection = (desc) => {
                                if (!desc) return null;
                                const featuresMatch = desc.match(/<h3>Features<\/h3>([\s\S]*?)(?=<h3>|$)/i);
                                if (featuresMatch) {
                                    return featuresMatch[1];
                                }
                                return null;
                            };

                            // Extract Vehicle Details section from description
                            const extractVehicleDetailsSection = (desc) => {
                                if (!desc) return null;
                                const detailsMatch = desc.match(/<h3>Vehicle Details<\/h3>([\s\S]*?)(?=<h3>|$)/i);
                                if (detailsMatch) {
                                    return detailsMatch[1];
                                }
                                return null;
                            };

                            const featuresSection = extractFeaturesSection(vehicleData.description);
                            const vehicleDetailsSection = extractVehicleDetailsSection(vehicleData.description);

                            // Process sections for styling
                            const processSection = (section) => {
                                if (!section) return '';
                                return section.replace(
                                    /<ul>([\s\S]*?)<\/ul>/gi,
                                    (match, content) => {
                                        const hasStrongTags = /<strong>/.test(content);
                                        const listClass = hasStrongTags ? 'vehicle-details-list' : 'features-list';
                                        return `<ul class="${listClass}">${content}</ul>`;
                                    }
                                );
                            };

                            return (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="bg-white rounded-xl border border-neutral-200 overflow-hidden"
                                >
                                    <Tabs defaultValue="overview" className="w-full">
                                        <div className="border-b border-neutral-200 p-6">
                                            <TabsList className="bg-neutral-100/50 w-full justify-start h-auto p-1">
                                                <TabsTrigger
                                                    value="overview"
                                                    className="data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-sm px-4 py-2"
                                                >
                                                    Vehicle Overview
                                                </TabsTrigger>
                                                {vehicleDetailsSection && (
                                                    <TabsTrigger
                                                        value="details"
                                                        className="data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-sm px-4 py-2"
                                                    >
                                                        Vehicle Details
                                                    </TabsTrigger>
                                                )}
                                                {featuresSection && (
                                                    <TabsTrigger
                                                        value="features"
                                                        className="data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-sm px-4 py-2"
                                                    >
                                                        Features
                                                    </TabsTrigger>
                                                )}
                                            </TabsList>
                                        </div>

                                        {/* Vehicle Overview Tab */}
                                        <TabsContent value="overview" className="p-6 m-0">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {vehicleData.title && (
                                                    <div>
                                                        <span className="text-sm text-neutral-500">Title</span>
                                                        <p className="font-medium">{vehicleData.title}</p>
                                                    </div>
                                                )}
                                                {(vehicleData.stock_number || vehicleData.stockNumber || vehicleData.stock || vehicleData.sku) && (
                                                    <div>
                                                        <span className="text-sm text-neutral-500">Stock#</span>
                                                        <p className="font-medium">{vehicleData.stock_number || vehicleData.stockNumber || vehicleData.stock || vehicleData.sku}</p>
                                                    </div>
                                                )}
                                                {vehicleData.status && (
                                                    <div>
                                                        <span className="text-sm text-neutral-500">Status</span>
                                                        <p className="font-medium capitalize">{vehicleData.status}</p>
                                                    </div>
                                                )}
                                                {vehicleData.vin && (
                                                    <div>
                                                        <span className="text-sm text-neutral-500">VIN</span>
                                                        <p className="font-medium font-mono">{vehicleData.vin}</p>
                                                    </div>
                                                )}
                                                {vehicleData.make && (
                                                    <div>
                                                        <span className="text-sm text-neutral-500">Make</span>
                                                        <p className="font-medium">{vehicleData.make}</p>
                                                    </div>
                                                )}
                                                {vehicleData.model && (
                                                    <div>
                                                        <span className="text-sm text-neutral-500">Model</span>
                                                        <p className="font-medium">{vehicleData.model}</p>
                                                    </div>
                                                )}
                                                {vehicleData.year && (
                                                    <div>
                                                        <span className="text-sm text-neutral-500">Year</span>
                                                        <p className="font-medium">{vehicleData.year}</p>
                                                    </div>
                                                )}
                                                {conditionValue && (
                                                    <div>
                                                        <span className="text-sm text-neutral-500">Condition</span>
                                                        <p className="font-medium">{conditionBadge}</p>
                                                    </div>
                                                )}
                                                {mileage && (
                                                    <div>
                                                        <span className="text-sm text-neutral-500">Mileage</span>
                                                        <p className="font-medium">{mileage.toLocaleString()} miles</p>
                                                    </div>
                                                )}
                                                {(mpgCity || mpgHighway) && (
                                                    <div>
                                                        <span className="text-sm text-neutral-500">MPG</span>
                                                        <p className="font-medium">
                                                            {mpgCity && mpgHighway
                                                                ? `${mpgCity} city / ${mpgHighway} highway`
                                                                : mpgCity || mpgHighway
                                                            }
                                                        </p>
                                                    </div>
                                                )}
                                                {location !== 'Location unavailable' && (
                                                    <div className="sm:col-span-2">
                                                        <span className="text-sm text-neutral-500 flex items-center gap-1">
                                                            <MapPin className="w-3 h-3" />
                                                            Location
                                                        </span>
                                                        <p className="font-medium">{location}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </TabsContent>

                                        {/* Vehicle Details Tab */}
                                        {vehicleDetailsSection && (
                                            <TabsContent value="details" className="p-6 sm:p-8 m-0">
                                                <div className="prose prose-lg max-w-none">
                                                    <style>{`
                                                        .vehicle-description h3 {
                                                            font-size: 1.5rem;
                                                            font-weight: 700;
                                                            color: #171717;
                                                            margin-top: 2rem;
                                                            margin-bottom: 1.25rem;
                                                            padding-bottom: 0.75rem;
                                                            border-bottom: 2px solid #f97316;
                                                        }
                                                        .vehicle-description h3:first-of-type {
                                                            margin-top: 0;
                                                        }
                                                        .vehicle-description ul {
                                                            list-style: none;
                                                            padding: 0;
                                                            margin: 0 0 1.5rem 0;
                                                        }
                                                        .vehicle-description ul li {
                                                            padding: 0.875rem 0 0.875rem 1.5rem;
                                                            border-bottom: 1px solid #e5e5e5;
                                                            display: flex;
                                                            align-items: flex-start;
                                                            gap: 0.75rem;
                                                            font-size: 0.9375rem;
                                                            line-height: 1.5;
                                                            position: relative;
                                                        }
                                                        .vehicle-description ul li:last-child {
                                                            border-bottom: none;
                                                        }
                                                        .vehicle-description ul li strong {
                                                            color: #171717;
                                                            font-weight: 600;
                                                            min-width: 140px;
                                                            flex-shrink: 0;
                                                        }
                                                        .vehicle-description .vehicle-details-list li::before {
                                                            content: "•";
                                                            color: #737373;
                                                            font-weight: bold;
                                                            position: absolute;
                                                            left: 0;
                                                            font-size: 1.25rem;
                                                            line-height: 1;
                                                        }
                                                    `}</style>
                                                    <div
                                                        className="vehicle-description text-neutral-700"
                                                        dangerouslySetInnerHTML={{ __html: processSection(vehicleDetailsSection) }}
                                                    />
                                                </div>
                                            </TabsContent>
                                        )}

                                        {/* Features Tab */}
                                        {featuresSection && (
                                            <TabsContent value="features" className="p-6 sm:p-8 m-0">
                                                <div className="prose prose-lg max-w-none">
                                                    <style>{`
                                                        .vehicle-description h3 {
                                                            font-size: 1.5rem;
                                                            font-weight: 700;
                                                            color: #171717;
                                                            margin-top: 0;
                                                            margin-bottom: 1.25rem;
                                                            padding-bottom: 0.75rem;
                                                            border-bottom: 2px solid #f97316;
                                                        }
                                                        .vehicle-description ul {
                                                            list-style: none;
                                                            padding: 0;
                                                            margin: 0 0 1.5rem 0;
                                                            display: grid;
                                                            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                                                            gap: 0.75rem;
                                                        }
                                                        .vehicle-description ul li {
                                                            padding: 0.75rem 0 0.75rem 1.5rem;
                                                            border: 1px solid #e5e5e5;
                                                            border-radius: 0.5rem;
                                                            display: flex;
                                                            align-items: center;
                                                            gap: 0.75rem;
                                                            font-size: 0.875rem;
                                                            line-height: 1.4;
                                                            position: relative;
                                                            background-color: #fafafa;
                                                            transition: all 0.2s ease;
                                                        }
                                                        .vehicle-description ul li:hover {
                                                            background-color: #f5f5f5;
                                                            border-color: #f97316;
                                                        }
                                                        .vehicle-description .features-list li::before {
                                                            content: "✓";
                                                            color: #f97316;
                                                            font-weight: bold;
                                                            position: absolute;
                                                            left: 0.5rem;
                                                            font-size: 1rem;
                                                        }
                                                    `}</style>
                                                    <div
                                                        className="vehicle-description text-neutral-700"
                                                        dangerouslySetInnerHTML={{ __html: processSection(featuresSection) }}
                                                    />
                                                </div>
                                            </TabsContent>
                                        )}
                                    </Tabs>
                                </motion.div>
                            );
                        })()}


                        {/* Dates */}
                        {(vehicleData.date_created || vehicleData.date_modified) && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="bg-white rounded-xl border border-neutral-200 p-6"
                            >
                                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-neutral-500" />
                                    Dates
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {vehicleData.date_created && (
                                        <div>
                                            <span className="text-sm text-neutral-500">Created</span>
                                            <p className="font-medium">{formatDate(vehicleData.date_created)}</p>
                                        </div>
                                    )}
                                    {vehicleData.date_modified && (
                                        <div>
                                            <span className="text-sm text-neutral-500">Last Modified</span>
                                            <p className="font-medium">{formatDate(vehicleData.date_modified)}</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Right Column - Pricing and Actions */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Pricing Card - Sticky */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white rounded-xl border border-neutral-200 p-6 shadow-lg"
                        >
                            <h3 className="text-lg font-semibold mb-4 text-neutral-900">Your price</h3>
                            {price ? (
                                <div className="space-y-6">
                                    {onSale && salePrice ? (
                                        <>
                                            <div>
                                                <div className="text-3xl font-bold text-orange-600 mb-1">
                                                    {priceHtml ? (
                                                        <span dangerouslySetInnerHTML={{ __html: priceHtml }} />
                                                    ) : (
                                                        formatCurrency(salePrice)
                                                    )}
                                                </div>
                                                <div className="text-sm text-neutral-500 line-through">
                                                    {formatCurrency(price)}
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-3xl font-bold text-neutral-900">
                                            {priceHtml ? (
                                                <span dangerouslySetInnerHTML={{ __html: priceHtml }} />
                                            ) : (
                                                formatCurrency(price)
                                            )}
                                        </div>
                                    )}
                                    <div className="text-sm text-neutral-600 font-medium">
                                        {(conditionValue === 'U' || conditionValue === 'used') ? 'Listing Price' : 'MSRP'}
                                    </div>

                                    <div className="pt-4 border-t border-neutral-200">
                                        {isSold ? (
                                            <button
                                                disabled
                                                className="w-full bg-neutral-100 border-2 border-neutral-200 text-neutral-600 py-3 px-4 rounded-lg font-medium cursor-not-allowed flex items-center justify-center gap-2"
                                            >
                                                <CheckCircle2 className="w-4 h-4" />
                                                Already Sold
                                            </button>
                                        ) : (
                                            <button
                                                onClick={handleStartBidding}
                                                disabled={sessionLoading || loadingAlternatives || !price || price === 0}
                                                className="w-full bg-neutral-900 text-white py-3 px-4 rounded-lg font-semibold hover:bg-neutral-800 transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                                            >
                                                {loadingAlternatives ? 'Loading alternatives...' : 'Start Reverse Bidding'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="text-lg font-semibold text-neutral-400">Price not available</div>
                                    {!isSold && (
                                        <button
                                            onClick={handleStartBidding}
                                            disabled={sessionLoading || loadingAlternatives}
                                            className="w-full bg-neutral-900 text-white py-3 px-4 rounded-lg font-semibold hover:bg-neutral-800 transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                                        >
                                            {loadingAlternatives ? 'Loading alternatives...' : 'Start Reverse Bidding'}
                                        </button>
                                    )}
                                </div>
                            )}
                        </motion.div>

                        {/* Dealer Information */}
                        {vehicleData.dealer_info && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white rounded-xl border border-neutral-200 p-6"
                            >
                                <h3 className="text-lg font-semibold mb-4">Dealer Information</h3>
                                <div className="space-y-3">
                                    {vehicleData.dealer_info?.name && (
                                        <div>
                                            <span className="text-sm text-neutral-500">Name</span>
                                            <p className="font-medium">{vehicleData.dealer_info.name}</p>
                                        </div>
                                    )}
                                    {vehicleData.dealer_info?.email && (
                                        <div className="flex items-center gap-2">
                                            <Mail className="w-4 h-4 text-neutral-400" />
                                            <a
                                                href={`mailto:${vehicleData.dealer_info.email}`}
                                                className="text-sm text-orange-600 hover:text-orange-700"
                                            >
                                                {vehicleData.dealer_info.email}
                                            </a>
                                        </div>
                                    )}
                                    {(vehicleData.dealer_info?.phone || vehicleData.dealer_contact?.phone) && (
                                        <div className="flex items-center gap-2">
                                            <Phone className="w-4 h-4 text-neutral-400" />
                                            <a
                                                href={`tel:${vehicleData.dealer_info?.phone || vehicleData.dealer_contact?.phone}`}
                                                className="text-sm text-orange-600 hover:text-orange-700"
                                            >
                                                {vehicleData.dealer_info?.phone || vehicleData.dealer_contact?.phone}
                                            </a>
                                        </div>
                                    )}
                                    {(vehicleData.city || vehicleData.state) && (
                                        <div>
                                            <span className="text-sm text-neutral-500">Location</span>
                                            <p className="font-medium">
                                                {vehicleData.city && vehicleData.state 
                                                    ? `${vehicleData.city}, ${vehicleData.state}`
                                                    : vehicleData.city || vehicleData.state
                                                }
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}


                    </div>
                </div>
            </div>

            {/* Dialogs */}
            <ReverseBiddingConfirmDialog
                open={dialogOpen}
                onClose={() => {
                    if (!sessionLoading) {
                        setDialogOpen(false);
                    }
                }}
                onConfirm={async (formData) => {
                    if (!sessionLoading && vehicleData) {
                        console.log('Form data submitted:', formData);
                        console.log('Selected alternative vehicle IDs:', formData.selectedAlternatives);
                        
                        // Convert vehicleData to car format expected by the thunk
                        const carData = {
                            id: vehicleData.id,
                            make: vehicleData.make,
                            model: vehicleData.model,
                            year: vehicleData.year,
                            price: vehicleData.price || vehicleData.regular_price,
                            vin: vehicleData.vin,
                            new_used: vehicleData.new_used || (formData.condition === 'used' ? 'U' : 'N'),
                            condition: formData.condition,
                            zip_code: formData.zipCode || vehicleData.zip_code,
                            city: vehicleData.city,
                            state: vehicleData.state,
                            images: vehicleData.images || [],
                        };

                        const res = await dispatch(startReverseBiddingThunk({
                            carData,
                            criteria: formData // This now includes selectedAlternatives array
                        }));
                        const payload = res?.payload;
                        if (payload?.sessionId) {
                            navigate(`/reverse-bidding/session/${payload.sessionId}`);
                        } else if (res?.error) {
                            console.error('Failed to start reverse bidding:', res.error);
                            setDialogOpen(false); // Close dialog on error
                        }
                    }
                }}
                car={vehicleData ? {
                    id: vehicleData.id,
                    make: vehicleData.make,
                    model: vehicleData.model,
                    year: vehicleData.year,
                    price: vehicleData.price || vehicleData.regular_price,
                    vin: vehicleData.vin,
                    title: vehicleData.title,
                    body_type: vehicleData.body_type || vehicleData.body,
                    transmission: vehicleData.transmission,
                    fuel_type: vehicleData.fuel_type || vehicleData.fuelType,
                    images: vehicleData.images || [],
                } : null}
                alternativeVehicles={alternativeVehicles || []}
                loading={sessionLoading}
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
                dealerContact={vehicleData?.dealer_contact || vehicleData?.dealer_info ? {
                    email: vehicleData?.dealer_info?.email || vehicleData?.dealer_contact?.email,
                    phone: vehicleData?.dealer_info?.phone || vehicleData?.dealer_contact?.phone,
                    name: vehicleData?.dealer_info?.name || vehicleData?.dealer_contact?.name
                } : null}
                vehicleInfo={vehicleData ? {
                    year: vehicleData.year,
                    make: vehicleData.make,
                    model: vehicleData.model,
                    series: vehicleData.series
                } : null}
            />
        </div>
    );
}

