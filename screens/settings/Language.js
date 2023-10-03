import { View, Text , Image, Pressable} from 'react-native'
import React, { useState } from 'react'
import { BackHandler } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'react-native'
import * as Icon from 'react-native-feather'
import FikishaImage from '../../assets/images/fikishaLogoSmall.png'
import englishImage from '../../assets/images/english.png'
import swahiliImage from '../../assets/images/swahili.png'
const Language = () => {
    const navigation = useNavigation()
    const [language, setLanguage] = useState('english')
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
        <Text className='mx-auto font-sanBold_500 text-lg'>Language</Text>
        <Icon.ArrowLeft />
      </View>
      <View className='h-20'></View>

      <View>
        <View className='rounded-t-3xl h-full w-full bg-custom_white-400'>
          <View className=''>
            <Image
              source={FikishaImage}
              className='mx-auto border mt-2 rounded '
            />
            <Text className='font-sanBold_500 mt-5 ml-4'>Select language</Text>
            <View className=' mt-2 flex flex-row justify-around'>
              <Pressable onPress={() => setLanguage('english')}>
                <View className=' shadow-lg bg-custom_white-100 rounded  w-44 h-44 relative'>
                  <View className='m-auto'>
                    <View className='w-20 h-20 border rounded '>
                      <Image
                        source={englishImage}
                        className=' h-16 w-16 m-auto'
                      />
                    </View>
                    <Text className='text-center font-sanBold_500 mt-2'>
                      English
                    </Text>
                  </View>
                  {language === 'english' && (
                    <Icon.Check
                      className='absolute top-2 right-3 bg-custom_white-400 rounded-full   text-custom_blue-200'
                      width={30}
                      height={30}
                    />
                  )}
                </View>
              </Pressable>
              <Pressable onPress={() => setLanguage('kiswahili')}>
                <View className=' rounded shadow-lg bg-custom_white-100 w-44 h-44 relative'>
                  <View className='m-auto'>
                    <View className='w-20 h-20 border rounded '>
                      <Image
                        source={swahiliImage}
                        className=' h-16 w-16 m-auto'
                      />
                    </View>
                    <Text className='text-center font-sanBold_500 mt-2 '>
                      Kiswahili
                    </Text>
                  </View>
                  {language === 'kiswahili' && (
                    <Icon.Check
                      className='absolute top-2 right-3 bg-custom_white-400 rounded-full   text-custom_blue-200'
                      width={30}
                      height={30}
                    />
                  )}
                </View>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Language