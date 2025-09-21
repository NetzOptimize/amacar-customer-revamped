// redux/persistConfig.js
import storage from 'redux-persist/lib/storage'; // localStorage

export const carPersistConfig = {
  key: 'car',                // storage key prefix
  storage,
  whitelist: ['userExists', 'userInfo', 'carDetails', 'vehicleDetails', 'questions', 'stateZip', 'stateVin', 'productId', 'uploadedImages', 'offer', 'carSummary', 'isAuctionable', 'emailSent', 'timestamp', 'location'] // keys INSIDE carDetailsAndQuestions slice to persist
};

export const userPersistConfig = {
  key: 'user',               // storage key prefix
  storage,
  whitelist: ['user', 'status'] // persist user data and status
};