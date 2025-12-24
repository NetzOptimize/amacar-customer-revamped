import { createSlice, createAsyncThunk, nanoid } from '@reduxjs/toolkit';
import api from '../../../lib/apiRev';

// Lightweight mock data generators (detailed mocks in utils/mockData)
const generateSessionId = () => `RB-${Math.random().toString(36).slice(2, 9)}`;

export const fetchFiltersThunk = createAsyncThunk(
    'reverseBid/fetchFilters',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/vehicles/filters');

            if (response.data.success && response.data.data) {
                const data = response.data.data;
                return {
                    makes: data.makes || {},
                    years: data.years || [],
                    priceRange: data.price_range || { min: 0, max: 100000 },
                    extraFeatures: data.extra_features || {},
                };
            }
            return rejectWithValue('Failed to fetch filters');
        } catch (err) {
            console.error('Filters API error:', err);
            return rejectWithValue(err.response?.data?.message || err.message || 'Failed to fetch filters');
        }
    }
);

export const fetchMockCarsThunk = createAsyncThunk(
    'reverseBid/fetchCars',
    async ({ filters, page = 1, perPage = 10 }, { rejectWithValue, getState }) => {
        try {
            // Build query parameters for the API
            const params = {};

            if (filters.make) params.make = filters.make;
            if (filters.model) params.model = filters.model;
            
            // Use min_year and max_year if available, otherwise fall back to year for backward compatibility
            if (filters.yearMin) {
                params.min_year = Number(filters.yearMin);
            }
            if (filters.yearMax) {
                params.max_year = Number(filters.yearMax);
            }
            // Fall back to year if min_year/max_year are not set
            if (!filters.yearMin && !filters.yearMax && filters.year) {
                params.year = typeof filters.year === 'string' ? parseInt(filters.year, 10) : filters.year;
            }

            // Send min_price and max_price directly
            if (filters.budgetMin) {
                params.min_price = Number(filters.budgetMin);
            }
            if (filters.budgetMax) {
                params.max_price = Number(filters.budgetMax);
            }

            // Send condition parameter only if it's 'new' or 'used' (not 'all')
            if (filters.condition && filters.condition !== 'all') {
                params.condition = filters.condition;
            }

            // Get zip_code from filters or user state
            const state = getState();
            const zipCode = filters.zipCode || state.reverseBid.filters.zipCode || '';
            if (zipCode) {
                params.zip_code = zipCode;
            }

            // Add extra filters (from extraFeatures)
            // These are filters like body, transmission, exterior_color, interior_color, etc.
            if (filters.extraFilters && Object.keys(filters.extraFilters).length > 0) {
                Object.entries(filters.extraFilters).forEach(([filterKey, values]) => {
                    // Ensure values is an array and has items
                    const filterValues = Array.isArray(values) ? values : (values ? [values] : []);
                    
                    if (filterValues.length > 0) {
                        // Send as comma-separated string for backend processing
                        // Backend can split this into an array if needed
                        params[filterKey] = filterValues.join(',');
                    }
                });
            }

            // Default radius is 50 (as per API docs)
            params.radius = 500;

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
                const vehicles = vehiclesData.map(vehicle => {
                    // Convert image_url and image_gallery to images array format
                    let images = [];
                    if (vehicle.image_gallery && Array.isArray(vehicle.image_gallery) && vehicle.image_gallery.length > 0) {
                        images = vehicle.image_gallery;
                    } else if (vehicle.image_url) {
                        images = [vehicle.image_url];
                    }

                    return {
                        id: vehicle.id,
                        title: vehicle.title,
                        vin: vehicle.vin,
                        make: vehicle.make,
                        model: vehicle.model,
                        year: vehicle.year,
                        new_used: vehicle.new_used || vehicle.condition,
                        condition: (vehicle.new_used === 'N' || vehicle.condition === 'N') ? 'new' : 'used',
                        price: vehicle.price,
                        basePrice: vehicle.price,
                        zip_code: vehicle.zip_code,
                        city: vehicle.city,
                        state: vehicle.state,
                        owned_by: vehicle.owned_by,
                        is_reverse_biddable: vehicle.is_reverse_biddable,
                        images: images,
                        image_url: vehicle.image_url,
                        image_gallery: vehicle.image_gallery,
                        url: vehicle.url,
                        series: vehicle.series,
                        mileage: vehicle.mileage,
                        odometer: vehicle.odometer,
                        body_type: vehicle.body_type,
                        transmission: vehicle.transmission,
                        trim: vehicle.trim,
                        door_count: vehicle.door_count,
                        drivetrain: vehicle.drivetrain,
                        exterior_color: vehicle.exterior_color,
                        interior_color: vehicle.interior_color,
                        city_mpg: vehicle.city_mpg,
                        highway_mpg: vehicle.highway_mpg,
                        fuel_type: vehicle.fuel_type,
                        certified: vehicle.certified,
                        dealer_contact: vehicle.dealer_contact || null,
                    };
                });

                // Get available filters from API response (dynamic counts based on current search)
                const availableFilters = response.data.data.available_filters || {};

                // Return vehicles, pagination, and available filters
                return { vehicles, pagination, availableFilters };
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
                return { vehicles: [], pagination: { current_page: 1, per_page: 10, total_items: 0, total_pages: 1, has_next: false, has_prev: false } };
            }
            return rejectWithValue(err.response?.data?.message || err.message || 'Failed to fetch vehicles');
        }
    }
);

