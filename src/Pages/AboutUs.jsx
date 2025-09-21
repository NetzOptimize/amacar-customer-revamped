import React from 'react'
import AboutUsHero from '@/components/AboutUs/AboutUsHero/AboutUsHero.jsx'
import WhoWeAre from '@/components/AboutUs/WhoWeAre/WhoWeAre.jsx'
import HowAmacarWorks from '@/components/AboutUs/HowAmacarWorks/HowAmacarWorks.jsx'
import OurValues from '@/components/AboutUs/OurValues/OurValues.jsx'
import TrustedPartners from '@/components/AboutUs/TrustedPartners/TrustedPartners.jsx'
import HowItWorksSimple from '@/components/AboutUs/HowItWorksSimple/HowItWorksSimple.jsx'
import WhyTrustAmacar from '@/components/AboutUs/WhyTrustAmacar/WhyTrustAmacar.jsx'
import TestimonialCarousel from '@/components/Home/TestimonialCarousel/TestimonialCarousel'
import ReadyToGetStarted from '@/components/AboutUs/ReadyToGetStarted/ReadyToGetStarted.jsx'
import Seo from '@/components/SEO/Seo'
import { seoData } from '@/config/seoConfig'
export default function AboutUs() {
    return (
        <>
            <Seo title={seoData.about.title} description={seoData.about.description} />
            <AboutUsHero />
            <WhoWeAre />
            <HowAmacarWorks />
            <OurValues />
            <TrustedPartners />
            <HowItWorksSimple />
            <WhyTrustAmacar />
            <TestimonialCarousel />
            <ReadyToGetStarted />
        </>
    )
}
