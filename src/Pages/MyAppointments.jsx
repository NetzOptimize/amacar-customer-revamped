import { useState, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, Phone, Video, ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown, ChevronDown, RefreshCw, Eye } from 'lucide-react';
import { formatDate, formatTimeRemaining } from '../lib/utils';
import { fetchAppointments, selectAppointments, selectOffersLoading, selectOffersError, cancelAppointment } from '../redux/slices/offersSlice';
import MyAppointmentsSkeleton from '../components/skeletons/MyAppointmentsSkeleton';
import MyAppointmentsSortingSkeleton from '../components/skeletons/MyAppointmentsSortingSkeleton';
import LoadMore from '../components/ui/load-more';
import useLoadMore from '../hooks/useLoadMore';
import AppointmentDetailsModal from '../components/ui/AppointmentDetailsModal';
import { useNavigate } from 'react-router-dom';

const MyAppointments = () => {
  const dispatch = useDispatch();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'pending', 'confirmed', 'cancelled', 'completed'
  const navigate = useNavigate();

  // Sorting state
  const [sortBy, setSortBy] = useState('date-asc');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSorting, setIsSorting] = useState(false);
  const [sortProgress, setSortProgress] = useState(0);
  const dropdownRef = useRef(null);

  // Status filtering state
  const [isFiltering, setIsFiltering] = useState(false);
  const [filterProgress, setFilterProgress] = useState(0);
  const [filteringTab, setFilteringTab] = useState(null); // Track which tab is being filtered

  // Modal state
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingAction, setProcessingAction] = useState('');

  // Load more configuration
  const itemsPerPage = 5;

  // Redux state
  const appointments = useSelector(selectAppointments);
  const loading = useSelector(selectOffersLoading);
  const error = useSelector(selectOffersError);

  // Fetch appointments on component mount
  useEffect(() => {
    dispatch(fetchAppointments());
  }, [dispatch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const getUpcomingAppointments = () => {
    return appointments.filter(apt => new Date(apt.start_time) > new Date());
  };

  const getTodaysAppointments = () => {
    const today = new Date();
    return appointments.filter(apt => {
      const appointmentDate = new Date(apt.start_time);
      return appointmentDate.toDateString() === today.toDateString();
    });
  };

  // Status filter options
  const statusFilterOptions = [
    { value: 'all', label: 'All Appointments', count: appointments.length, color: 'bg-slate-100 text-slate-700' },
    { value: 'pending', label: 'Pending', count: appointments.filter(apt => apt.status === 'pending').length, color: 'bg-blue-100 text-blue-700' },
    { value: 'confirmed', label: 'Confirmed', count: appointments.filter(apt => apt.status === 'confirmed').length, color: 'bg-green-100 text-green-700' },
    { value: 'cancelled', label: 'Cancelled', count: appointments.filter(apt => apt.status === 'cancelled').length, color: 'bg-red-100 text-red-700' },
    // { value: 'completed', label: 'Completed', count: appointments.filter(apt => apt.status === 'completed').length, color: 'bg-emerald-100 text-emerald-700' },
  ];

  // Sort options
  const sortOptions = [
    { value: 'date-asc', label: 'Earliest First', icon: ArrowUp, description: 'Earliest appointments' },
    { value: 'date-desc', label: 'Latest First', icon: ArrowDown, description: 'Latest appointments' },
    { value: 'dealer-asc', label: 'Dealer A-Z', icon: ArrowUp, description: 'Alphabetical by dealer' },
    { value: 'dealer-desc', label: 'Dealer Z-A', icon: ArrowDown, description: 'Reverse alphabetical' },
    { value: 'status-asc', label: 'Status A-Z', icon: ArrowUp, description: 'Alphabetical by status' },
    { value: 'status-desc', label: 'Status Z-A', icon: ArrowDown, description: 'Reverse by status' },
  ];

  // Get current selected option
  const selectedOption = sortOptions.find(option => option.value === sortBy) || sortOptions[0];

  // Modal handlers
  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setIsDetailsModalOpen(true);
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedAppointment(null);
    setIsProcessing(false);
    setProcessingAction('');
  };

  const handleCall = (appointment) => {
    // Implement call functionality
    console.log('Calling dealer:', appointment.dealer_name);
    // You can integrate with a calling service here
  };

  const handleJoin = (appointment) => {
    // Implement join meeting functionality
    console.log('Joining meeting for appointment:', appointment.id);
    // You can integrate with video calling service here
  };

  const handleReschedule = async (appointment) => {
    setIsProcessing(true);
    setProcessingAction('reschedule');

    // Simulate API call
    setTimeout(() => {
      console.log('Rescheduling appointment:', appointment.id);
      setIsProcessing(false);
      setProcessingAction('');
      // You can implement actual reschedule logic here
    }, 2000);
  };

  const handleCancel = async (appointment, notes) => {
    try {
      const response = await dispatch(cancelAppointment({
        appointmentId: appointment.id,
        notes: notes
      }));

      if (response.payload && response.payload.success) {
        console.log('Appointment cancelled successfully:', response.payload);
        // Refresh appointments list
        dispatch(fetchAppointments());
      } else {
        console.error('Failed to cancel appointment:', response.payload?.message);
      }
    } catch (error) {
      console.error('Error cancelling appointment:', error);
    }
  };

  // Handle status filter selection with loading animation
  const handleStatusFilter = (value) => {
    if (value === statusFilter) return;

    setIsFiltering(true);
    setFilterProgress(0);
    setFilteringTab(value); // Set the tab being filtered

    // Simulate filtering process with random delay and progress
    const randomDelay = Math.random() * 800 + 400; // 400-1200ms
    const progressInterval = 50; // Update progress every 50ms

    const progressTimer = setInterval(() => {
      setFilterProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressTimer);
          return 90;
        }
        return prev + Math.random() * 15;
      });
    }, progressInterval);

    setTimeout(() => {
      clearInterval(progressTimer);
      setFilterProgress(100);
      setStatusFilter(value);

      // Reset after a short delay
      setTimeout(() => {
        setIsFiltering(false);
        setFilterProgress(0);
        setFilteringTab(null); // Clear the filtering tab
      }, 200);
    }, randomDelay);
  };

  // Handle sort selection with loading animation
  const handleSortSelect = (value) => {
    if (value === sortBy) {
      setIsDropdownOpen(false);
      return;
    }

    setIsSorting(true);
    setSortProgress(0);
    setIsDropdownOpen(false);

    // Simulate sorting process with random delay and progress
    const randomDelay = Math.random() * 1000 + 500; // 500-1500ms
    const progressInterval = 50; // Update progress every 50ms

    const progressTimer = setInterval(() => {
      setSortProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressTimer);
          return 90;
        }
        return prev + Math.random() * 15;
      });
    }, progressInterval);

    setTimeout(() => {
      clearInterval(progressTimer);
      setSortProgress(100);
      setSortBy(value);

      // Reset after a short delay
      setTimeout(() => {
        setIsSorting(false);
        setSortProgress(0);
      }, 200);
      console.log(randomDelay)
    }, randomDelay);
  };

  // Filter and sort appointments based on selected options
  const filteredAndSortedAppointments = useMemo(() => {
    if (!appointments || appointments.length === 0) return [];

    // First filter by status
    let filteredAppointments = appointments;
    if (statusFilter !== 'all') {
      filteredAppointments = appointments.filter(apt => apt.status === statusFilter);
    }

    // Then sort the filtered appointments
    return [...filteredAppointments].sort((a, b) => {
      switch (sortBy) {
        case 'date-asc':
          return new Date(a.start_time) - new Date(b.start_time);
        case 'date-desc':
          return new Date(b.start_time) - new Date(a.start_time);
        case 'dealer-asc':
          return a.dealer_name.localeCompare(b.dealer_name);
        case 'dealer-desc':
          return b.dealer_name.localeCompare(a.dealer_name);
        case 'status-asc':
          return a.formatted_status.localeCompare(b.formatted_status);
        case 'status-desc':
          return b.formatted_status.localeCompare(a.formatted_status);
        default:
          return 0;
      }
    });
  }, [appointments, sortBy, statusFilter]);

  // Use load more hook
  const {
    paginatedItems: paginatedAppointments,
    hasMoreItems,
    remainingItems,
    isLoadingMore,
    handleLoadMore
  } = useLoadMore(filteredAndSortedAppointments, itemsPerPage);

  // Get sorted today's appointments
  const getSortedTodaysAppointments = () => {
    const today = new Date();
    return paginatedAppointments.filter(apt => {
      const appointmentDate = new Date(apt.start_time);
      return appointmentDate.toDateString() === today.toDateString();
    });
  };

  // Get sorted upcoming appointments
  const getSortedUpcomingAppointments = () => {
    console.log("paginatedAppointments", paginatedAppointments)
    return paginatedAppointments.filter(apt => new Date(apt.start_time) > new Date());
  };

  // Show loading state
  if (loading) {
    return <MyAppointmentsSkeleton />;
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-hero p-8">
        <div className="max-w-8xl mx-auto">
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-12 h-12 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-800 mb-2">Error Loading Appointments</h3>
            <p className="text-neutral-600 mb-6">{error}</p>
            <button
              onClick={() => dispatch(fetchAppointments())}
              className="btn-primary"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-16 min-h-screen bg-gradient-hero p-8 ">
      <div className="max-w-8xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          <motion.h1 variants={itemVariants} className="text-3xl font-bold text-neutral-800 mb-2">
            My Appointments
          </motion.h1>
          <motion.p variants={itemVariants} className="text-neutral-600">
            Manage your scheduled appointments with dealers.
          </motion.p>
        </motion.div>

        {/* Status Filter Tabs */}
        <motion.div
          variants={itemVariants}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {statusFilterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleStatusFilter(option.value)}
                disabled={isFiltering}
                className={`relative px-4 py-2.5 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 ${statusFilter === option.value
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 hover:border-slate-300'
                  } ${isFiltering && filteringTab === option.value ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {isFiltering && filteringTab === option.value && (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                )}
                <span>{option.label}</span>
                <span className={`px-2 py-0.5 text-xs rounded-full ${statusFilter === option.value
                  ? 'bg-white/20 text-white'
                  : option.color
                  }`}>
                  {option.count}
                </span>
                {isFiltering && filteringTab === option.value && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30 rounded-b-xl overflow-hidden">
                    <div
                      className="h-full bg-white/60 transition-all duration-100 ease-out"
                      style={{ width: `${filterProgress}%` }}
                    />
                  </div>
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Sorting Section */}
        {!loading && !error && appointments.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mb-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-neutral-800 mb-1">
                  {statusFilter === 'all' ? 'All Appointments' :
                    statusFilter === 'pending' ? 'Pending Appointments' :
                      statusFilter === 'confirmed' ? 'Confirmed Appointments' :
                        statusFilter === 'cancelled' ? 'Cancelled Appointments' :
                          statusFilter === 'completed' ? 'Completed Appointments' : 'Appointments'}
                </h2>
                <p className="text-sm text-neutral-600">
                  {filteredAndSortedAppointments.length} {statusFilter === 'all' ? 'scheduled' : statusFilter} appointments
                </p>
              </div>

              {/* Modern Sort Dropdown */}
              <motion.div
                variants={containerVariants}
                className="relative w-[200px]"
                ref={dropdownRef}
              >
                {/* Dropdown Trigger */}
                <button
                  onClick={() => !isSorting && setIsDropdownOpen(!isDropdownOpen)}
                  disabled={isSorting}
                  className={`cursor-pointer flex items-center gap-3 bg-white border border-neutral-200 rounded-xl px-4 py-3 hover:border-neutral-300 hover:shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent group ${isSorting ? 'opacity-75 cursor-not-allowed' : ''
                    }`}
                >
                  <div className="flex items-center gap-2">
                    {isSorting ? (
                      <RefreshCw className="w-4 h-4 text-orange-500 animate-spin" />
                    ) : (
                      <ArrowUpDown className="w-4 h-4 text-neutral-500 group-hover:text-orange-500 transition-colors" />
                    )}
                    <div className="text-left">
                      <div className="text-sm font-medium text-neutral-700">
                        {isSorting ? 'Sorting...' : selectedOption.label}
                      </div>
                    </div>
                  </div>
                  {!isSorting && (
                    <ChevronDown
                      className={`w-4 h-4 text-neutral-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''
                        }`}
                    />
                  )}
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute top-full left-0 right-0 mt-2 bg-white border border-neutral-200 rounded-xl shadow-lg z-50 overflow-hidden"
                    >
                      {sortOptions.map((option, index) => {
                        const IconComponent = option.icon;
                        const isSelected = option.value === sortBy;

                        return (
                          <button
                            key={option.value}
                            onClick={() => handleSortSelect(option.value)}
                            className={`cursor-pointer w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-neutral-50 transition-colors duration-150 ${isSelected ? 'bg-orange-50 text-orange-700' : 'text-neutral-700'
                              } ${index !== sortOptions.length - 1 ? 'border-b border-neutral-100' : ''}`}
                          >
                            <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-orange-100' : 'bg-neutral-100'
                              }`}>
                              <IconComponent className={`w-3.5 h-3.5 ${isSelected ? 'text-orange-600' : 'text-neutral-500'
                                }`} />
                            </div>
                            <div className="flex-1">
                              <div className={`text-sm font-medium ${isSelected ? 'text-orange-700' : 'text-neutral-700'
                                }`}>
                                {option.label}
                              </div>
                            </div>
                            {isSelected && (
                              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            )}
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Today's Appointments or Sorting Loading */}
        {!loading && !error && appointments.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Sorting/Filtering Loading State - Show skeleton for appointments */}
            {(isSorting || isFiltering) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <MyAppointmentsSortingSkeleton />
              </motion.div>
            )}

            {/* Appointments - Hidden during sorting/filtering */}
            {!isSorting && !isFiltering && (
              <>
                {/* Today's Appointments */}
                {getSortedTodaysAppointments().length > 0 && (
                  <motion.div variants={itemVariants} className="mb-8">
                    <h2 className="text-xl font-bold text-neutral-800 mb-4">Today's Appointments</h2>
                    <div className="space-y-4">
                      {getSortedTodaysAppointments().map((appointment) => (
                        <motion.div
                          key={appointment.id}
                          className="card p-6 border-l-4 border-primary-500"
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-primary-600" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-neutral-800">
                                  Appointment with {appointment.dealer_name}
                                </h3>
                                <p className="text-sm text-neutral-600">{appointment.dealer_email}</p>
                                <div className="flex items-center space-x-4 text-sm text-neutral-500">
                                  <span className="flex items-center space-x-1">
                                    <Clock className="w-4 h-4" />
                                    <span>{appointment.formatted_time} ({appointment.duration} min)</span>
                                  </span>
                                  <span className="flex items-center space-x-1">
                                    <span className={`px-2 py-1 text-xs rounded-full ${appointment.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                                      appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                        appointment.status === 'pending' ? 'bg-blue-100 text-blue-800' :
                                          appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                            'bg-slate-100 text-slate-800'
                                      }`}>
                                      {appointment.formatted_status}
                                    </span>
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleViewDetails(appointment)}
                                className="btn-primary flex items-center space-x-2"
                              >
                                <Calendar className="w-4 h-4" />
                                <span>View Details</span>
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Upcoming Appointments */}
                <motion.div variants={itemVariants}>
                  <h2 className="text-xl font-bold text-neutral-800 mb-4">Upcoming Appointments</h2>
                  <div className="space-y-4">
                    {getSortedUpcomingAppointments().map((appointment) => (
                      <motion.div
                        key={appointment.id}
                        className="card p-6 hover:shadow-medium transition-all duration-300"
                        whileHover={{ scale: 1.01 }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center">
                              <Calendar className="w-6 h-6 text-neutral-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-neutral-800">
                                Appointment with {appointment.dealer_name}
                              </h3>
                              <p className="text-sm text-neutral-600">{appointment.dealer_email}</p>
                              <div className="flex items-center space-x-4 text-sm text-neutral-500">
                                <span className="flex items-center space-x-1">
                                  <Clock className="w-4 h-4" />
                                  <span>{appointment.formatted_date} at {appointment.formatted_time}</span>
                                </span>
                                <span className="flex items-center space-x-1">
                                  <span className={`px-2 py-1 text-xs rounded-full ${appointment.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                                    appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                      appointment.status === 'pending' ? 'bg-blue-100 text-blue-800' :
                                        appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                          'bg-slate-100 text-slate-800'
                                    }`}>
                                    {appointment.formatted_status}
                                  </span>
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleViewDetails(appointment)}
                              className="btn-primary flex items-center space-x-2"
                            >
                              <Calendar className="w-4 h-4" />
                              <span>View Details</span>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </>
            )}
          </motion.div>
        )}

        {/* Load More Component */}
        {!loading && !error && appointments.length > 0 && (
          <LoadMore
            items={filteredAndSortedAppointments}
            itemsPerPage={itemsPerPage}
            onLoadMore={handleLoadMore}
            isLoadingMore={isLoadingMore}
            hasMoreItems={hasMoreItems}
            remainingItems={remainingItems}
            SkeletonComponent={MyAppointmentsSortingSkeleton}
            buttonText={`Load More ${statusFilter === 'all' ? 'Appointments' : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1) + ' Appointments'}`}
            loadingText="Loading appointments..."
            showRemainingCount={true}
          />
        )}

        {/* Empty State */}
        {!loading && !error && filteredAndSortedAppointments.length === 0 && (
          <motion.div
            variants={itemVariants}
            className="flex -mt-8 items-center justify-center min-h-[60vh]"
          >
            <div className="text-center max-w-md mx-auto">
              {/* Modern Icon Container */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative mb-4"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-primary-50 to-primary-100 rounded-3xl flex items-center justify-center mx-auto shadow-soft border border-primary-200">
                  <Calendar className="w-8 h-8 text-primary-500" />
                </div>
                {/* Decorative elements */}
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-warning/20 rounded-full animate-pulse-slow"></div>
                <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-accent/20 rounded-full animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
              </motion.div>

              {/* Content */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                className="space-y-4"
              >
                <h3 className="text-2xl font-bold text-neutral-800 font-display">
                  {statusFilter === 'all' ? 'No Appointments' :
                    statusFilter === 'pending' ? 'No Pending Appointments' :
                      statusFilter === 'confirmed' ? 'No Confirmed Appointments' :
                        statusFilter === 'cancelled' ? 'No Cancelled Appointments' :
                          statusFilter === 'completed' ? 'No Completed Appointments' : 'No Appointments'}
                </h3>
                <p className="text-neutral-600 text-lg leading-relaxed">
                  {statusFilter === 'all' ? 'You don\'t have any scheduled appointments at the moment.' :
                    statusFilter === 'pending' ? 'You don\'t have any pending appointments.' :
                      statusFilter === 'confirmed' ? 'You don\'t have any confirmed appointments.' :
                        statusFilter === 'cancelled' ? 'You don\'t have any cancelled appointments.' :
                          statusFilter === 'completed' ? 'You don\'t have any completed appointments.' :
                            'You don\'t have any appointments in this category.'}
                </p>
              </motion.div>

              {/* Action Buttons */}
              {statusFilter === 'all' && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
                  className="flex flex-col sm:flex-row gap-4 mt-4"
                >
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    onClick={() => { navigate('/accepted') }}
                    className="cursor-pointer w-60 px-4 h-16 group relative bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:shadow-xl hover:shadow-primary-500/25 focus:outline-none focus:ring-4 focus:ring-primary-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <div className="flex items-center justify-between">
                      <Calendar className="transition-transform duration-300 group-hover:scale-110" />
                      <span className="text-md">Schedule Appointment</span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    onClick={() => navigate('/dashboard')}
                    className="cursor-pointer w-60 px-4 h-16 group relative overflow-hidden bg-white hover:bg-neutral-50 text-neutral-700 font-semibold py-4 rounded-2xl border-2 border-neutral-200 hover:border-neutral-300 transition-all duration-300 transform hover:shadow-lg hover:shadow-neutral-500/10 focus:outline-none focus:ring-4 focus:ring-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <div className="flex items-center justify-center space-x-3">
                      <Eye className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                      <span className="text-lg">View Dashboard</span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-neutral-100/0 via-neutral-100/50 to-neutral-100/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
                  </motion.button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Appointment Details Modal */}
      <AppointmentDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetailsModal}
        appointment={selectedAppointment}
        onCancel={handleCancel}
        onReschedule={handleReschedule}
        onCall={handleCall}
        onJoin={handleJoin}
        isProcessing={isProcessing}
        processingAction={processingAction}
      />
    </div>
  );
};

export default MyAppointments;
