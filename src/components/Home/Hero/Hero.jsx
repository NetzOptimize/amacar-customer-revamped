import React, { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { setFilters, fetchMockCarsThunk, fetchFiltersThunk } from "@/features/reverseBidding/redux/reverseBidSlice"

// shadcn components
import Modal from "@/components/ui/modal.jsx"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs"
import AuctionModal from "@/components/ui/AuctionYourRideModal"
import LoginModal from "@/components/ui/LoginModal"
import bgImg from "@/assets/home_page_first_hero(12).jpg"
import "./hero.css"


export default function Hero() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [open, setOpen] = useState(false)
  const [auctionOpen, setAuctionOpen] = useState(false)
  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [searchType, setSearchType] = useState('new')

  const { user } = useSelector((state) => state.user)
  const { filters, filterOptions } = useSelector((s) => s.reverseBid)

  const [local, setLocal] = useState({
    make: filters.make || '',
    model: filters.model || '',
    year: filters.year || '',
    budgetMin: filters.budgetMin ? String(filters.budgetMin) : '',
    budgetMax: filters.budgetMax ? String(filters.budgetMax) : '',
  })

  // Fetch filters on mount
  useEffect(() => {
    if (Object.keys(filterOptions.makes).length === 0 && !filterOptions.loading) {
      dispatch(fetchFiltersThunk())
    }
  }, [dispatch, filterOptions.makes, filterOptions.loading])

  const makes = useMemo(() => {
    return Object.keys(filterOptions.makes || {}).sort()
  }, [filterOptions.makes])

  const years = useMemo(() => {
    return (filterOptions.years || []).map(y => String(y)).sort((a, b) => Number(b) - Number(a))
  }, [filterOptions.years])

  const modelsForSelectedMake = useMemo(() => {
    if (!local.make || !filterOptions.makes) return []
    return filterOptions.makes[local.make] || []
  }, [local.make, filterOptions.makes])

  const handleSearch = async () => {
    setIsSearching(true)
    try {
      const filtersToDispatch = {
        make: local.make || null,
        model: local.model || null,
        year: local.year || null,
        budgetMin: local.budgetMin ? Number(local.budgetMin) : null,
        budgetMax: local.budgetMax ? Number(local.budgetMax) : null,
        searchType, // 'new' or 'old' from tabs
      }
      dispatch(setFilters(filtersToDispatch))
      dispatch(fetchMockCarsThunk({ filters: filtersToDispatch, page: 1, perPage: 20 }))
      navigate('/reverse-bidding/results')
    } finally {
      setTimeout(() => setIsSearching(false), 300)
    }
  }

  const handleLoginClick = (e) => {
    e.preventDefault()
    setLoginModalOpen(true)
  }

  const handleForgotPassword = () => {
    console.log("Open forgot password modal")
  }

  const handleRegister = () => {
    console.log("Open register modal")
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

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/10 z-[1]" />

      {/* Content Container */}
      <motion.div
        className="relative z-[2] w-full max-w-[1000px] px-5 mt-[5%] md:ml-[7.5%]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        {/* Headline */}
        <motion.h1
          className="text-[clamp(2rem,5vw,3.5rem)] font-extrabold leading-tight mb-4 drop-shadow-[0_6px_20px_rgba(0,0,0,0.6)]"
          variants={fadeUp}
          custom={0}
        >
          Post Your Car. Dealers Compete Live. You Get Cash.
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          className="text-lg mb-8 text-white/90 drop-shadow-[0_4px_14px_rgba(0,0,0,0.4)]"
          variants={fadeUp}
          custom={0.2}
        >
          Get top offers on your used car in minutes—without the usual hassle.
        </motion.p>

        {/* Search Card with Glassmorphism */}
        <motion.div
          className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-4 md:p-6 shadow-2xl mb-6 max-w-xl"
          variants={fadeUp}
          custom={0.3}
        >
          <Tabs value={searchType} onValueChange={setSearchType} className="w-full">
            {/* Tabs for New/Old */}
            {/* <TabsList className="h-12 grid w-full grid-cols-2 mb-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-1 transition-all duration-300 ease-in-out">
              <TabsTrigger
                value="new"
                className="data-[state=active]:bg-white data-[state=active]:text-[var(--brand-orange)] text-white/90 data-[state=active]:shadow-lg transition-all duration-300 ease-in-out hover:bg-white/20 hover:text-white rounded-md relative overflow-hidden data-[state=active]:transform data-[state=active]:scale-[0.98] hover:scale-[1.02] active:scale-[0.96]"
              >
                New
              </TabsTrigger>
              <TabsTrigger
                value="old"
                className="data-[state=active]:bg-white data-[state=active]:text-[var(--brand-orange)] text-white/90 data-[state=active]:shadow-lg transition-all duration-300 ease-in-out hover:bg-white/20 hover:text-white rounded-md relative overflow-hidden data-[state=active]:transform data-[state=active]:scale-[0.98] hover:scale-[1.02] active:scale-[0.96]"
              >
                Old
              </TabsTrigger>
            </TabsList> */}

            <TabsContent value="new" className="mt-0 animate-in fade-in-0 slide-in-from-bottom-2 duration-300 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-bottom-2">
              {/* First Row: Make, Model, Year */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                {/* Make */}
                <Select
                  value={local.make}
                  onValueChange={(value) => {
                    setLocal((prev) => ({ ...prev, make: value, model: '' }))
                  }}
                >
                  <SelectTrigger className="bg-white/95 backdrop-blur-sm border-white/30 text-gray-900 focus:ring-orange-500/50 h-10 hover:bg-white shadow-sm w-full">
                    <SelectValue placeholder="Make" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 backdrop-blur-md border-white/50">
                    {makes.map((m) => (
                      <SelectItem key={m} value={m} className="focus:bg-orange-50">
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Model */}
                <Select
                  value={local.model || undefined}
                  onValueChange={(value) => setLocal((prev) => ({ ...prev, model: value }))}
                  disabled={!local.make}
                >
                  <SelectTrigger className={`bg-white/95 backdrop-blur-sm border-white/30 text-gray-900 focus:ring-orange-500/50 h-10 hover:bg-white shadow-sm w-full ${!local.make ? 'opacity-60 cursor-not-allowed' : ''}`}>
                    <SelectValue placeholder={local.make ? "Model" : "Select make first"} />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 backdrop-blur-md border-white/50">
                    {local.make ? (
                      modelsForSelectedMake.length > 0 ? (
                        modelsForSelectedMake.map((model) => (
                          <SelectItem key={model} value={model} className="focus:bg-orange-50">
                            {model}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="px-2 py-1.5 text-sm text-gray-400">No models available</div>
                      )
                    ) : (
                      <div className="px-2 py-1.5 text-sm text-gray-400">Select make first</div>
                    )}
                  </SelectContent>
                </Select>

                {/* Year */}
                <Select
                  value={local.year}
                  onValueChange={(value) => setLocal((prev) => ({ ...prev, year: value }))}
                >
                  <SelectTrigger className="bg-white/95 backdrop-blur-sm border-white/30 text-gray-900 focus:ring-orange-500/50 h-10 hover:bg-white shadow-sm w-full">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 backdrop-blur-md border-white/50 max-h-64">
                    {years.map((y) => (
                      <SelectItem key={y} value={y} className="focus:bg-orange-50">
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Second Row: Min Price and Max Price in one row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                {/* Min Price */}
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="Min Price"
                    value={local.budgetMin}
                    onChange={(e) => setLocal((prev) => ({ ...prev, budgetMin: e.target.value }))}
                    className="bg-white/95 backdrop-blur-sm border-white/30 text-gray-900 placeholder:text-gray-500 focus-visible:ring-orange-500/50 h-10 pr-8 hover:bg-white shadow-sm"
                    min="0"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none">$</span>
                </div>

                {/* Max Price */}
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="Max Price"
                    value={local.budgetMax}
                    onChange={(e) => setLocal((prev) => ({ ...prev, budgetMax: e.target.value }))}
                    className="bg-white/95 backdrop-blur-sm border-white/30 text-gray-900 placeholder:text-gray-500 focus-visible:ring-orange-500/50 h-10 pr-8 hover:bg-white shadow-sm"
                    min="0"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none">$</span>
                </div>
              </div>

              {/* Single Search Button */}
              <Button
                onClick={handleSearch}
                disabled={isSearching}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold h-11 rounded-lg shadow-lg disabled:opacity-60 transition-all duration-200 hover:shadow-xl hover:scale-[1.02]"
              >
                {isSearching ? 'Searching…' : `Search New →`}
              </Button>
            </TabsContent>

            <TabsContent value="old" className="mt-0 animate-in fade-in-0 slide-in-from-bottom-2 duration-300 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-bottom-2">
              {/* First Row: Make, Model, Year */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                {/* Make */}
                <Select
                  value={local.make}
                  onValueChange={(value) => {
                    setLocal((prev) => ({ ...prev, make: value, model: '' }))
                  }}
                >
                  <SelectTrigger className="bg-white/95 backdrop-blur-sm border-white/30 text-gray-900 focus:ring-orange-500/50 h-10 hover:bg-white shadow-sm w-full">
                    <SelectValue placeholder="Make" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 backdrop-blur-md border-white/50">
                    {makes.map((m) => (
                      <SelectItem key={m} value={m} className="focus:bg-orange-50">
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Model */}
                <Select
                  value={local.model || undefined}
                  onValueChange={(value) => setLocal((prev) => ({ ...prev, model: value }))}
                  disabled={!local.make}
                >
                  <SelectTrigger className={`bg-white/95 backdrop-blur-sm border-white/30 text-gray-900 focus:ring-orange-500/50 h-10 hover:bg-white shadow-sm w-full ${!local.make ? 'opacity-60 cursor-not-allowed' : ''}`}>
                    <SelectValue placeholder={local.make ? "Model" : "Select make first"} />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 backdrop-blur-md border-white/50">
                    {local.make ? (
                      modelsForSelectedMake.length > 0 ? (
                        modelsForSelectedMake.map((model) => (
                          <SelectItem key={model} value={model} className="focus:bg-orange-50">
                            {model}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="px-2 py-1.5 text-sm text-gray-400">No models available</div>
                      )
                    ) : (
                      <div className="px-2 py-1.5 text-sm text-gray-400">Select make first</div>
                    )}
                  </SelectContent>
                </Select>

                {/* Year */}
                <Select
                  value={local.year}
                  onValueChange={(value) => setLocal((prev) => ({ ...prev, year: value }))}
                >
                  <SelectTrigger className="bg-white/95 backdrop-blur-sm border-white/30 text-gray-900 focus:ring-orange-500/50 h-10 hover:bg-white shadow-sm w-full">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 backdrop-blur-md border-white/50 max-h-64">
                    {years.map((y) => (
                      <SelectItem key={y} value={y} className="focus:bg-orange-50">
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Second Row: Min Price and Max Price in one row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                {/* Min Price */}
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="Min Price"
                    value={local.budgetMin}
                    onChange={(e) => setLocal((prev) => ({ ...prev, budgetMin: e.target.value }))}
                    className="bg-white/95 backdrop-blur-sm border-white/30 text-gray-900 placeholder:text-gray-500 focus-visible:ring-orange-500/50 h-10 pr-8 hover:bg-white shadow-sm"
                    min="0"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none">$</span>
                </div>

                {/* Max Price */}
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="Max Price"
                    value={local.budgetMax}
                    onChange={(e) => setLocal((prev) => ({ ...prev, budgetMax: e.target.value }))}
                    className="bg-white/95 backdrop-blur-sm border-white/30 text-gray-900 placeholder:text-gray-500 focus-visible:ring-orange-500/50 h-10 pr-8 hover:bg-white shadow-sm"
                    min="0"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none">$</span>
                </div>
              </div>

              {/* Single Search Button */}
              <Button
                onClick={handleSearch}
                disabled={isSearching}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold h-11 rounded-lg shadow-lg disabled:opacity-60 transition-all duration-200 hover:shadow-xl hover:scale-[1.02]"
              >
                {isSearching ? 'Searching…' : `Search Old →`}
              </Button>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-wrap gap-4"
          variants={fadeUp}
          custom={0.4}
        >
          <button
            className="px-5 py-3 rounded-lg font-bold bg-white/[0.14] text-white border border-white/25 shadow-[0_8px_24px_rgba(0,0,0,0.12)] hover:bg-white/[0.22] hover:-translate-y-0.5 transition-all duration-300"
            onClick={(e) => {
              e.preventDefault()
              setOpen(true)
            }}
          >
            Get Your Instant Offer
          </button>

          {!user ? (
            <button
              onClick={(e) => {
                e.preventDefault()
                setAuctionOpen(true)
              }}
              className="px-5 py-3 rounded-lg font-bold bg-white/10 text-white border border-white/[0.22] shadow-[0_8px_24px_rgba(0,0,0,0.10)] hover:bg-white/[0.18] hover:-translate-y-0.5 transition-all duration-300"
            >
              Auction Your Ride
            </button>
          ) : (
            <Link
              to="/dashboard"
              className="px-5 py-3 rounded-lg font-bold bg-white/10 text-white border border-white/[0.22] shadow-[0_8px_24px_rgba(0,0,0,0.10)] hover:bg-white/[0.18] hover:-translate-y-0.5 transition-all duration-300 flex items-center"
            >
              Dashboard
            </Link>
          )}
        </motion.div>
      </motion.div>

      {/* Modals */}
      <AuctionModal isOpen={auctionOpen} onClose={setAuctionOpen} />
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onForgotPassword={handleForgotPassword}
        onRegister={handleRegister}
      />
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