import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import {View} from 'react-native'
import Profile from '../../screens/Profile'
import Order from '../../screens/Order'
import * as Icon from 'react-native-feather'
import Home from '../../screens/Home'
import { NavigationContainer } from '@react-navigation/native'
const Tab = createBottomTabNavigator()

function HomeTabs() {
  return (
    <Tab.Navigator
      initialRouteName='Dashboard'
      screenOptions={{
        tabBarActiveTintColor: '#5f77f5',
        tabBarInactiveTintColor: 'gray',

        tabBarStyle: {
          paddingVertical: 5,
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
          borderColor: 'white',
          borderCurve: 'circular',
          backgroundColor: 'white',
          position: 'absolute',
          height: 50,
        },
        tabBarLabelStyle: { paddingBottom: 3 },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name='Dashboard'
        component={Home}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: (focused, color, size) => {
            return <Icon.Home color={focused?.color} fontSize={focused?.size} />
          },
        }}
      />
      <Tab.Screen
        name='Orders'
        component={Order}
        options={{
          tabBarLabel: 'Orders',
          tabBarIcon: (focused, color, size) => {
            return (
              <View
                className='p-3  rounded-full mb-5 border bg-custom_white-100'
                style={{ borderColor: focused?.color }}
              >
                <Icon.Layers color={focused?.color} fontSize={focused?.size} />
              </View>
            )
          },
          tabBarBadge: 3,
          tabBarBadgeStyle: { color: 'blue',paddingHorizontal:4  },
        }}
      />
      <Tab.Screen
        name='Settings'
        component={Profile}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: (focused, color, size) => {
            return (
              <Icon.AlignRight
                color={focused?.color}
                fontSize={focused?.size}
              />
            )
          },
        }}
      />
    </Tab.Navigator>
  )
}
export default HomeTabs