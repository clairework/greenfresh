import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const baseUrl = process.env.REACT_APP_API_URL;
const apiPath = process.env.REACT_APP_API_PATH;

// 1. 定義非同步動作：取得購物車內容
export const getCart = createAsyncThunk(
  'cart/getCart',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${baseUrl}/v2/api/${apiPath}/cart`);
      // 回傳 API 的 data 欄位 (內含 carts, total, final_total)
      return res.data.data; 
    } catch (error) {
      // 如果失敗，回傳錯誤訊息
      return rejectWithValue(error.response?.data?.message || '取得購物車失敗');
    }
  }
);

const initialState = {
  carts: [],
  total: 0,
  final_total: 0,
  loading: false, // 選填：可用來跑載入動畫
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    updateCartData(state, action) {
      const { carts, total, final_total } = action.payload;
      state.carts = carts;
      state.total = total;
      state.final_total = final_total;
    },
    clearCartData(state) {
      state.carts = [];
      state.total = 0;
      state.final_total = 0;
    },
  },
  // 2. 使用 extraReducers 處理 getCart 的結果
  extraReducers: (builder) => {
    builder
      .addCase(getCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCart.fulfilled, (state, action) => {
        const { carts, total, final_total } = action.payload;
        state.carts = carts;
        state.total = total;
        state.final_total = final_total;
        state.loading = false;
      })
      .addCase(getCart.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { updateCartData, clearCartData } = cartSlice.actions;
export default cartSlice.reducer;