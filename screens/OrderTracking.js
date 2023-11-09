import { View, Text, StatusBar, BackHandler, Image, TouchableOpacity , TextInput, ActivityIndicator} from 'react-native'
import React, {useEffect, useState, useRef, useMemo} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRoute, useNavigation } from '@react-navigation/native'
import { api, apiWS } from '../api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSelector, useDispatch } from 'react-redux'
import Spinner from 'react-native-loading-spinner-overlay'
import BikeImage from '../assets/images/bike.png'
import * as Icon from 'react-native-feather'
import MapView, {
  Marker,
  AnimatedRegion,
  Callout,
  Polyline,
} from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions'
import apiKeyConfig from '../apiKeyConfig'
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet'

import { GestureHandlerRootView } from 'react-native-gesture-handler'
import Stars from '../components/Stars'
import { callNumber } from '../lib/utils'
const OrderTracking = () => {

  //gorhom
  const bottomSheetModalRef = useRef(null)
  const [isOpen, setIsOpen] = useState(false)
  const snapPoints = useMemo(() => ['75%', '75%'], [])

  function handlePresentModal() {
    bottomSheetModalRef.current?.present()
    setIsOpen(true)
  }
  function handleCloseModal() {
    // Close the Gorhom modal
    bottomSheetModalRef.current?.dismiss()
  }
  const {order_id} = useRoute().params
  const user_data = useSelector((state) => state.auth.user_data)

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
      

       const [driverLocation, setDriverLocation] = React.useState()

       const [destinationLocation, setDestinationLocation] = useState()

     //fetch order details
     const fetchOrderDetails = async () => {
       const res = await api.get(`/customer/order/${order_id}`, {
         headers: {
           Authorization: `Bearer ${user_data.token}`,
         },
       })
       return res.data
     }
      const { data, isLoading } = useQuery({
        queryKey: ['orderDetails', order_id],
        queryFn: fetchOrderDetails,

        onSuccess: (data) => {
           const order = data?.details?.order
           const delivery = data?.details?.delivery
          setDestinationLocation(order?.receiver_id?.location_id)
          setDriverLocation(JSON.parse(delivery?.location))
        },
      })
     
      //map config
       const mapRef = useRef()
       const markerRef = useRef()
       const animateMarker = (newCoordinate) => {
         if (markerRef.current) {
           markerRef.current.animateMarkerToCoordinate(newCoordinate, 7000)
         }
       }

      const order = data?.details?.order
      const delivery = data?.details?.delivery

      //location
       const [duration, setDuration] = useState('')
       const [distance, setDistance] = useState('')

    
      useEffect(
        ()=>{
          
           if (mapRef.current && driverLocation && destinationLocation) {
             mapRef.current.animateToRegion(
               {
                 latitude:
                   (destinationLocation.latitude + driverLocation.latitude) / 2, // Calculate the average latitude
                 longitude:
                   (destinationLocation.longitude + driverLocation.longitude) /
                   2, // Calculate the average longitude
                 longitudeDelta:
                   Math.abs(
                     destinationLocation.longitude - driverLocation.longitude
                   ) * 1.2, // Adjust the factor as needed
                 latitudeDelta:
                   Math.abs(
                     destinationLocation.latitude - driverLocation.latitude
                   ) * 1.2, // Adjust the factor as needed
               },
               1000
             )
           }

        }, [data]
      )
       
  




      //driver location
        useEffect(() => {
          const agent_id = delivery?.agent_id?.id
          if (!agent_id) return
          const socket = new WebSocket(
            `${apiWS}/location/${agent_id}/`
          )

          socket.onmessage = (e) => {
            
            const data = JSON.parse(e.data)
            const {driver_location} = data
       
            
            setDriverLocation(driver_location)
          }
          socket.onopen = (e) => {
            console.log('agent location connected')
          }
          socket.onerror = (e) => {
            console.log(e)
          }
          socket.onclose = (e) => {
            console.log('closed')
          }
          return () => {
            socket.close()
          }
        }, [user_data, delivery])
      const [viewDetails, setViewDetails] = useState(true)
 

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: 'gray' }}>
      <BottomSheetModalProvider>
        <SafeAreaView
          className=' flex-1 bg-custom_white-500'
          edges={['top', 'left', 'right']}
        >
          {order && driverLocation && destinationLocation && (
            <View className='relative'>
              <MapView
                ref={mapRef}
                initialRegion={driverLocation}
                followsUserLocation={true}
                showsUserLocation={true}
                showsMyLocationButton={true}
                style={{ height: '100%', width: '100%' }}
              >
                <Marker.Animated
                  coordinate={new AnimatedRegion(driverLocation)}
                  ref={markerRef}
                >
                  <Image
                    source={BikeImage}
                    style={{
                      width: 40,
                      height: 40,
                      transform: [
                        {
                          rotate: `${
                            driverLocation?.heading ? driverLocation.heading : 0
                          }deg`,
                        },
                      ],
                    }}
                    resizeMode='contain'
                  />
                </Marker.Animated>
                <Marker.Animated
                  coordinate={destinationLocation}
                  title={'Receiver'}
                >
                  <Callout tooltip>
                    <View className='border bg-custom_blue-900 p-1 rounded-lg'>
                      <Text className='text-sm text-custom_white-100'>
                        Receiver's Location
                      </Text>
                    </View>
                  </Callout>
                </Marker.Animated>
                <MapViewDirections
                  origin={driverLocation}
                  destination={destinationLocation}
                  resetOnChange={false}
                  apikey={apiKeyConfig}
                  optimizeWaypoints={true}
                  strokeWidth={5}
                  mode='DRIVING'
                  strokeColor='#2A00FF'
                  onReady={(data) => {
                    setDuration(data.duration.toFixed(2))
                    setDistance(data.distance.toFixed(2))
                  }}
                ></MapViewDirections>
              </MapView>
              <View className=' pl-2 absolute top-0 w-80 rounded-b  h-14  flex flex-row justify-around items-center bg-custom_blue-200'>
                <View className='flex flex-row space-x-2'>
                  <Text className=' text-custom_white-100 text-3xl font-sanBold_700'>
                    {duration} min
                  </Text>
                </View>
                <Text className='text-3xl font-sanBold_700 text-custom_white-100'>
                  {distance} Km
                </Text>
              </View>
              <View className='absolute bottom-0 inset-x-0 h-36 rounded-t-3xl  px-5 bg-custom_white-100'>
                <View className='w-10 h-1 rounded-xl bg-custom_white-600 mx-auto mt-2'></View>
                <View className='flex flex-row justify-between mt-2'>
                  <View className='mt-2'>
                    <Text className='font-bold text-lg'>{delivery?.agent_id?.name}</Text>
                    <Stars noStars={5} />
                  </View>
                  <TouchableOpacity
                    className='border border-custom_blue-200 p-2 px-4 rounded self-center'
                    onPress={() => {
                      callNumber(delivery?.agent_id?.phone)
                    }}
                  >
                    <Text className='font-bold border-custom_blue-200'>
                      Call
                    </Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  className=' w-full mx-2 p-2 mt-3 bg-custom_blue-200 rounded-xl'
                  onPress={handlePresentModal}
                >
                  <Text className='text-center font-bold text-custom_white-100'>
                    Delivered {order.payment_method === 'cash' ? '& Paid' : ''}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          <Spinner
            visible={isLoading}
            textContent={'Loading...'}
            textStyle={{ color: '#fff' }}
          />
        </SafeAreaView>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={1}
          snapPoints={snapPoints}
          backgroundStyle={{ borderRadius: 30, backgroundColor: '#ffffff' }}
          onDismiss={() => setIsOpen(false)}
        >
          <RatingModal
            order_id={order_id}
            delivery_id={delivery?.delivery_id}
            agent={delivery?.agent_id?.name}
            sender={order?.sender_id?.name}
            receiver={order?.receiver_id?.name}
            closeModal={handleCloseModal}
          />
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  )
}

