import { motion } from 'framer-motion';

export default function VehicleGridSkeleton({ showFilters = true, cardsPerRow = 2 }) {
    const cardCount = cardsPerRow === 3 ? 9 : 6; // Show more cards for 3-column layout
    
    return (
        <div className={`flex flex-col ${showFilters ? 'lg:flex-row gap-0' : ''}`}>
            {/* Filter Sidebar Skeleton - Desktop */}
            {showFilters && (
                <div className="hidden lg:block lg:flex-shrink-0 lg:w-80">
                    <div className="backdrop-blur-xl bg-white/80 border-r border-white/20 p-6 space-y-4">
                        <div className="h-8 bg-neutral-200/60 rounded-lg animate-pulse"></div>
                        <div className="h-6 bg-neutral-200/60 rounded-lg animate-pulse"></div>
                        <div className="space-y-3">
                            <div className="h-12 bg-neutral-200/60 rounded-xl animate-pulse"></div>
                            <div className="h-12 bg-neutral-200/60 rounded-xl animate-pulse"></div>
                            <div className="h-12 bg-neutral-200/60 rounded-xl animate-pulse"></div>
                        </div>
                    </div>
                </div>
            )}

            {/* Vehicle Grid Skeleton */}
            <div className={`${showFilters ? 'flex-1 lg:pl-6' : 'w-full'}`}>
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${showFilters ? 'lg:grid-cols-2' : 'lg:grid-cols-3'}`}>
                    {Array.from({ length: cardCount }).map((_, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="overflow-hidden rounded-2xl border border-neutral-200/50 bg-white shadow-lg"
                        >
                            {/* Image Skeleton */}
                            <div className="relative h-56 bg-neutral-200/60 animate-pulse">
                                <div className="absolute top-4 right-4 w-16 h-6 bg-neutral-300/60 rounded-md animate-pulse"></div>
                            </div>
                            
                            {/* Content Skeleton */}
                            <div className="p-5 space-y-3">
                                <div className="h-6 bg-neutral-200/60 rounded-lg w-3/4 animate-pulse"></div>
                                <div className="h-8 bg-neutral-200/60 rounded-lg w-1/2 animate-pulse"></div>
                                <div className="h-4 bg-neutral-200/60 rounded-lg w-full animate-pulse"></div>
                                <div className="h-10 bg-neutral-200/60 rounded-lg w-full animate-pulse"></div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Pagination Skeleton */}
                <div className="mt-8 flex justify-center">
                    <div className="flex items-center gap-2">
                        <div className="h-10 w-24 bg-neutral-200/60 rounded-lg animate-pulse"></div>
                        <div className="h-10 w-10 bg-neutral-200/60 rounded-lg animate-pulse"></div>
                        <div className="h-10 w-10 bg-neutral-200/60 rounded-lg animate-pulse"></div>
                        <div className="h-10 w-10 bg-neutral-200/60 rounded-lg animate-pulse"></div>
                        <div className="h-10 w-24 bg-neutral-200/60 rounded-lg animate-pulse"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

