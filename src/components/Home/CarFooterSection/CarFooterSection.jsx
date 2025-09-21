import React, { useState } from 'react'
import { motion } from 'framer-motion'
import carImage from '../../../assets/footer_image.png'
import AuctionModal from '@/components/ui/AuctionYourRideModal'
import Modal from '@/components/ui/modal'

export default function CarFooterSection() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [auctionOpen, setAuctionOpen] = useState(false);
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3,
                delayChildren: 0.2
            }
        }
    }

    const itemVariants = {
        hidden: {
            opacity: 0,
            y: 30
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: [0.4, 0, 0.2, 1]
            }
        }
    }

    const buttonVariants = {
        hover: {
            scale: 1.05,
            transition: {
                duration: 0.3,
                ease: "easeOut"
            }
        },
        tap: {
            scale: 0.95
        }
    }

    return (
        <section className="relative  flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${carImage})` }}
            />

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/85 via-slate-800/75 to-slate-900/85" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-slate-900/40" />

            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full">
                {/* Animated particles effect */}
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/30 rounded-full animate-pulse" />
                <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-purple-400/40 rounded-full animate-pulse delay-1000" />
                <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-yellow-400/30 rounded-full animate-pulse delay-2000" />
                <div className="absolute bottom-1/4 right-1/4 w-1 h-1 bg-green-400/40 rounded-full animate-pulse delay-500" />

                {/* Subtle grid pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="w-full h-full" style={{
                        backgroundImage: `
                            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                        `,
                        backgroundSize: '50px 50px'
                    }} />
                </div>
            </div>

            {/* Content */}
            <motion.div
                className="relative z-10 max-w-6xl mx-auto px-6 text-center"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
            >
                {/* Main Heading */}
                <motion.div variants={itemVariants} className="mb-8">
                    <h2 className="mt-4 text-5xl lg:text-7xl font-black text-white mb-6 leading-tight">
                        Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-400 to-yellow-400">Transform</span> Your Car Sale?
                    </h2>
                    <div className="w-32 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto rounded-full" />
                </motion.div>

                {/* Subheading */}
                <motion.p
                    variants={itemVariants}
                    className="text-xl lg:text-2xl text-slate-200 mb-12 max-w-4xl mx-auto leading-relaxed"
                >
                    Join thousands of satisfied customers who've discovepurple the smartest way to sell their vehicles.
                    Get instant offers, watch dealers compete, and walk away with the best deal possible.
                </motion.p>

                {/* Stats */}
                <motion.div
                    variants={itemVariants}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
                >
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                        <div className="text-4xl font-bold text-white mb-2">10,000+</div>
                        <div className="text-slate-300">Cars Sold</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                        <div className="text-4xl font-bold text-white mb-2">₹2.5Cr+</div>
                        <div className="text-slate-300">Total Value</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                        <div className="text-4xl font-bold text-white mb-2">4.9★</div>
                        <div className="text-slate-300">Customer Rating</div>
                    </div>
                </motion.div>

                {/* CTA Buttons */}
                <motion.div
                    variants={itemVariants}
                    className="flex flex-col sm:flex-row gap-6 justify-center items-center"
                >
                    {/* Primary CTA */}
                    <motion.button
                        onClick={() => setIsModalOpen(true)}
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        className="group cursor-pointer relative bg-[#f6851f] hover:to-orange-600 text-white px-12 py-6 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 overflow-hidden"
                    >
                        <span className="relative z-10 flex items-center gap-3">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            Get Instant Offer Now
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </motion.button>

                    {/* Secondary CTA */}
                    <motion.button
                        onClick={() => setAuctionOpen(true)}
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        className="group cursor-pointer relative bg-transparent border-2 border-white/30 hover:border-white text-white px-12 py-6 rounded-2xl font-bold text-xl backdrop-blur-sm hover:bg-white/10 transition-all duration-300 overflow-hidden"
                    >
                        <span className="relative z-10 flex items-center gap-3">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            Start Live Auction
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </motion.button>
                </motion.div>

                {/* Trust Indicators */}
                <motion.div
                    variants={itemVariants}
                    className="mt-16 mb-10 flex flex-wrap justify-center items-center gap-8 text-slate-300"
                >
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>100% Secure</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>No Hidden Fees</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Instant Payment</span>
                    </div>
                </motion.div>
            </motion.div>

            {/* Bottom fade effect */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 to-transparent" />
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Get Instant Offer"
                description="Enter your vehicle details to start the offer process"
            />
            <AuctionModal
                isOpen={auctionOpen}
                onClose={setAuctionOpen}
            />
        </section>
    )
}
