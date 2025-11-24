import React, { useState } from 'react'
import { motion } from 'framer-motion'
import './why-choose-amacar.css'
import AuctionModal from '@/components/ui/AuctionYourRideModal'

export default function WhyChooseAmacar() {
    const [auctionOpen, setAuctionOpen] = useState(false);
    const benefits = [
        {
            id: 1,
            title: "Professionalism",
            description: "A smooth, transparent process whether you're selling or buying. Every offer and price is handled with accuracy and fairness.",
            icon: "🏆",
            color: "var(--brand-orange)"
        },
        {
            id: 2,
            title: "Maximized Value",
            description: "Sell your car for the highest price through Live Auction or buy your next car at the lowest price with Reverse Bidding. Verified dealerships compete in real time—ensuring you always get the best possible deal on either side of the marketplace.",
            icon: "💰",
            color: "var(--brand-purple)"
        },
        {
            id: 3,
            title: "Security",
            description: "Your data is protected, and only verified dealerships can bid—giving you a safe, trusted experience every time.",
            icon: "🔒",
            color: "var(--accent)"
        },
        {
            id: 4,
            title: "Efficiency",
            description: "Get instant offers, compare prices fast, and complete your sale or purchase in minutes—Only visit the dealership for pickup or drop off.",
            icon: "⚡",
            color: "var(--brand-orange)"
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

                {/* Timeline Layout */}
                <motion.div
                    className="timeline-container"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                >
                    {/* Timeline Line */}
                    <div className="timeline-line"></div>

                    {benefits.map((benefit, index) => (
                        <motion.div
                            key={benefit.id}
                            className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}
                            variants={itemVariants}
                        >
                            {/* Timeline Node */}
                            <div className="timeline-node">
                                <motion.div
                                    className="timeline-icon"
                                    style={{ backgroundColor: benefit.color }}
                                    variants={iconVariants}
                                    whileHover="hover"
                                >
                                    <span className="icon-emoji">{benefit.icon}</span>
                                </motion.div>
                            </div>

                            {/* Content */}
                            <div className="timeline-content">
                                <div className="content-card">
                                    <h3 className="benefit-title">{benefit.title}</h3>
                                    <p className="benefit-description">{benefit.description}</p>

                                    {/* Decorative Accent */}
                                    <div
                                        className="accent-line"
                                        style={{ backgroundColor: benefit.color }}
                                    ></div>
                                </div>
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
