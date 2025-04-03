/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect } from 'react';

import {
  LogBox,
  SafeAreaView,
  ScrollView,
  SnapshotViewIOS,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Splash from './src/screens/Splash';
import Signup from './src/screens/Signup';
import Login from './src/screens/Login';
import BottomNavbar from './src/screens/BottomNavbar';
import UploadPost from './src/screens/UploadPost';
import UsersScreen from './src/screens/UsersScreen';
import Home from './src/screens/Home';
import Friends from './src/screens/Friends';
import Chat from './src/screens/Chat';
import UserProfile from './src/screens/UserProfile';
import Comment from './src/screens/Comment';
import SendMedia from './src/screens/SendMedia';
import Notification from './src/screens/Notification';
import auth from '@react-native-firebase/auth';
import firebase from '@react-native-firebase/app';
import EditProfile from './src/screens/EditProfile';
import Snap from './src/screens/Snap';
import Followers from './src/screens/Followers';
import ChatProfile from './src/screens/ChatProfile';
import ChangeTheme from './src/screens/ChangeTheme';


const stack = createStackNavigator();


const App = () => {

 const setStatus=async()=>{
  try{
  const id = auth().currentUser.uid;
  const reference = firebase
        .app()
        .database(
          'https://photoshare-e09d4-default-rtdb.asia-southeast1.firebasedatabase.app/',
        )
        .ref('/SocialMediaUsersStatus/')
        .child(id)

        reference.set(true).then(()=>{
          console.log('online');
        })
        
        reference.onDisconnect().remove().then(()=>{
          console.log('offline');
        })
  }
  catch(error){
    console.log(error);
  }
 }

  useEffect(()=>{
  setStatus();
  },[])
  

  return (
    <NavigationContainer>
      <stack.Navigator>
        <stack.Screen name='Splash' component={Splash} options={{headerShown:false}}></stack.Screen>
        <stack.Screen name='BottomNav' component={BottomNavbar} options={{headerShown:false}}></stack.Screen>
        <stack.Screen name='Login' component={Login} options={{headerShown:false}}></stack.Screen>
        <stack.Screen name='Signin' component={Signup} options={{headerShown:false}}></stack.Screen>
        <stack.Screen name='Home' component={Home} options={{headerShown:false}}></stack.Screen>
        <stack.Screen name='Upload' component={UploadPost} options={{headerShown:false}}></stack.Screen>
        <stack.Screen name='Users' component={UsersScreen} options={{headerShown:false}}></stack.Screen>
        <stack.Screen name='Friends' component={Friends}></stack.Screen>
        <stack.Screen name='Messages' component={Chat} options={{headerShown:false}}></stack.Screen>
        <stack.Screen name='userProfile' component={UserProfile}></stack.Screen>
        <stack.Screen name='comment' component={Comment}></stack.Screen>
        <stack.Screen name='Attach Image' component={SendMedia}></stack.Screen>
        <stack.Screen name='notification' component={Notification}></stack.Screen>
        <stack.Screen name='edit' component={EditProfile}></stack.Screen>
        <stack.Screen name='snap' component={Snap} options={{headerShown:false}}></stack.Screen>
        <stack.Screen name='followers' component={Followers} options={{headerShown:false}}></stack.Screen>
        <stack.Screen name='chatProfile' component={ChatProfile} options={{headerShown:false}}></stack.Screen>
        <stack.Screen name='theme' component={ChangeTheme} options={{headerShown:false}}></stack.Screen>
      </stack.Navigator>
    </NavigationContainer>
  );
};



export default App;
