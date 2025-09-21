import React from "react"
import { motion } from "framer-motion"
import "./about-us-hero.css"
import bgImg from "../../../assets/home_page_first_hero(12).jpg"

export default function AboutUsHero() {
    // Animation variants
    const fadeUp = {
        hidden: { opacity: 0, y: 30 },
        visible: (delay = 0) => ({
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "easeOut", delay },
        }),
    }

    const fadeIn = {
        hidden: { opacity: 0 },
        visible: (delay = 0) => ({
            opacity: 1,
            transition: { duration: 1, ease: "easeOut", delay },
        }),
    }

    return (
        <section
            className="about-us-hero-section"
            style={{ backgroundImage: `url(${bgImg})` }}
        >
            <div className="about-us-hero-overlay"></div>
            <motion.div
                className="about-us-hero-content"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
            >

                <motion.h1 className="about-us-hero-headline" variants={fadeUp} custom={0.2}>
                    Our <span className="highlight-text">Vision</span>
                </motion.h1>

                <motion.p className="about-us-hero-subtitle" variants={fadeUp} custom={0.4}>
                    Revolutionizing the way you sell your car with live auctions,
                    instant offers, and transparent pricing that puts you in control.
                </motion.p>


            </motion.div>

            {/* Decorative elements */}
            <div className="about-us-hero-decoration">
                <div className="decoration-circle decoration-circle-1"></div>
                <div className="decoration-circle decoration-circle-2"></div>
                <div className="decoration-circle decoration-circle-3"></div>
            </div>
        </section>
    )
}
