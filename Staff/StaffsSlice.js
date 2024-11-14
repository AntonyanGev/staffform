
import { createAsyncThunk, createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit';
import { $api } from '@api/http';
import {  getServicesAll, getStuffURL, servicesOrderURL} from '@api/url';



export const getStuffs = createAsyncThunk('servicesApp/services/getServices', async (_, thunkAPI) => {
  try {
    const response = await $api.get(getStuffURL);
    console.log(response?.data,"this is data getfunction of StaffsSlice")
    return response?.data?.stuff;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});


const staffAdapter = createEntityAdapter({});

export const { selectAll: selectStaffs, selectById: selectServiceById } =
staffAdapter.getSelectors((state) => {
  console.log(state, "this is state of adapter")
  
  return state?.StaffsApp?.services});



const ServicesSlice = createSlice({
  name: 'servicesApp/services',
  initialState: staffAdapter.getInitialState({
    loading:false

  }),

  extraReducers: {
    [getStuffs.pending]: (state, action) => {
      state.loading = false;
    },
    [getStuffs.fulfilled]: (state, action) => {
    staffAdapter.setAll(state, action.payload);
      state.loading=false
    },
    [getStuffs.rejected]: (state, action) => {
      state.loading= false
    },
    
  },
});

export default ServicesSlice.reducer;





