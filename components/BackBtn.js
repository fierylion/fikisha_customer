import { View, Text, BackHandler } from 'react-native'
import React from 'react'
import * as Icon from 'react-native-feather'
import { useNavigation } from '@react-navigation/native'

const BackBtn = () => {
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
  
      <Icon.ArrowLeft
      className='fixed  z-50 top-2 left-2  p-4  rounded-full'
        color={'gray'}
        height={30}
        width={30}
        onPress={() => navigation.goBack()}
      />
  
  )
}

export default BackBtn