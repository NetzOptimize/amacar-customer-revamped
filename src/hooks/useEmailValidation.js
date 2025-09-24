import { useState, useEffect, useCallback } from 'react';

const useEmailValidation = (email, isRegisterMode) => {
  const [validationState, setValidationState] = useState({
    isValidating: false,
    isDisposable: null,
    error: null,
    isValid: null
  });

  const checkDisposableEmail = useCallback(async (emailToCheck) => {
    if (!emailToCheck || !isRegisterMode) {
      setValidationState({
        isValidating: false,
        isDisposable: null,
        error: null,
        isValid: null
      });
      return;
    }

    setValidationState(prev => ({
      ...prev,
      isValidating: true,
      error: null
    }));

    try {
      // Random delay between 0-5000ms
      const randomDelay = Math.random() * 5000;
      await new Promise(resolve => setTimeout(resolve, randomDelay));

      const response = await fetch(`https://disposable.debounce.io/?email=${encodeURIComponent(emailToCheck)}`);
      
      if (!response.ok) {
        throw new Error('Failed to validate email');
      }

      const data = await response.json();
      const isDisposable = data.disposable === 'true';

      setValidationState({
        isValidating: false,
        isDisposable,
        error: null,
        isValid: !isDisposable
      });
    } catch (error) {
      setValidationState({
        isValidating: false,
        isDisposable: null,
        error: error.message,
        isValid: null
      });
    }
  }, [isRegisterMode]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (email && isRegisterMode) {
        checkDisposableEmail(email);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [email, isRegisterMode, checkDisposableEmail]);

  return validationState;
};

export default useEmailValidation;