export const startReverseBiddingThunk = createAsyncThunk(
    'reverseBid/startSession',
    async ({ carData, criteria }, { getState, rejectWithValue }) => {
        try {
            const state = getState();
            const filters = criteria || state.reverseBid.filters;
            const user = state.user?.user;

            // Calculate start and end times
            const startAt = new Date().toISOString();
            const durationHours = 4;
            const endAt = new Date(Date.now() + durationHours * 60 * 60 * 1000).toISOString();

            // Get current datetime for consent timestamps
            const currentDateTime = new Date().toISOString();

            // Build request body matching database structure
            const requestBody = {
                customer_user_id: user?.id || null,
                customer_contact: criteria?.phone || user?.phone || user?.meta?.phone || null,
                primary_vehicle_id: carData.id ? parseInt(carData.id, 10) : null,
                alternative_vehicle_ids: criteria?.selectedAlternatives && criteria.selectedAlternatives.length > 0 
                    ? criteria.selectedAlternatives.map(id => parseInt(id, 10)) 
                    : null,
                start_at: startAt,
                end_at: endAt,
                status: 'running',
                dealer_preference: criteria?.dealerPreference || 'local',
                service_terms_status: criteria?.consent?.terms ? 'accepted' : 'rejected',
                service_terms_accepted_at: criteria?.consent?.terms ? currentDateTime : null,
                privacy_terms_status: criteria?.consent?.privacy ? 'accepted' : 'rejected',
                privacy_terms_accepted_at: criteria?.consent?.privacy ? currentDateTime : null,
                zip_code: criteria?.zipCode || filters.zipCode || carData.zip_code || null,
            };

            // Make API call
            const response = await api.post('/sessions/start', requestBody);

            if (response.data.success && response.data.data) {
                const sessionData = response.data.data;

                // For now, still generate mock dealers until dealer list API is available
                // The API response includes session_id, criteria, eligible_vehicles_count, dealer_count, and end_time
                const { generateMockDealers } = await import('../utils/mockData');
                const dealers = generateMockDealers(carData);

                // Parse end_time to timestamp
                const endTime = sessionData.end_time ? new Date(sessionData.end_time).getTime() : Date.now() + 4 * 60 * 60 * 1000;

                return {
                    sessionId: String(sessionData.session_id),
                    car: carData,
                    dealers,
                    createdAt: Date.now(),
                    expiresAt: endTime,
                    sessionData: {
                        session_id: sessionData.session_id,
                        eligible_vehicles_count: sessionData.eligible_vehicles_count,
                        dealer_count: sessionData.dealer_count,
                        end_time: sessionData.end_time,
                    },
                };
            } else {
                return rejectWithValue(response.data.message || 'Failed to start session');
            }
        } catch (err) {
            console.error('Start session API error:', err);
            return rejectWithValue(err.response?.data?.message || err.message || 'Failed to start session');
        }
    }
);

