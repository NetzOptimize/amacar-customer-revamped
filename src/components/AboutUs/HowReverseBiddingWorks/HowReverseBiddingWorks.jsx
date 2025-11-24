import React, { useState } from "react"
import { motion } from "framer-motion"
import SectionHeader from "@/components/Home/SectionHeader/SectionHeader.jsx"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { setFilters, fetchMockCarsThunk } from "@/features/reverseBidding/redux/reverseBidSlice"

export default function HowReverseBiddingWorks() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
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

    const scaleIn = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: (delay = 0) => ({
            opacity: 1,
            scale: 1,
            transition: { duration: 0.6, ease: "easeOut", delay },
        }),
    }

    const handleStartReverseBidding = () => {
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

    const steps = [
        {
            number: "01",
            title: "Select the Car You Want",
            description: "Choose the model, trim, and options you're looking for.",
            icon: "🚗",
            color: "from-blue-500 to-blue-600",
            bgColor: "bg-blue-50",
            borderColor: "border-blue-200"
        },
        {
            number: "02",
            title: "Request Instant Dealer Pricing",
            description: "Dealerships receive your request instantly.",
            icon: "📨",
            color: "from-green-500 to-green-600",
            bgColor: "bg-green-50",
            borderColor: "border-green-200"
        },
        {
            number: "03",
            title: "Reverse Bidding Begins",
            description: "Dealers compete by lowering their prices in real time.",
            icon: "📉",
            color: "from-purple-500 to-purple-600",
            bgColor: "bg-purple-50",
            borderColor: "border-purple-200"
        },
        {
            number: "04",
            title: "Compare Offers & Dealer Free Perks",
            description: "See discounts, warranties, and bonuses offered by dealers.",
            icon: "🎁",
            color: "from-orange-500 to-orange-600",
            bgColor: "bg-orange-50",
            borderColor: "border-orange-200"
        },
        {
            number: "05",
            title: "Lock In the Best Price",
            description: "Choose your deal, schedule pickup, and save thousands.",
            icon: "💵",
            color: "from-primary-500 to-primary-600",
            bgColor: "bg-primary-50",
            borderColor: "border-primary-200"
        }
    ]

    return (
        <section className="pb-8 md:pb-12 lg:pb-16 bg-gradient-to-br from-neutral-50 via-white to-primary-50">
            <div className="container-custom">
                {/* Section Header */}
                <SectionHeader
                    title="How Reverse Bidding Works"
                    highlight="Buy Your Car at the Lowest Price"
                />

                {/* Steps Container */}
                <div className="mt-20">
                    {/* Desktop Layout - Horizontal Steps */}
                    <div className="hidden lg:block">
                        <div className="relative">
                            {/* Steps Grid */}
                            <div className="grid grid-cols-5 gap-4 relative z-10">
                                {steps.map((step, index) => (
                                    <motion.div
                                        key={index}
                                        initial="hidden"
                                        whileInView="visible"
                                        viewport={{ once: true, amount: 0.3 }}
                                        variants={scaleIn}
                                        custom={index * 0.2}
                                        className="relative"
                                    >
                                        {/* Step Card - Fixed Height */}
                                        <div className={`${step.bgColor} ${step.borderColor} border-2 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-2 h-80 flex flex-col justify-between `}>
                                            {/* Top Section */}
                                            <div>
                                                {/* Step Number */}
                                                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${step.color} text-white text-xl font-bold mb-4`}>
                                                    {step.number}
                                                </div>

                                                {/* Icon */}
                                                <div className="text-4xl mb-4">
                                                    {step.icon}
                                                </div>
                                            </div>

                                            {/* Bottom Section - Fixed Height */}
                                            <div className="flex-1 flex flex-col justify-center">
                                                {/* Title */}
                                                <h3 className="text-lg font-bold text-neutral-900 mb-3 leading-tight">
                                                    {step.title}
                                                </h3>

                                                {/* Description */}
                                                <p className="text-sm text-neutral-600 leading-relaxed">
                                                    {step.description}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Arrow (except for last step) */}
                                        {index < steps.length - 1 && (
                                            <div className="absolute top-1/2 -right-2 transform -translate-y-1/2 z-20">
                                                <div className="flex items-center">
                                                    {/* Connection Line */}
                                                    <div className="w-8 h-0.5 bg-primary-300"></div>
                                                    {/* Arrow Circle */}
                                                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center ml-1">
                                                        <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Mobile Layout - Vertical Steps */}
                    <div className="lg:hidden space-y-8">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.3 }}
                                variants={fadeUp}
                                custom={index * 0.2}
                                className="relative"
                            >
                                {/* Step Card - Fixed Height for Mobile */}
                                <div className={`${step.bgColor} ${step.borderColor} border-2 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 h-32`}>
                                    <div className="flex items-center gap-4 h-full">
                                        {/* Step Number & Icon */}
                                        <div className="flex-shrink-0 flex flex-col items-center">
                                            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r ${step.color} text-white text-sm font-bold mb-2`}>
                                                {step.number}
                                            </div>
                                            <div className="text-2xl">
                                                {step.icon}
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-neutral-900 mb-2">
                                                {step.title}
                                            </h3>
                                            <p className="text-neutral-600 leading-relaxed text-sm">
                                                {step.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Arrow (except for last step) */}
                                {index < steps.length - 1 && (
                                    <div className="flex justify-center mt-4">
                                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                                            <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Bottom CTA Section */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={fadeUp}
                    custom={0.6}
                    className="mt-20 text-center"
                >
                    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-soft border border-neutral-100">
                        <h3 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-4">
                            Find Your Perfect Car at the Best Price
                        </h3>
                        <p className="text-lg text-neutral-600 mb-8 max-w-2xl mx-auto">
                            Experience the power of Reverse Bidding. Dealers compete to give you the lowest price and best perks!
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button 
                                onClick={handleStartReverseBidding} 
                                className="btn-primary px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                Start Reverse Bidding
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

