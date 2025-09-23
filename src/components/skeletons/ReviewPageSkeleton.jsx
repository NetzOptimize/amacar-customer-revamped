import React from 'react';
import { motion } from 'framer-motion';

const ReviewPageSkeleton = () => {
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
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100 pt-20 md:pt-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8 sm:py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Congratulations Header Skeleton */}
          <motion.div
            variants={itemVariants}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="h-8 sm:h-12 bg-gray-200 rounded w-48 sm:w-80 animate-pulse"></div>
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
          </motion.div>

          {/* Main Offer Card Skeleton */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 p-4 sm:p-8 md:p-12 mb-6 sm:mb-8"
          >
            {/* Vehicle Details Skeleton */}
            <div className="text-center mb-6 sm:mb-8">
              <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-6 sm:h-8 bg-gray-200 rounded w-48 sm:w-80 animate-pulse"></div>
              </div>
              
              <div className="flex items-center justify-center gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div className="h-4 sm:h-6 bg-gray-200 rounded w-32 sm:w-48 animate-pulse"></div>
                <div className="h-4 sm:h-6 bg-gray-200 rounded w-24 sm:w-32 animate-pulse"></div>
                <div className="h-4 sm:h-6 bg-gray-200 rounded w-28 sm:w-40 animate-pulse"></div>
              </div>
            </div>

            {/* Offer Amount Skeleton */}
            <div className="text-center mb-6 sm:mb-8">
              <div className="inline-block bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-8">
                <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2">
                  <div className="w-4 h-4 sm:w-6 sm:h-6 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 sm:h-6 bg-gray-200 rounded w-32 sm:w-48 animate-pulse"></div>
                </div>
                <div className="h-12 sm:h-16 md:h-20 bg-gray-200 rounded w-48 sm:w-80 mx-auto mb-2 animate-pulse"></div>
                <div className="h-3 sm:h-4 bg-gray-200 rounded w-24 sm:w-32 mx-auto animate-pulse"></div>
              </div>
            </div>

            {/* Action Buttons Skeleton */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <div className="h-10 sm:h-12 bg-gray-200 rounded-xl w-full sm:w-48 animate-pulse"></div>
            </div>
          </motion.div>

          {/* Trust Indicators Skeleton */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center items-center gap-4 sm:gap-8"
          >
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 sm:h-4 bg-gray-200 rounded w-20 sm:w-32 animate-pulse"></div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ReviewPageSkeleton;
