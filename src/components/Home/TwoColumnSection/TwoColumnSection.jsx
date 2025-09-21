import React from 'react'
import { motion } from 'framer-motion'
import Modal from '@/components/ui/modal'
import { useState } from 'react'
export default function TwoColumnSection() {
    const [isModalOpen, setisModalOpen] = useState(false);
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
            y: 30
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: [0.4, 0, 0.2, 1]
            }
        }
    }

    return (
        <section className="relative py-16 px-4 bg-gradient-to-br from-slate-50 via-white to-orange-50/30 overflow-hidden">
            {/* Modern background elements */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-1/4 w-72 h-72 bg-orange-200/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-200/10 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-orange-100/30 to-blue-100/30 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 max-w-5xl mx-auto">
                <motion.div
                    className="flex justify-center"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                >
                    {/* Modern Card */}
                    <motion.div
                        className="w-full max-w-3xl space-y-8 p-10 lg:p-12 bg-white/80 backdrop-blur-xl rounded-3xl border border-white/20 shadow-md hover:shadow-3xl transition-all duration-500 group"
                        variants={itemVariants}
                    >

                        <div className="text-center space-y-6">
                            <h2 className="text-2xl lg:text-2xl xl:text-4xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent leading-tight">
                                Experience a Smarter, More Rewarding Way to Sell Your Car
                            </h2>
                            <p className="text-xl lg:text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto font-light">
                                Unlock The Best Offers And Streamline Your Selling Process With Just A Few Clicks.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-6">
                            <motion.button
                                onClick={() => setisModalOpen(true)}
                                className="group relative w-full sm:w-auto cursor-pointer bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-10 py-5 rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl overflow-hidden"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    Check Your Selling Options
                                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </motion.button>
                        </div>

                    </motion.div>
                </motion.div>
            </div>
            <Modal
                isOpen={isModalOpen}
                onClose={() => setisModalOpen(false)}
                title="Check Your Selling Options"
                description="Enter your vehicle details to start the offer process"
            />
        </section>
    )
}
