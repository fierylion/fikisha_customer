import { View, Text , TouchableOpacity} from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as Icon from 'react-native-feather'
import { useNavigation } from '@react-navigation/native'

const OrderPlaced = () => {
 const navigation = useNavigation()
  return (
    <SafeAreaView
      className=' flex-1 bg-custom_white-500'
      edges={['top', 'left', 'right']}
    >
      <View className='flex justify-center items-center h-full relative'>
        <View>
          <Icon.CheckCircle
            className=' mx-auto text-custom_blue-200 animate-ping'
            width={70}
            height={70}
          />

          <Text className=' font-sanBold_500 mt-4 text-lg w-25 text-center'>
            Your Order Has Been Placed
          </Text>
        </View>
        <View className=' w-80 absolute bottom-10' >
          <TouchableOpacity className='bg-custom_blue-500 p-2 rounded' onPress={()=>navigation.navigate('Home', {screen:'Home'})} >
            <Text className='text-custom_white-100 text-center'>
              Back to Home
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default OrderPlaced