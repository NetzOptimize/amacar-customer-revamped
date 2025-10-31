import { useMemo, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, Heart, Search as SearchIcon, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { setFilters, fetchMockCarsThunk } from '../redux/reverseBidSlice';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '../../../components/ui/select';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';

export default function FilterSidebar({ cars = [] }) {
    const dispatch = useDispatch();
    const { filters, loading } = useSelector((s) => s.reverseBid);
    const { user } = useSelector((s) => s.user);

    // Expandable sections state
    const [expandedSections, setExpandedSections] = useState({
        basics: true,
        models: true,
        location: false,
    });

    const [localFilters, setLocalFilters] = useState({
        condition: filters.condition || 'new',
        make: filters.make || '',
        model: filters.model || '',
        year: filters.year || '',
        budgetMin: filters.budgetMin ? String(filters.budgetMin) : '',
        budgetMax: filters.budgetMax ? String(filters.budgetMax) : '',
        zipCode: filters.zipCode || user?.zip_code || user?.meta?.zip_code || '',
    });

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    // Initialize from Redux filters
    useEffect(() => {
        setLocalFilters({
            condition: filters.condition || 'new',
            make: filters.make || '',
            model: filters.model || '',
            year: filters.year || '',
            budgetMin: filters.budgetMin ? String(filters.budgetMin) : '',
            budgetMax: filters.budgetMax ? String(filters.budgetMax) : '',
            zipCode: filters.zipCode || user?.zip_code || user?.meta?.zip_code || '',
        });
    }, [filters.make, filters.model, filters.year, filters.budgetMin, filters.budgetMax, filters.condition, filters.zipCode, user]);

    const makeToModels = {
        Toyota: ['Corolla', 'Camry', 'RAV4', 'Prius'],
        Honda: ['Civic', 'Accord', 'CR-V', 'Fit'],
        BMW: ['3 Series', '5 Series', 'X3', 'X5'],
        Mercedes: ['C-Class', 'E-Class', 'GLC', 'GLE'],
        Audi: ['A3', 'A4', 'Q5', 'Q7'],
        Ford: ['Focus', 'Fusion', 'Escape', 'F-150'],
        Chevrolet: ['Cruze', 'Malibu', 'Equinox', 'Silverado'],
        Nissan: ['Sentra', 'Altima', 'Rogue'],
        Hyundai: ['Elantra', 'Sonata', 'Tucson'],
        Kia: ['Forte', 'Optima', 'Sportage'],
    };

    const makes = Object.keys(makeToModels);
    const years = Array.from({ length: 2025 - 2000 + 1 }, (_, i) => String(2025 - i));

    const modelsForSelectedMake = useMemo(() => {
        return localFilters.make ? makeToModels[localFilters.make] || [] : [];
    }, [localFilters.make]);

    // Calculate model counts from actual cars
    const modelCounts = useMemo(() => {
        const counts = {};
        if (localFilters.make && cars.length > 0) {
            cars.forEach(car => {
                if (car.make === localFilters.make && car.model) {
                    counts[car.model] = (counts[car.model] || 0) + 1;
                }
            });
        }
        return counts;
    }, [cars, localFilters.make]);

    // Get active filters (all filters that are set)
    const activeFilters = useMemo(() => {
        const active = [];
        if (localFilters.condition && localFilters.condition !== 'new') {
            active.push({ key: 'condition', label: localFilters.condition === 'used' ? 'Used' : 'New & CPO', value: localFilters.condition });
        }
        if (localFilters.make) {
            active.push({ key: 'make', label: localFilters.make, value: localFilters.make });
        }
        if (localFilters.model) {
            active.push({ key: 'model', label: localFilters.model, value: localFilters.model });
        }
        if (localFilters.year) {
            active.push({ key: 'year', label: localFilters.year, value: localFilters.year });
        }
        if (localFilters.budgetMin) {
            active.push({ key: 'budgetMin', label: `Min: $${localFilters.budgetMin}`, value: localFilters.budgetMin });
        }
        if (localFilters.budgetMax) {
            active.push({ key: 'budgetMax', label: `Max: $${localFilters.budgetMax}`, value: localFilters.budgetMax });
        }
        if (localFilters.zipCode) {
            active.push({ key: 'zipCode', label: `ZIP: ${localFilters.zipCode}`, value: localFilters.zipCode });
        }
        return active;
    }, [localFilters]);

    // Handle filter change
    const handleFilterChange = async (key, value) => {
        const updated = { ...localFilters, [key]: value };
        if (key === 'make') {
            updated.model = ''; // Reset model when make changes
        }
        setLocalFilters(updated);

        // Dispatch to Redux
        const filtersToDispatch = {
            ...updated,
            budgetMin: updated.budgetMin ? Number(updated.budgetMin) : null,
            budgetMax: updated.budgetMax ? Number(updated.budgetMax) : null,
            year: updated.year || null,
            model: updated.model || null,
            make: updated.make || null,
            condition: updated.condition,
            zipCode: updated.zipCode || '',
        };

        dispatch(setFilters(filtersToDispatch));

        // Trigger new search
        await dispatch(fetchMockCarsThunk(filtersToDispatch));
    };

    // Remove active filter
    const removeFilter = async (key) => {
        const updated = { ...localFilters };
        if (key === 'condition') {
            updated.condition = 'new';
        } else if (key === 'make') {
            updated.make = '';
            updated.model = '';
        } else if (key === 'model') {
            updated.model = '';
        } else if (key === 'year') {
            updated.year = '';
        } else if (key === 'budgetMin') {
            updated.budgetMin = '';
        } else if (key === 'budgetMax') {
            updated.budgetMax = '';
        } else if (key === 'zipCode') {
            updated.zipCode = '';
        }
        setLocalFilters(updated);

        const filtersToDispatch = {
            ...updated,
            budgetMin: updated.budgetMin ? Number(updated.budgetMin) : null,
            budgetMax: updated.budgetMax ? Number(updated.budgetMax) : null,
            year: updated.year || null,
            model: updated.model || null,
            make: updated.make || null,
            condition: updated.condition,
            zipCode: updated.zipCode || '',
        };

        dispatch(setFilters(filtersToDispatch));
        await dispatch(fetchMockCarsThunk(filtersToDispatch));
    };

    // Reset all filters
    const handleReset = async () => {
        const resetFilters = {
            condition: 'new',
            make: '',
            model: '',
            year: '',
            budgetMin: '',
            budgetMax: '',
            zipCode: user?.zip_code || user?.meta?.zip_code || '',
        };
        setLocalFilters(resetFilters);

        const filtersToDispatch = {
            condition: 'new',
            make: null,
            model: null,
            year: null,
            budgetMin: null,
            budgetMax: null,
            zipCode: resetFilters.zipCode,
        };

        dispatch(setFilters(filtersToDispatch));
        await dispatch(fetchMockCarsThunk(filtersToDispatch));
    };

    return (
        <div className="w-full lg:w-80 flex-shrink-0 backdrop-blur-xl bg-white/80 border-r border-white/20 lg:h-[calc(100vh-var(--header-height-desktop)-2rem)] lg:sticky lg:top-[calc(var(--header-height-desktop)+2rem)] flex flex-col shadow-lg">
            {/* Header - Fixed */}
            <div className="flex-shrink-0 p-6 pb-4 border-b border-white/20 space-y-4 bg-gradient-to-b from-white/60 to-white/40 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Filter className="w-4 h-4 text-orange-500" />
                            <span className="text-lg font-bold text-neutral-900">Filters</span>
                        </div>
                        <span className="text-sm text-orange-600 font-semibold">{cars.length} matches</span>
                    </div>
                    <button
                        className="cursor-pointer p-2 rounded-lg hover:bg-white/60 backdrop-blur-sm transition-colors border border-white/30 hover:border-orange-400/50 shadow-sm"
                        title="Save search"
                    >
                        <Heart className="w-4 h-4 text-orange-600" />
                    </button>
                </div>

                {/* Search input */}
                <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-500/60" />
                    <Input
                        placeholder="Try 'painted in blue'"
                        className="pl-9 bg-white/40 backdrop-blur-sm border-white/30 text-neutral-900 placeholder:text-neutral-500 focus-visible:ring-orange-500/30 focus-visible:border-orange-400/50 h-9"
                    />
                </div>

                {/* Active filters - Enhanced */}
                {activeFilters.length > 0 && (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-orange-700 uppercase tracking-wide">Active Filters</span>
                            {activeFilters.length > 0 && (
                                <button
                                    onClick={handleReset}
                                    className="cursor-pointer text-xs text-orange-600 hover:text-orange-700 font-semibold transition-colors"
                                >
                                    Clear All
                                </button>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {activeFilters.map((filter) => (
                                <motion.button
                                    key={filter.key}
                                    onClick={() => removeFilter(filter.key)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="cursor-pointer inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-orange-500/20 to-orange-400/20 backdrop-blur-sm border border-orange-400/40 hover:from-orange-500/30 hover:to-orange-400/30 text-orange-700 text-xs font-semibold transition-all duration-200 hover:shadow-md group"
                                >
                                    <span>{filter.label}</span>
                                    <X className="w-3 h-3 opacity-70 group-hover:opacity-100" />
                                </motion.button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Filter Sections - Scrollable */}
            <div className="flex-1 overflow-y-auto h-full px-6 py-4 space-y-4">
                {/* Basics - Expandable */}
                <div className="bg-white/40 backdrop-blur-sm border border-white/30 rounded-xl overflow-hidden shadow-sm">
                    <button
                        onClick={() => toggleSection('basics')}
                        className="cursor-pointer w-full px-4 py-3 flex items-center justify-between hover:bg-white/30 transition-colors"
                    >
                        <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-2">
                            <div className="w-1.5 h-5 bg-gradient-to-b from-orange-500 to-orange-400 rounded-full shadow-sm"></div>
                            Basics
                        </h3>
                        {expandedSections.basics ? (
                            <ChevronUp className="w-4 h-4 text-orange-600" />
                        ) : (
                            <ChevronDown className="w-4 h-4 text-orange-600" />
                        )}
                    </button>
                    <AnimatePresence>
                        {expandedSections.basics && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                            >
                                <div className="px-4 pb-4 pt-2 space-y-4">

                                    {/* New/Used */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-neutral-800">New/used</label>
                                        <Select
                                            value={localFilters.condition}
                                            onValueChange={(value) => handleFilterChange('condition', value)}
                                        >
                                            <SelectTrigger
                                                className={`w-full h-10 bg-white/60 backdrop-blur-sm border-2 transition-all text-neutral-900 ${localFilters.condition && localFilters.condition !== 'new'
                                                    ? 'border-orange-500 bg-orange-50/80 shadow-md'
                                                    : 'border-white/40 hover:border-orange-400/50'
                                                    }`}
                                            >
                                                <SelectValue placeholder="All" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white/95 backdrop-blur-xl border-white/30">
                                                <SelectItem value="new" className="focus:bg-orange-50">New & CPO</SelectItem>
                                                <SelectItem value="used" className="focus:bg-orange-50">Used</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Make */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-neutral-800">Make</label>
                                        <Select
                                            value={localFilters.make}
                                            onValueChange={(value) => handleFilterChange('make', value)}
                                        >
                                            <SelectTrigger
                                                className={`w-full h-10 bg-white/60 backdrop-blur-sm border-2 transition-all text-neutral-900 ${localFilters.make
                                                    ? 'border-orange-500 bg-orange-50/80 shadow-md'
                                                    : 'border-white/40 hover:border-orange-400/50'
                                                    }`}
                                            >
                                                <SelectValue placeholder="All makes" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white/95 backdrop-blur-xl border-white/30">
                                                {makes.map((make) => (
                                                    <SelectItem key={make} value={make} className="focus:bg-orange-50">
                                                        {make}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Year */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-neutral-800">Year</label>
                                        <Select
                                            value={localFilters.year}
                                            onValueChange={(value) => handleFilterChange('year', value)}
                                        >
                                            <SelectTrigger
                                                className={`w-full h-10 bg-white/60 backdrop-blur-sm border-2 transition-all text-neutral-900 ${localFilters.year
                                                    ? 'border-orange-500 bg-orange-50/80 shadow-md'
                                                    : 'border-white/40 hover:border-orange-400/50'
                                                    }`}
                                            >
                                                <SelectValue placeholder="All years" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white/95 backdrop-blur-xl border-white/30 max-h-64">
                                                {years.map((year) => (
                                                    <SelectItem key={year} value={year} className="focus:bg-orange-50">
                                                        {year}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Price & Payment */}
                                    <div className="space-y-3 pt-2">
                                        <label className="text-sm font-semibold text-neutral-800">Price Range</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1.5">
                                                <label className="text-xs text-neutral-600">Min</label>
                                                <div className="relative">
                                                    <Input
                                                        type="number"
                                                        placeholder="Min"
                                                        value={localFilters.budgetMin}
                                                        onChange={(e) => setLocalFilters(prev => ({ ...prev, budgetMin: e.target.value }))}
                                                        onBlur={() => handleFilterChange('budgetMin', localFilters.budgetMin)}
                                                        className={`h-9 bg-white/60 backdrop-blur-sm border-2 pr-8 transition-all text-neutral-900 placeholder:text-neutral-500 ${localFilters.budgetMin
                                                            ? 'border-orange-500 bg-orange-50/80 shadow-md'
                                                            : 'border-white/40 focus-visible:border-orange-400/50 focus-visible:ring-orange-500/30'
                                                            }`}
                                                        min="0"
                                                    />
                                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-600 text-xs pointer-events-none font-semibold">$</span>
                                                </div>
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-xs text-neutral-600">Max</label>
                                                <div className="relative">
                                                    <Input
                                                        type="number"
                                                        placeholder="Max"
                                                        value={localFilters.budgetMax}
                                                        onChange={(e) => setLocalFilters(prev => ({ ...prev, budgetMax: e.target.value }))}
                                                        onBlur={() => handleFilterChange('budgetMax', localFilters.budgetMax)}
                                                        className={`h-9 bg-white/60 backdrop-blur-sm border-2 pr-8 transition-all text-neutral-900 placeholder:text-neutral-500 ${localFilters.budgetMax
                                                            ? 'border-orange-500 bg-orange-50/80 shadow-md'
                                                            : 'border-white/40 focus-visible:border-orange-400/50 focus-visible:ring-orange-500/30'
                                                            }`}
                                                        min="0"
                                                    />
                                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-600 text-xs pointer-events-none font-semibold">$</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Models (only show if make is selected) - Expandable */}
                {localFilters.make && modelsForSelectedMake.length > 0 && (
                    <div className="bg-white/40 backdrop-blur-sm border border-white/30 rounded-xl overflow-hidden shadow-sm">
                        <button
                            onClick={() => toggleSection('models')}
                            className="cursor-pointer w-full px-4 py-3 flex items-center justify-between hover:bg-white/30 transition-colors"
                        >
                            <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-2">
                                <div className="w-1.5 h-5 bg-gradient-to-b from-orange-500 to-orange-400 rounded-full shadow-sm"></div>
                                {localFilters.make} models
                            </h3>
                            {expandedSections.models ? (
                                <ChevronUp className="w-4 h-4 text-orange-600" />
                            ) : (
                                <ChevronDown className="w-4 h-4 text-orange-600" />
                            )}
                        </button>
                        <AnimatePresence>
                            {expandedSections.models && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden"
                                >
                                    <div className="px-4 pb-4 pt-2 space-y-1.5 max-h-64 overflow-y-auto">
                                        {modelsForSelectedMake.map((model) => {
                                            const count = modelCounts[model] || 0;
                                            const isSelected = localFilters.model === model;
                                            return (
                                                <motion.div
                                                    key={model}
                                                    whileHover={{ scale: 1.02 }}
                                                    className={`flex items-center gap-2.5 p-2.5 rounded-lg transition-all cursor-pointer backdrop-blur-sm ${isSelected
                                                        ? 'bg-gradient-to-r from-orange-50/80 to-orange-100/60 border border-orange-300/50 shadow-sm'
                                                        : 'hover:bg-white/40 border border-transparent'
                                                        }`}
                                                    onClick={() => handleFilterChange('model', isSelected ? '' : model)}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        id={`model-${model}`}
                                                        checked={isSelected}
                                                        onChange={(e) => {
                                                            handleFilterChange('model', e.target.checked ? model : '');
                                                        }}
                                                        className={`w-4 h-4 rounded border-2 cursor-pointer transition-all ${isSelected
                                                            ? 'border-orange-500 bg-orange-500 text-white'
                                                            : 'border-white/60 text-orange-500 focus:ring-orange-500/30'
                                                            }`}
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                    <label
                                                        htmlFor={`model-${model}`}
                                                        className={`text-sm cursor-pointer flex-1 flex items-center justify-between ${isSelected ? 'text-orange-900 font-semibold' : 'text-neutral-800'
                                                            }`}
                                                    >
                                                        <span>{model}</span>
                                                        {count > 0 && (
                                                            <span className={`text-xs px-2 py-0.5 rounded font-semibold ${isSelected ? 'bg-orange-200/80 text-orange-800' : 'bg-white/60 text-orange-700'
                                                                }`}>
                                                                {count}
                                                            </span>
                                                        )}
                                                    </label>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}


                {/* Location - Expandable */}
                <div className="bg-white/40 backdrop-blur-sm border border-white/30 rounded-xl overflow-hidden shadow-sm">
                    <button
                        onClick={() => toggleSection('location')}
                        className="cursor-pointer w-full px-4 py-3 flex items-center justify-between hover:bg-white/30 transition-colors"
                    >
                        <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-2">
                            <div className="w-1.5 h-5 bg-gradient-to-b from-orange-500 to-orange-400 rounded-full shadow-sm"></div>
                            Location
                        </h3>
                        {expandedSections.location ? (
                            <ChevronUp className="w-4 h-4 text-orange-600" />
                        ) : (
                            <ChevronDown className="w-4 h-4 text-orange-600" />
                        )}
                    </button>
                    <AnimatePresence>
                        {expandedSections.location && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                            >
                                <div className="px-4 pb-4 pt-2 space-y-3">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-neutral-800">Search within</label>
                                        <Select defaultValue="all">
                                            <SelectTrigger className="w-full h-10 bg-white/60 backdrop-blur-sm border-2 border-white/40 hover:border-orange-400/50 text-neutral-900">
                                                <SelectValue placeholder="All miles from" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white/95 backdrop-blur-xl border-white/30">
                                                <SelectItem value="all" className="focus:bg-orange-50">All miles from</SelectItem>
                                                <SelectItem value="25" className="focus:bg-orange-50">25 miles</SelectItem>
                                                <SelectItem value="50" className="focus:bg-orange-50">50 miles</SelectItem>
                                                <SelectItem value="100" className="focus:bg-orange-50">100 miles</SelectItem>
                                                <SelectItem value="250" className="focus:bg-orange-50">250 miles</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-neutral-800">ZIP Code</label>
                                        <Input
                                            placeholder="Enter ZIP"
                                            value={localFilters.zipCode}
                                            onChange={(e) => setLocalFilters(prev => ({ ...prev, zipCode: e.target.value }))}
                                            onBlur={() => handleFilterChange('zipCode', localFilters.zipCode)}
                                            className={`h-10 bg-white/60 backdrop-blur-sm border-2 transition-all text-neutral-900 placeholder:text-neutral-500 ${localFilters.zipCode
                                                ? 'border-orange-500 bg-orange-50/80 shadow-md'
                                                : 'border-white/40 focus-visible:border-orange-400/50 focus-visible:ring-orange-500/30'
                                                }`}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

