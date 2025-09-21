import React, { useState, useEffect, useCallback } from 'react'
import { Star, Quote, Calendar, User, Building2 } from 'lucide-react'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselPrevious,
    CarouselNext
} from '@/components/ui/carousel'
import Autoplay from 'embla-carousel-autoplay'
import './testimonial.css'

export default function TestimonialCarousel() {
    const [api, setApi] = useState()
    const [current, setCurrent] = useState(0)
    const [count, setCount] = useState(0)

    const testimonials = [
        {
            id: 1,
            name: "Mario G",
            role: "Customer",
            date: "December 6, 2024",
            rating: 5,
            text: "Using Amacar to sell my car eliminated all the usual frustration of multiple stops with multiple dealers while giving me the confidence that I got the best deal before I stepped foot in a dealership. Amacar stands out for its seamless and efficient process among the top websites to sell your car out there. I can't imagine selling my car any other way in the future.",
            image: "https://amacar.ai/wp-content/uploads/2024/12/trust-him-with-your-business-2024-07-16-01-00-21-utc-min.jpg",
            category: "customer"
        },
        {
            id: 2,
            name: "Mark G",
            role: "Dealership",
            date: "December 6, 2024",
            rating: 5,
            text: "You have access to local customers who are willing to sell you their car, let you touch and maybe drive it. In return, you have the opportunity to sell another car to the other client directly.",
            image: "https://amacar.ai/wp-content/uploads/2024/12/close-up-portrait-of-smiling-handsome-business-man-2024-10-18-05-05-50-utc-min-1.jpg",
            category: "dealership"
        },
        {
            id: 3,
            name: "Jason F",
            role: "Customer",
            date: "December 6, 2024",
            rating: 5,
            text: "If you are short on time, go through Amacar. I put in all my information and got my instant cash offer easily – but the best part was the auction. With essentially no effort, I got all the info I needed from dealers while skipping the runaround, set an appointment, and walked in to sell my car for cash, hand in my keys, and sign some quick paperwork. It's never been easier.",
            image: "https://amacar.ai/wp-content/uploads/2024/12/successful-businessman-2023-11-27-05-21-29-utc-min.jpg",
            category: "customer"
        },
        {
            id: 4,
            name: "John D",
            role: "Customer",
            date: "December 6, 2024",
            rating: 5,
            text: "Selling my car through Amacar was effortless. I received competitive offers quickly from one of the most trusted online car selling websites and was able to choose the best one for me.",
            image: "https://amacar.ai/wp-content/uploads/2024/12/stately-bald-man-with-a-full-short-beard-in-a-blac-2023-11-27-05-35-31-utc-min-1.jpg",
            category: "customer"
        },
        {
            id: 5,
            name: "Ali J",
            role: "Dealership",
            date: "December 6, 2024",
            rating: 5,
            text: "We were getting increasingly frustrated by unexpected repair costs on our used cars bought from the online auction we previously used most. Using Amacar has allowed us to benefit from a 'local auction' platform that also allows us to verify condition before finalizing the purchase – now we can know exactly what we are buying with no surprises.",
            image: "https://amacar.ai/wp-content/uploads/2024/12/positive-about-his-new-job-2023-11-27-05-07-30-utc-min-1.jpg",
            category: "dealership"
        },
        {
            id: 6,
            name: "Jennifer K",
            role: "Customer",
            date: "August 24, 2024",
            rating: 5,
            text: "Amacar should be the new normal. I'm a data nerd and being able to see the different offers I got from dealers in real time was amazing. Also, having the ability to only accept the offer I wanted made me feel like I still had the choice to do whatever was best for me and my family with this transaction.",
            image: "https://amacar.ai/wp-content/uploads/2024/08/smile-portrait-and-business-woman-in-studio-isola-2023-11-27-05-01-41-utc-min.jpg",
            category: "customer"
        }
    ]

    useEffect(() => {
        if (!api) return

        setCount(api.scrollSnapList().length)
        setCurrent(api.selectedScrollSnap() + 1)

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap() + 1)
        })
    }, [api])

    const scrollTo = useCallback((index) => {
        api?.scrollTo(index)
    }, [api])

    const getRoleColor = (role) => {
        return role === 'Customer' ? 'text-primary-600 bg-primary-50' : 'text-accent-600 bg-accent-50';
    };

    const getRoleIcon = (role) => {
        return role === 'Customer' ? <User className="w-4 h-4" /> : <Building2 className="w-4 h-4" />;
    };

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`w-4 h-4 ${i < rating ? 'text-warning fill-warning' : 'text-neutral-300'
                    }`}
            />
        ));
    };

    return (
        <section className="py-16 px-4 bg-gradient-to-br from-slate-50 to-white">
            <div className="max-w-6xl mx-auto p-[1rem]">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl lg:text-4xl font-bold text-neutral-800 font-display mb-4">
                        What Our <span className="text-primary-500">Users</span> Say
                    </h2>
                    <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                        Discover why thousands of customers and dealerships trust Amacar
                    </p>
                    <div className="w-20 h-1 bg-primary-500 mx-auto rounded-full mt-4"></div>
                </div>

                {/* Carousel Container */}
                <div className="relative">
                    <Carousel
                        setApi={setApi}
                        opts={{
                            align: "start",
                            loop: true,
                        }}
                        plugins={[
                            Autoplay({
                                delay: 4000,
                                stopOnInteraction: false,
                                stopOnMouseEnter: true,
                            }),
                        ]}
                        className="w-full"
                    >
                        <CarouselContent className="-ml-2 md:-ml-4">
                            {testimonials.map((testimonial, index) => (
                                <CarouselItem
                                    key={testimonial.id}
                                    className="pl-2 md:pl-4 md:basis-1/2"
                                >
                                    <div className="group relative bg-white rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/10 border border-neutral-200 overflow-hidden h-full">
                                        {/* Quote Icon */}
                                        <div className="flex justify-between items-start mb-4">
                                            <Quote className="w-6 h-6 text-primary-200" />
                                            <div className="flex items-center gap-1">
                                                {renderStars(testimonial.rating)}
                                            </div>
                                        </div>

                                        {/* Testimonial Text */}
                                        <p className="text-neutral-700 leading-relaxed mb-6 line-clamp-4 text-sm">
                                            "{testimonial.text}"
                                        </p>

                                        {/* User Info */}
                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                <img
                                                    src={testimonial.image}
                                                    alt={testimonial.name}
                                                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
                                                />
                                                <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center ${testimonial.role === 'Customer' ? 'bg-primary-500' : 'bg-accent-500'
                                                    }`}>
                                                    {getRoleIcon(testimonial.role)}
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-neutral-800 text-sm">{testimonial.name}</h4>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(testimonial.role)}`}>
                                                        {getRoleIcon(testimonial.role)}
                                                        {testimonial.role}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1 text-xs text-neutral-500">
                                                    <Calendar className="w-3 h-3" />
                                                    <span>{testimonial.date}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>

                        {/* Navigation Arrows */}
                        <CarouselPrevious className="absolute left-6 top-1/2 transform -translate-y-1/2 -translate-x-6 bg-white rounded-full p-4 transition-all duration-300 border border-neutral-200 hover:bg-primary-50 hover:border-primary-300 hover:text-primary-600 shadow-lg" />
                        <CarouselNext className="absolute right-6 top-1/2 transform -translate-y-1/2 translate-x-6 bg-white rounded-full p-4 transition-all duration-300 border border-neutral-200 hover:bg-primary-50 hover:border-primary-300 hover:text-primary-600 shadow-lg" />
                    </Carousel>

                    {/* Dots Navigation */}
                    <div className="flex justify-center space-x-2 mt-8">
                        {Array.from({ length: count }, (_, index) => (
                            <button
                                key={index}
                                onClick={() => scrollTo(index)}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${index === current - 1
                                        ? 'bg-primary-500 scale-125'
                                        : 'bg-neutral-300 hover:bg-neutral-400'
                                    }`}
                                aria-label={`Go to testimonial ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}