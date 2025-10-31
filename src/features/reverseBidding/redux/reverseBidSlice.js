import { createSlice, createAsyncThunk, nanoid } from '@reduxjs/toolkit';
import api from '../../../lib/apiRev';

// Lightweight mock data generators (detailed mocks in utils/mockData)
const generateSessionId = () => `RB-${Math.random().toString(36).slice(2, 9)}`;

export const fetchMockCarsThunk = createAsyncThunk(
    'reverseBid/fetchCars',
    async ({ filters, page = 1, perPage = 20 }, { rejectWithValue, getState }) => {
        try {
            // Build query parameters for the API
            const params = {};

            if (filters.make) params.make = filters.make;
            if (filters.model) params.model = filters.model;
            if (filters.year) params.year = typeof filters.year === 'string' ? parseInt(filters.year, 10) : filters.year;

            // Use budgetMin as price, or calculate average if both are provided
            if (filters.budgetMin && filters.budgetMax) {
                params.price = Math.floor((Number(filters.budgetMin) + Number(filters.budgetMax)) / 2);
            } else if (filters.budgetMin) {
                params.price = Number(filters.budgetMin);
            } else if (filters.budgetMax) {
                params.price = Number(filters.budgetMax);
            }

            // Get zip_code from filters or user state
            const state = getState();
            const zipCode = filters.zipCode || state.reverseBid.filters.zipCode || '';
            if (zipCode) {
                params.zip_code = zipCode;
            }

            // Default radius is 50 (as per API docs)
            params.radius = 50;

            // Add pagination parameters
            params.page = page;
            params.per_page = perPage;

            // Make API call
            const response = await api.get('/vehicles/search', { params });

            if (response.data.success && response.data.data) {
                // API response structure: response.data.data.data (vehicles array)
                const vehiclesData = response.data.data.data || [];
                const pagination = response.data.data.pagination || {
                    current_page: 1,
                    per_page: perPage,
                    total_items: 0,
                    total_pages: 1,
                    has_next: false,
                    has_prev: false,
                };

                // Map API response to match component expectations
                const vehicles = vehiclesData.map(vehicle => ({
                    id: vehicle.id,
                    title: vehicle.title,
                    vin: vehicle.vin,
                    make: vehicle.make,
                    model: vehicle.model,
                    year: vehicle.year,
                    new_used: vehicle.new_used,
                    condition: vehicle.new_used === 'N' ? 'new' : 'used',
                    price: vehicle.price,
                    basePrice: vehicle.price, // For backward compatibility
                    zip_code: vehicle.zip_code,
                    city: vehicle.city,
                    state: vehicle.state,
                    owned_by: vehicle.owned_by,
                    is_reverse_biddable: vehicle.is_reverse_biddable,
                    images: vehicle.images || [], // Already in the correct format
                    url: vehicle.url,
                }));

                // Return vehicles and pagination
                return { vehicles, pagination };
            } else {
                // Return empty array if API indicates no vehicles found
                if (response.data.message?.toLowerCase().includes('no vehicles') ||
                    response.data.message?.toLowerCase().includes('not found')) {
                    return { vehicles: [], pagination: { current_page: 1, per_page: perPage, total_items: 0, total_pages: 1, has_next: false, has_prev: false } };
                }
                return rejectWithValue(response.data.message || 'No vehicles found');
            }
        } catch (err) {
            console.error('Vehicle search API error:', err);
            // If it's a 404 or empty result, return empty array instead of error
            if (err.response?.status === 404 || err.response?.data?.message?.toLowerCase().includes('no vehicles')) {
                return { vehicles: [], pagination: { current_page: 1, per_page: 20, total_items: 0, total_pages: 1, has_next: false, has_prev: false } };
            }
            return rejectWithValue(err.response?.data?.message || err.message || 'Failed to fetch vehicles');
        }
    }
);

export const startReverseBiddingThunk = createAsyncThunk(
    'reverseBid/startSession',
    async (carData, { rejectWithValue }) => {
        try {
            await new Promise((r) => setTimeout(r, 600));
            const sessionId = generateSessionId();
            const { generateMockDealers } = await import('../utils/mockData');
            const dealers = generateMockDealers(carData);
            return {
                sessionId,
                car: carData,
                dealers,
                createdAt: Date.now(),
                expiresAt: Date.now() + 24 * 60 * 60 * 1000,
            };
        } catch (err) {
            return rejectWithValue(err?.message || 'Failed to start session');
        }
    }
);

export const acceptBidThunk = createAsyncThunk(
    'reverseBid/acceptBid',
    async ({ sessionId, bidId }, { getState, rejectWithValue }) => {
        try {
            await new Promise((r) => setTimeout(r, 900));
            const state = getState().reverseBid;
            const dealer = state.activeSession?.dealers?.find((d) => d.id === bidId);
            if (!dealer) throw new Error('Bid not found');
            const certificate = {
                id: `CERT-${nanoid(8)}`,
                sessionId,
                dealerId: dealer.id,
                dealerName: dealer.dealerName,
                acceptedAt: Date.now(),
                finalPrice: dealer.currentOffer,
            };
            return { acceptedBid: dealer, certificate };
        } catch (err) {
            return rejectWithValue(err?.message || 'Failed to accept bid');
        }
    }
);

