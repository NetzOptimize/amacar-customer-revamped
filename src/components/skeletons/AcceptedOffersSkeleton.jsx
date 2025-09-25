import { motion } from 'framer-motion';

const AcceptedOffersSkeleton = () => {
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

        {/* Accepted Offers List Skeleton */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {Array.from({ length: 2 }).map((_, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="card p-6 animate-pulse"
            >
              {/* Main Content */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  {/* Vehicle Image Skeleton */}
                  <div className="w-16 h-16 bg-neutral-200 rounded-lg animate-pulse"></div>
                  <div>
                    {/* Vehicle Name Skeleton */}
                    <div className="h-6 bg-neutral-200 rounded-md w-64 mb-2 animate-pulse"></div>
                    {/* Accepted Date Skeleton */}
                    <div className="h-4 bg-neutral-200 rounded-md w-48 mb-1 animate-pulse"></div>
                    {/* VIN and Title Skeleton */}
                    <div className="h-3 bg-neutral-200 rounded-md w-80 animate-pulse"></div>
                  </div>
                </div>

                <div className="text-right">
                  {/* Amount Skeleton */}
                  <div className="h-8 bg-neutral-200 rounded-md w-32 mb-2 animate-pulse"></div>
                  {/* Dealer Name Skeleton */}
                  <div className="h-4 bg-neutral-200 rounded-md w-24 animate-pulse"></div>
                </div>
              </div>

              {/* Progress Steps Skeleton */}
             

              {/* Dealer Information Skeleton */}
              <div className="bg-neutral-50 rounded-lg p-4 mb-4">
                <div className="h-5 bg-neutral-200 rounded-md w-40 mb-3 animate-pulse"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Dealer Name Skeleton */}
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-neutral-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-neutral-200 rounded-md w-32 animate-pulse"></div>
                  </div>
                  {/* Phone Skeleton */}
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-neutral-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-neutral-200 rounded-md w-36 animate-pulse"></div>
                  </div>
                  {/* Email Skeleton */}
                  <div className="flex items-center space-x-2">
                    <div className="h-4 bg-neutral-200 rounded-md w-12 animate-pulse"></div>
                    <div className="h-4 bg-neutral-200 rounded-md w-40 animate-pulse"></div>
                  </div>
                  {/* Dealer ID Skeleton */}
                  <div className="flex items-center space-x-2">
                    <div className="h-4 bg-neutral-200 rounded-md w-16 animate-pulse"></div>
                    <div className="h-4 bg-neutral-200 rounded-md w-20 animate-pulse"></div>
                  </div>
                  {/* Address Skeleton */}
                  <div className="flex items-center space-x-2 md:col-span-2">
                    <div className="w-4 h-4 bg-neutral-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-neutral-200 rounded-md w-64 animate-pulse"></div>
                  </div>
                  {/* Cash Offer Skeleton */}
                  <div className="flex items-center space-x-2 md:col-span-2">
                    <div className="h-4 bg-neutral-200 rounded-md w-20 animate-pulse"></div>
                    <div className="h-4 bg-neutral-200 rounded-md w-24 animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Next Steps and Actions Skeleton */}
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  {/* Next Step Label Skeleton */}
                  <div className="h-5 bg-neutral-200 rounded-md w-20 mb-2 animate-pulse"></div>
                  {/* Next Step Description Skeleton */}
                  <div className="h-4 bg-neutral-200 rounded-md w-48 mb-1 animate-pulse"></div>
                  {/* Estimated Completion Skeleton */}
                  <div className="h-3 bg-neutral-200 rounded-md w-56 animate-pulse"></div>
                </div>
                
                <div className="flex space-x-2">
                  {/* Contact Dealer Button Skeleton */}
                  <div className="h-10 bg-neutral-200 rounded-lg w-32 animate-pulse"></div>
                  {/* Schedule Appointment Button Skeleton - only show for some cards */}
                  {index === 0 && (
                    <div className="h-10 bg-neutral-200 rounded-lg w-40 animate-pulse"></div>
                  )}
                  {/* View Details Button Skeleton */}
                  <div className="h-10 bg-neutral-200 rounded-lg w-28 animate-pulse"></div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default AcceptedOffersSkeleton;
