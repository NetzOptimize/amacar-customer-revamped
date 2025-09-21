import React from "react"
import { motion } from "framer-motion"
import SectionHeader from "@/components/Home/SectionHeader/SectionHeader.jsx"
import AuctionModal from '@/components/ui/AuctionYourRideModal'
import Modal from '@/components/ui/modal'
import { useState } from 'react'


export default function HowItWorksSimple() {
    const [auctionOpen, setAuctionOpen] = useState(false);
    const [isModalOpen, setisModalOpen] = useState(false);
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

    const slideInLeft = {
        hidden: { opacity: 0, x: -50 },
        visible: (delay = 0) => ({
            opacity: 1,
            x: 0,
            transition: { duration: 0.8, ease: "easeOut", delay },
        }),
    }

    const slideInRight = {
        hidden: { opacity: 0, x: 50 },
        visible: (delay = 0) => ({
            opacity: 1,
            x: 0,
            transition: { duration: 0.8, ease: "easeOut", delay },
        }),
    }

    const steps = [
        {
            number: "1",
            title: "Get Your Instant Online Estimate",
            description: "Start with a quick appraisal of your vehicle to understand its market value.",
            why: "Know your car's estimated value upfront so you can make informed decisions.",
            icon: "📊",
            color: "from-blue-500 to-blue-600",
            bgColor: "from-blue-50 to-blue-100",
            borderColor: "border-blue-200"
        },
        {
            number: "2",
            title: "Auction Your Car for the Best Offer",
            description: "Want to see what local dealers will really pay for your vehicle?",
            why: "Dealers compete in real time, ensuring you get the best possible price for your car.",
            icon: "🔨",
            color: "from-purple-500 to-purple-600",
            bgColor: "from-purple-50 to-purple-100",
            borderColor: "border-purple-200"
        },
        {
            number: "3",
            title: "You Accept",
            description: "Choose your best offer. Payment is guaranteed and secure.",
            why: "Transparent, secure, seller-first approach ensures you're always in control.",
            icon: "✅",
            color: "from-green-500 to-green-600",
            bgColor: "from-green-50 to-green-100",
            borderColor: "border-green-200"
        }
    ]

    return (
        <section className="pb-24 md:pb-24 lg:pb-24 bg-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-20 left-10 w-40 h-40 bg-primary-500 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-10 w-32 h-32 bg-blue-500 rounded-full blur-2xl"></div>
                <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-purple-500 rounded-full blur-2xl transform -translate-x-1/2 -translate-y-1/2"></div>
            </div>

            <div className="container-custom relative z-10">
                {/* Section Header */}
                <SectionHeader
                    title="Here's How It Works"
                    highlight="In Three Simple Steps"
                />

                {/* Steps Container */}
                <div className="mt-20">
                    <div className="space-y-16 lg:space-y-20">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.3 }}
                                variants={index % 2 === 0 ? slideInLeft : slideInRight}
                                custom={index * 0.2}
                                className="relative"
                            >
                                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                                    {/* Content Side */}
                                    <div className={`${index % 2 === 0 ? 'lg:order-1' : 'lg:order-2'}`}>
                                        <div className="space-y-6">
                                            {/* Step Number & Icon */}
                                            <div className="flex items-center gap-4">
                                                <div className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg`}>
                                                    {step.number}
                                                </div>
                                                <div className="text-4xl">
                                                    {step.icon}
                                                </div>
                                            </div>

                                            {/* Title */}
                                            <h3 className="text-3xl lg:text-4xl font-bold text-neutral-900 leading-tight">
                                                {step.title}
                                            </h3>

                                            {/* Description */}
                                            <p className="text-lg text-neutral-700 leading-relaxed">
                                                {step.description}
                                            </p>

                                            {/* Why Section */}
                                            <div className={`bg-gradient-to-r ${step.bgColor} rounded-xl p-6 border-l-4 ${step.borderColor}`}>
                                                <div className="flex items-start gap-3">
                                                    <div className="text-2xl">💡</div>
                                                    <div>
                                                        <h4 className="font-semibold text-neutral-900 mb-2">Why?</h4>
                                                        <p className="text-neutral-700 leading-relaxed">
                                                            {step.why}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Visual Side */}
                                    <div className={`${index % 2 === 0 ? 'lg:order-2' : 'lg:order-1'}`}>
                                        <div className={`bg-gradient-to-br ${step.bgColor} rounded-3xl p-8 lg:p-12 relative overflow-hidden`}>
                                            {/* Background Decoration */}
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -translate-y-16 translate-x-16"></div>
                                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>

                                            {/* Content */}
                                            <div className="relative z-10 text-center">
                                                <div className={`w-24 h-24 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center text-4xl text-white mx-auto mb-6 shadow-xl`}>
                                                    {step.icon}
                                                </div>
                                                <h4 className="text-xl font-bold text-neutral-900 mb-4">
                                                    Step {step.number}
                                                </h4>
                                                <p className="text-neutral-600 leading-relaxed">
                                                    {step.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Connection Line (except for last step) */}
                                {index < steps.length - 1 && (
                                    <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 -bottom-8 w-1 h-16 bg-gradient-to-b from-primary-300 to-primary-100 rounded-full"></div>
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
                    <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-3xl p-12 md:p-16 text-white relative overflow-hidden">
                        {/* Background Elements */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>

                        <div className="relative z-10">
                            <h3 className="text-3xl md:text-4xl font-bold mb-6">
                                Ready to Start Your Auction?
                            </h3>
                            <p className="text-xl text-primary-50 mb-10 max-w-3xl mx-auto leading-relaxed">
                                Join thousands of satisfied customers who have discovered the Amacar advantage. Get started with your instant estimate today!
                            </p>
                            <div className="flex flex-col sm:flex-row gap-6 justify-center">
                                <button onClick={() => setAuctionOpen(true)} className="btn-primary bg-white text-primary-600 hover:bg-neutral-50 px-10 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                                    Start My Auction
                                </button>
                                <button onClick={() => setisModalOpen(true)} className="cursor-pointer btn-secondary bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-600 px-10 py-4 text-lg font-semibold rounded-xl transition-all duration-300">
                                    Get instant offer
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
            <AuctionModal
                isOpen={auctionOpen}
                onClose={setAuctionOpen}
            />
            <Modal
                isOpen={isModalOpen}
                onClose={() => setisModalOpen(false)}
                title="Get Instant Offer"
                description="Enter your vehicle details to start the offer process"
            />
        </section>
    )
}
