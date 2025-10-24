import React, { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Users, CheckCircle, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getInstantCashOffer } from "@/redux/slices/carDetailsAndQuestionsSlice";
import { autoLoginWithToken } from "@/redux/slices/userSlice";
import ErrorModal from "@/components/ui/ErrorModal";

export default function AuctionSelectionModal({
  isOpen,
  onClose,
  userFormData = null,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    questions,
    vehicleDetails,
    stateZip,
    stateVin,
    location,
    relistVehicleId,
  } = useSelector((state) => state.carDetailsAndQuestions);
  const userState = useSelector((state) => state.user.user);

  const [selectedOption, setSelectedOption] = useState(null); // 'local' or 'all' or null
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [termsConsent, setTermsConsent] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorSuggestion, setErrorSuggestion] = useState("");

  const handleOptionSelect = (optionId) => {
    setSelectedOption(optionId);
  };

  const auctionOptions = [
    {
      id: "local",
      title: "Local Dealers",
      subtitle:
        "Three verified dealers are actively interested in buying your car",
      icon: MapPin,
      color: "from-blue-500 to-blue-600",
      borderColor: "border-blue-200",
      bgColor: "bg-blue-50/50",
      consentText: (
        <span>
          I have read{" "}
          <Link
            to="/terms-of-service"
            className="no-underline font-bold text-[#f6851f] hover:underline"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            to="/privacy-policy"
            className="no-underline font-bold text-[#f6851f] hover:underline"
          >
            Privacy Policy
          </Link>{" "}
          and I agree to share my contact details with Amacar's participating
          dealers, who may contact me by phone, text, or email about this offer.
        </span>
      ),
      termsText: "I agree",
    },
    {
      id: "all",
      title: "All (Dealerships across platform)",
      subtitle:
        "See if more dealers across Amacar can beat these offers — would you like to explore?",
      icon: Users,
      color: "from-orange-500 to-orange-600",
      borderColor: "border-orange-200",
      bgColor: "bg-orange-50/50",
      consentText: (
        <span>
          Additional dealerships on the Amacar platform may provide more
          competitive offers. By consenting, I authorize Amacar to share my
          details with member dealerships for this purpose. Dealers may contact
          me by phone, text, or email
        </span>
      ),
    },
  ];
  // Build the API request payload for Instant Cash Offer
  function buildOfferPayload() {
    console.log("=== BUILDING OFFER PAYLOAD ===");
    console.log("Raw questions from Redux:", questions);

    const conditionData = questions
      ? questions.map((q) => ({
          question_key: q.key,
          question_text: q.label,
          answer: q.answer,
          details: q.details,
        }))
      : [];

    console.log("Processed condition data:", conditionData);

    // Build question deductions based on user's actual answers
    const questionDeductions = {};

    // Define deduction mappings
    const deductionMappings = {
      cosmetic: {
        Excellent: 0, // Online offer
        Good: 850, // $850 Less
        Fair: 1150, // $1150 Less
        Poor: 1150, // $1150 Less
      },
      smoked: {
        No: 0,
        Yes: 250, // $250 Less
      },
      title: {
        Clean: 0, // No change
        Salvage: 0, // No change
        Rebuilt: 0, // No change
      },
      accident: {
        None: 0, // No Change
        Minor: 450, // $450 Less
        Major: 600, // $600 Less
      },
      features: {
        Navigation: -100, // Add $100
        Leather: -100, // Add $100
        Sunroof: -100, // Add $100
        "Alloy Wheels": -100, // Add $100
        "Premium Audio": -100, // Add $100
        "None of the above": 0,
      },
      modifications: {
        No: 0, // No change value
        Yes: 0, // No change in value
      },
      warning: {
        No: 0, // No Change
        Yes: 950, // $950 Less
      },
      tread: {
        New: 0, // No Change
        Good: 0, // No Change
        Fair: 150, // $150 Less
        Replace: 500, // $500 Less
      },
    };

    // Calculate deductions for each question based on user's answers
    console.log("=== CALCULATING DEDUCTIONS ===");
    conditionData.forEach((q, index) => {
      console.log(`\n--- Processing Question ${index + 1} ---`);
      console.log("Question key:", q.question_key);
      console.log("Question text:", q.question_text);
      console.log("User answer:", q.answer);
      console.log(
        "Answer type:",
        typeof q.answer,
        Array.isArray(q.answer) ? "(array)" : ""
      );

      const mapping = deductionMappings[q.question_key];
      console.log("Available mapping for this question:", mapping);

      if (mapping) {
        if (q.question_key === "features" && Array.isArray(q.answer)) {
          console.log("Processing multi-select features...");
          // Handle multi-select features - create object with each selected feature
          const featuresDeduction = {};
          q.answer.forEach((feature, featureIndex) => {
            console.log(`  Feature ${featureIndex + 1}: "${feature}"`);
            if (mapping[feature] !== undefined) {
              console.log(`Deduction for "${feature}": ${mapping[feature]}`);
              featuresDeduction[feature] = mapping[feature];
            } else {
              console.log(`No mapping found for "${feature}"`);
            }
          });
          questionDeductions.notable_features = featuresDeduction;
          console.log(`Features deduction object:`, featuresDeduction);
        } else if (mapping[q.answer] !== undefined) {
          console.log("Processing single-select question...");
          // Handle single-select questions - create object with answer and value
          const deductionValue = mapping[q.answer];
          console.log(`Deduction value for "${q.answer}": ${deductionValue}`);

          // Create the nested object format: { answer: value }
          const deductionObject = { [q.answer]: deductionValue };

          switch (q.question_key) {
            case "cosmetic":
              questionDeductions.cosmetic_condition = deductionObject;
              console.log("Set cosmetic_condition:", deductionObject);
              break;
            case "smoked":
              questionDeductions.smoked_windows = deductionObject;
              console.log("Set smoked_windows:", deductionObject);
              break;
            case "title":
              questionDeductions.title_status = deductionObject;
              console.log("Set title_status:", deductionObject);
              break;
            case "accident":
              questionDeductions.accident_history = deductionObject;
              console.log("Set accident_history:", deductionObject);
              break;
            case "modifications":
              questionDeductions.modifications = deductionObject;
              console.log("Set modifications:", deductionObject);
              break;
            case "warning":
              questionDeductions.warning_lights = deductionObject;
              console.log("Set warning_lights:", deductionObject);
              break;
            case "tread":
              questionDeductions.tire_condition = deductionObject;
              console.log("Set tire_condition:", deductionObject);
              break;
            default:
              console.log("No case found for key:", q.question_key);
          }
        } else {
          console.log(
            `No mapping found for answer "${q.answer}" in question "${q.question_key}"`
          );
        }
      } else {
        console.log(
          `No deduction mapping defined for question key: "${q.question_key}"`
        );
      }
    });

    console.log("=== FINAL CALCULATED DEDUCTIONS ===");
    console.log("questionDeductions object:", questionDeductions);
    console.log("Deductions summary:");
    Object.entries(questionDeductions).forEach(([key, value]) => {
      console.log(`  ${key}:`, value);
    });

    // Map vehicle data to the correct API format
    console.log("\n=== BUILDING VEHICLE PAYLOAD ===");
    console.log("Raw vehicleDetails:", vehicleDetails);
    console.log("stateVin:", stateVin);
    console.log("stateZip:", stateZip);

    const vehiclePayload = {
      mileage_km: parseInt(
        vehicleDetails.mileage ||
          vehicleDetails.mileage_km ||
          vehicleDetails.odometer ||
          0
      ),
      exterior_color:
        vehicleDetails.exterior_color ||
        vehicleDetails.color ||
        vehicleDetails.exteriorColor ||
        "Unknown",
      interior_color:
        vehicleDetails.interior_color ||
        vehicleDetails.interiorColor ||
        "Unknown",
      body_type:
        vehicleDetails.body_type ||
        vehicleDetails.bodyType ||
        vehicleDetails.body_style ||
        "Unknown",
      transmission:
        vehicleDetails.transmission ||
        vehicleDetails.transmission_type ||
        "Unknown",
      engine_type:
        vehicleDetails.engine_type ||
        vehicleDetails.engineType ||
        vehicleDetails.engine ||
        "Unknown",
      powertrain_description:
        vehicleDetails.powertrain_description ||
        vehicleDetails.powertrainDescription ||
        vehicleDetails.drivetrain ||
        "Unknown",
      vin: vehicleDetails.vin || vehicleDetails.vin_number || stateVin || "",
      zip_code: stateZip || "",
    };

    console.log("Processed vehicle payload:", vehiclePayload);

    // Determine share_info_with based on selected option
    const shareInfoWith = selectedOption ? selectedOption : "";
    console.log("Selected auction option:", selectedOption);
    console.log("Dealers to send details:", shareInfoWith);

    console.log("\n=== BUILDING FINAL PAYLOAD ===");
    const payload = {
      vehicle: vehiclePayload,
      condition_assessment: conditionData,
      question_deductions: questionDeductions,
      user_info: {
        full_name: userFormData?.fullName || userState?.display_name || "",
        email: userFormData?.email || userState?.email || "",
        phone: userFormData?.phone || userState?.meta?.phone || "",
        city: userFormData?.city || location.city || "",
        state: userFormData?.state || location.state || "",
        zip_code: userFormData?.zipcode || stateZip || "",
      },
      dealers_to_send_details: shareInfoWith,
      offer_terms: selectedOption ? "accepted" : "not_accepted",
    };

    // Add relistVehicleId if it exists (for relisting vehicles)
    if (relistVehicleId) {
      payload.relist_vehicle_id = relistVehicleId;
      console.log(
        "Adding relistVehicleId to payload for relisting:",
        relistVehicleId
      );
    } else {
      console.log("No relistVehicleId found - this is a new vehicle listing");
    }

    console.log("=== FINAL PAYLOAD ===");
    console.log(
      "Complete payload being sent to API:",
      JSON.stringify(payload, null, 2)
    );

    return payload;
  }

  const handleGo = async () => {
    console.log("=== HANDLE GO CLICKED ===");
    console.log("Selected option:", selectedOption);
    console.log("Terms consent:", termsConsent);
    console.log("relistVehicleId from Redux:", relistVehicleId);

    if (!selectedOption) {
      console.log("ERROR: No auction option selected");
      toast.error("Please select an auction option.");
      return;
    }

    // Check for required consent
    if (!termsConsent) {
      console.log("ERROR: Terms not accepted");
      toast.error(
        "Please agree to the Terms of Use and Privacy Policy to proceed."
      );
      return;
    }

    try {
      setIsSubmitting(true);
      console.log("Building offer payload...");

      const offerPayload = buildOfferPayload();
      console.log("=== SUBMITTING TO API ===");
      console.log("Final payload being sent:", offerPayload);

      const result = await dispatch(getInstantCashOffer(offerPayload)).unwrap();
      console.log("=== API RESPONSE SUCCESS ===");
      console.log("Instant Cash Offer successful:", result);

      // Check if user info and JWT token are present for auto-login
      if (result.userInfo && result.userInfo.jwt_token) {
        console.log("Auto-logging in user with JWT token:", result.userInfo);

        try {
          // Auto-login the user with the JWT token
          await dispatch(autoLoginWithToken(result.userInfo)).unwrap();
          console.log("Auto-login successful");

          toast.success(
            "Account created and logged in! Redirecting to review..."
          );
        } catch (loginError) {
          console.error("Auto-login failed:", loginError);
          // Continue with the flow even if auto-login fails
          toast.success(
            "Vehicle appraised successfully! Redirecting to see offer..."
          );
        }
      } else {
        toast.success(
          "Vehicle appraised successfully! Redirecting to see offer..."
        );
      }

      setTimeout(() => {
        onClose(false);
        navigate("/review");
      }, 1000);
    } catch (error) {
      console.log("=== API ERROR ===");
      console.error("Auction setup failed:", error);
      console.log("Error response:", error.response);
      console.log("Error response data:", error.response?.data);
      console.log("Error message:", error.message);

      const errorMsg =
        error.message || error || "Failed to setup auction. Please try again.";

      // Extract suggestion from error response if available
      let suggestion = "";
      if (error.response?.data?.suggestion) {
        suggestion = error.response.data.suggestion;
        console.log("Error suggestion:", suggestion);
      } else if (
        error.response?.data?.message &&
        error.response.data.message !== errorMsg
      ) {
        suggestion = error.response.data.message;
        console.log("Error message from response:", suggestion);
      }

      console.log("Setting error message:", errorMsg);
      console.log("Setting error suggestion:", suggestion);

      setErrorMessage(errorMsg);
      setErrorSuggestion(suggestion);
      setShowErrorModal(true);
    } finally {
      console.log("Setting isSubmitting to false");
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="w-[95vw] max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-3xl xl:max-w-4xl rounded-2xl shadow-xl p-0 overflow-hidden bg-white max-h-[95vh] sm:max-h-[80vh] md:max-h-[75vh] flex flex-col">
          <div className="bg-gradient-to-br from-white via-slate-50 to-slate-100 p-3 sm:p-4 md:p-6 flex-shrink-0">
            <DialogHeader className="text-center">
              <DialogTitle className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold tracking-tight text-slate-900 leading-tight">
                Hi,{" "}
                <span className="break-words">
                  {userFormData?.fullName || userState?.display_name || "User"}
                </span>
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm md:text-base text-slate-600 mt-1 sm:mt-2 leading-relaxed px-2 sm:px-0">
                Choose your auction preference
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 pt-0">
            <motion.div
              className="space-y-3 sm:space-y-4 md:space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {auctionOptions.map((option, index) => {
                const IconComponent = option.icon;
                const isSelected = selectedOption === option.id;

                return (
                  <motion.div
                    key={option.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    onClick={() =>
                      !isSubmitting && handleOptionSelect(option.id)
                    }
                    className={`relative rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 shadow-lg border-2 transition-all ${
                      isSubmitting
                        ? "cursor-not-allowed opacity-60"
                        : "cursor-pointer"
                    } ${
                      isSelected
                        ? "border-green-400 ring-2 ring-green-200"
                        : `${option.borderColor} border hover:border-gray-300`
                    } ${option.bgColor}`}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-2 sm:mb-3 md:mb-4">
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                        <div
                          className={`p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-r ${option.color} text-white shadow-lg flex-shrink-0`}
                        >
                          <IconComponent className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-900 leading-tight">
                            {option.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                            {option.subtitle}
                          </p>
                        </div>
                      </div>
                      {isSelected ? (
                        <div className="flex items-center gap-1 sm:gap-2 text-green-600 flex-shrink-0 ml-2">
                          <Check className="h-4 w-4 sm:h-5 sm:w-5" />
                        </div>
                      ) : (
                        <div className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 ml-2" />
                      )}
                    </div>

                    {/* Consent Text */}
                    <div className="mb-2 sm:mb-3 md:mb-4">
                      <div className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                        {option.consentText}
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {/* Common Terms Checkbox and Continue Button - Now inside scrollable area */}
              <div className="border-t border-slate-200 pt-3 sm:pt-4 md:pt-6 mt-3 sm:mt-4 md:mt-6">
                {/* Mobile: Stack vertically, Desktop: Side by side */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                  <div className="flex items-center justify-center gap-2 sm:gap-3 flex-1 min-w-0">
                    <input
                      type="checkbox"
                      checked={termsConsent}
                      onChange={(e) => setTermsConsent(e.target.checked)}
                      disabled={isSubmitting}
                      className="h-4 w-4 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 flex-shrink-0 items-center"
                    />
                    <label className="text-xs sm:text-sm text-slate-700 cursor-pointer leading-relaxed flex-1 min-w-0">
                      I have read and agree to the{" "}
                      <Link
                        to="/terms-of-service"
                        className="no-underline font-bold text-[#f6851f] hover:underline break-words"
                      >
                        Terms of Use
                      </Link>{" "}
                      and{" "}
                      <Link
                        to="/privacy-policy"
                        className="no-underline font-bold text-[#f6851f] hover:underline break-words"
                      >
                        Privacy Policy
                      </Link>
                      .
                    </label>
                  </div>
                  
                  <div className="flex justify-end sm:justify-end w-full sm:w-auto">
                    <button
                      onClick={handleGo}
                      disabled={isSubmitting || !selectedOption || !termsConsent}
                      className={` cursor-pointer inline-flex items-center justify-center rounded-xl 
                        w-full sm:w-auto
                        px-4 py-2.5 text-xs
                        sm:px-6 sm:py-3 sm:text-sm
                        md:px-8 md:py-4 md:text-base
                        font-semibold text-white shadow-lg transition hover:scale-[1.02]
                        ${
                          !isSubmitting && selectedOption && termsConsent
                            ? "bg-gradient-to-r from-[#f6851f] to-[#e63946] hover:from-orange-600 hover:to-red-600"
                            : "bg-slate-400 cursor-not-allowed"
                        }`}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span className="hidden sm:inline">Setting up...</span>
                          <span className="sm:hidden">Setting...</span>
                        </div>
                      ) : (
                        <div className="flex cursor-pointer items-center gap-2 w-full justify-center">
                          <span className="hidden sm:inline">
                            See your offer →
                          </span>
                          <span className="sm:hidden">See offer</span>
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Error Modal */}
      <ErrorModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        errorMessage={errorMessage}
        suggestion={errorSuggestion}
        redirectDelay={15000}
        redirectPath="/"
      />
    </>
  );
}
