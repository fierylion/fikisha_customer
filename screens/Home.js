import { View, Text, StatusBar, BackHandler, Alert } from 'react-native'
import React,{useEffect} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import { useDispatch } from 'react-redux'

import * as Icon from 'react-native-feather';
import {FeatureImages, Services} from '../components/HomePageComponents'
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import AsyncStorage from '@react-native-async-storage/async-storage';



const Home = () => {
  
 
  const dispatch =  useDispatch()
 const handleBackButton = () => {
   // Show a confirmation dialog when the back button is pressed
   Alert.alert(
     'Exit App',
     'Do you want to exit the app?',
     [
       {
         text: 'Cancel',
         onPress: () => null, // Do nothing if the user cancels
         style: 'cancel',
       },
       {
         text: 'Exit',
         onPress: () => BackHandler.exitApp(), // Exit the app if the user confirms
       },
     ],
     { cancelable: false }
   )
   return true // Return true to prevent the default back button behavior
 }

 // Add a listener for the hardware back button
 useEffect(() => {
  const backHandler =  BackHandler.addEventListener('hardwareBackPress', handleBackButton)

   // Remove the listener when the component unmounts
   return () => {
    backHandler.remove()
     BackHandler.removeEventListener('hardwareBackPress', handleBackButton)
   }
 }, [])
 
  return (
    <SafeAreaView
      className=' flex-1 bg-custom_white-500'
      edges={['top', 'left', 'right']}
    >
      {/* <Text className='text-3xl text-red-600'>Introducti</Text> */}
      <StatusBar barStyle='dark-content' backgroundColor='#808080' />
      <View>
        <View className='flex-row justify-between mx-5 mt-2'>
          <View className=''>
            <Text className=' font-bold text-xl text-custom_blue-500'>
              Fikisha
            </Text>
            <View className='flex-row text-center'>
              <Icon.MapPin width={20} height={30} color={'gray'} />
              <Text className='self-center ml-1.5 font-bold text-sm text-custom_white-600'>
                ST, Kariakoo..
              </Text>
            </View>
          </View>
          <View className='mt-2 relative'>
            <Icon.Bell width={30} height={30} color={'gray'} />
            <Text className='absolute top-0 right-0  bg-custom_orange-500 w-2 h-2 rounded-full text-custom_white-500 text-xs'></Text>
          </View>
        </View>
      </View>
      <FeatureImages />
      <Services />
    </SafeAreaView>
  )
}

export default Home