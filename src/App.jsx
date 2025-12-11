import { lazy, Suspense } from 'react';
import Header from './components/Layout/Header/Header.jsx';
import Footer from './components/Layout/Footer/Footer.jsx';
import './App.css';
import { Toaster } from 'react-hot-toast';
import { Route, Routes, useLocation } from 'react-router-dom';
import DashboardLayout from './components/Layout/DashboardLayout/DashboardLayout.jsx';
import { AuthProvider } from './provider/AuthProvider';
import PrivateRoute from './components/Auth/PrivateRoute';
import { SearchProvider } from './context/SearchContext';
import BackToTop from './components/ui/back-to-top';
import ScrollToTop from './components/ui/ScrollToTop.jsx';

// Lazy load all page components for code splitting
// This reduces initial bundle size by loading routes only when needed
const HomePage = lazy(() => import('./Pages/HomePage.jsx'));
const AuctionPage = lazy(() => import('./Pages/AuctionPage.jsx'));
const Dashboard = lazy(() => import('./Pages/Dashboard.jsx'));
const LiveAuctionsPage = lazy(() => import('./Pages/LiveAuctionsPage.jsx'));
const PendingOffersPage = lazy(() => import('./Pages/PendingOffersPage.jsx'));
const PreviousOffersPage = lazy(() => import('./Pages/PreviousOffersPage.jsx'));
const AcceptedOffersPage = lazy(() => import('./Pages/AcceptedOffersPage.jsx'));
const MyAppointments = lazy(() => import('./Pages/MyAppointments.jsx'));
const ProfilePage = lazy(() => import('./Pages/ProfilePage.jsx'));
const ConditionAssessment = lazy(() => import('./Pages/ConditionAssessment.jsx'));
const ExteriorPhotos = lazy(() => import('./Pages/ExteriorPhotos.jsx'));
const ReviewPageById = lazy(() => import('./Pages/ReviewPageById.jsx'));
const UnauthorizedPage = lazy(() => import('./Pages/UnauthorizedPage.jsx'));
const CarDetailsView = lazy(() => import('./Pages/CarDetailsView.jsx'));
const AboutUs = lazy(() => import('./Pages/AboutUs.jsx'));
const TermsOfService = lazy(() => import('./Pages/TermsOfService.jsx'));
const PrivacyPolicy = lazy(() => import('./Pages/PrivacyPolicy.jsx'));
const CookiesPolicy = lazy(() => import('./Pages/CookiesPolicy.jsx'));
const Testimonials = lazy(() => import('./Pages/Testimonials.jsx'));
const FAQ = lazy(() => import('./Pages/FAQ.jsx'));
const ResultsPage = lazy(() => import('@/features/reverseBidding/pages/ResultsPage.jsx'));
const SessionPage = lazy(() => import('@/features/reverseBidding/pages/SessionPage.jsx'));
const LandingPage = lazy(() => import('@/features/reverseBidding/pages/LandingPage.jsx'));
const VehicleDetails = lazy(() => import('@/features/reverseBidding/pages/VehicleDetails.jsx'));
const ActiveSessionsPage = lazy(() => import('@/features/reverseBidding/pages/ActiveSessionsPage.jsx'));
const ReverseBidsPage = lazy(() => import('@/features/reverseBidding/pages/ReverseBidsPage.jsx'));
const AcceptedReverseBidsPage = lazy(() => import('@/features/reverseBidding/pages/AcceptedReverseBidsPage.jsx'));

// Simple loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-neutral-600">Loading...</p>
    </div>
  </div>
);




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
            <Suspense fallback={<PageLoader />}>
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
            </Suspense>
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