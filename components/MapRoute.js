import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView, initialWindowMetrics } from 'react-native-safe-area-context'
import {BottomSheetModal} from '@gorhom/bottom-sheet'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import MapView, {Marker, Callout} from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions'
import apiKeyConfig from '../apiKeyConfig'

const MapRoute = ({origin, destination}) => {
  const [duration, setDuration] = useState('')
  const [distance, setDistance] = useState('')
  const originLatitude = parseFloat(origin.latitude)
  const originLongitude = parseFloat(origin.longitude)
  const destinationLatitude = parseFloat(destination.latitude)
  const destinationLongitude = parseFloat(destination.longitude)
const initialRegion = {
  latitude: (originLatitude + destinationLatitude) / 2, // Calculate the average latitude
  longitude: (originLongitude + destinationLongitude) / 2, // Calculate the average longitude
  latitudeDelta: Math.abs(originLatitude - destinationLatitude) * 1.2, // Adjust the factor as needed
  longitudeDelta: Math.abs(originLongitude - destinationLongitude) * 1.2, // Adjust the factor as needed
}



    
  
  return (
    <View className='w-full h-full relative'>
      <MapView
        initialRegion={initialRegion}
        className='w-full h-full'
        zoomEnabled={true}
      >
        <Marker
          coordinate={origin}
          title='Sender'
          description="Sender's Location"
        >
          <Callout tooltip >
            <View className='border bg-custom_blue-900 p-1 rounded-lg'>
              <Text className='text-sm text-custom_white-100'>
                Sender's Location
              </Text>
            </View>
          </Callout>
        </Marker>
        <Marker
          coordinate={destination}
          title='Receiver'
          description="Receiver's Location"
          
        >
          <Callout tooltip >
            <View className='border bg-custom_blue-900 p-1 rounded-lg'>
              <Text className='text-sm text-custom_white-100'>
                Receiver's Location
              </Text>
            </View>
          </Callout>
        </Marker>

        <MapViewDirections
          origin={origin}
          destination={destination}
          apikey={apiKeyConfig}
          optimizeWaypoints={true}
          strokeWidth={2}
          mode='DRIVING'
          strokeColor='hotpink'
          onReady={(data) => {
            setDuration(data.duration.toFixed(2))
            setDistance(data.distance.toFixed(2))
          }}
        ></MapViewDirections>
      </MapView>
      <View className=' absolute top-2 left-5 '>
        <Text className=' font-sanBold_500 text-custom_red-200 text-sm '>Distance: {distance} Km</Text>
        <Text  className=' font-sanBold_500  text-custom_red-200 text-sm'>Duration: {duration} min</Text>

      </View>
    </View>
  )
}

export default MapRoute