import React, { useState, useCallback, useRef } from "react"
import { motion } from "framer-motion"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { setFilters, fetchMockCarsThunk } from "@/features/reverseBidding/redux/reverseBidSlice"
import { Search, Loader2 } from "lucide-react"
import api from "@/lib/api"
import { extractVehicleParams } from "@/services/openaiService"
import SearchResultsDropdown from "./SearchResultsDropdown"

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
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [extractedParams, setExtractedParams] = useState({})
  const [showDropdown, setShowDropdown] = useState(false)
  const searchContainerRef = useRef(null)

  // Fast search: Extract params on frontend, then call simple search API
  const performFastSearch = useCallback(async (query) => {
    if (!query || query.trim().length < 2) {
      setSearchResults([])
      setExtractedParams({})
      setShowDropdown(false)
      return
    }

    setIsSearching(true)
    setShowDropdown(true)

    try {
      // Step 1: Extract parameters using OpenAI on frontend
      const params = await extractVehicleParams(query.trim())
      setExtractedParams(params)

      // Step 2: Call simple search API with extracted parameters
      const baseURL = import.meta.env.VITE_BASE_URL || ''
      let apiEndpoint
      
      if (baseURL.includes('wp-json')) {
        apiEndpoint = baseURL.includes('car-dealer') 
          ? `${baseURL.replace(/\/$/, '')}/vehicle/search`
          : `${baseURL.replace(/\/$/, '')}/car-dealer/v1/vehicle/search`
      } else {
        const cleanBase = baseURL.replace(/\/$/, '')
        apiEndpoint = `${cleanBase}/wp-json/car-dealer/v1/vehicle/search`
      }

      const response = await api.post(apiEndpoint, {
        ...params,
        limit: 10
      })

      if (response.data && response.data.success) {
        setSearchResults(response.data.vehicles || [])
      } else {
        setSearchResults([])
      }
    } catch (error) {
      console.error('Search Error:', error)
      setSearchResults([])
      setExtractedParams({})
      // Silently fail - don't show error to user
    } finally {
      setIsSearching(false)
    }
  }, [])

  // Handle click outside to close dropdown
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Handle search input focus - show dropdown if we have previous results
  const handleSearchFocus = () => {
    if (searchResults.length > 0) {
      setShowDropdown(true)
    }
  }

  // Handle Enter key in search
  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter' && searchQuery.trim().length >= 2) {
      e.preventDefault()
      performFastSearch(searchQuery)
    }
  }

  // Handle search icon click
  const handleSearchClick = () => {
    if (searchQuery.trim().length >= 2) {
      performFastSearch(searchQuery)
    }
  }

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
      {/* Background Image - Optimized for LCP with fetchpriority */}
      {/* Using img tag instead of background-image for better LCP optimization */}
      <img
        src={bgImg}
        alt="Amacar - Sell or Buy Your Car"
        className="absolute inset-0 w-full h-full object-cover object-center"
        loading="eager"
        fetchPriority="high"
        decoding="async"
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
        className="relative z-[100] w-full max-w-[900px] px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 md:py-16 mt-[5%] md:ml-[5%] lg:ml-[5%]"
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
            Sell or Buy Your Car in Minutes — Let Dealers Compete for You
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            className="text-lg md:text-xl mb-10 text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)] font-normal leading-relaxed max-w-2xl tracking-wide"
            variants={fadeUp}
            custom={0.2}
          >
            Whether you're selling your car or shopping for a new or used one, Amacar brings dealerships into a competitive marketplace—so you always win.
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
            <div className="relative z-[100]" ref={searchContainerRef}>
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400 z-10" />
              <Input
                type="text"
                placeholder="Search make, model, or type (e.g., '2025 Mazda, Honda under $25000')"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={handleSearchFocus}
                onKeyDown={handleSearchKeyDown}
                className="w-full h-auto py-4 px-6 pl-16 pr-16 bg-white/98 backdrop-blur-md border-white/40 text-gray-900 placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-cyan-500/50 focus-visible:border-cyan-400 rounded-2xl shadow-inner text-base font-medium transition-all duration-300 hover:shadow-[0_6px_12px_rgba(0,0,0,0.15)] min-h-[64px]"
              />
              
              {/* Search Icon Button / Loading Spinner */}
              <div className="absolute right-6 top-1/2 -translate-y-1/2 z-10">
                {isSearching ? (
                  <Loader2 className="h-5 w-5 text-cyan-500 animate-spin" />
                ) : (
                  <button
                    onClick={handleSearchClick}
                    disabled={searchQuery.trim().length < 2}
                    className="p-1.5 rounded-lg transition-all duration-200 hover:bg-cyan-500/10 disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="Search"
                  >
                    <Search className="h-5 w-5 text-cyan-500 hover:text-cyan-600 transition-colors" />
                  </button>
                )}
              </div>
              
              {/* Search Results Dropdown */}
              <SearchResultsDropdown
                isOpen={showDropdown}
                vehicles={searchResults}
                isLoading={isSearching}
                extractedParams={extractedParams}
                onClose={() => setShowDropdown(false)}
              />
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row flex-wrap gap-4 max-w-2xl mb-8"
            variants={fadeUp}
            custom={0.4}
          >
            {/* Shop New Button */}
            <Button
              onClick={handleNewClick}
              variant="outline"
              className="flex-1 min-w-[140px] h-12 bg-transparent hover:bg-white/10 text-white font-semibold rounded-xl border-2 border-white/40 hover:border-white/40 transition-all duration-300 hover:scale-105 hover:shadow-lg backdrop-blur-sm"
            >
              Shop New →
            </Button>

            {/* Shop Used Button */}
            <Button
              onClick={handleUsedClick}
              variant="outline"
              className="flex-1 min-w-[140px] h-12 bg-transparent hover:bg-white/10 text-white font-semibold rounded-xl border-2 border-white/40 hover:border-white/40 transition-all duration-300 hover:scale-105 hover:shadow-lg backdrop-blur-sm"
            >
              Shop Used →
            </Button>

            {/* Auction Your Ride Button */}
            <Button
              onClick={(e) => {
                e.preventDefault()
                setOpen(true)
              }}
              className="flex-1 min-w-[180px] h-auto px-8 py-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 hover:from-cyan-600 hover:via-blue-600 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/60 text-base"
            >
              Auction Your Ride →
            </Button>
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