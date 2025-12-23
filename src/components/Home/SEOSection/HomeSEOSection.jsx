import React from 'react'
import { motion } from 'framer-motion'
import './seo-section.css'

function SEOSection() {
    const seoContent = {
        title: "Sell or Buy a Car Online With Real-Time Offers",
        description: "Amacar is a modern online marketplace where verified dealerships compete for your business. Sellers can list their car and receive real-time bids through our Live Auction system, while buyers can use Reverse Bidding to get the lowest price on new or used cars. With instant car offers, transparent pricing, and a verified dealer network, Amacar helps you sell your car fast or buy a car online at the best possible price."
    }

    return (
        <section className="seo-section">
            <div className="container">
                <motion.div
                    className="seo-content"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="seo-title">{seoContent.title}</h2>
                    <p className="seo-description">{seoContent.description}</p>
                </motion.div>
            </div>
        </section>
    )
}

export default SEOSection
