import { AnimatePresence, motion } from 'framer-motion';
import { X, MapPin, DollarSign, TrendingDown, CheckCircle2, MessageSquare, Building2 } from 'lucide-react';

export default function BidDetailsDialog({ open, bid, onClose, onAccept }) {
    if (!open || !bid) return null;

    // Parse perks if not already parsed
    const parsePerksForDisplay = (perks) => {
        if (!perks) return [];
        
        // If already an array of objects, return as is
        if (Array.isArray(perks) && perks.length > 0 && typeof perks[0] === 'object' && perks[0].value) {
            return perks;
        }
        
        if (typeof perks === 'string') {
            try {
                const parsed = JSON.parse(perks);
                if (typeof parsed === 'object' && parsed !== null) {
                    const result = [];
                    Object.entries(parsed).forEach(([key, value]) => {
                        if (value !== null && value !== '') {
                            const formattedKey = key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');
                            const valueStr = String(value);
                            
                            if (valueStr.includes(',')) {
                                const items = valueStr.split(',').map(item => item.trim()).filter(item => item);
                                items.forEach(item => {
                                    result.push({ label: formattedKey, value: item });
                                });
                            } else {
                                result.push({ label: formattedKey, value: valueStr });
                            }
                        }
                    });
                    return result;
                }
                if (perks.includes(',')) {
                    return perks.split(',').map(item => ({
                        label: 'Benefit',
                        value: item.trim()
                    })).filter(item => item.value);
                }
                return [{ label: 'Benefit', value: perks.trim() }];
            } catch {
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
            return perks.map(perk => ({
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
                    
                    if (valueStr.includes(',')) {
                        const items = valueStr.split(',').map(item => item.trim()).filter(item => item);
                        items.forEach(item => {
                            result.push({ label: formattedKey, value: item });
                        });
                    } else {
                        result.push({ label: formattedKey, value: valueStr });
                    }
                }
            });
            return result;
        }
        
        return [];
    };

    const displayPerks = bid.perksArray && bid.perksArray.length > 0 
        ? bid.perksArray 
        : parsePerksForDisplay(bid.perks);

    return (
        <AnimatePresence>
            {open && bid && (
                <motion.div
                    key="bid-details-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-2 sm:mx-0 border-2 border-neutral-200/50 overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header with gradient background */}
                        <div className="bg-gradient-to-r from-neutral-50 via-white to-neutral-50 p-4 sm:p-6 border-b border-neutral-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center border-2 border-orange-200">
                                        <Building2 className="w-6 h-6 text-orange-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-neutral-900">{bid.dealerName}</h2>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="cursor-pointer p-2 rounded-lg hover:bg-neutral-100 transition-colors duration-200"
                                >
                                    <X className="w-5 h-5 text-neutral-600" />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6 bg-gradient-to-b from-white to-neutral-50/30 max-h-[70vh] overflow-y-auto">
                            {/* Dealer Logo Section */}
                            {bid.dealerLogo && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="flex items-center gap-4 p-4 rounded-xl border border-neutral-200 bg-white shadow-sm"
                                >
                                    <img
                                        src={bid.dealerLogo}
                                        alt={`${bid.dealerName} logo`}
                                        className="w-20 h-20 rounded-xl object-cover border-2 border-neutral-100 shadow-md"
                                    />
                                    <div className="flex-1">
                                        <div className="font-bold text-lg text-neutral-900">{bid.dealerName}</div>
                                        <div className="flex items-center gap-1 text-sm text-neutral-600 mt-1">
                                            <MapPin className="w-4 h-4" />
                                            <span>{bid.location}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Offer and Savings Cards */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15 }}
                                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                            >
                                {/* Current Offer Card */}
                                <div className="relative overflow-hidden rounded-xl border-2 border-orange-200/50 bg-gradient-to-br from-orange-50 to-white p-5 shadow-lg">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-orange-200/20 rounded-full -mr-12 -mt-12"></div>
                                    <div className="relative">
                                        <div className="flex items-center gap-2 mb-2">
                                            <DollarSign className="w-5 h-5 text-orange-600" />
                                            <span className="text-sm font-semibold text-neutral-600 uppercase tracking-wide">Current Offer</span>
                                        </div>
                                        <div className="text-3xl font-bold text-orange-600">
                                            ${bid.currentOffer.toLocaleString()}
                                        </div>
                                    </div>
                                </div>

                                {/* Savings Card */}
                                <div className="relative overflow-hidden rounded-xl border-2 border-green-200/50 bg-gradient-to-br from-green-50 to-white p-5 shadow-lg">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-green-200/20 rounded-full -mr-12 -mt-12"></div>
                                    <div className="relative">
                                        <div className="flex items-center gap-2 mb-2">
                                            <TrendingDown className="w-5 h-5 text-green-600" />
                                            <span className="text-sm font-semibold text-neutral-600 uppercase tracking-wide">Estimated Savings</span>
                                        </div>
                                        <div className="text-3xl font-bold text-green-600">
                                            ${(bid.savings || 0).toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Perks Section */}
                            {displayPerks && displayPerks.length > 0 ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="space-y-3"
                                >
                                    <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wide flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                                        Perks & Benefits
                                    </h3>
                                    <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
                                        <div className="flex flex-wrap gap-2.5">
                                            {displayPerks.map((perk, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: 0.25 + i * 0.05 }}
                                                    className="group relative"
                                                >
                                                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100/50 border border-orange-200 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105">
                                                        <CheckCircle2 className="w-4 h-4 text-orange-600 flex-shrink-0" />
                                                        <span className="text-sm text-neutral-800 font-medium">
                                                            {perk.value}
                                                        </span>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            ) : null}

                            {/* Notes Section */}
                            {bid.notes && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="space-y-2"
                                >
                                    <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wide flex items-center gap-2">
                                        <MessageSquare className="w-4 h-4 text-blue-600" />
                                        Additional Notes
                                    </h3>
                                    <div className="rounded-xl border border-neutral-200 bg-blue-50/50 p-4 text-sm text-neutral-700 leading-relaxed">
                                        {bid.notes}
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Footer with Action Buttons */}
                        <div className="p-6 border-t border-neutral-200 bg-white flex flex-col sm:flex-row items-center justify-end gap-3">
                            <button
                                onClick={onClose}
                                className="cursor-pointer px-6 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl font-medium transition-all duration-200 w-full sm:w-auto"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => onAccept(bid)}
                                className="cursor-pointer px-6 py-2.5 bg-gradient-to-r from-neutral-900 to-neutral-800 hover:from-neutral-800 hover:to-neutral-700 text-white rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 w-full sm:w-auto hover:shadow-lg transform hover:scale-105"
                            >
                                <CheckCircle2 className="w-4 h-4" />
                                Accept Offer
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}


