import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, MapPin, Phone, Car, Circle } from 'lucide-react';
import { Input } from '../../../components/ui/input';
import { setFilters } from '../redux/reverseBidSlice';

export default function ReverseBiddingConfirmDialog({
    open,
    onClose,
    onConfirm,
    car,
    loading = false
}) {
    const dispatch = useDispatch();
    const { filters } = useSelector((s) => s.reverseBid);
    const { user } = useSelector((s) => s.user);

    // Local state for form data
    const [formData, setFormData] = useState({
        condition: filters.condition || 'new',
        zipCode: filters.zipCode || user?.zip_code || user?.meta?.zip_code || '',
        phone: user?.phone || user?.meta?.phone || '',
    });

    // Initialize form data when dialog opens
    useEffect(() => {
        if (open) {
            setFormData({
                condition: filters.condition || 'new',
                zipCode: filters.zipCode || user?.zip_code || user?.meta?.zip_code || '',
                phone: user?.phone || user?.meta?.phone || '',
            });
        }
    }, [open, filters.condition, filters.zipCode, user]);

    const vehicleInfo = car ? `${car.year} ${car.make} ${car.model}` : 'Vehicle';

    // Handle close - prevent closing when loading
    const handleClose = () => {
        if (!loading) {
            onClose(false);
        }
    };

    // Handle confirm - update filters and then start bidding
    const handleConfirm = () => {
        // Update Redux filters with the form data
        dispatch(setFilters({
            condition: formData.condition,
            zipCode: formData.zipCode,
        }));
        // Call the original onConfirm with formData so it can be passed to the API
        onConfirm({
            condition: formData.condition,
            zipCode: formData.zipCode,
            phone: formData.phone,
        });
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
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4"
                    onClick={handleClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-2 sm:mx-0 border-2 border-orange-200/50 overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header with gradient background */}
                        <div className="bg-gradient-to-r from-orange-50 to-orange-100/50 p-2 sm:p-4 border-b border-orange-200/50">
                            <div className="flex items-center justify-center mb-4">
                                <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center">
                                    <Car className="w-8 h-8 text-orange-500" />
                                </div>
                            </div>
                            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-neutral-800 text-center mb-2">
                                Confirm Reverse Bidding Details
                            </h2>
                        </div>

                        {/* Content */}
                        <div className="space-y-4 p-6 bg-neutral-50 max-h-[60vh] overflow-y-auto">
                            {/* Vehicle Info */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="flex justify-between rounded-lg border border-neutral-200 bg-white p-4 shadow-sm"
                            >
                                <div className="flex items-center gap-2">
                                    <Car className="h-4 w-4 text-orange-500" />
                                    <span className="text-sm font-medium text-neutral-700">Vehicle Selected</span>
                                </div>
                                <p className="text-base font-semibold text-neutral-900">{vehicleInfo}</p>
                            </motion.div>

                            {/* Customer Preferences */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15 }}
                                className="space-y-3"
                            >
                                <h3 className="text-sm font-semibold text-neutral-900 uppercase tracking-wide">
                                    Your Preferences
                                </h3>

                                <div className="space-y-4">
                                    {/* Condition - Radio Buttons */}
                                    <div className="space-y-2">
                                        <label className="text-sm text-neutral-600 flex items-center gap-2">
                                            <CheckCircle2 className="h-4 w-4 text-orange-500" />
                                            Vehicle Condition
                                        </label>
                                        <div className="flex gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, condition: 'new' }))}
                                                className={`cursor-pointer group rounded-xl border p-3 text-sm font-medium transition hover:scale-[1.01] flex-1 ${formData.condition === 'new'
                                                    ? 'border-orange-400 bg-orange-50 text-orange-800'
                                                    : 'border-slate-200 bg-white text-slate-800'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-center gap-2">
                                                    {formData.condition === 'new' ? (
                                                        <CheckCircle2 className="h-4 w-4 text-orange-600" />
                                                    ) : (
                                                        <Circle className="h-4 w-4 text-slate-300" />
                                                    )}
                                                    <span>New</span>
                                                </div>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, condition: 'used' }))}
                                                className={`cursor-pointer group rounded-xl border p-3 text-sm font-medium transition hover:scale-[1.01] flex-1 ${formData.condition === 'used'
                                                    ? 'border-orange-400 bg-orange-50 text-orange-800'
                                                    : 'border-slate-200 bg-white text-slate-800'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-center gap-2">
                                                    {formData.condition === 'used' ? (
                                                        <CheckCircle2 className="h-4 w-4 text-orange-600" />
                                                    ) : (
                                                        <Circle className="h-4 w-4 text-slate-300" />
                                                    )}
                                                    <span>Used</span>
                                                </div>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Zip Code - Input */}
                                    <div className="space-y-2">
                                        <label className="text-sm text-neutral-600 flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-orange-500" />
                                            Zip Code
                                        </label>
                                        <Input
                                            type="text"
                                            placeholder="Enter zip code"
                                            value={formData.zipCode}
                                            onChange={(e) => setFormData(prev => ({ ...prev, zipCode: e.target.value }))}
                                            className="w-full bg-white border-neutral-200 focus-visible:ring-orange-500/20"
                                            maxLength={10}
                                        />
                                    </div>
                                </div>
                            </motion.div>

                            {/* Contact Information */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="space-y-3"
                            >
                                <div className="space-y-4">
                                    {/* Phone - Input */}
                                    <div className="space-y-2">
                                        <label className="text-sm text-neutral-600 flex items-center gap-2">
                                            <Phone className="h-4 w-4 text-orange-500" />
                                            Phone Number
                                        </label>
                                        <Input
                                            type="tel"
                                            placeholder="Enter phone number"
                                            value={formData.phone}
                                            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                            className="w-full bg-white border-neutral-200 focus-visible:ring-orange-500/20"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-end gap-3 p-6 border-t border-neutral-200 bg-white">
                            <button
                                onClick={handleClose}
                                disabled={loading}
                                className="cursor-pointer px-6 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirm}
                                disabled={loading || !formData.zipCode || !formData.phone}
                                className="cursor-pointer px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transform hover:scale-105"
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
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

