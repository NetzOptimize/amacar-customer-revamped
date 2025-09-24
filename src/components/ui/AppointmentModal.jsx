import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Loader2, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  User, 
  Mail, 
  Car, 
  Sparkles, 
  XCircle,
  ChevronDown,
  FileText,
  X
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useSelector, useDispatch } from "react-redux";
import { createAppointments, rescheduleAppointment } from "@/redux/slices/offersSlice";

export default function AppointmentModal({
  isOpen,
  onClose,
  dealerName = "Premium Auto Dealer",
  dealerId,
  dealerEmail = "contact@premiumauto.com",
  vehicleInfo = "2024 Tesla Model S",
  onAppointmentSubmit,
  title = "Schedule Appointment",
  description = "Choose your preferred date and time",
  // Reschedule mode props
  isReschedule = false,
  appointmentToReschedule = null,
  onRescheduleSubmit
}) {
  const [phase, setPhase] = useState("form");
  const [selectedDate, setSelectedDate] = useState();
  const [selectedTime, setSelectedTime] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState({});
  const [showCalendar, setShowCalendar] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [appointmentData, setAppointmentData] = useState(null);
  const calendarRef = useRef(null);
  const dispatch = useDispatch();
  const {acceptedOffers, appointmentOperationLoading} = useSelector(state => state.offers);
  const {user} = useSelector(state => state.user);

  useEffect(() => {
    console.log("user.id", user.id)
  })

  // Simplified time slots (hourly only)
  const timeSlots = [
    "9:00", "10:00", "11:00", "12:00", 
    "13:00", "14:00", "15:00", "16:00", 
    "17:00", "18:00"
  ];

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      resetFormState();
    }
  }, [isOpen]);

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    };

    if (showCalendar) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCalendar]);

  // Disable past dates - ensure we're working with today's date properly
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Function to check if a date is before today
  const isDateDisabled = (date) => {
    const dateToCheck = new Date(date);
    dateToCheck.setHours(0, 0, 0, 0);
    return dateToCheck < today;
  };

  // Reset form state
  const resetFormState = () => {
    setPhase("form");
    setSelectedDate(undefined);
    setSelectedTime("");
    setNotes("");
    setErrors({});
    setShowCalendar(false);
    setErrorMessage("");
    setAppointmentData(null);
    
    // Pre-populate form for reschedule mode
    if (isReschedule && appointmentToReschedule) {
      // Parse the existing appointment date and time
      if (appointmentToReschedule.start_time && appointmentToReschedule.start_time !== "0000-00-00 00:00:00") {
        const appointmentDate = new Date(appointmentToReschedule.start_time);
        setSelectedDate(appointmentDate);
        
        // Extract time from start_time
        const timeString = appointmentToReschedule.start_time.split(' ')[1];
        if (timeString) {
          const [hours, minutes] = timeString.split(':');
          setSelectedTime(`${hours}:${minutes}`);
        }
      }
      
      // Pre-populate notes if available
      if (appointmentToReschedule.notes) {
        setNotes(appointmentToReschedule.notes);
      }
    }
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!selectedDate) {
      newErrors.date = "Please select a date";
    }
    
    if (!selectedTime) {
      newErrors.time = "Please select a time";
    }
    
    // For reschedule mode, check if the new time is at least 2 hours from now
    if (isReschedule && selectedDate && selectedTime) {
      const now = new Date();
      const selectedDateTime = new Date(selectedDate);
      const [hours, minutes] = selectedTime.split(':');
      selectedDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      
      const timeDifference = selectedDateTime.getTime() - now.getTime();
      const hoursDifference = timeDifference / (1000 * 60 * 60);
      
      if (hoursDifference < 2 && hoursDifference > 0) {
        newErrors.time = "Appointment must be scheduled at least 2 hours from now";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setPhase("loading");
    setErrorMessage("");
    
    try {
      // Format date as YYYY-MM-DD
      const formattedDate = selectedDate.toISOString().split('T')[0];
      // Format time as HH:mm
      const formattedTime = selectedTime.padStart(5, '0');
      
      // Merge into one string
      const start_time = `${formattedDate} ${formattedTime}:00`;
      
      let response;
      
      if (isReschedule && appointmentToReschedule) {
        // Reschedule existing appointment
        const reschedulePayload = {
          appointmentId: appointmentToReschedule.id,
          start_time: start_time,
          notes: notes.trim()
        };
        
        response = await dispatch(rescheduleAppointment(reschedulePayload));
        console.log("reschedule response", response);
      } else {
        // Create new appointment
        const appointmentPayload = {
          dealerId,
          userId: user.id,
          start_time: start_time,
          notes: notes.trim()
        };
        
        response = await dispatch(createAppointments(appointmentPayload));
        console.log("create response", response);
      }
      
      if (response.payload && response.payload.success) {
        // Success case (201) - Handle invalid date formatting
        const appointment = response.payload.appointment;
        if (appointment) {
          // Create a copy of the appointment object to avoid read-only property error
          const appointmentCopy = { ...appointment };
          
          // Fix invalid date formatting
          if (appointmentCopy.start_time === "0000-00-00 00:00:00" || appointmentCopy.formatted_start_time?.includes("-0001")) {
            // Use the selected date and time for display
            const displayDate = new Date(selectedDate);
            appointmentCopy.formatted_start_time = `${displayDate.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })} at ${selectedTime}`;
          }
          setAppointmentData(appointmentCopy);
        }
        setPhase("success");
      } else if (response.payload && !response.payload.success) {
        // Error cases (400, 403)
        const errorMessage = response.payload.message || "Something went wrong. Please try again.";
        
        // Handle specific error cases
        if (errorMessage.includes("Cannot reschedule appointment") && errorMessage.includes("hours")) {
          // Too late to reschedule error
          setErrorMessage(errorMessage);
        } else if (errorMessage.includes("already have an appointment scheduled")) {
          // Duplicate appointment error
          setErrorMessage(errorMessage);
        } else if (errorMessage.includes("not authorized")) {
          // Authorization error
          setErrorMessage("You are not authorized to reschedule this appointment.");
        } else {
          // Generic error
          setErrorMessage(errorMessage);
        }
        
        setPhase("failed");
      } else {
        // Unexpected response format
        setErrorMessage("Something went wrong. Please try again.");
        setPhase("failed");
      }
      
    } catch (error) {
      console.error("Appointment operation error:", error);
      setErrorMessage("Network error. Please check your connection and try again.");
      setPhase("failed");
    }
  };

  // Handle modal close
  const handleClose = (open) => {
    if (!open && phase !== "loading" && !appointmentOperationLoading) {
      onClose(false);
    }
  };

  // Handle close button click
  const handleCloseClick = () => {
    if (phase !== "loading" && !appointmentOperationLoading) {
      onClose(false);
    }
  };

  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const formatFullDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Helper function to truncate notes for display
  const truncateNotes = (notes, maxLength = 50) => {
    if (!notes || notes.length <= maxLength) return notes;
    return notes.substring(0, maxLength) + '...';
  };

  const isCloseDisabled = phase === "loading" || appointmentOperationLoading;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className="sm:max-w-[800px] w-full max-h-[90vh] sm:max-h-[85vh] rounded-2xl shadow-2xl p-0 overflow-y-auto overflow-x-hidden bg-white border-0 "
        showCloseButton={!isCloseDisabled}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="relative bg-[#f6851f] p-3 sm:p-6 text-white">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent"></div>
            <div className="relative z-10">
              <div className="flex items-start justify-between">
                <div className="flex-1 pr-8">
                  <DialogTitle className="text-base sm:text-lg font-bold mb-1 break-words">
                    {isReschedule ? "Reschedule Appointment" : title}
                  </DialogTitle>
                  <DialogDescription className="text-white text-xs sm:text-sm break-words">
                    {isReschedule ? "Choose a new date and time for your appointment" : description}
                  </DialogDescription>
                </div>
                {/* Custom Close Button for Mobile */}
                <button
                  onClick={handleCloseClick}
                  disabled={isCloseDisabled}
                  className="absolute top-0 right-0  sm:hidden p-1 rounded-full hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4 text-black " />
                </button>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-orange-500/10 rounded-full blur-xl"></div>
            <div className="absolute -bottom-2 -left-2 w-12 h-12 bg-orange-500/20 rounded-full blur-lg"></div>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-3 sm:p-6 md:p-8 overflow-y-auto">
            <AnimatePresence mode="wait">
              {phase === "form" && (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="flex flex-col gap-3 sm:gap-6"
                >
                  {/* Dealer Info Card */}
                  <div className="w-full bg-slate-50 rounded-xl p-3 sm:p-4 border border-slate-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 sm:w-7 sm:h-7 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Car className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                      </div>
                      <h3 className="font-semibold text-slate-800 text-xs sm:text-sm break-words">Appointment Details</h3>
                    </div>
                    <div className="space-y-1.5 text-xs text-slate-600">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <User className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{dealerName}</span>
                      </div>
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Mail className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{dealerEmail}</span>
                      </div>
                      {vehicleInfo && (
                        <div className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-md inline-block break-words max-w-full">
                          {vehicleInfo}
                        </div>
                      )}
                    </div>
                  </div>

                   {/* Selected Appointment Summary - Mobile: Below details, Desktop: Side by side */}
                   {selectedDate && selectedTime && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="w-full bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-3 sm:p-4"
                    >
                      <h4 className="text-xs sm:text-sm font-semibold text-orange-800 mb-2 flex items-center gap-2">
                        <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span className="break-words">Appointment Summary</span>
                      </h4>
                      <div className="text-xs sm:text-sm text-orange-700 space-y-1">
                        <p className="break-words"><strong>Date:</strong> {formatFullDate(selectedDate)}</p>
                        <p className="break-words"><strong>Time:</strong> {selectedTime}</p>
                        {notes && (
                          <p className="break-words"><strong>Notes:</strong> {truncateNotes(notes)}</p>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Date & Time Selection */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6">
                    {/* Date Selection */}
                    <div ref={calendarRef} className="relative">
                      <label className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        Date
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowCalendar(!showCalendar)}
                        className="cursor-pointer w-full h-10 sm:h-12 rounded-lg border-2 border-slate-200 bg-white hover:border-orange-500 transition-all duration-200 flex items-center justify-between px-3 group"
                      >
                        <span className={`text-xs sm:text-sm ${selectedDate ? 'text-slate-900 font-medium' : 'text-slate-500'} truncate`}>
                          {selectedDate ? formatDate(selectedDate) : 'Select date'}
                        </span>
                        <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400 group-hover:text-orange-500 transition-colors flex-shrink-0" />
                      </button>
                      <AnimatePresence>
                        {showCalendar && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            transition={{ duration: 0.15 }}
                            className="absolute z-50 mt-2 bg-white rounded-lg border border-slate-200 shadow-lg p-2 sm:p-4 w-full max-w-[calc(100vw-0.5rem)] sm:max-w-none left-0 right-0"
                          >
                            <div className="w-full text-center">
                                <CalendarComponent
                                mode="single"
                                selected={selectedDate}
                                onSelect={(date) => {
                                    setSelectedDate(date);
                                    setShowCalendar(false);
                                }}
                                disabled={isDateDisabled}
                                className="rounded-lg w-full"
                                classNames={{
                                    months: "flex flex-col space-y-4",
                                    month: "space-y-4",
                                    caption: "flex justify-center pt-1 relative items-center",
                                    caption_label: "text-sm font-medium",
                                    nav: "space-x-1 flex items-center",
                                    nav_button: "h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100",
                                    nav_button_previous: "absolute left-1",
                                    nav_button_next: "absolute right-1",
                                    table: "w-full border-collapse space-y-1",
                                    head_row: "flex",
                                    head_cell: "text-slate-500 rounded-md w-9 font-normal text-[0.8rem] flex items-center justify-center",
                                    row: "flex w-full mt-1",
                                    cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-orange-500 [&:has([aria-selected])]:text-white first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                                    day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-slate-100 rounded-md ",
                                    day_selected: "bg-orange-500 text-white hover:bg-orange-600 hover:text-white focus:bg-orange-500 focus:text-white",
                                    day_today: "bg-orange-100 text-orange-700 font-semibold",
                                    day_outside: "text-slate-300 opacity-50",
                                    day_disabled: "text-slate-300 opacity-50",
                                    day_range_middle: "aria-selected:bg-orange-100 aria-selected:text-orange-700",
                                    day_hidden: "invisible",
                                }}
                                />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      {errors.date && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-xs text-red-500 mt-1"
                        >
                          {errors.date}
                        </motion.p>
                      )}
                    </div>

                    {/* Time Selection */}
                    <div>
                      <label className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        Time
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-1.5 sm:gap-2 max-h-[180px] sm:max-h-[200px] overflow-y-auto pr-1">
                        {timeSlots.map(time => (
                          <button
                            key={time}
                            type="button"
                            onClick={() => setSelectedTime(time)}
                            className={`h-8 sm:h-10 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 ${
                              selectedTime === time
                                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                      {errors.time && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-xs text-red-500 mt-1"
                        >
                          {errors.time}
                        </motion.p>
                      )}
                    </div>
                  </div>

                  {/* Additional Notes */}
                  <div className="space-y-2">
                    <label htmlFor="notes" className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="break-words">Additional Notes (Optional)</span>
                    </label>
                    <textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Any special requirements, questions, or notes for the appointment..."
                      rows={3}
                      className="w-full rounded-lg border-2 border-slate-200 bg-white p-3 text-xs sm:text-sm outline-none transition-all duration-200 focus:border-orange-500 focus:ring-0 resize-none break-words overflow-wrap-anywhere overflow-x-hidden"
                      style={{ wordBreak: 'break-word', overflowWrap: 'anywhere', overflowX: 'hidden' }}
                    />
                  </div>

                 

                  {/* Submit Button */}
                  <div className="pt-1 sm:pt-2">
                    <button
                      type="submit"
                      disabled={appointmentOperationLoading || !selectedDate || !selectedTime}
                      className="cursor-pointer w-full h-10 sm:h-12 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold shadow-md shadow-orange-500/25 transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none text-xs sm:text-sm"
                    >
                      {appointmentOperationLoading ? (
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                          <span className="truncate">{isReschedule ? "Rescheduling..." : "Scheduling..."}</span>
                        </div>
                      ) : (
                        <span className="truncate">{isReschedule ? "Reschedule Appointment" : "Schedule Appointment"}</span>
                      )}
                    </button>
                  </div>
                </motion.form>
              )}

              {(phase === "loading" || appointmentOperationLoading) && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col items-center justify-center text-center gap-4 sm:gap-6 py-6 sm:py-8"
                >
                  <div className="relative">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                      <Loader2 className="h-6 w-6 sm:h-7 sm:w-7 text-white animate-spin" />
                    </div>
                    <div className="absolute inset-0 bg-orange-500 rounded-lg blur-xl opacity-30 animate-pulse"></div>
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2 break-words">
                      {isReschedule ? "Rescheduling Appointment" : "Scheduling Appointment"}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 break-words">
                      {isReschedule ? "Please wait while we update your appointment..." : "Please wait while we confirm your booking..."}
                    </p>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <motion.div
                      className="h-2 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ ease: "easeOut", duration: 2 }}
                    />
                  </div>
                </motion.div>
              )}

              {phase === "success" && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="flex flex-col items-center justify-center text-center gap-4 sm:gap-6 py-6 sm:py-8"
                >
                  <motion.div
                    className="relative"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                  >
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                      <CheckCircle2 className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
                    </div>
                    <motion.div
                      className="absolute -top-2 -right-2"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-orange-500" />
                    </motion.div>
                    <div className="absolute inset-0 bg-green-500 rounded-lg blur-xl opacity-20 animate-pulse"></div>
                  </motion.div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2 break-words">
                      {isReschedule ? "Rescheduled!" : "All Set!"}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mb-3 break-words">
                      {isReschedule ? "Your appointment has been rescheduled successfully." : "Your appointment has been scheduled successfully."}
                    </p>
                    {appointmentData ? (
                      <div className="bg-slate-50 rounded-lg p-2.5 text-xs sm:text-sm space-y-1">
                        <p className="font-semibold text-slate-900 break-words">
                          {appointmentData.formatted_start_time}
                        </p>
                        <p className="text-slate-600 break-words">
                          Appointment ID: #{appointmentData.id}
                        </p>
                        <p className="text-slate-600 break-words">
                          Status: <span className="capitalize text-orange-600">{appointmentData.status}</span>
                        </p>
                      </div>
                    ) : selectedDate && selectedTime && (
                      <div className="bg-slate-50 rounded-lg p-2.5 text-xs sm:text-sm">
                        <p className="font-semibold text-slate-900 break-words">
                          {formatFullDate(selectedDate)} at {selectedTime}
                        </p>
                        {notes && (
                          <p className="text-slate-600 break-words mt-1">
                            <strong>Notes:</strong> {truncateNotes(notes)}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={handleCloseClick}
                    className="cursor-pointer w-full h-10 sm:h-12 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold shadow-md shadow-orange-500/25 transition-all duration-200 hover:shadow-lg text-xs sm:text-sm"
                  >
                    Close
                  </button>
                </motion.div>
              )}

              {phase === "failed" && (
                <motion.div
                  key="failed"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="flex flex-col items-center justify-center text-center gap-4 sm:gap-6 py-6 sm:py-8"
                >
                  <div className="relative">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                      <XCircle className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
                    </div>
                    <div className="absolute inset-0 bg-red-500 rounded-lg blur-xl opacity-20"></div>
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2 break-words">
                      {isReschedule ? "Rescheduling Failed" : "Scheduling Failed"}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mb-3 break-words">
                      {errorMessage || "Something went wrong. Please try again."}
                    </p>
                    {errorMessage && (
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-xs sm:text-sm">
                        <p className="text-orange-800 font-medium break-words">
                          {errorMessage.includes("Cannot reschedule appointment") && errorMessage.includes("hours") ? 
                            "⏰ Tip: You can only reschedule appointments at least 2 hours before the scheduled time." :
                            errorMessage.includes("already have an appointment scheduled") ?
                            "💡 Tip: Try selecting a different date or contact the dealer directly." :
                            errorMessage.includes("not authorized") ?
                            "🔒 Tip: You don't have permission to reschedule this appointment. Contact support if this is an error." :
                            "💡 Tip: Please check your input and try again, or contact support if the issue persists."
                          }
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 w-full">
                    <button
                      onClick={resetFormState}
                      className="flex-1 h-10 sm:h-12 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold text-xs sm:text-sm"
                    >
                      Try Again
                    </button>
                    <button
                      onClick={handleCloseClick}
                      className="flex-1 h-10 sm:h-12 rounded-lg border-2 border-slate-200 text-slate-700 font-medium hover:bg-slate-50 text-xs sm:text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}