export const fetchSessionDetailsThunk = createAsyncThunk(
    'reverseBid/fetchSessionDetails',
    async (sessionId, { rejectWithValue }) => {
        try {
            const response = await api.get(`/sessions/${sessionId}`);

            if (response.data.success && response.data.data) {
                const sessionData = response.data.data;

                // Map API response to match component expectations
                const leaderboard = (sessionData.leaderboard || []).map((bid, index) => ({
                    id: bid.bid_id,
                    dealerId: bid.dealer_id,
                    dealerName: bid.dealer_name,
                    currentOffer: bid.amount,
                    perks: bid.perks || {},
                    rank: bid.position || index + 1,
                    distance: bid.distance || 0,
                    location: bid.distance ? `${bid.distance} miles away` : 'Location unavailable',
                    // Calculate savings (will need base price from session criteria)
                    savings: 0, // Will be calculated if base price is available
                }));

                return {
                    sessionId: String(sessionData.id),
                    status: sessionData.status || 'running',
                    criteria: sessionData.criteria || {},
                    startAt: sessionData.start_at,
                    endAt: sessionData.end_at,
                    timeRemaining: sessionData.time_remaining || { seconds: 0, formatted: '00:00:00' },
                    leaderboard,
                    totalBids: sessionData.total_bids || 0,
                    winningBidId: sessionData.winning_bid_id || null,
                };
            }
            return rejectWithValue('Failed to fetch session details');
        } catch (err) {
            console.error('Fetch session details API error:', err);
            return rejectWithValue(err.response?.data?.message || err.message || 'Failed to fetch session details');
        }
    }
);

export const fetchLeaderboardThunk = createAsyncThunk(
    'reverseBid/fetchLeaderboard',
    async (sessionId, { rejectWithValue }) => {
        try {
            const response = await api.get(`/sessions/${sessionId}/leaderboard`);

            if (response.data.success && response.data.data) {
                const leaderboardData = response.data.data;

                // Map API response to match component expectations
                const leaderboard = (leaderboardData.leaderboard || []).map((bid, index) => ({
                    id: bid.bid_id,
                    dealerId: bid.dealer_id,
                    dealerName: bid.dealer_name,
                    currentOffer: bid.amount,
                    perks: bid.perks || {},
                    rank: bid.position || index + 1,
                    distance: bid.distance || 0,
                    location: bid.distance ? `${bid.distance} miles away` : 'Location unavailable',
                    savings: 0, // Will be calculated if base price is available
                }));

                return {
                    leaderboard,
                    totalBids: leaderboardData.total_bids || 0,
                };
            }
            return rejectWithValue('Failed to fetch leaderboard');
        } catch (err) {
            console.error('Fetch leaderboard API error:', err);
            return rejectWithValue(err.response?.data?.message || err.message || 'Failed to fetch leaderboard');
        }
    }
);

export const fetchCustomerSessionsThunk = createAsyncThunk(
    'reverseBid/fetchCustomerSessions',
    async ({ status, page = 1, per_page = 10 }, { rejectWithValue }) => {
        try {
            const params = { page, per_page };
            if (status) {
                params.status = status;
            }

            const response = await api.get('/customer/sessions', { params });

            if (response.data.success && response.data.data) {
                const data = response.data.data;
                return {
                    sessions: data.data || [],
                    pagination: data.pagination || {
                        current_page: page,
                        per_page: per_page,
                        total_items: 0,
                        total_pages: 1,
                        has_next: false,
                        has_prev: false,
                    },
                };
            }
            return rejectWithValue('Failed to fetch customer sessions');
        } catch (err) {
            console.error('Fetch customer sessions API error:', err);
            return rejectWithValue(err.response?.data?.message || err.message || 'Failed to fetch customer sessions');
        }
    }
);

