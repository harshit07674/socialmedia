import React, { useEffect, useState } from 'react'
import { View,Image,Text,FlatList, TouchableOpacity,Modal,Alert } from 'react-native'
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ChatProfile = ({navigation,route}) => {
    const id = auth().currentUser.uid;
    const chatIdList=[id,route.params.id];
    const [chats,setChats]=useState([]);
    const [pause,setPause]=useState(true);
    const [clearChatDialog,setClearChatDialog]=useState(false);
    const [photos,setPhotos]=useState([]);
    const [videos,setVideo]=useState(null);

    const clearChats=async()=>{
        try{
            chatIdList.sort();
            const room = chatIdList.join('_');
            
            const reference = firebase
              .app()
              .database(
                'https://photoshare-e09d4-default-rtdb.asia-southeast1.firebasedatabase.app/',
              )
              .ref('/SocialMediaChats/')
              .child(room).child('chats');

              await reference.remove();
              Alert.alert('All Chats Removed');
              setClearChatDialog(false);
        }
        catch(error){
            console.log(error);
        }
    }

    const fetchChats = async () => {
        try {
          
          chatIdList.sort();
          const room = chatIdList.join('_');
          
          const reference = firebase
            .app()
            .database(
              'https://photoshare-e09d4-default-rtdb.asia-southeast1.firebasedatabase.app/',
            )
            .ref('/SocialMediaChats/')
            .child(room).child('chats');
    
          await reference.orderByChild('id').on('value', snapshot => {
            const chatData = snapshot.val();
            if (chatData) {
              const chatMessages = Object.values(chatData).reverse();
             const photos=chatMessages.filter((photos)=>{
                return photos.mediaType==='photo';
             });
             if(photos!==null){
                setPhotos(photos);
             }
             console.log(photos.length);
             const videos=chatMessages.filter((video)=>{
                return video.mediaType==='video';
             });
             console.log({videos});
             if(videos!==null){
                setVideo(videos);
             }
              console.log({chatMessages});
              setChats(chatMessages);
            }
          });
        } catch (error) {
          console.log({error});
        } finally {
         
        }
      };

      useEffect(()=>{
      fetchChats();
      },[])
    
  return (
   <View>
    <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
     <TouchableOpacity onPress={()=>navigation.goBack()}><Icon name={'arrow-back'} size={40} color={'black'} style={{marginLeft:10,marginTop:10}}></Icon></TouchableOpacity> 
     <TouchableOpacity onPress={()=>navigation.navigate('theme',{id:route.params.id,name:route.params.name,profile:route.params.profile})}><Icon name='settings' size={40} color={'black'} style={{marginRight:10,marginTop:10}}></Icon></TouchableOpacity>  
    </View>
    <Image source={{uri:route.params.profile}} style={{marginTop:20,height:100,width:100,borderRadius:50,alignSelf:'center'}}>
    </Image> 
    <Text style={{color:'black',fontSize:20,fontWeight:'bold',textAlign:'center'}}>{'@'+route.params.name}</Text>
    <View style={{marginTop:10,backgroundColor:'white',borderColor:'black',borderWidth:2,height:50,width:'95%',marginLeft:10,borderRadius:20,elevation:10}}><Text style={{color:'black',fontWeight:'bold',fontSize:24,fontStyle:'italic',alignSelf:'center'}}>{'Total chats: '+chats.length}</Text></View>
    <Text style={{marginLeft:10,marginTop:10,color:'black',fontSize:28,fontWeight:'bold'}}>Photos Shared</Text>
    <FlatList style={{height:'20%'}} data={photos} renderItem={({item})=>{

       if(item.mediaType==='photo'){
        return (
            <View>
            <Image source={{uri:item.message}} style={{marginLeft:10,height:100,width:200}}></Image> 
            <Text style={{color:'black',fontSize:15,fontWeight:'bold',textAlign:'center'}}>{item.date}</Text> 
            <Text style={{color:'black',fontSize:15,fontWeight:'bold',textAlign:'center'}}>{item.uid===id?'Shared By You':'Shared By '+'@'+item.name}</Text>   
            </View>
        )
       }
    }} keyExtractor={(item)=>item.id} horizontal contentContainerStyle={{flexGrow:1}}></FlatList>  
     <Text style={{marginLeft:10,marginTop:10,color:'black',fontSize:28,fontWeight:'bold'}}>Videos Shared</Text>
    <FlatList style={{height:'30%'}}  data={videos} renderItem={({item})=>{
        console.log({len:videos.length});
        if(videos===null){
            return (<View style={{height:100,width:100,backgroundColor:'red'}}></View>)
        }
       else{
        return (
            <View style={{height:300}}>
            <Video controls paused={true} source={{uri:item.message}} style={{marginLeft:10,height:150,width:200}}></Video>   
            <Text style={{color:'black',fontSize:15,fontWeight:'bold',textAlign:'center'}}>{item.date}</Text>
            <Text style={{color:'black',fontSize:15,fontWeight:'bold',textAlign:'center'}}>{item.uid===id?'Shared By You':'Shared By '+'@'+item.name}</Text> 
            </View>
        )
       }
    }} keyExtractor={(item)=>item.id} horizontal contentContainerStyle={{flexGrow:1}}></FlatList> 
    <TouchableOpacity onPress={()=>setClearChatDialog(true)} style={{backgroundColor:'green',borderRadius:20,height:50,width:100,alignSelf:'center',alignItems:'center',justifyContent:'center'}}><Text style={{color:'white',fontSize:15,fontWeight:'bold',alignItems:'center',justifyContent:'center'}}>Clear Chat</Text></TouchableOpacity> 
    <Modal onRequestClose={()=>setClearChatDialog(false)} visible={clearChatDialog} transparent={true}>
    <View style={{backgroundColor:'rgba(0,0,0,0.6)',width:'100%',height:'100%'}}>    
   <View style={{height:'50%',top:'30%',width:'95%',marginLeft:10,marginRight:10,borderRadius:10,alignSelf:'center',backgroundColor:'white',elevation:10}}>
    <Text style={{color:'black',fontWeight:'bold',fontSize:24,margin:10,textAlign:'justify'}}>This Will Delete All Your Chats Inluding Photos, Videos And All Other Media And Text Messages. Are You Sure You Want TO Delete All of Them?</Text>
    <TouchableOpacity onPress={()=>clearChats()} style={{backgroundColor:'green',height:50,width:100,alignItems:'center',justifyContent:'center',alignSelf:'center',marginTop:50}}><Text>Yes</Text></TouchableOpacity>
    <TouchableOpacity onPress={()=>clearChatDialog(false)} style={{backgroundColor:'red',height:50,width:100,alignItems:'center',justifyContent:'center',alignSelf:'center',marginTop:20}}><Text>Cancel</Text></TouchableOpacity>
   </View>
   </View>
    </Modal>
   </View>
  )
}

