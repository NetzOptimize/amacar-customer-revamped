import { motion } from 'framer-motion';

const SessionPageSkeleton = () => {
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
      className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50"
    >
      {/* Header Section Skeleton */}
      <div className="border-b border-neutral-200/50 bg-white/80 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 pt-[calc(var(--header-height-mobile)+1rem)] sm:pt-[calc(var(--header-height-tablet)+1rem)] lg:pt-[calc(var(--header-height-desktop)+1rem)] pb-4" style={{ maxWidth: '1600px' }}>
          {/* Title and Status Row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="h-7 bg-neutral-200 rounded-md w-48 animate-pulse"></div>
              <div className="h-6 bg-neutral-200 rounded-full w-20 animate-pulse"></div>
              <div className="h-4 bg-neutral-200 rounded-md w-16 animate-pulse"></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-10 bg-neutral-200 rounded-lg w-32 animate-pulse"></div>
              <div className="h-10 bg-gradient-to-br from-neutral-200 to-neutral-300 rounded-lg w-24 animate-pulse"></div>
            </div>
          </div>

          {/* Stats Row Skeleton */}
          <div className="flex items-center gap-4 mb-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 bg-neutral-200 rounded animate-pulse"></div>
                <div className="h-4 bg-neutral-200 rounded-md w-16 animate-pulse"></div>
              </div>
            ))}
          </div>

          {/* Vehicle Info Skeleton */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-neutral-200 rounded-lg animate-pulse"></div>
            <div className="flex-1">
              <div className="h-5 bg-neutral-200 rounded-md w-48 mb-2 animate-pulse"></div>
              <div className="h-4 bg-neutral-200 rounded-md w-32 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6 min-h-[calc(100vh-300px)]" style={{ maxWidth: '1600px' }}>
        <motion.div
          variants={itemVariants}
          className="h-full"
        >
          {/* Header Section */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 bg-neutral-200 rounded animate-pulse"></div>
              <div className="h-8 bg-neutral-200 rounded-md w-48 animate-pulse"></div>
            </div>
            <div className="h-4 bg-neutral-200 rounded-md w-96 animate-pulse"></div>
          </div>

          {/* Leaderboard Table Skeleton */}
          <div className="bg-white rounded-2xl border-2 border-neutral-200 shadow-xl overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-12 px-4 sm:px-6 lg:px-8 h-[60px] items-center bg-gradient-to-r from-neutral-50 to-white border-b border-neutral-200">
              {Array.from({ length: 9 }).map((_, index) => (
                <div key={index} className="h-3 bg-neutral-200 rounded-md animate-pulse" style={{
                  width: index === 0 ? '40px' : index === 1 ? '60px' : index === 2 ? '80px' : index === 3 ? '100px' : index === 4 ? '70px' : index === 5 ? '80px' : index === 6 ? '100px' : index === 7 ? '90px' : '60px'
                }}></div>
              ))}
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-neutral-100">
              {Array.from({ length: 5 }).map((_, rowIndex) => (
                <motion.div
                  key={rowIndex}
                  variants={itemVariants}
                  className="grid grid-cols-12 px-4 sm:px-6 lg:px-8 py-5 items-center"
                >
                  {/* Rank */}
                  <div className="col-span-1">
                    <div className="w-8 h-8 bg-neutral-200 rounded-full mx-auto animate-pulse"></div>
                  </div>

                  {/* Vehicle Image */}
                  <div className="col-span-1">
                    <div className="w-20 h-20 bg-neutral-200 rounded-lg animate-pulse"></div>
                  </div>

                  {/* Dealer */}
                  <div className="col-span-2">
                    <div className="h-5 bg-neutral-200 rounded-md w-24 mb-1 animate-pulse"></div>
                    <div className="h-3 bg-neutral-200 rounded-md w-16 animate-pulse"></div>
                  </div>

                  {/* Current Offer */}
                  <div className="col-span-2">
                    <div className="h-6 bg-neutral-200 rounded-md w-28 mb-1 animate-pulse"></div>
                    <div className="h-3 bg-neutral-200 rounded-md w-20 animate-pulse"></div>
                  </div>

                  {/* Savings */}
                  <div className="col-span-1">
                    <div className="h-5 bg-neutral-200 rounded-md w-20 animate-pulse"></div>
                  </div>

                  {/* Perks */}
                  <div className="col-span-2">
                    <div className="flex flex-wrap gap-1">
                      <div className="h-6 bg-neutral-200 rounded-md w-16 animate-pulse"></div>
                      <div className="h-6 bg-neutral-200 rounded-md w-20 animate-pulse"></div>
                    </div>
                  </div>

                  {/* Time Remaining */}
                  <div className="col-span-2">
                    <div className="h-5 bg-neutral-200 rounded-md w-24 animate-pulse"></div>
                  </div>

                  {/* Actions */}
                  <div className="col-span-1 flex justify-end gap-2">
                    <div className="h-9 bg-neutral-200 rounded-lg w-20 animate-pulse"></div>
                    <div className="h-9 bg-neutral-200 rounded-lg w-16 animate-pulse"></div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SessionPageSkeleton;