const RatingModal = ({ delivery_id, sender, receiver, closeModal, order_id, agent }) => {
  const token = useSelector((state) => state.auth.user_data.token)
 

  const [ratings, setRatings] = useState(0)
  const [comment, setComment] = useState('')

  const ratingDescription = {
    1: 'Very Poor',
    2: 'Below Average',
    3: 'Average',
    4: 'Good',
    5: 'Excellent',
  }
  const queryClient = useQueryClient()
  const makeRatings = async ()=>{
   
    
    const res = await api.post(
      '/customer/order/feedback',
      {
        order_id,
        delivery_id,
        ratings,
        comment,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    return res.data
  }
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const {mutate, isLoading, error} = useMutation(
    makeRatings,
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['pendingOrders'] })
        queryClient.invalidateQueries({ queryKey: ['deliveredOrders'] })
        navigation.navigate('Home')
        
      },
      onError:(err)=>{
        console.log(err)
      }

    }
  )



  return (
    <View className='w-full h-full flex  items-center  '>
      <Text className=' font-sanBold_500 text-xl mt-9'>Rate Delivery By</Text>
      <Text className='mt-5 font-sanBold_700 text-lg text-custom_blue-200'>
{agent}
      </Text>
      <Text className='font-sanBold_700 text mt-4 text-custom_orange-500'>
        {ratings > 0 ? ratingDescription[`${ratings}`] : 'Click to Rate'}
      </Text>
      <View className='flex flex-row mx-auto mt-4'>
        {Array(5)
          .fill()
          .map((_, i) => {
            if (i + 1 <= ratings) {
              return (
                <Icon.Star
                  color={'#FFD700'}
                  className='m-1'
                  height={40}
                  width={40}
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
                  onPress={() => setRatings(i + 1)}
                />
              )
            }
          })}
      </View>
      <TextInput
        className='border  rounded-lg px-2  mx-4 mt-5 bg-custom_white-100'
        multiline={true}
        numberOfLines={5}
        focusable={true}
        placeholder='Extra Information (Optional) '
        value={comment}
        onChangeText={(e) => {
          console.log(e)
          setComment(e)
        }}
      />
      <TouchableOpacity
        className='p-2 bg-custom_blue-200 rounded w-1/2 mt-10'
        onPress={mutate}
      >
        <Text className='text-center font-sanBold_700 text-custom_white-400'>
          {isLoading ? <ActivityIndicator color={'white'} /> : 'Submit'}
        </Text>
      </TouchableOpacity>
    </View>
  )
}


export default OrderTracking
