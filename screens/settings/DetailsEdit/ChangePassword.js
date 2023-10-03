import { View, Text , StatusBar, TextInput, TouchableOpacity} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as Icon from 'react-native-feather'

import React from 'react'
import { useNavigation } from '@react-navigation/native'


const ChangePassword = () => {
  const navigation = useNavigation()
  const [viewPassword, setViewPassword] = React.useState(false)
  const [viewPassword2, setViewPassword2] = React.useState(false)
  return (
    <SafeAreaView
      className=' flex-1 bg-custom_white-500 font-sanBold_500'
      keyboardShouldPersistTaps={'handled'}
    >
      {/* <Text className='text-3xl text-red-600'>Introducti</Text> */}
      <StatusBar barStyle='dark-content' backgroundColor='#e5e5e5' />
      <View className='mt-1 flex flex-row items-center mx-3'>
        <Icon.ArrowLeft
          color={'gray'}
          height={30}
          width={30}
          onPress={() => navigation.goBack()}
        />
        <Text className='mx-auto font-sanBold_500 text-lg'>
          Change Password
        </Text>
        <Icon.ArrowLeft />
      </View>
      <View className='h-20'></View>
      <View>
        <View className='rounded-t-3xl h-full w-full bg-custom_white-400'>
          <View className='my-20 flex justify-center  items-center'>
            <View>
              <View className='relative'>
                <Icon.Lock
                  width={20}
                  height={20}
                  color='gray'
                  className='absolute top-50'
                />
                <TextInput
                  placeholder='Old Password'
                  className='border-b-2 pl-6 border-custom_white-600  '
                  secureTextEntry={!viewPassword}
                />
                { !viewPassword?
                <Icon.EyeOff
                  width={20}
                  height={20}
                  color='gray'
                  className='absolute right-3 '
                  onPress={() => setViewPassword(!viewPassword)}
                />:
                <Icon.Eye
                  width={20}
                  height={20}
                  color='gray'
                  className='absolute right-3 '
                  onPress={() => setViewPassword(!viewPassword)}
                />}
              </View>
              <View className='relative mt-10'>
                <Icon.Lock
                  width={20}
                  height={20}
                  color='gray'
                  className='absolute top-1/2'
                />
                <TextInput
                  placeholder='New Password'
                  className='border-b-2 mt-4 pl-6 border-custom_white-600 w-80 h-10'
                  secureTextEntry={!viewPassword2}
                />
                {!viewPassword2? <Icon.EyeOff
                  width={20}
                  height={20}
                  color='gray'
                  className='absolute right-3 top-1/2'
                  onPress={() => setViewPassword2(!viewPassword2)}
                />:
                <Icon.Eye
                  width={20}
                  height={20}
                  color='gray'
                  className='absolute right-3 top-1/2'
                  onPress={() => setViewPassword2(!viewPassword2)}
                />}
              </View>
              <TouchableOpacity className='p-4 bg-custom_blue-500 rounded-lg mt-10'>
                <Text className='text-custom_white-100 text-center font-sanBold_500'>
                  Submit
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default ChangePassword