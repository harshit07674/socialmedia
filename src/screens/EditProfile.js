import React,{useState} from 'react'
import { View,Image,Text,TextInput,TouchableOpacity, Alert } from 'react-native'
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';


const EditProfile = ({navigation,route}) => {

    const [name,setName]=useState(route.params.profile.name);
    const [bio,setBio]=useState(route.params.profile.bio);
    const [link,setLink]=useState('');

  const updateProfile=async()=>{
    try{
    const reference = firebase
    .app()
    .database(
      'https://photoshare-e09d4-default-rtdb.asia-southeast1.firebasedatabase.app/',
    ).ref('/SocialMediaUsers/');

    const user=firebase.auth().currentUser.uid;

        await reference.child(user).child('profile').update({
          name:name,
          bio: bio,
          link:link,
    })
    
    Alert.alert('Profile Updated Successfully');
}
catch(error){
    console.log(error);
}
  }

  return (
    <View style={{paddingLeft:10,}}>
    <Image source={{uri:route.params.profile.profilePhoto}} style={{resizeMode:'stretch',marginTop:20,alignSelf:'center',height:90,width:90,borderRadius:45}}></Image>
    <Text style={{marginTop:10,color:'black',fontSize:16,}}>Name</Text>
   <TextInput value={name} onChangeText={setName} style={{height:60,borderBottomColor:'black',borderBottomWidth:2,width:'95%',}} placeholder={route.params.profile.name} placeholderTextColor={'black'}></TextInput>
   <Text style={{marginTop:20,color:'black',fontSize:16,}}>Bio</Text>
   <TextInput value={bio} onChangeText={setBio} style={{height:60,borderBottomColor:'black',borderBottomWidth:2,width:'95%',}} placeholder={route.params.profile.bio} placeholderTextColor={'black'}></TextInput>
   <Text style={{marginTop:20,color:'black',fontSize:16,}}>Add Link</Text>
   <TextInput value={link} onChangeText={setLink} style={{height:60,borderBottomColor:'black',borderBottomWidth:2,width:'95%',}} placeholder={'Add Link here'} placeholderTextColor={'black'}></TextInput>
    <TouchableOpacity
             style={{alignSelf:'center',width:100,height:40,backgroundColor:'green',marginTop:20,borderRadius:20,elevation:10,alignItems:'center',justifyContent:'center'}}
             onPress={() => updateProfile()}>
             <Text style={{fontSize:18,color:'white',textAlign:'center'}}>Update</Text>
           </TouchableOpacity>
    </View>
  )
}

export default EditProfile
