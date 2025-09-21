import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, Calendar, User, Building2, Filter, Plus } from 'lucide-react';
import Seo from '@/components/SEO/Seo'
import { seoData } from '@/config/seoConfig'

const Testimonials = () => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [displayedCount, setDisplayedCount] = useState(6);
    const [hoveredCard, setHoveredCard] = useState(null);

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
        },
        {
            id: 7,
            name: "Maya A",
            role: "Dealership",
            date: "June 23, 2024",
            rating: 5,
            text: "Partnering with Amacar has expanded our inventory options significantly. Their process has streamlined our operations by providing a reliable and significant source of new inventory that allows us to buy only the cars we really want or need.",
            image: "https://amacar.ai/wp-content/uploads/2024/06/happy-young-woman-with-tow-colored-hair-2023-11-27-05-31-24-utc-min.jpg",
            category: "dealership"
        },
        {
            id: 8,
            name: "Sam R",
            role: "Dealership",
            date: "May 23, 2024",
            rating: 5,
            text: "Amacar is a fantastic way to gain access to a diverse range of vehicles sourced directly from motivated sellers in the state. This platform ensures we have a steady inventory of high-quality, fresh units and that has been a game-changer.",
            image: "https://amacar.ai/wp-content/uploads/2024/05/smile-portrait-and-woman-in-studio-with-fashion-2023-11-27-05-08-29-utc-min.jpg",
            category: "dealership"
        },
        {
            id: 9,
            name: "Richard W",
            role: "Customer",
            date: "April 24, 2024",
            rating: 5,
            text: "I've had a hard time trusting dealerships about whether or not they're telling the truth about the pricing they are giving me or what my car is worth without doubling checking with several others. Now Amacar does that for me – I can trust I am getting the best number on my car and know that I'm not accidentally losing hundreds or thousands by not doing my due diligence.",
            image: "https://amacar.ai/wp-content/uploads/2024/04/close-up-portrait-of-handsome-middle-aged-business-2024-11-17-08-41-35-utc-min.jpg",
            category: "customer"
        },
        {
            id: 10,
            name: "James T",
            role: "Dealership",
            date: "March 23, 2024",
            rating: 5,
            text: "Circumventing traditional auctions to source the bulk of our used car inventory has saved us thousands in fees. We had high hopes with using Amacar and our experience has exceeded expectations.",
            image: "https://amacar.ai/wp-content/uploads/2024/03/portrait-of-a-handsome-young-businessman-standing-2023-11-27-05-05-51-utc-min.jpg",
            category: "dealership"
        },
        {
            id: 11,
            name: "Emily C",
            role: "Customer",
            date: "March 23, 2024",
            rating: 5,
            text: "The Amacar platform is straightforward and secure. I got the best offer by appraising my car and I appreciate the transparency throughout the entire selling process.",
            image: "https://amacar.ai/wp-content/uploads/2024/03/png-asian-girl-in-business-suit-isolated-on-white-2024-04-22-21-31-56-utc-min.jpg",
            category: "customer"
        }
    ];

    const categories = [
        { value: 'all', label: 'All Testimonials', count: testimonials.length },
        { value: 'customer', label: 'Customers', count: testimonials.filter(t => t.category === 'customer').length },
        { value: 'dealership', label: 'Dealerships', count: testimonials.filter(t => t.category === 'dealership').length }
    ];

    const filteredTestimonials = selectedCategory === 'all'
        ? testimonials
        : testimonials.filter(t => t.category === selectedCategory);

    const displayedTestimonials = filteredTestimonials.slice(0, displayedCount);
    const hasMoreTestimonials = displayedCount < filteredTestimonials.length;

    // Reset displayed count when category changes
    useEffect(() => {
        setDisplayedCount(6);
    }, [selectedCategory]);

    const loadMoreTestimonials = () => {
        setDisplayedCount(prev => Math.min(prev + 6, filteredTestimonials.length));
    };

    // Animation for newly loaded items
    const newItemVariants = {
        hidden: { opacity: 0, y: 20, scale: 0.9 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { duration: 0.5, ease: "easeOut" },
        },
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" },
        },
    };

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
        <>
            <Seo title={seoData.testimonials.title} description={seoData.testimonials.description} />
            <div className="min-h-screen bg-gradient-hero mt-12">
                <div className="max-w-8xl mx-auto px-8 py-16">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <h1 className="text-4xl font-bold text-neutral-800 font-display mb-4">
                            What Our Users Say
                        </h1>
                        <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
                            Discover why thousands of customers and dealerships trust Amacar for their vehicle transactions
                        </p>
                    </motion.div>

                    {/* Filter Tabs */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex flex-wrap justify-center gap-4 mb-12"
                    >
                        {categories.map((category) => (
                            <button
                                key={category.value}
                                onClick={() => setSelectedCategory(category.value)}
                                className={`cursor-pointer px-6 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${selectedCategory === category.value
                                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                                    : 'bg-white text-neutral-600 hover:bg-primary-50 hover:text-primary-600 border border-neutral-200'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <Filter className="w-4 h-4" />
                                    <span>{category.label}</span>
                                    <span className={`px-2 py-1 rounded-full text-xs ${selectedCategory === category.value
                                        ? 'bg-white/20 text-white'
                                        : 'bg-primary-100 text-primary-600'
                                        }`}>
                                        {category.count}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </motion.div>

                    {/* Testimonials Grid */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
                    >
                        <AnimatePresence mode="popLayout">
                            {displayedTestimonials.length > 0 ? displayedTestimonials.map((testimonial, index) => (
                                <motion.div
                                    key={testimonial.id}
                                    variants={index < 6 ? itemVariants : newItemVariants}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3 }}
                                    className="group"
                                    onMouseEnter={() => setHoveredCard(testimonial.id)}
                                    onMouseLeave={() => setHoveredCard(null)}
                                >
                                    <div className={`card p-6 h-full transition-all duration-300 ${hoveredCard === testimonial.id
                                        ? 'transform -translate-y-2 shadow-xl shadow-primary-500/10'
                                        : 'hover:shadow-lg'
                                        }`}>
                                        {/* Quote Icon */}
                                        <div className="flex justify-between items-start mb-4">
                                            <Quote className="w-8 h-8 text-primary-200" />
                                            <div className="flex items-center gap-1">
                                                {renderStars(testimonial.rating)}
                                            </div>
                                        </div>

                                        {/* Testimonial Text */}
                                        <p className="text-neutral-700 leading-relaxed mb-6 line-clamp-4">
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
                                                <h4 className="font-semibold text-neutral-800">{testimonial.name}</h4>
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
                                </motion.div>
                            )) : (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="col-span-full text-center py-12"
                                >
                                    <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Quote className="w-8 h-8 text-neutral-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-neutral-600 mb-2">No testimonials found</h3>
                                    <p className="text-neutral-500">Try selecting a different category to see more testimonials.</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* Load More Button */}
                    {hasMoreTestimonials && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="flex justify-center mb-12"
                        >
                            <button
                                onClick={loadMoreTestimonials}
                                className="cursor-pointer group px-8 py-4 bg-primary-500 text-white rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 hover:bg-primary-600 shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30 flex items-center gap-3"
                            >
                                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                                <span>Load More Testimonials</span>
                                <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                                    {filteredTestimonials.length - displayedCount} more
                                </span>
                            </button>
                        </motion.div>
                    )}

                    {/* Stats Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
                    >
                        <div className="text-center p-6 bg-white rounded-2xl shadow-soft">
                            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Star className="w-8 h-8 text-primary-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-neutral-800 mb-2">4.9/5</h3>
                            <p className="text-neutral-600">Average Rating</p>
                        </div>
                        <div className="text-center p-6 bg-white rounded-2xl shadow-soft">
                            <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <User className="w-8 h-8 text-accent-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-neutral-800 mb-2">10,000+</h3>
                            <p className="text-neutral-600">Happy Customers</p>
                        </div>
                        <div className="text-center p-6 bg-white rounded-2xl shadow-soft">
                            <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Building2 className="w-8 h-8 text-success-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-neutral-800 mb-2">500+</h3>
                            <p className="text-neutral-600">Partner Dealerships</p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </>
    );
};

export default Testimonials;
