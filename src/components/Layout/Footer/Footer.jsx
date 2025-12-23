import { Facebook, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";
import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Footer() {
  const location = useLocation();

  // Function to check if a path is active
  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  // Handle link click - scroll to top if already on the page with same hash, otherwise navigate
  const handleLinkClick = (e, targetPath, hash = '') => {
    const currentPath = location.pathname;
    const currentHash = location.hash;
    const targetHash = hash ? `#${hash}` : '';
    
    // If already on the same page
    if (currentPath === targetPath) {
      // If no hash specified (like "Our vision"), always scroll to top
      if (!hash) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      // If already on the same page with the same hash, scroll to top
      else if (currentHash === targetHash) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      // If on the same page but different hash, let it navigate to update the hash
    }
    // If on a different page, let the Link component handle navigation
    // The AboutUs page useEffect will handle scrolling to the section
  };

  // Check if a link is active based on pathname and hash
  const isLinkActive = (targetPath, hash = '') => {
    const currentPath = location.pathname;
    const currentHash = location.hash;
    const targetHash = hash ? `#${hash}` : '';
    
    if (currentPath !== targetPath) return false;
    
    // If no hash specified, check if path matches
    if (!hash) return true;
    
    // If hash specified, check if hash matches
    return currentHash === targetHash;
  };

  return (
    <footer className="px-[3%] relative bg-gradient-to-br from-white via-neutral-50 to-white text-neutral-900 overflow-hidden">
      {/* Background Pattern */}
      <div className=" absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-transparent"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary-400/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-8xl mx-auto px-8 py-5">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-28  mb-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="mb-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mr-4">
                  <span className="text-2xl font-bold text-white">A</span>
                </div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-neutral-900 to-neutral-600 bg-clip-text text-transparent">
                  Amacar
                </h3>
              </div>
              <p className="text-neutral-600 leading-relaxed mb-8 text-lg">
                The smartest way to sell your car. Get instant offers from
                verified dealers and watch them compete for your vehicle in
                real-time auctions.
              </p>

              {/* Social Links */}
              <div className="flex space-x-4">
                <a
                  href="https://www.youtube.com/@Amacar-ai"
                  className="group w-12 h-12 bg-neutral-100 hover:bg-primary-500 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-glow"
                >
                  <span className="text-lg font-bold text-neutral-600 group-hover:text-white">
                    <Youtube />
                  </span>
                </a>
                <a
                  href="https://x.com/Amacar_us"
                  className="group w-12 h-12 bg-neutral-100 hover:bg-primary-500 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-glow"
                >
                  <span className="text-lg font-bold text-neutral-600 group-hover:text-white">
                    <Twitter />
                  </span>
                </a>
                <a
                  href="https://www.linkedin.com/company/amacar-ai/"
                  className="group w-12 h-12 bg-neutral-100 hover:bg-primary-500 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-glow"
                >
                  <span className="text-lg font-bold text-neutral-600 group-hover:text-white">
                    <Linkedin />
                  </span>
                </a>
                <a
                  href="https://www.instagram.com/amacar.ai/"
                  className="group w-12 h-12 bg-neutral-100 hover:bg-primary-500 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-glow"
                >
                  <span className="text-lg font-bold text-neutral-600 group-hover:text-white">
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
                  onClick={(e) => handleLinkClick(e, "/about-us")}
                  className={`text-lg inline-block transition-colors duration-300 ${
                    isLinkActive("/about-us") && !location.hash
                      ? "text-primary-500 font-semibold" 
                      : "text-neutral-600 hover:text-primary-500"
                  }`}
                >
                  Our vision
                </Link>
              </li>
              <li>
                <Link
                  to="/about-us#who-we-are"
                  onClick={(e) => handleLinkClick(e, "/about-us", "who-we-are")}
                  className={`text-lg inline-block transition-colors duration-300 ${
                    isLinkActive("/about-us", "who-we-are") 
                      ? "text-primary-500 font-semibold" 
                      : "text-neutral-600 hover:text-primary-500"
                  }`}
                >
                  Who We Are
                </Link>
              </li>
              <li>
                <Link
                  to="/about-us#our-mission"
                  onClick={(e) => handleLinkClick(e, "/about-us", "our-mission")}
                  className={`text-lg inline-block transition-colors duration-300 ${
                    isLinkActive("/about-us", "our-mission") 
                      ? "text-primary-500 font-semibold" 
                      : "text-neutral-600 hover:text-primary-500"
                  }`}
                >
                  Our Mission
                </Link>
              </li>
              <li>
                <Link
                  to="/about-us#how-it-works"
                  onClick={(e) => handleLinkClick(e, "/about-us", "how-it-works")}
                  className={`text-lg inline-block transition-colors duration-300 ${
                    isLinkActive("/about-us", "how-it-works") 
                      ? "text-primary-500 font-semibold" 
                      : "text-neutral-600 hover:text-primary-500"
                  }`}
                >
                  How it works
                </Link>
              </li>
              <li>
                <Link
                  to="/about-us#our-values"
                  onClick={(e) => handleLinkClick(e, "/about-us", "our-values")}
                  className={`text-lg inline-block transition-colors duration-300 ${
                    isLinkActive("/about-us", "our-values") 
                      ? "text-primary-500 font-semibold" 
                      : "text-neutral-600 hover:text-primary-500"
                  }`}
                >
                  Our values
                </Link>
              </li>
              <li>
                <Link
                  to="/about-us#trusted-partners"
                  onClick={(e) => handleLinkClick(e, "/about-us", "trusted-partners")}
                  className={`text-lg inline-block transition-colors duration-300 ${
                    isLinkActive("/about-us", "trusted-partners") 
                      ? "text-primary-500 font-semibold" 
                      : "text-neutral-600 hover:text-primary-500"
                  }`}
                >
                  Trusted partners
                </Link>
              </li>
              <li>
                <Link
                  to="/about-us#why-trust-us"
                  onClick={(e) => handleLinkClick(e, "/about-us", "why-trust-us")}
                  className={`text-lg inline-block transition-colors duration-300 ${
                    isLinkActive("/about-us", "why-trust-us") 
                      ? "text-primary-500 font-semibold" 
                      : "text-neutral-600 hover:text-primary-500"
                  }`}
                >
                  Why trust us
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
                  className={`text-lg inline-block transition-colors duration-300 ${
                    isActive("/cookies-policy") 
                      ? "text-primary-500 font-semibold" 
                      : "text-neutral-600 hover:text-primary-500"
                  }`}
                >
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy-policy"
                  className={`text-lg inline-block transition-colors duration-300 ${
                    isActive("/privacy-policy") 
                      ? "text-primary-500 font-semibold" 
                      : "text-neutral-600 hover:text-primary-500"
                  }`}
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms-of-service"
                  className={`text-lg inline-block transition-colors duration-300 ${
                    isActive("/terms-of-service") 
                      ? "text-primary-500 font-semibold" 
                      : "text-neutral-600 hover:text-primary-500"
                  }`}
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className={`text-lg inline-block transition-colors duration-300 ${
                    isActive("/faq") 
                      ? "text-primary-500 font-semibold" 
                      : "text-neutral-600 hover:text-primary-500"
                  }`}
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-300 pt-8 ">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
            <div className="flex items-center space-x-8 sm:flex-row">
              <span className="text-neutral-600 text-sm">Trusted by</span>
              <div className="flex items-center space-x-4">
                <div className="w-32 bg-gradient-to-r from-primary-500/10 to-primary-600/10 backdrop-blur-sm border border-primary-500/20 px-4 py-2 rounded-full text-sm font-medium text-primary-600">
                  1000+ Sellers
                </div>
                <div className="w-32 bg-gradient-to-r from-primary-500/10 to-primary-600/10 backdrop-blur-sm border border-primary-500/20 px-4 py-2 rounded-full text-sm font-medium text-primary-600">
                  500+ Dealers
                </div>
              </div>
            </div>
            <div className="text-neutral-500 text-sm">
              © {new Date().getFullYear()} Amacar. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
