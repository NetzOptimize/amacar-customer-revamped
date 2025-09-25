import { useContext, useState } from "react";
import "./header.css";
import LoginModal from "@/components/ui/LoginModal";
import { logout, setLoginRedirect } from "@/redux/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
  const userExists = useSelector(
    (state) => state.carDetailsAndQuestions.userExists
  );
  // Debug modal state changes
  console.log("Header state:", { open, loginModalOpen, logoutModalOpen, user });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Function to check if a path is active
  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const handleLoginClick = (e) => {
    console.log("Login button clicked", { e, user });
    if (e) {
      e.preventDefault();
    }
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
              <Link to="/" className="logo-link">
                <img
                  className="logo"
                  src="https://dealer.amacar.ai/wp-content/uploads/2024/10/logo-4-2048x680.png"
                  alt="Amacar Logo"
                />
              </Link>
            </div>

            {/* Desktop Navigation - Hidden on mobile/tablet */}
            <nav className="nav-desktop">
              <Link
                className={`nav-link ${isActive("/") ? "active" : ""}`}
                to="/"
              >
                Home
              </Link>
              <Link
                className={`nav-link ${
                  isActive("/testimonials") ? "active" : ""
                }`}
                to="/testimonials"
              >
                Testimonials
              </Link>
              <Link
                className={`nav-link ${isActive("/about-us") ? "active" : ""}`}
                to="/about-us"
              >
                Our Vision
              </Link>
            </nav>

            {/* Actions Section - Responsive */}
            <div className="actions-section">
              {/* Desktop Actions */}
              <div className="actions-desktop">
                {user ? (
                  <button className="btn-login" onClick={handleLogoutClick}>
                    Logout
                  </button>
                ) : (
                  <button className="btn-login" onClick={handleLoginClick}>
                    Login / Register
                  </button>
                )}
                {user && (
                  <button
                    className="btn-login !bg-white !text-[var(--brand-orange)]"
                    onClick={() => navigate("/dashboard")}
                  >
                    Dashboard
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
                className={`nav-link-mobile ${isActive("/") ? "active" : ""}`}
                to="/"
                onClick={() => setOpen(false)}
              >
                Home
              </Link>
              <Link
                className={`nav-link-mobile ${
                  isActive("/testimonials") ? "active" : ""
                }`}
                to="/testimonials"
                onClick={() => setOpen(false)}
              >
                Testimonials
              </Link>
              <Link
                className={`nav-link-mobile ${
                  isActive("/about-us") ? "active" : ""
                }`}
                to="/about-us"
                onClick={() => setOpen(false)}
              >
                Our Vision
              </Link>

              {/* Mobile Auth Actions */}
              <div className="mobile-auth-section flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
                {user ? (
                  <button
                    className="btn-login-mobile w-full sm:w-auto"
                    onClick={() => {
                      handleLogoutClick();
                      setOpen(false);
                    }}
                  >
                    Logout
                  </button>
                ) : (
                  <button
                    className="btn-login-mobile w-full sm:w-auto"
                    onClick={() => {
                      handleLoginClick();
                      setOpen(false);
                    }}
                  >
                    Login / Register
                  </button>
                )}

                {user && (
                  <button
                    className="btn-login-mobile btn-login-mobile !bg-white !text-[var(--brand-orange)] w-full sm:w-auto"
                    onClick={() => navigate("/dashboard")}
                  >
                    Dashboard
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
