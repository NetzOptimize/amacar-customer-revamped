import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Car, DollarSign, CheckCircle } from 'lucide-react'
import './how-each-system-works.css'

export default function HowEachSystemWorks() {
    const [activeTab, setActiveTab] = useState('sell') // 'sell' or 'buy'

    const sellSteps = [
        {
            number: 1,
            title: "Get Your Instant Online Estimate",
            description: "Enter your vehicle details to receive a fast, accurate online valuation.",
            icon: Car
        },
        {
            number: 2,
            title: "Dealers Bid Up in Real Time",
            description: "Verified dealerships compete by increasing their offers to win your car.",
            icon: TrendingUp
        },
        {
            number: 3,
            title: "Choose the Highest Offer & Get Paid",
            description: "Select the top bid and complete your sale quickly and securely.",
            icon: DollarSign
        }
    ]

    const buySteps = [
        {
            number: 1,
            title: "Select the Car You Want",
            description: "Pick your preferred model and instantly notify local dealerships.",
            icon: Car
        },
        {
            number: 2,
            title: "Dealers Lower Their Prices to Compete",
            description: "Reverse Bidding begins as dealers drop prices and add perks to earn your business.",
            icon: TrendingDown
        },
        {
            number: 3,
            title: "Lock In the Best Deal & Schedule Pickup",
            description: "Choose the lowest price and finalize your purchase with total transparency.",
            icon: CheckCircle
        }
    ]

    const fadeUp = {
        hidden: { opacity: 0, y: 30 },
        visible: (delay = 0) => ({
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut", delay },
        }),
    }

    const currentSteps = activeTab === 'sell' ? sellSteps : buySteps
    const isSell = activeTab === 'sell'

    return (
        <section className="how-each-system-section">
            <div className="container">
                {/* Section Header */}
                <motion.div
                    className="section-header"
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <h2 className="section-title">Here's How It Works</h2>
                    <p className="section-subtitle">In Three Simple Steps</p>
                </motion.div>

                {/* Tab Navigation */}
                <div className="tabs-container">
                    <button
                        onClick={() => setActiveTab('sell')}
                        className={`tab-button tab-sell ${activeTab === 'sell' ? 'active' : ''}`}
                    >
                        <TrendingUp className="tab-icon" size={16} />
                        FOR SELLING YOUR CAR (Live Auction)
                    </button>
                    <button
                        onClick={() => setActiveTab('buy')}
                        className={`tab-button tab-buy ${activeTab === 'buy' ? 'active' : ''}`}
                    >
                        <TrendingDown className="tab-icon" size={16} />
                        FOR BUYING A CAR (Reverse Bidding)
                    </button>
                </div>

                {/* Steps Display */}
                <motion.div
                    key={activeTab}
                    className={`steps-container ${isSell ? 'mode-sell' : 'mode-buy'}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                >
                    {/* Connecting Line */}
                    <div className="step-connector"></div>

                    <div className="steps-grid">
                        {currentSteps.map((step, index) => {
                            const IconComponent = step.icon
                            const isMiddleStep = index === 1
                            
                            return (
                                <motion.div
                                    key={step.number}
                                    className={`step-card ${isMiddleStep ? 'highlight' : ''}`}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, amount: 0.2 }}
                                    variants={fadeUp}
                                    custom={index * 0.15}
                                >
                                    <div className="icon-wrapper">
                                        <span className="step-number">{step.number}</span>
                                        <IconComponent className="step-icon" />
                                    </div>

                                    <h3 className="step-title">{step.title}</h3>
                                    <p className="step-description">{step.description}</p>
                                </motion.div>
                            )
                        })}
                    </div>
                </motion.div>
            </div>
        </section>
    )
}