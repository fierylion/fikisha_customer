import { View, Text,Image, Pressable } from 'react-native'
import React from 'react'
import bulk from '../../assets/images/services/bulk.png'
import documentImg from '../../assets/images/services/document.png'
import sortable from '../../assets/images/services/sortable.png'
import fragile from '../../assets/images/services/fragile.png'
import { useNavigation } from '@react-navigation/native'
import { useDispatch } from 'react-redux'
import { modifyData } from '../../store/requestSlice'
const Services = () => {
  const navigation = useNavigation()
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
     description:
       'Delicate and breakable items receive the utmost care.',
     screen: 'Checkout',
     img: fragile,
   },
 ]
 const dispatch = useDispatch()

  return (
    <View className='font-sanBold_700'>
      <View>
        <Text className='ml-4 font-sanBold_700 text-[16px] '>
          What are you delivering today?
        </Text>
      </View>
      <View className='flex  flex-row flex-wrap mx-1 my-5'>
        {items.map((item, ind) => (
          <View className={'w-1/2 p-2  '} key={ind}>
            <Pressable
              onPress={() => {
                const screen = item.screen;
                if(item.screen==='Checkout'){
                dispatch(modifyData({type:'CATEGORY', data:item.name}))
                
                }
                navigation.navigate(item.screen)
               
              }}
            >
              <View className=' rounded p-2 shadow-lg bg-custom_white-400'>
                <Image
                  source={item.img}
                  className={`w-16 h-16 ${ind < 2 ? 'p-2' : ''} `}
                />
                <Text className='text-bold font-sanBold_500 my-2'>
                  {item.name}
                </Text>
                <Text className='text-xs text-left font-sanRegular_400 mb-1'>
                  {item.description}
                </Text>
              </View>
            </Pressable>
          </View>
        ))}
      </View>
    </View>
  )
}



export default Services