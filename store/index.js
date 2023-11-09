import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import requestSlice from './requestSlice'
import orderSlice from './orderSlice'

const store = configureStore({
 reducer: {auth:authReducer, request:requestSlice, order:orderSlice}
})
export { store }
