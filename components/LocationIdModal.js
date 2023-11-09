import { View, Text, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native'
import React,{useEffect, useState
} from 'react'
import * as Location from 'expo-location'
import * as Icon from 'react-native-feather'
import useObtainGeocode from '../hooks/useObtainGeocode'
import { useSelector } from 'react-redux'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../api'
import Toast from 'react-native-toast-message'

const LocationIdModal = ({setShowModal}) => {
 const [endIntro, setEndIntro] = useState(false)

  return (
    <View className=' m-auto bg-custom_white-500'>
      <View className='  h-96  w-full rounded-lg  relative '>
        
          <Icon.X
            className='text-custom_blue-200 absolute top-2 right-2'
            width={30}
            height={30}
            onPress={() => setShowModal(false)}
          />
      

        <View className='mt-5 h-full pt-2 rounded-t-2xl  px-2'>
          {endIntro ? (
            <SetLocation setShowModal={setShowModal} />
          ) : (
            <Introduction setEndIntro={setEndIntro} />
          )}
        </View>
      </View>
    </View>
  )
}
const Introduction=({setEndIntro})=>{
 useEffect(
  ()=>{

  }, []
 )
 return (
   <View>
     <Text className='font-sanBold_700 mt-10'>Getting Started (3 Steps)</Text>
     <View className='mx-3 space-y-4'>
       <Text className='font-sanRegular_500 mb-2 mt-4  text-lg +'>
         1. Create Location ID for deliveries.
       </Text>
       <Text className='font-sanRegular_500 mb-2 text-lg  '>
         2. Share with friends or customers.
       </Text>
       <Text
         className='mb-2 font-sanRegular_500 text-lg 
       '
       >
         3. Easily get deliveries to your location.
       </Text>
     </View>
     <View className='self-center mt-2'>
       <TouchableOpacity
         className='flex flex-row p-3 rounded bg-custom_blue-200  w-24'
         onPress={() => setEndIntro(true)}
       >
         <Text className='text-center text-custom_white-400 '>Continue</Text>
         <Icon.ArrowRight className='text-custom_white-400 mr-2' />
       </TouchableOpacity>
     </View>
   </View>
 )
}
const SetLocation = ({setShowModal})=>{
 const [location, setLocation] = useState(null)
 const { reverseGeocode, loading, geocode } = useObtainGeocode(location)
  useEffect(() => {
    goToUserLocation()
  }, [])
  
 useEffect(
  ()=>{
   if(location){
    reverseGeocode(location.coords, false)
   }
  }, [location]
 )

  const goToUserLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert('Location permission is required to use this feature')
        return
      }
      let loc = await Location.getCurrentPositionAsync({})
    
      setLocation(loc)
     

    
      
    } catch (err) {
      console.log(err)
    }
  }
  const user_data = useSelector(state=>state.auth.user_data)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const queryClient = useQueryClient()
  
  const {mutate, data, isLoading}= useMutation(
    async ()=>{
      
      if(!location.coords || !geocode) return
      const loc = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        geocode: geocode
      }
      const res = await api.post(
        '/customer/location',
        {
          name,
          phone,
          location: JSON.stringify(loc),
        },{
          headers: {
            Authorization: `Bearer ${user_data.token}`
          }
        }
      )
      return res.data

    }, {
      onSuccess: (data)=>{
        const {fkID} = data.location;
        setShowModal(false)
        queryClient.invalidateQueries(
          {
            queryKey: ['locations']
          }
        )

     
      },
      onError:{
        
      }
    }
  )
 
 return (
   <View>
   {data &&<Text className='text-center font-sanBold_500 text-[#297d29]'>
    Success Location ID: <Text className='font-sanBold_700 text-custom_blue-200'>{data?.location?.fkID}</Text>
   </Text>}
     <Text className=' flex flex-row mt-5 '>
       <Text className='font-sanBold_700'> Your Location:</Text>{' '}
       {geocode ? (
         <Text className='font-light'>{geocode}</Text>
       ) : (
         <ActivityIndicator />
       )}
     </Text>
     <Text className='font-sanBold_700 my-3'>Extra Information</Text>
     <TextInput
       value={name}
       placeholder='Enter your name'
       onChangeText={(e) => {
         setName(e)
       }}
       className='border  rounded-lg px-4 py-2 w-11/12 mx-auto my-2'
     />
     <TextInput
       value={phone}
       keyboardType='numeric'
       placeholder='Enter your phone number'
       onChangeText={(e) => {
         setPhone(e)
       }}
       className='border  rounded-lg px-4 py-2 w-11/12 mx-auto my-2'
     />

     <TouchableOpacity
       className='p-3 bg-custom_blue-200 w-1/2 rounded-lg mx-auto mt-5'
       onPress={mutate}
     >
       {isLoading ? (
         <ActivityIndicator color={'#ffffff'} />
       ) : (
         <Text className='text-custom_white-400 text-center '>Submit</Text>
       )}
     </TouchableOpacity>
   </View>
 )
 }

export default LocationIdModal