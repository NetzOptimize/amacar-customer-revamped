import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const BrandLogosCarousel = ({ className = "", pauseOnHover = true }) => {
  const [isPaused, setIsPaused] = useState(false);

  // Brand logos data - removing duplicates
  const brandLogos = [
    {
      name: 'Kia',
      logo: 'https://dealer.amacar.ai/wp-content/uploads/2024/12/Kia-logo-2560x1440-1.png',
      alt: 'Kia Logo'
    },
    {
      name: 'Jeep',
      logo: 'https://dealer.amacar.ai/wp-content/uploads/2024/12/jeep-logo-1993-download.png',
      alt: 'Jeep Logo'
    },
    {
      name: 'Infiniti',
      logo: 'https://dealer.amacar.ai/wp-content/uploads/2024/12/Infiniti-logo-1989-2560x1440-1.png',
      alt: 'Infiniti Logo'
    },
    {
      name: 'Hyundai',
      logo: 'https://dealer.amacar.ai/wp-content/uploads/2024/12/hyundai-logo-2011-download.png',
      alt: 'Hyundai Logo'
    },
    {
      name: 'Mercedes-Benz',
      logo: 'https://dealer.amacar.ai/wp-content/uploads/2024/12/Mercedes-Benz-logo-2011-1920x1080-1.png',
      alt: 'Mercedes-Benz Logo'
    },
    {
      name: 'Mazda',
      logo: 'https://dealer.amacar.ai/wp-content/uploads/2024/12/mazda-logo-2018-vertical-download.png',
      alt: 'Mazda Logo'
    },
    {
      name: 'Lincoln',
      logo: 'https://dealer.amacar.ai/wp-content/uploads/2024/12/Lincoln-logo-2019-1920x1080-1.png',
      alt: 'Lincoln Logo'
    },
    {
      name: 'Lexus',
      logo: 'https://dealer.amacar.ai/wp-content/uploads/2024/12/Lexus-logo-1988-1920x1080-1.png',
      alt: 'Lexus Logo'
    },
    {
      name: 'Toyota',
      logo: 'https://dealer.amacar.ai/wp-content/uploads/2024/12/toyota-logo-2019-download.png',
      alt: 'Toyota Logo'
    },
    {
      name: 'Tesla',
      logo: 'https://dealer.amacar.ai/wp-content/uploads/2024/12/tesla-logo-2007-full-download.png',
      alt: 'Tesla Logo'
    },
    {
      name: 'Subaru',
      logo: 'https://dealer.amacar.ai/wp-content/uploads/2024/12/subaru-logo-2019-download.png',
      alt: 'Subaru Logo'
    },
    {
      name: 'RAM',
      logo: 'https://dealer.amacar.ai/wp-content/uploads/2024/12/RAM-logo-2009-2560x1440-1.png',
      alt: 'RAM Logo'
    },
    {
      name: 'BMW',
      logo: 'https://dealer.amacar.ai/wp-content/uploads/2024/12/bmw-logo-2020-gray-download.png',
      alt: 'BMW Logo'
    },
    {
      name: 'Audi',
      logo: 'https://dealer.amacar.ai/wp-content/uploads/2024/12/audi-logo-2016-download.png',
      alt: 'Audi Logo'
    },
    {
      name: 'Alfa Romeo',
      logo: 'https://dealer.amacar.ai/wp-content/uploads/2024/12/Alfa-Romeo-logo-2015-1920x1080-1.png',
      alt: 'Alfa Romeo Logo'
    },
    {
      name: 'Acura',
      logo: 'https://dealer.amacar.ai/wp-content/uploads/2024/12/Acura-logo-1990-1024x768-1.png',
      alt: 'Acura Logo'
    },
    {
      name: 'Chrysler',
      logo: 'https://dealer.amacar.ai/wp-content/uploads/2024/12/chrysler-logo-2009-download.png',
      alt: 'Chrysler Logo'
    },
    {
      name: 'Chevrolet',
      logo: 'https://dealer.amacar.ai/wp-content/uploads/2024/12/Chevrolet-logo-2013-2560x1440-1.png',
      alt: 'Chevrolet Logo'
    },
    {
      name: 'Cadillac',
      logo: 'https://dealer.amacar.ai/wp-content/uploads/2024/12/cadillac-logo-2021-full-download.png',
      alt: 'Cadillac Logo'
    },
    {
      name: 'Buick',
      logo: 'https://dealer.amacar.ai/wp-content/uploads/2024/12/Buick-logo-2002-2560x1440-1.png',
      alt: 'Buick Logo'
    },
    {
      name: 'GMC',
      logo: 'https://dealer.amacar.ai/wp-content/uploads/2024/12/GMC-logo-2200x600-1.png',
      alt: 'GMC Logo'
    },
    {
      name: 'Ford',
      logo: 'https://dealer.amacar.ai/wp-content/uploads/2024/12/ford-logo-2017-download.png',
      alt: 'Ford Logo'
    },
    {
      name: 'Dodge',
      logo: 'https://dealer.amacar.ai/wp-content/uploads/2024/12/dodge-logo-2010-download.png',
      alt: 'Dodge Logo'
    }
  ];

  // Duplicate logos for seamless infinite scroll
  const duplicatedLogos = [...brandLogos, ...brandLogos];

  // Responsive logo sizing
  const getLogoSize = () => {
    if (typeof window === 'undefined') return 'h-20 w-24'; // SSR fallback
    
    const width = window.innerWidth;
    if (width < 480) return 'h-16 w-20';      // Very small mobile
    if (width < 640) return 'h-18 w-22';      // Mobile
    if (width < 768) return 'h-20 w-24';      // Small tablet
    if (width < 1024) return 'h-22 w-28';     // Tablet
    if (width < 1280) return 'h-24 w-32';     // Small desktop
    return 'h-24 w-32';                       // Large desktop
  };

  const [logoSize, setLogoSize] = useState('h-20 w-24'); // Start with mobile-friendly default

  // Update logo size on window resize
  useEffect(() => {
    const updateLogoSize = () => {
      setLogoSize(getLogoSize());
    };

    // Set initial value
    updateLogoSize();

    // Add resize listener
    window.addEventListener('resize', updateLogoSize);
    
    return () => window.removeEventListener('resize', updateLogoSize);
  }, []);

  return (
    <div className={cn("w-full py-[2rem] px-[1rem] lg:p-[3.5rem]", className)}>
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-800 mb-2">
          Trusted by Leading Brands
        </h2>
        <p className="text-neutral-600 text-sm md:text-base">
          We work with the most reputable automotive brands
        </p>
      </div>

      {/* Continuous scrolling container */}
      <div 
        className="relative overflow-hidden"
        onMouseEnter={() => pauseOnHover && setIsPaused(true)}
        onMouseLeave={() => pauseOnHover && setIsPaused(false)}
      >
        <div 
          className={cn(
            "flex gap-6 md:gap-8 lg:gap-12",
            isPaused ? "animate-pause" : "animate-scroll"
          )}
          style={{
            animationDuration: '45s', // Adjust speed here (lower = faster)
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite',
            animationDirection: 'normal',
            width: 'max-content'
          }}
        >
          {duplicatedLogos.map((brand, index) => (
            <motion.div
              key={`${brand.name}-${index}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.05 
              }}
              className="group flex-shrink-0"
            >
              <div className={cn(
                "bg-white rounded-xl p-3 sm:p-4 md:p-6 shadow-sm border border-neutral-200 hover:shadow-md transition-all duration-300 group-hover:scale-105 flex items-center justify-center",
                logoSize
              )}>
                <img
                  src={brand.logo}
                  alt={brand.alt}
                  className="max-h-10 sm:max-h-12 md:max-h-16 w-auto object-contain filter-none"
                  loading="lazy"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrandLogosCarousel;
