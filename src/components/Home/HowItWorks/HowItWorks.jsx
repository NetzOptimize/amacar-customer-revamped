import React from 'react'
import './how-it-works.css'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Car, Handshake, DollarSign, CheckCircle, ArrowRight } from 'lucide-react'

export default function HowItWorks() {
    const sellSteps = [
        {
            number: 1,
            title: "Get Your Instant Online Estimate",
            description: "Enter your vehicle details to receive a fast, accurate online valuation.",
            icon: <Car className="w-6 h-6" />
        },
        {
            number: 2,
            title: "Dealers Bid Up in Real Time",
            description: "Verified dealerships compete by increasing their offers to win your car.",
            icon: <TrendingUp className="w-6 h-6" />
        },
        {
            number: 3,
            title: "Choose the Highest Offer & Get Paid",
            description: "Select the top bid and complete your sale quickly and securely.",
            icon: <DollarSign className="w-6 h-6" />
        }
    ]

    const buySteps = [
        {
            number: 1,
            title: "Select the Car You Want",
            description: "Choose the model, trim, and options you're looking for.",
            icon: <Car className="w-6 h-6" />
        },
        {
            number: 2,
            title: "Request Instant Dealer Pricing",
            description: "Dealerships receive your request instantly.",
            icon: <ArrowRight className="w-6 h-6" />
        },
        {
            number: 3,
            title: "Reverse Bidding Begins",
            description: "Dealers compete by lowering their prices in real time.",
            icon: <TrendingDown className="w-6 h-6" />
        },
        {
            number: 4,
            title: "Compare Offers & Dealer Free Perks",
            description: "See discounts, warranties, and bonuses offered by dealers.",
            icon: <CheckCircle className="w-6 h-6" />
        },
        {
            number: 5,
            title: "Lock In the Best Price",
            description: "Choose your deal, schedule pickup, and save thousands.",
            icon: <DollarSign className="w-6 h-6" />
        }
    ]

    // 🔹 Animation variants
    const columnVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.2, duration: 0.6, ease: "easeOut" }
        })
    }

    const stepVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: (i) => ({
            opacity: 1,
            x: 0,
            transition: { delay: i * 0.1, duration: 0.4, ease: "easeOut" }
        })
    }

    return (
        <section className="how-it-works-section">
            <motion.div 
                className="container"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
            >
                {/* Section Header */}
                <motion.div 
                    className="how-it-works-header"
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="how-it-works-title">How Amacar Works</h2>
                    <div className="title-underline"></div>
                </motion.div>

                {/* Side-by-Side Comparison */}
                <div className="comparison-grid">
                    {/* Column A - Sell Your Car */}
                    <motion.div
                        className="comparison-column comparison-column-sell"
                        custom={0}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={columnVariants}
                    >
                        <div className="column-header">
                            <div className="column-icon column-icon-sell">
                                <TrendingUp className="w-8 h-8" />
                            </div>
                            <h3 className="column-title">Sell Your Car (Live Auction)</h3>
                        </div>
                        <div className="steps-list">
                            {sellSteps.map((step, index) => (
                                <motion.div
                                    key={step.number}
                                    className="comparison-step"
                                    custom={index}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    variants={stepVariants}
                                >
                                    <div className="step-number-badge step-number-badge-sell">
                                        {step.number}
                                    </div>
                                    <div className="step-icon-wrapper step-icon-wrapper-sell">
                                        {step.icon}
                                    </div>
                                    <div className="flex-1">
                                        <p className="step-text">{step.title}</p>
                                        {step.description && (
                                            <p className="step-description-text">{step.description}</p>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Divider */}
                    <div className="comparison-divider">
                        <div className="divider-line"></div>
                        <div className="divider-text">VS</div>
                        <div className="divider-line"></div>
                    </div>

                    {/* Column B - Buy a Car */}
                    <motion.div
                        className="comparison-column comparison-column-buy"
                        custom={1}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={columnVariants}
                    >
                        <div className="column-header">
                            <div className="column-icon column-icon-buy">
                                <TrendingDown className="w-8 h-8" />
                            </div>
                            <h3 className="column-title">Buy a Car (Reverse Bidding)</h3>
                        </div>
                        <div className="steps-list">
                            {buySteps.map((step, index) => (
                                <motion.div
                                    key={step.number}
                                    className="comparison-step"
                                    custom={index}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    variants={stepVariants}
                                >
                                    <div className="step-number-badge step-number-badge-buy">
                                        {step.number}
                                    </div>
                                    <div className="step-icon-wrapper step-icon-wrapper-buy">
                                        {step.icon}
                                    </div>
                                    <div className="flex-1">
                                        <p className="step-text">{step.title}</p>
                                        {step.description && (
                                            <p className="step-description-text">{step.description}</p>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    )
}
