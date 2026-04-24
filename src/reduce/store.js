import { configureStore } from '@reduxjs/toolkit';
import toastReducer from './slice/toastSlice';
import cartReducer from './slice/cartSlice';

export const store = configureStore({
  reducer: {
    toast: toastReducer,
    cart: cartReducer,
  },
});
