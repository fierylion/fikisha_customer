import { View, Text, StatusBar, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView } from 'react-native'
import React, { useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import * as Icon from 'react-native-feather'

const EditProfile = () => {
  const navigation = useNavigation()

  const [firstName, setFirstName] = React.useState('Daniel')
  const [lastName, setLastName] = React.useState('Mawalla')

  const [email, setEmail] = React.useState('mawalladaniel2021@gmail.com')
  const [phone, setPhone] = React.useState('+255628630936')
  const fields = [
    {
      title: 'First Name',
      value: firstName,
      setValue: setFirstName,
      placeholder: 'Enter your first name',
      SvgIcon: Icon.User,
    },
    {
      title: 'Last Name',
      value: lastName,
      setValue: setLastName,
      placeholder: 'Enter your last name',
      SvgIcon: Icon.User,
    },
    {
      title: 'Email',
      value: email,
      setValue: setEmail,
      placeholder: 'Enter your email',
      SvgIcon: Icon.Mail,
    },
    {
      title: 'Phone',
      value: phone,
      setValue: setPhone,
      placeholder: 'Enter your phone number',
      SvgIcon: Icon.Phone,
    },
  ]
  return (
    <SafeAreaView
      className=' flex-1 bg-custom_white-500 font-sanBold_500'
      keyboardShouldPersistTaps={'handled'}
    >
      {/* <Text className='text-3xl text-red-600'>Introducti</Text> */}
      <StatusBar barStyle='dark-content' backgroundColor='#e5e5e5' />
      <View className='mt-1 flex flex-row items-center mx-3'>
        <Icon.ArrowLeft
          color={'gray'}
          height={30}
          width={30}
          onPress={() => navigation.goBack()}
        />
        <Text className='mx-auto font-sanBold_500 text-lg'>Edit Profile</Text>
        <Icon.ArrowLeft />
      </View>
      <View className='h-20'></View>
      <View className='rounded-t-3xl h-full w-full bg-custom_white-400'>
        <ScrollView>
          <KeyboardAvoidingView behavior='padding' >
            <View className='ml-3 mt-8'>
              {fields.map((field, ind) => (
                <SingleInput {...field} key={ind} />
              ))}
            </View>
            <TouchableOpacity className='p-4 mx-5 bg-custom_blue-500 rounded-lg mt-10' onPress={()=>console.log(firstName, lastName, email)}>
              <Text className='text-custom_white-100 text-center font-sanBold_500'>
                Save Changes
              </Text>
            </TouchableOpacity>
            <View className=' mt-32'></View>
          </KeyboardAvoidingView>
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}
const SingleInput = ({ title, value, setValue, placeholder, SvgIcon}) => {
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef();
  const handleEdit = ()=>{
   
    inputRef.current?.focus();
  }
   const handleFocus = () => {
  
     setIsFocused(true)
   }

   const handleBlur = () => {
    
     setIsFocused(false)
   }

  return (
    <View className=' my-4'>
      <Text className='mb-2 font-sanBold_500  text-custom_white-600'>
        {title}
      </Text>
      <View className='relative rounded px-2  mr-2'>
        <SvgIcon
          width={20}
          height={20}
          color={isFocused ? '#162140' : 'gray'}
          className='absolute top-1 left-2'
        />
        <TextInput
          ref={inputRef}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className=' pl-8 bg-custom_white-300  '
          value={value}
          onChangeText={(text) => setValue(text)}
        />
        <Icon.Edit
          className='absolute right-5'
          color={isFocused ? '#162140' : 'gray'}
          width={20}
          height={20}
          onPress={handleEdit}
        />
      </View>
    </View>
  )
}




export default EditProfile