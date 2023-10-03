import { View, Text } from 'react-native'
import React from 'react'

const AlertMessage = ({message, color}) => {
 const colorType = {
  danger: '',
  normal: 'custom_white-900',
  success:''
 }
  return (
    <View className='p-3 rounded bg-custom_blue-200'>
      <Text className={`text-${colorType[color]}`}>{message}</Text>
    </View>
  )
}

export default AlertMessage