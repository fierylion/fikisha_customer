import { View, Text, StatusBar,TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView, Alert} from 'react-native'
import React, {useEffect, useState} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { BackHandler } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import * as Icon from 'react-native-feather'
import { modifyData } from '../store/requestSlice'
import { useSelector, useDispatch } from 'react-redux'
import * as Location from 'expo-location'
import useObtainGeocode from '../hooks/useObtainGeocode'
const Checkout = () => {
  // Add a listener for the hardware back button
  const navigation =useNavigation()
  const dispatch=useDispatch()
  
  const handleBackButton = ()=>{navigation.goBack()
  return true}
  const [typeClicked, setTypeClicked] = useState('Sender')
  const clickType = {
    btnClass: 'bg-custom_blue-700',
    textClass: 'text-custom_white-100',
    iconClass: 'text-custom_white-100',
  }
  const notClickType = {
    btnClass: 'bg-custom_white-100',
    textClass: 'text-custom_blue-700',
    iconClass: 'text-custom_blue-700',
  }

  useEffect(() => {
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
   const loc = useSelector(
    (state) => state.request.senderInformation.location
  )
   
  useEffect(
    () =>{
     
    
    const updateLocation=   async () => {
      
        if(loc.latitude!==0 || loc.longitude!==0) return // update location only when default is set
        let {status }= await Location.requestForegroundPermissionsAsync();
        if(status!=='granted'){
          Alert.alert('Location permission is required to use this feature')
          return
        }
        let location = await Location.getCurrentPositionAsync({});
        console.log(location)
        dispatch(modifyData({data:{...loc,latitude:location.coords.latitude, longitude:location.coords.longitude}, type:'SENDER_LOCATION'}))
      

      }
    updateLocation()
    },[loc]
  )
  
  const data =(typeClicked==='Sender')? useSelector(
    (state) => state.request.senderInformation
  ) : useSelector((state) => state.request.receiverInformation)
 const senderInformation = useSelector((state) => state.request.senderInformation)
 const receiverInformation = useSelector((state) => state.request.receiverInformation)
  const validateData = ()=>{
    const nRecLoc =receiverInformation.location.longitude !== 0 && receiverInformation.location.longitude !==0; 
    const condition =(senderInformation.name && senderInformation.phone) && (receiverInformation.name && receiverInformation.phone && nRecLoc) 

      if(condition) {navigation.navigate('Confirmation')
    return 
    }
    if(!nRecLoc){
      Alert.alert('Please fill the receiver location!')
      return
    }
      
      Alert.alert('Please fill in all the data!')
      
    }
  const geocode = data.location.geocode
    const {  reverseGeocode, loading } = useObtainGeocode()

    useEffect(() => {
    reverseGeocode(data.location, typeClicked.toUpperCase())

  }, [data.location])
  
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
        <Text className='mx-auto font-sanBold_500 text-lg'>Location</Text>
        <Icon.ArrowLeft />
      </View>
      <View className='flex-row mx-3 mt-4'>
        {
          <>
            <TypeButtons
              type={'Sender'}
              setType={setTypeClicked}
              {...(typeClicked === 'Sender' ? clickType : notClickType)}
            />
            <TypeButtons
              type={'Receiver'}
              setType={setTypeClicked}
              {...(typeClicked !== 'Sender' ? clickType : notClickType)}
            />
          </>
        }
      </View>
      <ScrollView keyboardShouldPersistTaps={'handled'}>
        <View className='mx-6 mt-6'>
          <View className='flex-row justify-between'>
            <View className='mr-2'>
              <Text className='font-sanBold_500'>Selected Location: </Text>
              <Text className='font-sanLight_300 text-xs w-40 text-custom_blue-200'>
                Click 'Set on Map' below to confirm your location!
              </Text>
            </View>
            <View className='w-48  pr-3 bg-custom_white-600 rounded-lg flex flex-row'>
              <Icon.MapPin
                className='text-custom_white-100 my-auto ml-2 mr-1'
                height={30}
                width={15}
              />
              <Text className='text-custom_white-100 my-auto text-xs font-sanSmall_300'>
                {(geocode)?geocode: (data?.location?.latitude.toFixed(4).toString() +
                  ',' +
                  data?.location?.longitude.toFixed(4).toString())}
                
              </Text>
            </View>
          </View>
        </View>
        <View className='m-6'>
          <View className='flex-row'>
            <TouchableOpacity
              className='bg-custom_blue-600  mr-1 w-1/2 rounded-lg  p-2'
              onPress={() =>
                navigation.navigate('MajorMap', {
                  data: {
                    type: typeClicked.toUpperCase(),
                    location: data?.location,
                    geocode,
                    loading
                  },
                })
              }
            >
              <Text className='text-custom_white-100  m-auto'>Set on Map</Text>
            </TouchableOpacity>
            <TouchableOpacity className='bg-custom_blue-600 ml-1 w-1/2 rounded-lg p-2'>
              <Text className='text-custom_white-100  m-auto'>
                Saved Address
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity className='bg-custom_blue-600 rounded-lg my-3  p-3 w-100'>
            <Text className='text-custom_white-100  text-center '>
              Share Location
            </Text>
          </TouchableOpacity>
          <View className='flex-row'>
            <TextInput
              placeholder='Use Location ID(eg. FK456 ))'
              className='border  rounded-l-lg px-4 py-0.5 w-[85%] my-2 shadow'
              // onChangeText={()=>{}}
              // value={props.values.email}
              // onBlur={}
            />
            <View className='my-auto border w-[15%] rounded-r-lg py-1 px-2  bg-custom_blue-500'>
              <Icon.Search className='text-custom_white-100 ' />
            </View>
          </View>
        </View>
        {
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <>
              <View>
                <Text className='mb-2 text-center font-sanBold_500'>
                  {typeClicked === 'Sender'
                    ? "Sender's Information"
                    : "Receiver's Information"}
                </Text>
                <TextInput
                  placeholder='Name'
                  className='border  rounded-lg px-4 py-2 w-11/12 mx-auto my-2'
                  onChangeText={(e) => {
                    dispatch(
                      modifyData({
                        data: e,
                        type: typeClicked.toUpperCase() + '_NAME',
                      })
                    )
                  }}
                  value={data?.name}
                  // onBlur={}
                />
                <View className='flex-row my-3  mx-4'>
                  <Text className='px-1 py-3   w-[12%] text-custom_white-100 bg-custom_blue-500 rounded-l-lg font-sanBold_500'>
                    +255
                  </Text>
                  <TextInput
                    className='border  rounded-r-lg px-2 py-1 w-[88%]  '
                    placeholder='(eg. 765432159)'
                    keyboardType='numeric'
                    onChangeText={(e) => {
                      if (e.length > 9) return
                      dispatch(
                        modifyData({
                          data: e,
                          type: typeClicked.toUpperCase() + '_PHONE',
                        })
                      )
                    }}
                    value={data?.phone}
                  />
                </View>
              </View>
              <View>
                <Text className='my-2 text-center font-sanBold_500'>
                  Extra Information (Optional)
                </Text>
                <TextInput
                  className='border  rounded-lg px-2  mx-4'
                  multiline={true}
                  numberOfLines={5}
                  placeholder='Room Number, House Number, Landmark, etc.'
                  onChangeText={(e) => {
                    dispatch(
                      modifyData({
                        data: e,
                        type: typeClicked.toUpperCase() + '_EXTRA',
                      })
                    )
                  }}
                  value={data?.extra}
                />
              </View>
            </>
          </KeyboardAvoidingView>
        }
        <TouchableOpacity
          className=' p-4 my-4 mb-10 bg-custom_blue-500 mx-3 rounded'
          onPress={() => {
            if (typeClicked === 'Sender') {
              setTypeClicked('Receiver')
            } else {
              validateData()
            }
          }}
        >
          <Text className='m-auto text-custom_white-100'>
            {typeClicked === 'Sender' ? 'Continue' : 'Save & Continue'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}
const TypeButtons = ({type, iconClass, textClass, btnClass, setType})=>{
  return (
    
      <TouchableOpacity className={`w-1/2 border p-3 rounded-t-lg ${btnClass}`} onPress={()=>setType(type)}>
        <View className={`flex-row items-center m-auto `}>
          <Icon.User className={` mr-1 ${iconClass}`} />
          <Text className={`${textClass}`}>{type}</Text>
        </View>
      </TouchableOpacity>
    
  )
}

export default Checkout