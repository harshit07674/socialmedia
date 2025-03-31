import React, {useEffect, useState} from 'react';
import {
  View,
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  Pressable,
  Alert,
} from 'react-native';
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/MaterialIcons';
import cameraPermission from '../permissions/CameraPermission';
import gallerryPermission from '../permissions/GallerryPermission';
import storage from '@react-native-firebase/storage';


const Friends = ({navigation, route}) => {
  const [follows, setFollows] = useState(null);
  const [uiLoading, setLoading] = useState(false);
  const [selectedList, setSelectedList] = useState([]);
  const id = auth().currentUser.uid;
  const [messageCounts,setMessageCounts]=useState([]);
  const [showImagePicker,setShowImagePicker]=useState(false);
  const [cameraImage,setCameraImage]=useState(null);
  const [index,setIndex]=useState(-1);

    // Handles the logic for selecting an image from the camera or gallery
    const handleImagePicker = type => {
      const options = {
        mediaType: 'photo',
        quality: 1,
      };
  
      const options2={
        mediaType:'video',
        quality:1,
      }
  
      const callback = response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.assets && response.assets[0].uri) {
          setCameraImage(response.assets[0]);
          console.log(response.assets[0]);
        }
        setShowImagePicker(false);
      };
  
      if (type === 'camera') {
        cameraPermission(options, callback);
      }
      if (type === 'gallery') {
        gallerryPermission(options, callback);
      }
      if(type==='video'){
        gallerryPermission(options2,callback);
      }
    };

  // format date and time into human readable form
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

  const sendOneTimePhoto=async(sendId)=>{
    try{
      const storageReference = storage().ref(
        `/SocialMedia/${id}/SocialMediaSnaps`,
      );
      const reference = firebase
      .app()
      .database(
        'https://photoshare-e09d4-default-rtdb.asia-southeast1.firebasedatabase.app/',
      );
      const chatRef = reference.ref('/SocialMediaChats/');
      const profileRef = reference
      .ref('/SocialMediaUsers/')
      .child(id)
      .child('profile');
      const dateTime = Date.now().toString();
      const realDate = formatTime(dateTime);
      let data;
      await profileRef.once('value').then(snapshot => {
        data = snapshot.val();
        console.log(data);
      });
      const chatIdList = [id, sendId];
        chatIdList.sort();
        const room = chatIdList.join('_');
        await storageReference.child(room).child(dateTime).putFile(cameraImage.uri);
        const url = await storageReference.child(room).child(dateTime).getDownloadURL();
        await chatRef.child('snaps').child(room).child(dateTime+id).set({
          uid: id,
          message: url,
          profilePhoto: data.profilePhoto,
          isSeen:false,
          name: data.name,
          id: dateTime+id,
          date: realDate.formatedDate,
          time: realDate.realTime,
        }),
        await chatRef.child(room).child(dateTime).set({
          uid: id,
          message: "Sent A Snap",
          snap:true,
          isShared: false,
          isForward:false,
          isSeen:false,
          isReply:false,
          profilePhoto: data.profilePhoto,
          name: data.name,
          isMedia: false,
          id: dateTime,
          date: realDate.formatedDate,
          time: realDate.realTime,
        });
        Alert.alert('Snap Sent');
        setCameraImage(null);
        setIndex(-1);
        setShowImagePicker(false);
        
    }
    catch(error){
   console.log(error);
    }
  }

  // allows user to share post in chat
  const shareMessage = async () => {
    const reference = firebase
      .app()
      .database(
        'https://photoshare-e09d4-default-rtdb.asia-southeast1.firebasedatabase.app/',
      );

    const chatRef = reference.ref('/SocialMediaChats/');

    const profileRef = reference
      .ref('/SocialMediaUsers/')
      .child(id)
      .child('profile');

    try {
      const dateTime = Date.now().toString();
      const realDate = formatTime(dateTime);
      let data;
      await profileRef.once('value').then(snapshot => {
        data = snapshot.val();
        console.log(data);
      });
      const message = {
        url: route.params.item.ImagePost,
        uploaderName: route.params.item.name,
        uploaderProfileUrl: route.params.item.profilePhoto,
        uploaderCaption: route.params.item.caption,
        postId:route.params.item.id,
      };
      if(route.params.isForward===false){
      selectedList.forEach(async sendId => {
        const chatIdList = [id, sendId];
        chatIdList.sort();
        const room = chatIdList.join('_');
        await chatRef.child(room).child(dateTime).set({
          uid: id,
          message: message,
          isShared: true,
          isForward:false,
          isSeen:false,
          isReply:false,
          mediaType:'oneTimeImage',
          profilePhoto: data.profilePhoto,
          name: data.name,
          isMedia: true,
          id: dateTime,
          date: realDate.formatedDate,
          time: realDate.realTime,
        });
      });

      Alert.alert('Image Shared');
    }
    else{
      selectedList.forEach(async sendId => {
        const chatIdList = [id, sendId];
        chatIdList.sort();
        const room = chatIdList.join('_');
        await chatRef.child(room).child(dateTime).set({
          uid: id,
          message: route.params.item.message,
          isShared: false,
          isSeen:false,
          isReply:false,
          isForward:true,
          captionText:route.params.item.isMedia?route.params.item.captionText:'',
          profilePhoto: data.profilePhoto,
          name: data.name,
          isMedia: route.params.item.isMedia,
          id: dateTime,
          date: realDate.formatedDate,
          time: realDate.realTime,
        });
      }); 
    }
      navigation.goBack();
    } catch (error) {
      console.log(error);
    }
  };

  // handles wether user is on this screen for sharing post or for starting a chat
  const handleAction = (uid, item) => {
    if (route.params.isShare) {
      if (selectedList.includes(uid)) {
        const ind = selectedList.indexOf(uid);
        selectedList.splice(ind, 1);
        setSelectedList(s => [...selectedList]);
      } else {
        setSelectedList(s => [...s, uid]);
      }
    } else {
      navigation.navigate('Messages', {id: uid, name:item.name,profile:item.profilePhoto});
    }
  };

  // fetches followers of user
  const fetchFollows = async () => {
    try {
      setLoading(true);
      const reference = firebase
        .app()
        .database(
          'https://photoshare-e09d4-default-rtdb.asia-southeast1.firebasedatabase.app/',
        )
        .ref('/SocialMediaUsers/')
        .child(id)
        .child('Follows');

      await reference.on('value', snapshot => {
        const userData = snapshot.val();
        if (userData) {
          console.log(userData);
          setFollows(Object.values(userData));
        }
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFollows();
    return()=>{
      fetchFollows();
    }
  }, []);

  if (uiLoading) {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator color={'black'}></ActivityIndicator>
      </View>
    );
  }
  return (
    <View style={{height: '100%', width: '100%'}}>
      <FlatList
        style={{flex: 1, marginTop: 20, elevation: 10}}
        contentContainerStyle={{flexGrow: 1}}
        data={follows}
        keyExtractor={item => item.uid} // Assuming each post has a unique 'id'
        renderItem={({item,index}) => {
          
          return <Pressable onPress={() => handleAction(item.uid,item)}>
            <View
              style={
                route.params.isShare && selectedList.includes(item.uid)
                  ? styles.selectedContainer
                  : styles.container
              }>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                }}>
                <View style={styles.circle}>
                  <Image
                    source={{uri: item.profilePhoto}}
                    style={styles.imageCircle}></Image>
                </View>
                <Text style={styles.label}>{'@' + item.name}</Text>
              </View>
              <TouchableOpacity onPress={()=>{
                setIndex(index);
                handleImagePicker('camera')}}><Icon name="camera" size={30} color={'black'}></Icon></TouchableOpacity>
            </View>
          </Pressable>
          
          
        }}
      />
      {selectedList.length !== 0 && (
        <View
          style={{alignItems: 'flex-end', marginRight: 20, marginBottom: 10}}>
          <TouchableOpacity onPress={() => shareMessage()}>
            <Icon name={'send'} color={'green'} size={60}></Icon>
          </TouchableOpacity>
        </View>
      )}
       {route.params.isShare!==true && cameraImage!==null && <View style={{position:'absolute',height:'100%',width:'100%',backgroundColor:'white',elevation:10}}>
       <TouchableOpacity onPress={()=>{
          setCameraImage(null);
          setShowImagePicker(false);
          setIndex(-1);
         }}><View style={{marginTop:10,marginBottom:10,marginLeft:'80%',alignItems:'center',justifyContent:'center',width:60,height:60,borderRadius:35,backgroundColor:'white',elevation:10}}>
         <Icon name={'close'} size={40} color={'black'} style={{alignSelf:'center'}}></Icon>
        </View></TouchableOpacity> 
          <Image source={{uri:cameraImage.uri}} style={{width:'95%',height:'75%',borderRadius:20,marginLeft:10}}></Image>
          <View style={{flexDirection:'row',alignItems:'flex-start',justifyContent:'space-between'}}><View style={{height:60,borderRadius:30,backgroundColor:'rgba(0,0,0,0.5)',marginLeft:20,marginTop:20,padding:15}}><Text style={{color:'white',fontSize:20,fontWeight:'bold'}}>{follows[index].name}</Text></View>
          <View style={{alignItems:'center',justifyContent:'center',height:60,width:60,borderRadius:30,borderColor:'black',borderWidth:4,marginTop:20}}>
          <Text style={{fontSize:20,color:'black',fontWeight:'bold'}}>1</Text>
          </View>
          <View style={{marginRight:10,backgroundColor:'green',elevation:10,alignItems:'center',justifyContent:'center',height:60,width:60,borderRadius:30,borderColor:'black',borderWidth:4,marginTop:20}}>
          <TouchableOpacity onPress={()=>sendOneTimePhoto(follows[index].uid)}><Icon name='send' size={30} color={'black'}></Icon></TouchableOpacity>
          </View>
          </View>
         </View>              
            }
    </View>
  );
};

const styles = {
  profile: {
    marginTop: 10,
    width: 80,
    height: 80,
    borderRadius: 50,
  },
  container: {
    width: '95%',
    marginLeft: 10,
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderTopColor: 'grey',
    alignItems: 'center',
    borderRadius: 15,
    borderTopWidth: 2,
    paddingRight: 10,
  },
  circle: {
    height: 70,
    width: 70,
    borderRadius: 50,
    borderColor: 'green',
    borderWidth: 5,
    marginLeft: 10,
    backgroundColor: 'black',
    elevation: 10,
    overflow: 'hidden',
  },
  imageCircle: {
    height: 70,
    width: 70,
    borderRadius: 50,
    resizeMode: 'stretch',
  },
  imageContainer: {
    marginLeft: 10,
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  label: {
    marginLeft: 10,
    fontSize: 20,
    color: 'black',
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
  selectedContainer: {
    width: '95%',
    marginLeft: 10,
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'green',
    borderTopColor: 'grey',
    alignItems: 'center',
    borderRadius: 15,
    borderTopWidth: 2,
    paddingRight: 10,
  },
  send: {
    alignSelf: 'flex-end',
  },
};

export default Friends;
