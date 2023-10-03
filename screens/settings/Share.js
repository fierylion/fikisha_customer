import { View, Text } from 'react-native'
import React from 'react'
import { BackHandler } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'react-native'
import * as Icon from 'react-native-feather'
const Share = () => {
   const navigation = useNavigation()
   const handleBackButton = () => {
     navigation.goBack()
     return true
   }
   React.useEffect(() => {
     const backHandler = BackHandler.addEventListener(
       'hardwareBackPress',
       handleBackButton
     )

     // Remove the listener when the component unmounts
     return () => {
       backHandler.remove()
       BackHandler.removeEventListener('hardwareBackPress', handleBackButton)
     }
   }, [])
  return (
    <SafeAreaView
      className=' flex-1 bg-custom_white-500 font-sanBold_500'
      keyboardShouldPersistTaps={'handled'}
    >
      {/* <Text className='text-3xl text-red-600'>Introducti</Text> */}
      <StatusBar barStyle='dark-content' backgroundColor='#808080' />
      <View className='mt-1 flex flex-row items-center mx-3'>
        <Icon.ArrowLeft
          color={'gray'}
          height={30}
          width={30}
          onPress={() => navigation.goBack()}
        />
        <Text className='mx-auto font-sanBold_500 text-lg'>Share with Friends</Text>
        <Icon.ArrowLeft />
      </View>
    </SafeAreaView>
  )
}

export default Share