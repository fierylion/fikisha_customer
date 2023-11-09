import { View, Text } from 'react-native'
import React from 'react'
import * as Icon from 'react-native-feather'


const Stars = ({noStars}) => {
  return (
    <View className='flex flex-row'>
      {Array(5)
        .fill()
        .map((_, i) => {
          if (i + 1 <= noStars) {
            return (
              <Icon.Star
                color={'#FFD700'}
                className='m-1'
                height={25}
                width={25}
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
              />
            )
          }
        })}
    </View>
  )
}

export default Stars