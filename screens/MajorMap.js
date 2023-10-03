import { View, Text,Image,ActivityIndicator, TextInput, TouchableOpacity,Alert, Pressable } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import { useNavigation, useRoute } from '@react-navigation/native'
import { useSelector, useDispatch } from 'react-redux'
import MapView from 'react-native-maps'
import { modifyData } from '../store/requestSlice'
import pinImage from '../assets/images/pin.png'
import * as Icon from 'react-native-feather'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import apiKeyConfig from '../apiKeyConfig'
import * as Location from 'expo-location'
const MajorMap = () => {
  const route =useRoute()
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const {data:{type}} = route.params
  const [showLocation, setShowLocation] = React.useState(true)
 
  const location = useSelector(state=>
    {
      if(type==='SENDER') return state.request.senderInformation.location
      else return state.request.receiverInformation.location
})
useEffect(
  () => { 
    if(location.latitude===0 || location.longitude===0){
      goToUserLocation(type)
    }
    
  }, [location]
)
 const goToUserLocation = async (type) => {
  try{
   let { status } = await Location.requestForegroundPermissionsAsync()
   if (status !== 'granted') {
     Alert.alert('Location permission is required to use this feature')
     return
   }
   let loc = await Location.getCurrentPositionAsync({})
   const lat = loc.coords.latitude;
   const lng = loc.coords.longitude
   
      mapRef.current.animateToRegion({
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.003,
        longitudeDelta: 0.003,
      })
  
   dispatch(
     modifyData({
       data: {...location,
         latitude: lat,
         longitude: lng,
       
       },
       type:`${type}_LOCATION`,
     })
   )}
   catch(err){
    console.log(err)
   }
 }

  const mapRef = React.useRef()
  
  
  const updateLocation= (region, reason)=>{
    
    dispatch(modifyData({data:region, type:`${type}_LOCATION`}))
    setShowLocation(reason.isGesture)
    handleView()
   
  }
  const [isVisible, setIsVisible] = React.useState(false)
  let timeout;
  const handleView = () => {
    clearTimeout(timeout);
    setIsVisible(true);
    timeout = setTimeout(() => {
      setIsVisible(false);
    }, 1000);
  }
  
  
  return (
    <SafeAreaView className=' flex-1 bg-custom_white-500 font-sanBold_500'>
      <View className='relative'>
        <MapView
          ref={mapRef}
          showsMyLocationButton={true}
          initialRegion={location}
          style={{ height: '100%', width: '100%' }}
          onRegionChangeComplete={updateLocation}
        ></MapView>
        <View className='absolute top-1/2 left-1/2 drop-shadow-lg'>
          {!isVisible ? (
            <View className='relative'>
              <Image source={pinImage} className='w-5 h-10 z-0 ' />
              <View className='p-0.5 w-3 m-auto rounded-full bg-custom_blue-500 opacity-20 '></View>
            </View>
          ) : (
            <ActivityIndicator size='large' color='#0000ff' />
          )}
        </View>
        <View className='absolute w-full my-6 '>
          <View className='relative pb-10'>
            {showLocation && (
              <View>
                <View className='relative'>
                  <TextInput
                    className='bg-custom_white-100 rounded-lg py-2 pl-10'
                    value={location?.geocode?.substring(0, 50)}
                    onFocus={() => setShowLocation(false)}
                  />
                  <Icon.MapPin className='absolute top-2 left-2 text-custom_blue-500' />
                </View>
              </View>
            )}
            {!showLocation && (
              <View>
                <View className='relative'>
                  <GooglePlacesAutocomplete
                    placeholder='Type a place'
                    query={{ key: apiKeyConfig, components: 'country:tz' }}
                    styles={{
                      textInput: {
                        paddingLeft: 40,
                      },
                    }}
                    onPress={(data, details = null) => {
                      // 'details' is provided when fetchDetails = true
                      setShowLocation(false)
                      if (details) {
                        const { lat, lng } = details.geometry.location
                        mapRef.current.animateToRegion({
                          latitude: lat,
                          longitude: lng,
                          latitudeDelta: 0.003,
                          longitudeDelta: 0.003,
                        })
                      }
                    }}
                    fetchDetails={true}
                    onFail={(error) => console.log(error)}
                    onNotFound={() => console.log('no results')}
                  />
                  <Icon.MapPin className='absolute top-2 left-2 text-custom_blue-500' />
                </View>
              </View>
            )}
            <View className='absolute bottom-0 right-10'>
              <Pressable onPress={()=>goToUserLocation(type)}>
                <Icon.Target width={30} height={30} color={'#fca311'} />
              </Pressable>
            </View>
          </View>
        </View>
        <View className='absolute bottom-5 w-80 my-4 left-9 '>
          <TouchableOpacity
            className='bg-custom_blue-600 rounded-lg py-4 w-full'
            onPress={() => navigation.goBack()}
          >
            <Text className='text-custom_white-100  text-center '>
              Submit Location
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default MajorMap