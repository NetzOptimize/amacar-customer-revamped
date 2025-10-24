import api from "@/lib/api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk to fetch previous offers
export const fetchPreviousOffers = createAsyncThunk(
  "offers/fetchPreviousOffers",
  async (_, { rejectWithValue }) => {
    try {
      // Use the axios instance which already handles auth headers
      const response = await api.get("/dashboard/previous-offers");
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch offers");
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch previous offers"
      );
    }
  }
);

// Async thunk to fetch pending offers
export const fetchPendingOffers = createAsyncThunk(
  "offers/fetchPendingOffers",
  async (_, { rejectWithValue }) => {
    try {
      // Use the axios instance which already handles auth headers
      const response = await api.get("/dashboard/pending-offers");

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to fetch pending offers"
        );
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch pending offers"
      );
    }
  }
);

// Async thunk to fetch accepted offers
export const fetchAcceptedOffers = createAsyncThunk(
  "offers/fetchAcceptedOffers",
  async (_, { rejectWithValue }) => {
    try {
      // Use the axios instance which already handles auth headers
      const response = await api.get("/dashboard/accepted-offers");

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to fetch accepted offers"
        );
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch accepted offers"
      );
    }
  }
);

// Async thunk to fetch live auctions
export const fetchLiveAuctions = createAsyncThunk(
  "offers/fetchLiveAuctions",
  async (_, { rejectWithValue }) => {
    try {
      // Use the axios instance which already handles auth headers
      const response = await api.get("/dashboard/live-auctions");

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to fetch live auctions"
        );
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch live auctions"
      );
    }
  }
);

// Async thunk to fetch appointments
export const fetchAppointments = createAsyncThunk(
  "offers/fetchAppointments",
  async (_, { rejectWithValue }) => {
    try {
      // Use the axios instance which already handles auth headers
      const response = await api.get("/dashboard/appointments");

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to fetch appointments"
        );
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch appointments"
      );
    }
  }
);

// Async thunk to fetch dashboard summary
export const fetchDashboardSummary = createAsyncThunk(
  "offers/fetchDashboardSummary",
  async (_, { rejectWithValue }) => {
    try {
      // Use the axios instance which already handles auth headers
      const response = await api.get("/dashboard/summary");

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to fetch dashboard summary"
        );
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch dashboard summary"
      );
    }
  }
);

// Async thunk to create appointments
export const createAppointments = createAsyncThunk(
  "offers/createAppointments",
  async (appointmentData, { rejectWithValue }) => {
    try {
      // Use the axios instance which already handles auth headers
      const response = await api.post("/appointment/create", {
        dealer_id: appointmentData.dealerId,
        start_time: appointmentData.start_time,
        notes: appointmentData.notes,
      });

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to create appointments"
        );
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to create appointments"
      );
    }
  }
);

// Async thunk to cancel appointments
export const cancelAppointment = createAsyncThunk(
  "offers/cancelAppointment",
  async (cancelData, { rejectWithValue }) => {
    try {
      const response = await api.post("/appointment/cancel", {
        appointment_id: cancelData.appointmentId,
        notes: cancelData.notes,
      });

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to cancel appointment"
        );
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to cancel appointment"
      );
    }
  }
);

// Async thunk to confirm appointments
export const confirmAppointment = createAsyncThunk(
  "appointments/confirmAppointment",
  async (confirmData, { rejectWithValue }) => {
    try {
      const response = await api.post("/appointment/update-status", {
        appointment_id: confirmData.appointmentId,
        status: "confirmed",
      });

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to confirm appointment"
        );
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to confirm appointment"
      );
    }
  }
);

// Async thunk to reschedule appointments
export const rescheduleAppointment = createAsyncThunk(
  "offers/rescheduleAppointment",
  async (rescheduleData, { rejectWithValue }) => {
    try {
      const response = await api.post("/appointment/reschedule", {
        appointment_id: rescheduleData.appointmentId,
        new_start_time: rescheduleData.start_time,
        notes: rescheduleData.notes,
      });

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to reschedule appointment"
        );
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to reschedule appointment"
      );
    }
  }
);

