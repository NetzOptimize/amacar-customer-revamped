import React from "react"
import { motion } from "framer-motion"
import { useState } from "react"
import Modal from '@/components/ui/modal'
export default function ReadyToGetStarted() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const fadeUp = {
        hidden: { opacity: 0, y: 30 },
        visible: (delay = 0) => ({
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "easeOut", delay },
        }),
    }


    return (
        <section className="pb-16 md:pb-24 lg:pb-24 bg-gradient-to-r from-primary-500 to-primary-600 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>
                <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-white/5 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
            </div>

            <div className="container-custom pt-12 relative z-10">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={fadeUp}
                    custom={0}
                    className="text-center text-white"
                >
                    {/* Main Content */}
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                        Ready to Get Started?
                    </h2>

                    <p className="text-lg md:text-xl text-primary-50 mb-10 max-w-3xl mx-auto leading-relaxed">
                        Join thousands of satisfied sellers who have found the best offers for their vehicles through Amacar's transparent auction platform.
                    </p>

                    {/* CTA Button */}
                    <div className="flex justify-center">
                        <button onClick={() => setIsModalOpen(true)} className="btn-primary bg-white text-primary-600 hover:bg-neutral-50 px-10 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                            Get instant offer
                        </button>
                    </div>
                </motion.div>
            </div>
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Get Instant Offer"
                description="Enter your vehicle details to start the offer process"
            />
        </section>
    )
}
