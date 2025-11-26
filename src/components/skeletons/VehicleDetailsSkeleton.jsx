import { motion } from 'framer-motion';

const VehicleDetailsSkeleton = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.5, 
        ease: [0.4, 0, 0.2, 1]
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pt-6">
        {/* Sticky Header Section Skeleton */}
        <div className="sticky top-0 z-50 bg-white border-b border-neutral-200 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 pt-6 pb-6 mb-8">
          {/* Breadcrumbs Skeleton */}
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <div className="h-4 bg-neutral-200 rounded-md w-16 animate-pulse"></div>
              <div className="w-4 h-4 bg-neutral-200 rounded animate-pulse"></div>
              <div className="h-4 bg-neutral-200 rounded-md w-20 animate-pulse"></div>
              <div className="w-4 h-4 bg-neutral-200 rounded animate-pulse"></div>
              <div className="h-4 bg-neutral-200 rounded-md w-32 animate-pulse"></div>
            </div>
          </div>

          {/* Header with Title and Buttons Skeleton */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0 pr-4">
              <div className="h-8 sm:h-10 bg-neutral-200 rounded-md w-3/4 mb-3 animate-pulse"></div>
              <div className="flex items-center gap-3">
                <div className="h-6 bg-neutral-200 rounded-md w-16 animate-pulse"></div>
                <div className="h-4 bg-neutral-200 rounded-md w-24 animate-pulse"></div>
                <div className="h-4 bg-neutral-200 rounded-md w-32 animate-pulse"></div>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="w-10 h-10 bg-neutral-200 rounded-lg animate-pulse"></div>
              <div className="h-10 bg-neutral-200 rounded-lg w-32 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Main Content Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Images and Details */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-2 space-y-6"
          >
            {/* Image Gallery Skeleton */}
            <div className="relative bg-neutral-100 rounded-xl overflow-hidden">
              <div className="aspect-[4/3] flex items-center justify-center">
                <div className="w-full h-full bg-gradient-to-br from-neutral-200 to-neutral-300 animate-pulse">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 bg-neutral-300/60 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
              {/* Image navigation dots skeleton */}
              <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-2">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-2 bg-white/40 rounded-full w-2 animate-pulse"
                  ></div>
                ))}
              </div>
              {/* Heart button skeleton */}
              <div className="absolute top-4 left-4 w-10 h-10 bg-white/90 rounded-full animate-pulse"></div>
              {/* Condition badge skeleton */}
              <div className="absolute top-4 right-4 h-8 bg-neutral-200 rounded-md w-20 animate-pulse"></div>
            </div>

            {/* Short Description Skeleton */}
            <div className="bg-gradient-to-r from-neutral-50 to-neutral-100 rounded-xl border border-neutral-200 p-6">
              <div className="space-y-3">
                <div className="h-4 bg-neutral-200 rounded-md w-full animate-pulse"></div>
                <div className="h-4 bg-neutral-200 rounded-md w-5/6 animate-pulse"></div>
                <div className="h-4 bg-neutral-200 rounded-md w-4/6 animate-pulse"></div>
              </div>
            </div>

            {/* Tabs Section Skeleton */}
            <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
              {/* Tabs Header */}
              <div className="border-b border-neutral-200 p-6">
                <div className="flex gap-2">
                  <div className="h-10 bg-neutral-200 rounded-md w-32 animate-pulse"></div>
                  <div className="h-10 bg-neutral-200 rounded-md w-32 animate-pulse"></div>
                  <div className="h-10 bg-neutral-200 rounded-md w-24 animate-pulse"></div>
                </div>
              </div>

              {/* Tab Content Skeleton */}
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <div key={index}>
                      <div className="h-3 bg-neutral-200 rounded-md w-20 mb-2 animate-pulse"></div>
                      <div className="h-5 bg-neutral-200 rounded-md w-32 animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Dates Section Skeleton */}
            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-5 h-5 bg-neutral-200 rounded animate-pulse"></div>
                <div className="h-6 bg-neutral-200 rounded-md w-24 animate-pulse"></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="h-3 bg-neutral-200 rounded-md w-16 mb-2 animate-pulse"></div>
                  <div className="h-5 bg-neutral-200 rounded-md w-40 animate-pulse"></div>
                </div>
                <div>
                  <div className="h-3 bg-neutral-200 rounded-md w-24 mb-2 animate-pulse"></div>
                  <div className="h-5 bg-neutral-200 rounded-md w-40 animate-pulse"></div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Pricing and Actions */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-1 space-y-6"
          >
            {/* Pricing Card Skeleton */}
            <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-lg">
              <div className="h-6 bg-neutral-200 rounded-md w-24 mb-4 animate-pulse"></div>
              <div className="space-y-4">
                <div className="h-10 bg-neutral-200 rounded-md w-32 animate-pulse"></div>
                <div className="h-4 bg-neutral-200 rounded-md w-28 animate-pulse"></div>
                <div className="pt-4 border-t border-neutral-200">
                  <div className="h-12 bg-neutral-200 rounded-lg w-full animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Dealer Information Card Skeleton */}
            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <div className="h-6 bg-neutral-200 rounded-md w-36 mb-4 animate-pulse"></div>
              <div className="space-y-3">
                <div>
                  <div className="h-3 bg-neutral-200 rounded-md w-16 mb-2 animate-pulse"></div>
                  <div className="h-5 bg-neutral-200 rounded-md w-32 animate-pulse"></div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-neutral-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-neutral-200 rounded-md w-40 animate-pulse"></div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-neutral-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-neutral-200 rounded-md w-32 animate-pulse"></div>
                </div>
                <div>
                  <div className="h-3 bg-neutral-200 rounded-md w-20 mb-2 animate-pulse"></div>
                  <div className="h-5 bg-neutral-200 rounded-md w-36 animate-pulse"></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default VehicleDetailsSkeleton;