// Async thunk to accept a bid
export const acceptBid = createAsyncThunk(
  "offers/acceptBid",
  async (bidData, { rejectWithValue }) => {
    try {
      const response = await api.post("/bid/accept", {
        bid_id: bidData.bidId,
        product_id: bidData.productId,
        bidder_id: bidData.bidderId,
      });

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to accept bid");
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to accept bid"
      );
    }
  }
);

// Async thunk to reject a bid
export const rejectBid = createAsyncThunk(
  "offers/rejectBid",
  async (bidData, { rejectWithValue }) => {
    try {
      const response = await api.post("/bid/reject", {
        bid_id: bidData.bidId,
        product_id: bidData.productId,
        bidder_id: bidData.bidderId,
      });

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to reject bid");
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to reject bid"
      );
    }
  }
);

// Async thunk to re-auction a vehicle (when user selects "No" - no changes)
export const reAuctionVehicle = createAsyncThunk(
  "offers/reAuctionVehicle",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await api.post("/vehicle/re-auction", {
        product_id: productId,
      });

      if (!response.data.success) {
        // Handle specific error cases
        const errorData = response.data;
        if (errorData.days_remaining !== undefined) {
          // 7-day rule error
          return rejectWithValue({
            type: "DAYS_REMAINING",
            message: errorData.message,
            days_remaining: errorData.days_remaining,
            offer_date: errorData.offer_date,
            redirect_to_homepage: errorData.redirect_to_homepage,
          });
        } else if (errorData.message?.includes("not authorized")) {
          // Authorization error
          return rejectWithValue({
            type: "UNAUTHORIZED",
            message: errorData.message,
          });
        } else if (errorData.message?.includes("not found")) {
          // Product not found error
          return rejectWithValue({
            type: "NOT_FOUND",
            message: errorData.message,
          });
        } else if (errorData.message?.includes("instant cash offer")) {
          // No instant cash offer error
          return rejectWithValue({
            type: "NO_CASH_OFFER",
            message: errorData.message,
          });
        } else {
          // Generic error
          return rejectWithValue({
            type: "GENERIC",
            message: errorData.message || "Failed to re-auction vehicle",
          });
        }
      }

      return response.data;
    } catch (error) {
      // Handle network or other errors
      const errorResponse = error.response?.data;
      if (errorResponse) {
        // Check if it's a 400 error with specific business logic
        if (error.response?.status === 400) {
          if (errorResponse.days_remaining !== undefined) {
            // 7-day rule error
            return rejectWithValue({
              type: "DAYS_REMAINING",
              message: errorResponse.message,
              days_remaining: errorResponse.days_remaining,
              offer_date: errorResponse.offer_date,
              redirect_to_homepage: errorResponse.redirect_to_homepage,
            });
          } else if (errorResponse.message?.includes("not authorized")) {
            // Authorization error
            return rejectWithValue({
              type: "UNAUTHORIZED",
              message: errorResponse.message,
            });
          } else if (errorResponse.message?.includes("not found")) {
            // Product not found error
            return rejectWithValue({
              type: "NOT_FOUND",
              message: errorResponse.message,
            });
          } else if (errorResponse.message?.includes("instant cash offer")) {
            // No instant cash offer error
            return rejectWithValue({
              type: "NO_CASH_OFFER",
              message: errorResponse.message,
            });
          } else {
            // Generic 400 error
            return rejectWithValue({
              type: "GENERIC",
              message: errorResponse.message || "Failed to re-auction vehicle",
            });
          }
        }
        // Other network errors
        return rejectWithValue({
          type: "NETWORK",
          message:
            errorResponse.message || error.message || "Network error occurred",
        });
      }
      return rejectWithValue({
        type: "NETWORK",
        message: error.message || "Failed to re-auction vehicle",
      });
    }
  }
);

