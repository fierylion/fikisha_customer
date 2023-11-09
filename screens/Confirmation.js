import { View, Text, TouchableOpacity, Pressable, ScrollView, ActivityIndicator } from 'react-native'
import React, {useRef, useState, useEffect} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import {useSelector} from 'react-redux'
import * as Icon from 'react-native-feather'
import { useNavigation } from '@react-navigation/native'
import {
  
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import MapRoute from '../components/MapRoute'
import useObtainDistance  from '../hooks/useObtainDistance'
import useFetch from '../hooks/useFetch'
import { useQueryClient } from '@tanstack/react-query'
// import { ScrollView } from 'react-native-reanimated/lib/typescript/Animated'
const Confirmation = () => {
  
 const navigation = useNavigation()
 
 
 const {request, auth:{user_data}} = useSelector((state)=>state);
 const [payMeans, setPayMeans] = useState('instant')
 const [payBy, setPayBy] = useState('sender')
 const [payWith, setPayWith] = useState('cash')

 const handleViewMap = ()=>{
  navigation.navigate('MapRoute', {
    
  })

 }
 const origin = `${request.senderInformation.location.latitude},${request.senderInformation.location.longitude}`
  const destination = `${request.receiverInformation.location.latitude},${request.receiverInformation.location.longitude}`
  const {obtainDistance, distance, duration, loading, error} = useObtainDistance()
 useEffect(() => {
    obtainDistance(origin, destination)



  }, [ request.senderInformation.location, request.receiverInformation.location])
  function parseDistance(distanceString) {
    // Regular expression to match value and unit in the distance string
    
    const regex = /^(\d+(\.\d+)?)\s*(m|km)\s*$/

    // Use the regex to match the value and unit
    const match = distanceString.match(regex)

    if (match) {
      // Extract the matched value and unit
      const value = parseFloat(match[1])
      const unit = match[3]

      return { value, unit }
    } else {
      // Return an error or handle invalid input as needed
      throw new Error('Invalid distance provided by google maps!!!')
    }
  }


 const details = [
   { type:'Sender Details',...request.senderInformation}, {...request.receiverInformation, type:'Receiver Details'}
 ]
 const summary =[
  {value:distance, type:'Distance', icon:Icon.Framer},
  {value:duration, type:'Duration', icon:Icon.Clock},
 ]
const calculatePriceInstant = ({ value, unit }) => {
  const profitRate = 0.2
  const pricePerKm = 400
  const cost = pricePerKm * (unit !== 'm' ? value : value / 1000)
  const addedCost = Math.round(cost * profitRate)
  const total = Math.round(cost + addedCost)
  if (total < 1000) return [1200, 200]
  return [total, addedCost]
}

const calculatePriceSharing = ({ value, unit }) => {
  const instantCost = calculatePriceInstant({ value, unit })

  // Calculate the cost per person (individual) in the sharing scenario
  const numberOfPeople = 3 
  const individualCost = Math.round(((instantCost[0]-instantCost[1]) / numberOfPeople)*2)

  return [individualCost, Math.round(individualCost.toFixed(0)/2)]
}


  const instantFee = (distance)?calculatePriceInstant(parseDistance(distance)): [0,0]
  const communityFee= distance?calculatePriceSharing(parseDistance(distance)):[0,0]
  
  const {obtainData,data, isLoading, error:fetchError} = useFetch()
 
  
   
   const handleConfirmation = () => {

    // {"category": "Sortables", "error": "", "receiverInformation": {"extra": "", "location": {"geocode": "Dar es Salaam ,66JH+5VX, Dar es Salaam, Tanzania", "latitude": -6.769535036982095, "latitudeDelta": 0.006005215159413879, "longitude": 39.229756873100996, "longitudeDelta": 0.002999715507030487}, "name": "Aisha", "phone": "762683980"}, "senderInformation": {"extra": "", "location": {"geocode": "Kinondoni ,66X2+CG Dar es Salaam, Tanzania", "latitude": -6.7514032, "latitudeDelta": 0.003, "longitude": 39.201334, "longitudeDelta": 0.003}, "name": "Juma", "phone": "754383279"}} instant sender cash 2592 864
  
   
    
    


    obtainData(
      '/customer/order',
      'post',
      {
        request,
        payMeans,
        payBy,
        payWith,
        fee:
          payMeans === 'instant'
            ? instantFee[0] 
            : communityFee[0],
        companyFee:
          payMeans === 'instant'
            ?  instantFee[1]
            : communityFee[1],
        distance,
        duration
      },
      {
        headers: {
          Authorization: `Bearer ${user_data.token}`,
        },
      }
    )

    


   
   }
   const queryClient = useQueryClient()

   useEffect(
    ()=>{
      if(data){
        console.log(data)
          navigation.navigate('OrderPlaced')
          queryClient.invalidateQueries({queryKey:['pendingOrders']})
      }
      if(fetchError){
      console.log(fetchError)
      }
    }, [data, error]
   )

 const mean = [
  {type:'Instant Delivery', value:`${instantFee[0]} Tzs`, icon:Icon.Users,  label:'instant'},{ type:'Community Sharing', value:`${communityFee[0]} Tzs`, icon:Icon.Zap,  label:'sharing'}
 ]
 const parties = [
  {label:'sender'},{label:'receiver'}
 ]
 const payment = [
  {label:'cash', title:'Cash on Delivery', description:'Pay after getting your order', icon:Icon.UserCheck},{label:'digital', title:'Mobile Payment', description:'Pay with your mobile ', icon:Icon.UserMinus}

  ]
  const [isOpen, setIsOpen]= useState(false)
  const bottomSheetModalRef = useRef(null)

  const snapPoints = ['90%', '90%']

  function handlePresentModal() {
    bottomSheetModalRef.current?.present()
    setTimeout(() => {
      setIsOpen(true)
    }, 100)
  }
  return (
    <SafeAreaView
      className=' flex-1 bg-custom_white-500'
      edges={['top', 'left', 'right']}
    >
      <GestureHandlerRootView>
        <BottomSheetModalProvider>
          <View className={` flex flex-row items-center px-4 py-3 ${isOpen? ' bg-custom_white-400':'bg-custom_white-100'}  `}>
            <Icon.ArrowLeft
              color={'gray'}
              height={30}
              width={30}
              onPress={() => navigation.goBack()}
            />
            <Text className='mx-auto font-sanBold_500 text-lg'>
              Order Confirmation
            </Text>
            <Icon.ArrowLeft />
          </View>
          <ScrollView>
            <View className='my-1 flex flex-row mx-2 rounded shadow-md p-3 bg-custom_white-100'>
              <Icon.Package color={'gray'} height={30} width={30} />
              <Text className='my-auto font-sanBold_500 pl-2 capitalize'>
                {request.category}
              </Text>
            </View>
            <View className='my-1  mx-2 rounded shadow-md p-3 bg-custom_white-100'>
              <View className='p-2'>
                {details.map((detail, index) => (
                  <View key={index} className={` ${index === 0 && 'pb-4'} `}>
                    <Text className='py-0.5 font-sanBold_700'>
                      {detail.type}
                    </Text>
                    <Text className='py-0.5 font-sanBold_500'>
                      {detail.name}
                    </Text>
                    <Text className='py-0.5 font-sanRegular_400 text-custom_orange-500 text-xs'>
                      +255{detail.phone}
                    </Text>
                    <Text className='py-0.5 font-sanSmall_300 text-xs'>
                      {detail.location.geocode}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
            <View className='my-1  mx-2 rounded shadow-md p-3 bg-custom_white-100'>
              <View>
                <Text className='font-sanBold_700'>Summary</Text>
                <TouchableOpacity
                  className='p-3 rounded bg-custom_white-400 opacity-75 my-2 w-24'
                  onPress={handlePresentModal}
                >
                  <Text className=' font-sanRegular_400'> View Map</Text>
                </TouchableOpacity>
                <View className=' flex-row justify-around my-2'>
                  {summary.map((data, index) => (
                    <View>
                      <View className='mb-1 flex-row'>
                        <data.icon
                          height={25}
                          width={20}
                          className='mr-1 p-2 rounded-full '
                          color={'gray'}
                        />
                        <Text className='font-sanBold_500 ml-1 my-auto'>
                          {data.type}
                        </Text>
                      </View>
                      <Text className='font-sanBold_700 text-center text-custom_orange-500'>
                        {data.value}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
            <View className='my-1  mx-2 rounded shadow-md p-3 bg-custom_white-100'>
              <View>
                <View className='flex flex-row'>
                  <Text className='font-sanBold_700 mr-1'>Fee</Text>
                  <Text className='text-xs self-end text-custom_blue-500'>
                    (Choose Means){' '}
                  </Text>
                </View>
                <View className='m-2 flex flex-row justify-between my-3'>
                  {mean.map((data, index) => (
                    <TouchableOpacity onPress={() => setPayMeans(data.label)}>
                      <View className='flex flex-row '>
                        <Icon.Circle
                          fill={payMeans === data.label ? 'blue' : 'white'}
                          color={'blue'}
                          className=' self-center mr-2 rounded-full'
                          width={20}
                          height={20}
                        />
                        <View>
                          <Text className=' font-sanBold_500 '>
                            {data.type}
                          </Text>
                          <View className='flex flex-row'>
                            <Text className='font-sanRegular_400 text-custom_orange-500'>
                              {data.value}
                            </Text>
                            <Text className='ml-1 text-xs text-custom_blue-200 self-end font-sanSmall_300'>
                              {data.label === 'sharing'
                                ? '(Save up to 60%)'
                                : ''}
                            </Text>
                          </View>
                        </View>
                        <View></View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
            <View className='my-1  mx-2 rounded shadow-md p-3 '>
              <View>
                <Text className='font-sanBold_700'>Payment By</Text>
                <View className='my-2 mt-4 flex flex-row justify-between mx-2'>
                  {parties.map((data, index) => (
                    <Pressable onPress={() => setPayBy(data.label)}>
                      <View className='flex-row'>
                        <Icon.Circle
                          fill={payBy === data.label ? 'blue' : 'white'}
                          color={'blue'}
                          className='  mr-2 rounded-full'
                          width={20}
                          height={20}
                        />

                        <Text className='font-sanBold_500 capitalize'>
                          {data.label}
                        </Text>
                      </View>
                    </Pressable>
                  ))}
                </View>
              </View>
            </View>
            <View className='my-1  mx-2 mb-5   '>
              <Text className='font-sanBold_700 ml-3'>Choose Method</Text>
              {payment.map((data, index) => {
                let Svg = data.icon
                const disp = data.label === payWith
                return (
                  <Pressable key={index} onPress={() => setPayWith(data.label)}>
                    <View className='flex-row rounded justify-between shadow-md p-2 bg-custom_white-100 my-2 px-2'>
                      <View className='flex-row '>
                        <Svg
                          className=' my-auto mx-3 transition-colors'
                          color={disp ? '#5f77f5' : '#000000'}
                          width={20}
                          height={20}
                        />
                        <View>
                          <Text className='font-sanBold_500'>{data.title}</Text>
                          <Text className='text-sm font-sanSmall_300'>
                            {data.description}
                          </Text>
                        </View>
                      </View>
                      {disp && (
                        <Icon.CheckCircle className='self.center text-custom_blue-200 my-auto' />
                      )}
                    </View>
                  </Pressable>
                )
              })}
            </View>
            <View className='mx-2   mb-5'>
              <TouchableOpacity
                className='rounded p-3 bg-custom_blue-500 '
                onPress={handleConfirmation}
              >
                <Text className='text-center text-custom_white-100'>
                  {' '}
                  Confirm Order
                </Text>
              </TouchableOpacity>
            </View>
            <View className=' mb-16'>

            </View>
            <BottomSheetModal
              ref={bottomSheetModalRef}
              
              
              snapPoints={snapPoints}
              index={1}
              backgroundStyle={{ borderRadius: 50, opacity:75, backgroundColor:'#ffe' }}
              onDismiss={() => setIsOpen(false)}
            >
              <MapRoute origin={request.senderInformation.location} destination={request.receiverInformation.location} />
            </BottomSheetModal>
          </ScrollView>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </SafeAreaView>
  )
}

export default Confirmation