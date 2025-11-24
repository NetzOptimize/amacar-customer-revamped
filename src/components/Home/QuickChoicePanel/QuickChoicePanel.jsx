import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setFilters, fetchMockCarsThunk } from '@/features/reverseBidding/redux/reverseBidSlice'
import { ArrowRight, TrendingUp, TrendingDown, Clock, DollarSign, Users, CheckCircle } from 'lucide-react'
import AuctionModal from '@/components/ui/AuctionYourRideModal'
import './quick-choice-panel.css'

export default function QuickChoicePanel() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [auctionOpen, setAuctionOpen] = useState(false)

    const handleReverseBidding = () => {
        const filtersToDispatch = {
            condition: null,
            make: null,
            model: null,
            year: null,
            budgetMin: null,
            budgetMax: null,
        }
        dispatch(setFilters(filtersToDispatch))
        dispatch(fetchMockCarsThunk({ filters: filtersToDispatch, page: 1, perPage: 20 }))
        navigate('/reverse-bidding/results')
    }

    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.2, duration: 0.6, ease: "easeOut" }
        })
    }

    const cards = [
        {
            id: 1,
            title: "Sell Your Car (Live Auction)",
            features: [
                "Dealers bid up",
                "Get multiple real-time offers",
                "Highest bid wins",
                "Fastest way to sell your car"
            ],
            icon: <TrendingUp className="w-8 h-8" />,
            gradient: "from-orange-500 to-red-600",
            buttonText: "Start Live Auction →",
            onClick: () => setAuctionOpen(true),
            color: "orange"
        },
        {
            id: 2,
            title: "Buy a Car (Reverse Bidding)",
            features: [
                "Pick a New or Used Car",
                "Dealers bid down",
                "You get the lowest price",
                "Compare offers + Dealer Free perks",
                "Save thousands instantly"
            ],
            icon: <TrendingDown className="w-8 h-8" />,
            gradient: "from-blue-500 to-indigo-600",
            buttonText: "Start Reverse Bidding →",
            onClick: handleReverseBidding,
            color: "blue"
        }
    ]

    return (
        <section className="quick-choice-section">
            <div className="container">
                <motion.div
                    className="quick-choice-header"
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <h2 className="quick-choice-title">
                        Choose How You Want to Use Amacar
                    </h2>
                    <div className="title-underline"></div>
                </motion.div>

                <div className="quick-choice-grid">
                    {cards.map((card, index) => (
                        <motion.div
                            key={card.id}
                            className={`quick-choice-card quick-choice-card-${card.color}`}
                            custom={index}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.2 }}
                            variants={cardVariants}
                            whileHover={{ y: -8, transition: { duration: 0.3 } }}
                        >
                            {/* Icon */}
                            <div className={`quick-choice-icon bg-gradient-to-br ${card.gradient}`}>
                                {card.icon}
                            </div>

                            {/* Title */}
                            <h3 className="quick-choice-card-title">{card.title}</h3>

                            {/* Features List */}
                            <ul className="quick-choice-features">
                                {card.features.map((feature, idx) => (
                                    <li key={idx} className="quick-choice-feature-item">
                                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* CTA Button */}
                            <motion.button
                                onClick={card.onClick}
                                className={`quick-choice-button quick-choice-button-${card.color}`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {card.buttonText}
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </motion.button>
                        </motion.div>
                    ))}
                </div>
            </div>

            <AuctionModal
                isOpen={auctionOpen}
                onClose={setAuctionOpen}
            />
        </section>
    )
}

