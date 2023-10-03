import { createSlice, nanoid } from "@reduxjs/toolkit";
import AsyncStorage from '@react-native-async-storage/async-storage'
const initialState = {
 user_data: {
  token: '',
  customer:{
    id:'',
    email:'',
    created_at:'',
    category:''
  },
  status:''

 },
 auth_message: null,
};


//USER DATA FORMAT
/* 
{
 token,
 status,
 customer: {
  id, email, created_at, category
 }
}

*/
const authSlice = createSlice({
 name: "auth",
 initialState,
 reducers: {
  storeAuthData: (state, action) => {
    const {data, type} = action.payload;
    switch(type){
      case 'DATA':
        state.user_data = data
      case 'ERROR':
        state.auth_message = data
    }
  },
  clearAuthData: (state, action)=>{
    state.user_data='NOT REGISTERED';

  },
  retrieveAuthData: (state, action) => {
  
   getUserData()

  },
 },
});
export const { storeAuthData, retrieveAuthData, clearAuthData} = authSlice.actions;
export default authSlice.reducer;