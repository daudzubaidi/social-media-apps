import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UiState {
  createPostDialogOpen: boolean;
  mobileNavOpen: boolean;
  mobileMenuOpen: boolean;
}

const initialState: UiState = {
  createPostDialogOpen: false,
  mobileNavOpen: false,
  mobileMenuOpen: false,
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
    setMobileMenuOpen(state, action: PayloadAction<boolean>) {
      state.mobileMenuOpen = action.payload;
    },
  },
});

export const { setCreatePostDialogOpen, setMobileNavOpen, setMobileMenuOpen } = uiSlice.actions;
export default uiSlice.reducer;
