import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Loader2, 
  CheckCircle2, 
  Shield, 
  ShieldCheck, 
  AlertTriangle,
  XCircle,
  Sparkles
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTwoFactorAuth } from '@/redux/slices/userSlice';
import toast from 'react-hot-toast';

export default function TwoFactorAuthModal({
  isOpen,
  onClose,
  onSuccess,
  isEnabled = true,
}) {
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.user);
  
  const [phase, setPhase] = useState('confirmation'); // confirmation | loading | success | error
  const [error, setError] = useState('');
  const [initialIsEnabled, setInitialIsEnabled] = useState(isEnabled);

  const isCloseDisabled = phase === 'loading';
  
  // Update initial state when modal opens
  useEffect(() => {
    if (isOpen) {
      setInitialIsEnabled(isEnabled);
      setPhase('confirmation');
      setError('');
    }
  }, [isOpen]); // Remove isEnabled dependency to prevent reset during modal lifecycle
  
  // Determine the action being performed based on initial state
  const isDisabling = initialIsEnabled; // If initially enabled, we're disabling
  const isEnabling = !initialIsEnabled; // If initially disabled, we're enabling

  const handleConfirm = async () => {
    setPhase('loading');
    setError('');
    
    try {
      const resultAction = await dispatch(toggleTwoFactorAuth({ enabled: !initialIsEnabled }));
      
      if (toggleTwoFactorAuth.fulfilled.match(resultAction)) {
        setPhase('success');
        toast.success(
          `Two-Factor Authentication ${isDisabling ? 'disabled' : 'enabled'} successfully!`,
          { duration: 3000 }
        );
        
        // Call success callback if provided
        if (onSuccess) {
          onSuccess();
        }
        
        // Close modal after success - user remains logged in
        setTimeout(() => {
          onClose();
          setPhase('confirmation');
        }, 2000);
      } else {
        setPhase('error');
        const errorMessage = resultAction.payload || 'Failed to update 2FA settings';
        setError(errorMessage);
        toast.error(errorMessage, { duration: 3000 });
      }
    } catch (error) {
      setPhase('error');
      const errorMessage = error?.response?.data?.message || error?.message || 'An error occurred';
      setError(errorMessage);
      toast.error(errorMessage, { duration: 3000 });
    }
  };

  const handleCancel = () => {
    if (phase !== 'loading') {
      setPhase('confirmation');
      setError('');
      onClose();
    }
  };

  const handleRetry = () => {
    setPhase('confirmation');
    setError('');
  };

  const handleModalClose = (open) => {
    if (!open && !isCloseDisabled) {
      handleCancel();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleModalClose}>
      <DialogContent
        className="sm:max-w-lg rounded-2xl shadow-xl p-0 overflow-hidden bg-white"
        showCloseButton={!isCloseDisabled}
      >
        <div className={`p-6 ${
          isDisabling 
            ? 'bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50' 
            : 'bg-gradient-to-br from-white via-slate-50 to-slate-100'
        }`}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold tracking-tight text-slate-900">
              {isDisabling ? 'Disable Two-Factor Authentication' : 'Enable Two-Factor Authentication'}
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-600">
              {isDisabling 
                ? 'This will remove the extra security layer from your account'
                : 'Add an extra layer of security to protect your account'
              }
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6 pt-0">
          <AnimatePresence mode="wait">
            {phase === 'confirmation' && (
              <motion.div
                key="confirmation"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="space-y-6"
              >
                {/* Security Icon and Message */}
                <div className="flex items-start space-x-4 p-4 rounded-xl border border-slate-200 bg-slate-50">
                  <div className="flex-shrink-0">
                    {isDisabling ? (
                      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-green-600" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 mb-2">
                      {isDisabling ? 'Security Warning' : 'Enhanced Security'}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {isDisabling 
                        ? 'Disabling Two-Factor Authentication will reduce your account security. You will no longer need to verify your identity with a second factor when signing in.'
                        : 'Enabling Two-Factor Authentication will require you to verify your identity with a second factor (like a mobile app or SMS) when signing in, significantly improving your account security.'
                      }
                    </p>
                  </div>
                </div>

                {/* Security Benefits/Consequences */}
                <div className="space-y-3">
                  <h4 className="font-medium text-slate-900">
                    {isDisabling ? 'What happens when disabled:' : 'Security benefits:'}
                  </h4>
                  <ul className="space-y-2 text-sm text-slate-600">
                    {isDisabling ? (
                      <>
                        <li className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
                          <span>Account will be more vulnerable to unauthorized access</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
                          <span>Password alone will be sufficient for login</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
                          <span>Reduced protection against phishing attacks</span>
                        </li>
                      </>
                    ) : (
                      <>
                        <li className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                          <span>Protection against password theft and phishing</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                          <span>Secure access even if password is compromised</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                          <span>Industry-standard security for financial platforms</span>
                        </li>
                      </>
                    )}
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-2">
                  <button
                    onClick={handleCancel}
                    disabled={status === 'loading'}
                    className="flex-1 h-11 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-medium transition hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirm}
                    disabled={status === 'loading'}
                    className={`cursor-pointer flex-1 h-11 rounded-xl text-white text-sm font-semibold shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed ${
                      isDisabling
                        ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-red-500/20'
                        : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-green-500/20'
                    }`}
                  >
                    {isDisabling ? 'Disable 2FA' : 'Enable 2FA'}
                  </button>
                </div>
              </motion.div>
            )}

            {phase === 'loading' && (
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
                    <span className={`text-sm ${
                      isDisabling ? 'text-orange-700' : 'text-slate-700'
                    }`}>
                      {isDisabling ? 'Disabling Two-Factor Authentication...' : 'Enabling Two-Factor Authentication...'}
                    </span>
                  </div>
                  <div className="h-1 w-full bg-slate-200">
                    <motion.div
                      className={`h-1 ${
                        isDisabling ? 'bg-orange-500' : 'bg-slate-800'
                      }`}
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ ease: "easeOut", duration: 1.5 }}
                    />
                  </div>
                </div>
                <div className="text-sm text-slate-600">
                  Please wait while we update your security settings...
                </div>
              </motion.div>
            )}

            {phase === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="grid gap-5 place-items-center text-center"
              >
                <motion.div
                  className="relative"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 340, damping: 18 }}
                >
                  <div className={`grid place-items-center rounded-2xl border p-4 shadow-sm ${
                    isDisabling 
                      ? 'border-orange-200 bg-gradient-to-b from-white to-orange-50' 
                      : 'border-green-200 bg-gradient-to-b from-white to-emerald-50'
                  }`}>
                    <CheckCircle2 className={`h-14 w-14 ${
                      isDisabling ? 'text-orange-500' : 'text-green-500'
                    }`} />
                  </div>
                  <Sparkles className="absolute -right-2 -top-2 h-4 w-4 text-amber-500" />
                </motion.div>
                <div className="space-y-1">
                  <h3 className={`text-lg font-semibold ${
                    isDisabling ? 'text-orange-900' : 'text-slate-900'
                  }`}>
                    {isDisabling ? '2FA Disabled Successfully!' : '2FA Enabled Successfully!'}
                  </h3>
                  <p className={`text-sm ${
                    isDisabling ? 'text-orange-700' : 'text-slate-600'
                  }`}>
                    {isDisabling 
                      ? 'Two-Factor Authentication has been disabled for your account. Your account security has been reduced.'
                      : 'Two-Factor Authentication has been enabled for your account. Your account is now more secure.'
                    }
                  </p>
                </div>
              </motion.div>
            )}

            {phase === 'error' && (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="grid gap-5 place-items-center text-center"
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
                    {isDisabling ? 'Failed to Disable 2FA' : 'Failed to Enable 2FA'}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {error || 'An unexpected error occurred. Please try again.'}
                  </p>
                </div>
                <button
                  onClick={handleRetry}
                  className="w-full max-w-[200px] h-11 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-semibold shadow-lg shadow-green-500/20 transition hover:from-green-600 hover:to-emerald-600"
                >
                  Try Again
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
