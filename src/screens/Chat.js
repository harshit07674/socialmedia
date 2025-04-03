import React, {useEffect, useReducer, useRef, useState} from 'react';
import {
  Gesture,
  GestureDetector,
  PanGestureHandler,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';

import {
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
  ActivityIndicator,
  Pressable,
  Text,
  Image,
  ImageBackground,
  Modal,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import cameraPermission from '../permissions/CameraPermission';
import gallerryPermission from '../permissions/GallerryPermission';
import storage from '@react-native-firebase/storage';
import DocumentPicker, { pick } from 'react-native-document-picker';
import Clipboard from '@react-native-clipboard/clipboard';
import Video from 'react-native-video';
import AudioRecorderPlayer, {
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
  AVModeIOSOption,
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
 } from 'react-native-audio-recorder-player';
 import RNFS from 'react-native-fs';
 import SoundPlayer from 'react-native-sound-player';
import ChatHeader from '../components/ChatHeader';
import Reactions from '../components/Reactions';
import ForwardMessage from '../components/ForwardMessage';
import ReplyMessage from '../components/ReplyMessage';
import SharedMessage from '../components/SharedMessage';
import MediaMessage from '../components/MediaMessage';
import SeeReaction from '../components/SeeReaction';
import ChatField from '../components/ChatField';
import AttachmentModal from '../components/AttachmentModal';
import AttachmentView from '../components/AttachmentView';
import ReplyView from '../components/ReplyView';
import MicView from '../components/MicView';
import FileDialog from '../components/FileDialog';
import Geolocation from '@react-native-community/geolocation';
import OpenMap from 'react-native-open-maps';
import Polls from '../components/Polls';
import { ThemeProvider } from '@react-navigation/native';
import ThemesList from '../constants/ThemesList';

const Chat = ({navigation, route}) => {

  const reactionArray=[
    '❤️','😂','😭','😡','😎','💀','💯','🙏','🎉'
]
  const [chats, setChats] = useState(null);
  const id = auth().currentUser.uid;
  const [uiLoading, setLoading] = useState(false);
  const [chatText, setChatText] = useState('');
  const chatIdList = [id, route.params.id];
  const [openAttachment, setOpenAttachment] = useState(false);
  const [selectImages, setSelectedImages] = useState([]);
  const [captionText, setCaption] = useState('');
  const [documents, setDocuments] = useState(null);
  const [online, setOnline] = useState(false);
  const [reply, setReply] = useState(null);
  const [options, setOptions] = useState(false);
  const [currIndex, setIndex] = useState(-1);
  const [chat, setChat] = useState(null);
  const [react, setReact] = useState('');
  const [seeReactions, setSeeReactions] = useState(false);
  const [isVideoFiles,setVideoFiles]=useState(false);
  const videoRef = useRef(null);
  const [paused,setPaused]=useState(false);
  const [currentTime,setCurrentTime] = useState(0);
  const [snaps,setSnaps] = useState(null);
  const [mic,setMic] = useState(false);
  const [videoPane,setVideoPane]=useState(false);
  const [videoSource,setVideoSource]=useState(null);
  const [openFileDialog,setFileDialog]=useState(false);
  const [showForward,setShowForward]=useState(true);
  const [showReply,setShowReply]=useState(true);
  const [showCopy,setshowCopy]=useState(false);
  const [wallpaper,setWallpaper]=useState(null);
  
  
  const fetchMap=(latitude,longitude)=>{
    OpenMap({latitude,longitude});
  }

  const sendFileInChat=async(sendFile)=>{
    try{
      chatIdList.sort();
      const room = chatIdList.join('_');
      const dateTime = Date.now().toString();
      const reference = firebase
        .app()
        .database(
          'https://photoshare-e09d4-default-rtdb.asia-southeast1.firebasedatabase.app/',
        )
        .ref('/SocialMediaChats/')
        .child(room).child('chats')
        .child(dateTime);

      const reference2 = firebase
        .app()
        .database(
          'https://photoshare-e09d4-default-rtdb.asia-southeast1.firebasedatabase.app/',
        )
        .ref('/SocialMediaUsers/')
        .child(id)
        .child('profile');

      const realDate = formatTime(dateTime);

      let data;
      await reference2.once('value').then(snapshot => {
        data = snapshot.val();
        console.log(data);
      });
      const storageReference = storage().ref(
        `/SocialMedia/${id}/SendMedia/${room}`,
      );
      const localPath = `${RNFS.ExternalDirectoryPath}/${sendFile[0].name}`;
      await RNFS.copyFile(documents[0].uri,localPath);
      console.log('localpath:',localPath);
      await storageReference.child(`File_${dateTime}`).putFile(localPath);
        const url = await storageReference
          .child(`File_${dateTime}`)
          .getDownloadURL(); 
          await reference.set({
            uid: id,
            message: url,
            profilePhoto: data.profilePhoto,
            name: data.name,
            isSeen: false,
            isForward: false,
            isReply: false,
            isMedia: true,
            mediaType:sendFile[0].type,
            fileName:sendFile[0].name,
            fileSize:sendFile[0].size,
            isShared: false,
            id: dateTime,
            date: realDate.formatedDate,
            time: realDate.realTime,
          });
          console.log('success');
          setDocuments(null);
          setFileDialog(false);
          setOpenAttachment(false);
          alert("File sent successfully!"); // User feedback on success

    }
    catch(error){
      console.log(error);
    }
  }

  const sendFile=()=>{
    sendFileInChat(documents);
  }

 const fetchSnaps=async()=> {
  try {
    const reference = firebase
        .app()
        .database(
          'https://photoshare-e09d4-default-rtdb.asia-southeast1.firebasedatabase.app/',
        )
        .ref('/SocialMediaChats/')
        .child('snaps');
  chatIdList.sort();
  const room = chatIdList.join('_');
  await reference.child(room).orderByChild('uid').equalTo(route.params.id).on('value',snapshot=> {
    const data = snapshot.val();
    if(data) {
      const actuaData = Object.values(data);
      setSnaps(actuaData);
    console.log(actuaData);
    }
  })
  }
  catch(error) {
    console.log(error);
  }
 }

  const handlePlayPause=()=> {
    setPaused(!paused);
  }
  const skipBackward=()=> {
    videoRef.current.seek(currentTime-15);
    setCurrentTime(currentTime-15);
  }
 const skipForward=()=> {
  videoRef.current.seek(currentTime+15);
  setCurrentTime(currentTime+15);
 }

  const copyToClipboard = () => {
    Clipboard.setString(chat.message);
  };

  const sendReaction = async (reaction, item) => {
    chatIdList.sort();
    const room = chatIdList.join('_');
    const reference = firebase
      .app()
      .database(
        'https://photoshare-e09d4-default-rtdb.asia-southeast1.firebasedatabase.app/',
      )
      .ref('/SocialMediaChats/')
      .child(room).child('chats');

    try {
      console.log(item.reactions);
      if (item.reactions !== undefined) {
        if (item.reactions.includes(id)) {
          const reactions = item.reactions;
          const ind = item.reactions.indexOf(id);
          reactions.splice(ind, 2);
          const newReaction = [...reactions, id, reaction];
          await reference.child(item.id).update({
            reactions: newReaction,
          });
        } else {
          const reactions = [...item.reactions, id, reaction];
          await reference.child(item.id).update({
            reactions: reactions,
          });
        }
      } else {
        const reactions = [id, reaction];
        await reference.child(item.id).update({
          reactions: reactions,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setOptions(false);
    }
  };

  const checkStatus = async () => {
    try {
      const reference = firebase
        .app()
        .database(
          'https://photoshare-e09d4-default-rtdb.asia-southeast1.firebasedatabase.app/',
        )
        .ref('/SocialMediaUsersStatus/')
        .child(route.params.id);
      await reference.on('value', snapshot => {
        const status = snapshot.val();
        if (status === true) {
          setOnline(true);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const pickDocument = async () => {
    try {
      setOpenAttachment(false);
      setFileDialog(true);
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
        allowMultiSelection: false,
        requestLongTermAccess:true,
      });
      if(result){
        setDocuments(result);
        console.log(result[0]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Handles the logic for selecting an image from the camera or gallery
  const handleImagePicker = type => {
    let selectedImage = '';
    const options = {
      mediaType: 'photo',
      quality: 1,
    };
    const options2 = {
      mediaType: 'video',
      quality: 1,
    };

    const callback = response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.assets && response.assets[0].uri) {
       if(type==='video'){
        setVideoFiles(true);
       }
        response.assets.forEach(asset => {
          setSelectedImages(s => [...s, asset.uri]);
        });
      }
      setOpenAttachment(false);
    };

    if (type === 'camera') {
      cameraPermission(options, callback);
    }
    if (type === 'gallery') {
      gallerryPermission(options, callback);
    }
    if (type === 'video') {
      gallerryPermission(options2, callback);
    }
  };

  // fetches all the chats between users
  const fetchChats = async () => {
    try {
      setLoading(true);
      chatIdList.sort();
      const room = chatIdList.join('_');
      setLoading(true);
      const reference = firebase
        .app()
        .database(
          'https://photoshare-e09d4-default-rtdb.asia-southeast1.firebasedatabase.app/',
        )
        .ref('/SocialMediaChats/')
        .child(room)

      await reference.child('chats').orderByChild('id').on('value', snapshot => {
        const chatData = snapshot.val();
        if (chatData) {
          const chatMessages = Object.values(chatData).reverse();
          setChats(chatMessages);
        }
      });
      await reference.child('wallpaper').child(id).on('value',snapshot=>{
        if(snapshot.val()===null){
          setWallpaper(0);
        }
        else{
        const wallpapers = snapshot.val();
        if(wallpapers){ 
          setWallpaper(wallpapers.wallpaper_id-1);
          console.log({wallpaper});
        }
      }
      })
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const updateSeen = async (chatId, userId) => {
    try {
      chatIdList.sort();
      const room = chatIdList.join('_');
      const reference = firebase
        .app()
        .database(
          'https://photoshare-e09d4-default-rtdb.asia-southeast1.firebasedatabase.app/',
        )
        .ref('/SocialMediaChats/')
        .child(room).child('chats')
        .child(chatId);

      if (userId !== id) {
        await reference.update({
          isSeen: true,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  // format date and time in human readable form
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

  // adds new chat message
  const addChat = async (text) => {
    try {
      chatIdList.sort();
      const room = chatIdList.join('_');
      const dateTime = Date.now().toString();
      const reference = firebase
        .app()
        .database(
          'https://photoshare-e09d4-default-rtdb.asia-southeast1.firebasedatabase.app/',
        )
        .ref('/SocialMediaChats/')
        .child(room).child('chats')

      const reference2 = firebase
        .app()
        .database(
          'https://photoshare-e09d4-default-rtdb.asia-southeast1.firebasedatabase.app/',
        )
        .ref('/SocialMediaUsers/')
        .child(id)
        .child('profile');

      const realDate = formatTime(dateTime);

      let data;
      await reference2.once('value').then(snapshot => {
        data = snapshot.val();
        console.log(data);
      });
      if (reply !== null) {
        

        const message = {
          replyTo: reply.message,
          replyToId: reply.id,
          replyToName: reply.name,
          isReplyOnSharedMedia:reply.isShared,
          mediaType:reply.mediaType,
          fileName:reply.mediaType!=='photo'&&reply.mediaType!=='video'&&reply.mediaType!=='text'?reply.fileName:'',
        };
      

        await reference.child(dateTime).set({
          uid: id,
          message: message,
          replyMessage: text,
          profilePhoto: data.profilePhoto,
          name: data.name,
          isSeen: false,
          isForward: false,
          isReply: true,
          isMedia: false,
          isShared: false,
          snap:false,
          mediaType:'text',
          id: dateTime,
          date: realDate.formatedDate,
          time: realDate.realTime,
        });

        setReply(null);
        setIndex(-1);
        setChat(null);
        setOptions(false);
      } else {
        await reference.child(dateTime).set({
          uid: id,
          message: text,
          profilePhoto: data.profilePhoto,
          name: data.name,
          isSeen: false,
          isReply: false,
          isForward: false,
          isMedia: false,
          isShared: false,
          mediaType:'text',
          id: dateTime,
          date: realDate.formatedDate,
          time: realDate.realTime,
        });
      }
      console.log('success');
      setChatText('');
    } catch (error) {
      console.log(error);
    }
  };

  // sends media files
  const shareMedia = async (mediaType) => {
    try {
      chatIdList.sort();
      const room = chatIdList.join('_');
      const dateTime = Date.now().toString();
      const reference = firebase
        .app()
        .database(
          'https://photoshare-e09d4-default-rtdb.asia-southeast1.firebasedatabase.app/',
        )
        .ref('/SocialMediaChats/')
        .child(room).child('chats')
        .child(dateTime);

      const reference2 = firebase
        .app()
        .database(
          'https://photoshare-e09d4-default-rtdb.asia-southeast1.firebasedatabase.app/',
        )
        .ref('/SocialMediaUsers/')
        .child(id)
        .child('profile');

      const realDate = formatTime(dateTime);

      let data;
      await reference2.once('value').then(snapshot => {
        data = snapshot.val();
        console.log(data);
      });
      const storageReference = storage().ref(
        `/SocialMedia/${id}/SendMedia/${room}`,
      );

      selectImages.forEach(async (selectedImage, index) => {
        await storageReference.child(dateTime + index).putFile(selectedImage);
        const url = await storageReference
          .child(dateTime + index)
          .getDownloadURL();         
        await reference.set({
          uid: id,
          message: url,
          profilePhoto: data.profilePhoto,
          name: data.name,
          isSeen: false,
          isForward: false,
          isReply: false,
          captionText,
          isMedia: true,
          mediaType:mediaType,
          isShared: false,
          id: dateTime,
          date: realDate.formatedDate,
          time: realDate.realTime,
        });
        console.log('success');
      });

      setSelectedImages([]);
      setVideoFiles(false);
    } catch (error) {
      console.log(error);
    }
  };

  const setValue = () => {
    setReply(chat);
  };

  useEffect(() => {
    fetchChats();
    checkStatus();
    fetchSnaps();
    return () => {
      fetchChats();
      checkStatus();
      fetchSnaps();
    };
  }, []);

  const updateReactions = async () => {
    try {
      chatIdList.sort();
      const room = chatIdList.join('_');
      const dateTime = Date.now().toString();
      const reference = firebase
        .app()
        .database(
          'https://photoshare-e09d4-default-rtdb.asia-southeast1.firebasedatabase.app/',
        )
        .ref('/SocialMediaChats/')
        .child(room)
        .child(chat.id);
      const reaction = {
        reactId: id,
        react,
      };
      await reference.update({
        reactions: [],
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {}, [react]);

  if (uiLoading) {
    return <ActivityIndicator color={'blue'}></ActivityIndicator>;
  }

  return (
    <ImageBackground resizeMode='cover' source={wallpaper!==null?ThemesList[wallpaper].src:ThemesList[0].src} style={{flex:1,resizeMode:'cover'}}>
    <View style={{flex: 1}}>
      <StatusBar
        backgroundColor={'white'}
        barStyle={'dark-content'}></StatusBar>
      <ChatHeader navToChatProfile={()=>navigation.navigate('chatProfile',{id: route.params.id, name:route.params.name,profile:route.params.profile})} isShowCopy={showCopy} isShowForward={showForward} isShowReply={showReply} name={route.params.name} profile={route.params.profile} online={online} navFunction={()=>navigation.goBack()} option={options} forwardFunction={() => {
                      setValue();
                      navigation.navigate('Friends', {
                        isShare: true,
                        item: chat,
                        isForward: true,
                      });
                    
                    }} replyFunction={() => setReply(chat)} copyFunction={()=>copyToClipboard()}/>  
      {snaps!==null && <TouchableOpacity onPress={()=>navigation.navigate('snap',{id:chatIdList,sendId:route.params.id})}><View style={{flexDirection:'row',alignItems:'center',justifyContent:'center',alignSelf:'center',height:40,paddingLeft:10,paddingRight:10,borderRadius:30,elevation:10,backgroundColor:'rgba(0,0,0,0.2)'}}>
        <Text style={{color:'black',fontSize:20,fontWeight:'bold'}}>{'Snaps: '+snaps.length}</Text>
        <View style={{height:12,width:12,backgroundColor:'red'}}></View>
        </View></TouchableOpacity>}
      <FlatList
        style={{marginBottom: 20}}
        contentContainerStyle={{flexGrow: 1}}
        data={chats}
        keyExtractor={item => item.id} // Assuming each post has a unique 'id'
        scrollEnabled
        renderItem={({item, index}) => {
          if (item.isSeen == false) {
            updateSeen(item.id, item.uid);
          }
          if(item.snap){
            return <View style={{alignItems:'center',justifyContent:'center',backgroundColor:item.uid===id?'rgba(0,125,0,0.5)':'rgba(0,0,255,0.3)',alignSelf:'center',width:'70%',height:25,borderRadius:30,marginTop:10,marginBottom:10}}>
             <Text style={{color:'white',fontSize:14}}>{item.uid===id?'You '+item.message:item.name+' '+item.message}</Text> 
            </View>
          }
          return (
            <View>
              <TouchableOpacity
                onLongPress={() => {
                  setOptions(true);
                  setIndex(index);
                  setChat(item);
                  if(item.isReply==true||item.mediaType==='location'||item.mediaType==='polls'){
                    setShowForward(false);
                  }
                  else{
                    setShowForward(true);
                  }
                  if(item.mediaType==='location'||item.mediaType==='polls'){
                    setShowReply(false);
                  }
                  else{
                    setShowReply(true);
                  }
                  if(item.mediaType!=='text'){
                    setshowCopy(false);
                  }
                  else{
                    setshowCopy(true);
                  }
                }}
                onPress={() => {
                  setOptions(false);
                  setIndex(-1);
                  setChat(null);
                  setReply(null);
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    width: '100%',
                    justifyContent: item.uid === id ? 'flex-end' : 'flex-start',
                    backgroundColor:
                      options && currIndex === index
                        ? 'rgba(0,200,0,0.6)'
                        : 'transparent',
                  }}>
                  <Reactions options={options} currIndex={currIndex} actualIndex={index} reactionfunction={sendReaction} reactionsArray={reactionArray} item={item}></Reactions>
                  <View style={styles.messageBubble(item.uid, id)}>
                    <ForwardMessage forward={item.isForward}></ForwardMessage>
                    <Text style={styles.text('flex-start')}>
                      {item.uid === id ? 'You' : item.name}
                    </Text>
                    {item.isReply ? (
                      <ReplyMessage name={route.params.name} item={item}/>
                    ) : item.isMedia && item.isShared ? (
                      <SharedMessage item={item} navFunction={() =>
                                                      navigation.navigate('Home', {
                                                        postId: item.message.postId,
                                                      })} profileNav={() => navigation.navigate('userProfile', {uid: item.uid})}/>
                    ) : item.isMedia && item.isShared === false ? (
                      <TouchableOpacity onPress={()=>{
                        if(item.mediaType==='video'){
                        setVideoSource(item);
                        setVideoPane(true)
                        }
                         
                      }}><MediaMessage item={item}/></TouchableOpacity>
                    ) : item.mediaType=='polls'?<Polls item={item} chatList={chatIdList}></Polls>:(
                      typeof item.message==='object'?<TouchableOpacity onPress={()=>fetchMap(item.message.latitude,item.message.longitude)}><View>
                        <Icon name='location-pin' color={'red'} size={30}></Icon>
                        <Text style={{color:'black',fontSize:20,fontWeight:'bold'}}>{item.uid===id?'You sent your location':`${item.name} sent his location`}</Text> 
                      </View></TouchableOpacity>:<Text style={styles.messageText(item.snap)}>{item.message}</Text>
                    )}
                    {item.reactions !== undefined && (
                      <TouchableOpacity
                        onPress={() => {
                          setSeeReactions(!seeReactions);
                        }}>
                        <View
                          style={{
                            position: 'absolute',
                            backgroundColor: 'white',
                            elevation: 10,
                            borderRadius: 20,
                            height: 25,
                            width: 25,
                            top: '99%',
                            left: '99%',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <Text>{item.reactions[1]}</Text>
                        </View>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
              {item.uid === id && item.isSeen && (
                <Icon
                  style={{alignSelf: 'flex-end'}}
                  name="visibility"
                  color={'blue'}
                  size={20}
                />
              )}
              <Text style={styles.smallText(item.uid, id)}>
                {item.date + '.' + item.time}
              </Text>
              {/* <SeeReaction reactions={item.reactions.length} seeReactions={seeReactions} item={item}/> */}
            </View>
          );
        }}
      />
    
      {documents && <FileDialog receiver={route.params.name} fileSize={documents[0].size} fileType={documents[0].type} fileUrl={documents[0].url} fileName={documents[0].name} isVisible={openFileDialog} visibleFunction={()=>{
        setFileDialog(false);
        setDocuments(null);
      }} fileSendFunction={()=>sendFileInChat(documents)}></FileDialog>}
      {videoPane && <View style={{height:'100%',width:'100%',backgroundColor:'rgba(252, 252, 252, 0.02)'}}>
          <TouchableOpacity onPress={()=>{
            setVideoSource(null);
            setVideoPane(false);
          }}><View style={{alignItems:'center',justifyContent:'center',height:40,width:40,borderRadius:20,backgroundColor:'white',elevation:10,alignSelf:'flex-start',marginTop:10,marginBottom:10,marginLeft:10}}>
           <Icon name='close' size={25} color={'black'}></Icon> 
          </View></TouchableOpacity>
          <Video style={styles.media} source={{uri:videoSource.message}} controls ></Video></View>}
      <ChatField micOption={()=>setMic(true)} attachmentOption={()=>setOpenAttachment(true)} chatText={chatText} setText={()=>setChat(chatText)} chatFunction={addChat}/>
      <AttachmentModal chatList={chatIdList} openAttachment={openAttachment} setOpenAttachment={setOpenAttachment} handleImagePicker={handleImagePicker} pickDocument={()=>pickDocument()} audioFunction={sendFileInChat}></AttachmentModal>   
      {selectImages.length !== 0 && (
        <AttachmentView setterFunction={ ()=> {
              setSelectedImages([]);
              setOpenAttachment(false);
              setVideoFiles(false);
            }} images={selectImages} handleVideoPlay={()=>handlePlayPause()} videoFiles={isVideoFiles} receiverName={route.params.name} shareFunction={shareMedia} caption={captionText} setCaption={setCaption} ></AttachmentView>
      )}
      {reply !== null && (
       <ReplyView reply={reply} user={id}></ReplyView>
      )}
       {mic && <MicView user={id}></MicView>}
    </View>
    </ImageBackground>
  );
};

const styles = {
  profile: {
    marginTop: 10,
    width: 80,
    height: 80,
    borderRadius: 50,
  },
  container: (uid, actualId) => {
    return {
      marginLeft: 10,
      backgroundColor: uid === id ? 'grey' : 'white',
      borderColor: 'grey',
      alignSelf: uid == actualId ? 'flex-end' : 'flex-start',
      marginRight: 10,
      marginLeft: 10,
      borderRadius: 15,
      paddingLeft: 10,
      paddingRight: 10,
      borderWidth: 2,
      marginTop: 10,
      elevation: 10,
    };
  },
  imageContainer: {
    marginLeft: 10,
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  label: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  },
  roundedButton: color => {
    return {
      alignItems: 'center',
      justifyContent: 'center',
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: color,
      marginLeft: 10,
    };
  },
  chatRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chatTextField: {
    borderRadius: 25,
    borderColor: 'black',
    borderWidth: 2,
    width: '73%',
    marginBottom: 20,
    marginLeft: 10,
    height: 70,
    bottom: 10,
    borderRadius: 25,
    color: 'black',
    fontSize: 18,
  },
  profile: (uid, actualId) => {
    return {
      paddingLeft: 10,
      paddingRight: 10,
      marginTop: 10,
      flexDirection: 'row',
      width: '100%',
      justifyContent: uid === actualId ? 'flex-end' : 'flex-start',
      alignItems: uid === id ? 'flex-end' : 'flex-start',
    };
  },
  messageBubble: (uid, actualId) => {
    return {
      backgroundColor: uid === actualId ? 'green' : 'blue',
      borderRadius: 15,
      padding: 10,
      margin: 10,
    };
  },
  text: (align, color) => {
    return {
      fontSize: 13,
      fontWeight: 'bold',
      color: color ? color : 'white',
      alignSelf: align,
      marginRight: 5,
      marginLeft: 5,
    };
  },
  smallText: (uid, actualId) => {
    return {
      fontSize: 13,
      fontWeight: 'bold',
      color: 'black',
      alignSelf: uid === actualId ? 'flex-end' : 'flex-start',
      marginRight: 5,
      marginLeft: 5,
    };
  },
  messageText:isSnap=> {
    return{
    fontSize: 18,
    color: isSnap?'rgba(0,0,0,0.5)':'white',
    textAlign: 'left',
    }
  },
  triangle: (uid, actualId) => {
    return {
      width: 0,
      height: 0,
      borderLeftWidth: 10,
      borderRightWidth: 10,
      borderBottomWidth: 20,
      borderStyle: 'solid',
      backgroundColor: 'transparent',
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
      borderTopColor: 'blue',
      borderBottomColor: uid === actualId ? 'green' : 'blue',
      position: 'absolute',
      top: '50%',
      zIndex: 1,
      left: uid === actualId ? '95%' : '10%',
    };
  },
  icon: {marginBottom: 30, marginRight: 10},
  messageIndicator: {
    height: 40,
    width: 40,
    borderRadius: 30,
    backgroundColor: 'green',
    alignSelf: 'center',
    marginBottom: 30,
    marginLeft: 10,
    elevation: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  media: {
    height: 300,
    width: '100%',
    resizeMode: 'stretch',
  },
  modalContainer: {
    height: 200,
    width: '95%',
    marginLeft: 10,
    top: '61%',
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
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalButtonText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#333',
  },
  cancelButton: {
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButtonText: {
    color: '#ff4444',
    fontSize: 16,
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
  bottomSheet: {
    height: '93%',
    marginTop: '10%',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    elevation: 7,
    position: 'absolute',
    zIndex: 2,
  },
  image: {
    marginTop: 20,
    marginLeft: 10,
    height: '60%',
    width: '95%',
    borderRadius: 10,
    resizeMode: 'stretch',
  },
  roundedField: {
    height: 60,
    width: '95%',
    marginLeft: 10,
    borderRadius: 30,
    backgroundColor: 'black',
    elevation: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 15,
  },
  normalInput: {
    width: '70%',
    color: 'white',
    fontSize: 18,
  },
  squareContainer: {
    height: 80,
    width: '100%',
    marginTop: 5,
    backgroundColor: 'black',
    elevation: 10,
    flexDirection: 'row',
    paddingLeft: 15,
    paddingRight: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  circularNameLabel: {
    borderRadius: 40,
    elevation: 10,
    padding: 10,
    backgroundColor: 'grey',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circularButton: {
    height: 50,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    backgroundColor: 'green',
    elevation: 10,
  },
  topBar: {
    height: 60,
    width: '100%',
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 10,
  },
  circle: {
    marginLeft: 10,
    height: 50,
    width: 50,
    borderRadius: 25,
    resizeMode: 'stretch',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  status: isStatus => {
    return {
      marginTop: 7,
      backgroundColor: isStatus ? 'green' : 'red',
      width: 13,
      height: 13,
      borderRadius: 20,
      marginLeft: 10,
      marginRight: 6,
    };
  },
  statusText: {
    marginTop: 3,
    color: 'black',
    fontSize: 14,
  },
};

export default Chat;
