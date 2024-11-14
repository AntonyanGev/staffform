import { combineReducers } from '@reduxjs/toolkit';


import service from  "./StaffSlice"
import services  from  "./StaffsSlice"

const reducer = combineReducers({

service,
services

});

export default reducer;
