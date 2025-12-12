import React from 'react';

/**
 * Modern skeleton loader for lazy-loaded sections
 * Provides smooth shimmer effect and matches content structure
 */
const SectionSkeleton = ({ variant = 'default' }) => {
  // Shimmer animation effect - using CSS class for better performance
  const shimmerClass = 'animate-shimmer';

  if (variant === 'carousel') {
    return (
      <div className="w-full py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          {/* Title */}
          <div className={`h-8 bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 rounded-lg w-1/3 mb-8 ${shimmerClass}`}></div>
          
          {/* Carousel skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-4">
                <div className={`aspect-video bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 rounded-xl ${shimmerClass}`}></div>
                <div className={`h-6 bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 rounded w-3/4 ${shimmerClass}`}></div>
                <div className={`h-4 bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 rounded w-full ${shimmerClass}`}></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'steps') {
    return (
      <div className="w-full py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          {/* Title */}
          <div className={`h-8 bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 rounded-lg w-1/3 mb-12 ${shimmerClass}`}></div>
          
          {/* Steps skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="text-center space-y-4">
                <div className={`w-16 h-16 bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 rounded-full mx-auto ${shimmerClass}`}></div>
                <div className={`h-5 bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 rounded w-3/4 mx-auto ${shimmerClass}`}></div>
                <div className={`h-4 bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 rounded w-full ${shimmerClass}`}></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'testimonials') {
    return (
      <div className="w-full py-12 md:py-16 bg-gradient-to-br from-neutral-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          {/* Title */}
          <div className={`h-8 bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 rounded-lg w-1/4 mx-auto mb-12 ${shimmerClass}`}></div>
          
          {/* Testimonial cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 rounded-full ${shimmerClass}`}></div>
                  <div className="flex-1 space-y-2">
                    <div className={`h-4 bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 rounded w-1/2 ${shimmerClass}`}></div>
                    <div className={`h-3 bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 rounded w-1/3 ${shimmerClass}`}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className={`h-4 bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 rounded w-full ${shimmerClass}`}></div>
                  <div className={`h-4 bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 rounded w-5/6 ${shimmerClass}`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className="w-full py-12 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Title */}
        <div className={`h-8 bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 rounded-lg w-1/3 mb-8 ${shimmerClass}`}></div>
        
        {/* Content skeleton */}
        <div className="space-y-4">
          <div className={`h-4 bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 rounded w-full ${shimmerClass}`}></div>
          <div className={`h-4 bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 rounded w-5/6 ${shimmerClass}`}></div>
          <div className={`h-4 bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 rounded w-4/5 ${shimmerClass}`}></div>
        </div>
        
        {/* Optional image/visual skeleton */}
        <div className={`mt-8 h-64 bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 rounded-xl ${shimmerClass}`}></div>
      </div>
    </div>
  );
};

export default SectionSkeleton;

