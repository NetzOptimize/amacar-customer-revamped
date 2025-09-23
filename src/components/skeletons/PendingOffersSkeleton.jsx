import { motion } from 'framer-motion';

const PendingOffersSkeleton = () => {
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
    <div className="lg:mt-16 min-h-screen bg-gradient-hero p-8">
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

        {/* Pending Offers List Skeleton */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {Array.from({ length: 3 }).map((_, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`card p-6 border-l-4 ${
                index === 0 ? '' : ''
              } animate-pulse`}
            >
              {/* Main Content */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  {/* Car Icon Skeleton */}
                  <div className="w-16 h-16 bg-neutral-200 rounded-lg animate-pulse"></div>
                  <div>
                    {/* Vehicle Name Skeleton */}
                    <div className="h-6 bg-neutral-200 rounded-md w-64 mb-2 animate-pulse"></div>
                    {/* Description Skeleton */}
                    <div className="h-4 bg-neutral-200 rounded-md w-80 mb-1 animate-pulse"></div>
                    {/* Date and Bids Skeleton */}
                    <div className="h-4 bg-neutral-200 rounded-md w-48 animate-pulse"></div>
                  </div>
                </div>

                <div className="text-right">
                  {/* Amount Skeleton */}
                  <div className="h-8 bg-neutral-200 rounded-md w-32 mb-2 animate-pulse"></div>
                  {/* Status Badge Skeleton */}
                  <div className="h-6 bg-neutral-200 rounded-full w-20 animate-pulse"></div>
                </div>
              </div>

              {/* Dealer Information Skeleton */}
              <div className="bg-neutral-50 rounded-lg p-4 mb-4">
                <div className="h-5 bg-neutral-200 rounded-md w-32 mb-2 animate-pulse"></div>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    {/* Dealer Name Skeleton */}
                    <div className="h-5 bg-neutral-200 rounded-md w-40 mb-2 animate-pulse"></div>
                    {/* Dealer Details Skeleton */}
                    <div className="h-4 bg-neutral-200 rounded-md w-64 mb-1 animate-pulse"></div>
                    {/* Bid Time Skeleton */}
                    <div className="h-3 bg-neutral-200 rounded-md w-48 animate-pulse"></div>
                  </div>
                  <div className="text-right">
                    {/* Time Remaining Label Skeleton */}
                    <div className="h-4 bg-neutral-200 rounded-md w-24 mb-1 animate-pulse"></div>
                    {/* Time Remaining Value Skeleton */}
                    <div className="h-5 bg-neutral-200 rounded-md w-20 animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Action Buttons Skeleton */}
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  {/* View Details Button Skeleton */}
                  <div className="h-10 bg-neutral-200 rounded-lg w-32 animate-pulse"></div>
                  {/* View All Bids Button Skeleton */}
                  <div className="h-10 bg-neutral-200 rounded-lg w-36 animate-pulse"></div>
                </div>

                <div className="flex space-x-2">
                  {/* Reject Button Skeleton */}
                  <div className="h-10 bg-neutral-200 rounded-lg w-24 animate-pulse"></div>
                  {/* Accept Button Skeleton */}
                  <div className="h-10 bg-neutral-200 rounded-lg w-32 animate-pulse"></div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default PendingOffersSkeleton;