export default ChatProfile
// import React, { useEffect, useState } from 'react';
// import { View, Image, Text, FlatList, TouchableOpacity, Modal, Alert, StyleSheet, Dimensions } from 'react-native';
// import firebase from '@react-native-firebase/app';
// import auth from '@react-native-firebase/auth';
// import Video from 'react-native-video';
// import Icon from 'react-native-vector-icons/MaterialIcons';

// const { width, height } = Dimensions.get('window');

// const ChatProfile = ({ navigation, route }) => {
//   const id = auth().currentUser.uid;
//   const chatIdList = [id, route.params.id];
//   const [chats, setChats] = useState([]);
//   const [pause, setPause] = useState(true);
//   const [clearChatDialog, setClearChatDialog] = useState(false);
//   const [photos, setPhotos] = useState([]);
//   const [videos, setVideo] = useState(null);

//   const clearChats = async () => {
//     try {
//       chatIdList.sort();
//       const room = chatIdList.join('_');

//       const reference = firebase
//         .app()
//         .database(
//           'https://photoshare-e09d4-default-rtdb.asia-southeast1.firebasedatabase.app/',
//         )
//         .ref('/SocialMediaChats/')
//         .child(room)
//         .child('chats');

//       await reference.remove();
//       Alert.alert('All Chats Removed');
//       setClearChatDialog(false);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const fetchChats = async () => {
//     try {
//       chatIdList.sort();
//       const room = chatIdList.join('_');

//       const reference = firebase
//         .app()
//         .database(
//           'https://photoshare-e09d4-default-rtdb.asia-southeast1.firebasedatabase.app/',
//         )
//         .ref('/SocialMediaChats/')
//         .child(room)
//         .child('chats');

//       await reference.orderByChild('id').on('value', snapshot => {
//         const chatData = snapshot.val();
//         if (chatData) {
//           const chatMessages = Object.values(chatData).reverse();
//           const photos = chatMessages.filter(photo => photo.mediaType === 'photo');
//           if (photos !== null) {
//             setPhotos(photos);
//           }
//           const videos = chatMessages.filter(video => video.mediaType === 'video');
//           if (videos !== null) {
//             setVideo(videos);
//           }
//           setChats(chatMessages);
//         }
//       });
//     } catch (error) {
//       console.log({ error });
//     }
//   };

