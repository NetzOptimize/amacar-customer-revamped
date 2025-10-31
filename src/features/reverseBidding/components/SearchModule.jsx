import { useMemo, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { setFilters, fetchMockCarsThunk, fetchFiltersThunk } from '../redux/reverseBidSlice';
import { useNavigate } from 'react-router-dom';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '../../../components/ui/select';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';

export default function SearchModule({ onSearch: customOnSearch, showResults = false }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { filters, loading, filterOptions } = useSelector((s) => s.reverseBid);
    const [local, setLocal] = useState({
        make: filters.make || '',
        model: filters.model || '',
        year: filters.year || '',
        budgetMin: filters.budgetMin ? String(filters.budgetMin) : '',
        budgetMax: filters.budgetMax ? String(filters.budgetMax) : '',
    });

    // Fetch filters on component mount
    useEffect(() => {
        if (Object.keys(filterOptions.makes).length === 0 && !filterOptions.loading) {
            dispatch(fetchFiltersThunk());
        }
    }, [dispatch, filterOptions.makes, filterOptions.loading]);

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
        if (!local.make || !filterOptions.makes) return [];
        return filterOptions.makes[local.make] || [];
    }, [local.make, filterOptions.makes]);

    // All filters are optional - search can be performed with any combination
    const onSearch = async () => {
        const filtersToDispatch = {
            make: local.make || null,
            model: local.model || null,
            year: local.year || null,
            budgetMin: local.budgetMin ? Number(local.budgetMin) : null,
            budgetMax: local.budgetMax ? Number(local.budgetMax) : null,
        };
        dispatch(setFilters(filtersToDispatch));
        await dispatch(fetchMockCarsThunk({ filters: filtersToDispatch, page: 1, perPage: 20 }));

        // If custom search handler is provided, use it; otherwise navigate
        if (customOnSearch) {
            customOnSearch(filtersToDispatch);
        } else {
            navigate('/reverse-bidding/results');
        }
    };

    return (
        <motion.div
            className="relative backdrop-blur-xl bg-white/90 border border-neutral-200 rounded-2xl p-4 sm:p-6 shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            layoutId="rb-search-card"
        >
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-neutral-900 text-lg sm:text-xl font-semibold">Find Your Dream Car</h3>
                    <p className="text-neutral-600 text-xs sm:text-sm mt-1">Choose your preferences to start reverse bidding</p>
                </div>
                <span className="inline-flex items-center rounded-full bg-orange-100 text-orange-700 text-[10px] sm:text-xs px-2.5 py-1 border border-orange-200">Reverse Bidding</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                <Select
                    value={local.make}
                    onValueChange={(value) => {
                        setLocal((prev) => ({ ...prev, make: value, model: '' }));
                    }}
                >
                    <SelectTrigger className="bg-white border-neutral-200 text-neutral-900 focus:ring-orange-500/20 h-10 w-full hover:border-orange-300">
                        <SelectValue placeholder="Make" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-neutral-200">
                        {makes.map((m) => (
                            <SelectItem key={m} value={m} className="focus:bg-orange-50">
                                {m}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select
                    value={local.model || undefined}
                    onValueChange={(value) => setLocal((prev) => ({ ...prev, model: value }))}
                    disabled={!local.make}
                >
                    <SelectTrigger className={`bg-white border-neutral-200 text-neutral-900 focus:ring-orange-500/20 h-10 w-full hover:border-orange-300 ${!local.make ? 'opacity-60 cursor-not-allowed' : ''}`}>
                        <SelectValue placeholder={local.make ? "Model" : "Select make first"} />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-neutral-200">
                        {local.make ? (
                            modelsForSelectedMake.length > 0 ? (
                                modelsForSelectedMake.map((model) => (
                                    <SelectItem key={model} value={model} className="focus:bg-orange-50">
                                        {model}
                                    </SelectItem>
                                ))
                            ) : (
                                <div className="px-2 py-1.5 text-sm text-neutral-400 cursor-not-allowed">
                                    No models available
                                </div>
                            )
                        ) : (
                            <div className="px-2 py-1.5 text-sm text-neutral-400 cursor-not-allowed">
                                Please select a make first
                            </div>
                        )}
                    </SelectContent>
                </Select>

                <Select
                    value={local.year}
                    onValueChange={(value) => setLocal((prev) => ({ ...prev, year: value }))}
                >
                    <SelectTrigger className="bg-white border-neutral-200 text-neutral-900 focus:ring-orange-500/20 h-10 w-full hover:border-orange-300">
                        <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-neutral-200 max-h-64">
                        {years.map((y) => (
                            <SelectItem key={y} value={y} className="focus:bg-orange-50">
                                {y}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <div className="relative">
                    <Input
                        type="number"
                        placeholder="Min Price"
                        value={local.budgetMin}
                        onChange={(e) => setLocal((prev) => ({ ...prev, budgetMin: e.target.value }))}
                        className="bg-white border-neutral-200 text-neutral-900 placeholder:text-neutral-500 focus-visible:ring-orange-500/20 h-10 w-full pr-8 hover:border-orange-300"
                        min="0"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 text-sm pointer-events-none">$</span>
                </div>

                <div className="relative">
                    <Input
                        type="number"
                        placeholder="Max Price"
                        value={local.budgetMax}
                        onChange={(e) => setLocal((prev) => ({ ...prev, budgetMax: e.target.value }))}
                        className="bg-white border-neutral-200 text-neutral-900 placeholder:text-neutral-500 focus-visible:ring-orange-500/20 h-10 w-full pr-8 hover:border-orange-300"
                        min="0"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 text-sm pointer-events-none">$</span>
                </div>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <Button
                    onClick={onSearch}
                    disabled={loading.search}
                    className="inline-flex w-full sm:w-auto items-center justify-center rounded-lg bg-orange-500 hover:bg-orange-500/90 text-white px-4 py-2 text-sm font-semibold shadow disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {loading.search ? 'Searching…' : 'Search →'}
                </Button>
                <span className="text-neutral-600 text-xs">
                    {(local.year || 'Year')} • {(local.make || 'Make')} • {(local.model || 'Model')} • {local.budgetMin ? `$${local.budgetMin}` : 'Min'} - {local.budgetMax ? `$${local.budgetMax}` : 'Max'}
                </span>
            </div>
        </motion.div>
    );
}


