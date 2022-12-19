import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentUser(state, action) {
      // console.log('action', action.payload);
      return { ...state, user: action.payload };
    },
  },
});

// Action creators are generated for each case reducer function
export const { setCurrentUser } = userSlice.actions;
export const currentUser = (state) => state.user.user;
export default userSlice.reducer;
