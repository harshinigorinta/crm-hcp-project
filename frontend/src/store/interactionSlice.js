import { createSlice } from '@reduxjs/toolkit';

const interactionSlice = createSlice({
  name: 'interactions',
  initialState: {
    interactions: [],
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setInteractions: (state, action) => {
      state.interactions = action.payload;
    },
    addInteraction: (state, action) => {
      state.interactions.push(action.payload);
    },
    updateInteraction: (state, action) => {
      const index = state.interactions.findIndex(i => i.id === action.payload.id);
      if (index !== -1) {
        state.interactions[index] = action.payload;
      }
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setSuccessMessage: (state, action) => {
      state.successMessage = action.payload;
    },
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
});

export const {
  setLoading,
  setInteractions,
  addInteraction,
  updateInteraction,
  setError,
  setSuccessMessage,
  clearMessages,
} = interactionSlice.actions;

export default interactionSlice.reducer;