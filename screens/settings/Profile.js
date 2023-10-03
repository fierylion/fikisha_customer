import { View, Text,Image, ScrollView, Pressable , Switch} from 'react-native'
import React from 'react'
import { BackHandler } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'react-native'
import * as Icon from 'react-native-feather'

const Profile = () => {
   const navigation = useNavigation()
   const handleBackButton = () => {
     navigation.goBack()
     return true
   }
   const [notification, setNotification] = React.useState(false)

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
   const data = {
    name: 'Daniel Mawalla',
    ratings: 3,
    orders:10

   }
   const settings = [
    {
      name:'Notifications',
      icon:Icon.Bell,
      press:setNotification,
      value:notification,
    }, 
    {
      name:'Change Password',
      icon:Icon.Lock,
      screen:'ChangePassword'
    },
    {
      name:'Edit Profile',
      icon:Icon.User,
      screen:'EditProfile'
    },
    ]
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
        <Text className='mx-auto font-sanBold_500 text-lg'>Profile</Text>
        <Icon.ArrowLeft />
      </View>
      <View className='h-20'></View>

      <View>
        <View className='rounded-t-3xl h-full w-full bg-custom_white-400'>
          <View className='my-10 flex justify-center  items-center'>
            <View>
              <Text className=' font-sanBold_500 text-lg mx-auto'>
                {data.name}
              </Text>
              <View className='flex flex-row mx-auto mt-2'>
                {Array(5)
                  .fill()
                  .map((_, i) => {
                    if (i + 1 <= data.ratings) {
                      return (
                        <Icon.Star
                          color={'#FFD700'}
                          className='m-1'
                          height={25}
                          width={25}
                          fill={'#FFD700'}
                        />
                      )
                    } else {
                      return (
                        <Icon.Star
                          className='m-1'
                          color={'#000'}
                          height={25}
                          width={25}
                          fill={'#808080'}
                        />
                      )
                    }
                  })}
              </View>
              <Text className='text-sm text-center font-sanBold_700  text-custom_orange-500'>
                Ratings: {data.ratings}
              </Text>
              <View className=' mt-2 p-4 py-6 shadow-lg rounded bg-custom_white-500'>
                <Text className='font-sanBold_700 text-xl text-center text-custom_orange-500'>
                  {data.orders}
                </Text>
                <Text className='font-sanBold_700 text-xs text-center text-custom_white-600'>
                  Total Orders
                </Text>
              </View>
            </View>
          </View>
          <View>
            <ScrollView>
              <View className='mx-2'>
                {settings.map((item, index) => {
                  return (
                    <ProfileItem
                      key={index}
                      name={item.name}
                      SvgIcon={item.icon}
                      isSwitch={item.press}
                      value={item.value}
                      setValue={item.press}
                      screen={item.screen}
                    />
                  )
                })}
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}
const ProfileItem = ({name,SvgIcon,isSwitch, value, setValue, screen})=>{
  const navigation= useNavigation()


  return (
    <Pressable
      onPress={() => {
        if (setValue) return
        navigation.navigate(screen)
      }}
    >
      <View>
        <View className='flex flex-row justify-between items-center mx-2 my-2 rounded-lg  py-2 h-14 bg-custom_white-100 px-2'>
          <View className=' flex flex-row '>
            <SvgIcon width={30} height={30} color={'black'} />
            <Text className='text-sm my-auto font-sanBold_500 ml-2'>{name}</Text>
          </View>
          {isSwitch && (
            <Switch
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={value ? '#f5dd4b' : '#f4f3f4'}
              ios_backgroundColor='#3e3e3e'
              onValueChange={() => {
                console.log(!value)
                setValue(!value)}}
              value={value}
            />
          )}
        </View>
      </View>
    </Pressable>
  ) 
}

export default Profile