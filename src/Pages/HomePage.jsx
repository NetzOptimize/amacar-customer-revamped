import Hero from '@/components/Home/Hero/Hero.jsx'
import QuickChoicePanel from '@/components/Home/QuickChoicePanel/QuickChoicePanel.jsx'
import SectionHeader from '@/components/Home/SectionHeader/SectionHeader.jsx'
import HowItWorks from '@/components/Home/HowItWorks/HowItWorks.jsx'
import WhyChooseAmacar from '@/components/Home/WhyChooseAmacar/WhyChooseAmacar.jsx'
import TestimonialCarousel from '@/components/Home/TestimonialCarousel/TestimonialCarousel.jsx'
import TrustedByDealerships from '@/components/Home/TrustedByDealerships/TrustedByDealerships.jsx'
import SEOSection from '@/components/Home/SEOSection/SEOSection.jsx'
import WinWinAmacar from '@/components/Home/WinWinAmacar/WinWinAmacar.jsx'
import TwoColumnSection from '@/components/Home/TwoColumnSection/TwoColumnSection.jsx'
import CarFooterSection from '@/components/Home/CarFooterSection/CarFooterSection.jsx'
import VideoSection from '@/components/Home/VideoSection/videoSection.jsx'
import HeroCarousel from '@/components/Home/Carousel/Carousel.jsx'
import HowAmacarWorks from '@/components/AboutUs/HowAmacarWorks/HowAmacarWorks.jsx'
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
            
            {/* Section 3: How Each System Works (Side-by-Side) */}
            <HowItWorks />
            
            {/* Section 4: Why Amacar (Unified) */}
            <WhyChooseAmacar />
            
            {/* Section 5: Reviews (Unified) */}
            <TestimonialCarousel />
            
            {/* Section 6: Trusted by Dealerships */}
            <TrustedByDealerships />
            
            {/* Section 7: SEO Section */}
            <SEOSection />
            
            {/* Existing Sections - Keep for later updates */}
            <SectionHeader title="How Amacar works" highlight="Sell smarter, faster" />
            <VideoSection />
            <ModernCarousel />
            {/* <WinWinAmacar /> */}
            <HowAmacarWorks />
            <BrandLogosCarousel />
            <TwoColumnSection />
            <CarFooterSection />
        </div>
    )
}