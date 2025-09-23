import { motion } from 'framer-motion';

const DashboardSkeleton = () => {
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
          <div className="mb-8">
            <div className="h-8 bg-neutral-200 rounded-lg w-80 mb-2 animate-pulse"></div>
            <div className="h-5 bg-neutral-200 rounded-md w-96 animate-pulse"></div>
          </div>
        </motion.div>

        {/* Stats Cards Skeleton */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {Array.from({ length: 4 }).map((_, index) => (
            <motion.div key={index} variants={itemVariants} className="card p-6 animate-pulse">
              <div className="flex items-center justify-between mb-4">
                {/* Icon Skeleton */}
                <div className="w-12 h-12 bg-neutral-200 rounded-xl animate-pulse"></div>
                <div className="text-right">
                  {/* Number Skeleton */}
                  <div className="h-8 bg-neutral-200 rounded-md w-16 mb-2 animate-pulse"></div>
                  {/* Label Skeleton */}
                  <div className="h-4 bg-neutral-200 rounded-md w-24 animate-pulse"></div>
                </div>
              </div>
              {/* Trend Skeleton */}
              <div className="flex items-center text-sm">
                <div className="w-4 h-4 bg-neutral-200 rounded mr-1 animate-pulse"></div>
                <div className="h-4 bg-neutral-200 rounded-md w-20 animate-pulse"></div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Live Auctions Section Skeleton */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-2"
          >
            <div className="card p-6 animate-pulse">
              {/* Section Header Skeleton */}
              <div className="flex items-center justify-between mb-6">
                <div className="h-6 bg-neutral-200 rounded-md w-32 animate-pulse"></div>
                <div className="h-6 bg-neutral-200 rounded-md w-20 animate-pulse"></div>
              </div>

              {/* Live Auctions List Skeleton */}
              <div className="space-y-4">
                {Array.from({ length: 2 }).map((_, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="flex items-center space-x-4 p-4 bg-neutral-50 rounded-xl animate-pulse"
                  >
                    {/* Image Skeleton */}
                    <div className="w-16 h-16 bg-neutral-200 rounded-lg animate-pulse"></div>
                    <div className="flex-1">
                      {/* Vehicle Name Skeleton */}
                      <div className="h-5 bg-neutral-200 rounded-md w-48 mb-2 animate-pulse"></div>
                      <div className="flex items-center space-x-4">
                        {/* Current Bid Skeleton */}
                        <div className="h-4 bg-neutral-200 rounded-md w-32 animate-pulse"></div>
                        <div className="w-1 h-4 bg-neutral-200 rounded animate-pulse"></div>
                        {/* Bids Count Skeleton */}
                        <div className="h-4 bg-neutral-200 rounded-md w-16 animate-pulse"></div>
                        <div className="w-1 h-4 bg-neutral-200 rounded animate-pulse"></div>
                        {/* Time Remaining Skeleton */}
                        <div className="h-4 bg-neutral-200 rounded-md w-20 animate-pulse"></div>
                      </div>
                    </div>
                    {/* Eye Icon Skeleton */}
                    <div className="w-8 h-8 bg-neutral-200 rounded animate-pulse"></div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Recent Activity Section Skeleton */}
          <motion.div variants={itemVariants}>
            <div className="card p-6 animate-pulse">
              {/* Section Header Skeleton */}
              <div className="flex items-center justify-between mb-6">
                <div className="h-6 bg-neutral-200 rounded-md w-32 animate-pulse"></div>
                <div className="w-8 h-8 bg-neutral-200 rounded-lg animate-pulse"></div>
              </div>

              {/* Activity List Skeleton */}
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="flex items-start space-x-3 p-3 animate-pulse"
                  >
                    {/* Dot Skeleton */}
                    <div className="w-2 h-2 bg-neutral-200 rounded-full mt-2 animate-pulse"></div>
                    <div className="flex-1 min-w-0">
                      {/* Message Skeleton */}
                      <div className="h-4 bg-neutral-200 rounded-md w-full mb-1 animate-pulse"></div>
                      {/* Amount Skeleton (for some items) */}
                      {index === 0 && (
                        <div className="h-4 bg-neutral-200 rounded-md w-20 mb-1 animate-pulse"></div>
                      )}
                      {/* Time Skeleton */}
                      <div className="h-3 bg-neutral-200 rounded-md w-24 animate-pulse"></div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions Skeleton */}
        <motion.div
          variants={itemVariants}
          className="mt-8"
        >
          <div className="card p-8 bg-white rounded-2xl shadow-sm animate-pulse">
            {/* Quick Actions Header Skeleton */}
            <div className="h-6 bg-neutral-200 rounded-md w-32 mb-6 animate-pulse"></div>
            
            {/* Quick Actions Grid Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="flex items-center space-x-3 p-4 bg-neutral-50 rounded-xl animate-pulse"
                >
                  {/* Icon Skeleton */}
                  <div className="w-10 h-10 bg-neutral-200 rounded-lg animate-pulse"></div>
                  {/* Text Skeleton */}
                  <div className="h-4 bg-neutral-200 rounded-md w-24 animate-pulse"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
