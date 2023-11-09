import { View, Text, ScrollView, KeyboardAvoidingView, Pressable, Clipboard , TouchableOpacity} from 'react-native'
import React, { useEffect, useRef } from 'react'
import { BackHandler } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'react-native'
import * as Icon from 'react-native-feather'
import MapSinglePoint from '../../components/MapSinglePoint'
import Modal from 'react-native-modal'
import LocationIdModal from '../../components/LocationIdModal'
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useSelector } from 'react-redux'
import { useQuery } from '@tanstack/react-query'
import Spinner from 'react-native-loading-spinner-overlay'
import { formatDate, shortText } from '../../lib/utils'
import { api } from '../../api'
import Toast from 'react-native-toast-message'


const LocationID = () => {
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
  const [location, setLocation] = React.useState(null)
  const [showModal, setShowModal] = React.useState(false)
   const bottomSheetModalRef = useRef(null)
 
  const presentModal = () => {
    bottomSheetModalRef.current?.present()
  }
  const user_data = useSelector(state=>state.auth.user_data)
  const fetchLocations = async ()=>{
    const res = await api.get('/customer/locations/all',{
      headers:{
        Authorization: `Bearer ${user_data.token}`
      }

    } )

    return res.data 
  }
const {data, isLoading, isError, error} = useQuery(
  {
    queryKey: ['locations'],
    queryFn: fetchLocations,

  }
)
 
const snapPoints = ['80%', '80%']
  return (
    <SafeAreaView
      className=' flex-1 bg-custom_white-500 font-sanBold_500'
      keyboardShouldPersistTaps={'handled'}
    >
      <GestureHandlerRootView>
        <BottomSheetModalProvider>
          {/* <Text className='text-3xl text-red-600'>Introducti</Text> */}
          <StatusBar barStyle='dark-content' backgroundColor='#808080' />
        <Spinner visible={isLoading}/>
          <View className='h-20'></View>
          <View className='rounded-t-3xl h-full w-full bg-custom_white-400'>
            <KeyboardAvoidingView behavior='padding'>
              <View className='mx-auto shadow-lg rounded-lg mt-8  w-40 py-4 bg-custom_blue-200'>
                <Pressable onPress={() => setShowModal(true)}>
                  <View className='m-auto flex flex-row'>
                    <Icon.PlusCircle className=' text-custom_white-400' />
                    <Text className='self-center font-sanBold_500 ml-1 text-custom_white-400'>
                      New
                    </Text>
                  </View>
                </Pressable>
              </View>
              <ScrollView>
                <View className='ml-4 mt-8'>
                  { data && data.locations.map((item, index) => {
                    
                    const created_at  = formatDate(item.created_at)
                    const location = JSON.parse(item.location)
                    const geocode = shortText(location.geocode, 40)
                    const locID = item.fkID
                    return (
                    
                    <SingleLocation
                    presentModal = {presentModal}
                      locID={locID}
                      geocode={geocode}
                      latLng={location}
                      setLatLng={setLocation}
                      created_at={created_at}
                    />
                  )})}
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </View>
          <Modal
            isVisible={showModal}
      
            backdropOpacity={0.8}
            animationIn='zoomInDown'
            animationOut='zoomOutUp'
            animationInTiming={600}
            animationOutTiming={800}
            backdropTransitionInTiming={600}
            backdropTransitionOutTiming={600}
          >
            <LocationIdModal setShowModal={setShowModal} />
          </Modal>
          <BottomSheetModal
            ref={bottomSheetModalRef}
            snapPoints={snapPoints}
            index={1}
            backgroundStyle={{
              borderRadius: 50,
              opacity: 75,
              backgroundColor: '#ffe',
            }}
            onDismiss={() => setLocation(null)}
          >
            <MapSinglePoint latLng={location} />
          </BottomSheetModal>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </SafeAreaView>
  )
}

const SingleLocation = ({locID, geocode, latLng, setLatLng, created_at, presentModal}) => {
  const handleDelete = ()=>{
    console.log('Deleted', locID)
  }
  return (
    <TouchableOpacity onPress={()=>{
      Clipboard.setString(locID)
      Toast.show(
        {
          type:'success',
          text1:'Copied Location Id',
          text2:'Share for easy location'
        }
      )
    }}>
      <View className='my-3 flex flex-row justify-between'>
        <View>
          <View className='flex flex-row '>
            <Text className='font-sanBold_500 text-gray-600'>{locID}</Text>
            <Text className='text-xs font-sanLight_300 self-end ml-1'>
              {created_at}
            </Text>
          </View>
          <View className='flex flex-row mt-2'>
            <Icon.MapPin
              width={20}
              height={20}
              className='mr-1 text-custom_blue-200'
            />
            <Text className='text-xs font-sanBold_500 text-gray-600'>
              {geocode}
            </Text>
          </View>
        </View>
        <View className='flex flex-row mt-2 mr-5'>
          <Icon.Eye
            width={20}
            height={20}
            className='mr-4 text-custom_white-600'
            onPress={() => {
              setLatLng(latLng)
              presentModal()
            }}
          />
          <Icon.Delete
            width={20}
            height={20}
            className='mr-2  text-custom_orange-500'
            onPress={handleDelete}
          />
        </View>
      </View>
    </TouchableOpacity>
  )}
export default LocationID