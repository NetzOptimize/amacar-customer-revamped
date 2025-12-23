import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const AppraisedVehiclesSkeleton = () => {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header Skeleton */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-neutral-200 rounded-lg animate-pulse" />
          <div className="space-y-2">
            <div className="h-5 bg-neutral-200 rounded w-40 animate-pulse" />
            <div className="h-4 bg-neutral-200 rounded w-48 animate-pulse" />
          </div>
        </div>
        <div className="h-4 bg-neutral-200 rounded w-32 animate-pulse" />
      </div>

      {/* Desktop Table Skeleton */}
      {isDesktop && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead>
              <tr className="border-b border-neutral-200">
                {[...Array(7)].map((_, i) => (
                  <th key={i} className="py-4 px-4">
                    <div className="h-4 bg-neutral-200 rounded w-20 animate-pulse" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, index) => (
                <tr key={index} className="border-b border-neutral-100">
                  {[...Array(7)].map((_, i) => (
                    <td key={i} className="py-4 px-4">
                      <div className="space-y-2">
                        <div className="h-4 bg-neutral-200 rounded w-full animate-pulse" />
                        {i === 0 && (
                          <div className="h-3 bg-neutral-200 rounded w-3/4 animate-pulse" />
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Mobile Card Skeleton */}
      {!isDesktop && (
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-neutral-50 rounded-xl p-4 border border-neutral-200"
            >
              <div className="space-y-3">
                {/* Title */}
                <div className="h-5 bg-neutral-200 rounded w-3/4 animate-pulse" />
                
                {/* Details */}
                <div className="space-y-2">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <div className="h-3 bg-neutral-200 rounded w-20 animate-pulse" />
                      <div className="h-4 bg-neutral-200 rounded w-24 animate-pulse" />
                    </div>
                  ))}
                </div>

                {/* Button */}
                <div className="h-10 bg-neutral-200 rounded w-full animate-pulse mt-3" />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default AppraisedVehiclesSkeleton;
