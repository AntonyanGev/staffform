
import { notifyError , notifySuccess } from '@helpers/toast';   
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import history  from "@history"
import { $api } from '@api/http';

import {    addStuffURL,  deleteStuffURL,   editStuffURL,  getStuffByIdURL, getStuffURL, orderStuffURL,serviceIsPubleshed,  } from '@api/url';

import StaffModel from './StaffModel';




export const getStaffs21 = createAsyncThunk('service/getById', async (id, thunkAPI) => {
  try {
    const response = await $api.get(`${getStuffByIdURL }/${+id}`);
console.log( response?.data, "i have already got service it byiD")
    return response?.data?.service;
  } catch (err) {
    history.push({pathname:`/view/staff/staff ` })
    return null
  }
});

export const getStaffs2 = createAsyncThunk('service/getServicess', async (id, thunkAPI) => {
  console.log(id,"this is data8888")
  try {
    const response = await $api.get(getStuffURL);
    console.log(response,"response77777")
    return response?.data?.stuff.find((val) => val.id === +id);
    } catch (error) {
      history.push({ pathname: `/view/staff/staff ` });
      return null;
    }
});

export const addStaff = createAsyncThunk('staff/add', async (data, thunkAPI) => {
try {
    const fd = new FormData();
    // fd.append.apply("text",JSON.stringify (createEditorDataForDB(data?.text)));
    fd.append('title', JSON.stringify(data?.title));
    fd.append('image_id', data?.image_id || 0);
    fd.append( 'category_id',data.category.id )     
    fd.append( 'role_id', data.role.id )
    fd.append('phone',data.phone)
    fd.append('email',data.email)

    const response = await $api.post(addStuffURL, fd);
    return response.data.message
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
  });

export const updateStaffs = createAsyncThunk('staff/edit', async (data, thunkAPI) => {
  try {
    const fd = new FormData();
    fd.append('id', data.id);
     fd.append('title', JSON.stringify(data?.title));
    fd.append('image_id', data?.image_id || 0);
    fd.append( 'category_id',data.category.id )     
    fd.append( 'role_id', data.role.id )
    fd.append('phone',data.phone)
    fd.append('email',data.email)
    const response = await $api.post(editStuffURL, fd);
    return response?.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});




export const removeStaffs = createAsyncThunk('staff/delete', async (id, thunkAPI) => {
  try {
    const response = await $api.delete(`${deleteStuffURL}/${+id}`);
    return {
      id,
      message: response?.data?.message,
    };
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});


export const changeOrderServices = createAsyncThunk(
  'service/changeOrderServices',
  async (array, thunkApi) => {
    try {
      const fd = new FormData();
      fd.append('items', JSON.stringify(array));
      await $api.post(orderStuffURL, fd);
      return 'Orders are successfully changed';
    } catch (err) {
      return thunkApi.rejectWithValue(err.message);
    }
  }
);


export const editServicesStatus = createAsyncThunk(
  'service/editServicesStatus',
  async (item, { dispatch, getState }) => {
    const fd = new FormData();
    fd.append('id', item.id);
    fd.append('is_published', item.is_published ? 0 : 1);

    const response = await $api.post(serviceIsPubleshed, fd);

    const data = await response.data.message;

    return data;
  }
);


const ServiceSlice = createSlice({
  name: 'service',
  initialState:null,
 
  reducers: {
    newStaffs: (state, action) => StaffModel(),  /* StaffModel */
    resetStaffs: () => null,
  },
  extraReducers: {
    
    [getStaffs2.pending]: (state, action) => null,
    [getStaffs2.fulfilled]: (state, action) => action.payload,

    [addStaff.fulfilled]: (state, action) => {
      state.error = '';
      notifySuccess(action.payload);
    },
    [addStaff.rejected]: (state, action) => {
      state.error = action.payload;
      notifyError(action.payload);
    },
     [changeOrderServices.fulfilled]: (state, action) => notifySuccess(action.payload),
       [updateStaffs .fulfilled]: (state, action) => notifySuccess(action.payload)
    ,
    [updateStaffs .rejected]: (state, action) => {
      state.error = action.payload;
      notifyError(action.payload);
    },

    [removeStaffs.fulfilled]: (state, action) => {
      state.error = '';
      notifySuccess(action.payload.message);
    },
    [removeStaffs.rejected]: (state, action) => {
      state.error = action.payload;
      notifyError(action.payload);
    },
     [editServicesStatus.fulfilled]: (state, action) => notifySuccess(action.payload),
  },
});

export const { resetStaffs, newStaffs  } = ServiceSlice.actions;


export const selectStaff= ({StaffsApp}) => StaffsApp?.service;  /* .item */


export default ServiceSlice.reducer;














// import { notifyError , notifySuccess } from '@helpers/toast';   
// import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// import history  from "@history"
// import { $api } from '@api/http';

// import {  addServicesURL,  addStuffURL,  deleteStuffURL,  editServiceURL, editStuffURL, getServiceById, getServicesAll, getStuffByIdURL, getStuffURL, orderStuffURL, serviceDeleteURL, serviceIsPubleshed, servicesOrderURL } from '@api/url';
// import createEditorDataForDB from '@helpers/createEditorDataForDB';
// import ServicesModel from './StaffModel';


// export const getServicesById = createAsyncThunk('staff/getById', async (id, thunkAPI) => {
//   try {
//     const response = await $api.get(`${getStuffByIdURL }/${id}`);
// console.log( response?.data, "i have already got service it byiD")
//     return response?.data?.service;
//   } catch (err) {
//     history.push({pathname:`/view/staff/staff ` })
//     return null
//   }
// });

// export const getStaffs2 = createAsyncThunk('staff/getServicess', async (id, thunkAPI) => {
//   console.log(id,"this is data8888")
//   try {
//     const response = await $api.get(getStuffURL);
//     console.log(response.data,"response77777")
//     return response?.data?.stuff.find((val) => val.id === +id);
//     } catch (error) {
//       history.push({ pathname: `/view/staff/staff ` });
//       return null;
//     }
// });

// export const addStaff = createAsyncThunk('staff/add', async (data, thunkAPI) => {
// try {
//     const fd = new FormData();
//     // fd.append.apply("text",JSON.stringify (createEditorDataForDB(data?.text)));
//     fd.append('title', JSON.stringify(data?.title));
//     fd.append('image_id', data?.image_id || 0);
//     fd.append( 'category_id',data.category.id )     
//     fd.append( 'role_id', data.role.id )
//     fd.append('phone',data.phone)
//     fd.append('email',data.email)

//     const response = await $api.post(addStuffURL, fd);
//     return response.data.message
//   } catch (err) {
//     return thunkAPI.rejectWithValue(err.message);
//   }
//   });

// export const updateStaffs = createAsyncThunk('staff/edit', async (data, thunkAPI) => {
//   try {
//     const fd = new FormData();
//     fd.append('id', data.id);
//     if(data.icon_id){
//    fd.append('icon_id', data.icon_id);
//     }
//       if(data.title){
//  fd.append('title', JSON.stringify(data.title));
//     }
//      if(data.long_description){
//  fd.append('long_description', JSON.stringify (data.long_description));
//     } 
//     const response = await $api.post(editStuffURL, fd);
//     return response?.data;
//   } catch (err) {
//     return thunkAPI.rejectWithValue(err.message);
//   }
// });



// export const removeStaffs = createAsyncThunk('staff/delete', async (id, thunkAPI) => {
//   try {
//     const response = await $api.delete(`${deleteStuffURL}/${+id}`);
//     return {
//       id,
//       message: response?.data?.message,
//     };
//   } catch (err) {
//     return thunkAPI.rejectWithValue(err.message);
//   }
// });

// // export const selectService= ({ ServiceApp }) => ServiceApp?.service;

// export const changeOrderServices = createAsyncThunk(
//   'service/changeOrderServices',
//   async (array, thunkApi) => {
//     try {
//       const fd = new FormData();
//       fd.append('items', JSON.stringify(array));
//       await $api.post(orderStuffURL, fd);
//       return 'Orders are successfully changed';
//     } catch (err) {
//       return thunkApi.rejectWithValue(err.message);
//     }
//   }
// );


// export const editServicesStatus = createAsyncThunk(
//   'service/editServicesStatus',
//   async (item, { dispatch, getState }) => {
//     const fd = new FormData();
//     fd.append('id', item.id);
//     fd.append('is_published', item.is_published ? 0 : 1);

//     const response = await $api.post(serviceIsPubleshed, fd);

//     const data = await response.data.message;

//     return data;
//   }
// );


// const ServiceSlice = createSlice({
//   name: 'staff',
//   initialState:null,
//   //  {
//   //   loading: false,
//   //   error: '',
//   //   item: null,
//   // },
//   reducers: {

//     // newServices: (state) => ({
//     //   ...state,
//     //   item: ServicesModel(),
//     // }),
//     newStaffs: (state, action) => ServicesModel(),  /* StaffModel */
//     resetStaffs: () => null,
//   },
//   extraReducers: {
//     [getServicesById.pending]: (state, action) => {
//       state.loading = true;
//     },
//     [getServicesById.fulfilled]: (state, action) => {
//       state.error = '';
//       state.item = action.payload;
//       state.loading = false;
//     },
//     [getServicesById.rejected]: (state, action) => {
//       state.error = action.payload;
//       state.loading = false;
//     },
//     [getStaffs2.pending]: (state, action) => null,
//     [getStaffs2.fulfilled]: (state, action) => action.payload,

//     [addStaff.fulfilled]: (state, action) => {
//       state.error = '';
//       notifySuccess(action.payload);
//     },
//     [addStaff.rejected]: (state, action) => {
//       state.error = action.payload;
//       notifyError(action.payload);
//     },
//      [changeOrderServices.fulfilled]: (state, action) => notifySuccess(action.payload),
//        [updateStaffs.fulfilled]: (state, action) => notifySuccess(action.payload)
//     ,
//     [updateStaffs.rejected]: (state, action) => {
//       state.error = action.payload;
//       notifyError(action.payload);
//     },

//     [removeStaffs.fulfilled]: (state, action) => {
//       state.error = '';
//       notifySuccess(action.payload.message);
//     },
//     [removeStaffs.rejected]: (state, action) => {
//       state.error = action.payload;
//       notifyError(action.payload);
//     },
//      [editServicesStatus.fulfilled]: (state, action) => notifySuccess(action.payload),
//   },
// });

// export const { resetStaffs, newStaffs } = ServiceSlice.actions;


// export const selectStaff= ({StaffsApp}) => StaffsApp?.service;


// export default ServiceSlice.reducer;