// Fire-and-forget simulation of live bids while active
export const simulateLiveBidsThunk = createAsyncThunk(
    'reverseBid/simulateBids',
    async (sessionId, { dispatch, getState }) => {
        const schedule = () => {
            const delay = Math.random() * 10000 + 5000;
            setTimeout(() => {
                const state = getState().reverseBid;
                if (!state.activeSession || state.activeSession.id !== sessionId) return;
                if (state.activeSession.status !== 'active') return;

                const dealers = state.activeSession.dealers;
                if (!dealers?.length) return schedule();
                const idx = Math.floor(Math.random() * dealers.length);
                const target = dealers[idx];
                const reduction = Math.floor(Math.random() * 500) + 200;
                const newOffer = Math.max(500, Math.round(target.currentOffer - reduction));
                dispatch(updateDealerBid({ dealerId: target.id, newOffer }));
                schedule();
            }, delay);
        };
        schedule();
    }
);

const initialState = {
    filters: {
        year: null,
        make: null,
        model: null,
        budgetMin: null,
        budgetMax: null,
        condition: 'new',
        zipCode: '',
    },
    searchResults: [],
    pagination: {
        current_page: 1,
        per_page: 20,
        total_items: 0,
        total_pages: 1,
        has_next: false,
        has_prev: false,
    },
    activeSession: {
        id: null,
        car: null,
        dealers: [],
        leaderboard: [],
        status: 'idle',
        acceptedBid: null,
        certificate: null,
        appointment: null,
        createdAt: null,
        expiresAt: null,
    },
    loading: { search: false, session: false, acceptance: false },
    error: null,
    pastSessions: [],
};

const reverseBidSlice = createSlice({
    name: 'reverseBid',
    initialState,
    reducers: {
        setFilters(state, action) {
            state.filters = { ...state.filters, ...action.payload };
        },
        setPage(state, action) {
            state.pagination.current_page = action.payload;
        },
        updateDealerBid(state, action) {
            const { dealerId, newOffer } = action.payload;
            const dealer = state.activeSession.dealers.find((d) => d.id === dealerId);
            if (!dealer) return;
            dealer.currentOffer = newOffer;
            dealer.savings = Math.max(0, (dealer.originalPrice || newOffer) - newOffer);
            // recompute leaderboard (sort by best offer asc)
            state.activeSession.leaderboard = [...state.activeSession.dealers]
                .sort((a, b) => a.currentOffer - b.currentOffer)
                .map((d, i) => ({ ...d, rank: i + 1 }));
        },
        resetReverseBidState() {
            return initialState;
        },
    },
    extraReducers: (builder) => {
        builder
            // search
            .addCase(fetchMockCarsThunk.pending, (state) => {
                state.loading.search = true;
                state.error = null;
            })
            .addCase(fetchMockCarsThunk.fulfilled, (state, action) => {
                state.loading.search = false;
                if (action.payload) {
                    state.searchResults = action.payload.vehicles || [];
                    state.pagination = action.payload.pagination || state.pagination;
                } else {
                    state.searchResults = [];
                }
            })
            .addCase(fetchMockCarsThunk.rejected, (state, action) => {
                state.loading.search = false;
                state.error = action.payload || 'Search failed';
            })
            // start session
            .addCase(startReverseBiddingThunk.pending, (state) => {
                state.loading.session = true;
                state.error = null;
            })
            .addCase(startReverseBiddingThunk.fulfilled, (state, action) => {
                state.loading.session = false;
                const { sessionId, car, dealers, createdAt, expiresAt } = action.payload;
                state.activeSession.id = sessionId;
                state.activeSession.car = car;
                state.activeSession.dealers = dealers;
                state.activeSession.leaderboard = [...dealers]
                    .sort((a, b) => a.currentOffer - b.currentOffer)
                    .map((d, i) => ({ ...d, rank: i + 1 }));
                state.activeSession.status = 'active';
                state.activeSession.createdAt = createdAt;
                state.activeSession.expiresAt = expiresAt;
            })
            .addCase(startReverseBiddingThunk.rejected, (state, action) => {
                state.loading.session = false;
                state.error = action.payload || 'Failed to start session';
            })
            // accept bid
            .addCase(acceptBidThunk.pending, (state) => {
                state.loading.acceptance = true;
                state.error = null;
            })
            .addCase(acceptBidThunk.fulfilled, (state, action) => {
                state.loading.acceptance = false;
                state.activeSession.acceptedBid = action.payload.acceptedBid;
                state.activeSession.certificate = action.payload.certificate;
                state.activeSession.status = 'accepted';
            })
            .addCase(acceptBidThunk.rejected, (state, action) => {
                state.loading.acceptance = false;
                state.error = action.payload || 'Acceptance failed';
            });
    },
});

export const { setFilters, setPage, updateDealerBid, resetReverseBidState } = reverseBidSlice.actions;
export default reverseBidSlice.reducer;


