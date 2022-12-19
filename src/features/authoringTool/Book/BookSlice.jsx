import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentBook: null,
};
export const bookSlice = createSlice({
  name: 'book',
  initialState,
  reducers: {
    setCurrentBook(state, action) {
      return {
        ...state,
        currentBook: action.payload,
      };
    },
  },
});

export const { setCurrentBook } = bookSlice.actions;
export const currentBook = (state) => state.book.currentBook;
export default bookSlice.reducer;