const initialState = {
  loading: false,
  error: null,
  previousOffers: [],
  acceptedOffers: [],
  pendingOffers: [],
  liveAuctions: [],
  appointments: [],
  dashboardSummary: null,
  totalCount: 0,
  hasOffers: false,
  hasAuctions: false,
  hasAppointments: false,
  // Bid operation states
  bidOperationLoading: false,
  bidOperationError: null,
  bidOperationSuccess: false,
  // Re-auction operation states
  reAuctionLoading: false,
  reAuctionError: null,
  reAuctionSuccess: false,
  // Appointment operation states
  appointmentOperationLoading: false,
  appointmentOperationError: null,
  appointmentOperationSuccess: false,
};

const offersSlice = createSlice({
  name: "offers",
  initialState,
  reducers: {
    // Reset all offers data
    resetOffers: (state) => {
      state.loading = false;
      state.error = null;
      state.previousOffers = [];
      state.acceptedOffers = [];
      state.pendingOffers = [];
      state.liveAuctions = [];
      state.appointments = [];
      state.totalCount = 0;
      state.hasOffers = false;
      state.hasAuctions = false;
      state.hasAppointments = false;
      state.appointments = [];
      state.totalCount = 0;
    },

    // Add offer to accepted offers
    acceptOffer: (state, action) => {
      const offer = action.payload;
      // Remove from previous offers if it exists there
      state.previousOffers = state.previousOffers.filter(
        (prevOffer) => prevOffer.product_id !== offer.product_id
      );
      // Remove from pending offers if it exists there
      state.pendingOffers = state.pendingOffers.filter(
        (pendingOffer) => pendingOffer.product_id !== offer.product_id
      );
      // Add to accepted offers
      state.acceptedOffers.push(offer);
    },

    // Add offer to pending offers
    addPendingOffer: (state, action) => {
      const offer = action.payload;
      // Remove from previous offers if it exists there
      state.previousOffers = state.previousOffers.filter(
        (prevOffer) => prevOffer.product_id !== offer.product_id
      );
      // Add to pending offers
      state.pendingOffers.push(offer);
    },

    // Remove offer from accepted offers
    removeAcceptedOffer: (state, action) => {
      const productId = action.payload;
      state.acceptedOffers = state.acceptedOffers.filter(
        (offer) => offer.product_id !== productId
      );
    },

    // Remove offer from pending offers
    removePendingOffer: (state, action) => {
      const productId = action.payload;
      state.pendingOffers = state.pendingOffers.filter(
        (offer) => offer.product_id !== productId
      );
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Clear bid operation states
    clearBidOperationStates: (state) => {
      console.log("🧹 Redux: clearBidOperationStates called");
      state.bidOperationLoading = false;
      state.bidOperationError = null;
      state.bidOperationSuccess = false;
    },

    // Clear re-auction operation states
    clearReAuctionStates: (state) => {
      state.reAuctionLoading = false;
      state.reAuctionError = null;
      state.reAuctionSuccess = false;
    },

    // Clear appointment operation states
    clearAppointmentOperationStates: (state) => {
      state.appointmentOperationLoading = false;
      state.appointmentOperationError = null;
      state.appointmentOperationSuccess = false;
    },

    // Move vehicle from previous offers to live auctions
    moveToLiveAuctions: (state, action) => {
      const { productId } = action.payload;
      // Remove from previous offers
      state.previousOffers = state.previousOffers.filter(
        (offer) => offer.product_id !== productId
      );
      // Add to live auctions (this would typically come from a separate API call)
      // For now, we'll just remove from previous offers
    },

    // Update bid status in live auctions
    updateBidStatus: (state, action) => {
      const { auctionId, bidId, status } = action.payload;
      const auction = state.liveAuctions.find(
        (auction) => auction.product_id === auctionId
      );
      if (auction && auction.bid) {
        const bid = auction.bid.find((bid) => bid.id === bidId);
        if (bid) {
          bid.is_accepted = status === "accepted";
          bid.is_expired = status === "rejected";
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch previous offers
      .addCase(fetchPreviousOffers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPreviousOffers.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.previousOffers = action.payload.offers || [];
        state.totalCount = action.payload.total_count || 0;
        state.hasOffers = action.payload.has_offers || false;
      })
      .addCase(fetchPreviousOffers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch previous offers";
      })
      // Fetch pending offers
      .addCase(fetchPendingOffers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPendingOffers.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.pendingOffers = action.payload.offers || [];
        state.totalCount = action.payload.total_count || 0;
        state.hasOffers = action.payload.has_offers || false;
      })
      .addCase(fetchPendingOffers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch pending offers";
      })
      // Fetch accepted offers
      .addCase(fetchAcceptedOffers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAcceptedOffers.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.acceptedOffers = action.payload.offers || [];
        state.totalCount = action.payload.total_count || 0;
        state.hasOffers = action.payload.has_offers || false;
      })
      .addCase(fetchAcceptedOffers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch accepted offers";
      })
      // Fetch live auctions
      .addCase(fetchLiveAuctions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLiveAuctions.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.liveAuctions = action.payload.auctions || [];
        state.totalCount = action.payload.total_count || 0;
        state.hasAuctions = action.payload.has_auctions || false;
      })
      .addCase(fetchLiveAuctions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch live auctions";
      })
      // Fetch appointments
      .addCase(fetchAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.appointments = action.payload.appointments || [];
        state.totalCount = action.payload.total_count || 0;
        state.hasAppointments = action.payload.has_appointments || false;
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch appointments";
      })
      // Fetch dashboard summary
      .addCase(fetchDashboardSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.dashboardSummary = action.payload;
      })
      .addCase(fetchDashboardSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch dashboard summary";
      })
      // Create appointments
      .addCase(createAppointments.pending, (state) => {
        state.appointmentOperationLoading = true;
        state.appointmentOperationError = null;
        state.appointmentOperationSuccess = false;
      })
      .addCase(createAppointments.fulfilled, (state, action) => {
        state.appointmentOperationLoading = false;
        state.appointmentOperationError = null;
        state.appointmentOperationSuccess = true;
        // Add new appointment to the list if it exists
        if (action.payload.appointment) {
          state.appointments.push(action.payload.appointment);
        }
        state.hasAppointments = true;
      })
      .addCase(createAppointments.rejected, (state, action) => {
        state.appointmentOperationLoading = false;
        state.appointmentOperationError =
          action.payload || "Failed to create appointments";
        state.appointmentOperationSuccess = false;
      })
      // Cancel appointment
      .addCase(cancelAppointment.pending, (state) => {
        state.appointmentOperationLoading = true;
        state.appointmentOperationError = null;
        state.appointmentOperationSuccess = false;
      })
      .addCase(cancelAppointment.fulfilled, (state, action) => {
        state.appointmentOperationLoading = false;
        state.appointmentOperationError = null;
        state.appointmentOperationSuccess = true;
        // Update the appointment status in the appointments list
        const cancelledAppointment = action.payload.appointment;
        if (cancelledAppointment) {
          const index = state.appointments.findIndex(
            (apt) => apt.id === cancelledAppointment.id || apt.id === cancelledAppointment.id.toString()
          );
          if (index !== -1) {
            state.appointments[index] = cancelledAppointment;
          } else {
            // If appointment not found in existing list, add it
            state.appointments.push(cancelledAppointment);
          }
        }
      })
      .addCase(cancelAppointment.rejected, (state, action) => {
        state.appointmentOperationLoading = false;
        state.appointmentOperationError =
          action.payload || "Failed to cancel appointment";
        state.appointmentOperationSuccess = false;
      })
      // Reschedule appointment
      .addCase(rescheduleAppointment.pending, (state) => {
        state.appointmentOperationLoading = true;
        state.appointmentOperationError = null;
        state.appointmentOperationSuccess = false;
      })
      .addCase(rescheduleAppointment.fulfilled, (state, action) => {
        state.appointmentOperationLoading = false;
        state.appointmentOperationError = null;
        state.appointmentOperationSuccess = true;
        // Update the appointment in the appointments list
        const rescheduledAppointment = action.payload.appointment;
        if (rescheduledAppointment) {
          const index = state.appointments.findIndex(
            (apt) => apt.id === rescheduledAppointment.id || apt.id === rescheduledAppointment.id.toString()
          );
          if (index !== -1) {
            state.appointments[index] = rescheduledAppointment;
          } else {
            // If appointment not found in existing list, add it
            state.appointments.push(rescheduledAppointment);
          }
        }
      })
      .addCase(rescheduleAppointment.rejected, (state, action) => {
        state.appointmentOperationLoading = false;
        state.appointmentOperationError =
          action.payload || "Failed to reschedule appointment";
        state.appointmentOperationSuccess = false;
      })
      // Accept bid
      .addCase(acceptBid.pending, (state) => {
        console.log("🔄 Redux: acceptBid.pending");
        state.bidOperationLoading = true;
        state.bidOperationError = null;
        state.bidOperationSuccess = false;
      })
      .addCase(acceptBid.fulfilled, (state, action) => {
        console.log("✅ Redux: acceptBid.fulfilled", {
          payload: action.payload,
          bidId: action.meta.arg.bidId,
          productId: action.meta.arg.productId,
        });
        state.bidOperationLoading = false;
        state.bidOperationError = null;
        state.bidOperationSuccess = true;
        // Update the bid status in live auctions
        const { bidId, productId } = action.meta.arg;
        const auction = state.liveAuctions.find(
          (auction) => auction.product_id === productId
        );
        if (auction && auction.bid) {
          // Mark the accepted bid as accepted
          const acceptedBid = auction.bid.find((bid) => bid.id === bidId);
          if (acceptedBid) {
            acceptedBid.is_accepted = true;
            acceptedBid.is_expired = false;
          }
          // Mark all other bids as expired
          auction.bid.forEach((bid) => {
            if (bid.id !== bidId) {
              bid.is_accepted = false;
              bid.is_expired = true;
            }
          });
        }
      })
      .addCase(acceptBid.rejected, (state, action) => {
        console.log("❌ Redux: acceptBid.rejected", action.payload);
        state.bidOperationLoading = false;
        state.bidOperationError = action.payload || "Failed to accept bid";
        state.bidOperationSuccess = false;
      })
      // Reject bid
      .addCase(rejectBid.pending, (state) => {
        state.bidOperationLoading = true;
        state.bidOperationError = null;
        state.bidOperationSuccess = false;
      })
      .addCase(rejectBid.fulfilled, (state, action) => {
        state.bidOperationLoading = false;
        state.bidOperationError = null;
        state.bidOperationSuccess = true;
        // Update the bid status in live auctions
        const { bidId, productId } = action.meta.arg;
        const auction = state.liveAuctions.find(
          (auction) => auction.product_id === productId
        );
        if (auction && auction.bid) {
          const bid = auction.bid.find((bid) => bid.id === bidId);
          if (bid) {
            bid.is_accepted = false;
            bid.is_expired = true;
          }
        }
      })
      .addCase(rejectBid.rejected, (state, action) => {
        state.bidOperationLoading = false;
        state.bidOperationError = action.payload || "Failed to reject bid";
        state.bidOperationSuccess = false;
      })
      // Re-auction vehicle
      .addCase(reAuctionVehicle.pending, (state) => {
        state.reAuctionLoading = true;
        state.reAuctionError = null;
        state.reAuctionSuccess = false;
      })
      .addCase(reAuctionVehicle.fulfilled, (state, action) => {
        state.reAuctionLoading = false;
        state.reAuctionError = null;
        state.reAuctionSuccess = true;
        // Remove the vehicle from previous offers
        const productId = action.meta.arg;
        state.previousOffers = state.previousOffers.filter(
          (offer) => offer.product_id !== productId
        );
      })
      .addCase(reAuctionVehicle.rejected, (state, action) => {
        state.reAuctionLoading = false;
        state.reAuctionError = action.payload;
        state.reAuctionSuccess = false;
      })
      // Confirm appointment
      .addCase(confirmAppointment.pending, (state) => {
        state.appointmentOperationLoading = true;
        state.appointmentOperationError = null;
        state.appointmentOperationSuccess = false;
      })
      .addCase(confirmAppointment.fulfilled, (state, action) => {
        state.appointmentOperationLoading = false;
        state.appointmentOperationError = null;
        state.appointmentOperationSuccess = true;
        // Update the appointment status in the appointments list
        const confirmedAppointment = action.payload.appointment;
        if (confirmedAppointment) {
          const index = state.appointments.findIndex(
            (apt) => apt.id === confirmedAppointment.id
          );
          if (index !== -1) {
            state.appointments[index] = {
              ...state.appointments[index],
              ...confirmedAppointment,
              status: confirmedAppointment.status,
              formatted_start_time: confirmedAppointment.formatted_start_time,
              can_reschedule: confirmedAppointment.can_reschedule,
              can_cancel: confirmedAppointment.can_cancel,
            };
          } else {
            // If appointment not found in list, add it
            state.appointments.push(confirmedAppointment);
          }
        }
      })
      .addCase(confirmAppointment.rejected, (state, action) => {
        state.appointmentOperationLoading = false;
        state.appointmentOperationError =
          action.payload || "Failed to confirm appointment";
        state.appointmentOperationSuccess = false;
      });
  },
});

