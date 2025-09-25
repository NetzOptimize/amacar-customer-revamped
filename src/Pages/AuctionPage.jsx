import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Car,
  Gauge,
  Palette,
  Droplet,
  Cog,
  Fuel,
  ChevronLeft,
  Loader2,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchVehicleDetails, setVehicleDetails, setAuctionPageData } from "../redux/slices/carDetailsAndQuestionsSlice";

export default function AuctionPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { vehicleDetails, loading, error, stateVin, stateZip } = useSelector((state) => state.carDetailsAndQuestions);

  // Get data from location state first, fallback to Redux state
  const vin = location.state?.vin || stateVin;
  const zipCode = location.state?.zipCode || stateZip;
  const vehicleName = location.state?.vehicleName || vehicleDetails?.vehicleName;
  const vehicleType = location.state?.vehicleType || vehicleDetails?.vehicleType;

  const productId = location.state?.productId || vehicleDetails?.productId;

  // Store auction page data in Redux when component mounts (only for relisting vehicles)
  useEffect(() => {
    if (location.state) {
      const { vin, zip, product_id } = location.state;
      dispatch(setAuctionPageData({ vin, zip, product_id }));
    }
  }, [dispatch, location.state]);

  // Fetch vehicle details if not already loaded
  useEffect(() => {
    // if (!vehicleDetails || Object.keys(vehicleDetails).length === 0) {
      console.log("zipcode from relist", zipCode);
      console.log("vin from relist", vin);
      dispatch(fetchVehicleDetails({ vin: vin, zip: zipCode }));
      console.log("fetching vehicle details");
      // dispatch(fetchVehicleDetails({ vin: vin, zip: zipCode }));
    // }
  }, [dispatch, vin, zipCode]);
