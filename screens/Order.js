import { View, Text, StatusBar, Pressable, Image, ScrollView} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React,{Suspense} from 'react'
import clsx from 'clsx'
import { Motion } from '@legendapp/motion'
import { useQueryClient } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import NotFoundSvg from '../assets/images/order/notFound.svg'
import { current } from '@reduxjs/toolkit'
import bulk from '../assets/images/services/bulk.png'
import documentImg from '../assets/images/services/document.png'
import sortable from '../assets/images/services/sortable.png'
import fragile from '../assets/images/services/fragile.png'
import { formatDate, formatNumberWithCommas } from '../lib/utils'
import { useNavigation } from '@react-navigation/native'
import BackBtn from '../components/BackBtn'
const Order = () => {
  let deliveredOrders = useSelector(state=>state.order.delivered)
  let pendingOrders = useSelector((state) => state.order.pending)
  const navigation = useNavigation()
  const [currentTab, setCurrentTab] = React.useState('pending')
  const handleScreenChange = (screen) => {
    setCurrentTab(screen)
  }
 
  const showNotfound = currentTab === 'pending' ? pendingOrders.length === 0 : deliveredOrders.length === 0
  //sort pending orders
  //sort by date and also accepted should be the first
 
  
  return (
    <Suspense
      fallback={
        <View>
          <Text>Loading...</Text>
        </View>
      }
    >
      <SafeAreaView className=' flex-1 bg-custom_white-100 opacity-95'>
        {/* <Text className='text-3xl text-red-600'>Introducti</Text> */}
        <StatusBar barStyle='dark-content' backgroundColor='#808080' />

        <View className='bg-[#e0e0e0]'>
          {/* navigation */}

          <BackBtn />

          <Text className='text-center font-medium py-3'>My Orders</Text>
          <View className='flex flex-row justify-between'>
            <Motion.Pressable
              className={clsx(
                'w-1/2 py-2 pb-4 transition-all ',
                currentTab === 'pending' &&
                  'border-b-custom_blue-200 border-b-2 text-custom_blue-200'
              )}
              onPress={() => handleScreenChange('pending')}
            >
              <Text
                className={clsx(
                  'font-medium text-center',
                  currentTab === 'pending' && ' text-custom_blue-200'
                )}
              >
                Pending
              </Text>
            </Motion.Pressable>
            <Motion.Pressable
              className={clsx(
                'w-1/2 py-2 pb-4 transition-all ',
                currentTab !== 'pending' &&
                  'border-b-custom_blue-200 border-b-2 text-custom_blue-200'
              )}
              onPress={() => handleScreenChange('delivered')}
            >
              <Text
                className={clsx(
                  'font-medium text-center',
                  currentTab !== 'pending' && ' text-custom_blue-200'
                )}
              >
                Delivered
              </Text>
            </Motion.Pressable>
          </View>
        </View>
        {!showNotfound && (
          <ScrollView className='mt-3 px-3  space-y-3 '>
            {/* pending */}
            {/* can be pending or ongoing delivery */}
            {currentTab === 'pending' &&
              pendingOrders.map((order) => (
                <SinglePendingOrder order={order} />
              ))}
            {currentTab === 'delivered' &&
              deliveredOrders.map((order) => (
                <SingleDeliveredOrder order={order} />
              ))}
            {/* delivered */}
          </ScrollView>
        )}
        <View>
          {showNotfound && (
            <View className='w-full top-52 flex justify-center items-center '>
              <NotFoundSvg className='w-8 h-8 ' width={100} height={100} />
              <Text className='  font-bold text-xl text-[#808080]'>
                No Orders
              </Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    </Suspense>
  )
}

  //  {"category": "Sortables", "fee": 1000, "payment_by": "sender", "payment_means": "instant", "payment_method": "cash", "receiver_id": {"location_id": {"extra": null, "geocode": "Kinondoni ,66W3+Q3M, Dar es Salaam, Tanzania", "latitude": -6.75275763211196, "latitudeDelta": 0.006005423636554319, "longitude": 39.2026343755424, "longitudeDelta": 0.002999715507030487}, "name": "Gui", "phone": "26568"}, "sender_id": {"location_id": {"extra": null, "geocode": "Kinondoni ,66X2+8G Dar es Salaam, Tanzania", "latitude": -6.7516722, "latitudeDelta": 0.003, "longitude": 39.201334, "longitudeDelta": 0.003}, "name": "Dan", "phone": "56767"}, "status": "pending", "user_id": "ae14ad5c-2712-4106-9e8d-6460102ef000"}
const orderImg= {
  'Bulk': bulk,
  'Document': documentImg,
  'Fragile': fragile,
  'Sortables': sortable
}
const SinglePendingOrder = ({ order }) => {
  const navigation = useNavigation()
  return (
    <Pressable onPress={()=>{
      navigation.navigate('OrderDetails', {
        order_id: order.order_id
      })
    }}
    className='py-2'
    >
      <View className='flex flex-row py-2'>
        <View className='relative '>
          <Image
            source={orderImg[order.category]}
            className='w-16 h-16  rounded'
          />
          <Text className='absolute  top-5 pr-2  text-xs rounded-r-full bg-custom_blue-200/80 bg-opacity-40 text-custom_white-100 '>
            {order.category}
          </Text>
        </View>
        <View className='flex flex-row justify-between w-3/4 pl-2 border-b'>
          <View className='self-center'>
            <Text className='text-xs font-medium flex flex-row'>
              <Text className='font-normal'> Delivery ID:</Text> #
              {order.order_id.substring(0, 7)}
            </Text>
            <Text className='font-medium text-xs text-custom_white-600 mt-1'>
              {formatDate(order.created_at)}
            </Text>
          </View>
          <View className='self-center'>
            {order.status === 'accepted' ? (
              <Pressable className='p-1 rounded border border-custom_blue-200' onPress={()=>{
                navigation.navigate('OrderTracking', {
                  order_id: order.order_id
                })
              }}>
                <Text className='font-medium text-xs text-custom_blue-200 mt-1 uppercase'>
                  TRACK
                </Text>
              </Pressable>
            ) : (
              <Text className='font-medium text-xs text-[#9c8d05a1]  mt-1 uppercase'>
                PENDING...
              </Text>
            )}
            <Text className='font-medium text-xs text-center text-custom_white-600  mt-1'>
              {formatNumberWithCommas(order.fee)} /=
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  )
}
const SingleDeliveredOrder = ({ order }) => {
  const navigation = useNavigation()
  const color = order.status === 'delivered' ? '#007736' : '#FF0000'

  return (
    <Pressable
      onPress={() => {
        navigation.navigate('OrderDetails', {
          order_id: order.order_id,
        })
      }}
      className='py-2'
    >
      <View className='flex flex-row py-2'>
        <View className='relative '>
          <Image
            source={orderImg[order.category]}
            className='w-16 h-16  rounded'
          />
          <Text className='absolute  top-5 pr-2  text-xs rounded-r-full bg-custom_blue-200/80 bg-opacity-40 text-custom_white-100 '>
            {order.category}
          </Text>
        </View>
        <View className='flex flex-row justify-between w-3/4 pl-2 border-b'>
          <View className='self-center'>
            <Text className='text-xs font-medium flex flex-row'>
              <Text className='font-normal'> Delivery ID:</Text> #
              {order.order_id.substring(0, 7)}
            </Text>
            <Text className='font-medium text-xs text-custom_white-600 mt-1'>
              {formatDate(order.created_at)}
            </Text>
          </View>
          <View className='self-center '>
            <Text
              className={`font-bold text-xs text-[${color}]  mt-1 uppercase`}
              style={{
                color: color,
              }}
            >
              {order.status}
            </Text>

            <Text className='font-medium text-xs text-center text-custom_white-600  mt-1'>
              {formatNumberWithCommas(order.fee)} /=
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  )
}

export default Order