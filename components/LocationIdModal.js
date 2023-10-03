import { View, Text, TouchableOpacity } from 'react-native'
import React,{useEffect, useState
} from 'react'
import * as Location from 'expo-location'
import * as Icon from 'react-native-feather'
import useObtainGeocode from '../hooks/useObtainGeocode'
const LocationIdModal = ({setShowModal}) => {
 const [endIntro, setEndIntro] = useState(false)

  return (
    <View className=' m-auto'>
      <View className='  h-96  w-80 rounded bg-custom_white-700 '>
        <View className='  mt-3 flex-row justify-between px-2'>
          <Text className='my-auto  font-sanBold_500'>Create Location ID</Text>

          <Icon.XCircle className=' text-custom_orange-500' width={30} height={30} onPress={()=>setShowModal(false)}/>
        </View>
        
        <View className='mt-5 h-full pt-2 rounded-t-2xl bg-custom_white-500 px-2'>{endIntro ? <SetLocation  /> : <Introduction setEndIntro={setEndIntro}/>}</View>
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
     <Text className='font-sanBold_500 mt-10'>Getting Started!</Text>
     <View className='mx-2 '>
       <Text className='font-sanRegular_400 mb-2 mt-4'>
         1. Make sure you are in the exact location.{' '}
       </Text>
       <Text className='font-sanRegular_400 mb-2'>
         2. Make sure you turn on your location.
       </Text>
       <Text className='mb-2 font-sanRegular_400'>
         3. Make sure you turn on your location.
       </Text>
     </View>
     <View className='self-center mt-2'>
      <TouchableOpacity className='flex flex-row p-3 rounded bg-custom_blue-200  w-24' onPress={()=>setEndIntro(true)}>
       <Text className='text-center text-custom_white-400 '>Continue</Text>
       <Icon.ArrowRight className='text-custom_white-400 mr-2' />
      </TouchableOpacity>
     </View>
   </View>
 )
}
const SetLocation = ()=>{
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
      console.log(loc)
      setLocation(loc)
     

    
      
    } catch (err) {
      console.log(err)
    }
  }
 
 return (
  <View>
   <Text>
    Hello Set location
   </Text>
   <Text>{!location && 'Loading.....'}</Text>
   {location &&
   <View>
    <Text>Latitude: {location.coords.latitude}</Text>
    <Text>Longitude: {location.coords.longitude}</Text>
    
   </View>}
   <Text>{!geocode && 'Loading Geocode....'}</Text>
   {geocode &&
   <Text>
    Geocode: {geocode}
   </Text>

   }
   <TouchableOpacity className='p-3 bg-custom_blue-200 w-1/2 rounded-lg mx-auto mt-5'>
    <Text className='text-custom_white-400 text-center '>Submit</Text>
   </TouchableOpacity>
  </View>
 )
 }

export default LocationIdModal