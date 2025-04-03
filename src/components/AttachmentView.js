import React, { useRef, useState } from 'react';
import {View,Modal,TouchableOpacity,FlatList,Image,TextInput,Text,Pressable,Animated} from 'react-native'
import Video from 'react-native-video';
import Icon  from 'react-native-vector-icons/MaterialIcons';


const AttachmentView = ({setterFunction,images,videoFiles,receiverName,shareFunction,caption,setCaption}) => {

    const [currentTime,setCurrentTime]=useState(0);
    const [hours,setHours]=useState(0);
    const [minutes,setMinutes]=useState(0);
    const [duration,setDuration]=useState(0);
    const [realDuration,setRealDuration]=useState(0);
    const [paused,setPaused]=useState(false);
    const [sliderValue, setSliderValue] = useState(0);

    const videoRef=useRef(null);

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

  return (
    (
        <View style={styles.bottomSheet}>
          <TouchableOpacity onPress={setterFunction} style={{backgroundColor:'white',width:60,height:60,borderRadius:30,elevation:10,marginLeft:30,alignItems:'center',justifyContent:'center'}}><Icon name='close' size={40} color={'black'}></Icon></TouchableOpacity>
          <FlatList
            style={{flex: 1}}
            contentContainerStyle={{flexGrow: 1}}
            data={images}
            horizontal
            renderItem={({item}) => {
               if(!videoFiles){
              return <Image source={{uri: item}} style={styles.image}></Image>
               }
               else{
                return <View style={{height:'80%',width:'100%',}}><Video controls onProgress={(data)=> {
                  setCurrentTime(Math.floor(data.currentTime));
                  setSliderValue(data.currentTime); // Update slider value
                }} onLoad={(data)=>{
                  const durMinute=Math.floor(data.duration/60);
                  let durSecond=data.duration%60;
                  if(durSecond.length<2){
                  durSecond='0'+durSecond;
                  }
                  const totalDuration=durMinute+':'+durMinute;
                   setDuration(totalDuration);
                   setRealDuration(data.duration);
                }} paused={paused} ref={videoRef} source={{uri:item}} style={{flex: 1}}></Video>
                </View>
               }
            }}
            keyExtractor={item => item}></FlatList>
          <View style={styles.roundedField}>
            <Icon name="image" color={'white'} size={40}></Icon>
            <TextInput
              value={caption}
              onChangeText={setCaption}
              placeholder="Write Your Caption"
              placeholderTextColor={'white'}
              style={styles.normalInput}></TextInput>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                height: 40,
                width: 40,
                backgroundColor: 'transparent',
                borderColor: 'white',
                borderWidth: 2,
                borderRadius: 20,
                marginRight: 10,
              }}>
              <Text style={{fontSize: 16, color: 'white'}}>
                {images.length}
              </Text>
            </View>
          </View>
          <View style={styles.squareContainer}>
            <View style={styles.circularNameLabel}>
              <Text style={{fontSize: 16, fontWeight: 'bold', color: 'white'}}>
                {receiverName}
              </Text>
            </View>
            <TouchableOpacity onPress={()=>shareFunction(videoFiles?'video':'photo')}>
              <View style={styles.circularButton}>
                <Icon name={'send'} color={'white'} size={35}></Icon>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      )
  )
}

const styles = {
    label: {
      color: 'black',
      fontSize: 20,
      fontWeight: 'bold',
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
  };
export default AttachmentView
