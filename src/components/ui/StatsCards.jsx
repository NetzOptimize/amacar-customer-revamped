import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Gavel, Car as CarIcon, Calendar as CalendarIcon, DollarSign as DollarIcon, TrendingUp, Clock, Car } from 'lucide-react';
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
    totalBidValue: data?.total_bid_value || 0,
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
      title: 'Total Bid Value',
      value: stats.totalBidValue,
      icon: DollarIcon,
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      textColor: 'text-emerald-600',
      description: 'total offers',
      subIcon: TrendingUp,
      isCurrency: true
    }
  ];

  // Filter cards based on show props
  const visibleCards = cardsToShow.filter(card => card.show);

  if (loading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${Math.min(visibleCards.length, 5)} gap-6 ${className}`}>
        {visibleCards.map((card) => (
          <div key={card.key} className="card p-6 animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
              <div className="text-right">
                <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
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
      className={`grid grid-cols-1 md:grid-cols-5 lg:grid-cols-${Math.min(visibleCards.length, 5)} gap-6 ${className}`}
    >
      {visibleCards.map((card) => {
        const IconComponent = card.icon;
        const SubIconComponent = card.subIcon;
        
        return (
          <motion.div key={card.key} variants={itemVariants} className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${card.iconBg} rounded-xl flex items-center justify-center`}>
                <IconComponent className={`w-6 h-6 ${card.iconColor}`} />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-neutral-800">
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
                <div className="text-sm text-neutral-600">{card.title}</div>
              </div>
            </div>
            <div className={`flex items-center text-sm ${card.textColor}`}>
              <SubIconComponent className="w-4 h-4 mr-1" />
              <span>{card.description}</span>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default StatsCards;
