import api from '@/lib/api';
import { useState, useEffect, useCallback } from 'react';

const useEmailValidation = (email, isRegisterMode, shouldReset = false) => {
  const [validationState, setValidationState] = useState({
    isValidating: false,
    isDisposable: null,
    isEmailAvailable: null,
    isRegistered: null,
    error: null,
    isValid: null
  });

  // Email regex validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailFormatValid = email && emailRegex.test(email);

  // Reset validation state when shouldReset is true
  useEffect(() => {
    if (shouldReset) {
      setValidationState({
        isValidating: false,
        isDisposable: null,
        isEmailAvailable: null,
        isRegistered: null,
        error: null,
        isValid: null
      });
    }
  }, [shouldReset]);

  const checkEmailAvailability = useCallback(async (emailToCheck) => {
    console.log('🔍 [EmailValidation] Starting email availability check for:', emailToCheck);
    try {
      const response = await api.post('/user/check-email', { email: emailToCheck });
      console.log('📡 [EmailValidation] API response received:', response.data);
      
      if (!response.data.success) {
        console.warn('⚠️ [EmailValidation] API returned success: false');
        throw new Error('Failed to check email availability');
      }
      
      const data = await response.data;
      const isRegistered = data.user_id !== false;
      console.log('✅ [EmailValidation] Email registration status:', isRegistered);
      return isRegistered;
    } catch (error) {
      console.error('❌ [EmailValidation] Email availability check failed:', error);
      return false;
    }
  }, []);

  const checkDisposableEmail = useCallback(async (emailToCheck) => {
    console.log('🚀 [EmailValidation] Starting validation process for:', emailToCheck);
    console.log('📋 [EmailValidation] Validation context:', { 
      emailToCheck, 
      isRegisterMode, 
      isEmailFormatValid 
    });

    if (!emailToCheck || !isEmailFormatValid) {
      console.log('⏭️ [EmailValidation] Skipping validation - invalid conditions');
      setValidationState({
        isValidating: false,
        isDisposable: null,
        isEmailAvailable: null,
        isRegistered: null,
        error: null,
        isValid: null
      });
      return;
    }

    console.log('⏳ [EmailValidation] Setting validating state to true');
    setValidationState(prev => ({
      ...prev,
      isValidating: true,
      error: null
    }));

    try {
      // Random delay between 0-5000ms
      const randomDelay = Math.random() * 5000;
      console.log('⏱️ [EmailValidation] Adding random delay:', randomDelay, 'ms');
      await new Promise(resolve => setTimeout(resolve, randomDelay));

      console.log('🌐 [EmailValidation] Checking disposable email via debounce.io');
      const response = await fetch(`https://disposable.debounce.io/?email=${encodeURIComponent(emailToCheck)}`);
      
      if (!response.ok) {
        throw new Error('Failed to validate email');
      }

      const data = await response.json();
      const isDisposable = data.disposable === 'true';
      console.log('📊 [EmailValidation] Disposable check result:', { 
        isDisposable, 
        rawData: data 
      });

      // If email is disposable, stop here and show error
      if (isDisposable) {
        console.log('🚫 [EmailValidation] Email is disposable - stopping validation');
        setValidationState({
          isValidating: false,
          isDisposable: true,
          isEmailAvailable: null,
          isRegistered: null,
          error: null,
          isValid: false
        });
        return;
      }

      // If not disposable, check email registration status
      console.log('✅ [EmailValidation] Email is not disposable - checking registration status');
      const isRegistered = await checkEmailAvailability(emailToCheck);
      
      // Determine validation result based on mode
      let isValid;
      if (isRegisterMode) {
        // In register mode: valid if email is NOT registered (available for registration)
        isValid = !isRegistered;
        console.log('🎯 [EmailValidation] Register mode - email available for registration:', isValid);
      } else {
        // In login mode: valid if email IS registered (can login)
        isValid = isRegistered;
        console.log('🎯 [EmailValidation] Login mode - email can be used for login:', isValid);
      }
      
      console.log('🎯 [EmailValidation] Final validation result:', {
        isDisposable: false,
        isRegistered,
        isRegisterMode,
        isValid
      });
      
      setValidationState({
        isValidating: false,
        isDisposable: false,
        isEmailAvailable: null,
        isRegistered,
        error: null,
        isValid
      });
    } catch (error) {
      console.error('💥 [EmailValidation] Validation error occurred:', error);
      setValidationState({
        isValidating: false,
        isDisposable: null,
        isEmailAvailable: null,
        isRegistered: null,
        error: error.message,
        isValid: null
      });
    }
  }, [isRegisterMode, isEmailFormatValid, checkEmailAvailability]);

  useEffect(() => {
    console.log('🔄 [EmailValidation] useEffect triggered with:', { 
      email, 
      isRegisterMode, 
      isEmailFormatValid 
    });
    
    const timeoutId = setTimeout(() => {
      if (email && isEmailFormatValid) {
        console.log('🎯 [EmailValidation] Starting validation after debounce');
        checkDisposableEmail(email);
      } else if (email && !isEmailFormatValid) {
        console.log('🔄 [EmailValidation] Resetting state - invalid email format');
        // Reset validation state if email format is invalid
        setValidationState({
          isValidating: false,
          isDisposable: null,
          isEmailAvailable: null,
          isRegistered: null,
          error: null,
          isValid: null
        });
      } else {
        console.log('⏭️ [EmailValidation] No validation needed - conditions not met');
      }
    }, 500); // 500ms debounce

    return () => {
      console.log('🧹 [EmailValidation] Cleaning up timeout');
      clearTimeout(timeoutId);
    };
  }, [email, isRegisterMode, isEmailFormatValid, checkDisposableEmail]);

  // Debug final validation state
  useEffect(() => {
    console.log('📊 [EmailValidation] Current validation state:', validationState);
  }, [validationState]);

  return validationState;
};

export default useEmailValidation;
