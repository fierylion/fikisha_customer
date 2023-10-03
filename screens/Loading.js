import { View, Text, StatusBar } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const Loading = () => {
  return (
    <SafeAreaView className=' flex-1 bg-custom_blue-900'>
      {/* <Text className='text-3xl text-red-600'>Introducti</Text> */}
      <StatusBar barStyle='dark-content' backgroundColor='#000000'  />
    <View className = 'mt-10 font-bold text-custom_silver-500 bg-custom_blue-200 p-5'>
      <Text>Loading</Text>
    </View>
    </SafeAreaView>
  )
}

export default Loading