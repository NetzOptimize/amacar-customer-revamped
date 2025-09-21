import { useContext, useState } from "react";
import "./header.css";
import LoginModal from "@/components/ui/LoginModal";
import { logout, setLoginRedirect } from "@/redux/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import LogoutModal from "@/components/ui/LogoutModal";
import { persistor } from "@/redux/store";
import { ArrowRight, Play } from "lucide-react";
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
            {/* left: logo area */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                minWidth: 180,
              }}
            >
              <a
                href="/"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  textDecoration: "none",
                }}
              >
                <img
                  className="logo"
                  src="src/assets/original_logo.jpg"
                  alt="Logo"
                />
              </a>
            </div>

            {/* center: nav (absolutely centered on desktop) */}
            <nav className="nav-desktop">
              <a className="nav-link" href="/">
                Home
              </a>
              <a className="nav-link" href="/testimonials">
                Testimonials
              </a>
              <a className="nav-link" href="/join-our-dealer-network">
                Join Our Dealer Network
              </a>
              <Link className="nav-link" to="/about-us">
                Our Vision
              </Link>
            </nav>

            {/* right: actions */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                minWidth: 180,
              }}
            >
              <div className="actions-desktop hidden md:flex items-center gap-3">
                {user ? (
                  <button
                    className="btn-login cursor-pointer"
                    onClick={handleLogoutClick}
                  >
                    Logout
                  </button>
                ) : (
                  <a className="btn-login" href="#" onClick={handleLoginClick}>
                    Login / Register
                  </a>
                )}
              </div>

              <div
                className="mobile-toggle"
                style={{ display: "flex", alignItems: "center", marginLeft: 8 }}
              >
                <button
                  aria-label="Toggle menu"
                  aria-expanded={open}
                  onClick={() => setOpen(!open)}
                  className="hamburger-btn"
                >
                  <span className={`hamburger ${open ? "open" : ""}`}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className={`mobile-panel ${open ? "open" : ""}`}>
          <div
            className="container"
            style={{ paddingTop: 12, paddingBottom: 18 }}
          >
            <nav style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <Link className="nav-link-mobile" to="/">
                Home
              </Link>
              <a className="nav-link-mobile" href="#">
                Testimonials
              </a>
              <a className="nav-link-mobile" href="#">
                Join Our Dealer Network
              </a>
              <a className="nav-link-mobile" href="#">
                Our Vision
              </a>
              {/* {user && productId && (
                <button
                  className="bg-gradient-to-br from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white border-0 rounded-lg px-4 py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 ease-in-out shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 mt-2 w-full"
                  onClick={handleContinueClick}
                >
                  <Play className="w-4 h-4" />
                  Continue where you left off
                </button>
              )} */}
              {user ? (
                <button
                  className="btn-login-mobile"
                  onClick={handleLogoutClick}
                >
                  Logout
                </button>
              ) : (
                <a
                  className="btn-login-mobile"
                  href="#"
                  onClick={handleLoginClick}
                >
                  Login / Register
                </a>
              )}
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
