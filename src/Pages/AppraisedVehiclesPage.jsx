import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Car, 
  Calendar, 
  DollarSign, 
  MapPin, 
  Eye, 
  ChevronDown,
  ArrowUpDown,
  MoreHorizontal,
  Gavel
} from 'lucide-react';
import api from '../lib/api';
import toast from 'react-hot-toast';
import { formatCurrency, formatDate } from '../lib/utils';
import Pagination from '../components/ui/pagination';
import AppraisedVehiclesSkeleton from '../components/skeletons/AppraisedVehiclesSkeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { Button } from '../components/ui/button';
import { setProductId } from '../redux/slices/carDetailsAndQuestionsSlice';

const AppraisedVehiclesPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('date-desc');
  const [isSorting, setIsSorting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [vehicles, setVehicles] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 20,
    total: 0,
    total_pages: 0,
    has_more: false
  });
  const [error, setError] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const dropdownRef = React.useRef(null);
  const itemsPerPage = 20;

  // Check screen size for responsive design
  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Fetch appraised vehicles from API
  const fetchAppraisedVehicles = async (page = 1, perPage = 20) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await api.get('/dashboard/appraised-vehicles', {
        params: {
          page,
          per_page: perPage
        }
      });

      if (response.data.success) {
        setVehicles(response.data.vehicles || []);
        setPagination({
          current_page: response.data.page || page,
          per_page: response.data.per_page || perPage,
          total: response.data.total_count || 0,
          total_pages: response.data.total_pages || 0,
          has_more: response.data.has_more || false
        });
      } else {
        throw new Error(response.data.message || 'Failed to fetch appraised vehicles');
      }
    } catch (error) {
      console.error('Error fetching appraised vehicles:', error);
      setError(error.response?.data?.message || error.message || 'Failed to fetch appraised vehicles');
      toast.error('Failed to load appraised vehicles. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on component mount and when page changes
  useEffect(() => {
    fetchAppraisedVehicles(currentPage, itemsPerPage);
  }, [currentPage]);

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

  // Sort options
  const sortOptions = [
    { value: 'date-desc', label: 'Newest First', icon: ArrowUpDown },
    { value: 'date-asc', label: 'Oldest First', icon: ArrowUpDown },
    { value: 'offer-desc', label: 'Highest Offer', icon: DollarSign },
    { value: 'offer-asc', label: 'Lowest Offer', icon: DollarSign },
    { value: 'make-asc', label: 'Make (A-Z)', icon: Car },
    { value: 'make-desc', label: 'Make (Z-A)', icon: Car },
  ];

  // Sort vehicles
  const sortedVehicles = useMemo(() => {
    if (!vehicles.length) return [];
    
    const sorted = [...vehicles];
    
    switch (sortBy) {
      case 'date-desc':
        return sorted.sort((a, b) => {
          const dateA = new Date(a.appraisal_date || a.post_date);
          const dateB = new Date(b.appraisal_date || b.post_date);
          return dateB - dateA;
        });
      case 'date-asc':
        return sorted.sort((a, b) => {
          const dateA = new Date(a.appraisal_date || a.post_date);
          const dateB = new Date(b.appraisal_date || b.post_date);
          return dateA - dateB;
        });
      case 'offer-desc':
        return sorted.sort((a, b) => {
          const offerA = a.cash_offer || 0;
          const offerB = b.cash_offer || 0;
          return offerB - offerA;
        });
      case 'offer-asc':
        return sorted.sort((a, b) => {
          const offerA = a.cash_offer || 0;
          const offerB = b.cash_offer || 0;
          return offerA - offerB;
        });
      case 'make-asc':
        return sorted.sort((a, b) => {
          const makeA = (a.make || '').toLowerCase();
          const makeB = (b.make || '').toLowerCase();
          return makeA.localeCompare(makeB);
        });
      case 'make-desc':
        return sorted.sort((a, b) => {
          const makeA = (a.make || '').toLowerCase();
          const makeB = (b.make || '').toLowerCase();
          return makeB.localeCompare(makeA);
        });
      default:
        return sorted;
    }
  }, [vehicles, sortBy]);

  // Handle sort change
  const handleSortChange = (newSortBy) => {
    if (newSortBy !== sortBy) {
      setIsSorting(true);
      setSortBy(newSortBy);
      setIsDropdownOpen(false);
      
      setTimeout(() => {
        setIsSorting(false);
      }, 300);
    }
  };

  // Handle page change
  const handlePageChange = (page) => {
    setTimeout(() => {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  // Handle view vehicle
  const handleViewVehicle = (vehicleId) => {
    navigate(`/car-details`, { state: { productId: vehicleId } });
  };

  // Check if offer is still valid (current date should be at most 7 days in future of appraisal_date)
  const isOfferValid = (appraisalDate) => {
    if (!appraisalDate) return false;
    const appraisal = new Date(appraisalDate);
    const now = new Date();
    
    // Calculate difference in milliseconds
    const diffTime = now - appraisal;
    // Convert to days
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    
    // Offer is valid if current date is at most 7 days after appraisal_date
    return diffDays >= 0 && diffDays <= 7;
  };

  // Handle auction action
  const handleAuctionVehicle = (vehicle) => {
    if (!isOfferValid(vehicle.appraisal_date)) {
      toast.error('This offer has expired');
      return;
    }
    
    // Set productId in Redux
    dispatch(setProductId(vehicle.product_id));
    
    // Navigate to local-auction page
    navigate('/local-auction', { 
      state: { 
        productId: vehicle.product_id,
        vin: vehicle.vin,
        zipCode: vehicle.zip_code
      } 
    });
  };

  // Get selected sort option
  const selectedSort = sortOptions.find(opt => opt.value === sortBy) || sortOptions[0];

  // Calculate pagination display
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3 },
    },
  };

  const headerVariants = {
    initial: { opacity: 0, y: 30 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  const contentVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut', delay: 0.2 },
    },
  };

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
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.div
      className="min-h-screen bg-gray-50 pt-10 md:pt-24 px-4 md:px-6"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="max-w-8xl mx-auto px-4 md:px-6">
        {/* Header Section */}
        {!isLoading && (
          <motion.div className="mb-6" variants={headerVariants}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-neutral-900">
                  Appraised Vehicles
                </h1>
                <p className="text-neutral-600 mt-1">
                  View all your previously appraised vehicles and offers
                </p>
              </div>
              <div className="flex items-center gap-3">
                {/* Sort Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors text-sm font-medium text-neutral-700 min-w-[180px] justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <selectedSort.icon className="w-4 h-4" />
                      <span>{selectedSort.label}</span>
                    </div>
                    <ChevronDown 
                      className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
                    />
                  </button>
                  
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-56 bg-white border border-neutral-200 rounded-lg shadow-lg z-50 overflow-hidden"
                    >
                      {sortOptions.map((option) => {
                        const Icon = option.icon;
                        return (
                          <button
                            key={option.value}
                            onClick={() => handleSortChange(option.value)}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-neutral-50 transition-colors ${
                              sortBy === option.value
                                ? 'bg-orange-50 text-orange-600 font-medium'
                                : 'text-neutral-700'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            <span>{option.label}</span>
                            {sortBy === option.value && (
                              <span className="ml-auto text-orange-600">✓</span>
                            )}
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Content Section */}
        <motion.div
          variants={contentVariants}
          key={currentPage}
        >
          {isLoading || isSorting ? (
            <AppraisedVehiclesSkeleton />
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Failed to load vehicles
                </h3>
                <p className="text-gray-600 mb-4">{error}</p>
                <button
                  onClick={() => fetchAppraisedVehicles(currentPage, itemsPerPage)}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : sortedVehicles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Car className="w-16 h-16 text-neutral-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No appraised vehicles found
              </h3>
              <p className="text-gray-600">
                You haven't appraised any vehicles yet.
              </p>
            </div>
          ) : (
            <motion.div
              className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 mb-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Table Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Car className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900">
                      Appraised Vehicles
                    </h3>
                    <p className="text-sm text-neutral-600">
                      All appraised vehicles and their offers
                    </p>
                  </div>
                </div>
                <div className="text-sm text-neutral-500">
                  Showing {startIndex + 1}-{Math.min(endIndex, pagination.total)} of{' '}
                  {pagination.total} vehicles
                </div>
              </div>

              {/* Desktop Table Layout */}
              {isDesktop && (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[1000px]">
                    <thead>
                      <tr className="border-b border-neutral-200">
                        <th className="text-left py-4 px-4 text-neutral-600 font-medium text-sm w-[20%]">
                          Vehicle
                        </th>
                        <th className="text-left py-4 px-4 text-neutral-600 font-medium text-sm w-[12%]">
                          VIN
                        </th>
                        <th className="text-left py-4 px-4 text-neutral-600 font-medium text-sm w-[10%]">
                          Mileage
                        </th>
                        <th className="text-left py-4 px-4 text-neutral-600 font-medium text-sm w-[12%]">
                          Cash Offer
                        </th>
                        <th className="text-left py-4 px-4 text-neutral-600 font-medium text-sm w-[14%]">
                          Appraised Date
                        </th>
                        <th className="text-left py-4 px-4 text-neutral-600 font-medium text-sm w-[16%]">
                          Location
                        </th>
                        <th className="text-right py-4 px-4 text-neutral-600 font-medium text-sm w-[10%]">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedVehicles.map((vehicle, index) => (
                        <motion.tr
                          key={vehicle.product_id}
                          variants={itemVariants}
                          className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors duration-200"
                        >
                          <td className="py-4 px-4">
                            <div>
                              <div className="font-semibold text-neutral-900 text-sm">
                                {vehicle.title || `${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                              </div>
                              <div className="text-xs text-neutral-500 mt-0.5">
                                {vehicle.year} {vehicle.make} {vehicle.model}
                                {vehicle.trim && vehicle.trim !== 'N/A' && ` • ${vehicle.trim}`}
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-xs text-neutral-700 font-mono">
                              {vehicle.vin && vehicle.vin !== 'N/A' ? vehicle.vin : 'N/A'}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-sm text-neutral-700">
                              {vehicle.mileage && vehicle.mileage !== 'N/A' 
                                ? (typeof vehicle.mileage === 'number' 
                                    ? vehicle.mileage.toLocaleString() 
                                    : vehicle.mileage) + ' mi'
                                : 'N/A'}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            {vehicle.cash_offer ? (
                              <div className="font-semibold text-green-600 text-sm">
                                {formatCurrency(vehicle.cash_offer)}
                              </div>
                            ) : (
                              <div className="text-sm text-neutral-400">
                                Not available
                              </div>
                            )}
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-sm text-neutral-700">
                              {vehicle.appraisal_date_formatted || 
                               (vehicle.appraisal_date 
                                 ? formatDate(vehicle.appraisal_date) 
                                 : 'N/A')}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-sm text-neutral-700">
                              {vehicle.zip_code && vehicle.zip_code !== 'N/A' ? (
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-neutral-400" />
                                  <span>
                                    {vehicle.zip_code}
                                    {vehicle.city && vehicle.state && (
                                      <span className="ml-1">
                                        {vehicle.city}, {vehicle.state}
                                      </span>
                                    )}
                                  </span>
                                </div>
                              ) : (
                                'N/A'
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <div className="flex justify-end items-center">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 w-8 p-0 hover:bg-neutral-100 cursor-pointer"
                                  >
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  align="end"
                                  side="bottom"
                                  sideOffset={4}
                                  className="w-56 bg-white border border-neutral-200 rounded-xl shadow-lg p-2 overflow-hidden backdrop-blur-sm bg-opacity-90 z-50"
                                >
                                  <DropdownMenuItem
                                    onClick={() => handleViewVehicle(vehicle.product_id)}
                                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-neutral-700 rounded-lg cursor-pointer hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100 hover:text-orange-700 focus:bg-orange-50 focus:text-orange-700 focus:outline-none transition-all duration-200 group"
                                  >
                                    <Eye className="w-4 h-4 text-neutral-500 group-hover:text-orange-600 group-focus:text-orange-600 transition-colors duration-200" />
                                    <span>View Details</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleAuctionVehicle(vehicle)}
                                    className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group ${
                                      isOfferValid(vehicle.appraisal_date)
                                        ? 'text-neutral-700 cursor-pointer hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100 hover:text-orange-700 focus:bg-orange-50 focus:text-orange-700 focus:outline-none'
                                        : 'text-red-600 cursor-pointer hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 hover:text-red-700 focus:bg-red-50 focus:text-red-700 focus:outline-none'
                                    }`}
                                  >
                                    <Gavel className={`w-4 h-4 transition-colors duration-200 ${
                                      isOfferValid(vehicle.appraisal_date)
                                        ? 'text-neutral-500 group-hover:text-orange-600 group-focus:text-orange-600'
                                        : 'text-red-500 group-hover:text-red-600 group-focus:text-red-600'
                                    }`} />
                                    <span>{isOfferValid(vehicle.appraisal_date) ? 'Auction it' : 'Offer expired'}</span>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Mobile Card Layout */}
              {!isDesktop && (
                <div className="space-y-4">
                  {sortedVehicles.map((vehicle, index) => (
                    <motion.div
                      key={vehicle.product_id}
                      variants={itemVariants}
                      whileHover={{ y: -2 }}
                      className="bg-neutral-50 rounded-xl p-4 border border-neutral-200 hover:shadow-md transition-all duration-200"
                    >
                      <div className="space-y-3">
                        {/* Vehicle Title */}
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-neutral-900 text-base">
                            {vehicle.title || `${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                          </h4>
                        </div>

                        {/* Vehicle Details */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-neutral-600">Year/Make/Model</span>
                            <span className="text-sm font-medium text-neutral-800">
                              {vehicle.year} {vehicle.make} {vehicle.model}
                            </span>
                          </div>
                          {vehicle.trim && vehicle.trim !== 'N/A' && (
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-neutral-600">Trim</span>
                              <span className="text-sm text-neutral-700">{vehicle.trim}</span>
                            </div>
                          )}
                          {vehicle.vin && vehicle.vin !== 'N/A' && (
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-neutral-600">VIN</span>
                              <span className="text-xs text-neutral-700 font-mono">
                                {vehicle.vin}
                              </span>
                            </div>
                          )}
                          {vehicle.mileage && vehicle.mileage !== 'N/A' && (
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-neutral-600">Mileage</span>
                              <span className="text-sm text-neutral-700">
                                {typeof vehicle.mileage === 'number' 
                                  ? vehicle.mileage.toLocaleString() 
                                  : vehicle.mileage} mi
                              </span>
                            </div>
                          )}
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-neutral-600">Cash Offer</span>
                            {vehicle.cash_offer ? (
                              <span className="text-sm font-bold text-green-600">
                                {formatCurrency(vehicle.cash_offer)}
                              </span>
                            ) : (
                              <span className="text-sm text-neutral-400">Not available</span>
                            )}
                          </div>
                          {vehicle.appraisal_date_formatted && (
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-neutral-600">Appraised</span>
                              <span className="text-xs text-neutral-700">
                                {vehicle.appraisal_date_formatted}
                              </span>
                            </div>
                          )}
                          {vehicle.zip_code && vehicle.zip_code !== 'N/A' && (
                            <div className="flex justify-between items-start">
                              <span className="text-xs text-neutral-600">Location</span>
                              <span className="text-xs text-neutral-700 text-right max-w-[200px]">
                                <div className="flex items-center gap-1 justify-end">
                                  <MapPin className="w-3 h-3 text-neutral-400" />
                                  <span>
                                    {vehicle.zip_code}
                                    {vehicle.city && vehicle.state && (
                                      <span className="ml-1">
                                        {vehicle.city}, {vehicle.state}
                                      </span>
                                    )}
                                  </span>
                                </div>
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-3">
                          <Button
                            onClick={() => handleViewVehicle(vehicle.product_id)}
                            variant="outline"
                            size="sm"
                            className="flex-1 h-10 text-sm hover:bg-orange-50 hover:text-orange-700 hover:border-orange-300"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                          <Button
                            onClick={() => handleAuctionVehicle(vehicle)}
                            variant={isOfferValid(vehicle.appraisal_date) ? "default" : "outline"}
                            size="sm"
                            className={`flex-1 h-10 text-sm ${
                              isOfferValid(vehicle.appraisal_date)
                                ? 'bg-orange-600 hover:bg-orange-700 text-white'
                                : 'border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-400'
                            }`}
                          >
                            <Gavel className="w-4 h-4 mr-2" />
                            {isOfferValid(vehicle.appraisal_date) ? 'Auction it' : 'Offer expired'}
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Pagination */}
        <AnimatePresence mode="wait">
          {!isLoading && !isSorting && !error && pagination.total_pages > 1 && (
            <motion.div
              className="flex justify-center pt-6 border-t border-neutral-100 mt-6"
              variants={contentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <Pagination
                currentPage={pagination.current_page}
                totalPages={pagination.total_pages}
                onPageChange={handlePageChange}
                className="w-full max-w-md mb-4"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default AppraisedVehiclesPage;
