import { configureStore } from '@reduxjs/toolkit';
import AuthSlice from './AuthSlice';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';


const persistConfig = {
  key: 'root',
  storage,
  //whitelist: ['Auth'], // Persist only the Auth slice
};

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, AuthSlice);

// Configure the store
export const store = configureStore({
  reducer: {
    Auth: persistedReducer, // Use the persisted reducer
  },
  
});

// Create the persistor
export const persistor = persistStore(store);