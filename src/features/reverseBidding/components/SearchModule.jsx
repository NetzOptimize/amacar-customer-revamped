import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { setFilters, fetchMockCarsThunk } from '../redux/reverseBidSlice';
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
    const { filters, loading } = useSelector((s) => s.reverseBid);
    const [local, setLocal] = useState({
        make: filters.make || '',
        model: filters.model || '',
        year: filters.year || '',
        budgetMin: filters.budgetMin ? String(filters.budgetMin) : '',
        budgetMax: filters.budgetMax ? String(filters.budgetMax) : '',
    });

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
        return local.make ? makeToModels[local.make] || [] : [];
    }, [local.make]);

    const valid = useMemo(() => !!(local.make && local.model && local.year), [local]);

    const onSearch = async () => {
        const filtersToDispatch = {
            ...local,
            budgetMin: local.budgetMin ? Number(local.budgetMin) : null,
            budgetMax: local.budgetMax ? Number(local.budgetMax) : null,
        };
        dispatch(setFilters(filtersToDispatch));
        await dispatch(fetchMockCarsThunk(filtersToDispatch));
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
                    disabled={!local.make}
                >
                    <SelectTrigger className="bg-white/5 border-white/15 text-white disabled:opacity-40 h-10 w-full">
                        <SelectValue placeholder={local.make ? 'Model' : 'Select Make'} />
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
                    disabled={!valid || loading.search}
                    className="inline-flex w-full sm:w-auto items-center justify-center rounded-lg bg-orange-500 hover:bg-orange-500/90 text-white px-4 py-2 text-sm font-semibold shadow disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {loading.search ? 'Searching…' : 'Start Reverse Bidding →'}
                </Button>
                <span className="text-white/80 text-xs">
                    {(local.year || 'Year')} • {(local.make || 'Make')} • {(local.model || 'Model')} • {local.budgetMin ? `$${local.budgetMin}` : 'Min'} - {local.budgetMax ? `$${local.budgetMax}` : 'Max'}
                </span>
            </div>
        </motion.div>
    );
}


