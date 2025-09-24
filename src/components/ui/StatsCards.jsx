import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Gavel, Car as CarIcon, Calendar as CalendarIcon, DollarSign as DollarIcon, TrendingUp, Clock, Car, GavelIcon } from 'lucide-react';
import CountUp from 'react-countup';

const StatsCards = ({ 
  data, 
  loading = false, 
  className = "",
  showAcceptedOffers = true,
  showActiveAuctions = true,
  showTotalVehicles = true,
  showUpcomingAppointments = true,
  showTotalBidValue = true
}) => {
  // Default stats structure
  const stats = {
    acceptedOffers: data?.accepted_offers || 0,
    activeAuctions: data?.active_auctions || 0,
    totalVehicles: data?.total_vehicles || 0,
    upcomingAppointments: data?.upcoming_appointments || 0,
    totalOffers: data?.total_offers + data?.total_bid_value || 0,
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
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  // Define which cards to show
  const cardsToShow = [
    {
      key: 'acceptedOffers',
      show: showAcceptedOffers,
      title: 'Accepted Offers',
      value: stats.acceptedOffers,
      icon: CheckCircle,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      textColor: 'text-green-600',
      description: 'Offers accepted',
      subIcon: TrendingUp
    },
    {
      key: 'activeAuctions',
      show: showActiveAuctions,
      title: 'Active Auctions',
      value: stats.activeAuctions,
      icon: Gavel,
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      textColor: 'text-orange-600',
      description: 'Currently live',
      subIcon: Clock
    },
    {
      key: 'totalVehicles',
      show: showTotalVehicles,
      title: 'Total Vehicles',
      value: stats.totalVehicles,
      icon: CarIcon,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      textColor: 'text-blue-600',
      description: 'In your fleet',
      subIcon: Car
    },
    {
      key: 'upcomingAppointments',
      show: showUpcomingAppointments,
      title: 'Upcoming Appointments',
      value: stats.upcomingAppointments,
      icon: CalendarIcon,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      textColor: 'text-purple-600',
      description: 'Scheduled visits',
      subIcon: CalendarIcon
    },
    {
      key: 'totalBidValue',
      show: showTotalBidValue,
      title: 'Overall Bids',
      value: stats.totalOffers,
      icon: GavelIcon,
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      textColor: 'text-emerald-600',
      description: 'Total Offers',
      subIcon: TrendingUp,
      isCurrency: false
    }
  ];

  // Filter cards based on show props
  const visibleCards = cardsToShow.filter(card => card.show);

  if (loading) {
    return (
      <div className={`grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-6 ${className}`}>
        {visibleCards.map((card) => (
          <div key={card.key} className="card p-3 sm:p-4 md:p-5 lg:p-6 xl:p-6 2xl:p-7 animate-pulse">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 sm:mb-3 md:mb-4 lg:mb-4 xl:mb-5">
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 2xl:w-18 2xl:h-18 bg-gray-200 rounded-xl mb-2 sm:mb-0"></div>
              <div className="text-left sm:text-right">
                <div className="h-4 sm:h-5 md:h-6 lg:h-7 xl:h-8 2xl:h-9 bg-gray-200 rounded w-10 sm:w-12 md:w-14 lg:w-16 xl:w-18 2xl:w-20 mb-1 sm:mb-2"></div>
                <div className="h-3 sm:h-3 md:h-4 lg:h-4 xl:h-4 2xl:h-5 bg-gray-200 rounded w-14 sm:w-16 md:w-18 lg:w-20 xl:w-22 2xl:w-24"></div>
              </div>
            </div>
            <div className="h-3 sm:h-3 md:h-4 lg:h-4 xl:h-4 2xl:h-5 bg-gray-200 rounded w-16 sm:w-20 md:w-22 lg:w-24 xl:w-26 2xl:w-28"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-6 ${className}`}
    >
      {visibleCards.map((card) => {
        const IconComponent = card.icon;
        const SubIconComponent = card.subIcon;
        
        return (
          <motion.div key={card.key} variants={itemVariants} className="card p-3 sm:p-4 md:p-5 lg:p-6 xl:p-6 2xl:p-7">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 sm:mb-3 md:mb-4 lg:mb-4 xl:mb-5">
              <div className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 2xl:w-18 2xl:h-18 ${card.iconBg} rounded-xl flex items-center justify-center mb-2 sm:mb-0`}>
                <IconComponent className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 2xl:w-9 2xl:h-9 ${card.iconColor}`} />
              </div>
              <div className="text-left sm:text-right">
                <div className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl font-bold text-neutral-800">
                  {card.isCurrency ? (
                    <CountUp 
                      end={card.value} 
                      duration={1} 
                      prefix="$" 
                      separator="," 
                    />
                  ) : (
                    <CountUp end={card.value} duration={1} />
                  )}
                </div>
                <div className="text-xs sm:text-sm md:text-sm lg:text-base xl:text-base 2xl:text-lg text-neutral-600">{card.title}</div>
              </div>
            </div>
            <div className={`flex items-center text-xs sm:text-sm md:text-sm lg:text-base xl:text-base 2xl:text-lg ${card.textColor}`}>
              <SubIconComponent className="w-3 h-3 sm:w-3 sm:h-3 md:w-4 md:h-4 lg:w-4 lg:h-4 xl:w-5 xl:h-5 2xl:w-5 2xl:h-5 mr-1 sm:mr-1 md:mr-2 lg:mr-2 xl:mr-2" />
              <span className="truncate text-xs sm:text-sm md:text-sm lg:text-base xl:text-base 2xl:text-lg">{card.description}</span>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default StatsCards;