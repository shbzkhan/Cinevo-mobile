import { View, Text, Image, Alert } from 'react-native'
import {React, useState} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native'
import {images} from "../../constants"
import FormField from '../../components/FormField'
import CustomButton from "../../components/CustomButton.jsx"
import { Link, Redirect } from 'expo-router'
import { createUser } from '../../lib/appwrite.js'
import router from "expo-router"
const SignUp = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: ""
  })


  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const submit = async() =>{
    if(!form.username || !form.email || !form.password){
      Alert.alert(
        "Error",
        "please fill in all the fields"
      )
    }
    setIsSubmitting(true)
   try {
     const result = await createUser(form.email, form.password, form.username)


    router.replace("/home")
   } catch (error) {
    Alert.alert("Error", error.message)
    console.log(error);
    
   } finally {
    setIsSubmitting(false)
   }
  }
  return (
    <SafeAreaView className="bg-primary h-full">
    <ScrollView>
      <View className="w-full justify-center h-full px-4
      my-6">
        <Image
        source={images.logo}
        resizeMode='contain'
        className="w-[115px] h-[35px]"
        />
        <Text className="text-2xl text-white text-semibold mt-10 font-psemibold">Sign up to Aora</Text>
        
        <FormField
        title="Username"
        value = {form.username}
        handleChangerText={(e)=>setForm({...form, username: e})}
        otherStyles="mt-10"
        />
        <FormField
        title="Email"
        value = {form.email}
        handleChangerText={(e)=>setForm({...form, email: e})}
        otherStyles="mt-7"
        keyboardType="email-address"
        />

        <FormField
        title="Password"
        value = {form.password}
        handleChangerText={(e)=>setForm({...form, password: e})}
        otherStyles="mt-7"
        />
        <CustomButton
        title="Sign up"
        handlePress={submit}
        containerStyles="mt-11"
        isLoading={isSubmitting}
        />
        <View className="justify-center pt-5 flex-row gap-2">
          <Text className="text-lg text-gray-100 font-pregular">
            Have an account already?
          </Text>
          <Link href="/sign-in" className='text-lg font-psemibold text-secondary'>Sign in</Link>
        </View>
      </View>
    </ScrollView>
  </SafeAreaView>
  )
}

export default SignUp