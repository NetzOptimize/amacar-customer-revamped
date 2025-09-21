import React, { useEffect, useState, useRef } from 'react'
import './carousel.css'
import img1 from '../../../assets/get_an_instant_offer_for_your_car.jpg'
import img2 from '../../../assets/seize_the_opportunity.jpg'
import img3 from '../../../assets/driving_the_future_of_your_car.jpg'
import AuctionModal from '@/components/ui/AuctionYourRideModal'
import Modal from '@/components/ui/modal'

const slides = [
    {
        heading: 'Get an Instant Offer for Your Car',
        lines: [
            'Fast, Fair, and Hassle-Free – Get Cash for Your Car Today!',
            'If You Think Your Car Is Worth More, try Our Car Auction Online and Let Dealers Bid On Your Ride!',
            'You Simply Accept The Highest Bid!'
        ],
        cta: 'Get Instant Offer',
        image: img1
    },
    {
        heading: 'Seize the Opportunity',
        lines: [
            'Amacar Allows Dealerships To Bid On Your Vehicle, Aiming To Sell It To Their Ready-To-Buy Customers In the Showroom.',
            'This Competitive Bidding Ensures You Receive The Best Offer Possible For Your Car.'
        ],
        cta: 'Get Started Today',
        image: img2
    },
    {
        heading: 'Driving the Future of Car Sales',
        lines: [
            'We are committed to leading the future of car sales by continuously innovating our platform to meet the evolving needs of our customers.',
            'Our vision is to create a world where selling a car is as simple as clicking a button, and every transaction is a win-win for both sellers and dealers.'
        ],
        cta: 'Learn More',
        image: img3
    }
]

export default function Carousel() {
    const [index, setIndex] = useState(0)
    const [direction, setDirection] = useState('next') // 'next' or 'prev'
    const [isHovered, setIsHovered] = useState(false)
    const intervalRef = useRef(null)
    const [auctionOpen, setAuctionOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Permanent autoplay functionality
    useEffect(() => {
        if (!isHovered) {
            intervalRef.current = setInterval(() => {
                setDirection('next')
                setIndex((i) => (i + 1) % slides.length)
            }, 2500) // Change slide every 2.5 seconds
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
                intervalRef.current = null
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
            }
        }
    }, [isHovered])

    function goDelta(delta) {
        setDirection(delta > 0 ? 'next' : 'prev')
        setIndex((i) => (i + delta + slides.length) % slides.length)
    }

    function goIndex(n) {
        // choose direction based on current index
        setDirection(n > index ? 'next' : 'prev')
        setIndex(n)
    }

    function handleMouseEnter() {
        setIsHovered(true)
    }

    function handleMouseLeave() {
        setIsHovered(false)
    }

    return (
        <div className="carousel w-full">
            <div className="max-w-6xl mx-auto px-6 py-12 carousel-outer-div">
                <div
                    className="relative overflow-hidden rounded-lg carousel-inner-div"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    {slides.map((s, i) => (
                        <section
                            key={i}
                            className={`carousel-section slide ${i === index ? `active ${direction === 'next' ? 'from-right' : 'from-left'}` : 'inactive'}`}
                            aria-hidden={i !== index}
                            style={{ ['--slide-bg']: i % 2 === 0 ? '#f8fafc' : '#f1f5f9' }}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-6">
                                <div className={`p-6 md:p-12 slide-copy ${i === index ? 'in' : ''}`}>
                                    <h3 className="slide-heading" style={{ animationDelay: `120ms` }}>{s.heading}</h3>
                                    <div className="mt-4 space-y-3 slide-body">
                                        {s.lines.map((l, idx) => (
                                            <p key={idx} className="slide-line" style={{ animationDelay: `${200 + idx * 100}ms` }}>{l}</p>
                                        ))}
                                    </div>
                                    <div className="mt-6">
                                        {s.cta === 'Get Instant Offer' ? <button onClick={() => setIsModalOpen(true)} className="btn-primary" aria-label={s.cta} style={{ animationDelay: `420ms` }}>{s.cta}</button> : <button onClick={() => setAuctionOpen(true)} className="btn-primary" aria-label={s.cta} style={{ animationDelay: `420ms` }}>{s.cta}</button>}
                                    </div>
                                </div>

                                <div className="p-6 md:p-12 flex justify-center md:justify-end">
                                    <div className="slide-media">
                                        <img src={s.image} alt={s.heading} />
                                    </div>
                                </div>
                            </div>
                        </section>
                    ))}

                    {/* arrows */}
                    <button type="button" className="arrow left" onClick={() => goDelta(-1)} aria-label="Previous slide">
                        <span className="arrow-icon">←</span>
                    </button>
                    <button type="button" className="arrow right" onClick={() => goDelta(1)} aria-label="Next slide">
                        <span className="arrow-icon">→</span>
                    </button>

                    {/* dots */}
                    <div className="dots" role="tablist" aria-label="Carousel pagination">
                        {slides.map((_, i) => (
                            <button type="button" key={i} className={`dot ${i === index ? 'active' : ''}`} onClick={() => goIndex(i)} aria-label={`Go to slide ${i + 1}`} aria-selected={i === index}></button>
                        ))}
                    </div>
                </div>
            </div>
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
        </div>
    )
}
