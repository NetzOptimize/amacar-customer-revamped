import React, { useContext, useState } from "react"
import { motion } from "framer-motion"
import "./hero.css"
import bgImg from "../../../assets/home_page_first_hero(12).jpg"

// ⬇️ shadcn components
import Modal from "@/components/ui/modal.jsx"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import AuctionModal from "@/components/ui/AuctionYourRideModal"
import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import LoginModal from "@/components/ui/LoginModal"
// import { AuthContext } from "@/contexts/AuthContext"


export default function Hero() {
  const [open, setOpen] = useState(false)
  const [auctionOpen, setAuctionOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  // const {user, logout} = useContext(AuthContext); 
  const { user } = useSelector((state) => state.user);
  const handleLoginClick = (e) => {
    e.preventDefault();
    // dispatch(setLoginRedirect("/dashboard"));
    setLoginModalOpen(true);
  };

  const handleForgotPassword = () => {
    console.log("Open forgot password modal");
  };

  const handleRegister = () => {
    console.log("Open register modal");
  };


  // 🔹 Variants for animation
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (delay = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut", delay },
    }),
  }

  return (
    <section
      className="hero-section"
      style={{ backgroundImage: `url(${bgImg})` }}
    >
      <div className="hero-overlay"></div>
      <motion.div
        className="hero-content"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.h1 className="hero-headline" variants={fadeUp} custom={0}>
          Post Your Car. Dealers Compete Live. You Get Cash.
        </motion.h1>

        <motion.p className="hero-sub" variants={fadeUp} custom={0.2}>
          Get top offers on your used car in minutes—without the usual hassle.
        </motion.p>

        <motion.div className="hero-ctas " variants={fadeUp} custom={0.4}>
         
            <button className="cursor-pointer btn-white" onClick={(e) => {
              e.preventDefault()
              setOpen(true)
            }}>
            Get Your Instant Offer
          </button>
          {
            !user ? <button
            onClick={(e) => {
              e.preventDefault()
              setAuctionOpen(true)
            }}
            className="cursor-pointer sm:text-left sm:justify-left sm:align-left btn-purple"
          >
            Auction Your Ride
          </button  > : <Link to={'/dashboard'} className="cursor-pointer btn-purple">Dashboard</Link>
          }
        </motion.div>
      </motion.div>

      {/* Auction modal */}
      <AuctionModal
        isOpen={auctionOpen}
        onClose={setAuctionOpen}
      />

        <LoginModal
          isOpen={loginModalOpen}
          onClose={() => setLoginModalOpen(false)}
          onForgotPassword={handleForgotPassword}
          onRegister={handleRegister}
        />

      {/* 🔹 Reusable Modal */}
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
