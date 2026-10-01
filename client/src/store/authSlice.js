import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../api/apiInstance";

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  accessToken: null,
};

export const fetchProfileThunk = createAsyncThunk(
  "auth/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/users/me");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "FETCHING USER FAILED",
      );
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    finishAuthCheck: (state) => {
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProfileThunk.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload;
        state.accessToken = action.payload.accessToken;
        state.loading = false;
      })
      .addCase(fetchProfileThunk.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export const { finishAuthCheck } = authSlice.actions;
export default authSlice.reducer;
