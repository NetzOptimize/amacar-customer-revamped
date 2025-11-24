import Hero from '@/components/Home/Hero/Hero.jsx'
import QuickChoicePanel from '@/components/Home/QuickChoicePanel/QuickChoicePanel.jsx'
import WhyChooseAmacar from '@/components/Home/WhyChooseAmacar/WhyChooseAmacar.jsx'
import TestimonialCarousel from '@/components/Home/TestimonialCarousel/TestimonialCarousel.jsx'
import TrustedByDealerships from '@/components/Home/TrustedByDealerships/TrustedByDealerships.jsx'
import SEOSection from '@/components/Home/SEOSection/HomeSEOSection'
import WinWinAmacar from '@/components/Home/WinWinAmacar/WinWinAmacar.jsx'
import TwoColumnSection from '@/components/Home/TwoColumnSection/TwoColumnSection.jsx'
import CarFooterSection from '@/components/Home/CarFooterSection/CarFooterSection.jsx'
import VideoSection from '@/components/Home/VideoSection/videoSection.jsx'
import HeroCarousel from '@/components/Home/Carousel/Carousel.jsx'
import HowAmacarWorks from '@/components/AboutUs/HowAmacarWorks/HowAmacarWorks.jsx'
import HowReverseBiddingWorks from '@/components/AboutUs/HowReverseBiddingWorks/HowReverseBiddingWorks.jsx'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import Seo from '@/components/SEO/Seo'
import { seoData } from '@/config/seoConfig'
import BrandLogosCarousel from '@/components/Home/BrandLogosCarousel/BrandLogosCarousel.jsx'
import ModernCarousel from '@/components/Home/ModernCarousel/ModernCarousel'
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
            
            {/* Section 3: Phase 1 - How Amacar Works (Selling) */}
            <HowAmacarWorks />
            
            {/* Section 4: Phase 2 - How Reverse Bidding Works (Buying) */}
            <HowReverseBiddingWorks />
            
            {/* Section 5: Why Amacar (Unified) */}
            <WhyChooseAmacar />
            
            {/* Section 6: Reviews (Unified) */}
            <TestimonialCarousel />
            
            {/* Section 7: Trusted by Dealerships */}
            <TrustedByDealerships />
            
            {/* Section 8: SEO Section */}
            <SEOSection />
            
            {/* Existing Sections - Keep for later updates */}
            <VideoSection />
            <ModernCarousel />
            {/* <WinWinAmacar /> */}
            <BrandLogosCarousel />
            <TwoColumnSection />
            <CarFooterSection />
        </div>
    )
}