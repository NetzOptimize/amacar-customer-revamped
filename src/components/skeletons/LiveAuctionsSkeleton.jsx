import { motion } from 'framer-motion';

const LiveAuctionsSkeleton = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <div className="lg:mt-16 min-h-screen bg-gradient-hero px-4 sm:px-6 lg:px-8 py-8 sm:py-6 lg:py-8">
      <div className="max-w-8xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          {/* Header Skeleton */}
          <div className="flex items-center justify-between">
            <div>
              <div className="h-8 bg-neutral-200 rounded-lg w-64 mb-2 animate-pulse"></div>
              <div className="h-5 bg-neutral-200 rounded-md w-80 animate-pulse"></div>
            </div>
            <div className="h-12 bg-neutral-200 rounded-xl w-32 animate-pulse"></div>
          </div>
        </motion.div>

        {/* Stats Overview Skeleton */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          {Array.from({ length: 4 }).map((_, index) => (
            <motion.div key={index} variants={itemVariants} className="card p-6 text-center">
              <div className="w-12 h-12 bg-neutral-200 rounded-xl mx-auto mb-4 animate-pulse"></div>
              <div className="h-8 bg-neutral-200 rounded-md w-16 mx-auto mb-1 animate-pulse"></div>
              <div className="h-4 bg-neutral-200 rounded-md w-24 mx-auto animate-pulse"></div>
            </motion.div>
          ))}
        </motion.div>

        {/* Live Auctions Grid Skeleton */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          {Array.from({ length: 6 }).map((_, index) => {
            // Add some variation to make skeleton more realistic
            const isWideCard = index === 0 || index === 3;
            const hasLongDescription = index === 1 || index === 4;
            
            return (
            <motion.div
              key={index}
              variants={itemVariants}
              className="card overflow-hidden hover:shadow-medium relative animate-pulse"
            >
              {/* Image Skeleton */}
              <div className="relative h-48 bg-neutral-200">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-neutral-300 rounded-full animate-pulse"></div>
                </div>
                {/* LIVE Badge Skeleton */}
                <div className="absolute top-4 left-4">
                  <div className="bg-neutral-300 text-transparent px-2 py-1 rounded-full text-xs font-semibold w-12 h-6 animate-pulse"></div>
                </div>
                {/* More Options Button Skeleton */}
                <div className="absolute top-4 right-4">
                  <div className="w-8 h-8 bg-neutral-300 rounded-full animate-pulse"></div>
                </div>
              </div>

              {/* Content Skeleton */}
              <div className="p-6">
                {/* Vehicle Name Skeleton */}
                <div className={`h-6 bg-neutral-200 rounded-md mb-2 animate-pulse ${
                  isWideCard ? 'w-56' : 'w-48'
                }`}></div>
                {/* Description Skeleton */}
                <div className={`h-4 bg-neutral-200 rounded-md mb-2 animate-pulse ${
                  hasLongDescription ? 'w-72' : 'w-64'
                }`}></div>
                {/* VIN Skeleton */}
                <div className="h-3 bg-neutral-200 rounded-md w-40 mb-4 animate-pulse"></div>

                {/* Current Bid Section Skeleton */}
                <div className="bg-neutral-100 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      {/* Current Bid Label Skeleton */}
                      <div className="h-4 bg-neutral-200 rounded-md w-20 mb-2 animate-pulse"></div>
                      {/* Bid Amount Skeleton */}
                      <div className={`h-8 bg-neutral-200 rounded-md animate-pulse ${
                        index % 3 === 0 ? 'w-36' : index % 3 === 1 ? 'w-28' : 'w-32'
                      }`}></div>
                    </div>
                    <div className="text-right">
                      {/* Bid Count Skeleton */}
                      <div className="h-4 bg-neutral-200 rounded-md w-16 mb-1 animate-pulse"></div>
                      {/* Bidder Name Skeleton */}
                      <div className="h-3 bg-neutral-200 rounded-md w-24 animate-pulse"></div>
                    </div>
                  </div>
                </div>

                {/* Time Remaining Section Skeleton */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    {/* Clock Icon Skeleton */}
                    <div className="w-4 h-4 bg-neutral-200 rounded animate-pulse"></div>
                    {/* Time Text Skeleton */}
                    <div className="h-4 bg-neutral-200 rounded-md w-20 animate-pulse"></div>
                  </div>
                  {/* View Button Skeleton */}
                  <div className="w-8 h-8 bg-neutral-200 rounded-lg animate-pulse"></div>
                </div>

                {/* Action Buttons Skeleton */}
                <div className="flex space-x-4">
                  {/* End Auction Button Skeleton */}
                  <div className="flex-1 h-10 bg-neutral-200 rounded-lg animate-pulse"></div>
                  {/* Pause Auction Button Skeleton */}
                  <div className="flex-1 h-10 bg-neutral-200 rounded-lg animate-pulse"></div>
                </div>
              </div>
            </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

export default LiveAuctionsSkeleton;
