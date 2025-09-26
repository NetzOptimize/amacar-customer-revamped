import { toast } from "react-hot-toast";
import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, ChevronLeft, ChevronRight, User, Mail, Phone, MapPin, Landmark, Building, Loader2, XCircle } from "lucide-react";
import AuctionSelectionModal from "@/components/ui/auction-selection-modal";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import LoginModal from "@/components/ui/LoginModal";
import { setLoginRedirect } from "@/redux/slices/userSlice"; // Adjust import path
import { updateQuestion, resetQuestions, fetchCityStateByZip } from "@/redux/slices/carDetailsAndQuestionsSlice"; // Adjust import path
import useEmailValidation from "@/hooks/useEmailValidation";

export default function ConditionAssessment() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { questions, vehicleDetails, stateZip, stateVin, location: reduxLocation, productId } = useSelector((state) => state.carDetailsAndQuestions);
  const userState = useSelector((state) => state.user.user);
  const [localCity, setLocalCity] = useState("");
  const [localState, setLocalState] = useState("");

  // Get productId from location state (for relisting) or Redux state
  const currentProductId = location.state?.productId || productId;

  // Initialize questions if invalid

  useEffect(() => {
    if (!questions || questions.length !== 8) {
      console.warn("Resetting questions due to invalid state");
      dispatch(resetQuestions());
    }
  }, [dispatch, questions]);

  useEffect(() => {
    console.log("vehicleDetails", vehicleDetails)
    console.log("userState", userState)
  }, [vehicleDetails, userState]);
  useEffect(() => {
    const result = dispatch(fetchCityStateByZip(stateZip))
    setLocalCity(result.city)
    setLocalState(result.state)
  }, [stateZip]);

  // Debug log for productId
  useEffect(() => {
    console.log("ConditionAssessment - currentProductId:", currentProductId);
    console.log("ConditionAssessment - location.state:", location.state);
    console.log("ConditionAssessment - Redux productId:", productId);
  }, [currentProductId, location.state, productId]);

  // Image loading handlers
  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  const handleImageLoadStart = () => {
    if (vehicleDetails?.vehicleImg) {
      setImageLoading(true);
      setImageError(false);
    }
  };
  
  // Group questions into sections for rendering
  const sections = useMemo(() => {
    if (!questions || questions.length < 8) {
      console.error("Questions array is incomplete:", questions);
      return [];
    }
    return [
      { questions: questions.slice(0, 2) }, // Cosmetic, Smoked
      { questions: questions.slice(2, 4) }, // Title, Accident
      { questions: questions.slice(4, 6) }, // Features, Modifications
      { questions: questions.slice(6, 8) }, // Warning, Tread
    ];
  }, [questions]);

  const [currentSection, setCurrentSection] = useState(0);
  const [showValidation, setShowValidation] = useState(false);
  const [showAuctionModal, setShowAuctionModal] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    phone: "",
    zipcode: "",
    state: "",
    city: "",
  });
  const [userErrors, setUserErrors] = useState({});
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Full name validation function
  const validateFullName = (name) => {
    if (!name || name.trim() === "") return false;
    const words = name.trim().split(/\s+/);
    return words.length >= 2 && words.every(word => word.length > 0);
  };

  // Phone validation function
  const validatePhone = (phone) => {
    if (!phone) return false;
    const digitsOnly = phone.replace(/\D/g, "");
    return digitsOnly.length === 10;
  };

  // Helper function to get full name from userState
  const getUserFullName = () => {
    if (userState?.first_name && userState?.last_name) {
      return `${userState.first_name} ${userState.last_name}`;
    }
    return userState?.first_name || userState?.last_name || userState?.display_name || "";
  };
  
  // Email validation for non-prefilled emails only
  const isEmailPrefilled = !!userState?.email;
  const [shouldResetEmailValidation, setShouldResetEmailValidation] = useState(false);
  const emailValidation = useEmailValidation(user.email, !isEmailPrefilled, shouldResetEmailValidation);

  const userExists = useSelector((state) => state?.user?.user);

  const formVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
    exit: { opacity: 0, y: -16, transition: { duration: 0.25 } },
  };

  const totalSections = sections.length;
  const answeredQuestions = questions ? questions.filter((q) => q.answer || (q.isMultiSelect && Array.isArray(q.answer) && q.answer.length > 0)).length : 0;
  const totalQuestions = questions ? questions.length : 0;
  const currentQuestions = sections[currentSection]?.questions || [];

  useEffect(() => {
    if (showValidation) {
      const timer = setTimeout(() => {
        setShowValidation(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showValidation]);

  // Reset email validation when email field becomes empty
  useEffect(() => {
    if (!isEmailPrefilled && (!user.email || user.email.trim() === "")) {
      setShouldResetEmailValidation(true);
    }
  }, [user.email, isEmailPrefilled]);

  // Reset the email validation reset flag after it's been used
  useEffect(() => {
    if (shouldResetEmailValidation) {
      setShouldResetEmailValidation(false);
    }
  }, [shouldResetEmailValidation]);



  function getFinalSubmissionData() {
    return questions ? questions.map((q) => ({
      key: q.key,
      label: q.label,
      answer: q.answer || null,
      details: q.details || null,
    })) : [];
  }

  // Simple function to open auction modal
  function handleSubmitToAuction(userFormData = null) {
    // Check if vehicle details exist
    if (!vehicleDetails || Object.keys(vehicleDetails).length === 0) {
      toast.error("Vehicle details are required. Please complete the VIN lookup first.");
      return;
    }

    // Store user form data in state to pass to modal
    if (userFormData) {
      setUser(userFormData);
    }

    // Open auction selection modal
    setShowAuctionModal(true);
  }


  const handleForgotPassword = () => {
    // console.log("Open forgot password modal");
  };

  const handleRegister = () => {
    // console.log("Open register modal");
  };

  function selectAnswer(key, value, isMultiSelect = false) {
    let newAnswer;
    if (isMultiSelect) {
      const currentAnswer = questions.find((q) => q.key === key)?.answer || [];
      
      // Special handling for "Notable features" question
      if (key === 'features') {
        if (value === 'None of the above') {
          // If "None of the above" is selected, clear all other selections
          newAnswer = ['None of the above'];
        } else {
          // If any other option is selected, remove "None of the above" if it exists
          const filteredAnswer = currentAnswer.filter(v => v !== 'None of the above');
          
          if (Array.isArray(filteredAnswer)) {
            newAnswer = filteredAnswer.includes(value)
              ? filteredAnswer.filter((v) => v !== value)
              : [...filteredAnswer, value];
          } else {
            newAnswer = [value];
          }
        }
      } else {
        // Default multi-select behavior for other questions
        newAnswer = Array.isArray(currentAnswer)
          ? currentAnswer.includes(value)
            ? currentAnswer.filter((v) => v !== value)
            : [...currentAnswer, value]
          : [value];
      }
    } else {
      newAnswer = value;
    }

    dispatch(updateQuestion({ key, answer: newAnswer }));
    setShowValidation(false);
  }

  function setQuestionDetails(key, value) {
    dispatch(updateQuestion({ key, details: value }));
  }

  function nextSection() {
    const unanswered = currentQuestions.some(
      (q) => !q.answer || (q.isMultiSelect && (!Array.isArray(q.answer) || q.answer.length === 0))
    );
    if (unanswered) {
      setShowValidation(true);
      return;
    }
    if (currentSection < totalSections - 1) {
      setCurrentSection(currentSection + 1);
      setShowValidation(false);
    }
  }

  function prevSection() {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
      setShowValidation(false);
    }
  }

  function handleContinue() {
    const unanswered = currentQuestions.some(
      (q) => !q.answer || (q.isMultiSelect && (!Array.isArray(q.answer) || q.answer.length === 0))
    );
    if (unanswered) {
      setShowValidation(true);
      return;
    }
    setShowValidation(false);
    setShowUserForm(true);
  }

  function renderQuestion(question, questionIndex) {
    console.log(question)
    const selected = question.answer;
    // console.log(question.answer)
    
    // Fixed: Added defensive checks for needsDetails
    const needsDetails = question.isMultiSelect
      ? (question.needsDetails && Array.isArray(question.needsDetails) && question.needsDetails.length > 0 && Array.isArray(selected) && selected.length > 0)
      : selected && question.needsDetails && Array.isArray(question.needsDetails) && question.needsDetails.includes(selected);

    return (
      <motion.div
        key={question.key}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: questionIndex * 0.1 }}
        className="rounded-2xl border border-white/60 bg-white/70 p-6 shadow-xl backdrop-blur-xl"
      >
        <div className="mb-4">
          <h3 className="text-lg md:text-xl font-semibold text-slate-900 mb-2">
            <span className="mr-2">{question.emoji || '❓'}</span>
            {question.label}
          </h3>
        </div>

        <div className={`grid ${question.isMultiSelect ? "grid-cols-1 gap-2" : "grid-cols-2 gap-3 md:grid-cols-3"} mb-4`}>
          {(question.options || []).map((opt) => {
            const isSelected = question.isMultiSelect
              ? Array.isArray(selected) && selected.includes(opt)
              : selected === opt;
            return (
              <button
                key={opt}
                onClick={() => selectAnswer(question.key, opt, question.isMultiSelect)}
                className={`cursor-pointer group rounded-xl border p-3 text-sm font-medium transition hover:scale-[1.01] ${
                  isSelected
                    ? "border-orange-400 bg-orange-50 text-orange-800"
                    : "border-slate-200 bg-white text-slate-800"
                }`}
              >
                <div className="flex items-center gap-2">
                  {isSelected ? (
                    <CheckCircle2 className="h-4 w-4 text-orange-600" />
                  ) : (
                    <Circle className="h-4 w-4 text-slate-300" />
                  )}
                  <span>{opt}</span>
                </div>
              </button>
            );
          })}
        </div>

        {needsDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
            className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200"
          >
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Additional details:
            </label>
            <textarea
              value={question.details || ""}
              onChange={(e) => setQuestionDetails(question.key, e.target.value)}
              placeholder="Describe specific details..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[#f6851f]/20 focus:border-[#f6851f] resize-none"
              rows={3}
            />
          </motion.div>
        )}
      </motion.div>
    );
  }

  // Show loading or error if questions are not ready
  if (!questions || questions.length === 0) {
    return (
      <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100 pt-20 md:pt-24">
        <div className="mx-auto max-w-6xl px-6 py-8 md:py-12 text-center">
          <h1 className="mb-6 text-center text-3xl md:text-4xl font-bold text-slate-900">
            Loading Assessment...
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100 pt-20 md:pt-24">
      <div className="mx-auto max-w-6xl px-6 py-8 md:py-12">
        <h1 className="mb-6 text-center text-3xl md:text-4xl font-bold text-slate-900">
          Vehicle Condition Assessment
        </h1>

        {showValidation && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mb-6 rounded-xl border border-red-400 bg-red-50 p-4 text-sm text-red-800 shadow-sm"
          >
            Please answer all questions in this step before proceeding.
          </motion.div>
        )}

        <div className="mb-6 w-1/3 flex items-center gap-3">
          <div className="text-xs font-medium text-slate-600">Step {currentSection + 1} of {totalSections}</div>
          <div className="flex items-center gap-1 flex-1 max-w-[150px]">
            {sections.map((_, index) => (
              <motion.div
                key={index}
                className="h-2 rounded-full bg-slate-200"
                initial={{ width: 0 }}
                animate={{
                  width: index === currentSection ? "40%" : index < currentSection ? "25%" : "15%",
                  backgroundColor: index <= currentSection ? "#f6851f" : "#e2e8f0",
                }}
                transition={{ duration: 0.4 }}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            {!showUserForm && (
              <motion.div initial="hidden" animate="visible" exit="exit" variants={formVariants}>
                <div className="space-y-6">{currentQuestions.map((question, index) => renderQuestion(question, index))}</div>

                <div className="mt-6 flex items-center justify-between gap-3">
                  <button
                    onClick={prevSection}
                    disabled={currentSection === 0}
                    className={`cursor-pointer inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-medium shadow-sm transition hover:scale-[1.01] ${
                      currentSection === 0
                        ? "border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <ChevronLeft className="h-4 w-4" /> Previous
                  </button>

                  <div className="text-sm text-slate-600">
                    Step {currentSection + 1} of {totalSections}
                  </div>

                  {currentSection < totalSections - 1 ? (
                    <button
                      onClick={nextSection}
                      className="cursor-pointer inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#f6851f] px-6 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:scale-[1.01]"
                    >
                      Next <ChevronRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      onClick={handleContinue}
                      className="cursor-pointer inline-flex h-11 items-center justify-center rounded-xl bg-[#f6851f] px-6 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:scale-[1.01]"
                    >
                      Continue
                    </button>
                  )}
                </div>
              </motion.div>
            )}

            {showUserForm && (
              <motion.div initial="hidden" animate="visible" exit="exit" variants={formVariants} className="rounded-2xl border border-white/60 bg-white/70 p-6 shadow-xl backdrop-blur-xl">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-slate-900">Your Details</h2>
                  <p className="text-sm text-slate-600">
                    {getUserFullName() ? "Verify your information below." : "Provide contact and address information to proceed."}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-slate-800 flex items-center gap-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className={`h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 ${
                        getUserFullName() ? "text-orange-500" : "text-slate-400"
                      }`} />
                      <input
                        value={user.fullName || getUserFullName() || ""}
                        onChange={(e) => setUser({ ...user, fullName: e.target.value })}
                        placeholder="Enter full name"
                        disabled={!!getUserFullName()}
                        className={`h-11 w-full rounded-xl border bg-white pl-9 pr-3 text-base outline-none transition-shadow ${
                          getUserFullName() 
                            ? "bg-green-50 border-orange-200 text-orange-800 cursor-not-allowed" 
                            : userErrors.fullName 
                              ? "border-red-300" 
                              : "border-slate-200 focus:shadow-[0_0_0_4px_rgba(246,133,31,0.18)]"
                        }`}
                      />
                      {getUserFullName() && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <div className="h-2 w-2 bg-orange-500 rounded-full"></div>
                        </div>
                      )}
                    </div>
                    
                  </div>

                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-slate-800 flex items-center gap-2">
                      Email Address
                      {!isEmailPrefilled && emailValidation.isValidating && (
                        <span className="ml-2 text-xs text-slate-500">(Validating...)</span>
                      )}
                    </label>
                    <div className="relative">
                      <Mail className={`h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 ${
                        userState?.email 
                          ? "text-orange-500" 
                          : !isEmailPrefilled && emailValidation.isValid === true 
                            ? "text-green-500" 
                            : !isEmailPrefilled && emailValidation.isDisposable === true 
                              ? "text-red-500" 
                              : "text-slate-400"
                      }`} />
                      <input
                        value={user.email || userState?.email || ""}
                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                        placeholder="name@example.com"
                        disabled={!!userState?.email}
                        className={`h-11 w-full rounded-xl border bg-white pl-9 pr-10 text-base outline-none transition-all duration-200 ${
                          userState?.email 
                            ? "bg-orange-50 border-orange-200 text-orange-800 cursor-not-allowed" 
                            : !isEmailPrefilled && emailValidation.isDisposable === true
                              ? "border-red-300 bg-red-50 focus:shadow-[0_0_0_4px_rgba(239,68,68,0.18)]"
                              : userErrors.email && !emailValidation.isValidating
                                ? "border-red-300 bg-red-50 focus:shadow-[0_0_0_4px_rgba(239,68,68,0.18)]"
                                : "border-slate-200 focus:shadow-[0_0_0_4px_rgba(246,133,31,0.18)]"
                        }`}
                      />
                      {/* Validation status indicator - only show for non-prefilled emails */}
                      {!isEmailPrefilled && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          {emailValidation.isValidating && (
                            <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                          )}
                          {!emailValidation.isValidating && emailValidation.isValid === true && (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          )}
                          {!emailValidation.isValidating && emailValidation.isDisposable === true && (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                      )}
                      {userState?.email && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <div className="h-2 w-2 bg-orange-500 rounded-full"></div>
                        </div>
                      )}
                    </div>
                    
                    {!isEmailPrefilled && emailValidation.isDisposable === true && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs text-red-600"
                      >
                        Disposable email addresses are not allowed
                      </motion.p>
                    )}
                    
                    {!isEmailPrefilled && emailValidation.error && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs text-red-600"
                      >
                        Unable to verify email. Please try again.
                      </motion.p>
                    )}
                    
                  
                  </div>

                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-slate-800 flex items-center gap-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className={`h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 ${
                        userState?.meta?.phone ? "text-orange-500" : "text-slate-400"
                      }`} />
                      <input
                        maxLength={10}
                        
                        value={user.phone || userState?.meta?.phone || ""}
                        onChange={(e) => setUser({ ...user, phone: e.target.value.replace(/[^0-9+\-\s]/g, "") })}
                        placeholder="+1 555 123 4567"
                        disabled={!!userState?.meta?.phone}
                        className={`h-11 w-full rounded-xl border bg-white pl-9 pr-3 text-base outline-none transition-shadow ${
                          userState?.meta?.phone 
                            ? "bg-orange-50 border-orange-200 text-orange-800 cursor-not-allowed" 
                            : userErrors.phone 
                              ? "border-red-300" 
                              : "border-slate-200 focus:shadow-[0_0_0_4px_rgba(246,133,31,0.18)]"
                        }`}
                      />
                      {userState?.meta?.phone && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <div className="h-2 w-2 bg-orange-500 rounded-full"></div>
                        </div>
                      )}
                    </div>
                  
                  </div>

                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-slate-800 flex items-center gap-2">
                      Zipcode
                    </label>
                    <div className="relative">
                      <MapPin className={`h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 ${
                        userState?.zipcode || stateZip ? "text-orange-500" : "text-slate-400"
                      }`} />
                      <input
                        value={user.zipcode || stateZip || ""}
                        onChange={(e) => setUser({ ...user, zipcode: e.target.value.replace(/[^0-9]/g, "").slice(0, 10) })}
                        placeholder="94016"
                        disabled={!!stateZip}
                        className={`h-11 w-full rounded-xl border bg-white pl-9 pr-3 text-base outline-none transition-shadow ${
                          stateZip
                            ? "bg-orange-50 border-orange-200 text-orange-800 cursor-not-allowed" 
                            : userErrors.zipcode 
                              ? "border-red-300" 
                              : "border-slate-200 focus:shadow-[0_0_0_4px_rgba(246,133,31,0.18)]"
                        }`}
                      />
                      {stateZip && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <div className="h-2 w-2 bg-orange-500 rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-slate-800 flex items-center gap-2">
                      State
                    </label>
                    <div className="relative">
                      <Landmark className={`h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 ${
                        reduxLocation.state ? "text-orange-500" : "text-slate-400"
                      }`} />
                      <input
                        value={user.state || reduxLocation.state || localState || ""}
                        onChange={(e) => setUser({ ...user, state: e.target.value })}
                        placeholder="State"
                        disabled={!!reduxLocation.state || !!localState}
                        className={`h-11 w-full rounded-xl border bg-white pl-9 pr-3 text-base outline-none transition-shadow ${
                          reduxLocation.state || localState 
                            ? "bg-orange-50 border-orange-200 text-orange-800 cursor-not-allowed" 
                            : userErrors.state 
                              ? "border-red-300" 
                              : "border-slate-200 focus:shadow-[0_0_0_4px_rgba(246,133,31,0.18)]"
                        }`}
                      />
                      {reduxLocation.state && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <div className="h-2 w-2 bg-orange-500 rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-slate-800 flex items-center gap-2">
                      City
                    </label>
                    <div className="relative">
                      <Building className={`h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 ${
                        reduxLocation.city || localCity ? "text-orange-500" : "text-slate-400"
                      }`} />
                      <input
                        value={user.city || reduxLocation.city || localCity || ""}
                        onChange={(e) => setUser({ ...user, city: e.target.value })}
                        placeholder="City"
                        disabled={!!reduxLocation.city || !!localCity}
                        className={`h-11 w-full rounded-xl border bg-white pl-9 pr-3 text-base outline-none transition-shadow ${
                          reduxLocation.city || localCity 
                            ? "bg-orange-50 border-orange-200 text-orange-800 cursor-not-allowed" 
                            : userErrors.city 
                              ? "border-red-300" 
                              : "border-slate-200 focus:shadow-[0_0_0_4px_rgba(246,133,31,0.18)]"
                        }`}
                      />
                     {(reduxLocation.city || localCity) && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <div className="h-2 w-2 bg-orange-500 rounded-full"></div>
                      </div>
                    )}

                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between gap-3">
                  <button
                    onClick={() => setShowUserForm(false)}
                    className="cursor-pointer inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition hover:scale-[1.01]"
                  >
                    <ChevronLeft className="h-4 w-4" /> Back
                  </button>

                  {/* Vehicle details missing warning */}
                  {(!vehicleDetails || Object.keys(vehicleDetails).length === 0) && (
                    <div className="flex-1 mx-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800 mb-2">
                        <strong>Vehicle details required:</strong> Please complete the VIN lookup first to get an instant cash offer.
                      </p>
                 
                    </div>
                  )}

                    <button
                      onClick={() => {
                        const finalUserData = {
                          fullName: user.fullName || getUserFullName() || "",
                          email: user.email || userState?.email || "",
                          phone: user.phone || userState?.meta?.phone || "",
                          zipcode: user.zipcode || stateZip || "",
                          state: user.state || reduxLocation.state || localState || "",
                          city: user.city || reduxLocation.city || localCity || "",
                        };

                        const errs = {};
                        if (!finalUserData.fullName || !validateFullName(finalUserData.fullName)) errs.fullName = true;
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (!emailRegex.test(finalUserData.email)) {
                          // Only show regex validation error if email validation hasn't started yet
                          if (!emailValidation.isValidating) {
                            errs.email = true;
                          }
                        } else if (!isEmailPrefilled && emailValidation.isDisposable === true) {
                          errs.email = true;
                        } else if (!isEmailPrefilled && emailValidation.error) {
                          errs.email = true;
                        }
                        if (!finalUserData.phone || !validatePhone(finalUserData.phone)) errs.phone = true;
                        if (!finalUserData.zipcode) errs.zipcode = true;
                        if (!finalUserData.state) errs.state = true;
                        if (!finalUserData.city) errs.city = true;

                        setUserErrors(errs);
                        const data = getFinalSubmissionData();

                        if (Object.keys(errs).length === 0) {
                          handleSubmitToAuction(finalUserData);
                        }
                      }}
                      disabled={!vehicleDetails || Object.keys(vehicleDetails).length === 0 || (!isEmailPrefilled && (emailValidation.isValidating || emailValidation.isDisposable === true))}
                      className={`cursor-pointer inline-flex h-11 items-center justify-center rounded-xl bg-gradient-to-r bg-[#f6851f]  px-6 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:scale-[1.01] ${
                        !vehicleDetails || Object.keys(vehicleDetails).length === 0 || (!isEmailPrefilled && (emailValidation.isValidating || emailValidation.isDisposable === true))
                          ? 'opacity-50 cursor-not-allowed' 
                          : ''
                      }`}
                    >
                      {(!vehicleDetails || Object.keys(vehicleDetails).length === 0) ? (
                        'VIN Required'
                      ) : !isEmailPrefilled && emailValidation.isValidating ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Validating Email...
                        </div>
                      ) : (
                        'see your offer'
                      )}
                    </button>
                  
                  {/* Success display for offer */}
                  {/* {offerStatus === 'succeeded' && offer.offerAmount && (
                    <div className="mt-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        <h3 className="text-lg font-semibold text-green-800">Instant Cash Offer Received!</h3>
                      </div>
                      <p className="text-2xl font-bold text-green-700 mb-2">${offer.offerAmount}</p>
                      <p className="text-sm text-green-600 mb-3">
                        {offer.carSummary?.make} {offer.carSummary?.model} {offer.carSummary?.modelyear}
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setShowAuctionModal(true)}
                          className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => dispatch(clearOffer())}
                          className="px-4 py-2 border border-green-300 text-green-700 text-sm font-medium rounded-lg hover:bg-green-50"
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  )} */}

                </div>
              </motion.div>
            )}
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-6">
              {/* Merged Vehicle Information and Your Answers Card */}
              <div className="rounded-2xl border border-white/60 bg-white/70 shadow-xl backdrop-blur-xl overflow-hidden">
                <div className="h-auto lg:h-[560px] lg:overflow-y-auto">
                  <div className="p-6">
                    {/* Vehicle Information Section */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-slate-900">Vehicle Information</h3>
                        <div className="h-2 w-2 bg-orange-500 rounded-full"></div>
                      </div>
                      
                      {/* VIN Badge */}
                      <div className="mb-4">
                        <div className="inline-flex items-center px-3 py-1.5 rounded-lg bg-gradient-to-r bg-[#f6851f] text-white text-sm font-semibold">
                          VIN- {stateVin || vehicleDetails?.vin || "JTHBL46FX75021954"}
                        </div>
                      </div>

                      {/* Vehicle Details */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-slate-700">Vehicle</span>
                          <span className="text-sm font-semibold text-slate-900">
                            {vehicleDetails?.modelyear || "2007"} {vehicleDetails?.make || "LEXUS"} {vehicleDetails?.model || "LS"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-slate-700">Type</span>
                          <span className="text-sm font-semibold text-[#f6851f]">
                            {vehicleDetails?.bodytype || "SEDAN"} {vehicleDetails?.doors || "4D"} {vehicleDetails?.model || "LS460"} {vehicleDetails?.engineconfiguration || "4.6L"} {vehicleDetails?.fueltype || "V8"}
                          </span>
                        </div>
                      </div>

                      {/* Vehicle Image */}
                      <div className="relative mb-4">
                        <div className="w-full h-48 rounded-xl overflow-hidden border-2 border-slate-200 bg-slate-100">
                          {vehicleDetails?.vehicleImg ? (
                            <>
                              {imageLoading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
                                  <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
                                </div>
                              )}
                              <img 
                                src={vehicleDetails.vehicleImg} 
                                alt="Vehicle image" 
                                className={`w-full h-full object-cover transition-opacity duration-300 ${
                                  imageLoading ? 'opacity-0' : 'opacity-100'
                                }`}
                                onLoadStart={handleImageLoadStart}
                                onLoad={handleImageLoad}
                                onError={handleImageError}
                                style={{ display: imageLoading ? 'none' : 'block' }}
                              />
                              {imageError && (
                                <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
                                  <div className="text-center">
                                    <div className="text-slate-400 mb-2">⚠️</div>
                                    <p className="text-xs text-slate-500">Image failed to load</p>
                                  </div>
                                </div>
                              )}
                            </>
                          ) : (
                            <img 
                              src="https://dealer.amacar.ai/wp-content/uploads/2024/10/amacar-placeholder2.png" 
                              alt="Vehicle placeholder" 
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                      </div>

                      {/* Additional Info */}
                      <div className="space-y-1.5 text-xs text-slate-500 mb-6">
                        <div className="flex justify-between">
                          <span>Mileage:</span>
                          <span className="font-medium">{vehicleDetails?.mileage ? Number(vehicleDetails.mileage).toLocaleString() + ' km' : 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Location:</span>
                          <span className="font-medium">{reduxLocation?.city || localCity || 'N/A'}, {reduxLocation?.state || localState || 'N/A'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Your Answers Section */}
                    <div>
                      <div className="mb-3 flex items-center justify-between">
                        <p className="text-sm font-medium text-slate-900">Your Answers</p>
                        <span className="text-xs text-slate-600">
                          {answeredQuestions}/{totalQuestions}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {questions.map((q) => (
                          <div
                            key={q.key}
                            className="rounded-xl border border-slate-200 bg-white px-3 py-2 flex flex-col"
                          >
                            <div className=" flex items-center justify-between text-sm gap-2">
                              <div className="flex items-center gap-2 min-w-0">
                                <span>{q.emoji || '❓'}</span>
                                <span className="truncate min-w-0">{q.label}</span>
                              </div>
                              <span
                                className={`text-xs overflow-hidden text-ellipsis font-medium whitespace-nowrap ${
                                  q.answer ? "text-orange-700" : "text-slate-500"
                                }`}
                              >
                                {q.isMultiSelect
                                  ? Array.isArray(q.answer) && q.answer.length > 0
                                    ? q.answer.join(", ")
                                    : "—"
                                  : q.answer || "—"}
                              </span>
                            </div>

                            {q.details && (
                              <div className="mt-2 text-xs text-slate-600 bg-slate-50 px-2 py-1 rounded break-words">
                                {q.details.substring(0, 60)}...
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AuctionSelectionModal 
        isOpen={showAuctionModal} 
        onClose={() => setShowAuctionModal(false)}
        userFormData={user}
      />

      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onForgotPassword={handleForgotPassword}
        onRegister={handleRegister}
      />
    </div>
  );
}