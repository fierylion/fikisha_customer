import { View, Text, TextInput, Image, Button, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import * as Icon from 'react-native-feather'
import { useNavigation } from '@react-navigation/native'
import { useSelector } from 'react-redux'
const Introduction = ({auth}) => {
  const navigation= useNavigation()
  const user_data = useSelector(state=>state.auth.user_data)
  useEffect(
    ()=>{
      
     if( user_data !== 'NOT REGISTERED'){
      const timeOut = setTimeout(()=>{
        navigation.navigate('Home')
      }, 2000)
      return ()=>{
        clearTimeout(timeOut)
      }

    }
    
    }, []
  )
  return (
    <SafeAreaView className=' flex-1 bg-custom_blue-900'>
      {/* <Text className='text-3xl text-red-600'>Introducti</Text> */}
      <StatusBar barStyle='dark-content' backgroundColor='#000000'  />

      <View className='flex flex-1 justify-between items-center'>
      <View></View>
        <View>
          <View className=' mx-auto items-center p-0 m-0'>
            <Image
              className='   '
              source={require('../assets/images/fikishaLogo.png')}
            />
          </View>

          <View className=' mt-20 '>
            <Text className='text-xl mb-2 opacity-75 font-bold text-custom_blue-200 tracking-widest text-center '>
              {' '}
              Welcome to Fikisha
            </Text>
            <Text className={`text-custom_white-700 w-64 text-center my-2 text-sm ${(user_data!=='NOT REGISTERED') ? "mb-40":""}`}>
              send, receive, track or schedule your package deliveries securely
              with us
            </Text>
           {user_data ==='NOT REGISTERED' &&<TouchableOpacity className=' p-5 rounded-3xl my-5 mb-16 bg-custom_blue-200 opacity-75'>
            <Text className='text-center text-custom_white-700 font-black tracking-wider' onPress={()=>navigation.navigate('Register')}>Start</Text>
           </TouchableOpacity>}
          </View>
        </View>
      </View>
      
    </SafeAreaView>
  )
}

export default Introduction