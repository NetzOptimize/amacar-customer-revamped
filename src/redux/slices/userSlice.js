import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/api'; // Assuming api.js is in src/
import { useNavigate } from 'react-router-dom'; // Note: useNavigate cannot be used directly in slice, handled in components

// Async thunks for auth actions
export const loginUser = createAsyncThunk(
  'user/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data.success) {
        // If 2FA is not required, proceed with normal login
        if (!response.data.requires_2fa) {
          // Store auth tokens in localStorage for persistence
          if (response.data.token) {
            localStorage.setItem('authToken', response.data.token);
          }
          if (response.data.user) {
            localStorage.setItem('authUser', JSON.stringify(response.data.user));
          }
          if (response.data.expires_in) {
            const expirationTime = Date.now() + response.data.expires_in * 1000;
            localStorage.setItem('authExpiration', expirationTime);
          }
        }
        return response.data; // { user, token, expires_in, requires_2fa, user_id, username }
      }
      return rejectWithValue(response.data.message || 'Login failed');
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'user/register',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/register', data);
      if (response.data.success) {
        return response.data; // { user, token, expires_in }
      }
      return rejectWithValue(response.data.message || 'Registration failed');
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);


export const registerWithVin = createAsyncThunk(
  'user/registerWithVin',
  async (data, { rejectWithValue }) => {
    try {
        // console.log("data", data)
        const response = await api.post('/registration/register-with-vin', data);
        // console.log("Response", response)
        // console.log("Response.data", response.data)
      if (response.data.success) {
        // Store auth tokens in localStorage for persistence
        if (response.data.token) {
          localStorage.setItem('authToken', response.data.token);
        }
        if (response.data.user) {
          localStorage.setItem('authUser', JSON.stringify(response.data.user));
        }
        if (response.data.expires_in) {
          const expirationTime = Date.now() + response.data.expires_in * 1000;
          localStorage.setItem('authExpiration', expirationTime);
        }
        return response.data; // Assuming response contains { user, token, expires_in }
      }
      return rejectWithValue(response.data.message || 'Registration with VIN failed');
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Registration with VIN failed'
      );
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'user/forgotPassword',
  async (email, { rejectWithValue }) => {
    try {
        // console.log(email)
      const response = await api.post('/auth/forgot-password', { email });
      if (response.data.success) {
        // console.log(response)
        // console.log(response.data)
        return response.data;
      }
      return rejectWithValue(response.data.message || 'Failed to send OTP');
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send OTP');
    }
  }
);

export const verifyOTP = createAsyncThunk(
  'user/verifyOTP',
  async (data, { rejectWithValue }) => {
    try {
      console.log('Sending OTP verification request:', data);
      const response = await api.post('/auth/verify-otp', data);
      console.log('OTP verification response:', response.data);
      
      if (response.data.success) {
        console.log('OTP verification successful, returning token:', response.data.resetToken);
        return response.data.resetToken; // Assuming backend returns resetToken
      }
      console.log('OTP verification failed - success is false:', response.data);
      return rejectWithValue(response.data.message || 'Invalid OTP');
    } catch (error) {
      console.log('OTP verification API error:', error.response?.data || error.message);
      console.log('Full error object:', error);
      console.log('Error status:', error.response?.status);
      console.log('Error headers:', error.response?.headers);
      return rejectWithValue(error.response?.data?.message || 'Invalid OTP');
    }
  }
);

export const resetPassword = createAsyncThunk(
  'user/resetPassword',
  async ({ token, otp, newPassword, confirmPassword }, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/reset-password', { token, otp, new_password: newPassword, confirm_password: confirmPassword });
      if (response.data.success) {
        return response.data;
      }
      return rejectWithValue(response.data.message || 'Password reset failed');
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Password reset failed');
    }
  }
);

export const changePassword = createAsyncThunk(
  'user/changePassword',
  async (passwordData, { rejectWithValue }) => {
    try {
      const response = await api.post('/user/change-password', { current_password: passwordData.currentPassword, new_password: passwordData.newPassword, confirm_password: passwordData.confirmPassword });
      if (response.data.success) {
        return response.data.user;
      }
      return rejectWithValue(response.data.message || 'password update failed');
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'password update failed');
    }
  }
);


export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      // Transform data to match API structure
      const apiData = {
        phone: profileData.phone,
        city: profileData.city,
        state: profileData.state,
        zip: profileData.zipcode
      };
      
      const response = await api.put('/user/profile', apiData);
      if (response.data.success) {
        return response.data.user;
      }
      return rejectWithValue(response.data.message || 'Profile update failed');
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Profile update failed');
    }
  }
);

export const toggleTwoFactorAuth = createAsyncThunk(
  'user/toggleTwoFactorAuth',
  async ({ enabled }, { rejectWithValue }) => {
    try {
      const response = await api.post('/user/twofa', { enabled });
      if (response.data.success) {
        return response.data.user;
      }
      return rejectWithValue(response.data.message || 'Failed to update 2FA settings');
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update 2FA settings');
    }
  }
);

export const verifyLoginOTP = createAsyncThunk(
  'user/verifyLoginOTP',
  async ({ otp, username }, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/verify-login-otp', { otp, username });
      if (response.data.success) {
        // Store auth tokens in localStorage for persistence
        if (response.data.token) {
          localStorage.setItem('authToken', response.data.token);
        }
        if (response.data.user) {
          localStorage.setItem('authUser', JSON.stringify(response.data.user));
        }
        if (response.data.expires_in) {
          const expirationTime = Date.now() + response.data.expires_in * 1000;
          localStorage.setItem('authExpiration', expirationTime);
        }
        return response.data;
      }
      return rejectWithValue(response.data.message || 'OTP verification failed');
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'OTP verification failed');
    }
  }
);

