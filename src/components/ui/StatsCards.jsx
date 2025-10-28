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
  showAppraisedVehicles = true,
  showUpcomingAppointments = true,
  showTotalBidValue = true
}) => {
  // Default stats structure
  const stats = {
    acceptedOffers: data?.accepted_offers || 0,
    activeAuctions: data?.active_auctions || 0,
    appraisedVehicles: data?.appraised_vehicles || 0,
    upcomingAppointments: data?.upcoming_appointments || 0,
    totalOffers: data?.total_offers || 0,
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
      key: 'appraisedVehicles',
      show: showAppraisedVehicles,
      title: 'Appraised Vehicles',
      value: stats.appraisedVehicles,
      icon: CarIcon,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      textColor: 'text-blue-600',
      description: 'Total vehicles appraised',
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
      <div className={`grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-6 ${className}`}>
        {visibleCards.map((card) => (
          <div key={card.key} className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200 animate-pulse">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
              <div className="text-right">
                <div className="h-8 w-12 bg-gray-200 rounded"></div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
              <div className="h-4 w-20 bg-gray-200 rounded"></div>
            </div>
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
      className={`grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-6 ${className}`}
    >
      {visibleCards.map((card) => {
        const IconComponent = card.icon;
        const SubIconComponent = card.subIcon;

        return (
          <motion.div key={card.key} variants={itemVariants} className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200 hover:shadow-md transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 ${card.iconBg} rounded-xl flex items-center justify-center`}>
                <IconComponent className={`w-6 h-6 ${card.iconColor}`} />
              </div>
              <div className="text-right">
                <div className="text-2xl lg:text-3xl font-bold text-neutral-800">
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
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium text-neutral-600">{card.title}</div>
              <div className={`flex items-center text-sm ${card.textColor}`}>
                <SubIconComponent className="w-4 h-4 mr-2" />
                <span>{card.description}</span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default StatsCards;