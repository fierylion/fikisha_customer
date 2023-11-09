import { View, Text } from 'react-native'
import React from 'react'
import * as Icon from 'react-native-feather'
const Close = ({onClose}) => {
  return (
  <Icon.X className='absolute  right-4 w-7 rounded-full h-7 p-4 bg-custom_white-700/50 text-custom_white-600' onPress={onClose}/>
  )
}

export default Close