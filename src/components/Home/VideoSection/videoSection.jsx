import React, { useState } from 'react'
import { motion } from 'framer-motion'
import './videoSection.css'
import vd from '../../../assets/video_amacar.mp4'
import Modal from '@/components/ui/modal';

export default function VideoSection() {

    const [isModalOpen, setIsModalOpen] = useState(false);

    // 🔹 Variants for animation
    const textVariants = {
        hidden: { opacity: 0, x: -50 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
    }

    const videoVariants = {
        hidden: { opacity: 0, x: 50 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut", delay: 0.2 } }
    }

    return (
        <section className="video-section">
            {/* Left Text Section */}
            <motion.div
                className="left-text-section"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={textVariants}
            >
                <p className='left-text-heading title-accent'>
                    Sell Your Car the Smarter Way
                </p>
                <p className='left-text-content'>
                    Skip the hassle of endless listings and lowball offers. With Amacar, dealers compete to buy your car, giving you the best price quickly, securely, and stress-free—cash in hand, without compromise.
                </p>
                <button onClick={() => setIsModalOpen(true)} className='border-2 w-48 border-purple mt-4 px-[1rem] py-[0.6rem] transition ease-in-out 3s bg-[var(--brand-purple)] text-white rounded-md text-bold hover:cursor-pointer hover:bg-white hover:border  hover:border-[var(--brand-purple)] hover:text-[var(--brand-purple)] '>See your car value</button>
            </motion.div>

            {/* Right Video Section */}
            <motion.div
                className="right-video-section"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={videoVariants}
            >
                <video className="video-element" controls loop muted playsInline>
                    <source src={vd} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </motion.div>
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="See your car value"
                description="Enter your vehicle details to start the offer process"
            />
        </section>
    )
}
