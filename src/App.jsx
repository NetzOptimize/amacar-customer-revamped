import Header from './components/Layout/Header/Header.jsx';
import Footer from './components/Layout/Footer/Footer.jsx';
import './App.css';
import { Toaster } from 'react-hot-toast';
import HomePage from './Pages/HomePage.jsx';
import { Route, Routes, useLocation } from 'react-router-dom';
import AuctionPage from './Pages/AuctionPage.jsx';
import DashboardLayout from './components/Layout/DashboardLayout/DashboardLayout.jsx';
import Dashboard from './Pages/Dashboard.jsx';
import LiveAuctionsPage from './Pages/LiveAuctionsPage.jsx';
import PendingOffersPage from './Pages/PendingOffersPage.jsx';
import PreviousOffersPage from './Pages/PreviousOffersPage.jsx';
import AcceptedOffersPage from './Pages/AcceptedOffersPage.jsx';
import MyAppointments from './Pages/MyAppointments.jsx';
import ProfilePage from './Pages/ProfilePage.jsx';
import ConditionAssessment from './Pages/ConditionAssessment.jsx';
import ExteriorPhotos from './Pages/ExteriorPhotos.jsx';
import ReviewPageById from './Pages/ReviewPageById.jsx';
import UnauthorizedPage from './Pages/UnauthorizedPage.jsx';
import CarDetailsView from './Pages/CarDetailsView.jsx';
import { AuthProvider } from './provider/AuthProvider'; // Updated Redux-based AuthProvider
import PrivateRoute from './components/Auth/PrivateRoute'; // Updated PrivateRoute
import { SearchProvider } from './context/SearchContext';
import BackToTop from './components/ui/back-to-top';
import AboutUs from './Pages/AboutUs.jsx';
import TermsOfService from './Pages/TermsOfService.jsx';
import PrivacyPolicy from './Pages/PrivacyPolicy.jsx';
import CookiesPolicy from './Pages/CookiesPolicy.jsx';
import Testimonials from './Pages/Testimonials.jsx';
import FAQ from './Pages/FAQ.jsx';
import ScrollToTop from './components/ui/ScrollToTop.jsx';
import ResultsPage from '@/features/reverseBidding/pages/ResultsPage.jsx';
import SessionPage from '@/features/reverseBidding/pages/SessionPage.jsx';
import LandingPage from '@/features/reverseBidding/pages/LandingPage.jsx';
import VehicleDetails from '@/features/reverseBidding/pages/VehicleDetails.jsx';
import ActiveSessionsPage from '@/features/reverseBidding/pages/ActiveSessionsPage.jsx';
import ReverseBidsPage from '@/features/reverseBidding/pages/ReverseBidsPage.jsx';
import AcceptedReverseBidsPage from '@/features/reverseBidding/pages/AcceptedReverseBidsPage.jsx';




function App() {
  const location = useLocation();
  const hideHeaderFooter =
    location.pathname.startsWith('/dashboard') ||
    location.pathname.startsWith('/auctions') ||
    location.pathname.startsWith('/active-sessions') ||
    location.pathname.startsWith('/reverse-bids') ||
    location.pathname.startsWith('/accepted-reverse-bids') ||
    location.pathname.startsWith('/pending-offers') ||
    location.pathname.startsWith('/offers') ||
    location.pathname.startsWith('/accepted') ||
    location.pathname.startsWith('/appointments') ||
    location.pathname.startsWith('/profile') ||
    location.pathname.startsWith('/car-details');

  return (
    <AuthProvider>
      <SearchProvider>
        <div className="min-h-screen bg-slate-50">
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
                borderRadius: '12px',
                padding: '16px',
                fontSize: '14px',
                fontWeight: '500',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
            containerStyle={{
              marginTop: '60px',
            }}
          />

          {!hideHeaderFooter && <Header />}

          <main className="pt-0 bg-white">
            <ScrollToTop />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/reverse-bidding" element={<LandingPage />} />
              <Route path="/reverse-bidding/results" element={<ResultsPage />} />
              <Route path="/reverse-bidding/session/:sessionId" element={<SessionPage />} />
              <Route path="/reverse-bidding/vehicles/:id" element={<VehicleDetails />} />
              <Route path="/auction-page" element={<AuctionPage />} />
              <Route path="/condition-assessment" element={<ConditionAssessment />} />
              <Route path="/local-auction" element={<ExteriorPhotos />} />
              <Route path="/national-auction" element={<ExteriorPhotos />} />
              <Route path="/review" element={<ReviewPageById />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/testimonials" element={<Testimonials />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/cookies-policy" element={<CookiesPolicy />} />
              <Route path="/faq" element={<FAQ />} />
              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <DashboardLayout>
                      <Dashboard />
                    </DashboardLayout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/auctions"
                element={
                  <PrivateRoute>
                    <DashboardLayout>
                      <LiveAuctionsPage />
                    </DashboardLayout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/active-sessions"
                element={
                  <PrivateRoute>
                    <DashboardLayout>
                      <ActiveSessionsPage />
                    </DashboardLayout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/reverse-bids"
                element={
                  <PrivateRoute>
                    <DashboardLayout>
                      <ReverseBidsPage />
                    </DashboardLayout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/accepted-reverse-bids"
                element={
                  <PrivateRoute>
                    <DashboardLayout>
                      <AcceptedReverseBidsPage />
                    </DashboardLayout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/pending-offers"
                element={
                  <PrivateRoute>
                    <DashboardLayout>
                      <PendingOffersPage />
                    </DashboardLayout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/offers"
                element={
                  <PrivateRoute>
                    <DashboardLayout>
                      <PreviousOffersPage />
                    </DashboardLayout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/accepted"
                element={
                  <PrivateRoute>
                    <DashboardLayout>
                      <AcceptedOffersPage />
                    </DashboardLayout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/appointments"
                element={
                  <PrivateRoute>
                    <DashboardLayout>
                      <MyAppointments />
                    </DashboardLayout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <DashboardLayout>
                      <ProfilePage />
                    </DashboardLayout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/car-details"
                element={
                  <PrivateRoute>
                    <DashboardLayout>
                      <CarDetailsView />
                    </DashboardLayout>
                  </PrivateRoute>
                }
              />
            </Routes>
          </main>

          {!hideHeaderFooter && <Footer />}

          {/* Back to Top Button - Only for public pages */}
          {!hideHeaderFooter && <BackToTop />}
        </div>
      </SearchProvider>
    </AuthProvider>
  );
}

export default App;