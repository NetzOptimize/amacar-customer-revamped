import { useMemo, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { setFilters, fetchMockCarsThunk, fetchFiltersThunk } from '../redux/reverseBidSlice';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '../../../components/ui/select';
import { Input } from '../../../components/ui/input';

export default function FilterContent({ cars = [] }) {
    const dispatch = useDispatch();
    const { filters, filterOptions } = useSelector((s) => s.reverseBid);
    const { user } = useSelector((s) => s.user);

    // Fetch filters on component mount
    useEffect(() => {
        if (Object.keys(filterOptions.makes).length === 0 && !filterOptions.loading) {
            dispatch(fetchFiltersThunk());
        }
    }, [dispatch, filterOptions.makes, filterOptions.loading]);

    // Expandable sections state
    const [expandedSections, setExpandedSections] = useState({
        basics: true,
        models: true,
        location: false,
    });

    const [localFilters, setLocalFilters] = useState({
        condition: filters.condition || 'all',
        make: filters.make || '',
        models: filters.model ? (Array.isArray(filters.model) ? filters.model : [filters.model]) : [],
        year: filters.year || '',
        budgetMin: filters.budgetMin ? String(filters.budgetMin) : '',
        budgetMax: filters.budgetMax ? String(filters.budgetMax) : '',
        zipCode: filters.zipCode || user?.zip_code || user?.meta?.zip_code || '',
        extraFilters: filters.extraFilters || {},
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
            condition: filters.condition || 'all',
            make: filters.make || '',
            models: filters.model ? (Array.isArray(filters.model) ? filters.model : [filters.model]) : [],
            year: filters.year || '',
            budgetMin: filters.budgetMin ? String(filters.budgetMin) : '',
            budgetMax: filters.budgetMax ? String(filters.budgetMax) : '',
            zipCode: filters.zipCode || user?.zip_code || user?.meta?.zip_code || '',
            extraFilters: filters.extraFilters || {},
        });
    }, [filters.make, filters.model, filters.year, filters.budgetMin, filters.budgetMax, filters.condition, filters.zipCode, filters.extraFilters, user]);

    // Get makes from API
    const makes = useMemo(() => {
        return Object.keys(filterOptions.makes || {}).sort();
    }, [filterOptions.makes]);

    // Get years from API (sorted descending)
    const years = useMemo(() => {
        return (filterOptions.years || []).map(y => String(y)).sort((a, b) => Number(b) - Number(a));
    }, [filterOptions.years]);

    // Get models for selected make from API
    const modelsForSelectedMake = useMemo(() => {
        if (!localFilters.make || !filterOptions.makes) return [];
        return filterOptions.makes[localFilters.make] || [];
    }, [localFilters.make, filterOptions.makes]);

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

    // Format filter key to readable label (e.g., "exterior_color" -> "Exterior Color")
    const formatFilterLabel = (key) => {
        return key
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    // Get active filters (all filters that are set)
    const activeFilters = useMemo(() => {
        const active = [];
        if (localFilters.condition && localFilters.condition !== 'all') {
            active.push({ key: 'condition', label: localFilters.condition === 'used' ? 'Used' : 'New & CPO', value: localFilters.condition });
        }
        if (localFilters.make) {
            active.push({ key: 'make', label: localFilters.make, value: localFilters.make });
        }
        if (localFilters.models && localFilters.models.length > 0) {
            localFilters.models.forEach((model) => {
                active.push({ key: `model-${model}`, label: model, value: model, isModel: true });
            });
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
        // Add extra filters
        if (localFilters.extraFilters && Object.keys(localFilters.extraFilters).length > 0) {
            Object.entries(localFilters.extraFilters).forEach(([filterKey, values]) => {
                if (Array.isArray(values) && values.length > 0) {
                    values.forEach((value) => {
                        active.push({ 
                            key: `extra-${filterKey}-${value}`, 
                            label: `${formatFilterLabel(filterKey)}: ${value}`, 
                            value, 
                            filterKey 
                        });
                    });
                }
            });
        }
        return active;
    }, [localFilters]);

    // Handle filter change
    const handleFilterChange = async (key, value) => {
        const updated = { ...localFilters };

        if (key === 'make') {
            updated.make = value;
            updated.models = []; // Reset models when make changes
        } else if (key === 'model') {
            // Toggle model in the models array
            const currentModels = updated.models || [];
            if (currentModels.includes(value)) {
                updated.models = currentModels.filter(m => m !== value);
            } else {
                updated.models = [...currentModels, value];
            }
        } else if (key.startsWith('extra-')) {
            // Handle extra filter changes (format: "extra-{filterKey}-{value}")
            const parts = key.split('-');
            if (parts.length >= 3) {
                const filterKey = parts[1];
                const filterValue = parts.slice(2).join('-'); // Handle values with hyphens
                const currentValues = updated.extraFilters[filterKey] || [];
                
                if (currentValues.includes(filterValue)) {
                    // Remove value
                    updated.extraFilters = {
                        ...updated.extraFilters,
                        [filterKey]: currentValues.filter(v => v !== filterValue)
                    };
                } else {
                    // Add value
                    updated.extraFilters = {
                        ...updated.extraFilters,
                        [filterKey]: [...currentValues, filterValue]
                    };
                }
            }
        } else {
            updated[key] = value;
        }

        setLocalFilters(updated);

        // Dispatch to Redux (use first model for backward compatibility, or null if no models)
        const filtersToDispatch = {
            ...updated,
            budgetMin: updated.budgetMin ? Number(updated.budgetMin) : null,
            budgetMax: updated.budgetMax ? Number(updated.budgetMax) : null,
            year: updated.year || null,
            model: updated.models && updated.models.length > 0 ? updated.models[0] : null, // Use first model for API compatibility
            make: updated.make || null,
            condition: updated.condition,
            zipCode: updated.zipCode || '',
            extraFilters: updated.extraFilters || {},
        };

        dispatch(setFilters(filtersToDispatch));

        // Trigger new search (reset to page 1 when filters change)
        await dispatch(fetchMockCarsThunk({ filters: filtersToDispatch, page: 1, perPage: 20 }));
    };

    // Remove active filter
    const removeFilter = async (key, value = null, filterKey = null) => {
        const updated = { ...localFilters };
        if (key === 'condition') {
            updated.condition = 'new';
        } else if (key === 'make') {
            updated.make = '';
            updated.models = [];
        } else if (key.startsWith('model-')) {
            // Remove specific model from array
            const modelToRemove = value || key.replace('model-', '');
            updated.models = (updated.models || []).filter(m => m !== modelToRemove);
        } else if (key.startsWith('extra-')) {
            // Remove extra filter
            const parts = key.split('-');
            if (parts.length >= 3 && filterKey) {
                const filterKeyToRemove = filterKey;
                const filterValueToRemove = value || parts.slice(2).join('-');
                const currentValues = updated.extraFilters[filterKeyToRemove] || [];
                updated.extraFilters = {
                    ...updated.extraFilters,
                    [filterKeyToRemove]: currentValues.filter(v => v !== filterValueToRemove)
                };
            }
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
            model: updated.models && updated.models.length > 0 ? updated.models[0] : null,
            make: updated.make || null,
            condition: updated.condition,
            zipCode: updated.zipCode || '',
            extraFilters: updated.extraFilters || {},
        };

        dispatch(setFilters(filtersToDispatch));
        await dispatch(fetchMockCarsThunk({ filters: filtersToDispatch, page: 1, perPage: 20 }));
    };

    // Reset all filters
    const handleReset = async () => {
        const resetFilters = {
            condition: 'new',
            make: '',
            models: [],
            year: '',
            budgetMin: '',
            budgetMax: '',
            zipCode: user?.zip_code || user?.meta?.zip_code || '',
            extraFilters: {},
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
            extraFilters: {},
        };

        dispatch(setFilters(filtersToDispatch));
        await dispatch(fetchMockCarsThunk({ filters: filtersToDispatch, page: 1, perPage: 20 }));
    };

    return (
        <div className="w-full flex flex-col">
            {/* Active filters - Enhanced */}
            {activeFilters.length > 0 && (
                <div className="flex-shrink-0 p-4 sm:p-6 border-b border-white/20 space-y-2 bg-gradient-to-b from-white/60 to-white/40 backdrop-blur-sm">
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
                                onClick={() => removeFilter(filter.key, filter.value, filter.filterKey)}
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

            {/* Filter Sections - Dynamic height on desktop, scrollable on mobile */}
            <div className="flex-1 lg:flex-none px-4 sm:px-6 py-4 space-y-4 overflow-y-auto lg:overflow-visible">
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
                                                className={`w-full h-10 bg-white/60 backdrop-blur-sm border-2 transition-all text-neutral-900 ${localFilters.condition && localFilters.condition !== 'all'
                                                    ? 'border-orange-500 bg-orange-50/80 shadow-md'
                                                    : 'border-white/40 hover:border-orange-400/50'
                                                    }`}
                                            >
                                                <SelectValue placeholder="All" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white/95 backdrop-blur-xl border-white/30">
                                                <SelectItem value="all" className="focus:bg-orange-50">All</SelectItem>
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
                                            const isSelected = localFilters.models && localFilters.models.includes(model);
                                            return (
                                                <motion.div
                                                    key={model}
                                                    whileHover={{ scale: 1.02 }}
                                                    className={`flex items-center gap-2.5 p-2.5 rounded-lg transition-all cursor-pointer backdrop-blur-sm ${isSelected
                                                        ? 'bg-gradient-to-r from-orange-50/80 to-orange-100/60 border border-orange-300/50 shadow-sm'
                                                        : 'hover:bg-white/40 border border-transparent'
                                                        }`}
                                                    onClick={(e) => {
                                                        // Prevent event from bubbling up to parent accordion
                                                        e.stopPropagation();
                                                        // Only handle click if not clicking on checkbox or label directly
                                                        if (e.target.type !== 'checkbox' && e.target.tagName !== 'LABEL' && e.target.tagName !== 'INPUT') {
                                                            handleFilterChange('model', model);
                                                        }
                                                    }}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        id={`model-${model}`}
                                                        checked={isSelected}
                                                        onChange={(e) => {
                                                            e.stopPropagation();
                                                            handleFilterChange('model', model);
                                                        }}
                                                        className={`w-4 h-4 rounded border-2 cursor-pointer transition-all ${isSelected
                                                            ? 'border-orange-500 bg-orange-500 text-white'
                                                            : 'border-white/60 text-orange-500 focus:ring-orange-500/30'
                                                            }`}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                        }}
                                                    />
                                                    <label
                                                        htmlFor={`model-${model}`}
                                                        className={`text-sm cursor-pointer flex-1 flex items-center justify-between ${isSelected ? 'text-orange-900 font-semibold' : 'text-neutral-800'
                                                            }`}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                        }}
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

                {/* Extra Features - Dynamic sections from API */}
                {/* Use availableFilters (from search) if available, otherwise fall back to extraFeatures (initial) */}
                {(() => {
                    const filtersToDisplay = filterOptions.availableFilters && Object.keys(filterOptions.availableFilters).length > 0 
                        ? filterOptions.availableFilters 
                        : filterOptions.extraFeatures;
                    
                    if (!filtersToDisplay || Object.keys(filtersToDisplay).length === 0) return null;
                    
                    return (
                        <>
                            {Object.entries(filtersToDisplay).map(([filterKey, filterValues]) => {
                            if (!filterValues || filterValues.length === 0) return null;
                            
                            const sectionKey = `extra-${filterKey}`;
                            const isExpanded = expandedSections[sectionKey] ?? false;
                            const selectedValues = localFilters.extraFilters[filterKey] || [];
                            
                            // Filter out options with 0 count, but keep selected values even if count is 0
                            // This allows users to see their selected filters even if they result in 0 matches
                            const validValues = filterValues.filter(item => {
                                const value = typeof item === 'object' ? item.value : item;
                                const count = typeof item === 'object' ? item.count : null;
                                const isSelected = selectedValues.includes(String(value));
                                
                                // Show if selected OR if count > 0 (or count is null for initial filters)
                                return isSelected || (count === null || count > 0);
                            });
                            
                            // Don't render filter section if no valid options
                            if (validValues.length === 0) return null;
                            
                            return (
                                <div key={filterKey} className="bg-white/40 backdrop-blur-sm border border-white/30 rounded-xl overflow-hidden shadow-sm">
                                    <button
                                        onClick={() => toggleSection(sectionKey)}
                                        className="cursor-pointer w-full px-4 py-3 flex items-center justify-between hover:bg-white/30 transition-colors"
                                    >
                                        <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-2">
                                            <div className="w-1.5 h-5 bg-gradient-to-b from-orange-500 to-orange-400 rounded-full shadow-sm"></div>
                                            {formatFilterLabel(filterKey)}
                                        </h3>
                                        {isExpanded ? (
                                            <ChevronUp className="w-4 h-4 text-orange-600" />
                                        ) : (
                                            <ChevronDown className="w-4 h-4 text-orange-600" />
                                        )}
                                    </button>
                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="px-4 pb-4 pt-2 space-y-1.5 max-h-64 overflow-y-auto">
                                                    {validValues.map((item) => {
                                                        const value = typeof item === 'object' ? item.value : item;
                                                        const count = typeof item === 'object' ? item.count : null;
                                                        const isSelected = selectedValues.includes(String(value));
                                                        
                                                        return (
                                                            <motion.div
                                                                key={value}
                                                                whileHover={{ scale: 1.02 }}
                                                                className={`flex items-center gap-2.5 p-2.5 rounded-lg transition-all cursor-pointer backdrop-blur-sm ${isSelected
                                                                    ? 'bg-gradient-to-r from-orange-50/80 to-orange-100/60 border border-orange-300/50 shadow-sm'
                                                                    : 'hover:bg-white/40 border border-transparent'
                                                                    }`}
                                                                onClick={(e) => {
                                                                    // Prevent event from bubbling up to parent accordion
                                                                    e.stopPropagation();
                                                                    // Only handle click if not clicking on checkbox or label directly
                                                                    if (e.target.type !== 'checkbox' && e.target.tagName !== 'LABEL' && e.target.tagName !== 'INPUT') {
                                                                        handleFilterChange(`extra-${filterKey}-${value}`, value);
                                                                    }
                                                                }}
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    id={`extra-${filterKey}-${value}`}
                                                                    checked={isSelected}
                                                                    onChange={(e) => {
                                                                        e.stopPropagation();
                                                                        handleFilterChange(`extra-${filterKey}-${value}`, value);
                                                                    }}
                                                                    className={`w-4 h-4 rounded border-2 cursor-pointer transition-all ${isSelected
                                                                        ? 'border-orange-500 bg-orange-500 text-white'
                                                                        : 'border-white/60 text-orange-500 focus:ring-orange-500/30'
                                                                        }`}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                    }}
                                                                />
                                                                <label
                                                                    htmlFor={`extra-${filterKey}-${value}`}
                                                                    className={`text-sm cursor-pointer flex-1 flex items-center justify-between ${isSelected ? 'text-orange-900 font-semibold' : 'text-neutral-800'
                                                                        }`}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                    }}
                                                                >
                                                                    <span>{value}</span>
                                                                    {count !== null && count !== undefined && (
                                                                        <span className={`text-xs px-2 py-0.5 rounded font-semibold ${isSelected ? 'bg-orange-200/80 text-orange-800' : 'bg-white/60 text-orange-700'
                                                                            }`}>
                                                                            {count.toLocaleString()}
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
                            );
                            })}
                        </>
                    );
                })()}
            </div>
        </div>
    );
}

