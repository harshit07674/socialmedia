import { resetAnalyticsData } from '@react-native-firebase/analytics'
import React, { useEffect } from 'react'
import { View,FlatList,Text,TouchableOpacity,Image,Alert } from 'react-native'
import auth from '@react-native-firebase/auth';
import firebase from '@react-native-firebase/app'; 

const Followers = ({route}) => {

    const removeFollower=async(senderId)=>{
        try{ 
           const id = auth().currentUser.uid;
           const reference = firebase
           .app()
           .database(
             'https://photoshare-e09d4-default-rtdb.asia-southeast1.firebasedatabase.app/'
           )
           .ref('/SocialMediaUsers/');

           const reference2=firebase
           .app()
           .database(
             'https://photoshare-e09d4-default-rtdb.asia-southeast1.firebasedatabase.app/'
           )
           .ref('/SocialMediaChats/');

           const chatList=[id,senderId];
           chatList.sort();
           const room=chatList.join('_');

           await reference2.child(room).remove();

           await reference.child(senderId).child('Follows').child(id).update({
            isSeen:false,
            delete:true,
           })
           await reference.child(id).child('Follows').child(senderId).remove();
           Alert.alert('You unfollowed this user');
        
        }
        catch(error){
         console.log(error);   
        }
    }

    useEffect(()=>{
   console.log(route.params.followers);
    },[])
  return (
    <View style={styles.screen
    }>
   <FlatList style={{width:'100%',height:'100%'}} contentContainerStyle={{flexGrow:1}} data={route.params.followers} keyExtractor={(item)=>item.uid} renderItem={({item})=>{
    return <View style={styles.rowTile}>
     <Image style={styles.circularAvatar} source={{uri:item.profilePhoto}}></Image> 
     <Text style={styles.nameLabel}>{item.name}</Text>
     <TouchableOpacity onPress={()=>removeFollower(item.uid)} style={styles.circularButton}><Text style={styles.buttonLabel}>{'Unfollow'}</Text></TouchableOpacity> 
    </View>
   }}></FlatList>
    </View>
  )
}

const styles={
    screen:{
        padding:20,
        width:'100%',
        height:'100%'
    },
    rowTile:{
        padding:20,
        marginBottom:20,
        width:'100%',
        backgroundColor:'white',
        elevation:10,
        borerRadius:20,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
    },
    circularAvatar:{
        width:60,
        height:60,
        borderRadius:30,
        resizeMode:'stretch'
    },
    nameLabel:{
        marginLeft:10,
        fontSize:20,
        fontWeight:'bold',
        width:'40%',
        color:'black'
    },
    circularButton:{
        width:100,
        height:40,
        backgroundColor:'green',
        borderRadius:20,
        marginLeft:10,
        alignItems:'center',
        justifyContent:'center'
    },
    buttonLabel:{
       fontSize:18,
       color:'white',
       fontWeight:'bold' 
    }
}

export default Followers