export const acceptBidThunk = createAsyncThunk(
    'reverseBid/acceptBid',
    async ({ sessionId, bidId, bidData }, { rejectWithValue }) => {
        try {
            // Make API call to accept the bid
            const response = await api.post(`/sessions/${sessionId}/accept`, {
                bid_id: bidId,
            });

            if (response.data.success && response.data.data) {
                const apiData = response.data.data;
                const certificateData = apiData.certificate_data || {};

                // Use bidData passed from component, or construct from API response
                const acceptedBid = bidData || {
                    id: apiData.bid_id,
                    dealerId: certificateData.dealer?.id,
                    dealerName: certificateData.dealer?.name,
                    dealerEmail: certificateData.dealer?.email,
                    currentOffer: certificateData.bid_amount || apiData.bid_id,
                    perks: certificateData.perks || {},
                };

                const certificate = {
                    id: certificateData.certificate_id || apiData.certificate_id,
                    sessionId: certificateData.session_id || apiData.session_id,
                    bidId: certificateData.bid_id || apiData.bid_id,
                    dealerId: certificateData.dealer?.id,
                    dealerName: certificateData.dealer?.name,
                    dealerEmail: certificateData.dealer?.email,
                    customerId: certificateData.customer?.id,
                    customerName: certificateData.customer?.name,
                    customerEmail: certificateData.customer?.email,
                    vehicle: certificateData.vehicle || {},
                    bidAmount: certificateData.bid_amount,
                    perks: certificateData.perks || {},
                    issuedAt: certificateData.issued_at,
                    validUntil: certificateData.valid_until,
                    acceptedAt: certificateData.issued_at ? new Date(certificateData.issued_at).getTime() : Date.now(),
                    finalPrice: certificateData.bid_amount || acceptedBid.currentOffer,
                };

                return {
                    acceptedBid,
                    certificate,
                    certificateData: certificateData, // Store full API response
                };
            } else {
                return rejectWithValue(response.data.message || 'Failed to accept bid');
            }
        } catch (err) {
            console.error('Accept bid API error:', err);
            return rejectWithValue(err.response?.data?.message || err.message || 'Failed to accept bid');
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

// Fetch reverse bids (active sessions without accepted bids)
export const fetchReverseBidsThunk = createAsyncThunk(
    'reverseBid/fetchReverseBids',
    async ({ page = 1, per_page = 10 }, { rejectWithValue }) => {
        try {
            const response = await api.get('/customer/dashboard/reverse-bids', {
                params: { page, per_page }
            });

            if (response.data.success && response.data.data) {
                return {
                    bids: response.data.data.data || [],
                    pagination: response.data.data.pagination || {}
                };
            }
            return rejectWithValue('Failed to fetch reverse bids');
        } catch (err) {
            console.error('Reverse bids API error:', err);
            return rejectWithValue(err.response?.data?.message || err.message || 'Failed to fetch reverse bids');
        }
    }
);

// Fetch accepted reverse bids
export const fetchAcceptedReverseBidsThunk = createAsyncThunk(
    'reverseBid/fetchAcceptedReverseBids',
    async ({ page = 1, per_page = 10 }, { rejectWithValue }) => {
        try {
            const response = await api.get('/customer/dashboard/accepted-reverse-bids', {
                params: { page, per_page }
            });

            if (response.data.success && response.data.data) {
                return {
                    bids: response.data.data.data || [],
                    pagination: response.data.data.pagination || {}
                };
            }
            return rejectWithValue('Failed to fetch accepted reverse bids');
        } catch (err) {
            console.error('Accepted reverse bids API error:', err);
            return rejectWithValue(err.response?.data?.message || err.message || 'Failed to fetch accepted reverse bids');
        }
    }
);

const initialState = {
    filters: {
        year: null,
        yearMin: null,
        yearMax: null,
        make: null,
        model: null,
        budgetMin: null,
        budgetMax: null,
        condition: 'all',
        zipCode: '',
        extraFilters: {}, // Store extra filter selections like { body: ['SUV', 'Sedan'], exterior_color: ['Black'], etc. }
    },
    filterOptions: {
        makes: {},
        years: [],
        priceRange: { min: 0, max: 100000 },
        extraFeatures: {}, // Initial filters from /vehicles/filters endpoint
        availableFilters: {}, // Dynamic filters with counts from search results
        loading: false,
        error: null,
    },
    searchResults: [],
    pagination: {
        current_page: 1,
        per_page: 10,
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
        certificateData: null,
        appointment: null,
        createdAt: null,
        expiresAt: null,
        criteria: null,
        timeRemaining: null,
        totalBids: 0,
        winningBidId: null,
    },
    loading: { search: false, session: false, acceptance: false, customerSessions: false, reverseBids: false, acceptedReverseBids: false },
    error: null,
    pastSessions: [],
    customerSessions: {
        data: [],
        pagination: {
            current_page: 1,
            per_page: 10,
            total_items: 0,
            total_pages: 1,
            has_next: false,
            has_prev: false,
        },
    },
    reverseBids: {
        data: [],
        pagination: {
            current_page: 1,
            per_page: 10,
            total_items: 0,
            total_pages: 1,
            has_next: false,
            has_prev: false,
        },
    },
    acceptedReverseBids: {
        data: [],
        pagination: {
            current_page: 1,
            per_page: 10,
            total_items: 0,
            total_pages: 1,
            has_next: false,
            has_prev: false,
        },
    },
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
            // fetch filters
            .addCase(fetchFiltersThunk.pending, (state) => {
                state.filterOptions.loading = true;
                state.filterOptions.error = null;
            })
            .addCase(fetchFiltersThunk.fulfilled, (state, action) => {
                state.filterOptions.loading = false;
                if (action.payload) {
                    state.filterOptions.makes = action.payload.makes || {};
                    state.filterOptions.years = action.payload.years || [];
                    state.filterOptions.priceRange = action.payload.priceRange || { min: 0, max: 100000 };
                    state.filterOptions.extraFeatures = action.payload.extraFeatures || {};
                }
            })
            .addCase(fetchFiltersThunk.rejected, (state, action) => {
                state.filterOptions.loading = false;
                state.filterOptions.error = action.payload || 'Failed to fetch filters';
            })
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
                    // Update available filters with dynamic counts from search results
                    if (action.payload.availableFilters) {
                        state.filterOptions.availableFilters = action.payload.availableFilters;
                    }
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
                if (action.payload) {
                    state.activeSession.acceptedBid = action.payload.acceptedBid;
                    state.activeSession.certificate = action.payload.certificate;
                    state.activeSession.status = 'accepted';

                    // Store full certificate data if provided
                    if (action.payload.certificateData) {
                        state.activeSession.certificateData = action.payload.certificateData;
                    }
                }
            })
            .addCase(acceptBidThunk.rejected, (state, action) => {
                state.loading.acceptance = false;
                state.error = action.payload || 'Acceptance failed';
            })
            // fetch session details
            .addCase(fetchSessionDetailsThunk.pending, (state) => {
                state.loading.session = true;
                state.error = null;
            })
            .addCase(fetchSessionDetailsThunk.fulfilled, (state, action) => {
                state.loading.session = false;
                if (action.payload) {
                    const { sessionId, status, criteria, startAt, endAt, timeRemaining, leaderboard, totalBids, winningBidId } = action.payload;

                    // Update active session
                    state.activeSession.id = sessionId;
                    state.activeSession.status = status;
                    state.activeSession.criteria = criteria;
                    state.activeSession.totalBids = totalBids;
                    state.activeSession.winningBidId = winningBidId;
                    state.activeSession.leaderboard = leaderboard;

                    // If car data doesn't exist, create it from criteria
                    if (!state.activeSession.car && criteria) {
                        state.activeSession.car = {
                            make: criteria.make,
                            model: criteria.model,
                            year: criteria.year,
                            price: criteria.price,
                            images: [],
                        };
                    }

                    // Calculate savings if we have base price
                    if (criteria?.price && leaderboard.length > 0) {
                        state.activeSession.leaderboard = leaderboard.map(bid => ({
                            ...bid,
                            savings: criteria.price - bid.currentOffer,
                        }));
                    }

                    // Update timestamps
                    if (startAt) {
                        state.activeSession.createdAt = new Date(startAt).getTime();
                    }
                    if (endAt) {
                        state.activeSession.expiresAt = new Date(endAt).getTime();
                    }

                    // Update time remaining from API
                    if (timeRemaining?.seconds !== undefined) {
                        state.activeSession.timeRemaining = timeRemaining.seconds;
                    }
                }
            })
            .addCase(fetchSessionDetailsThunk.rejected, (state, action) => {
                state.loading.session = false;
                state.error = action.payload || 'Failed to fetch session details';
            })
            // fetch leaderboard
            .addCase(fetchLeaderboardThunk.pending, (state) => {
                state.loading.session = true;
            })
            .addCase(fetchLeaderboardThunk.fulfilled, (state, action) => {
                state.loading.session = false;
                if (action.payload) {
                    const { leaderboard } = action.payload;

                    // Calculate savings if we have base price from criteria
                    const criteria = state.activeSession.criteria || (state.activeSession.car ? { price: state.activeSession.car.price } : null);
                    const basePrice = criteria?.price || state.activeSession.car?.price;

                    if (basePrice && leaderboard.length > 0) {
                        state.activeSession.leaderboard = leaderboard.map(bid => ({
                            ...bid,
                            savings: basePrice - bid.currentOffer,
                        }));
                    } else {
                        state.activeSession.leaderboard = leaderboard;
                    }

                    // Update total bids if provided
                    if (action.payload.totalBids !== undefined) {
                        state.activeSession.totalBids = action.payload.totalBids;
                    }
                }
            })
            .addCase(fetchLeaderboardThunk.rejected, (state, action) => {
                state.loading.session = false;
                state.error = action.payload || 'Failed to fetch leaderboard';
            })
            // fetch customer sessions
            .addCase(fetchCustomerSessionsThunk.pending, (state) => {
                state.loading.customerSessions = true;
                state.error = null;
            })
            .addCase(fetchCustomerSessionsThunk.fulfilled, (state, action) => {
                state.loading.customerSessions = false;
                if (action.payload) {
                    state.customerSessions.data = action.payload.sessions;
                    state.customerSessions.pagination = action.payload.pagination;
                }
            })
            .addCase(fetchCustomerSessionsThunk.rejected, (state, action) => {
                state.loading.customerSessions = false;
                state.error = action.payload || 'Failed to fetch customer sessions';
            })
            // fetch reverse bids
            .addCase(fetchReverseBidsThunk.pending, (state) => {
                state.loading.reverseBids = true;
                state.error = null;
            })
            .addCase(fetchReverseBidsThunk.fulfilled, (state, action) => {
                state.loading.reverseBids = false;
                if (action.payload) {
                    state.reverseBids.data = action.payload.bids;
                    state.reverseBids.pagination = action.payload.pagination;
                }
            })
            .addCase(fetchReverseBidsThunk.rejected, (state, action) => {
                state.loading.reverseBids = false;
                state.error = action.payload || 'Failed to fetch reverse bids';
            })
            // fetch accepted reverse bids
            .addCase(fetchAcceptedReverseBidsThunk.pending, (state) => {
                state.loading.acceptedReverseBids = true;
                state.error = null;
            })
            .addCase(fetchAcceptedReverseBidsThunk.fulfilled, (state, action) => {
                state.loading.acceptedReverseBids = false;
                if (action.payload) {
                    state.acceptedReverseBids.data = action.payload.bids;
                    state.acceptedReverseBids.pagination = action.payload.pagination;
                }
            })
            .addCase(fetchAcceptedReverseBidsThunk.rejected, (state, action) => {
                state.loading.acceptedReverseBids = false;
                state.error = action.payload || 'Failed to fetch accepted reverse bids';
            });
    },
});

export const { setFilters, setPage, updateDealerBid, resetReverseBidState } = reverseBidSlice.actions;
export default reverseBidSlice.reducer;


