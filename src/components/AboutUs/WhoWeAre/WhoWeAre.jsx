import React from "react"
import { motion } from "framer-motion"
import SectionHeader from "@/components/Home/SectionHeader/SectionHeader.jsx"
import whoWeAreImg from "../../../assets/who_we_are_about_us.jpg"
import ourMissionImg from "../../../assets/our_mission_about_us.jpg"

export default function WhoWeAre() {
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

    const commitmentItems = [
        "Providing transparent and fair evaluations",
        "Delivering smooth process throughout the selling process by participating dealers",
        "Continuously improving our platform to meet the evolving needs of our customers"
    ]

    const missionValues = [
        {
            title: "Maximize Value",
            description: "Empowering sellers to get the best offer possible.",
            icon: "💰"
        },
        {
            title: "Seamless Experience",
            description: "Simplifying the car-selling process from start to finish.",
            icon: "⚡"
        },
        {
            title: "Live Auction",
            description: "Creating an advanced online auction platform that enables customers to list their vehicles for auction and attract competitive bids from participating dealerships to ensure the best market offers.",
            icon: "🔨"
        }
    ]

    return (
        <section className="pb-16 md:pb-24 lg:pb-24 bg-white">
            <div className="container-custom">
                {/* Section Header */}
                <SectionHeader
                    title="Who We Are"
                    highlight="Your Trusted Partner"
                />

                {/* Who We Are Section */}
                <div className="mt-20">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        {/* Image */}
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.3 }}
                            variants={slideInLeft}
                            custom={0}
                            className="relative"
                        >
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                                <img
                                    src={whoWeAreImg}
                                    alt="Who We Are - Amacar Team"
                                    className="w-full h-[500px] object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                            </div>
                            {/* Decorative element */}
                            <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary-500 rounded-full opacity-20"></div>
                            <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-primary-300 rounded-full opacity-30"></div>
                        </motion.div>

                        {/* Content */}
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.3 }}
                            variants={slideInRight}
                            custom={0.2}
                            className="space-y-8"
                        >
                            <div className="space-y-6">
                                <h3 className="text-4xl md:text-5xl font-bold text-neutral-900 leading-tight">
                                    Welcome to <span className="text-primary-500">Amacar</span>
                                </h3>
                                <p className="text-xl text-neutral-700 leading-relaxed">
                                    Your trusted partner in modernizing the car-selling process. At Amacar, we are committed to redefining how individuals sell their vehicles with professionalism and efficiency.
                                </p>
                            </div>

                            {/* Our Commitment */}
                            <div className="bg-gradient-to-br from-neutral-50 to-white rounded-2xl p-8 shadow-soft border border-neutral-100">
                                <h4 className="text-2xl font-bold text-neutral-900 mb-8 flex items-center gap-3">
                                    <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                                    Our Commitment
                                </h4>
                                <ul className="space-y-6">
                                    {commitmentItems.map((item, index) => (
                                        <motion.li
                                            key={index}
                                            variants={fadeUp}
                                            custom={0.4 + index * 0.1}
                                            className="flex items-start gap-4"
                                        >
                                            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                                <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                                            </div>
                                            <span className="text-lg text-neutral-700 leading-relaxed">{item}</span>
                                        </motion.li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Our Mission Section */}
                <div className="mt-32">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        {/* Content */}
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.3 }}
                            variants={slideInLeft}
                            custom={0}
                            className="space-y-8"
                        >
                            <div className="space-y-6">
                                <h3 className="text-4xl md:text-5xl font-bold text-neutral-900 leading-tight">
                                    Our <span className="text-primary-500">Mission</span>
                                </h3>
                                <p className="text-xl text-neutral-700 leading-relaxed">
                                    Our mission at Amacar is to provide a seamless and transparent platform that empowers car sellers to achieve the highest value for their vehicles. By leveraging cutting-edge technology and a network of reputable dealerships, we ensure a rewarding selling experience for every customer.
                                </p>
                            </div>

                            {/* Mission Values Grid */}
                            <div className="grid gap-6">
                                {missionValues.map((value, index) => (
                                    <motion.div
                                        key={index}
                                        variants={fadeUp}
                                        custom={0.2 + index * 0.1}
                                        className="bg-gradient-to-r from-primary-50 to-white rounded-xl p-6 shadow-soft border border-primary-100 hover:shadow-medium transition-all duration-300 hover:-translate-y-1"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="w-14 h-14 bg-primary-500 rounded-xl flex items-center justify-center text-2xl text-white flex-shrink-0">
                                                {value.icon}
                                            </div>
                                            <div className="flex-1">
                                                <h5 className="text-xl font-bold text-neutral-900 mb-3">
                                                    {value.title}
                                                </h5>
                                                <p className="text-neutral-600 leading-relaxed">
                                                    {value.description}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Image */}
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.3 }}
                            variants={slideInRight}
                            custom={0.2}
                            className="relative"
                        >
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                                <img
                                    src={ourMissionImg}
                                    alt="Our Mission - Amacar Technology"
                                    className="w-full h-[500px] object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                            </div>
                            {/* Decorative element */}
                            <div className="absolute -top-6 -left-6 w-24 h-24 bg-primary-500 rounded-full opacity-20"></div>
                            <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-primary-300 rounded-full opacity-30"></div>
                        </motion.div>
                    </div>
                </div>


            </div>
        </section>
    )
}
