import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import AuthNavigation from './AuthNavigation'
import NoAuthNavigation from './NoAuthNavigation' 
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useDispatch, useSelector } from 'react-redux'
import { retrieveAuthData,storeAuthData } from '../store/authSlice'
import Loading from '../screens/Loading'

export default function Navigation() {
  const dispatch = useDispatch()
  const user_data = useSelector((state) => state.auth.user_data)
  

  useEffect(() => {
     const getUserData = async () => {
      
       try {
         const user_data = await AsyncStorage.getItem('user_data')
        
        
         if (user_data !== 'NOT REGISTERED' && user_data !== null) {
           dispatch(storeAuthData({type:'DATA', data:JSON.parse(user_data)}));
           
         } else {
          
           dispatch(storeAuthData({ type: 'DATA', data:'NOT REGISTERED' }))
         }
       } catch (error) {
          dispatch(storeAuthData({ type: 'ERROR', data: 'Error retrieving data' }))
       }
     }
     
     getUserData()
   
    
  }, [dispatch])

  

  if (user_data === null) {
   
    return <Loading />
  }
 
  return (
    <NavigationContainer theme={{ colors: { background: '#000' } }}>
    {user_data === 'NOT REGISTERED' ? (<NoAuthNavigation />) : (<AuthNavigation />)}
    </NavigationContainer>
  )
}
