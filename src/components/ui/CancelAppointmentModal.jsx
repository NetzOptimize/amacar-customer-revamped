import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Loader2, 
  AlertTriangle,
  XCircle,
  FileText,
  Trash2,
  CheckCircle2,
  X
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useDispatch, useSelector } from "react-redux";
import { cancelAppointment, selectAppointmentOperationLoading, selectAppointmentOperationError, selectAppointmentOperationSuccess } from "@/redux/slices/offersSlice";
import toast from "react-hot-toast";

export default function CancelAppointmentModal({
  isOpen,
  onClose,
  appointment,
  onConfirmCancel
}) {
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState({});
  const [phase, setPhase] = useState("form"); // "form", "loading", "success", "error"
  const [errorMessage, setErrorMessage] = useState("");
  const [countdown, setCountdown] = useState(3);
  
  const dispatch = useDispatch();
  const isProcessing = useSelector(selectAppointmentOperationLoading);
  const operationError = useSelector(selectAppointmentOperationError);
  const operationSuccess = useSelector(selectAppointmentOperationSuccess);

  // Handle modal close
  const handleClose = (open) => {
    if (!open && !isProcessing) {
      onClose(false);
      setNotes("");
      setErrors({});
    }
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!notes.trim()) {
      newErrors.notes = "Please provide a reason for cancellation";
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
      const response = await dispatch(cancelAppointment({
        appointmentId: appointment.id,
        notes: notes.trim()
      }));
      
      if (response.payload && response.payload.success) {
        // Call the parent callback if provided
        if (onConfirmCancel) {
          await onConfirmCancel(appointment, notes.trim());
        }
      } else {
        setPhase("error");
        setErrorMessage(response.payload?.message || "Failed to cancel appointment");
      }
    } catch (error) {
      console.error("Cancel appointment error:", error);
      setPhase("error");
      setErrorMessage("Network error. Please check your connection and try again.");
    }
  };

  // Handle cancel without submitting
  const handleCancel = () => {
    setNotes("");
    setErrors({});
    setPhase("form");
    setErrorMessage("");
    onClose(false);
  };

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setPhase("form");
      setNotes("");
      setErrors({});
      setErrorMessage("");
      setCountdown(3);
    }
  }, [isOpen]);

  // Handle Redux state changes
  useEffect(() => {
    if (isProcessing && phase === "loading") {
      // Keep loading state
    } else if (operationSuccess && phase === "loading") {
      setPhase("success");
      setCountdown(3);
      // Start countdown
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleCancel();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (operationError && phase === "loading") {
      setPhase("error");
      setErrorMessage(operationError);
    }
  }, [isProcessing, operationSuccess, operationError, phase]);

  const isCloseDisabled = isProcessing;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className="sm:max-w-[500px] w-full max-h-[90vh] sm:max-h-[85vh] rounded-xl sm:rounded-2xl shadow-2xl p-0 overflow-hidden bg-white border-0"
        showCloseButton={!isCloseDisabled}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="relative bg-red-500 p-4 sm:p-6 text-white">
            <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-transparent"></div>
            <div className="relative z-10">
              <DialogTitle className="text-base sm:text-lg font-bold mb-1 flex items-center gap-2 break-words">
                <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span>Cancel Appointment</span>
              </DialogTitle>
              <DialogDescription className="text-white text-xs sm:text-sm break-words">
                Are you sure you want to cancel this appointment?
              </DialogDescription>
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-red-500/10 rounded-full blur-xl"></div>
            <div className="absolute -bottom-2 -left-2 w-12 h-12 bg-red-500/20 rounded-full blur-lg"></div>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
            <AnimatePresence mode="wait">
              {phase === "loading" && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="flex flex-col items-center justify-center text-center gap-4 sm:gap-6 py-6 sm:py-8"
                >
                  <div className="relative">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                      <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 text-white animate-spin" />
                    </div>
                    <div className="absolute inset-0 bg-red-500 rounded-lg blur-xl opacity-20 animate-pulse"></div>
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2 break-words">
                      Cancelling Appointment
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 break-words">
                      Please wait while we process your cancellation request...
                    </p>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <motion.div
                      className="h-2 bg-gradient-to-r from-red-500 to-red-600 rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ ease: "easeOut", duration: 2 }}
                    />
                  </div>
                </motion.div>
              )}

              {phase === "form" && appointment && (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="space-y-4 sm:space-y-6"
                >
                {/* Appointment Summary
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <XCircle className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-red-800 mb-1">
                        Appointment #{appointment.id}
                      </h4>
                      <p className="text-sm text-red-700 mb-2">
                        with {appointment.dealer_name}
                      </p>
                      <div className="text-xs text-red-600">
                        <p>
                          {appointment.formatted_start_time?.includes("-0001") 
                            ? "Date not available"
                            : appointment.formatted_start_time || "Date not available"
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div> */}

                {/* Warning Message */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-amber-800 mb-1 break-words">
                        Important Notice
                      </h4>
                      <p className="text-xs sm:text-sm text-amber-700 break-words">
                        Once cancelled, this appointment cannot be restored. Please ensure you really want to cancel before proceeding.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Cancellation Form */}
                <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                  <div>
                    <label htmlFor="cancelNotes" className="text-xs sm:text-sm font-semibold text-slate-800 mb-2 flex items-center gap-2">
                      <FileText className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span className="break-words">Reason for Cancellation *</span>
                    </label>
                    <textarea
                      id="cancelNotes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Please provide a reason for cancelling this appointment..."
                      rows={3}
                      className="w-full rounded-lg border-2 border-slate-200 bg-white p-3 text-xs sm:text-sm outline-none transition-all duration-200 focus:border-red-500 focus:ring-0 resize-none break-words overflow-x-hidden"
                      style={{ wordBreak: 'break-word', overflowWrap: 'anywhere', overflowX: 'hidden' }}
                    />
                    {errors.notes && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs text-red-500 mt-1"
                      >
                        {errors.notes}
                      </motion.p>
                    )}
                  </div>

                  {/* Processing State */}
                  {isProcessing && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4"
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 animate-spin flex-shrink-0" />
                        <div>
                          <p className="text-xs sm:text-sm font-medium text-red-800 break-words">
                            Cancelling appointment...
                          </p>
                          <p className="text-xs text-red-600 break-words">Please wait while we process your request</p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4">
                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={isProcessing}
                      className="flex-1 h-10 sm:h-12 rounded-lg border-2 border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm px-4 py-2"
                    >
                      Keep Appointment
                    </button>
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="flex-1 h-10 sm:h-12 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold shadow-md shadow-red-500/25 transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-xs sm:text-sm px-4 py-2"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                          <span className="truncate">Cancelling...</span>
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="truncate">Cancel Appointment</span>
                        </>
                      )}
                    </button>
                  </div>
                 </form>
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
                    <div className="absolute inset-0 bg-green-500 rounded-lg blur-xl opacity-20 animate-pulse"></div>
                  </motion.div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2 break-words">
                      Appointment Cancelled
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mb-3 break-words">
                      Your appointment has been successfully cancelled.
                    </p>
                    {appointment && (
                      <div className="bg-slate-50 rounded-lg p-2.5 text-xs sm:text-sm mb-3">
                        <p className="font-semibold text-slate-900 break-words">
                          Appointment #{appointment.id} with {appointment.dealer_name}
                        </p>
                      </div>
                    )}
                    <p className="text-xs text-slate-500 break-words">
                      This dialog will close automatically in {countdown} seconds
                    </p>
                  </div>
                  <button
                    onClick={handleCancel}
                    className="w-full h-10 sm:h-12 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold shadow-md shadow-green-500/25 transition-all duration-200 hover:shadow-lg text-xs sm:text-sm px-4 py-2"
                  >
                    Close Now
                  </button>
                </motion.div>
              )}

              {phase === "error" && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="flex flex-col items-center justify-center text-center gap-4 sm:gap-6 py-6 sm:py-8"
                >
                  <div className="relative">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                      <X className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
                    </div>
                    <div className="absolute inset-0 bg-red-500 rounded-lg blur-xl opacity-20"></div>
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2 break-words">
                      Cancellation Failed
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mb-3 break-words">
                      {errorMessage || "Something went wrong. Please try again."}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full">
                    <button
                      onClick={() => setPhase("form")}
                      className="flex-1 h-10 sm:h-12 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold text-xs sm:text-sm px-4 py-2"
                    >
                      Try Again
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex-1 h-10 sm:h-12 rounded-lg border-2 border-slate-200 text-slate-700 font-medium hover:bg-slate-50 text-xs sm:text-sm px-4 py-2"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              )}

              {!appointment && (
                <div className="flex flex-col items-center justify-center text-center gap-3 sm:gap-4 py-6 sm:py-8">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-slate-100 rounded-lg flex items-center justify-center">
                    <XCircle className="w-7 h-7 sm:w-8 sm:h-8 text-slate-400" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2 break-words">No Appointment Data</h3>
                    <p className="text-xs sm:text-sm text-slate-600 break-words">Unable to load appointment details.</p>
                  </div>
                  <button
                    onClick={handleCancel}
                    className="px-3 sm:px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-xs sm:text-sm"
                  >
                    Close
                  </button>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
