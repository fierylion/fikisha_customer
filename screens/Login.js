import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView
} from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import * as yup from 'yup'
import { Formik } from 'formik'
import useFetch from '../hooks/useFetch'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { storeAuthData } from '../store/authSlice'
import { useDispatch } from 'react-redux'
import AlertMessage from '../components/AlertMessage'
const registerSchema = yup.object({
  email: yup
    .string()
    .required('This field is required!')
    .email('Must be an email!'),
  password: yup
    .string()
    .required('This field is required!')
    .min(4, 'Must be at least 4 characters!'),
 
 
})
const Login = () => {
  const { isLoading, error, data, obtainData } = useFetch()
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const handleSubmit = (values) => {
    const { email, password } = values
    obtainData('/login/customer', 'post', { email, password })
  }
  React.useEffect(() => {
    const storeUserData = async (data) => {
      const string_data = JSON.stringify(data)
      try {
        await AsyncStorage.setItem('user_data', string_data)
        dispatch(storeAuthData({ type: 'DATA', data })) // set user_data state
        // console.log('User data stored successfully')
        // navigation.navigate('Home')
      } catch (error) {
        dispatch(storeAuthData({ type: 'ERROR', data: 'Error storing data!' })) //error
        console.error('Error storing user data:', error)
      }
    }
    if (data) {
      storeUserData(data)
    }
    if (error) {
      console.log(error)
    }
  }, [data, error])
  return (
    <SafeAreaView className=' flex-1 bg-custom_blue-900 '>
      {/* <Text className='text-3xl text-red-600'>Introducti</Text> */}
      <StatusBar barStyle='dark-content' backgroundColor='#000000' />
      <ScrollView className='flex-1 ' keyboardShouldPersistTaps={'handled'}>
        {error && (
          <AlertMessage message={'There was an error!'} color={'normal'} />
        )}
        {isLoading && (
          <AlertMessage message={'Loading.....'} color={'normal'} />
        )}
        <View className='mx-auto mt-28   '>
          <Text className='text-custom_white-700 text-center font-bold mb-2'>
            Sign In
          </Text>
          <Text className='text-custom_white-700 opacity-75'>
            Access account
          </Text>
        </View>
        <KeyboardAvoidingView
        behavior="padding" // You can choose 'height' or 'position' as well
      style={{ flex: 1 }}
        >
          <View>
            <Formik
              initialValues={{ email: '', password: '', confirmPassword: '' }}
              validationSchema={registerSchema}
              onSubmit={(values, actions) => {
                handleSubmit(values)
                actions.resetForm()
              }}
            >
              {(props) => (
                <View className='mx-2 mt-10'>
                  <View className='mb-4'>
                    <Text className='px-4 text-custom_white-700'>Email</Text>
                    <TextInput
                      className='bg-custom_blue-500 text-custom_white-700 rounded-lg px-4 py-2 w-11/12 mx-auto my-2'
                      onChangeText={props.handleChange('email')}
                      value={props.values.email}
                      onBlur={props.handleBlur('email')}
                    />
                    <Text className='px-4 font-light text-custom_silver-500 opacity-80 '>
                      {props.touched.email && props.errors.email}
                    </Text>
                  </View>
                  <View className='mb-4'>
                    <Text className='px-4 text-custom_white-700'>
                      Passsword
                    </Text>
                    <TextInput
                      blurOnSubmit={false}
                      className='bg-custom_blue-500 text-custom_white-700 rounded-lg px-4 py-2 w-11/12 mx-auto my-2'
                      onChangeText={props.handleChange('password')}
                      value={props.values.password}
                      onBlur={props.handleBlur('password')}
                    />
                    <Text className='px-4 font-light text-custom_silver-500 opacity-80'>
                      {props.touched.password && props.errors.password}
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={props.handleSubmit}
                    onBlur={false}
                    className='p-5 rounded-3xl my-5 mb-16 bg-custom_blue-200 opacity-75'
                  >
                    <Text className='text-center text-custom_white-700 font-black tracking-wider'>
                      Sign In
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </Formik>
          </View>
        </KeyboardAvoidingView>

        <Text className='text-center text-custom_white-700 mb-5'>
          Don't have an account ?{' '}
          <Text
            className='text-custom_blue-200'
            onPress={() => navigation.navigate('Register')}
          >
            Sign Up
          </Text>
        </Text>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Login
