import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle2, Car, ShieldCheck, FileSearch, LineChart, Hash, MapPin, Circle, Sparkles, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useDispatch, useSelector } from "react-redux";
import { fetchVehicleDetails, setStateVin, setZipState } from "@/redux/slices/carDetailsAndQuestionsSlice";

export default function Modal({
  isOpen,
  onClose,
  title = "Get your instant offer",
  description = "Enter your car details to start the auction",
}) {
  const navigate = useNavigate();

  // UI state
  const [vin, setVin] = useState("");
  const [zip, setZip] = useState("");
  const [errors, setErrors] = useState({ vin: "", zip: "" });
  const [phase, setPhase] = useState("form"); // form | loading | success | error
  const [stepIndex, setStepIndex] = useState(0);
  const { vehicleDetails } = useSelector((state) => state.carDetailsAndQuestions);

  const steps = useMemo(
    () => [
      { label: "Analyzing Your Vehicle", Icon: Car },
      { label: "Validating VIN Number", Icon: ShieldCheck },
      { label: "Fetching Vehicle Specifications", Icon: FileSearch },
      { label: "Analyzing Market Data", Icon: LineChart },
    ],
    []
  );

  const isCloseDisabled = phase === "loading";

  // Handle dialog open/close
  const handleOpenChange = (open) => {
    if (!open) {
      // Reset state when dialog is closed
      setPhase("form");
      setVin("");
      setZip("");
      setErrors({ vin: "", zip: "" });
      setStepIndex(0);
      onClose(false);
    }
  };

  function validate() {
    const newErrors = { vin: "", zip: "" };
    if (!/^[A-HJ-NPR-Z0-9]{17}$/i.test(vin)) {
      newErrors.vin = "Enter a valid 17‑character VIN (letters & numbers)";
    }
    if (!/^\d{5}$/.test(zip)) {
      newErrors.zip = "Enter a valid 5‑digit ZIP code";
    }
    setErrors(newErrors);
    return !newErrors.vin && !newErrors.zip;
  }

  const dispatch = useDispatch();

  const handleFetchVehicle = async () => {
    startProgress();

    const resultAction = await dispatch(
      fetchVehicleDetails({ vin, zip })
    );
    dispatch(setZipState(zip))
    dispatch(setStateVin(vin))

    clearInterval(progressInterval); // stop the progress immediately

    if (fetchVehicleDetails.fulfilled.match(resultAction)) {
      setStepIndex(steps.length); // complete the bar
      // setPhase("success");
      navigate("/auction-page");
    } else {
      setPhase("error");
    }
  };

  let progressInterval;

  function startProgress() {
    setPhase("loading");
    setStepIndex(0);
    let i = 0;
    progressInterval = setInterval(() => {
      i += 1;
      if (i < steps.length) {
        setStepIndex(i);
      } else {
        clearInterval(progressInterval);
      }
    }, 950);
  }

  function handleSubmit(e) {
    e?.preventDefault();
    if (validate()) {
      handleFetchVehicle();
    }
  }

  function handleSuccessCTA() {
    onClose(false);
    navigate("/auction-page");
  }

  return (
    <Dialog open={isOpen} onOpenChange={isCloseDisabled ? undefined : handleOpenChange}>
      <DialogContent
        className="sm:max-w-md rounded-2xl shadow-xl p-0 overflow-hidden bg-white"
        showCloseButton={!isCloseDisabled}
      >
        <div className="bg-gradient-to-br from-white via-slate-50 to-slate-100 p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold tracking-tight text-slate-900">
              {title}
            </DialogTitle>
            {description && (
              <DialogDescription className="text-sm text-slate-600">
                {description}
              </DialogDescription>
            )}
          </DialogHeader>
        </div>

        <div className="p-6 pt-0">
          <AnimatePresence mode="wait">
            {phase === "form" && (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="grid gap-5"
              >
                <div className="grid gap-2">
                  <label htmlFor="vin" className="text-sm font-medium text-slate-800">Vehicle VIN</label>
                  <div className="relative">
                    <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <Hash className="h-4 w-4" />
                    </div>
                    <input
                      id="vin"
                      value={vin}
                      onChange={(e) => setVin(e.target.value.toUpperCase())}
                      placeholder="Enter 17‑character VIN"
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none ring-0 transition-shadow focus:shadow-[0_0_0_4px_rgba(15,23,42,0.08)]"
                    />
                  </div>
                  {errors.vin && <p className="text-xs text-red-600">{errors.vin}</p>}
                </div>

                <div className="grid gap-2">
                  <label htmlFor="zip" className="text-sm font-medium text-slate-800">Zip Code</label>
                  <div className="relative">
                    <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <input
                      id="zip"
                      value={zip}
                      inputMode="numeric"
                      onChange={(e) => setZip(e.target.value.replace(/[^0-9]/g, "").slice(0, 5))}
                      placeholder="Enter 5‑digit ZIP"
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none ring-0 transition-shadow focus:shadow-[0_0_0_4px_rgba(15,23,42,0.08)]"
                    />
                  </div>
                  {errors.zip && <p className="text-xs text-red-600">{errors.zip}</p>}
                </div>

                <div className="pt-1">
                  <button
                    type="submit"
                    className="cursor-pointer w-full h-11 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-semibold shadow-lg shadow-orange-500/20 transition hover:from-orange-600 hover:to-amber-600"
                  >
                    Check offer
                  </button>
                </div>

                <div className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
                  <ShieldCheck className="h-4 w-4 text-slate-700" />
                  Your data is secure. We only use it to fetch vehicle info.
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
                className="grid gap-6"
              >
                <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                  <div className="flex items-center gap-3 p-4">
                    <Loader2 className="h-5 w-5 animate-spin text-slate-700" />
                    <span className="text-sm text-slate-700">{steps[stepIndex].label}</span>
                  </div>
                  <div className="h-1 w-full bg-slate-200">
                    <motion.div
                      className="h-1 bg-slate-800"
                      initial={{ width: "0%" }}
                      animate={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }}
                      transition={{ ease: "easeOut", duration: 0.4 }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  {steps.map(({ label, Icon }, idx) => (
                    <motion.div
                      key={label}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: idx <= stepIndex ? 1 : 0.35, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className="flex items-center gap-2 text-sm"
                    >
                      {idx < stepIndex ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : idx === stepIndex ? (
                        <Loader2 className="h-4 w-4 animate-spin text-slate-700" />
                      ) : (
                        <Circle className="h-4 w-4 text-slate-300" />
                      )}
                      <Icon className={`h-4 w-4 ${idx <= stepIndex ? "text-slate-800" : "text-slate-400"}`} />
                      <span className={`${idx <= stepIndex ? "text-slate-800" : "text-slate-500"}`}>{label}</span>
                    </motion.div>
                  ))}
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
                className="grid gap-5 place-items-center text-center"
              >
                <motion.div className="relative" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 340, damping: 18 }}>
                  <div className="grid place-items-center rounded-2xl border border-green-200 bg-gradient-to-b from-white to-emerald-50 p-4 shadow-sm">
                    <CheckCircle2 className="h-14 w-14 text-green-500" />
                  </div>
                  <Sparkles className="absolute -right-2 -top-2 h-4 w-4 text-amber-500" />
                </motion.div>
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-slate-900">Vehicle data fetched successfully!</h3>
                  <p className="text-sm text-slate-600">You can now start your live auction.</p>
                </div>
                <button
                  onClick={handleSuccessCTA}
                  className="cursor-pointer w-full h-11 rounded-xl bg-slate-900 text-white text-sm font-semibold shadow-lg shadow-slate-900/20 hover:bg-slate-800"
                >
                  See offer Now
                </button>
              </motion.div>
            )}
            {phase === "error" && (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="grid gap-5 place-items-center text-center"
              >
                <motion.div className="relative" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 340, damping: 18 }}>
                  <div className="grid place-items-center rounded-2xl border border-red-200 bg-gradient-to-b from-white to-red-50 p-4 shadow-sm">
                    <X className="h-14 w-14 text-red-500" />
                  </div>
                </motion.div>
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-slate-900">Can't fetch vehicle data!</h3>
                  <p className="text-sm text-slate-600">Please check your VIN and ZIP code, then try again.</p>
                </div>
                <div className="flex gap-3 w-full">
                  <button
                    onClick={() => {
                      setPhase("form");
                      setStepIndex(0);
                      setErrors({ vin: "", zip: "" });
                    }}
                    className="cursor-pointer flex-1 h-11 rounded-xl bg-slate-900 text-white text-sm font-semibold shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-colors"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={() => handleOpenChange(false)}
                    className="cursor-pointer flex-1 h-11 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}