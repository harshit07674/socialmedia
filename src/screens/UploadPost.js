import {setUserId} from '@react-native-firebase/analytics';
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Alert,
  StatusBar,
  Pressable,
  Image,
  TouchableOpacity,
} from 'react-native';
import UploadImageView from '../components/UploadImageView';
import DialogBox from '../components/DialogBox';
import cameraPermission from '../permissions/CameraPermission';
import gallerryPermission from '../permissions/GallerryPermission';
import InputField from '../components/InputField';
import AppButton from '../components/AppButton';
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import database from '@react-native-firebase/database';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {circle} from 'react-native/Libraries/Animated/Easing';
import {TextInput} from 'react-native-gesture-handler';

const UploadPost = ({navigation, route}) => {
  const [userData, setData] = useState(null);
  const [date, setDate] = useState('');
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [caption, setCaption] = useState('');
  const [data, setUserData] = useState('');
  const [paused,setPaused]=useState(false);
  const currId = auth().currentUser.uid;

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
        setProfileImage(response.assets[0]);
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

  const fetchProfile=async()=>{
    try{
      const reference = firebase
        .app()
        .database(
          'https://photoshare-e09d4-default-rtdb.asia-southeast1.firebasedatabase.app/',
        );
      await reference.ref('/SocialMediaUsers/').child(currId).child('profile').once('value').then(snapshot=>{
        const data = snapshot.val();
        if(data){
          setData(data);
          console.log(data);
        }
      })
    }
    catch(error){
     console.log(error);
    }
  }

  // format date and time from timestamp into human readable form
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

  // handles upload of post by user
  const handleUpload = async () => {
    setLoading(true);
    try {
      const reference = firebase
        .app()
        .database(
          'https://photoshare-e09d4-default-rtdb.asia-southeast1.firebasedatabase.app/',
        );
      const user = auth().currentUser.uid;
      const dateTime = Date.now().toString();
      const realDate = formatTime(dateTime);
      const storageReference = storage().ref(
        `/SocialMedia/${user}/SocialMediaPostPhoto`,
      );
      await storageReference.child(dateTime).putFile(profileImage.uri);
      const url = await storageReference.child(dateTime).getDownloadURL();
      await reference
        .ref('/SocialMediaPosts/')
        .child(user + dateTime)
        .set({
          name: userData.name,
          email: userData.email,
          uid: user,
          commentCount: 0,
          profilePhoto: userData.profilePhoto,
          ImagePost: url,
          commentCount: 0,
          caption: caption,
          id: user + dateTime,
          mediaType:profileImage.type.startsWith('image/')?'image':'video',
          dateOfPost: realDate.formatedDate,
          timeOfPost: realDate.realTime,
          likes: ['1'],
          likesCount: 0,
        });

      const userReference = firebase
        .app()
        .database(
          'https://photoshare-e09d4-default-rtdb.asia-southeast1.firebasedatabase.app/',
        );
      let posts = 0;
      await userReference
        .ref('/SocialMediaUsers/')
        .child(user)
        .child('profile')
        .once('value')
        .then(snapshot => {
          console.log('User data: ', snapshot.val());
          posts = snapshot.val().totalPosts;
        });
      posts = posts + 1;
      await reference
        .ref('/SocialMediaUsers/')
        .child(user)
        .child('profile')
        .update({
          totalPosts: posts,
        });
      Alert.alert('Success', 'Your Post Uploaded Successfully');
      setProfileImage(null);
      setCaption('');
      navigation.goBack();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
   fetchProfile();
  },[])
  
  return (
    <View style={styles.canvas}>
      <StatusBar
        backgroundColor={'white'}
        barStyle={'dark-content'}></StatusBar>
      <View style={styles.bar}>
        <TouchableOpacity onPress={() => {
          setProfileImage(null);
          navigation.goBack()}}>
          <Icon name="close" color={'black'} size={40}></Icon>
        </TouchableOpacity>
        {userData!==null && <Image
          source={{uri:userData.profilePhoto}}
          style={styles.circle}></Image>}
        <Text style={styles.label('blue')}>Public</Text>
        <Icon
          name="earth"
          color={'black'}
          style={styles.earthIcon}
          size={40}></Icon>
        <TouchableOpacity
          style={styles.postButton}
          onPress={() => handleUpload()}>
          <Text style={styles.label('white')}>Post</Text>
        </TouchableOpacity>
      </View>
      {loading && <View style={styles.indicatorStrip}><Text style={styles.indicationText}>Your Post Is Uploading...</Text></View>}
      <TextInput
        value={caption}
        onChangeText={setCaption}
        style={styles.captionField}
        placeholder="Write Your Caption..."
        placeholderTextColor={'black'}
        multiline
        maxLength={250}></TextInput>
      <TouchableOpacity
        onPress={() => setShowImagePicker(true)}
        style={styles.imageUpload}>
        <Icon name="image-album" size={40} color={'black'} />
      </TouchableOpacity>
      <DialogBox
        isHidden={showImagePicker}
        setHidden={() => setShowImagePicker(false)}
        handleCamera={() => handleImagePicker('camera')}
        handleGallerry={() => handleImagePicker('gallery')}></DialogBox>
      {profileImage != null && (
       <View style={{overflow:'hidden',height:300,width:'95%',marginLeft:10,borderWidth:2,borderColor:'black',borderRadius:20,}}>
       {profileImage.type.startsWith('image/')?<Image source={{uri:profileImage.uri}} style={{height:300,width:'95%',marginLeft:10}}></Image>:<Pressable onPress={()=>setPaused(!paused)}><Video paused={paused} source={{uri:profileImage.uri}} style={{marginTop:10,height:280,width:'95%',marginLeft:10}}></Video></Pressable>}  
       </View>
      )}
    </View>
  );
};

const styles = {
  screen: {
    height: '100%',
    width: '100%',
  },
  canvas: {
    height: '100%',
    width: '100%',
    backgroundColor: 'white',
    paddingTop: 30,
  },
  bar: {
    width: '100%',
    marginLeft: 10,
    marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  circle: {
    marginLeft: 20,
    height: 50,
    width: 50,
    borderRadius: 30,
    resizeMode: 'stretch',
  },
  label: color => {
    return {
      fontSize: 16,
      fontWeight: 'bold',
      color: color,
      marginLeft: 10,
    };
  },
  earthIcon: {
    marginLeft: '25%',
  },
  postButton: {
    height: 40,
    width: 80,
    backgroundColor: 'blue',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  captionField: {
    height: '30%',
    width: '100%',
    padding: 10,
    fontSize: 18,
    marginTop: 10,
    color:'black'
  },
  imageUpload: {
    bottom: 100,
    right: 10,
    zIndex: 1,
    position: 'absolute',
  },
  videoUpload:{
    bottom: 100,
    right: 70,
    zIndex: 1,
    position: 'absolute',
  },
  indicatorStrip:{
    height:50,
    marginTop:30,
    width:'100%',
    backgroundColor:'black',
    alignItems:'center',
    justifyContent:'center'
  },
  indicationText:{
    fontSize:16,
    fontWeight:'bold',
    fontStyle:'italic',
    color:'white'
  }
};

export default UploadPost;
