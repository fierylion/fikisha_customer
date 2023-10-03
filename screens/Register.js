import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import * as yup from 'yup'
import { Formik } from 'formik'
import useFetch from '../hooks/useFetch'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import { storeAuthData } from '../store/authSlice'
import { useDispatch, useSelector } from 'react-redux'
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
  confirmPassword: yup
    .string()
    .required('This field is required!')
    .min(4, 'Must be at least 4 characters!')
    .oneOf([yup.ref('password'), null], 'Passwords must match'),
  // phoneNumber: yup.string().required().min(10),
  // firstName: yup.string().required().min(3),
  // lastName: yup.string().required().min(3),
  // address: yup.string().required().min(3),
  // city: yup.string().required().min(3),
  // country: yup.string().required().min(3),
  // postalCode: yup.string().required().min(3),
})
const Register = () => {
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const user_data= useSelector(state=>state.user_data)
  const auth_message= useSelector(state=>state.auth_message)
  const { isLoading, error, data, obtainData } = useFetch()
  const handleSubmit = (values) => {
    const {email, password} = values;
    obtainData('/register/customer', 'post', { email, password })
  }

  useEffect(() => {
    const storeUserData = async (data) => {
      const string_data = JSON.stringify(data)
      try {
        await AsyncStorage.setItem('user_data',string_data )
         dispatch(storeAuthData({type:'DATA', data})) // set user_data state
         console.log('User data stored successfully')
        // navigation.navigate('Home')
        
      } catch (error) {
        dispatch(storeAuthData({ type: 'ERROR', data:'Error storing data!' })) //error 
        console.error('Error storing user data:', error)
      }
    }
    if (data) {
      storeUserData(data)
    }
    if(error){
      console.log(error)
    } 
  }, [data, error])
 
  return (
    <SafeAreaView className=' flex-1 bg-custom_blue-900 '>
      {/* <Text className='text-3xl text-red-600'>Introducti</Text> */}
      <StatusBar barStyle='dark-content' backgroundColor='#000000' />
      {error && (
        <AlertMessage message={'There was an error!'} color={'normal'} />
      )}
      {isLoading && <AlertMessage message={'Loading.....'} color={'normal'} />}
      {/* {auth_message && <AlertMessage message={auth_message} color={'normal'}/>} */}
      <ScrollView className='flex-1 ' keyboardShouldPersistTaps={'handled'}>
        <View className='mx-auto mt-28   '>
          <Text className='text-custom_white-700 text-center font-bold mb-2'>
            Sign Up
          </Text>
          <Text className='text-custom_white-700 opacity-75'>
            Create an account
          </Text>
        </View>
        <View>
          <Formik
            initialValues={{ email: '', password: '', confirmPassword: '' }}
            validationSchema={registerSchema}
            onSubmit={(values, actions) => {
              console.log(values)
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
                  <Text className='px-4 text-custom_white-700'>Passsword</Text>
                  <TextInput
                    className='bg-custom_blue-500 text-custom_white-700 rounded-lg px-4 py-2 w-11/12 mx-auto my-2'
                    onChangeText={props.handleChange('password')}
                    value={props.values.password}
                    onBlur={props.handleBlur('password')}
                  />
                  <Text className='px-4 font-light text-custom_silver-500 opacity-80'>
                    {props.touched.password && props.errors.password}
                  </Text>
                </View>
                <View className='mb-4'>
                  <Text className='px-4 text-custom_white-700'>
                    Confirm Password
                  </Text>
                  <TextInput
                    onChangeText={props.handleChange('confirmPassword')}
                    className='bg-custom_blue-500 text-custom_white-700 rounded-lg px-4 py-2 w-11/12 mx-auto my-2'
                    value={props.values.confirmPassword}
                    onBlur={props.handleBlur('confirmPassword')}
                  />
                  <Text className='px-4 font-light text-custom_silver-500 opacity-80'>
                    {props.touched.confirmPassword &&
                      props.errors.confirmPassword}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={props.handleSubmit}
                  className='p-5 rounded-3xl my-5 mb-16 bg-custom_blue-200 opacity-75'
                >
                  <Text className='text-center text-custom_white-700 font-black tracking-wider'>
                    Register
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </Formik>
        </View>

        <Text className='text-center text-custom_white-700 mb-5'>
          I have an account,{' '}
          <Text
            className='text-custom_blue-200'
            onPress={() => navigation.navigate('Login')}
          >
            Back to login
          </Text>
        </Text>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Register
