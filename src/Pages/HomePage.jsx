import { lazy, Suspense } from 'react'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import Seo from '@/components/SEO/Seo'
import { seoData } from '@/config/seoConfig'

// Critical above-the-fold components - load immediately
import Hero from '@/components/Home/Hero/Hero.jsx'
import QuickChoicePanel from '@/components/Home/QuickChoicePanel/QuickChoicePanel.jsx'

// Lazy load below-the-fold components to reduce initial bundle size
// These components are not visible until user scrolls, so we can defer loading
const HowEachSystemWorks = lazy(() => import('@/components/Home/HowEachSystemWorks/HowEachSystemWorks.jsx'))
const HowAmacarWorks = lazy(() => import('@/components/AboutUs/HowAmacarWorks/HowAmacarWorks.jsx'))
const HowReverseBiddingWorks = lazy(() => import('@/components/AboutUs/HowReverseBiddingWorks/HowReverseBiddingWorks.jsx'))
const WhyChooseAmacar = lazy(() => import('@/components/Home/WhyChooseAmacar/WhyChooseAmacar.jsx'))
const TestimonialCarousel = lazy(() => import('@/components/Home/TestimonialCarousel/TestimonialCarousel.jsx'))
const TrustedByDealerships = lazy(() => import('@/components/Home/TrustedByDealerships/TrustedByDealerships.jsx'))
const SEOSection = lazy(() => import('@/components/Home/SEOSection/HomeSEOSection'))
const VideoSection = lazy(() => import('@/components/Home/VideoSection/videoSection.jsx'))
const ModernCarousel = lazy(() => import('@/components/Home/ModernCarousel/ModernCarousel'))
const BrandLogosCarousel = lazy(() => import('@/components/Home/BrandLogosCarousel/BrandLogosCarousel.jsx'))
const TwoColumnSection = lazy(() => import('@/components/Home/TwoColumnSection/TwoColumnSection.jsx'))
const CarFooterSection = lazy(() => import('@/components/Home/CarFooterSection/CarFooterSection.jsx'))

// Simple skeleton loader for lazy-loaded sections
const SectionSkeleton = () => (
  <div className="w-full py-16 bg-white">
    <div className="max-w-7xl mx-auto px-4">
      <div className="h-8 bg-neutral-200 rounded w-1/3 mb-8 animate-pulse"></div>
      <div className="space-y-4">
        <div className="h-4 bg-neutral-100 rounded animate-pulse"></div>
        <div className="h-4 bg-neutral-100 rounded w-5/6 animate-pulse"></div>
      </div>
    </div>
  </div>
)
export default function HomePage() {
    const { userState, loading } = useSelector((state) => state.user);
    useEffect(() => {
        // console.log(userState); 
    })
    return (
        <div className="overflow-x-hidden">
            <Seo title={seoData.home.title} description={seoData.home.description} />
            {/* Section 1: Unified Hero */}
            <Hero />
            
            {/* Section 2: Quick Choice Panel */}
            <QuickChoicePanel />
            
            {/* Section 3: How Each System Works (Tabbed - 3 Steps Each) - Lazy loaded */}
            <Suspense fallback={<SectionSkeleton />}>
              <HowEachSystemWorks />
            </Suspense>
            
            {/* Section 4: Phase 1 - How Amacar Works (Selling) - 5 Steps - Lazy loaded */}
            <Suspense fallback={<SectionSkeleton />}>
              <HowAmacarWorks />
            </Suspense>
            
            {/* Section 5: Phase 2 - How Reverse Bidding Works (Buying) - 5 Steps - Lazy loaded */}
            <Suspense fallback={<SectionSkeleton />}>
              <HowReverseBiddingWorks />
            </Suspense>
            
            {/* Section 6: Why Amacar (Unified) - Lazy loaded */}
            <Suspense fallback={<SectionSkeleton />}>
              <WhyChooseAmacar />
            </Suspense>
            
            {/* Section 6: Reviews (Unified) - Lazy loaded */}
            <Suspense fallback={<SectionSkeleton />}>
              <TestimonialCarousel />
            </Suspense>
            
            {/* Section 7: Trusted by Dealerships - Lazy loaded */}
            <Suspense fallback={<SectionSkeleton />}>
              <TrustedByDealerships />
            </Suspense>
            
            {/* Section 8: SEO Section - Lazy loaded */}
            <Suspense fallback={<SectionSkeleton />}>
              <SEOSection />
            </Suspense>
            
            {/* Existing Sections - Keep for later updates - All lazy loaded */}
            <Suspense fallback={<SectionSkeleton />}>
              <VideoSection />
            </Suspense>
            <Suspense fallback={<SectionSkeleton />}>
              <ModernCarousel />
            </Suspense>
            {/* <WinWinAmacar /> */}
            <Suspense fallback={<SectionSkeleton />}>
              <BrandLogosCarousel />
            </Suspense>
            <Suspense fallback={<SectionSkeleton />}>
              <TwoColumnSection />
            </Suspense>
            <Suspense fallback={<SectionSkeleton />}>
              <CarFooterSection />
            </Suspense>
        </div>
    )
}