useEffect(() => {
    // console.log("avg", vehicleDetails.averagemileage);
    console.log("vin", vin);
    console.log("zipCode", zipCode);
    console.log("vehicleName", vehicleName);
    console.log("vehicleType", vehicleType);
    console.log("vehicleDetails", vehicleDetails);
  }, [vin, zipCode, vehicleName, vehicleType, vehicleDetails]);

  // Initialize form values with Redux data
  const initialValues = useMemo(() => {
    return {
      mileage:  "",
      exteriorColor: "",
      interiorColor: "",
      bodyType: vehicleDetails.bodytype || vehicleDetails.body || "",
      transmission: (() => {
        const value = vehicleDetails.transmission;
        if (
          !value || // null, undefined, empty
          ["n/a", "n / a", "na", "null"].includes(String(value).trim().toLowerCase())
        ) {
          return "";
        }
        return value;
      })(),
      fuelType: (() => {
        const value = vehicleDetails?.fueltype || vehicleDetails?.fuelType;
        if (
          !value || // null, undefined, empty
          ["n/a", "n / a", "na", "null"].includes(String(value).trim().toLowerCase())
        ) {
          return "";
        }
        return value;
      })(),
      engineType: vehicleDetails.liters && vehicleDetails.engineconfiguration
        ? `${vehicleDetails.liters}L ${vehicleDetails.cylinders}${vehicleDetails.engineconfiguration}`
        : "",
      bodyEngineType: vehicleDetails.fueltype
        ? `${vehicleDetails.engineconfiguration}${vehicleDetails.cylinders} / ${vehicleDetails.fueltype}`
        : "",
    };
  }, [vehicleDetails]);

  const [values, setValues] = useState(initialValues);
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [step, setStep] = useState(0); // 0,1,2
  const [showAll, setShowAll] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const fields = useMemo(
    () => [
      {
        key: "mileage",
        label: "Mileage",
        placeholder: "e.g. 42,500",
        Icon: Gauge,
        type: "number",
      },
      {
        key: "exteriorColor",
        label: "Exterior Color",
        placeholder: "Select color",
        Icon: Palette,
        type: "select",
        options: ["Black", "White", "Silver", "Gray", "Blue", "Red", "Green"],
      },
      {
        key: "interiorColor",
        label: "Interior Color",
        placeholder: "Select color",
        Icon: Droplet,
        type: "select",
        options: ["Black", "Beige", "Brown", "Gray", "White"],
      },
      {
        key: "bodyType",
        label: "Body Type",
        placeholder: "Select body type",
        Icon: Car,
        type: "select",
        options: ["Sedan", "SUV", "Hatchback", "Truck", "Coupe", "Convertible", "Van"],
      },
      
      {
        key: "transmission",
        label: "Transmission",
        placeholder: "Select transmission",
        Icon: Cog,
        type: "select",
        options: ["Automatic", "Manual", "CVT"],
      },
      {
        key: "fuelType",
        label: "Fuel Type",
        placeholder: "Select fuel type",
        Icon: Fuel,
        type: "select",
        options: ["Diesel", "Gas", "Electric", "Hybrid", "Hydrogen Fuel Cell"],
      },    
      {
        key: "engineType",
        label: "Engine Type",
        placeholder: "e.g. 2.0L Turbo",
        Icon: Fuel,
        type: "text",
      },
      {
        key: "bodyEngineType",
        label: "Body Engine Type",
        placeholder: "e.g. V6 / Hybrid",
        Icon: Cog,
        type: "text",
      },
    ],
    []
  );

  // Update values when vehicleDetails changes
  useEffect(() => {
    setValues(initialValues);
  }, [initialValues]);

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

  function validate(key, value) {
    switch (key) {
      case "mileage":
        return /^\d{1,7}$/.test(value.replaceAll(",", ""));
      case "engineType":
        return /[A-Za-z0-9]/.test(value) && value.trim().length >= 2;
      case "bodyEngineType":
        return /[A-Za-z0-9]/.test(value) && value.trim().length >= 2;
      default:
        return value && value.length > 0;
    }
  }

  const errors = Object.fromEntries(
    Object.entries(values).map(([k, v]) => [k, !validate(k, v)])
  );

  const completedCount = Object.keys(values).filter((k) => validate(k, values[k])).length;
  const allValid = completedCount === Object.keys(values).length;

  function handleChange(key, raw) {
    let v = key === "mileage" ? raw.replace(/[^0-9]/g, "").substring(0, 7) : raw;
    setValues((prev) => ({ ...prev, [key]: v }));
  }

  function handleBlur(key) {
    setTouched((prev) => ({ ...prev, [key]: true }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
    
    // Mark all fields as touched to show validation errors
    setTouched(Object.fromEntries(Object.keys(values).map(k => [k, true])));
    
    if (allValid) {
        dispatch(
            setVehicleDetails({
              vehicle_data: [{ ...vehicleDetails, ...values }],
            })
          );
      navigate("/condition-assessment", { 
        state: { 
          vehicleDetails: values,
          productId: productId // Pass productId to ConditionAssessment
        } 
      });
    }
  }

  // Helper function to get current step fields
  const getCurrentStepFields = () => {
    if (showAll) return fields;
    
    switch (step) {
      case 0:
        return fields.filter(({ key }) => ["mileage", "bodyType", "transmission"].includes(key));
      case 1:
        return fields.filter(({ key }) => ["exteriorColor", "interiorColor"].includes(key));
      case 2:
        return fields.filter(({ key }) => ["engineType", "bodyEngineType", "fuelType"].includes(key));
      default:
        return [];
    }
  };

  // Helper function to validate current step
  const isCurrentStepValid = () => {
    const currentFields = getCurrentStepFields();
    return currentFields.every(({ key }) => validate(key, values[key]));
  };

  const handleNextStep = () => {
    const currentFields = getCurrentStepFields();
    const currentKeys = currentFields.map(({ key }) => key);
    
    // Mark current step fields as touched
    setTouched((prev) => ({
      ...prev,
      ...Object.fromEntries(currentKeys.map((k) => [k, true])),
    }));

    // Only proceed to next step if current step is valid
    if (isCurrentStepValid()) {
      setStep(step + 1);
    }
  };

  const stepperSteps = ["Basics", "Appearance", "Powertrain"];
  const currentStep = step;

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100 pt-20 md:pt-24">
      {/* Animated background accents */}
      <motion.div
        className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-orange-200/40 blur-3xl"
        animate={{ opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div
        className="pointer-events-none absolute -bottom-28 -right-24 h-80 w-80 rounded-full bg-rose-200/40 blur-3xl"
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 7, repeat: Infinity }}
      />

      <div className="mx-auto max-w-7xl px-6 ">
        <h1 className="mb-[1.5rem] text-center text-4xl text-[#f6851f] font-bold">
          Vehicle Details
        </h1>
        
        {/* Step indicator */}
        {!showAll && (
          <div className="mb-6 sm:mb-8 flex justify-center">
            <div className="flex items-center space-x-2 sm:space-x-4">
              {stepperSteps.map((stepName, index) => (
                <div key={stepName} className="flex items-center">
                  <div className={`flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full text-xs sm:text-sm font-medium ${
                    index <= step 
                      ? "bg-[#f6851f] text-white" 
                      : "bg-slate-200 text-slate-600"
                  }`}>
                    {index + 1}
                  </div>
                  <span className={`ml-1 sm:ml-2 text-xs sm:text-sm font-medium hidden sm:block ${
                    index <= step ? "text-[#f6851f]" : "text-slate-600"
                  }`}>
                    {stepName}
                  </span>
                  {index < stepperSteps.length - 1 && (
                    <div className={`mx-2 sm:mx-4 h-0.5 w-4 sm:w-8 ${
                      index < step ? "bg-[#f6851f]" : "bg-slate-200"
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main content grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 mb-32">
          {/* Left: Form panel */}
          <div className="lg:col-span-8">
            <div className="rounded-2xl border border-white/60 bg-white/70 p-6 shadow-xl backdrop-blur-xl md:p-8">
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-sm text-slate-600"
                >
                  Loading vehicle details...
                </motion.div>
              )}
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-sm text-red-600"
                >
                  Error loading vehicle details: {error}
                </motion.div>
              )}
              <div className="mb-4 flex items-start justify-between gap-3">
                <motion.h2
                  key={`title-${step}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="text-xl font-semibold text-slate-900"
                >
                  {showAll 
                    ? "All Vehicle Details" 
                    : step === 0 
                      ? "Vehicle Basics" 
                      : step === 1 
                        ? "Appearance" 
                        : "Powertrain"}
                </motion.h2>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAll(!showAll)}
                    className={`cursor-pointer h-9 rounded-xl border px-3 text-xs font-medium transition ${
                      showAll
                        ? "border-slate-300 bg-white text-slate-900"
                        : "border-slate-200 bg-white text-slate-700 hover:scale-[1.01]"
                    }`}
                  >
                    {showAll ? "Show by steps" : "Show all fields"}
                  </button>
                </div>
              </div>
              <motion.p
                key={`desc-${step}-${showAll}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: 0.05 }}
                className="-mt-2 mb-2 text-sm text-slate-600"
              >
                {showAll
                  ? "All fields visible at once. Fill in as many details as possible."
                  : step === 0
                  ? "Tell us general info that impacts demand."
                  : step === 1
                  ? "Choose colors to help dealers match inventory."
                  : "What powers the car? Engine specifications and configuration."}
              </motion.p>
              <div className="grid gap-6">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  {getCurrentStepFields().map(({ key, label, placeholder, Icon, type, options }) => {
                      const value = values[key];
                      const hasError = (touched[key] || submitted) && errors[key];
                      const isValid = (touched[key] || submitted) && !errors[key];
                      return (
                        <motion.div
                          key={key}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="grid gap-2"
                        >
                          <label className="text-sm font-medium text-slate-800 flex items-center gap-2">
                            <Icon className="h-4 w-4 text-slate-500" />
                            {label}
                          </label>
                          <motion.div whileFocus={{ scale: 1.01 }} className="relative">
                            {type === "select" ? (
                              key === "exteriorColor" || key === "interiorColor" ? (
                                <div className="">
                                  <div className="flex flex-wrap gap-2">
                                    {options.map((opt) => {
                                      const colorMap = {
                                        Black: "bg-black",
                                        White: "bg-white border border-slate-300",
                                        Silver: "bg-slate-300",
                                        Gray: "bg-gray-500",
                                        Blue: "bg-blue-500",
                                        Red: "bg-red-500",
                                        Green: "bg-green-500",
                                        Beige: "bg-amber-200",
                                        Brown: "bg-amber-700",
                                      };
                                      const selected = value === opt;
                                      return (
                                        <button
                                          key={opt}
                                          type="button"
                                          onClick={() => {
                                            handleChange(key, opt);
                                            handleBlur(key);
                                          }}
                                          className={`cursor-pointer group inline-flex items-center gap-2 rounded-full border px-2.5 py-1.5 text-xs font-medium ${
                                            selected
                                              ? "border-[#f6851f] bg-orange-50 text-slate-900"
                                              : "border-slate-200 bg-white text-slate-700"
                                          }`}
                                        >
                                          <span
                                            className={`inline-block h-4 w-4 rounded-full ${
                                              colorMap[opt] || "bg-slate-400"
                                            }`}
                                          ></span>
                                          {opt}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              ) : key === "bodyType" ? (
                                <div className="">
                                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                                    {options.map((opt) => {
                                      const selected = value === opt;
                                      return (
                                        <button
                                          key={opt}
                                          type="button"
                                          onClick={() => {
                                            handleChange(key, opt);
                                            handleBlur(key);
                                          }}
                                          className={`cursor-pointer flex items-center gap-2 rounded-xl border p-2.5 text-xs font-medium transition ${
                                            selected
                                              ? "border-[#f6851f] bg-orange-50 text-slate-900"
                                              : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                                          }`}
                                        >
                                          <Car className="h-4 w-4 text-slate-500" /> {opt}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              ) : key === "transmission" ? (
                                <div className="">
                                  <div className="flex flex-wrap gap-2">
                                    {options.map((opt) => {
                                      const selected = value === opt;
                                      return (
                                        <button
                                          key={opt}
                                          type="button"
                                          onClick={() => {
                                            handleChange(key, opt);
                                            handleBlur(key);
                                          }}
                                          className={`cursor-pointer inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                                            selected
                                              ? "border-[#f6851f] bg-orange-50 text-slate-900"
                                              : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                                          }`}
                                        >
                                          <Cog className="h-4 w-4 text-slate-500" /> {opt}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              ) : key === "fuelType" ? (
                                <div className="">
                                  <div className="flex flex-wrap gap-2">
                                    {options.map((opt) => {
                                      const selected = value === opt;
                                      return (
                                        <button
                                          key={opt}
                                          type="button"
                                          onClick={() => {
                                            handleChange(key, opt);
                                            handleBlur(key);
                                          }}
                                          className={`cursor-pointer inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-medium transition ${
                                            selected
                                              ? "border-[#f6851f] bg-orange-50 text-slate-900"
                                              : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                                          }`}
                                        >
                                          <Fuel className="h-4 w-4 text-slate-500" /> {opt}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              ) : null
                            ) : (
                              <div className="relative">
                                <input
                                  type={type}
                                  value={key === "mileage" && value ? Number(value) : value}
                                  onChange={(e) => handleChange(key, e.target.value)}
                                  onBlur={() => handleBlur(key)}
                                  placeholder={placeholder}
                                  className={`h-11 w-full rounded-xl border bg-white px-3 pr-20 text-base outline-none transition-shadow ${
                                    hasError
                                      ? "border-red-300 focus:shadow-[0_0_0_4px_rgba(225,29,72,0.15)]"
                                      : "border-slate-200 focus:shadow-[0_0_0_4px_rgba(246,133,31,0.18)]"
                                  }`}
                                />
                               
                                {key === "mileage" && (
                                  <p className="text-xs text-slate-500 mt-1">
                                    Average: {vehicleDetails.averagemileage ? Number(vehicleDetails.averagemileage) + ' km' : 'N/A'}
                                  </p>
                                )}
                                
                              </div>
                            )}
                          </motion.div>
                          {hasError && (
                            <motion.p
                              initial={{ opacity: 0, y: -4 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-xs text-red-600"
                            >
                              {label} is required.
                            </motion.p>
                          )}
                        </motion.div>
                      );
                    })}
                </div>

                {/* Footer actions */}
                <div className="flex flex-col-reverse items-stretch justify-between gap-3 pt-2 sm:flex-row sm:items-center">
                  <button
                    type="button"
                    onClick={() => (step === 0 ? navigate(-1) : setStep(step - 1))}
                    className="cursor-pointer inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition hover:scale-[1.01]"
                  >
                    <ChevronLeft className="h-4 w-4" /> {step === 0 ? "Back" : "Previous"}
                  </button>
                  
                  {!showAll && step < 2 ? (
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className={`cursor-pointer inline-flex h-11 items-center justify-center rounded-xl px-6 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.01] ${
                        isCurrentStepValid()
                          ? "bg-[#f6851f] shadow-orange-500/25"
                          : "bg-slate-400 shadow-slate-400/25 cursor-not-allowed"
                      }`}
                      disabled={!isCurrentStepValid()}
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="cursor-pointer inline-flex h-11 items-center justify-center rounded-xl bg-[#f6851f] px-6 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:scale-[1.01]"
                    >
                      {allValid ? "Confirm & Continue" : "Complete Required Fields"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Live Preview / Summary panel */}
          <div className="lg:col-span-4">
            <div className="sticky top-6">
              {/* Merged Vehicle Information and Live Preview Card */}
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
                          VIN- {vin || vehicleDetails?.vin || "JTHBL46FX75021954"}
                        </div>
                      </div>

                      {/* Vehicle Details */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-slate-700">Vehicle</span>
                          <span className="text-sm font-semibold text-slate-900">
                            {vehicleName || `${vehicleDetails?.modelyear || "2007"} ${vehicleDetails?.make || "LEXUS"} ${vehicleDetails?.model || "LS"}`}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-slate-700">Type</span>
                          <span className="text-sm font-semibold text-[#f6851f]">
                            {vehicleType || `${vehicleDetails?.bodytype || "SEDAN"} ${vehicleDetails?.doors || "4D"} ${vehicleDetails?.model || "LS460"} ${vehicleDetails?.engineconfiguration || "4.6L"} ${vehicleDetails?.fueltype || "V8"}`}
                          </span>
                        </div>
                        {zipCode && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-700">Location</span>
                            <span className="text-sm font-semibold text-slate-600">
                              ZIP: {zipCode}
                            </span>
                          </div>
                        )}
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

                    </div>

                    {/* Live Preview Section */}
                    <div>
                      <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-b from-orange-100 to-rose-100">
                            <Car className="h-5 w-5 text-[#f6851f]" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-900">Live Preview</p>
                            <p className="text-xs text-slate-600">{completedCount}/8 complete</p>
                          </div>
                        </div>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 mb-5">
                        <motion.div
                          className="h-2 rounded-full bg-[#f6851f]"
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, (completedCount / 8) * 100)}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="rounded-xl border border-slate-200 bg-white p-3">
                          <p className="text-xs text-slate-500">Mileage</p>
                          <p className="font-medium text-slate-900">
                            {values.mileage ? Number(values.mileage).toLocaleString() : "—"}
                          </p>
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-white p-3">
                          <p className="text-xs text-slate-500">Body Type</p>
                          <p className="font-medium text-slate-900">{values.bodyType || "—"}</p>
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-white p-3">
                          <p className="text-xs text-slate-500">Transmission</p>
                          <p className="font-medium text-slate-900">{values.transmission || "-"}</p>
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-white p-3">
                          <p className="text-xs text-slate-500">Fuel Type</p>
                          <p className="font-medium text-slate-900">{values.fuelType || "—"}</p>
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-white p-3">
                          <p className="text-xs text-slate-500">Exterior</p>
                          <p className="font-medium text-slate-900">{values.exteriorColor || "—"}</p>
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-white p-3">
                          <p className="text-xs text-slate-500">Interior</p>
                          <p className="font-medium text-slate-900">{values.interiorColor || "—"}</p>
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-white p-3">
                          <p className="text-xs text-slate-500 ">Engine Type</p>
                          <p className="font-medium text-slate-900 overflow-hidden text-ellipsis">{values.engineType || "—"}</p>
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-white p-3">
                          <p className="text-xs text-slate-500 ">Body Engine</p>
                          <p className="font-medium text-slate-900 overflow-hidden text-ellipsis">{values.bodyEngineType || "—"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}