// Export actions
export const {
  resetOffers,
  acceptOffer,
  addPendingOffer,
  removeAcceptedOffer,
  removePendingOffer,
  clearError,
  clearBidOperationStates,
  clearReAuctionStates,
  clearAppointmentOperationStates,
  moveToLiveAuctions,
  updateBidStatus,
} = offersSlice.actions;

// Export createAppointments async thunk
// export { createAppointments }; // Already exported above as const

// Export cancelAppointment async thunk

// Export reducer
export default offersSlice.reducer;

// Selectors for easy access to state
export const selectOffers = (state) => state.offers;
export const selectPreviousOffers = (state) => state.offers.previousOffers;
export const selectAcceptedOffers = (state) => state.offers.acceptedOffers;
export const selectPendingOffers = (state) => state.offers.pendingOffers;
export const selectLiveAuctions = (state) => state.offers.liveAuctions;
export const selectAppointments = (state) => state.offers.appointments;
export const selectDashboardSummary = (state) => state.offers.dashboardSummary;
export const selectOffersLoading = (state) => state.offers.loading;
export const selectOffersError = (state) => state.offers.error;
export const selectTotalCount = (state) => state.offers.totalCount;
export const selectHasOffers = (state) => state.offers.hasOffers;
export const selectHasAuctions = (state) => state.offers.hasAuctions;
export const selectHasAppointments = (state) => state.offers.hasAppointments;
// Bid operation selectors
export const selectBidOperationLoading = (state) =>
  state.offers.bidOperationLoading;
export const selectBidOperationError = (state) =>
  state.offers.bidOperationError;
export const selectBidOperationSuccess = (state) =>
  state.offers.bidOperationSuccess;
// Re-auction operation selectors
export const selectReAuctionLoading = (state) => state.offers.reAuctionLoading;
export const selectReAuctionError = (state) => state.offers.reAuctionError;
export const selectReAuctionSuccess = (state) => state.offers.reAuctionSuccess;
// Appointment operation selectors
export const selectAppointmentOperationLoading = (state) =>
  state.offers.appointmentOperationLoading;
export const selectAppointmentOperationError = (state) =>
  state.offers.appointmentOperationError;
export const selectAppointmentOperationSuccess = (state) =>
  state.offers.appointmentOperationSuccess;
