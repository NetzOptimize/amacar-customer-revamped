import { motion } from 'framer-motion';

const AcceptedBidsSkeleton = ({ count = 6 }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.5, 
        ease: [0.4, 0, 0.2, 1] // Custom cubic-bezier for smooth animation
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
    >
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
          className="bg-white rounded-xl border-2 border-neutral-200 shadow-sm overflow-hidden"
        >
          {/* Accepted Badge Skeleton */}
          <div className="h-10 bg-gradient-to-r from-neutral-200 via-neutral-200 to-neutral-300 animate-pulse rounded-t-xl"></div>

          {/* Vehicle Image Skeleton */}
          <div className="relative h-48 bg-gradient-to-br from-neutral-100 to-neutral-200 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-neutral-300/60 rounded-full animate-pulse"></div>
            </div>
          </div>

          <div className="p-5">
            {/* Vehicle Info Skeleton */}
            <div className="mb-4">
              <div className="h-6 bg-neutral-200 rounded-md w-3/4 mb-2 animate-pulse"></div>
              <div className="h-4 bg-neutral-200 rounded-md w-1/2 animate-pulse"></div>
            </div>

            {/* Accepted Amount Box Skeleton */}
            <div className="mb-4 p-4 bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-lg border border-neutral-200">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="h-3 bg-neutral-200 rounded-md w-24 mb-2 animate-pulse"></div>
                  <div className="h-8 bg-neutral-200 rounded-md w-32 animate-pulse"></div>
                </div>
                <div className="w-8 h-8 bg-neutral-200 rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* Dealer Info Skeleton */}
            <div className="mb-4 pb-4 border-b border-neutral-200">
              <div className="h-3 bg-neutral-200 rounded-md w-16 mb-2 animate-pulse"></div>
              <div className="h-4 bg-neutral-200 rounded-md w-2/3 mb-1 animate-pulse"></div>
              <div className="h-3 bg-neutral-200 rounded-md w-1/2 animate-pulse"></div>
            </div>

            {/* Session Info Skeleton */}
            <div className="mb-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="h-3 bg-neutral-200 rounded-md w-20 animate-pulse"></div>
                <div className="h-3 bg-neutral-200 rounded-md w-12 animate-pulse"></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 bg-neutral-200 rounded animate-pulse"></div>
                <div className="h-3 bg-neutral-200 rounded-md w-24 animate-pulse"></div>
                <div className="h-3 bg-neutral-200 rounded-md w-32 animate-pulse"></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 bg-neutral-200 rounded animate-pulse"></div>
                <div className="h-3 bg-neutral-200 rounded-md w-16 animate-pulse"></div>
                <div className="h-3 bg-neutral-200 rounded-md w-20 animate-pulse"></div>
              </div>
            </div>

            {/* Action Buttons Skeleton */}
            <div className="space-y-2">
              <div className="h-12 bg-neutral-200 rounded-lg animate-pulse"></div>
              <div className="h-10 bg-neutral-200 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default AcceptedBidsSkeleton;

