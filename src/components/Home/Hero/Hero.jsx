import React, { useState, useCallback, useRef } from "react"
import { motion } from "framer-motion"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { setFilters, fetchMockCarsThunk } from "@/features/reverseBidding/redux/reverseBidSlice"
import { Search, Loader2 } from "lucide-react"
import api from "@/lib/api"
import { extractVehicleParams } from "@/services/openaiService"
import SearchResultsDropdown from "./SearchResultsDropdown"
import bannerPlaceholder from "@/assets/banner-placeholder.png"

// shadcn components
import Modal from "@/components/ui/modal.jsx"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
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
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const searchContainerRef = useRef(null)
  const videoRef = useRef(null)

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
      // Check if click is inside search container
      const isInsideSearchContainer = searchContainerRef.current && searchContainerRef.current.contains(event.target)
      
      // Check if click is inside the dropdown (by checking for the dropdown class)
      const isInsideDropdown = event.target.closest('.search-results-dropdown')
      
      // Only close if click is outside both the search container and the dropdown
      if (!isInsideSearchContainer && !isInsideDropdown) {
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


  // Handle video loaded event
  const handleVideoLoaded = () => {
    setIsVideoLoaded(true)
  }

  return (
    <section className="hero-banner">
      {/* Placeholder Image - shown until video is loaded */}
      <img
        src={bannerPlaceholder}
        alt="Hero banner placeholder"
        className={`hero-placeholder ${isVideoLoaded ? 'hero-placeholder-hidden' : ''}`}
      />

      {/* Video Background */}
      <video
        ref={videoRef}
        className={`hero-video ${isVideoLoaded ? 'hero-video-loaded' : 'hero-video-loading'}`}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onLoadedData={handleVideoLoaded}
        onCanPlay={handleVideoLoaded}
      >
        <source
          src="https://dealer.amacar.ai/wp-content/uploads/2025/12/6537414-uhd_3840_2160_30fps.mp4"
          type="video/mp4"
        />
      </video>

      {/* Dark Overlay */}
      <div className="hero-overlay" />

      {/* Content Container - Centered */}
      <div className="hero-content">
          {/* Headline */}
          <motion.h1
          className="hero-headline"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
          Sell or Buy Your Car in Minutes — Let Dealers Compete for You
          </motion.h1>

          {/* Subheadline */}
          <motion.p
          className="hero-subheadline"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        >
          Whether you're selling your car or shopping for a new or used one, Amacar brings dealerships into a competitive marketplace—so you always win.
          </motion.p>

        {/* Search Bar Container */}
          <motion.div
          className="search-container"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
          >
          <div className="search-wrapper" ref={searchContainerRef}>
            <Search className="search-icon" />
            <input
                type="text"
              placeholder="Search by make, model, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={handleSearchFocus}
                onKeyDown={handleSearchKeyDown}
              className="search-input"
              />
                {isSearching ? (
              <Loader2 className="search-button-icon animate-spin" />
                ) : (
                  <button
                    onClick={handleSearchClick}
                    disabled={searchQuery.trim().length < 2}
                className="search-button"
                    aria-label="Search"
                  >
                →
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
          </motion.div>

          {/* Action Buttons */}
          <motion.div
          className="action-buttons"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
        >
          <button
              onClick={handleNewClick}
            className="btn-secondary"
            >
              Shop New →
          </button>
          <button
              onClick={handleUsedClick}
            className="btn-secondary"
            >
              Shop Used →
          </button>
          <button
              onClick={(e) => {
                e.preventDefault()
                setOpen(true)
              }}
            className="btn-primary"
            >
              Auction Your Ride →
          </button>
          </motion.div>
        </div>

      {/* Modals */}
      <Modal
        isOpen={open}
        onClose={setOpen}
        title="Get your instant offer"
        description="Enter your car details to start the auction"
        footer={
          <Button className="w-full bg-[#f6851f] hover:bg-[#e6750f] text-white font-medium">
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