import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselDots,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import Modal from '@/components/ui/modal';
import AuctionModal from '@/components/ui/AuctionYourRideModal';
import './ModernCarousel.css';

// Import images (you'll need to add these imports based on your actual image paths)
import img1 from '../../../assets/home_page_first_hero(1).jpg';
import img2 from '../../../assets/seize_the_opportunity.jpg';
import img3 from '../../../assets/driving_the_future_of_your_car.jpg';

const slides = [
  {
    heading: 'Get an Instant Offer for Your Car',
    lines: [
      'Fast, Fair, and Hassle-Free – Get Cash for Your Car Today!',
      'If You Think Your Car Is Worth More, try Our Car Auction Online and Let Dealers Bid On Your Ride!',
      'You Simply Accept The Highest Bid!'
    ],
    cta: 'Get Instant Offer',
    image: img1
  },
  {
    heading: 'Seize the Opportunity',
    lines: [
      'Amacar Allows Dealerships To Bid On Your Vehicle, Aiming To Sell It To Their Ready-To-Buy Customers In the Showroom.',
      'This Competitive Bidding Ensures You Receive The Best Offer Possible For Your Car.'
    ],
    cta: 'Get Started Today',
    image: img2
  },
  {
    heading: 'Driving the Future of Car Sales',
    lines: [
      'We are committed to leading the future of car sales by continuously innovating our platform to meet the evolving needs of our customers.',
      'Our vision is to create a world where selling a car is as simple as clicking a button, and every transaction is a win-win for both sellers and dealers.'
    ],
    cta: 'Learn More',
    image: img3
  }
];

const ModernCarousel = ({ className = "" }) => {
  const [api, setApi] = useState();
  const [current, setCurrent] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [auctionOpen, setAuctionOpen] = useState(false);

  // Auto-play functionality
  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 5000); // Auto-advance every 5 seconds

    return () => clearInterval(interval);
  }, [api]);

  // Update current slide when carousel changes
  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const handleCtaClick = (ctaText) => {
    if (ctaText === 'Get Instant Offer' || ctaText === 'Get Started Today') {
      setIsModalOpen(true);
    } else if (ctaText === 'Learn More') {
      setAuctionOpen(true);
    }
  };

  return (
    <div className={cn("w-full max-w-7xl mx-auto modern-carousel", className)}>
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-0">
          {slides.map((slide, index) => (
            <CarouselItem key={index} className="pl-0">
              <div className="w-full h-[400px] md:h-[450px] lg:h-[500px]">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 h-full">
                  {/* Text Content Column */}
                  <div className="flex items-center justify-center p-4 md:p-6 lg:p-8 text-content">
                    <div className="max-w-2xl w-full">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -30 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 30 }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                          className="text-center lg:text-left"
                        >
                          {/* Heading */}
                          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 leading-tight text-neutral-800">
                            {slide.heading}
                          </h2>

                          {/* Lines */}
                          <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
                            {slide.lines.map((line, lineIndex) => (
                              <motion.p
                                key={lineIndex}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ 
                                  duration: 0.6, 
                                  delay: 0.2 + (lineIndex * 0.1),
                                  ease: "easeOut" 
                                }}
                                className="text-xs sm:text-sm md:text-base lg:text-lg text-neutral-600 leading-relaxed"
                              >
                                {line}
                              </motion.p>
                            ))}
                          </div>

                          {/* CTA Button */}
                          <motion.button
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ 
                              duration: 0.6, 
                              delay: 0.6,
                              ease: "easeOut" 
                            }}
                            onClick={() => handleCtaClick(slide.cta)}
                            className="btn-primary text-sm md:text-base px-4 md:px-6 py-2 md:py-3 rounded-xl font-semibold hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl w-full sm:w-auto"
                          >
                            {slide.cta}
                          </motion.button>
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Image Column */}
                  <div className="relative overflow-hidden image-content">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`image-${index}`}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="relative w-full h-[200px] md:h-[250px] lg:h-full"
                      >
                        <img
                          src={slide.image}
                          alt={slide.heading}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        {/* Gradient overlay for better text contrast if needed */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                        
                        {/* Decorative elements */}
                        <div className="absolute top-4 right-4 w-16 h-16 bg-white/20 rounded-full blur-xl decorative-blob" />
                        <div className="absolute bottom-4 left-4 w-24 h-24 bg-primary-500/20 rounded-full blur-2xl decorative-blob" />
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation Arrows */}
        <CarouselPrevious className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-gray-800 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 w-10 h-10 md:w-12 md:h-12" />
        <CarouselNext className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-gray-800 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 w-10 h-10 md:w-12 md:h-12" />

        {/* Dots Navigation */}
        <CarouselDots className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20" />
      </Carousel>

      {/* Modals */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Get Instant Offer"
        description="Enter your vehicle details to start the offer process"
      />
      <AuctionModal
        isOpen={auctionOpen}
        onClose={setAuctionOpen}
      />
    </div>
  );
};

export default ModernCarousel;
