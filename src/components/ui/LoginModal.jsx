import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle2, Mail, Lock, Eye, EyeOff, ShieldCheck, Sparkles, User, XCircle, Phone } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, registerUser, forgotPassword, verifyOTP, resetPassword, clearError } from "@/redux/slices/userSlice";
import useAuth from "@/hooks/useAuth";

export default function LoginModal({
  isOpen,
  onClose,
  title = "Login to Your Account",
  description = "Enter your credentials to access your account",
}) {
  const dispatch = useDispatch();
  const { values, errors, setValue, setError, resetForm } = useAuth();
  const { status, error } = useSelector((state) => state.user);
  const { userInfo } = useSelector((state) => state.carDetailsAndQuestions);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [phase, setPhase] = useState("form"); // form | loading | success | failed | forgot | verify-otp | reset-password
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [isForgotPasswordMode, setIsForgotPasswordMode] = useState(false);
  const [resetToken, setResetToken] = useState(null); // State for resetToken

  const navigate = useNavigate();
  const isCloseDisabled = phase === "loading" || phase === "verify-otp";
  function validate() {
    const newErrors = { email: "", firstName: "", lastName: "", phone: "", password: "", confirmPassword: "", otp: "", newPassword: "" };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!values.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(values.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (isRegisterMode && !values.firstName) {
      newErrors.firstName = "First name is required";
    } else if (isRegisterMode && values.firstName?.length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }

    if (isRegisterMode && !values.lastName) {
      newErrors.lastName = "Last name is required";
    } else if (isRegisterMode && values.lastName?.length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    }

    if (isRegisterMode && !values.phone) {
      newErrors.phone = "Phone number is required";
    } else if (isRegisterMode && values.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(values.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if ((isRegisterMode || !isForgotPasswordMode) && !values.password) {
      newErrors.password = "Password is required";
    } else if ((isRegisterMode || !isForgotPasswordMode) && values.password?.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (phase === "reset-password" && !values.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (phase === "reset-password" && values.newPassword !== values.confirmPassword) {
      newErrors.newPassword = "New password does not match";
    }
    else if (phase === "reset-password" && values.newPassword?.length < 6) {
      newErrors.newPassword = "New password must be at least 6 characters";
    }

    if ((isRegisterMode || phase === "reset-password") && !values.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if ((isRegisterMode) && values.confirmPassword !== values.password) {
      newErrors.confirmPassword = "Passwords do not match";
    }



    Object.keys(newErrors).forEach((key) => {
      if (newErrors[key]) setError(key, newErrors[key]);
      else setError(key, "");
    });

    return Object.values(newErrors).every((error) => !error);
  }

  useEffect(() => {
    console.log('password', values.newPassword);
    console.log('confirmPassword', values.confirmPassword);
  });
  function validateOtp() {
    const newErrors = { ...errors, otp: "" };
    if (!values.otp) {
      newErrors.otp = "OTP is required";
    } else if (!/^\d{6}$/.test(values.otp)) {
      newErrors.otp = "OTP must be a 6-digit number";
    }
    setError("otp", newErrors.otp || "");
    return !newErrors.otp;
  }

  async function handleAction(action, ...args) {
    setPhase("loading");
    try {
      await dispatch(action(...args)).unwrap();
      setPhase("success");
    } catch (error) {
      setPhase("failed");
      toast.error(error || "An error occurred. Please try again.", { duration: 2000 });
    }
  }

  async function handleSubmit(e) {
    e?.preventDefault();
    if (!validate()) return;

    if (isRegisterMode) {
      await handleAction(registerUser, { email: values.email, username: values.username, phone: values.phone, firstName: values.firstName, lastName: values.lastName, password: values.password, confirmPassword: values.confirmPassword });
    } else if (isForgotPasswordMode && phase === "forgot") {
      await handleAction(forgotPassword, values.email);
      if (phase !== "failed") {
        setPhase("verify-otp");
      }
    } else if (phase === "reset-password") {
      await handleAction(resetPassword, { token: resetToken, otp: values.otp, newPassword: values.newPassword, confirmPassword: values.confirmPassword });
    } else {
      await handleAction(loginUser, { username: values.email, password: values.password });
    }
  }

  async function handleOtpSubmit(e) {
    e?.preventDefault();
    if (!validateOtp()) return;

    console.log("Starting OTP verification with:", { email: values.email, otp: values.otp });
    console.log("OTP verification attempted at:", new Date().toLocaleTimeString());

    // Clear any existing OTP error before making the API call
    setError("otp", "");
    dispatch(clearError()); // Clear Redux error state
    setPhase("loading");
    try {
      const token = await dispatch(verifyOTP({ email: values.email, otp: values.otp })).unwrap();
      console.log("OTP verification successful, token:", token);
      // Clear any OTP error on success
      setError("otp", "");
      dispatch(clearError()); // Clear Redux error state on success
      setResetToken(token);
      setPhase("reset-password");
      console.log("Phase changed to reset-password");
    } catch (error) {
      console.log("OTP verification failed, error:", error);
      // Stay in verify-otp phase and show error inline
      setPhase("verify-otp");
      setError("otp", error || "Wrong OTP. Please try again.");
      console.log("Phase changed to verify-otp, error set:", error);
      // Don't show toast for OTP errors as they're displayed inline
    }
  }

  function handleOtpModalClose(open) {
    if (!open && status !== "loading") {
      resetModalToLogin();
    }
  }

  // Function to reset modal to default login state
  function resetModalToLogin() {
    setIsRegisterMode(false);
    setIsForgotPasswordMode(false);
    setPhase("form");
    setResetToken(null);
    resetForm();
    dispatch(clearError()); // Clear Redux error state
  }

  // Enhanced onClose handler that resets modal to login mode
  function handleModalClose(open) {
    if (!open && !isCloseDisabled) {
      resetModalToLogin();
      onClose(open);
    }
  }

  function handleSuccessAction() {
    toast.success(
      phase === "reset-password" ? "Password updated successfully" : "Login successful!",
      { duration: 2000 }
    );

    setTimeout(() => {
      onClose(false);
      resetModalToLogin();
    }, 2000);
  }

  function handleBackToForm() {
    setPhase("form");
    resetForm();

  }

  function handleForgotPassword() {
    setIsForgotPasswordMode(true);
    setPhase("forgot");
    resetForm();
    // Log when OTP is requested for debugging
    console.log("OTP requested at:", new Date().toLocaleTimeString());
  }

  function handleRegister() {
    setIsRegisterMode(true);
    resetForm();
  }

  function handleBackToLogin() {
    resetModalToLogin();
  }

  useEffect(() => {
    if (phase === "success") {
      handleSuccessAction();
    }
  }, [phase]);

  // Prefill email when modal opens and user info is available
  useEffect(() => {
    console.log("userInfo from login modal: ", userInfo);
    if (isOpen && userInfo?.user_email && !values.email) {
      setValue("email", userInfo.user_email);
    }
  }, [isOpen, userInfo, setValue, values.email]);

  // Check if email is prefilled from user info
  const isEmailPrefilled = userInfo?.user_email && values.email === userInfo.user_email;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={isCloseDisabled ? undefined : handleModalClose}>
        <DialogContent
          className="sm:max-w-lg rounded-2xl shadow-xl p-0 overflow-hidden bg-white"
          showCloseButton={!isCloseDisabled}
        >
          <div className="bg-gradient-to-br from-white via-slate-50 to-slate-100 p-6">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold tracking-tight text-slate-900">
                {isRegisterMode
                  ? "Create Your Account"
                  : isForgotPasswordMode && phase === "forgot"
                    ? "Forgot Password"
                    : isForgotPasswordMode && phase === "verify-otp"
                      ? "Verify OTP"
                      : isForgotPasswordMode && phase === "reset-password"
                        ? "Reset Password"
                        : title}
              </DialogTitle>
              <DialogDescription className="text-sm text-slate-600">
                {isRegisterMode
                  ? "Fill in the details to register a new account"
                  : phase === "forgot"
                    ? "Enter your email to receive a verification OTP"
                    : phase === "verify-otp"
                      ? `We’ve sent a 6-digit OTP to ${values.email}. Please enter it below.`
                      : phase === "reset-password"
                        ? "Enter your new password"
                        : description}
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className={`p-6 pt-0 ${isRegisterMode ? 'min-h-[480px]' : 'min-h-[420px]'}`}>
            <AnimatePresence mode="wait">
              {(phase === "form" || phase === "forgot" || phase === "reset-password") && (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className={`grid ${isRegisterMode ? 'gap-4' : 'gap-5'}`}
                >
                  {/* Email Field */}
                  {(phase === "form" || phase === "forgot") && (
                    <div className="grid gap-2">
                      <label htmlFor="email" className="text-sm font-medium text-slate-800">
                        Email Address
                      </label>
                      <div className="relative">
                        <div className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 ${isEmailPrefilled ? 'text-orange-500' : 'text-slate-400'
                          }`}>
                          <Mail className="h-4 w-4" />
                        </div>
                        <input
                          id="email"
                          type="email"
                          value={values.email || ""}
                          onChange={(e) => setValue("email", e.target.value)}
                          placeholder="user@example.com"
                          disabled={isEmailPrefilled}
                          className={`h-11 w-full rounded-xl border pl-9 pr-3 text-sm outline-none ring-0 transition-shadow ${isEmailPrefilled
                            ? 'border-orange-200 bg-orange-50 text-orange-800 cursor-not-allowed'
                            : 'border-slate-200 bg-white focus:shadow-[0_0_0_4px_rgba(15,23,42,0.08)]'
                            }`}
                        />
                      </div>

                      {errors.email && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-xs text-red-600"
                        >
                          {errors.email}
                        </motion.p>
                      )}
                    </div>
                  )}

                  {/* Registration Fields (Compact Layout) */}
                  {isRegisterMode && phase === "form" && (
                    <div className="space-y-3">
                      {/* Top Row: Username and Phone */}
                      <div className="grid grid-cols-2 gap-3">
                        {/* Username Field */}
                        <div className="grid gap-2">
                          <label htmlFor="username" className="text-sm font-medium text-slate-800">
                            Username
                          </label>
                          <div className="relative">
                            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                              <User className="h-4 w-4" />
                            </div>
                            <input
                              id="username"
                              type="text"
                              value={values.username || ""}
                              onChange={(e) => setValue("username", e.target.value)}
                              placeholder="Username"
                              className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none ring-0 transition-shadow focus:shadow-[0_0_0_4px_rgba(15,23,42,0.08)]"
                            />
                          </div>
                          {errors.username && (
                            <motion.p
                              initial={{ opacity: 0, y: -4 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-xs text-red-600"
                            >
                              {errors.username}
                            </motion.p>
                          )}
                        </div>

                        {/* Phone Field */}
                        <div className="grid gap-2">
                          <label htmlFor="phone" className="text-sm font-medium text-slate-800">
                            Phone
                          </label>
                          <div className="relative">
                            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                              <Phone className="h-4 w-4" />
                            </div>
                            <input
                              id="phone"
                              type="tel"
                              value={values.phone || ""}
                              onChange={(e) => setValue("phone", e.target.value)}
                              placeholder="+1 (555) 123-4567"
                              className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none ring-0 transition-shadow focus:shadow-[0_0_0_4px_rgba(15,23,42,0.08)]"
                            />
                          </div>
                          {errors.phone && (
                            <motion.p
                              initial={{ opacity: 0, y: -4 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-xs text-red-600"
                            >
                              {errors.phone}
                            </motion.p>
                          )}
                        </div>
                      </div>

                      {/* Middle Row: First Name and Last Name */}
                      <div className="grid grid-cols-2 gap-3">
                        {/* First Name Field */}
                        <div className="grid gap-2">
                          <label htmlFor="firstName" className="text-sm font-medium text-slate-800">
                            First Name
                          </label>
                          <div className="relative">
                            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                              <User className="h-4 w-4" />
                            </div>
                            <input
                              id="firstName"
                              type="text"
                              value={values.firstName || ""}
                              onChange={(e) => setValue("firstName", e.target.value)}
                              placeholder="First name"
                              className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none ring-0 transition-shadow focus:shadow-[0_0_0_4px_rgba(15,23,42,0.08)]"
                            />
                          </div>
                          {errors.firstName && (
                            <motion.p
                              initial={{ opacity: 0, y: -4 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-xs text-red-600"
                            >
                              {errors.firstName}
                            </motion.p>
                          )}
                        </div>

                        {/* Last Name Field */}
                        <div className="grid gap-2">
                          <label htmlFor="lastName" className="text-sm font-medium text-slate-800">
                            Last Name
                          </label>
                          <div className="relative">
                            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                              <User className="h-4 w-4" />
                            </div>
                            <input
                              id="lastName"
                              type="text"
                              value={values.lastName || ""}
                              onChange={(e) => setValue("lastName", e.target.value)}
                              placeholder="Last name"
                              className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none ring-0 transition-shadow focus:shadow-[0_0_0_4px_rgba(15,23,42,0.08)]"
                            />
                          </div>
                          {errors.lastName && (
                            <motion.p
                              initial={{ opacity: 0, y: -4 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-xs text-red-600"
                            >
                              {errors.lastName}
                            </motion.p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Password Field (Login/Register Mode) */}
                  {phase === "form" && !isForgotPasswordMode && (
                    <div className="grid gap-2">
                      <label htmlFor="password" className="text-sm font-medium text-slate-800">
                        Password
                      </label>
                      <div className="relative">
                        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                          <Lock className="h-4 w-4" />
                        </div>
                        <input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={values.password || ""}
                          onChange={(e) => setValue("password", e.target.value)}
                          placeholder="••••••••"
                          className={`h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-10 text-sm outline-none ring-0 transition-shadow focus:shadow-[0_0_0_4px_rgba(15,23,42,0.08)]`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {errors.password && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-xs text-red-600"
                        >
                          {errors.password}
                        </motion.p>
                      )}
                    </div>
                  )}

                  {/* New Password Field (Reset Password Mode) */}
                  {phase === "reset-password" && (
                    <div className="grid gap-2">
                      <label htmlFor="newPassword" className="text-sm font-medium text-slate-800">
                        New Password
                      </label>
                      <div className="relative">
                        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                          <Lock className="h-4 w-4" />
                        </div>
                        <input
                          id="newPassword"
                          type={showNewPassword ? "text" : "password"}
                          value={values.newPassword || ""}
                          onChange={(e) => setValue("newPassword", e.target.value)}
                          placeholder="••••••••"
                          className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-10 text-sm outline-none ring-0 transition-shadow focus:shadow-[0_0_0_4px_rgba(15,23,42,0.08)]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {errors.newPassword && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-xs text-red-600"
                        >
                          {errors.newPassword}
                        </motion.p>
                      )}
                    </div>
                  )}

                  {/* Confirm Password Field (Register/Reset Password Mode) */}
                  {(isRegisterMode || phase === "reset-password") && (
                    <div className="grid gap-2">
                      <label htmlFor="confirmPassword" className="text-sm font-medium text-slate-800">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                          <Lock className="h-4 w-4" />
                        </div>
                        <input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={values.confirmPassword || ""}
                          onChange={(e) => setValue("confirmPassword", e.target.value)}
                          placeholder="••••••••"
                          className={`h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-10 text-sm outline-none ring-0 transition-shadow focus:shadow-[0_0_0_4px_rgba(15,23,42,0.08)]`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-xs text-red-600"
                        >
                          {errors.confirmPassword}
                        </motion.p>
                      )}
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="pt-1">
                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="cursor-pointer w-full h-11 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-semibold shadow-lg shadow-orange-500/20 transition hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {status === "loading" ? (
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          {isRegisterMode
                            ? "Registering..."
                            : phase === "forgot"
                              ? "Sending OTP..."
                              : phase === "reset-password"
                                ? "Updating Password..."
                                : "Signing In..."}
                        </div>
                      ) : (
                        isRegisterMode
                          ? "Register"
                          : phase === "forgot"
                            ? "Send OTP"
                            : phase === "reset-password"
                              ? "Update Password"
                              : "Login"
                      )}
                    </button>
                  </div>

                  {/* Forgot Password Link (Login Mode Only) */}
                  {!isRegisterMode && phase === "form" && !isForgotPasswordMode && (
                    <div className="text-center">
                      <button
                        type="button"
                        onClick={handleForgotPassword}
                        className="cursor-pointer text-sm text-slate-600 hover:text-slate-800 transition-colors underline underline-offset-2"
                      >
                        Forgot Password?
                      </button>
                    </div>
                  )}

                  {/* Toggle Login/Register Link */}
                  {(phase === "form" || phase === "forgot") && !isForgotPasswordMode && (
                    <div className="text-center">
                      <p className="text-xs text-slate-600">
                        {isRegisterMode ? "Already have an account?" : "Don't have an account?"}{" "}
                        <button
                          type="button"
                          onClick={isRegisterMode ? handleBackToLogin : handleRegister}
                          className="cursor-pointer text-orange-600 hover:text-orange-700 font-medium underline underline-offset-2 transition-colors"
                        >
                          {isRegisterMode ? "Login" : "Register"}
                        </button>
                      </p>
                    </div>
                  )}

                  {/* Security Notice */}
                  <div className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
                    <ShieldCheck className="h-4 w-4 text-slate-700" />
                    Your credentials are encrypted and secure
                  </div>
                </motion.form>
              )}

              {phase === "loading" && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="grid gap-6 place-items-center text-center"
                >
                  <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50 w-full">
                    <div className="flex items-center gap-3 p-4">
                      <Loader2 className="h-5 w-5 animate-spin text-slate-700" />
                      <span className="text-sm text-slate-700">
                        {isRegisterMode
                          ? "Processing registration..."
                          : isForgotPasswordMode && phase === "reset-password"
                            ? "Updating password..."
                            : "Authenticating your credentials..."}
                      </span>
                    </div>
                    <div className="h-1 w-full bg-slate-200">
                      <motion.div
                        className="h-1 bg-slate-800"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ ease: "easeOut", duration: 1.8 }}
                      />
                    </div>
                  </div>
                  <div className="text-sm text-slate-600">
                    Please wait while we{" "}
                    {isRegisterMode
                      ? "process your registration"
                      : isForgotPasswordMode && phase === "reset-password"
                        ? "update your password"
                        : "verify your account"}
                    ...
                  </div>
                </motion.div>
              )}

              {phase === "success" && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="grid gap-5 mt-[4rem] place-items-center text-center"
                >
                  <motion.div
                    className="relative"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 340, damping: 18 }}
                  >
                    <div className="grid place-items-center rounded-2xl border border-green-200 bg-gradient-to-b from-white to-emerald-50 p-4 shadow-sm">
                      <CheckCircle2 className="h-14 w-14 text-green-500" />
                    </div>
                    <Sparkles className="absolute -right-2 -top-2 h-4 w-4 text-amber-500" />
                  </motion.div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-slate-900">
                      {isRegisterMode
                        ? "Account Created!"
                        : isForgotPasswordMode
                          ? "Password Updated!"
                          : "Welcome back!"}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {isRegisterMode
                        ? "Your account has been successfully created."
                        : isForgotPasswordMode
                          ? "Your password has been successfully updated."
                          : "You have been successfully logged in."}
                    </p>
                  </div>
                </motion.div>
              )}

              {phase === "failed" && (
                <motion.div
                  key="failed"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="grid gap-5 mt-[4rem] place-items-center text-center"
                >
                  <motion.div
                    className="relative"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 340, damping: 18 }}
                  >
                    <div className="grid place-items-center rounded-2xl border border-red-200 bg-gradient-to-b from-white to-red-50 p-4 shadow-sm">
                      <XCircle className="h-14 w-14 text-red-500" />
                    </div>
                  </motion.div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-slate-900">Invalid credentials</h3>
                    <p className="text-sm text-slate-600">Please try again.</p>
                  </div>
                  <button
                    onClick={handleBackToForm}
                    className="cursor-pointer w-full max-w-[200px] h-11 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-semibold shadow-lg shadow-orange-500/20 transition hover:from-orange-600 hover:to-amber-600"
                  >
                    Try Again
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </DialogContent>
      </Dialog>

      {/* OTP Verification Modal (Only for Forgot Password) */}
      {isForgotPasswordMode && phase === "verify-otp" && (
        <Dialog open={phase === "verify-otp"} onOpenChange={handleOtpModalClose}>
          <DialogContent className="sm:max-w-md rounded-2xl shadow-xl p-6 bg-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold tracking-tight text-slate-900">
                Verify OTP
              </DialogTitle>
              <DialogDescription className="text-sm text-slate-600">
                We’ve sent a 6-digit OTP to {values.email}. Please enter it below.
              </DialogDescription>
            </DialogHeader>
            <motion.form
              onSubmit={handleOtpSubmit}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="grid gap-5"
            >
              <div className="grid gap-2">
                <label htmlFor="otp" className="text-sm font-medium text-slate-800">
                  OTP
                </label>
                <InputOTP
                  id="otp"
                  maxLength={6}
                  value={values.otp || ""}
                  onChange={(value) => {
                    setValue("otp", value);
                    // Clear OTP error when user starts typing
                    if (errors.otp) {
                      setError("otp", "");
                    }
                  }}
                  className="flex gap-2"
                >
                  <InputOTPGroup className="flex gap-2">
                    {Array(6)
                      .fill(null)
                      .map((_, i) => (
                        <InputOTPSlot
                          key={i}
                          index={i}
                          className="h-11 w-11 rounded-lg border border-slate-200 bg-white text-center text-lg font-medium outline-none ring-0 transition-shadow"
                        />
                      ))}
                  </InputOTPGroup>
                </InputOTP>
                {errors.otp && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-red-600"
                  >
                    {errors.otp}
                  </motion.p>
                )}

              </div>
              <button
                type="submit"
                disabled={status === "loading"}
                className="cursor-pointer w-full h-11 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-semibold shadow-lg shadow-orange-500/20 transition hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === "loading" ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Verifying OTP...
                  </div>
                ) : (
                  "Verify OTP"
                )}
              </button>
            </motion.form>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}