//   useEffect(() => {
//     fetchChats();
//   }, []);

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Icon name="arrow-back" size={40} color="black" style={styles.icon} />
//         </TouchableOpacity>
//         <TouchableOpacity onPress={() => navigation.navigate('theme', { id: route.params.id, name: route.params.name, profile: route.params.profile })}>
//           <Icon name="settings" size={40} color="black" style={styles.icon} />
//         </TouchableOpacity>
//       </View>
//       <Image source={{ uri: route.params.profile }} style={styles.profileImage} />
//       <Text style={styles.username}>{'@' + route.params.name}</Text>
//       <View style={styles.chatCountContainer}>
//         <Text style={styles.chatCountText}>{'Total chats: ' + chats.length}</Text>
//       </View>
//       <Text style={styles.sectionTitle}>Photos Shared</Text>
//       <FlatList
//         data={photos}
//         renderItem={({ item }) => (
//           <View>
//             <Image source={{ uri: item.message }} style={styles.photo} />
//             <Text style={styles.mediaInfo}>{item.date}</Text>
//             <Text style={styles.mediaInfo}>{item.uid === id ? 'Shared By You' : 'Shared By ' + '@' + item.name}</Text>
//           </View>
//         )}
//         keyExtractor={item => item.id}
//         horizontal
//         contentContainerStyle={styles.flatListContent}
//       />
//       <Text style={styles.sectionTitle}>Videos Shared</Text>
//       <FlatList
//         style={styles.videoList}
//         data={videos}
//         renderItem={({ item }) => (
//           <View>
//             <Video controls paused={pause} source={{ uri: item.message }} style={styles.video} />
//             <Text style={styles.mediaInfo}>{item.date}</Text>
//             <Text style={styles.mediaInfo}>{item.uid === id ? 'Shared By You' : 'Shared By ' + '@' + item.name}</Text>
//           </View>
//         )}
//         keyExtractor={item => item.id}
//         horizontal
//         contentContainerStyle={styles.flatListContent}
//       />
//       <TouchableOpacity onPress={() => setClearChatDialog(true)} style={styles.clearChatButton}>
//         <Text style={styles.clearChatButtonText}>Clear Chat</Text>
//       </TouchableOpacity>
//       <Modal onRequestClose={() => setClearChatDialog(false)} visible={clearChatDialog} transparent={true}>
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContainer}>
//             <Text style={styles.modalText}>
//               This Will Delete All Your Chats Including Photos, Videos And All Other Media And Text Messages. Are You Sure You Want To Delete All of Them?
//             </Text>
//             <TouchableOpacity onPress={() => clearChats()} style={styles.modalButtonYes}>
//               <Text style={styles.modalButtonText}>Yes</Text>
//             </TouchableOpacity>
//             <TouchableOpacity onPress={() => setClearChatDialog(false)} style={styles.modalButtonCancel}>
//               <Text style={styles.modalButtonText}>Cancel</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'white',
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginHorizontal: 10,
//     marginTop: 10,
//   },
//   icon: {
//     marginHorizontal: 10,
//   },
//   profileImage: {
//     marginTop: 20,
//     height: width * 0.25,
//     width: width * 0.25,
//     borderRadius: width * 0.125,
//     alignSelf: 'center',
//   },
//   username: {
//     color: 'black',
//     fontSize: 20,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginTop: 10,
//   },
//   chatCountContainer: {
//     marginTop: 10,
//     backgroundColor: 'white',
//     borderColor: 'black',
//     borderWidth: 2,
//     height: 50,
//     width: '95%',
//     alignSelf: 'center',
//     borderRadius: 20,
//     elevation: 10,
//     justifyContent: 'center',
//   },
//   chatCountText: {
//     color: 'black',
//     fontWeight: 'bold',
//     fontSize: 24,
//     fontStyle: 'italic',
//     textAlign: 'center',
//   },
//   sectionTitle: {
//     marginLeft: 10,
//     marginTop: 10,
//     color: 'black',
//     fontSize: 28,
//     fontWeight: 'bold',
//   },
//   photo: {
//     marginLeft: 10,
//     height: height * 0.3,
//     width: width * 0.5,
//   },
//   mediaInfo: {
//     color: 'black',
//     fontSize: 15,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   flatListContent: {
//     flexGrow: 1,
//   },
//   videoList: {
//     height: '20%',
//   },
//   video: {
//     marginLeft: 10,
//     height: height * 0.4,
//     width: width * 0.6,
//   },
//   clearChatButton: {
//     backgroundColor: 'green',
//     borderRadius: 20,
//     height: 50,
//     width: 100,
//     alignSelf: 'center',
//     marginTop: 20,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   clearChatButtonText: {
//     color: 'white',
//     fontSize: 15,
//     fontWeight: 'bold',
//   },
//   modalOverlay: {
//     backgroundColor: 'rgba(0,0,0,0.6)',
//     width: '100%',
//     height: '100%',
//   },
//   modalContainer: {
//     height: '50%',
//     top: '30%',
//     width: '95%',
//     alignSelf: 'center',
//     borderRadius: 10,
//     backgroundColor: 'white',
//     elevation: 10,
//     padding: 10,
//   },
//   modalText: {
//     color: 'black',
//     fontWeight: 'bold',
//     fontSize: 24,
//     textAlign: 'justify',
//   },
//   modalButtonYes: {
//     backgroundColor: 'green',
//     height: 50,
//     width: 100,
//     alignItems: 'center',
//     justifyContent: 'center',
//     alignSelf: 'center',
//     marginTop: 50,
//   },
//   modalButtonCancel: {
//     backgroundColor: 'red',
//     height: 50,
//     width: 100,
//     alignItems: 'center',
//     justifyContent: 'center',
//     alignSelf: 'center',
//     marginTop: 20,
//   },
//   modalButtonText: {
//     color: 'white',
//     fontWeight: 'bold',
//   },
// });

// export default ChatProfile;
