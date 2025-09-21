import React from "react"
import { motion } from "framer-motion"
import SectionHeader from "@/components/Home/SectionHeader/SectionHeader.jsx"

export default function OurValues() {
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

    const values = [
        {
            title: "Professionalism",
            description: "We uphold the highest standards of professionalism in every transaction.",
            icon: "🎯",
            gradient: "from-blue-500 to-blue-600",
            bgGradient: "from-blue-50 to-blue-100"
        },
        {
            title: "Maximized Value",
            description: "We uphold the highest value in the market from instant cash offer to auctioning your car.",
            icon: "💎",
            gradient: "from-emerald-500 to-emerald-600",
            bgGradient: "from-emerald-50 to-emerald-100"
        },
        {
            title: "Security",
            description: "Your privacy and security are paramount to us. We handle your information with the utmost confidentiality at online Auction.",
            icon: "🔒",
            gradient: "from-purple-500 to-purple-600",
            bgGradient: "from-purple-50 to-purple-100"
        },
        {
            title: "Efficiency",
            description: "Our streamlined online platform saves you time and effort, making selling your car effortless",
            icon: "⚡",
            gradient: "from-orange-500 to-orange-600",
            bgGradient: "from-orange-50 to-orange-100"
        }
    ]

    return (
        <section className="pb-16 md:pb-24 lg:pb-24 bg-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-20 left-10 w-32 h-32 bg-primary-500 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-500 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-purple-500 rounded-full blur-2xl transform -translate-x-1/2 -translate-y-1/2"></div>
            </div>

            <div className="container-custom relative z-10">
                {/* Section Header */}
                <SectionHeader
                    title="Our Core Values"
                    highlight="What Drives Us Forward"
                />

                {/* Values Grid */}
                <div className="mt-20">
                    <div className="grid md:grid-cols-2 gap-4 lg:gap-4">
                        {values.map((value, index) => (
                            <motion.div
                                key={index}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.3 }}
                                variants={index % 2 === 0 ? slideInLeft : slideInRight}
                                custom={index * 0.2}
                                className="group"
                            >
                                <div className="relative">
                                    {/* Main Content Container */}
                                    <div className={`bg-gradient-to-br ${value.bgGradient} rounded-3xl p-8 lg:p-10 relative overflow-hidden group-hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2 h-68`}>
                                        {/* Background Decoration */}
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
                                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-white/10 to-transparent rounded-full translate-y-12 -translate-x-12"></div>

                                        {/* Content */}
                                        <div className="relative z-10">
                                            {/* Icon and Title Row */}
                                            <div className="flex items-start gap-6 mb-6">
                                                {/* Icon Container */}
                                                <div className={`w-16 h-16 bg-gradient-to-r ${value.gradient} rounded-2xl flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                                    {value.icon}
                                                </div>

                                                {/* Title */}
                                                <div className="flex-1">
                                                    <h3 className="text-2xl lg:text-3xl font-bold text-neutral-900 mb-3 group-hover:text-primary-600 transition-colors duration-300">
                                                        {value.title}
                                                    </h3>
                                                </div>
                                            </div>

                                            {/* Description */}
                                            <p className="text-lg text-neutral-700 leading-relaxed group-hover:text-neutral-800 transition-colors duration-300">
                                                {value.description}
                                            </p>

                                            {/* Decorative Line */}
                                            <div className={`mt-6 w-16 h-1 bg-gradient-to-r ${value.gradient} rounded-full group-hover:w-24 transition-all duration-300`}></div>
                                        </div>

                                        {/* Hover Effect Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"></div>
                                    </div>

                                    {/* Floating Number */}
                                    <div className={`absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r ${value.gradient} rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                        {String(index + 1).padStart(2, '0')}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
