import { motion } from 'framer-motion';

const PreviousOffersSkeleton = () => {
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
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 px-4 sm:px-6 lg:px-8 py-8 sm:py-6 lg:py-8"
    >
      {/* Header Skeleton */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="h-8 bg-neutral-200 rounded-lg w-64 mb-2 animate-pulse"></div>
            <div className="h-5 bg-neutral-200 rounded-md w-80 animate-pulse"></div>
          </div>
          <div className="flex items-center justify-end">
            <div className="h-12 bg-neutral-200 rounded-xl w-48 animate-pulse"></div>
          </div>
        </div>
      </motion.div>

      {/* Skeleton Cards */}
      {Array.from({ length: 3 }).map((_, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
          className="card p-6 animate-pulse"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Image Skeleton */}
              <div className="w-16 h-16 bg-neutral-200 rounded-lg animate-pulse"></div>
              <div>
                {/* Vehicle Name Skeleton */}
                <div className="h-6 bg-neutral-200 rounded-md w-64 mb-2 animate-pulse"></div>
                {/* Date and VIN Skeleton */}
                <div className="h-4 bg-neutral-200 rounded-md w-80 mb-1 animate-pulse"></div>
                {/* Title Skeleton */}
                <div className="h-3 bg-neutral-200 rounded-md w-48 animate-pulse"></div>
              </div>
            </div>

            <div className="text-right">
              {/* Amount Skeleton */}
              <div className="h-8 bg-neutral-200 rounded-md w-32 mb-2 animate-pulse"></div>
              {/* Status Badge Skeleton */}
              <div className="h-6 bg-neutral-200 rounded-full w-20 animate-pulse"></div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-neutral-200">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                {/* Status Text Skeleton */}
                <div className="h-4 bg-neutral-200 rounded-md w-48 mb-2 animate-pulse"></div>
                <div className="flex space-x-2">
                  {/* Button Skeletons */}
                  <div className="h-10 bg-neutral-200 rounded-lg w-32 animate-pulse"></div>
                  <div className="h-10 bg-neutral-200 rounded-lg w-36 animate-pulse"></div>
                </div>
              </div>
              
              {/* Bids Button Skeleton */}
              <div className="ml-4">
                <div className="h-12 bg-neutral-200 rounded-xl w-40 animate-pulse"></div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default PreviousOffersSkeleton;
