import { createSlice } from "@reduxjs/toolkit";
initialState = {
 pending: [],
 delivered: [],
};
const orderSlice = createSlice({
 name: "order",
 initialState,
 reducers: {
  addDeliveries: (state, action) => {
   const { type, data } = action.payload;
   data.sort(
    (a, b) =>
     new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
   );
   if(type === 'ADD_PENDING'){
    data.sort(
      (a, b)=>{
        if(a.status === 'accepted'){
          return -1
        }else{
          return 1
        }
      }
    )
   }
   
   switch (type) {
    case "ADD_PENDING":
     state.pending = data;
     break
    case "ADD_DELIVERED":
     state.delivered = data;
     break
    default:
     throw new Error('no such case')
   }
  },
 },
});
export const { addDeliveries } = orderSlice.actions;
export default orderSlice.reducer;