import { View, Text } from 'react-native'
import React from 'react'
import MapView, {Marker} from 'react-native-maps'

const MapSinglePoint = ({latLng}) => {
  const initialRegion = {
    latitude: latLng.latitude, // Calculate the average latitude
    longitude: latLng.longitude, // Calculate the average longitude
    latitudeDelta: 0.003, // Adjust the factor as needed
    longitudeDelta: 0.003, // Adjust the factor as needed
  }
  
  return (
    <View className='w-full h-full relative'>
      <MapView
        initialRegion={initialRegion}
        className='w-full h-full'
        zoomEnabled={true}
      >
        <Marker
          coordinate={{
            longitude: latLng.longitude,
            latitude: latLng.latitude,
          }}
          title='Location'
          description="Location"
        ></Marker>
      </MapView>
    </View>
  )
}

export default MapSinglePoint