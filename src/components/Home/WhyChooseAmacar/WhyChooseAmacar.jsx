import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Target, Gem, Lock, Zap } from 'lucide-react'
import './why-choose-amacar.css'
import AuctionModal from '@/components/ui/AuctionYourRideModal'

export default function WhyChooseAmacar() {
    const [auctionOpen, setAuctionOpen] = useState(false);
    const benefits = [
        {
            id: 1,
            number: "01",
            title: "Professionalism",
            description: "We uphold the highest standards of professionalism in every transaction.",
            icon: <Target className="w-8 h-8" />,
            iconBg: "bg-blue-500",
            numberBg: "bg-blue-500",
            accentColor: "bg-blue-500",
            cardBg: "bg-gradient-to-br from-blue-50 to-blue-100/50"
        },
        {
            id: 2,
            number: "02",
            title: "Maximized Value",
            description: "We uphold the highest value in the market from instant cash offer to auctioning your car.",
            icon: <Gem className="w-8 h-8" />,
            iconBg: "bg-green-500",
            numberBg: "bg-green-500",
            accentColor: "bg-green-500",
            cardBg: "bg-gradient-to-br from-green-50 to-green-100/50"
        },
        {
            id: 3,
            number: "03",
            title: "Security",
            description: "Your privacy and security are paramount to us. We handle your information with the utmost confidentiality at online Auction.",
            icon: <Lock className="w-8 h-8" />,
            iconBg: "bg-purple-500",
            numberBg: "bg-purple-500",
            accentColor: "bg-purple-500",
            cardBg: "bg-gradient-to-br from-purple-50 to-purple-100/50"
        },
        {
            id: 4,
            number: "04",
            title: "Efficiency",
            description: "Our streamlined online platform saves you time and effort, making selling your car effortless",
            icon: <Zap className="w-8 h-8" />,
            iconBg: "bg-orange-500",
            numberBg: "bg-orange-500",
            accentColor: "bg-orange-500",
            cardBg: "bg-gradient-to-br from-orange-50 to-orange-100/50"
        }
    ]

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.1
            }
        }
    }

    const itemVariants = {
        hidden: {
            opacity: 0,
            y: 30,
            scale: 0.95
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.6,
                ease: [0.4, 0, 0.2, 1]
            }
        }
    }

    const iconVariants = {
        hover: {
            scale: 1.1,
            rotate: 5,
            transition: {
                duration: 0.3,
                ease: "easeOut"
            }
        }
    }

    return (
        <section className="why-choose-section">
            <div className="container">
                {/* Section Header */}
                <motion.div
                    className="why-choose-header"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true, margin: "-100px" }}
                >
                    <h2 className="why-choose-title">
                        Why Thousands Choose <span className="text-[var(--brand-orange)] text-7xl font-extrabold">Amacar</span>
                    </h2>
                    <div className="title-underline"></div>
                </motion.div>

                {/* Grid Layout */}
                <motion.div
                    className="benefits-grid"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                >
                    {benefits.map((benefit, index) => (
                        <motion.div
                            key={benefit.id}
                            className={`benefit-card ${benefit.cardBg}`}
                            variants={itemVariants}
                            whileHover={{ y: -4, transition: { duration: 0.2 } }}
                        >
                            {/* Number Badge - Top Right */}
                            <div className={`benefit-number ${benefit.numberBg}`}>
                                {benefit.number}
                            </div>

                            {/* Icon Square */}
                            <div className={`benefit-icon-square ${benefit.iconBg} text-white`}>
                                {benefit.icon}
                            </div>

                            {/* Content */}
                            <div className="benefit-content">
                                <h3 className="benefit-title">{benefit.title}</h3>
                                <p className="benefit-description">{benefit.description}</p>
                                {/* Accent Line - Below Text */}
                                <div className={`benefit-accent-line ${benefit.accentColor}`}></div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Bottom CTA */}
                {/* <motion.div
                    className="cta-section"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    viewport={{ once: true }}
                >
                    <p className="cta-text">Ready to experience the difference?</p>
                    <motion.button
                        onClick={() => setAuctionOpen(true)}
                        className="cta-button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Get Started Today
                    </motion.button>
                </motion.div> */}
            </div>
            <AuctionModal
                isOpen={auctionOpen}
                onClose={setAuctionOpen}
            />
        </section>
    )
}
