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
            icon: <Target className="w-6 h-6" />,
            iconBg: "bg-orange-50",
            iconColor: "text-[#f6851f]",
            numberBg: "bg-[#f6851f]",
            accentColor: "bg-[#f6851f]"
        },
        {
            id: 2,
            number: "02",
            title: "Maximized Value",
            description: "We uphold the highest value in the market from instant cash offer to auctioning your car.",
            icon: <Gem className="w-6 h-6" />,
            iconBg: "bg-orange-50",
            iconColor: "text-[#f6851f]",
            numberBg: "bg-[#f6851f]",
            accentColor: "bg-[#f6851f]"
        },
        {
            id: 3,
            number: "03",
            title: "Security",
            description: "Your privacy and security are paramount to us. We handle your information with the utmost confidentiality at online Auction.",
            icon: <Lock className="w-6 h-6" />,
            iconBg: "bg-orange-50",
            iconColor: "text-[#f6851f]",
            numberBg: "bg-[#f6851f]",
            accentColor: "bg-[#f6851f]"
        },
        {
            id: 4,
            number: "04",
            title: "Efficiency",
            description: "Our streamlined online platform saves you time and effort, making selling your car effortless",
            icon: <Zap className="w-6 h-6" />,
            iconBg: "bg-orange-50",
            iconColor: "text-[#f6851f]",
            numberBg: "bg-[#f6851f]",
            accentColor: "bg-[#f6851f]"
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
                        Why Thousands Choose <span className="text-[#f6851f]">Amacar</span>
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
                            className="benefit-card"
                            variants={itemVariants}
                            whileHover={{ y: -2, transition: { duration: 0.2 } }}
                        >
                            {/* Number Badge - Top Right */}
                            <div className={`benefit-number ${benefit.numberBg}`}>
                                {benefit.number}
                            </div>

                            {/* Icon Square */}
                            <div className={`benefit-icon-square ${benefit.iconBg} ${benefit.iconColor}`}>
                                {benefit.icon}
                            </div>

                            {/* Content */}
                            <div className="benefit-content">
                                <h3 className="benefit-title">{benefit.title}</h3>
                                <p className="benefit-description">{benefit.description}</p>
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
