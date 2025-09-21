import { useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Car,
  Clock,
  CheckCircle,
  Calendar,
  User,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  TrendingUp,
  Hourglass,
  FileText,
  LogOut,
  Plus
} from 'lucide-react';
import Modal from '@/components/ui/modal';
import LogoutModal from '@/components/ui/LogoutModal';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/redux/slices/userSlice';
import { persistor } from '@/redux/store';
// import { AuthContext } from '@/contexts/AuthContext';

const Sidebar = ({ isCollapsed, onToggle }) => {
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  // const { logout } = useContext(AuthContext);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Live Auctions', href: '/auctions', icon: TrendingUp },
    { name: 'Pending Offers', href: '/pending-offers', icon: Hourglass },
    { name: 'Previous Offers', href: '/offers', icon: FileText },
    { name: 'Accepted Offers', href: '/accepted', icon: CheckCircle },
    { name: 'My Appointments', href: '/appointments', icon: Calendar },
    {
      name: 'Add Vehicle',
      icon: Plus,
      action: () => setIsModalOpen(true)
    }
  ];

  const handleLogoutClick = () => {
    setLogoutModalOpen(true);
  };

  const handleConfirmLogout = async () => {
    // await persistor.purge();
    await dispatch(logout());
    navigate('/');
  };

  const bottomNavigation = [
    { name: 'Profile', href: '/profile', icon: User },
    {
      name: 'Logout',
      icon: LogOut,
      action: handleLogoutClick,
    }
  ];

  const containerVariants = {
    open: { width: '16rem', transition: { type: 'spring', stiffness: 200, damping: 25 } },
    closed: { width: '4rem', transition: { type: 'spring', stiffness: 200, damping: 25 } }
  };

  const itemVariants = {
    open: { opacity: 1, x: 0, transition: { duration: 0.3, ease: 'easeOut' } },
    closed: { opacity: 0, x: -20, transition: { duration: 0.2, ease: 'easeIn' } }
  };

  return (
    <>
      <motion.aside
        variants={containerVariants}
        animate={isCollapsed ? 'closed' : 'open'}
        className="fixed left-0 top-0 bottom-0 bg-white border-r border-neutral-200 z-[41] shadow-sm"
      >
        <div className="flex flex-col h-full relative">
          {/* Toggle Button - Fixed position */}
          <button
            onClick={onToggle}
            className={`cursor-pointer absolute top-16 z-[51] p-1.5 bg-white border border-neutral-200 rounded-sm  shadow-sm hover:bg-neutral-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-200 ${isCollapsed ? 'right-[-12px]' : 'right-3'
              }`}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 text-neutral-600" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-neutral-600" />
            )}
          </button>

          {/* Top Section: Logo */}
          <div className="flex items-center px-4 py-6 border-b border-neutral-200">
            <Link to="/" className="flex items-center mr-8">
              {isCollapsed ? (
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <Car className="w-5 h-5 text-primary-600" />
                </div>
              ) : (
                <AnimatePresence>
                  <motion.div
                    variants={itemVariants}
                    initial="closed"
                    animate="open"
                    exit="closed"
                  >
                    <img
                      className="h-8 w-auto max-w-[120px]"
                      src="src/assets/original_logo.jpg"
                      alt="Amacar Logo"
                    />
                  </motion.div>
                </AnimatePresence>
              )}
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-2 space-y-1 mt-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;

              return (
                <div key={item.name}>
                  {item.action ? (
                    <button
                      onClick={item.action}
                      className={`cursor-pointer group text-start flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 w-full ${isActive
                        ? 'bg-primary-100 text-primary-700 font-semibold'
                        : 'text-neutral-600 hover:text-primary-600 hover:bg-primary-50'
                        }`}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <AnimatePresence>
                        {!isCollapsed && (
                          <motion.div
                            variants={itemVariants}
                            initial="closed"
                            animate="open"
                            exit="closed"
                            className="flex-1"
                          >
                            <span className="text-sm font-medium">{item.name}</span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </button>
                  ) : (
                    <Link
                      to={item.href}
                      className={`group flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${isActive
                        ? 'bg-primary-100 text-primary-700 font-semibold'
                        : 'text-neutral-600 hover:text-primary-600 hover:bg-primary-50'
                        }`}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <AnimatePresence>
                        {!isCollapsed && (
                          <motion.div
                            variants={itemVariants}
                            initial="closed"
                            animate="open"
                            exit="closed"
                            className="flex-1"
                          >
                            <span className="text-sm font-medium">{item.name}</span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Link>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Bottom Navigation */}
          <div className="p-4 border-t border-neutral-200 space-y-1">
            {bottomNavigation.map((item) => {
              const Icon = item.icon;
              const isActive = item.href && location.pathname === item.href;

              if (item.action) {
                return (
                  <button
                    key={item.name}
                    onClick={item.action}
                    className="cursor-pointer group flex items-center space-x-2 px-3 py-2 rounded-lg text-neutral-600 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200 w-full"
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <AnimatePresence>
                      {!isCollapsed && (
                        <motion.span
                          variants={itemVariants}
                          initial="closed"
                          animate="open"
                          exit="closed"
                          className="text-sm font-medium"
                        >
                          {item.name}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                );
              }

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${isActive
                    ? "bg-primary-100 text-primary-700 font-semibold"
                    : "text-neutral-600 hover:text-primary-600 hover:bg-primary-50"
                    }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.span
                        variants={itemVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        className="text-sm font-medium"
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              );
            })}
          </div>

          {/* User Info */}
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                variants={itemVariants}
                initial="closed"
                animate="open"
                exit="closed"
                className="p-4 border-t border-neutral-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-800 truncate">
                      {user?.firstName && user?.lastName
                        ? `${user.firstName} ${user.lastName}`
                        : user?.first_name && user?.last_name
                          ? `${user.first_name} ${user.last_name}`
                          : 'User Profile'
                      }
                    </p>
                    <p className="text-xs text-neutral-500 truncate">
                      {user?.email || 'No email provided'}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.aside>

      {/* Add Vehicle Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Your Vehicle"
        description="Enter your vehicle details to start the auction process"
      />

      {/* Logout Modal */}
      <LogoutModal
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
      />
    </>
  );
};

export default Sidebar;