import { useSelector } from 'react-redux';
import VehicleGrid from '../components/VehicleGrid';
import { motion } from 'framer-motion';

export default function ResultsPage() {
    const { searchResults, filters } = useSelector((s) => s.reverseBid);
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4 sm:px-6 lg:px-8 pb-8 max-w-7xl mx-auto pt-[calc(var(--header-height-mobile)+2rem)] sm:pt-[calc(var(--header-height-tablet)+2rem)] lg:pt-[calc(var(--header-height-desktop)+2rem)]"
        >
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight">New and certified used vehicles for sale</h1>
                {/* <div className="text-sm text-neutral-600 mt-1">{searchResults.length} vehicles found</div> */}
            </div>
            <VehicleGrid cars={searchResults} />
        </motion.div>
    );
}


