import React from "react"
import { motion } from "framer-motion"
import SectionHeader from "@/components/Home/SectionHeader/SectionHeader.jsx"

export default function WhyTrustAmacar() {
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

    const stats = [
        {
            number: "95%",
            description: "of cars sell at or above market value",
            icon: "📈",
            color: "from-green-500 to-green-600",
            bgColor: "bg-green-50",
            borderColor: "border-green-200"
        },
        {
            number: "3 days",
            description: "Most sales close within 3 days",
            icon: "⏰",
            color: "from-blue-500 to-blue-600",
            bgColor: "bg-blue-50",
            borderColor: "border-blue-200"
        },
        {
            number: "10 hours",
            description: "Top offers often received in first 10 hours",
            icon: "⚡",
            color: "from-orange-500 to-orange-600",
            bgColor: "bg-orange-50",
            borderColor: "border-orange-200"
        }
    ]

    return (
        <section className="pb-24 md:pb-24 lg:pb-24 bg-gradient-to-br from-neutral-50 to-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-10 right-20 w-32 h-32 bg-primary-500 rounded-full blur-2xl"></div>
                <div className="absolute bottom-10 left-20 w-40 h-40 bg-green-500 rounded-full blur-3xl"></div>
            </div>

            <div className="container-custom relative z-10">
                {/* Section Header */}
                <SectionHeader
                    title="Why Trust Amacar?"
                    highlight="Proven Results"
                />

                {/* Stats Grid */}
                <div className="mt-16">
                    <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.3 }}
                                variants={scaleIn}
                                custom={index * 0.2}
                                className="group"
                            >
                                {/* Stat Card */}
                                <div className={`${stat.bgColor} ${stat.borderColor} border-2 rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-2 group-hover:border-primary-300 h-72`}>
                                    {/* Icon */}
                                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                                        {stat.icon}
                                    </div>

                                    {/* Number */}
                                    <div className={`text-4xl lg:text-5xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-4`}>
                                        {stat.number}
                                    </div>

                                    {/* Description */}
                                    <p className="text-lg text-neutral-700 leading-relaxed group-hover:text-neutral-800 transition-colors duration-300">
                                        {stat.description}
                                    </p>

                                    {/* Decorative Line */}
                                    <div className={`mt-6 w-16 h-1 bg-gradient-to-r ${stat.color} rounded-full mx-auto group-hover:w-24 transition-all duration-300`}></div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    )
}
