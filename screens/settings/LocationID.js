import { View, Text, ScrollView, KeyboardAvoidingView, Pressable } from 'react-native'
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
  useEffect(() => {
    if(location) bottomSheetModalRef.current?.present();

  }, [location])
  const data = [
    {
      locID: 'FK212B',
      geocode: 'Mwenge, g345b, Daresalaam',
      latLng: { longitude: 0.23, latitude: 0.22 },
      created_at: '2022, July 2 00:00',
    },
    {
      locID: 'FK212B',
      geocode: 'Mwenge, g345b, Daresalaam',
      latLng: { longitude: 0.03, latitude: 0.02 },
      created_at: '2022, July 2 00:00',
    },
    {
      locID: 'FK212B',
      geocode: 'Mwenge, g345b, Daresalaam',
      latLng: { longitude: 0.03, latitude: 0.02 },
      created_at: '2022, July 2 00:00',
    },
    {
      locID: 'FK212B',
      geocode: 'Mwenge, g345b, Daresalaam',
      latLng: { longitude: 0.23, latitude: 0.02 },
      created_at: '2022, July 2 00:00',
    },
    {
      locID: 'FK212B',
      geocode: 'Mwenge, g345b, Daresalaam',
      latLng: { longitude: 0.03, latitude: 0.02 },
      created_at: '2022, July 2 00:00',
    },
  ]
 
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
          <View className='mt-1 flex flex-row items-center mx-3'>
            <Icon.ArrowLeft
              color={'gray'}
              height={30}
              width={30}
              onPress={() => navigation.goBack()}
            />
            <Text className='mx-auto font-sanBold_500 text-lg'>
              Create Location ID
            </Text>
            <Icon.ArrowLeft />
          </View>
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
                  {data.map((item, index) => (
                    <SingleLocation
                      locID={item.locID}
                      geocode={item.geocode}
                      latLng={item.latLng}
                      setLatLng={setLocation}
                      created_at={item.created_at}
                    />
                  ))}
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

const SingleLocation = ({locID, geocode, latLng, setLatLng, created_at}) => {
  const handleDelete = ()=>{
    console.log('Deleted', locID)
  }
  return (
    <View className='my-3 flex flex-row justify-between'>
      <View>
        <View className='flex flex-row '>
          <Text className='font-sanBold_500 text-gray-600'>{locID}</Text>
          <Text  className='text-xs font-sanLight_300 self-end ml-1'>{created_at}</Text>
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
          onPress={() => setLatLng(latLng)}
        />
        <Icon.Delete
          width={20}
          height={20}
          className='mr-2  text-custom_orange-500'
          onPress={handleDelete}
        />
      </View>
    </View>
  )}
export default LocationID