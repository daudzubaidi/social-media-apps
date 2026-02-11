import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UiState {
  createPostDialogOpen: boolean;
  mobileNavOpen: boolean;
}

const initialState: UiState = {
  createPostDialogOpen: false,
  mobileNavOpen: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setCreatePostDialogOpen(state, action: PayloadAction<boolean>) {
      state.createPostDialogOpen = action.payload;
    },
    setMobileNavOpen(state, action: PayloadAction<boolean>) {
      state.mobileNavOpen = action.payload;
    },
  },
});

export const { setCreatePostDialogOpen, setMobileNavOpen } = uiSlice.actions;
export default uiSlice.reducer;
