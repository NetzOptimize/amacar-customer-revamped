import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import SearchModule from '../components/SearchModule';
import VehicleGrid from '../components/VehicleGrid';
import { fetchMockCarsThunk } from '../redux/reverseBidSlice';

export default function LandingPage() {
    const dispatch = useDispatch();
    const { searchResults, filters } = useSelector((s) => s.reverseBid);

    // Call search API on component mount
    useEffect(() => {
        // Initial search with empty filters to show all vehicles
        dispatch(fetchMockCarsThunk({ filters: {}, page: 1, perPage: 20 }));
    }, [dispatch]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-neutral-50 via-white to-neutral-50">
            {/* Hero Section with Search Module */}
            <section className="relative w-full pt-[calc(var(--header-height-mobile)+4rem)] sm:pt-[calc(var(--header-height-tablet)+4rem)] lg:pt-[calc(var(--header-height-desktop)+4rem)] pb-16 sm:pb-20 lg:pb-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-8 sm:mb-12"
                    >
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-900 mb-4 tracking-tight">
                            Find Your Perfect Car with
                            <span className="bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent"> Reverse Bidding</span>
                        </h1>
                        <p className="text-lg sm:text-xl text-neutral-600 max-w-2xl mx-auto">
                            Get the best deals by letting dealers compete for your business. Start your search and watch the offers come in.
                        </p>
                    </motion.div>

                    {/* Search Module */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="max-w-6xl mx-auto"
                    >
                        <SearchModule />
                    </motion.div>
                </div>
            </section>

            {/* Vehicle Grid Section */}
            <section id="vehicle-grid-section" className="relative w-full pb-16 sm:pb-20 lg:pb-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <div className="mb-6">
                            <h2 className="text-3xl font-bold tracking-tight text-neutral-900">Available Vehicles</h2>
                            {searchResults.length > 0 && (
                                <div className="text-sm text-neutral-600 mt-1">{searchResults.length} vehicles found</div>
                            )}
                        </div>
                        <VehicleGrid cars={searchResults} showFilters={false} />
                    </motion.div>
                </div>
            </section>

            {/* Additional sections will be added here later */}
        </div>
    );
}

