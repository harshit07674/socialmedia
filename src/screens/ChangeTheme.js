import React, { useState } from 'react'
import { View,FlatList,Image,Text, TouchableOpacity,Alert  } from 'react-native'
import ThemesList from '../constants/ThemesList'
import Icon from 'react-native-vector-icons/MaterialIcons'
import auth from '@react-native-firebase/auth';
import firebase from '@react-native-firebase/app';

const ChangeTheme = ({route}) => {
    const [currIndex,setIndex]=useState(-1);
    const id = auth().currentUser.uid;
    const chatIdList=[id,route.params.id];

    const setWallPaper=async()=>{
        try{
       chatIdList.sort();
       const room = chatIdList.join('_');
          
          const reference = firebase
            .app()
            .database(
              'https://photoshare-e09d4-default-rtdb.asia-southeast1.firebasedatabase.app/',
            )
            .ref('/SocialMediaChats/')
            .child(room);
    await reference.child('wallpaper').child(id).update({
        wallpaper_id:ThemesList[currIndex].id,
        wallpaper_src:ThemesList[currIndex].src,

    });
    Alert.alert('Your Wallpaper is set');
        }
        catch(error){
            console.log(error);
        }
    }

  return (
    <View style={{flex:1}}>
    <FlatList columnWrapperStyle={{width:'100%'}} data={ThemesList} contentContainerStyle={{flexGrow:1}} numColumns={2} renderItem={({item,index})=>{
        console.log(item);
     return <TouchableOpacity style={{borderColor:currIndex===index?'green':'transparent',borderWidth:5,width:'45%',marginLeft:10,marginTop:10

     }} onPress={()=>{
        setIndex(index);
     }}><Image source={item.src} style={{height:300,width:'100%'}}/>
     <Text style={{fontSize:20,color:'black',fontWeight:'bold',textAlign:'center'}}>{item.name.toString().split('.')[0]}</Text>
     </TouchableOpacity>
    }} keyExtractor={(item)=>item.id}
    />    
    <TouchableOpacity onPress={()=>setWallPaper()} style={{backgroundColor:'green',width:200,height:50,borderRadius:20,flexDirection:'row',alignItems:'center',justifyContent:'center',alignSelf:'center',marginBottom:20}}>
     <Icon name={'wallpaper'} size={30} color={'white'}></Icon>
     <Text style={{color:'white',fontSize:20,fontWeight:'bold'}}> Set wallpaper</Text>   
    </TouchableOpacity>
    </View>
  )
}

export default ChangeTheme
