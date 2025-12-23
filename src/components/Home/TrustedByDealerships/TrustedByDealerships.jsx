import React from 'react'
import { motion } from 'framer-motion'
import { Shield, CheckCircle, Users, Award } from 'lucide-react'
import './trusted-by-dealerships.css'

export default function TrustedByDealerships() {
    const trustPoints = [
        {
            icon: <Shield className="w-6 h-6" />,
            text: "Verified Dealer Network"
        },
        {
            icon: <CheckCircle className="w-6 h-6" />,
            text: "Built for You"
        },
        {
            icon: <Users className="w-6 h-6" />,
            text: "Customer-Focused"
        },
        {
            icon: <Award className="w-6 h-6" />,
            text: "Trusted Platform"
        }
    ]

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    }

    return (
        <section className="trusted-section">
            <div className="container">
                <motion.div
                    className="trusted-content"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={containerVariants}
                >
                    <motion.div
                        className="trusted-header"
                        variants={itemVariants}
                    >
                        <h2 className="trusted-title">
                            Trusted by Dealerships — <span className="trusted-highlight">Built for You</span>
                        </h2>
                        <p className="trusted-subtitle">
                            This keeps the message customer-centric while still signaling credibility to Google and the user.
                        </p>
                    </motion.div>

                    <div className="trust-points-grid">
                        {trustPoints.map((point, index) => (
                            <motion.div
                                key={index}
                                className="trust-point-card"
                                variants={itemVariants}
                                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                            >
                                <div className="trust-point-icon">
                                    {point.icon}
                                </div>
                                <p className="trust-point-text">{point.text}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