// Auto-login with JWT token from offer response
export const autoLoginWithToken = createAsyncThunk(
  'user/autoLoginWithToken',
  async (userInfo, { rejectWithValue }) => {
    try {
      // Store auth tokens in localStorage for persistence
      if (userInfo.jwt_token) {
        localStorage.setItem('authToken', userInfo.jwt_token);
      }
      
      // Create user object from the response
      const user = {
        id: userInfo.user_id,
        email: userInfo.user_email,
        display_name: userInfo.user_full_name,
        phone: userInfo.user_phone,
        city: userInfo.user_city,
        state: userInfo.user_state,
        zip_code: userInfo.user_zip_code,
        meta: {
          phone: userInfo.user_phone,
          city: userInfo.user_city,
          state: userInfo.user_state,
          zip_code: userInfo.user_zip_code
        }
      };
      
      if (user) {
        localStorage.setItem('authUser', JSON.stringify(user));
      }
      
      // Set expiration time (default 24 hours if not provided)
      const expirationTime = Date.now() + (24 * 60 * 60 * 1000); // 24 hours
      localStorage.setItem('authExpiration', expirationTime);
      
      return {
        user,
        token: userInfo.jwt_token,
        expires_in: 24 * 60 * 60, // 24 hours in seconds
        account_created: userInfo.account_created,
        reset_password_required: userInfo.reset_password_required
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Auto-login failed');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    loading: true,
    form: {
      values: {},
      errors: {},
    },
    error: null,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    loginRedirect: null,
  },
  reducers: {

    setLoginRedirect: (state, action) => {
        state.loginRedirect = action.payload;
    },
    clearLoginRedirect: (state) => {
        state.loginRedirect = null;
    },

    setFormValue: (state, action) => {
      const { key, value } = action.payload;
      state.form.values[key] = value;
      state.form.errors[key] = '';
    },
    setFormError: (state, action) => {
      const { key, error } = action.payload;
      state.form.errors[key] = error;
    },
    resetForm: (state) => {
      state.form.values = {};
      state.form.errors = {};
    },
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      localStorage.removeItem('authExpiration');
      state.user = null;
      state.error = null;
      state.form.values = {};
      state.form.errors = {};
    },
    loadUser: (state) => {
      const token = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('authUser');
      const expiration = localStorage.getItem('authExpiration');

      // Clean up any invalid data in localStorage
      if (storedUser === 'undefined' || storedUser === 'null') {
        localStorage.removeItem('authUser');
        localStorage.removeItem('authToken');
        localStorage.removeItem('authExpiration');
        state.user = null;
        state.loading = false;
        return;
      }

      if (token && storedUser && expiration) {
        try {
          const expTime = parseInt(expiration);
          if (Date.now() < expTime) {
            state.user = JSON.parse(storedUser);
            state.loading = false;
            // Note: Auto-logout timer is set in the component
          } else {
            state.user = null;
            localStorage.removeItem('authToken');
            localStorage.removeItem('authUser');
            localStorage.removeItem('authExpiration');
            state.loading = false;
          }
        } catch (error) {
          // If JSON.parse fails, clear the invalid data and logout
          console.error('Error parsing stored user data:', error);
          state.user = null;
          localStorage.removeItem('authToken');
          localStorage.removeItem('authUser');
          localStorage.removeItem('authExpiration');
          state.loading = false;
        }
      } else {
        state.user = null;
        state.loading = false;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Only set user and tokens if 2FA is not required
        if (!action.payload.requires_2fa) {
          state.user = action.payload.user;
          // Tokens are already stored in localStorage by the thunk
        }
        // If 2FA is required, we don't set the user yet - wait for OTP verification
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        localStorage.setItem('authToken', action.payload.token);
        localStorage.setItem('authUser', JSON.stringify(action.payload.user));
        const expirationTime = Date.now() + action.payload.expires_in * 1000;
        localStorage.setItem('authExpiration', expirationTime);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Verify OTP
      .addCase(verifyOTP.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(resetPassword.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Change Password
      .addCase(changePassword.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Only update user data if payload is valid
        if (action.payload && typeof action.payload === 'object') {
          state.user = action.payload;
          // Update localStorage with new user data
          localStorage.setItem('authUser', JSON.stringify(action.payload));
        }
        // If payload is invalid, keep existing user data
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(registerWithVin.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerWithVin.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        // Auth tokens are already stored in localStorage by the thunk
        // No need to store them again in Redux state
      })
      .addCase(registerWithVin.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Something went wrong';
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Only update user data if payload is valid
        if (action.payload && typeof action.payload === 'object') {
          state.user = action.payload;
          // Update localStorage with new user data
          localStorage.setItem('authUser', JSON.stringify(action.payload));
        }
        // If payload is invalid, keep existing user data
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Toggle Two-Factor Authentication
      .addCase(toggleTwoFactorAuth.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(toggleTwoFactorAuth.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Only update user data if payload is valid
        if (action.payload && typeof action.payload === 'object') {
          state.user = action.payload;
          // Update localStorage with new user data
          localStorage.setItem('authUser', JSON.stringify(action.payload));
        }
        // If payload is invalid, keep existing user data
      })
      .addCase(toggleTwoFactorAuth.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Verify Login OTP
      .addCase(verifyLoginOTP.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(verifyLoginOTP.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        // Tokens are already stored in localStorage by the thunk
      })
      .addCase(verifyLoginOTP.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Auto-login with token
      .addCase(autoLoginWithToken.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(autoLoginWithToken.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        // Tokens are already stored in localStorage by the thunk
      })
      .addCase(autoLoginWithToken.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { setFormValue, setFormError, resetForm, clearError, logout, loadUser, setLoginRedirect, clearLoginRedirect } = userSlice.actions;
export default userSlice.reducer;
