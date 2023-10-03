import { View, Text, Dimensions, Image, ActivityIndicator } from 'react-native'
import React from 'react'
import Carousel from 'react-native-reanimated-carousel'
import featured1 from '../../assets/images/featured/featured1.jpg'
import featured2 from '../../assets/images/featured/featured2.jpg'
import featured3 from '../../assets/images/featured/featured3.jpg'
import featured4 from '../../assets/images/featured/featured4.png'

const FeatureImages = () => {
 const width = Dimensions.get('window').width;
 const height = Dimensions.get('window').height
 const images = [featured4, featured4, featured4, featured4]
  return (
    <View className='mt-7'>
      <Carousel
        loop
        width={width}
        height={height / 4}
        autoPlay={true}
        data={images}
        mode='parallax'
        scrollAnimationDuration={1000}
        onSnapToItem={(index) => {}}
        renderItem={({ index, item }) => (
          <View className=' pb-9 justify-center flex-1 '>
            <Image source={item} className='rounded-xl' />
          </View>
        )}
      ></Carousel>
     
    </View>
  )
}

export default FeatureImages