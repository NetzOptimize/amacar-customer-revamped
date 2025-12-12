import React from 'react';

/**
 * Modern, branded page loader for initial route loading
 * Provides a premium loading experience with smooth animations
 */
const PageLoader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-50">
      <div className="text-center px-4">
        {/* Logo/Brand Animation */}
        <div className="mb-8">
          <div className="relative inline-block">
            {/* Animated ring - outer pulse */}
            <div className="absolute inset-0 rounded-full border-4 border-primary-200 animate-ping opacity-20"></div>
            <div className="absolute inset-0 rounded-full border-4 border-primary-300 animate-pulse"></div>
            
            {/* Center spinner - dual rotating rings */}
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary-500 border-r-primary-500 animate-spin"></div>
              <div 
                className="absolute inset-2 rounded-full border-4 border-transparent border-b-primary-400 border-l-primary-400 animate-spin"
                style={{ 
                  animationDirection: 'reverse', 
                  animationDuration: '0.8s' 
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Loading Text with Animation */}
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-neutral-800 animate-pulse">
            Loading Amacar
          </h3>
          <p className="text-sm text-neutral-500 max-w-xs mx-auto">
            Preparing your experience...
          </p>
        </div>

        {/* Progress Indicator with animated bar */}
        <div className="mt-8 max-w-xs mx-auto">
          <div className="h-1 bg-neutral-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 rounded-full animate-progress"
              style={{
                width: '60%'
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageLoader;

