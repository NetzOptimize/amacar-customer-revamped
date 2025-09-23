import { Facebook, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="px-[3%] relative bg-gradient-to-br from-white via-neutral-50 to-white text-neutral-900 overflow-hidden">
      {/* Background Pattern */}
      <div className=" absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-transparent"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary-400/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12 lg:gap-16 xl:gap-28 mb-8 sm:mb-10 lg:mb-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="mb-6 sm:mb-8">
              <div className="flex items-center mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mr-3 sm:mr-4">
                  <span className="text-xl sm:text-2xl font-bold text-white">A</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-neutral-900 to-neutral-600 bg-clip-text text-transparent">
                  Amacar
                </h3>
              </div>
              <p className="text-neutral-600 leading-relaxed mb-6 sm:mb-8 text-sm sm:text-base lg:text-lg">
                The smartest way to sell your car. Get instant offers from
                verified dealers and watch them compete for your vehicle in
                real-time auctions.
              </p>

              {/* Social Links */}
              <div className="flex space-x-3 sm:space-x-4">
                <a
                  href="https://www.youtube.com/@Amacar-ai"
                  className="group w-10 h-10 sm:w-12 sm:h-12 bg-neutral-100 hover:bg-primary-500 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-glow"
                >
                  <span className="text-base sm:text-lg font-bold text-neutral-600 group-hover:text-white">
                    <Youtube />
                  </span>
                </a>
                <a
                  href="https://x.com/Amacar_us"
                  className="group w-10 h-10 sm:w-12 sm:h-12 bg-neutral-100 hover:bg-primary-500 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-glow"
                >
                  <span className="text-base sm:text-lg font-bold text-neutral-600 group-hover:text-white">
                    <Twitter />
                  </span>
                </a>
                <a
                  href="https://www.linkedin.com/company/amacar-ai/"
                  className="group w-10 h-10 sm:w-12 sm:h-12 bg-neutral-100 hover:bg-primary-500 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-glow"
                >
                  <span className="text-base sm:text-lg font-bold text-neutral-600 group-hover:text-white">
                    <Linkedin />
                  </span>
                </a>
                <a
                  href="https://www.instagram.com/amacar.ai/"
                  className="group w-10 h-10 sm:w-12 sm:h-12 bg-neutral-100 hover:bg-primary-500 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-glow"
                >
                  <span className="text-base sm:text-lg font-bold text-neutral-600 group-hover:text-white">
                    <Instagram />
                  </span>
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-semibold mb-8 text-neutral-900">
              Quick Links
            </h4>
            <ul className="space-y-4">
              <li>
                <Link
                  to="/about-us"
                  className="text-neutral-600 hover:text-primary-500 transition-colors duration-300 text-lg  inline-block"
                >
                  How to bid
                </Link>
              </li>
              <li>
                <Link
                  to="/about-us"
                  className="text-neutral-600 hover:text-primary-500 transition-colors duration-300 text-lg  inline-block"
                >
                  Our vision
                </Link>
              </li>
              <li>
                <Link
                  to="/about-us"
                  className="text-neutral-600 hover:text-primary-500 transition-colors duration-300 text-lg  inline-block"
                >
                  How to sell with us
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}

          {/* Support & Legal */}
          <div>
            <h4 className="text-xl font-semibold mb-8 text-neutral-900">
              Support & Legal
            </h4>
            <ul className="space-y-4">
              <li>
                <Link
                  to="/cookies-policy"
                  className="text-neutral-600 hover:text-primary-500 transition-colors duration-300 text-lg  inline-block"
                >
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy-policy"
                  className="text-neutral-600 hover:text-primary-500 transition-colors duration-300 text-lg  inline-block"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms-of-service"
                  className="text-neutral-600 hover:text-primary-500 transition-colors duration-300 text-lg  inline-block"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="text-neutral-600 hover:text-primary-500 transition-colors duration-300 text-lg  inline-block"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-300 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
            <div className="flex items-center space-x-8">
              <span className="text-neutral-600  text-sm">Trusted by</span>
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r w-32 from-primary-500/10 to-primary-600/10 backdrop-blur-sm border border-primary-500/20 px-4 py-2 rounded-full text-xs font-medium text-primary-600">
                  10,000+ Sellers
                </div>
                <div className="bg-gradient-to-r w-32 from-primary-500/10 to-primary-600/10 backdrop-blur-sm border border-primary-500/20 px-4 py-2 rounded-full text-xs font-medium text-primary-600">
                  500+ Dealers
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
