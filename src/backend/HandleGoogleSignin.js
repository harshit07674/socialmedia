import React, { use } from 'react';
import { View, Button, StyleSheet, Alert } from 'react-native';
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import firebase from '@react-native-firebase/app';
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';


    
   // handles google signin 
    const handleGoogleSignIn = async () => {
        try {
            GoogleSignin.configure({
                webClientId: '311030668108-rtg080n8o75tluv8bb7jk04hqbf4lfr8.apps.googleusercontent.com', // From Firebase Console
            });
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            const { idToken } = userInfo;
            const googleCredential = auth.GoogleAuthProvider.credential(idToken);
           const user = await auth().signInWithCredential(googleCredential);
           const reference = firebase
        .app()
        .database(
          'https://photoshare-e09d4-default-rtdb.asia-southeast1.firebasedatabase.app/',
        )
        //    console.log(user);
           if(user){
            const dateTime = Date.now().toString();
            await reference.ref('/SocialMediaUsers/').child(user.user.uid).child('profile').set({
                name:user.user.displayName,
                email:user.user.email,
                phoneNumber:'',
                uid: user.user.uid,
                isOnline:true,
                profilePhoto: user.user.photoURL,
                timeStamp: dateTime,
                friends:['1'],
                requests:[{'uid':'1'}],
                requests_sended:['1'],
                shelfCount:0,
              });
            }
            await reference.ref('/SocialMediaUsers/').child(user.user.uid).set({
             name:user.user.displayName,
             user:user.user.uid,
             friends:['1'],
            })
            if(user.additionalUserInfo.isNewUser===true){
            Alert.alert('Your Account has been registered');
            }

        } catch (error) {
            console.log('Error during Google authentication:', error);
        }
    };

export default handleGoogleSignIn;