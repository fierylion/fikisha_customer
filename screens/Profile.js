import { View, Text, StatusBar, useWindowDimensions, Image, Pressable} from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
//svg icons
import profile from '../assets/images/settings/profile.svg'
import location from '../assets/images/settings/locationID.svg'
import language from '../assets/images/settings/language.svg'
import savedAddress from '../assets/images/settings/address.svg'
import refundPolicy from '../assets/images/settings/refund.svg'
import beDriver from '../assets/images/settings/driver.svg'
import help from '../assets/images/settings/help.svg'
import liveSupport from '../assets/images/settings/live_support.svg'
import terms from '../assets/images/settings/terms.svg'
import about from '../assets/images/settings/about.svg'
import share from '../assets/images/settings/share.svg'
import logout from '../assets/images/settings/logout.svg'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { clearAuthData } from '../store/authSlice';
import { useDispatch } from 'react-redux';
const Profile = () => {

  
  const { width } = useWindowDimensions()
  const bottomSheetModalRef = React.useRef(null)
  const [isOpen, setIsOpen] = React.useState(false)
  const snapPoints = React.useMemo(() => ['75%', '75%'], [])
  const navigation = useNavigation();
  function handlePresentModal(){
    bottomSheetModalRef.current?.present()
    setIsOpen(true) 
  }
  useEffect(() => {
    if(isOpen) return
    handlePresentModal()
  }, [isOpen])
  const features = [
    {name:'Profile', img:profile, label:'Profile'},{name:'Create Location ID', img:location, label:'LocationID'}, {name:'Language', img:language, label:'Language'}, {name:'Saved Address', img:savedAddress, label:'SavedAddress'},{name:'Refund Policy', img:refundPolicy, label:'RefundPolicy'},{name:'Be a driver', img:beDriver, label:'BeDriver'},  {name:'Help', img:help, label:'Help'},{name:'Live Support', img:liveSupport, label:'LiveSupport'},
    {name:'Terms & Conditions', img:terms, label:'Terms'},{name:'About Us', img:about, label:'About'} ,{name:'Share to Friends', img:share, label:'Share'}, {name:'Logout', img:logout, label:'Logout'}
  ]
    const itemsPerRow = 3

   
    const splitFeaturesIntoRows = () => {
      const rows = []
      for (let i = 0; i < features.length; i += itemsPerRow) {
        rows.push(features.slice(i, i + itemsPerRow))
      }
      return rows
    }
    const dispatch = useDispatch()
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: 'gray' }}>
      <BottomSheetModalProvider>
        <View
          style={{
            backgroundColor: 'gray',
          }}
        >
          <StatusBar barStyle='dark-content' />
          <BottomSheetModal
            ref={bottomSheetModalRef}
            index={1}
            snapPoints={snapPoints}
            backgroundStyle={{ borderRadius: 50, backgroundColor: '#D3D3D3' }}
            onDismiss={() => {
              navigation.navigate('Home', { screen: 'Dashboard' })
              setIsOpen(false)
            }}
          >
            <View className='mx-3 mt-3 '>
              {splitFeaturesIntoRows().map((row, index) => (
                <View
                  key={index}
                  className='flex flex-row mb-5 justify-between'
                >
                  {row.map((feature, index) => (
                    <View
                      key={index}
                      className='w-28 rounded-lg p-2  bg-custom_white-500'
                    >
                      <View>
                        <Pressable className='flex justify-center items-center' onPress={()=>{
                          
                          
                          if(feature.label === 'Logout'){
                            const handleLogout = async ()=>{
                              

                              await AsyncStorage.removeItem('user_data')
                              dispatch(clearAuthData())

                            }
                            handleLogout()
                            console.log('logout')
                          }
                          else{
                            navigation.navigate(feature.label)
                          }
                        }}>
                          <feature.img width={50} height={50} className='mx-auto' />

                          <Text className=' text-custom_blue-500 text-sm font-sanBold_500 text-center'>
                            {feature.name}
                          </Text>
                        </Pressable>
                      </View>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          </BottomSheetModal>
        </View>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  )
}

export default Profile