import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  CheckCircle2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Sparkles,
  User,
  XCircle,
  Phone,
} from "lucide-react";
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
import {
  loginUser,
  registerUser,
  forgotPassword,
  verifyOTP,
  resetPassword,
  verifyLoginOTP,
  clearError,
} from "@/redux/slices/userSlice";
import useAuth from "@/hooks/useAuth";
import useEmailValidation from "@/hooks/useEmailValidation";
import { Link } from "react-router-dom";
import ReusableTooltip from "@/components/ui/ReusableTooltip";

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
  const [phase, setPhase] = useState("form"); // form | loading | success | failed | forgot | verify-otp | reset-password | verify-2fa
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [isForgotPasswordMode, setIsForgotPasswordMode] = useState(false);
  const [resetToken, setResetToken] = useState(null); // State for resetToken
  const [twoFactorData, setTwoFactorData] = useState(null); // Store 2FA data from login response
  const [registerConsent, setRegisterConsent] = useState(false); // State for terms and privacy policy consent
  const [privacyConsent, setPrivacyConsent] = useState(false); // State for privacy policy consent
  const [shouldResetEmailValidation, setShouldResetEmailValidation] =
    useState(false);

  // Email validation hook - validate in both modes when email is not empty
  const emailValidation = useEmailValidation(
    values.email ? values.email : "",
    isRegisterMode,
    shouldResetEmailValidation
  );


  const navigate = useNavigate();
  const isCloseDisabled =
    phase === "loading" || phase === "verify-otp" || phase === "verify-2fa";
  function validate() {
    const newErrors = {
      email: "",
      firstName: "",
      lastName: "",
      phone: "",
      password: "",
      confirmPassword: "",
      otp: "",
      newPassword: "",
      registerConsent: "",
      privacyConsent: "",
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!values.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(values.email)) {
      // Only show regex validation error if not in register mode or if email validation hasn't started yet
      if (!isRegisterMode || !emailValidation.isValidating) {
        newErrors.email = "Please enter a valid email address";
      }
    } else if (
      emailValidation.isDisposable === true &&
      !emailValidation.isValidating
    ) {
      console.log('🚫 [LoginModal] Email validation failed - disposable email');
      newErrors.email = "Disposable email addresses are not allowed";
    } else if (
      isRegisterMode &&
      emailValidation.isRegistered === true &&
      !emailValidation.isValidating
    ) {
      console.log('🚫 [LoginModal] Email validation failed - email already registered');
      newErrors.email =
        "This email is already registered. Please use a different email or try logging in.";
    } else if (
      !isRegisterMode &&
      emailValidation.isRegistered === false &&
      !emailValidation.isValidating
    ) {
      console.log('🚫 [LoginModal] Email validation failed - email not registered');
      newErrors.email = "This email is not registered. Please check your email or register first.";
    } else if (
      emailValidation.error &&
      !emailValidation.isValidating
    ) {
      console.log('❌ [LoginModal] Email validation failed - API error:', emailValidation.error);
      newErrors.email = "Unable to verify email. Please try again.";
    } else if (
      emailValidation.isValid === true &&
      !emailValidation.isValidating
    ) {
      console.log('✅ [LoginModal] Email validation passed - both checks successful');
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

    if (isRegisterMode && !values.username) {
      newErrors.username = "Username is required";
    } else if (isRegisterMode && values.username?.length < 2) {
      newErrors.username = "username must be at least 2 characters";
    } else if (
      isRegisterMode &&
      values.username &&
      !/^[a-zA-Z0-9]+$/.test(values.username)
    ) {
      newErrors.username = "Username must contain only letters and numbers";
    }

    if (isRegisterMode && !values.phone) {
      newErrors.phone = "Phone number is required";
    } else if (
      isRegisterMode &&
      values.phone &&
      !/^[\+]?[1-9][\d]{0,15}$/.test(values.phone.replace(/\s/g, ""))
    ) {
      newErrors.phone = "Please enter a valid phone number";
    } else if (isRegisterMode && values.phone && values.phone.length !== 10) {
      newErrors.phone = "Phone number must be 10 digits";
    }

    if ((isRegisterMode || !isForgotPasswordMode) && !values.password) {
      newErrors.password = "Password is required";
    } else if (
      (isRegisterMode || !isForgotPasswordMode) &&
      values.password?.length < 6
    ) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (phase === "reset-password" && !values.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (
      phase === "reset-password" &&
      values.newPassword !== values.confirmPassword
    ) {
      newErrors.newPassword = "New password does not match";
    } else if (phase === "reset-password" && values.newPassword?.length < 6) {
      newErrors.newPassword = "New password must be at least 6 characters";
    }

    if (
      (isRegisterMode || phase === "reset-password") &&
      !values.confirmPassword
    ) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (isRegisterMode && values.confirmPassword !== values.password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Register consent validation (only for registration mode)
    if (isRegisterMode && !registerConsent) {
      newErrors.registerConsent = "You must agree to the Terms of Use";
    }

    if (isRegisterMode && !privacyConsent) {
      newErrors.privacyConsent = "You must agree to the Privacy Policy";
    }

    Object.keys(newErrors).forEach((key) => {
      if (newErrors[key]) setError(key, newErrors[key]);
      else setError(key, "");
    });

    return Object.values(newErrors).every((error) => !error);
  }

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
      const result = await dispatch(action(...args)).unwrap();

      // Handle 2FA case for login
      if (action === loginUser && result.requires_2fa) {
        setTwoFactorData({
          user_id: result.user_id,
          username: result.username,
        });
        setPhase("verify-2fa");
        return;
      }

      setPhase("success");
    } catch (error) {
      setPhase("failed");
      toast.error(error || "An error occurred. Please try again.", {
        duration: 2000,
      });
    }
  }

  async function handleSubmit(e) {
    e?.preventDefault();
    if (!validate()) return;

    if (isRegisterMode) {
      await handleAction(registerUser, {
        email: values.email,
        username: values.username,
        phone: values.phone,
        firstName: values.firstName,
        lastName: values.lastName,
        password: values.password,
        confirmPassword: values.confirmPassword,
        registerConsent: registerConsent,
        privacyConsent: privacyConsent,
      });
    } else if (isForgotPasswordMode && phase === "forgot") {
      await handleAction(forgotPassword, values.email);
      if (phase !== "failed") {
        setPhase("verify-otp");
      }
    } else if (phase === "reset-password") {
      await handleAction(resetPassword, {
        token: resetToken,
        otp: values.otp,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      });
    } else {
      await handleAction(loginUser, {
        username: values.email,
        password: values.password,
      });
    }
  }

  async function handleOtpSubmit(e) {
    e?.preventDefault();
    if (!validateOtp()) return;

    // Clear any existing OTP error before making the API call
    setError("otp", "");
    dispatch(clearError()); // Clear Redux error state
    setPhase("loading");
    try {
      const token = await dispatch(
        verifyOTP({ email: values.email, otp: values.otp })
      ).unwrap();
      // Clear any OTP error on success
      setError("otp", "");
      dispatch(clearError()); // Clear Redux error state on success
      setResetToken(token);
      setPhase("reset-password");
    } catch (error) {
      // Stay in verify-otp phase and show error inline
      setPhase("verify-otp");
      setError("otp", error || "Wrong OTP. Please try again.");
      // Don't show toast for OTP errors as they're displayed inline
    }
  }

  async function handle2FAOtpSubmit(e) {
    e?.preventDefault();
    if (!validateOtp()) return;

    // Clear any existing OTP error before making the API call
    setError("otp", "");
    dispatch(clearError()); // Clear Redux error state
    setPhase("loading");
    try {
      await dispatch(
        verifyLoginOTP({
          otp: values.otp,
          username: twoFactorData.username,
        })
      ).unwrap();

      // Clear any OTP error on success
      setError("otp", "");
      dispatch(clearError()); // Clear Redux error state on success
      setPhase("success");
    } catch (error) {
      // Stay in verify-2fa phase and show error inline
      setPhase("verify-2fa");
      setError("otp", error || "Invalid or expired OTP. Please try again.");

      // Handle rate limiting specifically
      if (error.includes("rate limit") || error.includes("Too many")) {
        toast.error("Too many attempts. Please try again later.", {
          duration: 5000,
        });
      }
    }
  }

  function handleOtpModalClose(open) {
    if (!open && status !== "loading") {
      resetModalToLogin();
    }
  }

  // Function to reset modal to default login state
  function resetModalToLogin() {
    console.log('🔄 [LoginModal] Resetting modal to login state');
    setIsRegisterMode(false);
    setIsForgotPasswordMode(false);
    setPhase("form");
    setResetToken(null);
    setTwoFactorData(null);
    setRegisterConsent(false);
    setPrivacyConsent(false);
    setShouldResetEmailValidation(true); // Reset email validation state
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
      phase === "reset-password"
        ? "Password updated successfully"
        : "Login successful!",
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
  }

  function handleRegister() {
    console.log('🔄 [LoginModal] Switching to register mode');
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

  // Reset the email validation reset flag after it's been used
  useEffect(() => {
    if (shouldResetEmailValidation) {
      setShouldResetEmailValidation(false);
    }
  }, [shouldResetEmailValidation]);

  // Reset email validation when email field becomes empty (only in register mode)
  useEffect(() => {
    if (isRegisterMode && (!values.email || values.email.trim() === "")) {
      console.log('🔄 [LoginModal] Email field is empty - resetting validation state');
      setShouldResetEmailValidation(true);
    }
  }, [values.email, isRegisterMode]);

  // Prefill email when modal opens and user info is available
  useEffect(() => {
    if (isOpen && userInfo && !values.email) {
      console.log("LoginModal userInfo:", userInfo);
      // Try different possible email field names from the API response
      const email = userInfo.user_email || userInfo.email || userInfo.username;
      console.log("LoginModal extracted email:", email);
      if (email) {
        console.log("LoginModal prefilling email:", email);
        setValue("email", email);
      } else {
        console.log("LoginModal no email found in userInfo");
      }
    }
  }, [isOpen, userInfo, setValue, values.email]);

  // Check if email is prefilled from user info
  const isEmailPrefilled =
    userInfo &&
    (userInfo.user_email || userInfo.email || userInfo.username) &&
    values.email ===
    (userInfo.user_email || userInfo.email || userInfo.username);

  // Memoized email change handler to prevent cursor jumping
  const handleEmailChange = useCallback(
    (e) => {
      console.log('📝 [LoginModal] Email field changed:', e.target.value);
      setValue("email", e.target.value);
    },
    [setValue]
  );

  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={isCloseDisabled ? undefined : handleModalClose}
      >
        <DialogContent
          className="sm:max-w-lg rounded-2xl shadow-xl p-0 overflow-y-auto max-h-[70vh] lg:max-h-[82vh] bg-white"
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
                        : phase === "verify-2fa"
                          ? "Two-Factor Authentication"
                          : title}
              </DialogTitle>
              <DialogDescription className="text-sm text-slate-600">
                {isRegisterMode
                  ? "Fill in the details to register a new account"
                  : phase === "forgot"
                    ? "Enter your email to receive a verification OTP"
                    : phase === "verify-otp"
                      ? `We've sent a 6-digit OTP to ${values.email}. Please enter it below.`
                      : phase === "reset-password"
                        ? "Enter your new password"
                        : phase === "verify-2fa"
                          ? `We've sent a 6-digit OTP to ${twoFactorData?.username}. Please enter it below to complete your login.`
                          : description}
              </DialogDescription>
            </DialogHeader>
          </div>

          <div
            className={`p-6 pt-0 ${isRegisterMode ? "min-h-[480px]" : "min-h-[420px]"
              }`}
          >
            <AnimatePresence mode="wait">
              {(phase === "form" ||
                phase === "forgot" ||
                phase === "reset-password" ||
                phase === "verify-2fa") && (
                  <motion.form
                    key="form"
                    onSubmit={
                      phase === "verify-2fa" ? handle2FAOtpSubmit : handleSubmit
                    }
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className={`grid ${isRegisterMode ? "gap-4" : "gap-5"}`}
                  >
                    {/* 2FA OTP Field */}
                    {phase === "verify-2fa" && (
                      <div className="grid gap-2">
                        <label
                          htmlFor="otp"
                          className="text-sm font-medium text-slate-800"
                        >
                          Enter 6-digit OTP
                        </label>
                        <ReusableTooltip
                          content={errors.otp}
                          variant="error"
                          side="top"
                        >
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
                                    className={`h-11 w-11 rounded-lg border text-center text-lg font-medium outline-none ring-0 transition-shadow focus:shadow-[0_0_0_4px_rgba(15,23,42,0.08)] ${errors.otp
                                      ? "border-red-300 bg-red-50 focus:shadow-[0_0_0_4px_rgba(239,68,68,0.08)]"
                                      : "border-slate-200 bg-white"
                                      }`}
                                  />
                                ))}
                            </InputOTPGroup>
                          </InputOTP>
                        </ReusableTooltip>
                      </div>
                    )}

                    {/* Email Field */}
                    {(phase === "form" || phase === "forgot") && (
                      <div className="grid gap-2">
                        <label
                          htmlFor="email"
                          className="text-sm font-medium text-slate-800"
                        >
                          Email Address
                          {emailValidation.isValidating && (
                            <span className="ml-2 text-xs text-slate-500">
                              (Validating...)
                            </span>
                          )}
                        </label>
                        <ReusableTooltip
                          content={
                            errors.email ||
                            (emailValidation.isDisposable === true &&
                              !emailValidation.isValidating &&
                              "Disposable email addresses are not allowed") ||
                            (isRegisterMode &&
                              emailValidation.isRegistered === true &&
                              !emailValidation.isValidating &&
                              "This email is already registered. Please use a different email or try logging in.") ||
                            (!isRegisterMode &&
                              emailValidation.isRegistered === false &&
                              !emailValidation.isValidating &&
                              "This email is not registered. Please check your email or register first.") ||
                            (emailValidation.error &&
                              !emailValidation.isValidating &&
                              "Unable to verify email. Please try again.")
                          }
                          variant="error"
                          side="top"
                        >
                          <div className="relative">
                            <div
                              className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 ${isEmailPrefilled
                                ? "text-orange-500"
                                : emailValidation.isValid === true
                                  ? "text-green-500"
                                  : (emailValidation.isDisposable === true ||
                                    (isRegisterMode && emailValidation.isRegistered === true) ||
                                    (!isRegisterMode && emailValidation.isRegistered === false))
                                    ? "text-red-500"
                                    : "text-slate-400"
                                }`}
                            >
                              <Mail className="h-4 w-4" />
                            </div>
                            <input
                              key="email-input"
                              id="email"
                              type="email"
                              value={values.email || ""}
                              onChange={handleEmailChange}
                              placeholder="user@example.com"
                              disabled={isEmailPrefilled}
                              className={`h-11 w-full rounded-xl border pl-9 pr-10 text-sm outline-none ring-0 transition-all duration-200 ${isEmailPrefilled
                                ? "border-orange-200 bg-orange-50 text-orange-800 cursor-not-allowed"
                                : emailValidation.isValid === true &&
                                  !emailValidation.isValidating
                                  ? "border-green-300 bg-green-50 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.08)]"
                                  : (emailValidation.isDisposable === true ||
                                    (isRegisterMode && emailValidation.isRegistered === true) ||
                                    (!isRegisterMode && emailValidation.isRegistered === false)) &&
                                    !emailValidation.isValidating
                                    ? "border-red-300 bg-red-50 focus:shadow-[0_0_0_4px_rgba(239,68,68,0.08)]"
                                    : errors.email && !emailValidation.isValidating
                                      ? "border-red-300 bg-red-50 focus:shadow-[0_0_0_4px_rgba(239,68,68,0.08)]"
                                      : "border-slate-200 bg-white focus:shadow-[0_0_0_4px_rgba(15,23,42,0.08)]"
                                }`}
                            />
                            {/* Validation status indicator - show in both modes */}
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                              {emailValidation.isValidating && (
                                <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                              )}
                              {!emailValidation.isValidating &&
                                emailValidation.isValid === true && (
                                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                                )}
                              {!emailValidation.isValidating &&
                                (emailValidation.isDisposable === true ||
                                  (isRegisterMode && emailValidation.isRegistered === true) ||
                                  (!isRegisterMode && emailValidation.isRegistered === false)) && (
                                  <XCircle className="h-4 w-4 text-red-500" />
                                )}
                            </div>
                          </div>
                        </ReusableTooltip>
                      </div>
                    )}

                    {/* Registration Fields (Compact Layout) */}
                    {isRegisterMode && phase === "form" && (
                      <div className="space-y-3">
                        {/* Top Row: Username and Phone */}
                        <div className="grid grid-cols-2 gap-3">
                          {/* Username Field */}
                          <div className="grid gap-2">
                            <label
                              htmlFor="username"
                              className="text-sm font-medium text-slate-800"
                            >
                              Username
                            </label>
                            <ReusableTooltip
                              content={errors.username}
                              variant="error"
                              side="top"
                            >
                              <div className="relative">
                                <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                  <User className="h-4 w-4" />
                                </div>
                                <input
                                  key="username-input"
                                  id="username"
                                  type="text"
                                  value={values.username || ""}
                                  onChange={(e) =>
                                    setValue("username", e.target.value)
                                  }
                                  placeholder="Username"
                                  className={`h-10 w-full rounded-xl border pl-9 pr-3 text-sm outline-none ring-0 transition-shadow focus:shadow-[0_0_0_4px_rgba(15,23,42,0.08)] ${errors.username
                                    ? "border-red-300 bg-red-50 focus:shadow-[0_0_0_4px_rgba(239,68,68,0.08)]"
                                    : "border-slate-200 bg-white"
                                    }`}
                                />
                              </div>
                            </ReusableTooltip>
                          </div>

                          {/* Phone Field */}
                          <div className="grid gap-2">
                            <label
                              htmlFor="phone"
                              className="text-sm font-medium text-slate-800"
                            >
                              Phone
                            </label>
                            <ReusableTooltip
                              content={errors.phone}
                              variant="error"
                              side="top"
                            >
                              <div className="relative">
                                <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                  <Phone className="h-4 w-4" />
                                </div>
                                <input
                                  key="phone-input"
                                  maxLength={10}
                                  id="phone"
                                  type="tel"
                                  inputMode="numeric"
                                  value={values.phone || ""}
                                  onChange={(e) =>
                                    setValue("phone", e.target.value)
                                  }
                                  placeholder="5551234567"
                                  className={`h-10 w-full rounded-xl border pl-9 pr-3 text-sm outline-none ring-0 transition-shadow focus:shadow-[0_0_0_4px_rgba(15,23,42,0.08)] ${errors.phone
                                    ? "border-red-300 bg-red-50 focus:shadow-[0_0_0_4px_rgba(239,68,68,0.08)]"
                                    : "border-slate-200 bg-white"
                                    }`}
                                />
                              </div>
                            </ReusableTooltip>
                          </div>
                        </div>

                        {/* Middle Row: First Name and Last Name */}
                        <div className="grid grid-cols-2 gap-3">
                          {/* First Name Field */}
                          <div className="grid gap-2">
                            <label
                              htmlFor="firstName"
                              className="text-sm font-medium text-slate-800"
                            >
                              First Name
                            </label>
                            <ReusableTooltip
                              content={errors.firstName}
                              variant="error"
                              side="top"
                            >
                              <div className="relative">
                                <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                  <User className="h-4 w-4" />
                                </div>
                                <input
                                  key="firstName-input"
                                  id="firstName"
                                  type="text"
                                  value={values.firstName || ""}
                                  onChange={(e) =>
                                    setValue("firstName", e.target.value)
                                  }
                                  placeholder="First name"
                                  className={`h-10 w-full rounded-xl border pl-9 pr-3 text-sm outline-none ring-0 transition-shadow focus:shadow-[0_0_0_4px_rgba(15,23,42,0.08)] ${errors.firstName
                                    ? "border-red-300 bg-red-50 focus:shadow-[0_0_0_4px_rgba(239,68,68,0.08)]"
                                    : "border-slate-200 bg-white"
                                    }`}
                                />
                              </div>
                            </ReusableTooltip>
                          </div>

                          {/* Last Name Field */}
                          <div className="grid gap-2">
                            <label
                              htmlFor="lastName"
                              className="text-sm font-medium text-slate-800"
                            >
                              Last Name
                            </label>
                            <ReusableTooltip
                              content={errors.lastName}
                              variant="error"
                              side="top"
                            >
                              <div className="relative">
                                <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                  <User className="h-4 w-4" />
                                </div>
                                <input
                                  key="lastName-input"
                                  id="lastName"
                                  type="text"
                                  value={values.lastName || ""}
                                  onChange={(e) =>
                                    setValue("lastName", e.target.value)
                                  }
                                  placeholder="Last name"
                                  className={`h-10 w-full rounded-xl border pl-9 pr-3 text-sm outline-none ring-0 transition-shadow focus:shadow-[0_0_0_4px_rgba(15,23,42,0.08)] ${errors.lastName
                                    ? "border-red-300 bg-red-50 focus:shadow-[0_0_0_4px_rgba(239,68,68,0.08)]"
                                    : "border-slate-200 bg-white"
                                    }`}
                                />
                              </div>
                            </ReusableTooltip>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Password Field (Login/Register Mode) */}
                    {phase === "form" && !isForgotPasswordMode && (
                      <div className="grid gap-2">
                        <label
                          htmlFor="password"
                          className="text-sm font-medium text-slate-800"
                        >
                          Password
                        </label>
                        <ReusableTooltip
                          content={errors.password}
                          variant="error"
                          side="top"
                        >
                          <div className="relative">
                            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                              <Lock className="h-4 w-4" />
                            </div>
                            <input
                              key="password-input"
                              id="password"
                              type={showPassword ? "text" : "password"}
                              value={values.password || ""}
                              onChange={(e) =>
                                setValue("password", e.target.value)
                              }
                              placeholder="••••••••"
                              className={`h-10 w-full rounded-xl border pl-9 pr-10 text-sm outline-none ring-0 transition-shadow focus:shadow-[0_0_0_4px_rgba(15,23,42,0.08)] ${errors.password
                                ? "border-red-300 bg-red-50 focus:shadow-[0_0_0_4px_rgba(239,68,68,0.08)]"
                                : "border-slate-200 bg-white"
                                }`}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </ReusableTooltip>
                      </div>
                    )}

                    {/* New Password Field (Reset Password Mode) */}
                    {phase === "reset-password" && (
                      <div className="grid gap-2">
                        <label
                          htmlFor="newPassword"
                          className="text-sm font-medium text-slate-800"
                        >
                          New Password
                        </label>
                        <ReusableTooltip
                          content={errors.newPassword}
                          variant="error"
                          side="top"
                        >
                          <div className="relative">
                            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                              <Lock className="h-4 w-4" />
                            </div>
                            <input
                              key="newPassword-input"
                              id="newPassword"
                              type={showNewPassword ? "text" : "password"}
                              value={values.newPassword || ""}
                              onChange={(e) =>
                                setValue("newPassword", e.target.value)
                              }
                              placeholder="••••••••"
                              className={`h-11 w-full rounded-xl border pl-9 pr-10 text-sm outline-none ring-0 transition-shadow focus:shadow-[0_0_0_4px_rgba(15,23,42,0.08)] ${errors.newPassword
                                ? "border-red-300 bg-red-50 focus:shadow-[0_0_0_4px_rgba(239,68,68,0.08)]"
                                : "border-slate-200 bg-white"
                                }`}
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                              {showNewPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </ReusableTooltip>
                      </div>
                    )}

                    {/* Confirm Password Field (Register/Reset Password Mode) */}
                    {(isRegisterMode || phase === "reset-password") && (
                      <div className="grid gap-2">
                        <label
                          htmlFor="confirmPassword"
                          className="text-sm font-medium text-slate-800"
                        >
                          Confirm Password
                        </label>
                        <ReusableTooltip
                          content={errors.confirmPassword}
                          variant="error"
                          side="top"
                        >
                          <div className="relative">
                            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                              <Lock className="h-4 w-4" />
                            </div>
                            <input
                              key="confirmPassword-input"
                              id="confirmPassword"
                              type={showConfirmPassword ? "text" : "password"}
                              value={values.confirmPassword || ""}
                              onChange={(e) =>
                                setValue("confirmPassword", e.target.value)
                              }
                              placeholder="••••••••"
                              className={`h-10 w-full rounded-xl border pl-9 pr-10 text-sm outline-none ring-0 transition-shadow focus:shadow-[0_0_0_4px_rgba(15,23,42,0.08)] ${errors.confirmPassword
                                ? "border-red-300 bg-red-50 focus:shadow-[0_0_0_4px_rgba(239,68,68,0.08)]"
                                : "border-slate-200 bg-white"
                                }`}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </ReusableTooltip>
                      </div>
                    )}

                    {/* Terms and Privacy Policy Consent (Registration Mode Only) */}
                    {isRegisterMode && (
                      <div className="space-y-3">
                        {/* Terms of Use Checkbox */}
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            id="registerConsent"
                            checked={registerConsent}
                            onChange={(e) => setRegisterConsent(e.target.checked)}
                            className="h-4 w-4 mt-1 flex-shrink-0 cursor-pointer text-orange-600 border-slate-300 rounded focus:ring-orange-500"
                          />
                          <label
                            htmlFor="registerConsent"
                            className="text-xs text-slate-700 cursor-pointer leading-relaxed"
                          >
                            I agree to the{" "}
                            <Link
                              to="/terms-of-service"
                              className="text-[#f6851f] hover:text-[#e63946] font-medium no-underline"
                              onClick={() => onClose(false)}
                            >
                              Account and Auction Terms for Customers
                            </Link>
                          </label>
                        </div>

                        {/* Privacy Policy Checkbox */}
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            id="consentPrivacy"
                            checked={privacyConsent}
                            onChange={(e) => setPrivacyConsent(e.target.checked)}
                            className="h-4 w-4 mt-1 flex-shrink-0 cursor-pointer text-orange-600 border-slate-300 rounded focus:ring-orange-500"
                          />
                          <label
                            htmlFor="consentPrivacy"
                            className="text-xs text-slate-700 cursor-pointer leading-relaxed"
                          >
                            I have read and agree to the{" "}
                            <Link
                              to="/privacy-policy"
                              className="text-[#f6851f] hover:text-[#e63946] font-medium no-underline"
                              onClick={() => onClose(false)}
                            >
                              Privacy Policy
                            </Link>
                          </label>
                        </div>
                      </div>
                    )}

                    {/* Register Consent Errors */}
                    {errors.registerConsent && (
                      <ReusableTooltip
                        content={errors.registerConsent}
                        variant="error"
                        side="top"
                      >
                        <div className="text-xs text-red-600">
                          {errors.registerConsent}
                        </div>
                      </ReusableTooltip>
                    )}

                    {errors.privacyConsent && (
                      <ReusableTooltip
                        content={errors.privacyConsent}
                        variant="error"
                        side="top"
                      >
                        <div className="text-xs text-red-600">
                          {errors.privacyConsent}
                        </div>
                      </ReusableTooltip>
                    )}

                    {/* Submit Button */}
                    <div className="pt-1">
                      <button
                        type="submit"
                        disabled={(() => {
                          const isDisabled = status === "loading" ||
                            (isRegisterMode &&
                              (!registerConsent ||
                                !privacyConsent ||
                                emailValidation.isValidating ||
                                emailValidation.isDisposable === true ||
                                emailValidation.isRegistered === true)) ||
                            (!isRegisterMode &&
                              (emailValidation.isValidating ||
                                emailValidation.isDisposable === true ||
                                emailValidation.isRegistered === false));

                          return isDisabled;
                        })()}
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
                                  : phase === "verify-2fa"
                                    ? "Verifying OTP..."
                                    : "Signing In..."}
                          </div>
                        ) : emailValidation.isValidating && isRegisterMode ? (
                          <div className="flex items-center justify-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Validating Email...
                          </div>
                        ) : isRegisterMode ? (
                          "Register"
                        ) : phase === "forgot" ? (
                          "Send OTP"
                        ) : phase === "reset-password" ? (
                          "Update Password"
                        ) : phase === "verify-2fa" ? (
                          "Verify OTP"
                        ) : (
                          "Login"
                        )}
                      </button>
                    </div>

                    {/* Back to Login Link (2FA Mode Only) */}
                    {phase === "verify-2fa" && (
                      <div className="text-center">
                        <button
                          type="button"
                          onClick={handleBackToLogin}
                          className="cursor-pointer text-sm text-slate-600 hover:text-slate-800 transition-colors underline underline-offset-2"
                        >
                          Back to Login
                        </button>
                      </div>
                    )}

                    {/* Forgot Password Link (Login Mode Only) */}
                    {!isRegisterMode &&
                      phase === "form" &&
                      !isForgotPasswordMode && (
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
                    {(phase === "form" || phase === "forgot") &&
                      !isForgotPasswordMode && (
                        <div className="text-center">
                          <p className="text-xs text-slate-600">
                            {isRegisterMode
                              ? "Already have an account?"
                              : "Don't have an account?"}{" "}
                            <button
                              type="button"
                              onClick={
                                isRegisterMode
                                  ? handleBackToLogin
                                  : handleRegister
                              }
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
                      {phase === "verify-2fa"
                        ? "Two-Factor Authentication provides enhanced security for your account"
                        : "Your credentials are encrypted and secure"}
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
                            : phase === "verify-2fa"
                              ? "Verifying your OTP..."
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
                        : phase === "verify-2fa"
                          ? "verify your OTP"
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
                    <h3 className="text-lg font-semibold text-slate-900">
                      Invalid credentials
                    </h3>
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
        <Dialog
          open={phase === "verify-otp"}
          onOpenChange={handleOtpModalClose}
        >
          <DialogContent className="sm:max-w-md rounded-2xl shadow-xl p-6 bg-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold tracking-tight text-slate-900">
                Verify OTP
              </DialogTitle>
              <DialogDescription className="text-sm text-slate-600">
                We’ve sent a 6-digit OTP to {values.email}. Please enter it
                below.
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
                <label
                  htmlFor="otp"
                  className="text-sm font-medium text-slate-800"
                >
                  OTP
                </label>
                <ReusableTooltip
                  content={errors.otp}
                  variant="error"
                  side="top"
                >
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
                            className={`h-11 w-11 rounded-lg border text-center text-lg font-medium outline-none ring-0 transition-shadow ${errors.otp
                              ? "border-red-300 bg-red-50 focus:shadow-[0_0_0_4px_rgba(239,68,68,0.08)]"
                              : "border-slate-200 bg-white"
                              }`}
                          />
                        ))}
                    </InputOTPGroup>
                  </InputOTP>
                </ReusableTooltip>
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
