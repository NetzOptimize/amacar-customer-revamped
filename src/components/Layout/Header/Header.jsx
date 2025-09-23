import { useContext, useState } from "react";
import "./header.css";
import LoginModal from "@/components/ui/LoginModal";
import { logout, setLoginRedirect } from "@/redux/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import LogoutModal from "@/components/ui/LogoutModal";
import { persistor } from "@/redux/store";
import { ArrowRight, Play, Menu, X } from "lucide-react";
// import { AuthContext } from '@/contexts/AuthContext'

export default function Header() {
  const [open, setOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const { user } = useSelector((state) => state.user);
  const { productId } = useSelector((state) => state.carDetailsAndQuestions);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLoginClick = (e) => {
    e.preventDefault();
    dispatch(setLoginRedirect(null)); // Stay on current page
    setLoginModalOpen(true);
    setOpen(false);
  };

  const handleLogoutClick = () => {
    setLogoutModalOpen(true);
    setOpen(false);
  };

  const handleConfirmLogout = async () => {
    // await persistor.purge();
    await dispatch(logout());
    navigate("/");
  };

  const handleForgotPassword = () => {
    console.log("Open forgot password modal");
  };

  const handleRegister = () => {
    console.log("Open register modal");
  };

  const handleContinueClick = () => {
    navigate("/review");
  };

  return (
    <>
      <header className="site-header">
        <div className="container">
          <div className="header-row">
            {/* Logo Section - Responsive */}
            <div className="logo-section">
              <Link
                to="/"
                className="logo-link"
              >
                <img
                  className="logo"
                  src="src/assets/original_logo.jpg"
                  alt="Amacar Logo"
                />
              </Link>
            </div>

            {/* Desktop Navigation - Hidden on mobile/tablet */}
            <nav className="nav-desktop">
              <Link className="nav-link" to="/">
                Home
              </Link>
              <Link className="nav-link" to="/testimonials">
                Testimonials
              </Link>
              <Link className="nav-link" to="/about-us">
                Our Vision
              </Link>
            </nav>

            {/* Actions Section - Responsive */}
            <div className="actions-section">
              {/* Desktop Actions */}
              <div className="actions-desktop">
                {user ? (
                  <button
                    className="btn-login"
                    onClick={handleLogoutClick}
                  >
                    Logout
                  </button>
                ) : (
                  <button 
                    className="btn-login" 
                    onClick={handleLoginClick}
                  >
                    Login / Register
                  </button>
                )}
              </div>

              {/* Mobile/Tablet Menu Toggle */}
              <button
                aria-label="Toggle menu"
                aria-expanded={open}
                onClick={() => setOpen(!open)}
                className="mobile-menu-toggle"
              >
                {open ? (
                  <X className="h-6 w-6 text-slate-700" />
                ) : (
                  <Menu className="h-6 w-6 text-slate-700" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile/Tablet Navigation Panel */}
        <div className={`mobile-panel ${open ? "open" : ""}`}>
          <div className="mobile-panel-content">
            <nav className="mobile-nav">
              <Link 
                className="nav-link-mobile" 
                to="/"
                onClick={() => setOpen(false)}
              >
                Home
              </Link>
              <Link 
                className="nav-link-mobile" 
                to="/testimonials"
                onClick={() => setOpen(false)}
              >
                Testimonials
              </Link>
              <a 
                className="nav-link-mobile" 
                href="/join-our-dealer-network"
                onClick={() => setOpen(false)}
              >
                Join Our Dealer Network
              </a>
              <Link 
                className="nav-link-mobile" 
                to="/about-us"
                onClick={() => setOpen(false)}
              >
                Our Vision
              </Link>
              
              {/* Mobile Auth Actions */}
              <div className="mobile-auth-section">
                {user ? (
                  <button
                    className="btn-login-mobile"
                    onClick={() => {
                      handleLogoutClick();
                      setOpen(false);
                    }}
                  >
                    Logout
                  </button>
                ) : (
                  <button
                    className="btn-login-mobile"
                    onClick={() => {
                      handleLoginClick();
                      setOpen(false);
                    }}
                  >
                    Login / Register
                  </button>
                )}
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Login Modal */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onForgotPassword={handleForgotPassword}
        onRegister={handleRegister}
      />

      {/* Logout Modal */}
      <LogoutModal
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
      />
    </>
  );
}
