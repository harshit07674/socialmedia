import React,{useEffect, useState} from 'react';
import { View, Modal, TouchableOpacity, Text } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import attachmentList from '../constants/AttachmentList';
import handleGoogleSignIn from '../backend/HandleGoogleSignin';
import Geolocation from '@react-native-community/geolocation';
import OpenMap from 'react-native-open-maps';
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth'
import DocumentPicker, { isInProgress, pick } from 'react-native-document-picker';
import SoundPlayer from 'react-native-sound-player';
import RNFS from 'react-native-fs';
import storage from '@react-native-firebase/storage';

const AttachmentModal = ({ audioFunction,chatList,openAttachment, setOpenAttachment, handleImagePicker, pickDocument }) => {

  const [coordinates,setCoordinates]=useState(null);
  const [isAudio,setAudio]=useState(false);
  const [audio,setAudioFile]=useState(null);
  const [isPlaying,setPlaying]=useState(false);
  const [duration,setDuration]=useState(0);
  const [currentDuration,setCurrentDuration]=useState(0);
  const [currentMinute,setMinute]=useState(0);
  const [currentTime,setCurrentTime]=useState(0);
  const [isFirstPlay,setFirstPlay]=useState(false);


  const fetchSoundDetails=()=>{
 
    const info = SoundPlayer.getInfo();
    info.then(({duration})=>{
      setDuration(duration);
      console.log({duration});
    })
  
  }
  

  const playAudio=()=>{
     if(isPlaying){
      pauseAudio();
     }
     else{
 if(isFirstPlay){
  SoundPlayer.resume();
 }
 else{
   SoundPlayer.playUrl(audio.uri);
   setFirstPlay(true);
 }
   
     }
     setPlaying(!isPlaying);
    
  }

  const skipAudioTrack=(skipMode)=>{
    if(skipMode==='next'){
    SoundPlayer.seek(currentTime+10);
    }
    else{
      SoundPlayer.seek(currentTime-10);
    }
  }

  const pauseAudio=()=>{
    SoundPlayer.pause()
  }

  const sendAudioFile=async()=>{
  try{
    const result = await DocumentPicker.pick({
      type: [DocumentPicker.types.audio],
      allowMultiSelection: false,
      requestLongTermAccess:true,
    });
    if(result){
      setAudio(true);
      setAudioFile(result[0]);
      console.log({audio});
    }
  }
  catch(error){
console.log(error);
  }
  }

  const formatTime = userDate => {
    const actualTimeStamp = parseInt(userDate);
    const date = new Date(actualTimeStamp);
    const actual = date.toLocaleString('en-IN');
    let time = date.getHours();
    let formatTime = '';
    let meridian = '';
    let minute = date.getMinutes();
    if (time > 12) {
      time = time % 12;
      meridian = 'pm';
      formatTime = time === 0 ? '12' : time < 10 ? '0' + time : time.toString();
    } else {
      meridian = 'am';
      formatTime = time < 10 ? '0' + time : time.toString();
    }
    const formatMinute = minute < 10 ? '0' + minute : minute.toString();
    const formatedDate =
      actual.split(' ')[0] +
      ',' +
      date.getUTCDate() +
      ' ' +
      actual.split(' ')[1] +
      ' ' +
      date.getUTCFullYear() +
      ' ';
    const realTime = formatTime + ':' + formatMinute + ' ' + meridian;
    return {realTime, formatedDate};
  };

  const sendAudioInChat=async()=>{
    try{
      const id = auth().currentUser.uid;
      const reference2 = firebase
      .app()
      .database(
        'https://photoshare-e09d4-default-rtdb.asia-southeast1.firebasedatabase.app/',
      )
      .ref('/SocialMediaUsers/')
      .child(id)
      .child('profile');
  
      let data;
      await reference2.once('value').then(snapshot => {
        data = snapshot.val();
        console.log(data);
      });
       chatList.sort();
       const room = chatList.join('_');
       const reference = firebase
       .app()
       .database(
         'https://photoshare-e09d4-default-rtdb.asia-southeast1.firebasedatabase.app/',
       )
       .ref('/SocialMediaChats/')
       .child(room);
       const dateTime= Date.now().toString();
       const realDate=formatTime(dateTime);
       const storageReference = storage().ref(
        `/SocialMedia/${id}/SendMedia/${room}`,
      );
      const localPath = `${RNFS.ExternalDirectoryPath}/${audio.name}`;
      await RNFS.copyFile(audio.uri,localPath);
      console.log('localpath:',localPath);
      await storageReference.child(`AudioFile_${dateTime}`).putFile(localPath);
        const url = await storageReference
          .child(`AudioFile_${dateTime}`)
          .getDownloadURL(); 
       await reference.child(dateTime).set({
        uid: id,
            message: url,
            profilePhoto: data.profilePhoto,
            name: data.name,
            isSeen: false,
            isForward: false,
            isReply: false,
            isMedia: true,
            mediaType:'audio',
            fileName:audio.name,
            isShared: false,
            snap:false,
            id: dateTime,
            date: realDate.formatedDate,
            time: realDate.realTime,
       })
       setAudioFile(null);
       setDuration(0);
       setCurrentDuration(0);
       setCurrentTime(0);
       setFirstPlay(false);
       setMinute(0);
       setPlaying(false);
       setAudio(false);
       
     }
     catch(error){
      console.log(error);
     }

  }
  
  const sendLocation=async(lat,long)=>{
   try{
    const id = auth().currentUser.uid;
    const reference2 = firebase
    .app()
    .database(
      'https://photoshare-e09d4-default-rtdb.asia-southeast1.firebasedatabase.app/',
    )
    .ref('/SocialMediaUsers/')
    .child(id)
    .child('profile');

    let data;
    await reference2.once('value').then(snapshot => {
      data = snapshot.val();
      console.log(data);
    });
     chatList.sort();
     const room = chatList.join('_');
     const reference = firebase
     .app()
     .database(
       'https://photoshare-e09d4-default-rtdb.asia-southeast1.firebasedatabase.app/',
     )
     .ref('/SocialMediaChats/')
     .child(room);
     const dateTime= Date.now().toString();
     const realDate=formatTime(dateTime);
     await reference.child(dateTime).set({
      uid: id,
          message: {latitude:lat,longitude:long},
          profilePhoto: data.profilePhoto,
          name: data.name,
          isSeen: false,
          isForward: false,
          isReply: false,
          isMedia: false,
          isShared: false,
          snap:false,
          id: dateTime,
          date: realDate.formatedDate,
          time: realDate.realTime,
     })
   }
   catch(error){
    console.log(error);
   }
  }

  const getLocationPath=(callback)=>{
  Geolocation.getCurrentPosition(
    position=>{
      const {latitude,longitude}=position.coords;
      console.log(latitude,longitude)
      sendLocation(latitude,longitude);
    },
    error=>{
      console.log(error.message);
    },
    {
      enableHighAccuracy:true,
      timeout:15000,
      maximumAge:10000
    }
  );

  }

  const fetchMap=()=>{
    getLocationPath((latitude,longitude)=>{
      setCoordinates({latitude,longitude})
      OpenMap({latitude,longitude})
    });
  }

  useEffect(()=>{
    let interval;
 if(isPlaying){
  fetchSoundDetails();
  SoundPlayer.addEventListener('FinishedPlaying',()=>{
    SoundPlayer.playUrl(audio.uri);
  })
  interval=setInterval(()=>{
    SoundPlayer.getInfo().then(({
      currentTime
    })=>{
      let dur=currentTime
      setCurrentTime(currentTime);
      setCurrentDuration(Math.floor(currentTime%60))
      setMinute(Math.floor(currentTime/60))
    })
  },1000)
 }
 return ()=>{

  clearInterval(interval);
 }
  },[isPlaying])

  return (
    <View>
    <Modal visible={openAttachment} transparent={true} animationType="slide" onRequestClose={() => setOpenAttachment(false)}>
       <View style={styles.modalContainer}>
      <FlatList data={attachmentList} columnWrapperStyle={{marginBottom:10}} keyExtractor={(item)=>item.id} numColumns={3} renderItem={({item})=>{
        return <TouchableOpacity onPress={()=>{
          if(item.id===1){
            handleImagePicker('gallery');
          }
          else if(item.id===2){
           
            handleImagePicker('video');
          }
          else if(item.id===3){
            handleImagePicker('camera');
          }
          else if(item.id===4){
            pickDocument();
          }
          else if(item.id===5){
            fetchMap();
          }
          else if(item.id===6){
            sendAudioFile();
          }
        }}><View style={styles.options}>
        <Icon name={item.iconName} size={40} color={'blue'} />
        <Text style={styles.optionText}>{item.name}</Text>
      </View></TouchableOpacity>
         
      }}></FlatList>
      </View>
      <TouchableOpacity onPress={() => setOpenAttachment(false)}>
          <Icon name="close" size={40} color={'red'} />
        </TouchableOpacity> 
    </Modal>
    <Modal visible={isAudio} transparent={true} style={{height:'30%',width:'100%'}} 
    >
    <View style={{height:'100%',width:'100%',backgroundColor:'rgba(0,0,0,0.5)'}}> 
    <View style={{flexDirection:'row',alignItems:'center',justifyContent:'flex-start',height:'10%',width:'95%',marginLeft:10,marginTop:20,backgroundColor:'white',elevation:10,borderRadius:20,alignSelf:'center'}}>
    <Icon name='audiotrack' size={80} color={'black'}></Icon>
    <Text style={{color:'black',fontSize:20,fontWeight:'bold',width:'70%'}}>{audio && audio.name}</Text>
    </View> 
    <View style={{marginLeft:40,flexDirection:'row',width:'80%',alignItems:'flex-start',justifyContent:'space-between'}}>
      <TouchableOpacity onPress={()=>skipAudioTrack('next')}>
        <Icon name='skip-next' color={'black'} size={40} style={{marginTop:20}}></Icon>
      </TouchableOpacity>
    <TouchableOpacity onPress={()=>{
      playAudio();
    }}><View style={{marginTop:20,borderRadius:30,alignItems:'center',justifyContent:'center',height:50,width:50,backgroundColor:'white',elevation:10}}>
    <Icon name={isPlaying?'pause':'play-arrow'} size={40} color={'black'
    } />
    </View></TouchableOpacity> 
    <TouchableOpacity onPress={()=>skipAudioTrack('prev')}><Icon name='skip-previous' color={'black'} size={40} style={{marginTop:20}}></Icon></TouchableOpacity>
    </View>
    <View style={{flexDirection:'row',width:'80%',marginLeft:10,}}><Text style={{color:'black',fontSize:20,fontWeight:'bold'}}>00:00</Text>
    <View style={{overFlow:'hidden',height:3,width:'60%',flexDirection:'row',backgroundColor:'black',marginTop:10,marginLeft:10,marginRight:10}}>
    <View style={{height:3,width:duration==0?'0%':`${(currentTime/duration)*100}%`,backgroundColor:'red'}}></View>  
    <View style={{height:10,width:10,borderRadius:10,backgroundColor:'white',alignSelf:'center'}}></View>
    </View>
    <Text style={{color:'black',fontSize:20,fontWeight:'bold'}}>{`${currentMinute.toString().padStart(2,'0')}:${currentDuration.toString().padStart(2,'0')}/${Math.floor(duration/60).toString().padStart(2,'0')}:${Math.floor(duration%60).toString().padStart(2,'0')}`}</Text></View>
    <TouchableOpacity onPress={()=>sendAudioInChat()}><View style={{marginTop:'90%',backgroundColor:'white',borderRadius:30,height:50,width:50,marginLeft:'80%',alignItems:'center',justifyContent:'center'}}>
    <Icon name='send' color={'green'} size={20}></Icon>
    </View></TouchableOpacity>
    </View> 
    </Modal>
    </View>
  );
};

{/* <TouchableOpacity onPress={pickDocument}>
<View style={styles.options}>
  <Icon name="insert-drive-file" size={40} color={'purple'} />
  <Text style={styles.optionText}>Documents</Text>
</View>
</TouchableOpacity> */}


const styles = {
  modalContainer: {
    padding:20,
    height: '40%',
    width: '95%',
    marginLeft: 10,
    top: '41%',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    flexDirection: 'row',
    padding: 15,
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  options: {
    height: 100,
    width: 100,
    borderRadius: 15,
    borderColor: 'grey',
    borderWidth: 2,
    elevation: 10,
    backgroundColor: 'white',
    marginRight: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 15,
  },
};

export default AttachmentModal;
