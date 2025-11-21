import React, { useState } from "react"
import { motion } from "framer-motion"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { setFilters, fetchMockCarsThunk } from "@/features/reverseBidding/redux/reverseBidSlice"
import { Search, Star, Users } from "lucide-react"

// shadcn components
import Modal from "@/components/ui/modal.jsx"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import bgImg from "@/assets/home_page_first_hero(12).jpg"
import "./hero.css"


export default function Hero() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleNewClick = () => {
    const filtersToDispatch = {
      condition: 'new',
      make: null,
      model: null,
      year: null,
      budgetMin: null,
      budgetMax: null,
    }
    dispatch(setFilters(filtersToDispatch))
    dispatch(fetchMockCarsThunk({ filters: filtersToDispatch, page: 1, perPage: 20 }))
    navigate('/reverse-bidding/results')
  }

  const handleUsedClick = () => {
    const filtersToDispatch = {
      condition: 'used',
      make: null,
      model: null,
      year: null,
      budgetMin: null,
      budgetMax: null,
    }
    dispatch(setFilters(filtersToDispatch))
    dispatch(fetchMockCarsThunk({ filters: filtersToDispatch, page: 1, perPage: 20 }))
    navigate('/reverse-bidding/results')
  }


  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (delay = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut", delay },
    }),
  }


  return (
    <section className="hero-section">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgImg})` }}
      />

      {/* Enhanced Dark Overlay with Extended Left-to-Right Gradient */}
      <div 
        className="absolute inset-0 z-[1]"
        // style={{
        //   background: 'linear-gradient(to right, rgba(0,0,0,0.85), rgba(0,0,0,0.60), rgba(0,0,0,0.20))'
        // }}
      />

      {/* Glassmorphic Content Container - Positioned to the Left */}
      <motion.div
        className="relative z-[2] w-full max-w-[900px] px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 md:py-16 mt-[5%] md:ml-[5%] lg:ml-[5%]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="backdrop-blur-sm bg-gradient-to-r from-black/70 via-black/40 to-transparent border border-white/10 rounded-[32px] px-8 sm:px-10 md:px-12 lg:px-16 py-10 sm:py-12 md:py-16 shadow-2xl shadow-black/50">
          {/* Headline */}
          <motion.h1
            className="font-sans text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-[1.1] mb-6 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] tracking-tight"
            variants={fadeUp}
            custom={0}
            style={{ fontWeight: 600 }}
          >
            Sell Your Car in Minutes—Let Dealers Compete for Your Best Price
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            className="text-lg md:text-xl mb-10 text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)] font-normal leading-relaxed max-w-2xl tracking-wide"
            variants={fadeUp}
            custom={0.2}
          >
            Skip the haggling. Post once, get multiple competitive offers instantly.
          </motion.p>

          {/* Search Bar with Floating Animation */}
          <motion.div
            className="mb-8 max-w-2xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            animate={{
              y: [0, -8, 0],
            }}
            transition={{
              opacity: { duration: 0.8, delay: 0.3, ease: "easeOut" },
              y: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.1,
              },
            }}
          >
            <div className="relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400 z-10" />
              <Input
                type="text"
                placeholder="Search make, model, or type"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-auto py-4 px-6 pl-16 pr-6 bg-white/98 backdrop-blur-md border-white/40 text-gray-900 placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-cyan-500/50 focus-visible:border-cyan-400 rounded-2xl shadow-inner text-base font-medium transition-all duration-300 hover:shadow-[0_6px_12px_rgba(0,0,0,0.15)] min-h-[64px]"
              />
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row flex-wrap gap-4 max-w-2xl mb-8"
            variants={fadeUp}
            custom={0.4}
          >
            {/* Secondary Ghost Buttons */}
            <Button
              onClick={handleNewClick}
              variant="outline"
              className="flex-1 min-w-[140px] h-12 bg-transparent hover:bg-white/10 text-white font-semibold rounded-xl border-2 border-white/40 hover:border-white/40 transition-all duration-300 hover:scale-105 hover:shadow-lg backdrop-blur-sm"
            >
              Shop New →
            </Button>

            <Button
              onClick={handleUsedClick}
              variant="outline"
              className="flex-1 min-w-[140px] h-12 bg-transparent hover:bg-white/10 text-white font-semibold rounded-xl border-2 border-white/40 hover:border-white/40 transition-all duration-300 hover:scale-105 hover:shadow-lg backdrop-blur-sm"
            >
              Shop Used →
            </Button>

            {/* Primary CTA Button with Gradient */}
            <Button
              onClick={(e) => {
                e.preventDefault()
                setOpen(true)
              }}
              className="flex-1 min-w-[180px] h-auto px-8 py-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 hover:from-cyan-600 hover:via-blue-600 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/60 text-base"
            >
              Get Instant Offer
            </Button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8 text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]"
            variants={fadeUp}
            custom={0.5}
          >
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]" />
                ))}
              </div>
              <span className="text-base font-medium">4.9/5</span>
              <span className="text-base text-white/90">from 12k reviews</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-6 w-6 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]" />
              <span className="text-base font-medium">Join 50,000+ happy sellers</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Modals */}
      <Modal
        isOpen={open}
        onClose={setOpen}
        title="Get your instant offer"
        description="Enter your car details to start the auction"
        footer={
          <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold">
            Start Auction
          </Button>
        }
      >
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="vin">Vehicle VIN</Label>
            <Input id="vin" placeholder="Enter VIN number" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="zip">Zip Code</Label>
            <Input id="zip" placeholder="Enter Zip Code" />
          </div>
        </div>
      </Modal>
    </section>
  )
}