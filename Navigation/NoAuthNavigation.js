import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import Register from '../screens/Register'

import Login from '../screens/Login'
import Introduction from '../screens/Introduction'
import { Easing } from 'react-native'

const Stack = createNativeStackNavigator()
export default function NoAuthNavigation() {
  


  return (
  
      <Stack.Navigator
        initialRouteName={'Introduction'}
        screenOptions={{ headerShown: false, gestureEnabled: true, gestureDirection:'horizontal' }}
      >
      <Stack.Screen name='Introduction' component={Introduction} />
            <Stack.Screen name='Register' component={Register} />
            <Stack.Screen name='Login' component={Login} />
        
        
      </Stack.Navigator>
   
  )
}
