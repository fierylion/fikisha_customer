import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import requestSlice from './requestSlice'

const store = configureStore({
 reducer: {auth:authReducer, request:requestSlice}
})
export { store }
