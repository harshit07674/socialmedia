import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/MaterialIcons';
import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';
import SoundPlayer from 'react-native-sound-player';

const MediaMessage = ({item}) => {
 
  const [videoPane, setVideoPane] = useState(false);
  const [pause, setPause] = useState(true);
  const [downloadPath, setDownloadPath] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [coordinates, setCoordinates] = useState(null);
  const[audio,setAudioFile]=useState(null);
  const [isAudio,setAudio]=useState(false);
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
  

  const playAudio=(item)=>{
     if(isPlaying){
      pauseAudio();
     }
     else{
 if(isFirstPlay){
  SoundPlayer.resume();
 }
 else{
   SoundPlayer.playUrl(item.message);
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

  useEffect(()=>{
    let interval;
 if(isPlaying){
  fetchSoundDetails();
  SoundPlayer.addEventListener('FinishedPlaying',()=>{
    SoundPlayer.stop();
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

  // const getLocationPath = callback => {
  //   Geolocation.getCurrentPosition(
  //     position => {
  //       const {latitude, longitude} = position.coords;
  //     },
  //     error => {
  //       console.log(error.message);
  //     },
  //     {
  //       enableHighAccuracy: true,
  //       timeout: 15000,
  //       maximumAge: 10000,
  //     },
  //   );
  // };

  // const fetchMap = () => {
  //   getLocationPath((latitude, longitude) => {
  //     setCoordinates({latitude, longitude});
  //     OpenMap({latitude, longitude});
  //   });
  // };

  const openFile = async () => {
    try {
      await FileViewer.open(downloadPath);
    } catch (error) {
      console.log(error);
    }
  };

  const downloadFile = async () => {
    try {
      if (
        item.mediaType !== 'video' &&
        item.mediaType !== 'image' &&
        item.mediaType !== 'audio'
      ) {
        const file = `${RNFS.DownloadDirectoryPath}/socialmedia_${item.id}${item.fileName}`;
        const existsFile = await RNFS.exists(file);
        if (existsFile) {
          setDownloadPath(file);
          return;
        }
        setDownloading(true);
        const response = await RNFS.downloadFile({
          fromUrl: item.message,
          toFile: file,
        });
        if (response.statusCode === 200) {
          setDownloadPath(file);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setDownloading(false);
    }
  };

  useEffect(() => {
    downloadFile();
  }, []);
  return (
    <View
      style={{
        overFlow: 'hidden',
        height:
          item.mediaType !== 'video' && item.mediaType !== 'image' ? 100 : 350,
        width:
          item.mediaType !== 'video' && item.mediaType !== 'image'
            ? '90%'
            : '100%',
        backgroundColor: 'white',
        borderRadius: 20,
        elevation: 5,
        marginLeft:
          item.mediaType !== 'video' && item.mediaType !== 'image' ? 10 : 0,
      }}>
      {item.mediaType == 'video' ? (
        <View>
          <View
            style={{
              position: 'absolute',
              height: 50,
              width: 50,
              borderRadius: 30,
              backgroundColor: 'white',
              elevation: 10,
              top: '50%',
              left: '40%',
              zIndex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Icon name="play-arrow" size={30} color={'black'}></Icon>
          </View>
          <Video
            onSeek={data => {}}
            paused={pause}
            style={styles.media}
            source={{uri: item.message}}></Video>
        </View>
      ) : item.mediaType == 'image' ? (
        <Image source={{uri: item.message}} style={styles.media}></Image>
      ) : item.mediaType == 'audio' ? (
        <View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
              marginLeft: 10,
            }}>
            <Icon name="audiotrack" size={60} color={'black'} />
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: 'black',
                width: '40%',
                marginLeft: 10,
              }}>
              {item.fileName.toString().substring(0,10)+'.'+item.fileName.toString().split('.')[1]}
            </Text>
               <TouchableOpacity onPress={()=>skipAudioTrack('next')}>
                    <Icon name='skip-next' color={'black'} size={25} style={{marginTop:20,marginRight:6}}></Icon>
                  </TouchableOpacity>
            <TouchableOpacity onPress={()=>{
                  playAudio(item);
                }}><View style={{marginTop:20,borderRadius:30,alignItems:'center',justifyContent:'center',height:40,width:40,backgroundColor:'white',elevation:10}}>
            <Icon name={isPlaying?'pause':'play-arrow'} size={25} color={'black'
                } /></View></TouchableOpacity>
                <TouchableOpacity onPress={()=>skipAudioTrack('prev')}><Icon name='skip-previous' color={'black'} size={25} style={{marginTop:20,marginLeft:6}}></Icon></TouchableOpacity>
          </View>
          <View style={{flexDirection:'row',width:'80%',marginLeft:10,}}><Text style={{color:'black',fontSize:20,fontWeight:'bold'}}>00:00</Text>
              <View style={{overFlow:'hidden',height:3,width:'40%',flexDirection:'row',backgroundColor:'black',marginTop:10,marginLeft:10,marginRight:10}}>
              <View style={{height:3,width:duration==0?'0%':`${(currentTime/duration)*100}%`,backgroundColor:'red'}}></View>  
              <View style={{height:10,width:10,borderRadius:10,backgroundColor:'white',alignSelf:'center'}}></View>
              </View>
              <Text style={{color:'black',fontSize:20,fontWeight:'bold'}}>{`${currentMinute.toString().padStart(2,'0')}:${currentDuration.toString().padStart(2,'0')}/${Math.floor(duration/60).toString().padStart(2,'0')}:${Math.floor(duration%60).toString().padStart(2,'0')}`}</Text></View>

       </View>
      ) : (
        <TouchableOpacity onPress={() => openFile()}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
              marginLeft: 20,
            }}>
            <Icon name="file-open" size={60} color={'black'} />
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: 'black',
                width: '70%',
                marginLeft: 10,
              }}>
              {item.fileName}
            </Text>
            {downloading && <ActivityIndicator color={'black'} />}
          </View>
        </TouchableOpacity>
      )}
      <Text style={{fontSize: 18, color: 'black'}}>{item.captionText}</Text>
    </View>
  );
};

const styles = {
  media: {
    height: 300,
    width: 300,
    resizeMode: 'stretch',
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
};
export default MediaMessage;
