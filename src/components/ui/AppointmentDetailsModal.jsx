import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  CheckCircle2,
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  Car,
  Sparkles,
  XCircle,
  ChevronDown,
  FileText,
  MapPin,
  Video,
  Edit3,
  Trash2,
  AlertCircle,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import CancelAppointmentModal from "./CancelAppointmentModal";
import AppointmentModal from "./AppointmentModal";

export default function AppointmentDetailsModal({
  isOpen,
  onClose,
  appointment,
  onConfirm,
  onCancel,
  onReschedule,
  onCall,
  onJoin,
  isProcessing = false,
  processingAction = "",
}) {
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isCancelProcessing, setIsCancelProcessing] = useState(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);

  // Handle modal close
  const handleClose = (open) => {
    if (!open && !isProcessing && !isCancelProcessing) {
      onClose(false);
    }
  };

  // Handle close button click
  const handleCloseClick = () => {
    if (!isProcessing && !isCancelProcessing) {
      onClose(false);
    }
  };

  // Handle cancel button click
  const handleCancelClick = () => {
    setIsCancelModalOpen(true);
  };

  // Handle cancel modal close
  const handleCancelModalClose = () => {
    setIsCancelModalOpen(false);
    setIsCancelProcessing(false);
  };

  // Handle reschedule button click
  const handleRescheduleClick = () => {
    setIsRescheduleModalOpen(true);
  };

  const handleConfirmClick = async () => {
    if (onConfirm && appointment) {
      await onConfirm(appointment);
    }
  };

  // Handle reschedule modal close
  const handleRescheduleModalClose = () => {
    setIsRescheduleModalOpen(false);
  };

  // Handle confirm cancellation
  const handleConfirmCancel = async (appointment, notes) => {
    setIsCancelProcessing(true);

    try {
      if (onCancel) {
        await onCancel(appointment, notes);
      }
      // Close both modals after successful cancellation
      setIsCancelModalOpen(false);
      onClose(false);
    } catch (error) {
      console.error("Error cancelling appointment:", error);
    } finally {
      setIsCancelProcessing(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString || dateString === "0000-00-00 00:00:00")
      return "Date not available";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Date not available";
    }
  };

  // Format time for display
  const formatTime = (dateString) => {
    if (!dateString || dateString === "0000-00-00 00:00:00")
      return "Time not available";
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return "Time not available";
    }
  };

  // Get status color and styling
  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-800",
          border: "border-yellow-200",
        };
      case "confirmed":
        return {
          bg: "bg-green-100",
          text: "text-green-800",
          border: "border-green-200",
        };
      case "cancelled":
        return {
          bg: "bg-red-100",
          text: "text-red-800",
          border: "border-red-200",
        };
      case "completed":
        return {
          bg: "bg-blue-100",
          text: "text-blue-800",
          border: "border-blue-200",
        };
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-800",
          border: "border-gray-200",
        };
    }
  };

  const statusStyle = getStatusStyle(appointment?.status);

  const isCloseDisabled = isProcessing || isCancelProcessing;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      {console.log("appointment", appointment)}
      <DialogContent
        className="sm:max-w-[600px] w-full max-h-[95vh] sm:max-h-[90vh] rounded-xl sm:rounded-2xl shadow-2xl p-0 bg-white border-0 flex flex-col sm:mx-0"
        showCloseButton={!isCloseDisabled}
      >
        {/* Header - Fixed */}
        <div className="relative bg-[#f6851f] p-4 sm:p-6 text-white flex-shrink-0 rounded-t-xl sm:rounded-t-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent"></div>
          <div className="relative z-10">
            <div className="flex items-start justify-between">
              <DialogTitle className="text-base sm:text-lg font-bold mb-1 break-words">
                Appointment Details
              </DialogTitle>
              {/* Custom Close Button for Mobile */}
              <button
                onClick={handleCloseClick}
                disabled={isCloseDisabled}
                className="absolute top-2 right-2 sm:hidden p-1 rounded-full hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Close modal"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 w-16 h-16 sm:w-20 sm:h-20 bg-orange-500/10 rounded-full blur-xl"></div>
          <div className="absolute -bottom-1 -left-1 sm:-bottom-2 sm:-left-2 w-8 h-8 sm:w-12 sm:h-12 bg-orange-500/20 rounded-full blur-lg"></div>
        </div>

        {/* Content Area - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 min-h-0 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 hover:scrollbar-thumb-slate-400 scroll-smooth rounded-b-xl sm:rounded-b-2xl">
          {appointment ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="space-y-4 sm:space-y-6 pb-4"
            >
              {/* Appointment Status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm text-slate-600">
                      <p>
                        Created:{" "}
                        {appointment.created_at
                          ? new Date(
                              appointment.created_at
                            ).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  className={`inline-flex items-center gap-1.5 px-2 sm:px-3 py-1 rounded-full text-xs font-medium border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border} self-start sm:self-auto`}
                >
                  <div
                    className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${statusStyle.bg.replace(
                      "100",
                      "500"
                    )}`}
                  ></div>
                  {appointment.status?.charAt(0).toUpperCase() +
                    appointment.status?.slice(1) || "Unknown"}
                </div>
              </div>

              {/* Date & Time Information */}
              <div className="bg-slate-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-slate-100">
                <h4 className="text-xs sm:text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                  Schedule Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <p className="text-xs text-slate-600 mb-1">Date</p>
                    <p className="text-xs sm:text-sm font-medium text-slate-900">
                      {appointment.formatted_start_time?.includes("-0001")
                        ? formatDate(appointment.start_time)
                        : appointment.formatted_start_time?.split(" at ")[0] ||
                          formatDate(appointment.start_time)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 mb-1">Time</p>
                    <p className="text-xs sm:text-sm font-medium text-slate-900">
                      {appointment.formatted_start_time?.includes("-0001")
                        ? formatTime(appointment.start_time)
                        : appointment.formatted_start_time?.split(" at ")[1] ||
                          formatTime(appointment.start_time)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Dealer Information */}
              <div className="bg-slate-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-slate-100">
                <h4 className="text-xs sm:text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                  <User className="w-3 h-3 sm:w-4 sm:h-4" />
                  Dealer Information
                </h4>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                      <User className="w-3 h-3 sm:w-4 sm:h-4 text-orange-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm font-medium text-slate-900 truncate">
                        {appointment.dealer_name}
                      </p>
                      <p className="text-xs text-slate-600">Dealer</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm font-medium text-slate-900 truncate">
                        {appointment.dealer_email}
                      </p>
                      <p className="text-xs text-slate-600">Email</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes Section */}
              {appointment.notes && (
                <div className="bg-slate-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-slate-100">
                  <h4 className="text-xs sm:text-sm font-semibold text-slate-800 mb-2 flex items-center gap-2">
                    <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
                    Cancel Note
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700">
                    {appointment.notes}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs sm:text-sm font-semibold text-slate-800">
                    Quick Actions
                  </h4>
                </div>

                {/* Cancelled Appointment Notice */}
                {appointment.status === "cancelled" && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <XCircle className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" />
                      <p className="text-xs sm:text-sm text-red-700">
                        {/* This appointment is cancelled. Management actions are not available. */}
                        This appointment is cancelled.
                      </p>
                    </div>
                  </div>
                )}

                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-2"
                  >
                    {/* Management Actions */}
                    {appointment.status !== "cancelled" && (
                      <div className="grid grid-cols-1 gap-2">
                        {/* Confirm Button - Only show for pending appointments */}
                        {appointment.status === "pending" &&
                           (
                            <button
                              onClick={handleConfirmClick}
                              disabled={isProcessing}
                              className="cursor-pointer flex items-center justify-center gap-2 h-9 sm:h-10 bg-blue-50 text-blue-700 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isProcessing &&
                              processingAction === "confirm" ? (
                                <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                              ) : (
                                <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4" />
                              )}
                              <span className="text-xs sm:text-sm font-medium">
                                {isProcessing && processingAction === "confirm"
                                  ? "Confirming..."
                                  : "Confirm"}
                              </span>
                            </button>
                          )}

                        {/* Already Confirmed Button - Only show for confirmed appointments */}
                        {appointment.status === "confirmed" && (
                          <button
                            disabled={true}
                            className="cursor-not-allowed flex items-center justify-center gap-2 h-9 sm:h-10 bg-green-50 text-green-700 rounded-lg border border-green-200 opacity-75"
                          >
                            <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="text-xs sm:text-sm font-medium">
                              Already Confirmed
                            </span>
                          </button>
                        )}

                        <button
                          onClick={handleRescheduleClick}
                          disabled={
                            isProcessing || appointment.can_reschedule === false
                          }
                          className="cursor-pointer flex items-center justify-center gap-2 h-9 sm:h-10 bg-orange-50 text-orange-700 rounded-lg border border-orange-200 hover:bg-orange-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Edit3 className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="text-xs sm:text-sm font-medium">
                            {isProcessing && processingAction === "reschedule"
                              ? "Processing..."
                              : appointment.can_reschedule === false
                              ? "Cannot Reschedule"
                              : "Reschedule"}
                          </span>
                        </button>
                        {appointment.can_reschedule === false && (
                          <p className="text-xs text-slate-500 text-center">
                            Rescheduling not available for this appointment
                          </p>
                        )}
                      </div>
                    )}
                    {/* Communication Actions */}
                    <div
                      className={`grid gap-2 ${
                        appointment.status === "cancelled"
                          ? "grid-cols-1"
                          : "grid-cols-1 sm:grid-cols-1"
                      }`}
                    >
                      {/* <button
                            onClick={() => onCall && onCall(appointment)}
                            className="cursor-pointer flex items-center justify-center gap-2 h-10 bg-green-50 text-green-700 rounded-lg border border-green-200 hover:bg-green-100 transition-colors"
                          >
                            <Phone className="w-4 h-4" />
                            <span className="text-sm font-medium">Call</span>
                          </button> */}

                      {appointment.status !== "cancelled" && (
                        <button
                          onClick={handleCancelClick}
                          disabled={isProcessing || isCancelProcessing}
                          className="cursor-pointer flex items-center justify-center gap-2 h-9 sm:h-10 bg-red-50 text-red-700 rounded-lg border border-red-200 hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="text-xs sm:text-sm font-medium">
                            Cancel
                          </span>
                        </button>
                      )}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Processing State */}
              {(isProcessing || isCancelProcessing) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-orange-50 border border-orange-200 rounded-lg p-3 sm:p-4"
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 animate-spin" />
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-orange-800">
                        {isCancelProcessing
                          ? "Cancelling appointment..."
                          : processingAction === "reschedule"
                          ? "Processing reschedule..."
                          : "Processing..."}
                      </p>
                      <p className="text-xs text-orange-600">
                        Please wait while we process your request
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Footer Actions */}
              <div className="flex gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-slate-200">
                <button
                  onClick={handleCloseClick}
                  disabled={isCloseDisabled}
                  className="cursor-pointer flex-1 h-10 sm:h-12 rounded-lg border-2 border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Close
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center gap-3 sm:gap-4 py-6 sm:py-8">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">
                  No Appointment Data
                </h3>
                <p className="text-xs sm:text-sm text-slate-600">
                  Unable to load appointment details.
                </p>
              </div>
              <button
                onClick={handleCloseClick}
                disabled={isCloseDisabled}
                className="cursor-pointer px-3 sm:px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </DialogContent>

      {/* Cancel Appointment Modal */}
      <CancelAppointmentModal
        isOpen={isCancelModalOpen}
        onClose={handleCancelModalClose}
        appointment={appointment}
        onConfirmCancel={handleConfirmCancel}
        isProcessing={isCancelProcessing}
      />

      {/* Reschedule Appointment Modal */}
      <AppointmentModal
        isOpen={isRescheduleModalOpen}
        onClose={handleRescheduleModalClose}
        dealerName={appointment?.dealer_name}
        dealerId={appointment?.dealer_id || appointment?.dealerId}
        dealerEmail={appointment?.dealer_email}
        vehicleInfo={appointment?.vehicle_info || "Vehicle Information"}
        isReschedule={true}
        appointmentToReschedule={appointment}
        onRescheduleSubmit={() => {
          // Close the reschedule modal and refresh appointments
          handleRescheduleModalClose();
          if (onReschedule) {
            onReschedule(appointment);
          }
        }}
      />
    </Dialog>
  );
}
