import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  organization: null,
};

export const organizationSlice = createSlice({
  name: 'organization',
  initialState,
  reducers: {
    setOrganization(state, action) {
      // console.log('action', action.payload);
      return { ...state, organization: action.payload };
    },
  },
});

// Action creators are generated for each case reducer function
export const { setOrganization } = organizationSlice.actions;
export const currentOrganization = (state) => state.organization.organization;
export default organizationSlice.reducer;
