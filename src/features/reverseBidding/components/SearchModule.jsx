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

export default function SearchModule() {
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
        navigate('/reverse-bidding/results');
    };

    return (
        <motion.div
            className="relative backdrop-blur-xl bg-neutral-900/60 border border-white/10 rounded-2xl p-4 sm:p-6 shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            layoutId="rb-search-card"
        >
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-white text-lg sm:text-xl font-semibold">Find Your Dream Car</h3>
                    <p className="text-white/60 text-xs sm:text-sm mt-1">Choose your preferences to start reverse bidding</p>
                </div>
                <span className="inline-flex items-center rounded-full bg-white/10 text-white/90 text-[10px] sm:text-xs px-2.5 py-1 border border-white/15">Reverse Bidding</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                <Select
                    value={local.make}
                    onValueChange={(value) => {
                        setLocal((prev) => ({ ...prev, make: value, model: '' }));
                    }}
                >
                    <SelectTrigger className="bg-white/5 border-white/15 text-white focus:ring-white/20 h-10 w-full">
                        <SelectValue placeholder="Make" />
                    </SelectTrigger>
                    <SelectContent className="bg-neutral-900 text-white border-white/10">
                        {makes.map((m) => (
                            <SelectItem key={m} value={m} className="focus:bg-white/10">
                                {m}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select
                    value={local.model}
                    onValueChange={(value) => setLocal((prev) => ({ ...prev, model: value }))}
                >
                    <SelectTrigger className="bg-white/5 border-white/15 text-white h-10 w-full">
                        <SelectValue placeholder="Model" />
                    </SelectTrigger>
                    <SelectContent className="bg-neutral-900 text-white border-white/10">
                        {modelsForSelectedMake.map((model) => (
                            <SelectItem key={model} value={model} className="focus:bg-white/10">
                                {model}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select
                    value={local.year}
                    onValueChange={(value) => setLocal((prev) => ({ ...prev, year: value }))}
                >
                    <SelectTrigger className="bg-white/5 border-white/15 text-white h-10 w-full">
                        <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent className="bg-neutral-900 text-white border-white/10 max-h-64">
                        {years.map((y) => (
                            <SelectItem key={y} value={y} className="focus:bg-white/10">
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
                        className="bg-white/5 border-white/15 text-white placeholder:text-white/50 focus-visible:ring-white/20 h-10 w-full pr-8"
                        min="0"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 text-sm pointer-events-none">$</span>
                </div>

                <div className="relative">
                    <Input
                        type="number"
                        placeholder="Max Price"
                        value={local.budgetMax}
                        onChange={(e) => setLocal((prev) => ({ ...prev, budgetMax: e.target.value }))}
                        className="bg-white/5 border-white/15 text-white placeholder:text-white/50 focus-visible:ring-white/20 h-10 w-full pr-8"
                        min="0"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 text-sm pointer-events-none">$</span>
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
                <span className="text-white/80 text-xs">
                    {(local.year || 'Year')} • {(local.make || 'Make')} • {(local.model || 'Model')} • {local.budgetMin ? `$${local.budgetMin}` : 'Min'} - {local.budgetMax ? `$${local.budgetMax}` : 'Max'}
                </span>
            </div>
        </motion.div>
    );
}


