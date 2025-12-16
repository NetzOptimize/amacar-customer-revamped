import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import VehicleGrid from '../components/VehicleGrid';
import { motion } from 'framer-motion';
import { fetchMockCarsThunk, setFilters } from '../redux/reverseBidSlice';

export default function ResultsPage() {
    const dispatch = useDispatch();
    const { searchResults, filters, pagination } = useSelector((s) => s.reverseBid);

    // Trigger initial search on mount with default filters (at least condition: 'all')
    useEffect(() => {
        // Ensure we have at least condition: 'all' in filters
        const defaultFilters = {
            condition: filters.condition || 'all',
            make: filters.make || null,
            model: filters.model || null,
            year: filters.year || null,
            budgetMin: filters.budgetMin || null,
            budgetMax: filters.budgetMax || null,
            zipCode: filters.zipCode || '',
            extraFilters: filters.extraFilters || {},
        };

        // Set filters in Redux to ensure FilterContent displays them correctly
        if (!filters.condition || filters.condition !== defaultFilters.condition) {
            dispatch(setFilters(defaultFilters));
        }

        // Always trigger search on mount to ensure results are loaded
        // This handles page reloads where Redux state might be empty
        dispatch(fetchMockCarsThunk({ 
            filters: defaultFilters, 
            page: 1, 
            perPage: 10 
        }));
    }, []); // Empty dependency array - only run on mount

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-6 sm:px-36 lg:px-44 pb-60 max-w-8xl mx-auto pt-[calc(var(--header-height-mobile)+2rem)] sm:pt-[calc(var(--header-height-tablet)+2rem)] lg:pt-[calc(var(--header-height-desktop)+2rem)] "
        >
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight">New and certified used vehicles for sale</h1>
                {/* <div className="text-sm text-neutral-600 mt-1">{searchResults.length} vehicles found</div> */}
            </div>
            <VehicleGrid cars={searchResults} />
        </motion.div>
    );
}


