import { createSlice, nanoid } from '@reduxjs/toolkit'
import AsyncStorage from '@react-native-async-storage/async-storage'
const initialState = {
  error: '',
  category: '',
  senderInformation: {
    name: '',
    phone: '',
    location: {
      latitude: 0,
      longitude: 0,
      geocode:'',
      latitudeDelta: 0.003,
      longitudeDelta: 0.003,
    },
    extra: '',
  },
  receiverInformation: {
    name: '',
    phone: '',
    location: {
      latitude: 0,
      longitude: 0,
      geocode:'',
      latitudeDelta: 0.003,
      longitudeDelta: 0.003,
    },
    extra: '',
  },
}

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
const requestSlice = createSlice({
  name: 'request',
  initialState,
  reducers: {
    
    modifyData: (state, action) => {
      const { data, type } = action.payload
      
      
      switch (type) {
        case 'CATEGORY':
          state.category = data
          break
        
        case 'ERROR':
          state.error = data
          break
        case 'SENDER_GEOCODE':
          state.senderInformation.location.geocode = data
          break
        case 'RECEIVER_GEOCODE':
          state.receiverInformation.location.geocode = data
          break
        
        case 'SENDER_PHONE':
          state.senderInformation.phone = data
          break
        case 'SENDER_NAME':
         state.senderInformation.name = data
         break
        case 'SENDER_LOCATION':
          
         state.senderInformation.location = data
         break
        case 'SENDER_EXTRA':
          state.senderInformation.extra = data
          break
        case 'RECEIVER_PHONE':
         state.receiverInformation.phone= data
         break
        case 'RECEIVER_NAME':
         state.receiverInformation.name= data
         break
        case 'RECEIVER_LOCATION':
         state.receiverInformation.location= data
         break
        case 'RECEIVER_EXTRA':
          state.receiverInformation.extra = data
          break
         default:
          throw Error('No Such State! Please recheck your states!')
      }
    },

  },
})
export const { modifyData } =
  requestSlice.actions
export default requestSlice.reducer
