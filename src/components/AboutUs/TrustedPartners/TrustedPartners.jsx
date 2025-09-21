import React from "react"
import { motion } from "framer-motion"
import SectionHeader from "@/components/Home/SectionHeader/SectionHeader.jsx"

export default function TrustedPartners() {
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

    const brands = [
        {
            name: "Toyota",
            logo: "https://upload.wikimedia.org/wikipedia/commons/9/9d/Toyota_carlogo.svg",
            color: "text-neutral-600",
            bgColor: "bg-neutral-50",
            borderColor: "border-neutral-200"
        },
        {
            name: "Tesla",
            logo: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Tesla_Motors.svg",
            color: "text-red-500",
            bgColor: "bg-red-50",
            borderColor: "border-red-200"
        },
        {
            name: "Ford",
            logo: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Ford_logo_flat.svg",
            color: "text-blue-600",
            bgColor: "bg-blue-50",
            borderColor: "border-blue-200"
        },
        {
            name: "BMW",
            logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg",
            color: "text-blue-700",
            bgColor: "bg-blue-50",
            borderColor: "border-blue-200"
        },
        {
            name: "Mercedes-Benz",
            logo: "https://upload.wikimedia.org/wikipedia/commons/9/90/Mercedes-Logo.svg",
            color: "text-neutral-800",
            bgColor: "bg-neutral-50",
            borderColor: "border-neutral-200"
        }
    ];





    return (
        <section className="pb-24 md:pb-24 lg:pb-24 bg-gradient-to-br from-neutral-50 to-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-10 right-20 w-24 h-24 bg-primary-500 rounded-full blur-2xl"></div>
                <div className="absolute bottom-10 left-20 w-32 h-32 bg-blue-500 rounded-full blur-3xl"></div>
            </div>

            <div className="container-custom relative z-10">
                {/* Section Header */}
                <SectionHeader
                    title="Trusted Partners"
                    highlight="Leading Automotive Brands"
                />

                {/* Brands Grid */}
                <div className="mt-16">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={fadeIn}
                        custom={0}
                        className="text-center mb-12"
                    >
                        <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                            We work with the most trusted automotive brands to ensure you get the best value for your vehicle, regardless of make or model.
                        </p>
                    </motion.div>

                    {/* Brands Container */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-8">
                        {brands.map((brand, index) => (
                            <motion.div
                                key={index}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.3 }}
                                variants={scaleIn}
                                custom={index * 0.1}
                                className="group"
                            >
                                {/* Brand Card */}
                                <div className={`${brand.bgColor} ${brand.borderColor} rounded-2xl p-6 lg:p-8 flex justify-center text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-2 `}>
                                    {/* Brand Logo */}
                                    <div className="flex justify-center mb-4 items-center">
                                        <img src={brand.logo} alt={brand.name} className="w-24 h-24" />
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
