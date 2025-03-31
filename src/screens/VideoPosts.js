
// import React, { useEffect, useState,useRef } from 'react'
// import { TouchableOpacity, Text } from 'react-native'

// import { View, FlatList,Pressable,Animated } from 'react-native'
// import auth from '@react-native-firebase/auth';
// import firebase from '@react-native-firebase/app';
// import Video from 'react-native-video';
// import Icon from 'react-native-vector-icons/\MaterialIcons';



// const VideoPosts = () => {
//     const [video,setVideo]=useState(null);
//     const [pause,setPaused]=useState(false);
//     const vidRef = useRef(null);
//     const [currTime,setCurrTime]=useState(0);
//     const [progress,setProgress]=useState(0);
//     const [duration,setDuration]=useState(0);

//     const fetchVideos=async()=>{
//         try{
//             const reference = firebase
//             .app()
//             .database(
//               'https://photoshare-e09d4-default-rtdb.asia-southeast1.firebasedatabase.app/',
//             )
//             .ref('/SocialMediaPosts/');

//             await reference.orderByChild('mediaType').equalTo('video').on('value',snapshot=>{
//              const data = snapshot.val();
//               if(data){
//                 console.log({videoPosts:data});
//                 setVideo(Object.values(data));
//               }
//             });
//         }
//         catch(error){
//             console.log(error);
//         }
//     }
//     useEffect(()=>{
//      fetchVideos();
//     },[])
//   return (
//     <View style={{height:'100%',width:'100%'}}>
//     <FlatList style={{ height: '100%', width: '100%' }}
    

//     contentContainerStyle={{flexGrow:1}}
//     data={video}
//     keyExtractor={(item)=>item.id}
//     renderItem={({item,index})=>{
//         return (
//             <View style={{height:'100%',width:'100%'}}>
//             <Pressable onPress={()=>{
//                 setPaused(!pause);
//             }}><Video
//             onError={(error)=>{
//                 console.log(error);
//             }}
//                 ref={vidRef}
//                 onProgress={(data)=>{
//                     setCurrTime(data.currentTime);
                   
//                 }}
//                 style={{ height: '80%', width: '100%' }}
//                 source={{ uri: item.ImagePost }}
//                 resizeMode="contain"
//                 repeat
//                 paused={pause}
//             />
//             {pause && <View style={{top:'46%',left:'40%',alignItems:'center',justifyContent:'center',position:'absolute',height:50,width:50,borderRadius:20,backgroundColor:'white',elevation:10}}>
//             <Icon name={'play-arrow'} color={'black'} size={30}></Icon>    
//             </View>}
//             </Pressable>  
//             <View style={{height:10,width:'95%',marginLeft:10,backgroundColor:'white',borderColor:'black',borderWidth:2,borderRadius:40}}>
//             <Animated.View style={[{backgroundColor:'red',height:10,borderRadius:40,elevation:10},{width:currTime}]}></Animated.View>    
//             </View>
//            </View>
//         )

//     }}
//     ></FlatList>    
//     </View>
//   )
// }

// export default VideoPosts
