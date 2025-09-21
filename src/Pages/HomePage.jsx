import Hero from '@/components/Home/Hero/Hero.jsx'
import SectionHeader from '@/components/Home/SectionHeader/SectionHeader.jsx'
import HowItWorks from '@/components/Home/HowItWorks/HowItWorks.jsx'
import WhyChooseAmacar from '@/components/Home/WhyChooseAmacar/WhyChooseAmacar.jsx'
import WinWinAmacar from '@/components/Home/WinWinAmacar/WinWinAmacar.jsx'
import TwoColumnSection from '@/components/Home/TwoColumnSection/TwoColumnSection.jsx'
import TestimonialCarousel from '@/components/Home/TestimonialCarousel/TestimonialCarousel.jsx'
import CarFooterSection from '@/components/Home/CarFooterSection/CarFooterSection.jsx'
import VideoSection from '@/components/Home/VideoSection/videoSection.jsx'
import HeroCarousel from '@/components/Home/Carousel/Carousel.jsx'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import Seo from '@/components/SEO/Seo'
import { seoData } from '@/config/seoConfig'

export default function HomePage() {
    const { userState, loading } = useSelector((state) => state.user);
    useEffect(() => {
        // console.log(userState); 
    })
    return (
        <>
            <Seo title={seoData.home.title} description={seoData.home.description} />
            <Hero />
            <SectionHeader title="How Amacar works" highlight="Sell smarter, faster" />
            <VideoSection />
            <HowItWorks />
            <HeroCarousel />
            <WhyChooseAmacar />
            <WinWinAmacar />
            <TwoColumnSection />
            <CarFooterSection />
            <TestimonialCarousel />
        </>
    )
}