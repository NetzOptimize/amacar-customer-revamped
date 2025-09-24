import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchPendingOffers, 
  fetchPreviousOffers, 
  fetchLiveAuctions, 
  fetchAcceptedOffers,
  selectPendingOffers,
  selectPreviousOffers,
  selectLiveAuctions,
  selectAcceptedOffers,
  selectOffersLoading,
  selectOffersError
} from '../redux/slices/offersSlice';
import useDebounce from '../hooks/useDebounce';

const SearchContext = createContext();

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

export const SearchProvider = ({ children }) => {
  const dispatch = useDispatch();
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState({
    pendingOffers: [],
    previousOffers: [],
    liveAuctions: [],
    acceptedOffers: []
  });

  // Redux state
  const pendingOffers = useSelector(selectPendingOffers);
  const previousOffers = useSelector(selectPreviousOffers);
  const liveAuctions = useSelector(selectLiveAuctions);
  const acceptedOffers = useSelector(selectAcceptedOffers);
  const loading = useSelector(selectOffersLoading);
  const error = useSelector(selectOffersError);

  // Debounce search query
  const time = Math.random() * 1000;
  const debouncedSearchQuery = useDebounce(searchQuery, time);

  // Helper function to extract car name from different data structures
  const getCarName = (item, type) => {
    switch (type) {
      case 'pendingOffers':
      case 'previousOffers':
      case 'liveAuctions':
        return `${item.year || 'N/A'} ${item.make || 'Unknown'} ${item.model || 'Vehicle'}`;
      case 'acceptedOffers':
        return `${item.year || 'N/A'} ${item.make || 'Unknown'} ${item.model || 'Vehicle'}`;
      default:
        return '';
    }
  };

  // Search function for car names
  const searchInData = useCallback((data, type) => {
    if (!debouncedSearchQuery.trim()) {
      return data;
    }

    const query = debouncedSearchQuery.toLowerCase().trim();
    return data.filter(item => {
      const carName = getCarName(item, type).toLowerCase();
      return carName.includes(query);
    });
  }, [debouncedSearchQuery]);

  // Search functions for each page type
  const searchPendingOffers = useCallback(() => {
    if (!pendingOffers || pendingOffers.length === 0) return [];
    return searchInData(pendingOffers, 'pendingOffers');
  }, [pendingOffers, searchInData]);

  const searchPreviousOffers = useCallback(() => {
    if (!previousOffers || previousOffers.length === 0) return [];
    return searchInData(previousOffers, 'previousOffers');
  }, [previousOffers, searchInData]);

  const searchLiveAuctions = useCallback(() => {
    if (!liveAuctions || liveAuctions.length === 0) return [];
    return searchInData(liveAuctions, 'liveAuctions');
  }, [liveAuctions, searchInData]);

  const searchAcceptedOffers = useCallback(() => {
    if (!acceptedOffers || acceptedOffers.length === 0) return [];
    return searchInData(acceptedOffers, 'acceptedOffers');
  }, [acceptedOffers, searchInData]);

  // Update search results when data or search query changes
  useEffect(() => {
    if (debouncedSearchQuery.trim()) {
      setIsSearching(true);
      
      const results = {
        pendingOffers: searchPendingOffers(),
        previousOffers: searchPreviousOffers(),
        liveAuctions: searchLiveAuctions(),
        acceptedOffers: searchAcceptedOffers()
      };
      
      setSearchResults(results);
      setIsSearching(false);
    } else {
      // If search query is empty, restore all data
      setSearchResults({
        pendingOffers: pendingOffers || [],
        previousOffers: previousOffers || [],
        liveAuctions: liveAuctions || [],
        acceptedOffers: acceptedOffers || []
      });
      setIsSearching(false);
    }
  }, [
    debouncedSearchQuery,
    pendingOffers,
    previousOffers,
    liveAuctions,
    acceptedOffers,
    searchPendingOffers,
    searchPreviousOffers,
    searchLiveAuctions,
    searchAcceptedOffers
  ]);

  // Fetch all data on mount
  useEffect(() => {
    dispatch(fetchPendingOffers());
    dispatch(fetchPreviousOffers());
    dispatch(fetchLiveAuctions());
    dispatch(fetchAcceptedOffers());
  }, [dispatch]);

  // Clear search function
  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults({
      pendingOffers: pendingOffers || [],
      previousOffers: previousOffers || [],
      liveAuctions: liveAuctions || [],
      acceptedOffers: acceptedOffers || []
    });
  }, [pendingOffers, previousOffers, liveAuctions, acceptedOffers]);

  // Get search results for specific page type
  const getSearchResults = useCallback((pageType) => {
    if (!debouncedSearchQuery.trim()) {
      // Return original data if no search query
      switch (pageType) {
        case 'pendingOffers':
          return pendingOffers || [];
        case 'previousOffers':
          return previousOffers || [];
        case 'liveAuctions':
          return liveAuctions || [];
        case 'acceptedOffers':
          return acceptedOffers || [];
        default:
          return [];
      }
    }

    // Return filtered results
    return searchResults[pageType] || [];
  }, [debouncedSearchQuery, searchResults, pendingOffers, previousOffers, liveAuctions, acceptedOffers]);

  // Get search statistics
  const getSearchStats = useCallback(() => {
    if (!debouncedSearchQuery.trim()) {
      return {
        totalResults: (pendingOffers?.length || 0) + 
                     (previousOffers?.length || 0) + 
                     (liveAuctions?.length || 0) + 
                     (acceptedOffers?.length || 0),
        pendingOffers: pendingOffers?.length || 0,
        previousOffers: previousOffers?.length || 0,
        liveAuctions: liveAuctions?.length || 0,
        acceptedOffers: acceptedOffers?.length || 0
      };
    }

    return {
      totalResults: Object.values(searchResults).reduce((sum, results) => sum + results.length, 0),
      pendingOffers: searchResults.pendingOffers.length,
      previousOffers: searchResults.previousOffers.length,
      liveAuctions: searchResults.liveAuctions.length,
      acceptedOffers: searchResults.acceptedOffers.length
    };
  }, [debouncedSearchQuery, searchResults, pendingOffers, previousOffers, liveAuctions, acceptedOffers]);

  const value = {
    // Search state
    searchQuery,
    setSearchQuery,
    isSearching,
    debouncedSearchQuery,
    
    // Search functions
    searchPendingOffers,
    searchPreviousOffers,
    searchLiveAuctions,
    searchAcceptedOffers,
    getSearchResults,
    clearSearch,
    
    // Search results
    searchResults,
    getSearchStats,
    
    // Loading and error states
    loading,
    error
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};

export default SearchContext;
