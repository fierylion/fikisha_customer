import { View, Text, StatusBar, BackHandler, Alert, TextInput, Image, TouchableOpacity, Pressable} from 'react-native'
import React,{useEffect, useRef} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { apiWS } from '../api'
import { useDispatch, useSelector } from 'react-redux'

import * as Icon from 'react-native-feather';
import {FeatureImages, Services} from '../components/HomePageComponents'
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { addDeliveries } from '../store/orderSlice';
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../api';
import MapView, { Marker } from 'react-native-maps';
import bulk from '../assets/images/services/bulk.png'
import documentImg from '../assets/images/services/document.png'
import sortable from '../assets/images/services/sortable.png'
import fragile from '../assets/images/services/fragile.png'
import { modifyData } from '../store/requestSlice'
import { useNavigation } from '@react-navigation/native'

import * as Location from 'expo-location'

const Home = () => {
  const dispatch = useDispatch()
  const user_data = useSelector((state) => state.auth.user_data)
  const queryClient = useQueryClient()
  const mapRef = useRef(null)
   const obtainDriverLocation = async () => {
     // get driver location
     // return driver location

     let { status } = await Location.requestForegroundPermissionsAsync()
     if (status !== 'granted') {
       Alert.alert('Location permission is required to use this feature')
       return
     }
     let location = await Location.getCurrentPositionAsync({})
     return {
       latitude: location.coords.latitude,
       longitude: location.coords.longitude,
     }
   }
   useEffect(
    ()=>{
      
      if(!mapRef.current) return
      obtainDriverLocation().then((loc)=>{
        console.log(loc)
        if(loc){
          mapRef.current.animateToRegion({
            latitude: loc.latitude,
            longitude: loc.longitude,
            latitudeDelta: 0.0622,
            longitudeDelta: 0.0621,
          })
        }
      }
      )

    }, [mapRef]
   )
  const handleBackButton = () => {
    // Show a confirmation dialog when the back button is pressed
    Alert.alert(
      'Exit App',
      'Do you want to exit the app?',
      [
        {
          text: 'Cancel',
          onPress: () => null, // Do nothing if the user cancels
          style: 'cancel',
        },
        {
          text: 'Exit',
          onPress: () => BackHandler.exitApp(), // Exit the app if the user confirms
        },
      ],
      { cancelable: false }
    )
    return true // Return true to prevent the default back button behavior
  }

  // Add a listener for the hardware back button
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
  const navigation = useNavigation()
  //fetch orders
  const fetchPendingOrders = async () => {
    const res = await api.get('/customer/orders/pending', {
      headers: {
        Authorization: `Bearer ${user_data.token}`,
      },
    })
    return res.data
  }
  const fetchDeliveredOrders = async () => {
    const res = await api.get('/customer/orders/completed', {
      headers: {
        Authorization: `Bearer ${user_data.token}`,
      },
    })
    return res.data
  }
  const { data: deliveredOrders, isLoading: deliveredLoading } = useQuery({
    queryKey: ['deliveredOrders'],
    queryFn: fetchDeliveredOrders,
    onSuccess: (data) => {
      dispatch(
        addDeliveries({
          type: 'ADD_DELIVERED',
          data: data.orders,
        })
      )
    },
  })
  const { data: pendingOrders, isLoading: pendingLoading } = useQuery({
    queryKey: ['pendingOrders'],
    queryFn: fetchPendingOrders,
    onSuccess: (data) => {
      dispatch(
        addDeliveries({
          type: 'ADD_PENDING',
          data: data.orders,
        })
      )
    },
  })

  //update orders
  useEffect(() => {
    const socket = new WebSocket(`${apiWS}/orders/user/${user_data.customer.id}/`)

    socket.onmessage = (e) => {
      console.log(e)
      const data = JSON.parse(e.data)
      const { type} = data
      if (type==='pending') {
        queryClient.invalidateQueries({ queryKey: ['pendingOrders'] })
      }
      if(type==='delivered'){
        queryClient.invalidateQueries({ queryKey: ['deliveredOrders'] })
      }

      // obtainDriverLocation()
      //   .then((loc) => {
      //     dispatch(
      //       addOrders({
      //         data: {
      //           orders: data.orders,
      //           location: loc,
      //         },
      //         type: 'ADD_ORDERS',
      //       })
      //     )
      //   })
      //   .catch((err) => console.log(err))
    }
    socket.onopen = (e) => {
      console.log('orders connected')
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
  }, [user_data])
   const items = [
     {
       name: 'Sortables',
       description: 'Swift, secure delivery for items under 10kg.',
       screen: 'Checkout',
       img: sortable,
     },
     {
       name: 'Bulk',
       description: 'Heavy cargo handled with care for items over 10kg.',
       screen: 'Checkout',
       img: bulk,
     },
     {
       name: 'Document',
       description: 'For thin and crucial documents, secure transport',
       screen: 'Checkout',
       img: documentImg,
     },
     {
       name: 'Fragile',
       description: 'Delicate and breakable items receive the utmost care.',
       screen: 'Checkout',
       img: fragile,
     },
   ]

  return (
    <SafeAreaView
      className=' flex-1 bg-transparent '
      edges={['top', 'left', 'right']}
    >
      {/* <Text className='text-3xl text-red-600'>Introducti</Text> */}
      <StatusBar barStyle='dark-content' backgroundColor='#808080' />
      <View className='flex-1 relative'>
        <MapView
        ref={mapRef}
          followsUserLocation={true}
          showsUserLocation={true}
          showsMyLocationButton={true}
          style={{ width: '100%', height: '100%', opacity: 0.5 }}
        ></MapView>
      </View>
      <View className='h-[55%]  rounded-t-xl inset-x-0 bg-custom_white-100'>
        <View className='w-14 h-1 bg-custom_white-400 rounded-3xl mt-3 mx-auto'></View>
        <TextInput
          placeholder='Enter Location Id'
          className='w-80 h-14 mt-5 mx-auto rounded-xl bg-custom_white-400 placeholder:text-custom_black-100 placeholder:pl-3  placeholder:font-sanBold_700'
        ></TextInput>
        <Text className='font-sanBold_700 ml-4 my-3'>
          What are you delivering today ?
        </Text>
        <View className='px-4 flex flex-row   flex-wrap '>
          {items.map((it) => {
            return (
              <TouchableOpacity
                className='p-1 border m-2 rounded  border-custom_white-500 w-40 flex flex-row '
                onPress={() => {
                  const screen = it.screen
                  if (it.screen === 'Checkout') {
                    dispatch(modifyData({ type: 'CATEGORY', data: it.name }))
                  }
                  navigation.navigate(it.screen)
                }}
              >
                <Image source={it.img} className='w-10 h-10 p-2 self-start ' />
                <Text className='font-sanBold_500 my-auto pl-1'>{it.name}</Text>
              </TouchableOpacity>
            )
          })}
        </View>
        <View>
          <Text className='font-sanBold_700 ml-4 my-3'>
            Create Location ID for your business ?
          </Text>
          <View className='mx-auto shadow-lg rounded-lg   w-40 py-2 bg-custom_blue-200'>
            <Pressable onPress={() => navigation.navigate('LocationID')}>
              <View className='m-auto flex flex-row'>
                <Icon.PlusCircle className=' text-custom_white-400' />
                <Text className='self-center font-sanBold_500 ml-1 text-custom_white-400'>
                  New
                </Text>
              </View>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Home