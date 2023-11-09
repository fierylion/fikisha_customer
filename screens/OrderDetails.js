import { View, Text, StatusBar, BackHandler, Pressable, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRoute, useNavigation } from '@react-navigation/native'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {useSelector} from 'react-redux'
import { api } from '../api'
import Spinner from 'react-native-loading-spinner-overlay'
import * as Icon from 'react-native-feather'
import { formatDate } from '../lib/utils'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet'
import Close from '../components/Close'
import bulk from '../assets/images/services/bulk.png'
import documentImg from '../assets/images/services/document.png'
import sortable from '../assets/images/services/sortable.png'
import fragile from '../assets/images/services/fragile.png'
import ProfileSvg from '../assets/profile.svg'
import { formatNumberWithCommas } from '../lib/utils'

const OrderDetails = () => {
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
const user_data = useSelector((state) => state.auth.user_data)
 const {order_id} = useRoute().params
 const bottomSheetModalRef = React.useRef(null)
 const [isOpen, setIsOpen] = React.useState(false)
 const snapPoints = React.useMemo(() => ['50%', '50%'], [])
 const navigation = useNavigation()
 function handlePresentModal() {
   bottomSheetModalRef.current?.present()
   setIsOpen(true)
 }


 const fetchOrderDetails= async () => {
   const res = await api.get(`/customer/order/${order_id}`, {
     headers: {
       Authorization: `Bearer ${user_data.token}`,
     },
   })
   return res.data
 }
 const { data, isLoading} = useQuery({
   queryKey: ['orderDetails', order_id],
   queryFn: fetchOrderDetails,
  
   onSuccess: (data) => {
     console.log(data)
   },
 })
 const order= data?.details?.order
 const delivery = data?.details?.delivery

 const orderImg = {
   Bulk: bulk,
   Document: documentImg,
   Fragile: fragile,
   Sortables: sortable,
 }
 const queryClient = useQueryClient()
 const {mutate} = useMutation(
    async () => {
      console.log(user_data.token)
      const res = await api.get(
        `/customer/order/cancel/${order_id}`,
        {
          headers: {
            Authorization: `Bearer ${user_data.token}`,
          },
        }
      )
      return res.data

      },
      {
        onSuccess: (data) => {
           queryClient.invalidateQueries({ queryKey: ['pendingOrders'] })
           queryClient.invalidateQueries({ queryKey: ['deliveredOrders'] })
           navigation.navigate('Home')

        },
      }
 )
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: 'gray' }}>
      <BottomSheetModalProvider>
        <SafeAreaView
          className=' flex-1 bg-custom_white-500'
          edges={['top', 'left', 'right']}
        >
          {/* <Text className='text-3xl text-red-600'>Introducti</Text> */}
          <StatusBar barStyle='dark-content' backgroundColor='#808080' />
          <Spinner
            visible={isLoading}
            textContent={'Loading...'}
            textStyle={{ color: '#fff' }}
          />
          <View className='mt-1 flex flex-row items-center mx-3'>
            <Icon.ArrowLeft
              color={'gray'}
              height={30}
              width={30}
              onPress={() => navigation.goBack()}
            />
            <Text className='mx-auto font-sanBold_500 text-lg'>
              Order Details
            </Text>
            <Icon.ArrowLeft />
          </View>
          {data && (
            <View>
              {delivery && (
                <View className='mt-4'>
                  <View className='flex flex-row justify-between mx-4'>
                    <View>
                      <Text className='font-semibold text-lg'>
                        Driver Name: Alex
                      </Text>
                      <Text className=' text-custom_white-600 '>
                        {formatDate(order.updated_at)}
                      </Text>
                    </View>
                    {order.status === 'accepted' && (
                      <Pressable
                        className='p-1 rounded border border-custom_blue-200 self-start px-4 py-2'
                        onPress={() => {
                          navigation.navigate('OrderTracking', {
                            order_id: order.order_id,
                          })
                        }}
                      >
                        <Text className='font-medium text-xs text-custom_blue-200  uppercase '>
                          TRACK
                        </Text>
                      </Pressable>
                    )}
                  </View>
                  <Pressable
                    className='py-4 rounded-full bg-custom_white-600/20 mx-3 my-3'
                    onPress={handlePresentModal}
                  >
                    <Text className='text-center  font-bold'>
                      View Driver Details
                    </Text>
                  </Pressable>
                </View>
              )}
              <View className='px-3 mt-2'>
                <View className='border-y-2 border-y-custom_white-600 flex flex-row justify-between py-3'>
                  <Text>
                    Charge Mode:{' '}
                    <Text className='font-medium text-custom_blue-200 capitalize'>
                      {order.payment_means}
                    </Text>
                  </Text>
                  <View className='flex flex-row '>
                    <Icon.Circle
                      className={' my-auto'}
                      width={15}
                      height={15}
                      fill={
                        order.status === 'accepted'
                          ? '#1330EB'
                          : order.status === 'pending'
                          ? '#D3CF06'
                          : order.status === 'delivered'
                          ? '#04CD07'
                          : '#EE0000'
                      }
                    />
                    <Text className='capitalize my-auto mx-1'>
                      {order.status}
                    </Text>
                  </View>
                </View>
                <Text className='font-semibold text-lg mt-3'>Details</Text>
                <View>
                  <View className='bg-custom_white-400 p-2 rounded-lg space-y-1'>
                    <Text className='font-medium '>Sender Details</Text>
                    <Text className=''>{order.sender_id.name}</Text>
                    <Text className='font-light text-xs'>
                      {order.sender_id.location_id.geocode}
                    </Text>
                    <Text className=' '>{order.sender_id.phone}</Text>
                  </View>
                  <View className='bg-custom_white-400 p-2 rounded-lg space-y-1 mt-4'>
                    <Text className='font-medium '>Receiver Details</Text>
                    <Text className=''>{order.receiver_id.name}</Text>
                    <Text className='font-light text-xs'>
                      {order.receiver_id.location_id.geocode}
                    </Text>
                    <Text className=' '>{order.receiver_id.phone}</Text>
                  </View>
                </View>
                <View className='bg-custom_white-400 p-2  mt-4 rounded-lg'>
                  <Text>Parcel Category</Text>
                  <View className='flex flex-row mt-1'>
                    <Image
                      source={orderImg[order.category]}
                      className='w-16 h-16  rounded'
                    />
                    <View className='pl-2 my-auto'>
                      <Text className=''>{order.category}</Text>
                      <Text className='opacity-50'>{order.category}</Text>
                    </View>
                  </View>
                </View>
                <View className='bg-custom_white-400 p-2  mt-4 rounded-lg'>
                  <Text className='font-medium'>Payment</Text>
                  <View className='flex flex-row mt-1'>
                    <Text className=''>Pay Means</Text>
                    <Text className='ml-auto font-medium capitalize w-14'>
                      {order.payment_method}
                    </Text>
                  </View>
                  <View className='flex flex-row  justify-between mt-1'>
                    <Text className=''>Pay By</Text>
                    <Text className='  font-medium capitalize w-14'>
                      {order.payment_by}
                    </Text>
                  </View>

                  <View className='flex flex-row mt-1'>
                    <Text className='font-medium'>Amount</Text>
                    <Text className='font-medium ml-auto '>
                      {formatNumberWithCommas(order.fee)} /=
                    </Text>
                  </View>
                </View>
              </View>
              {order.status==='pending' && <TouchableOpacity className='bg-custom_red-200 opacity-90 py-2 rounded-lg  w-3/4 mx-auto mt-4' onPress={mutate}>
                <Text className='text-custom_white-100 font-bold text-center'>Cancel Order</Text>
              </TouchableOpacity>}
            </View>
          )}
        </SafeAreaView>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={1}
          snapPoints={snapPoints}
          backgroundStyle={{ borderRadius: 50, backgroundColor: '#D1D1D1' }}
        >
          <View className='relative h-full w-full'>
            <Close onClose={() => bottomSheetModalRef.current?.close()} />
            <View className='flex  items-center '>
              <View className='rounded-full bg-custom_white-500 w-32 h-32 mt-10'>
                <Icon.User
                  width={60}
                  height={60}
                  color={'gray'}
                  className='m-auto'
                />
              </View>
              <Text className='text-center font-semibold text-lg mt-3'>
                {delivery?.agent_id?.name}
              </Text>
            </View>

            <View className='absolute bottom-9 left-5 '>
             
              <Text className='pt-3'>Phone Number</Text>
              <Text className='text-lg font-semibold '>{delivery?.agent_id?.phone}</Text>
            </View>
          </View>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  )
}

export default OrderDetails
