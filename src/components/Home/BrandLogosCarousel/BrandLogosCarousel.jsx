import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselDots,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';

const BrandLogosCarousel = ({ className = "" }) => {
  const [api, setApi] = useState();
  const [current, setCurrent] = useState(0);

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

  // Auto-play functionality
  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 3000); // Auto-advance every 3 seconds

    return () => clearInterval(interval);
  }, [api]);

  // Responsive logos per slide based on screen size
  const getLogosPerSlide = () => {
    if (typeof window === 'undefined') return 2; // SSR fallback - start with mobile
    
    const width = window.innerWidth;
    if (width < 480) return 2;      // Very small mobile: 2 logos
    if (width < 640) return 3;      // Mobile: 3 logos
    if (width < 768) return 4;      // Small tablet: 4 logos
    if (width < 1024) return 5;     // Tablet: 5 logos
    if (width < 1280) return 6;     // Small desktop: 6 logos
    return 6;                       // Large desktop: 6 logos
  };

  const [logosPerSlide, setLogosPerSlide] = useState(2); // Start with mobile-friendly default

  // Update logos per slide on window resize
  useEffect(() => {
    const updateLogosPerSlide = () => {
      setLogosPerSlide(getLogosPerSlide());
    };

    // Set initial value
    updateLogosPerSlide();

    // Add resize listener
    window.addEventListener('resize', updateLogosPerSlide);
    
    return () => window.removeEventListener('resize', updateLogosPerSlide);
  }, []);

  // Group logos into slides based on responsive logos per slide
  const slides = [];
  for (let i = 0; i < brandLogos.length; i += logosPerSlide) {
    slides.push(brandLogos.slice(i, i + logosPerSlide));
  }

  return (
    <div className={cn("w-full p-[1rem] lg:p-[2.5rem]", className)}>
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-800 mb-2">
          Trusted by Leading Brands
        </h2>
        <p className="text-neutral-600 text-sm md:text-base">
          We work with the most reputable automotive brands
        </p>
      </div>

      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
         <CarouselContent className="-ml-2 md:-ml-4">
           {slides.map((slide, slideIndex) => (
             <CarouselItem key={slideIndex} className="pl-2 md:pl-4">
               <div 
                 className="grid gap-3 sm:gap-4 md:gap-6"
                 style={{
                   gridTemplateColumns: `repeat(${logosPerSlide}, 1fr)`
                 }}
               >
                 {slide.map((brand, brandIndex) => (
                   <motion.div
                     key={`${slideIndex}-${brandIndex}`}
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ 
                       duration: 0.5, 
                       delay: brandIndex * 0.1 
                     }}
                     className="group"
                   >
                     <div className="bg-white rounded-xl p-3 sm:p-4 md:p-6 shadow-sm border border-neutral-200 hover:shadow-md transition-all duration-300 group-hover:scale-105 h-20 sm:h-24 md:h-28 flex items-center justify-center">
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
             </CarouselItem>
           ))}
         </CarouselContent>
        
        <CarouselDots className="mt-6" />
      </Carousel>
    </div>
  );
};

export default BrandLogosCarousel;
