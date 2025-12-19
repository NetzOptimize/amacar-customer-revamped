import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
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
    const location = useLocation();

    // Handle scrolling to section when hash is present in URL
    useEffect(() => {
        if (location.hash) {
            // Remove the # from the hash
            const hash = location.hash.substring(1);
            const element = document.getElementById(hash);
            
            if (element) {
                // Small delay to ensure page is rendered
                setTimeout(() => {
                    const offset = 100; // Offset for fixed header
                    const elementPosition = element.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - offset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }, 100);
            }
        }
    }, [location.hash]);

    return (
        <div className="overflow-x-hidden">
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
        </div>
    )
}
