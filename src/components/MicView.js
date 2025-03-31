import React,{useState} from 'react'
import { View,Text, TouchableOpacity } from 'react-native'
import { GestureDetector,Gesture } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/MaterialIcons';
import AudioRecorderPlayer, {
    AudioEncoderAndroidType,
    AudioSourceAndroidType,
    AVModeIOSOption,
    AVEncoderAudioQualityIOSType,
    AVEncodingOption,
   } from 'react-native-audio-recorder-player';
   import RNFS from 'react-native-fs';
   import SoundPlayer from 'react-native-sound-player';

const MicView = ({user}) => {

    const[audioDesc,setAudioDesc] = useState({});
   const audioRecorder = new AudioRecorderPlayer();
   audioRecorder.setSubscriptionDuration(0.1);
    const [isRecording, setIsRecording] = useState(false);
     const [audioPath, setAudioPath] = useState('');
     const [isPlaying, setIsPlaying] = useState(false);
  
const onStartRecord = async () => {
    try {
      const dateTime = Date.now();
      const path = `${RNFS.ExternalDirectoryPath}/${user}_${dateTime}.mp3`; // Ensure the path is valid
      setAudioPath(path);
      setIsRecording(true); // Set recording state to true


    const audioSet = {
      AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
      AudioSourceAndroid: AudioSourceAndroidType.MIC,
      AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
      AVNumberOfChannelsKeyIOS: 2,
      AVFormatIDKeyIOS: AVEncodingOption.aac,
    };
    // console.log('audioSet', audioSet);
      const uri = await audioRecorder.startRecorder(path,audioSet);
      audioRecorder.addRecordBackListener((e) => {
        setAudioDesc({
          recordSecs: e.currentPosition,
          recordTime: audioRecorder.mmssss(
            Math.floor(e.currentPosition),
          ),
        });
    });
    console.log(`uri: ${uri}`);
    }
    catch(error){
      console.log(error);
    }
  };

const onStopRecord = async () => {
  try{
    const result = await audioRecorder.stopRecorder();
    console.log(result);
    setAudioPath(null);
     audioRecorder.removeRecordBackListener((e)=>{});
    setIsRecording(false); // Reset recording state
    console.log(isRecording);
    setAudioDesc({}); 
    console.log(audioDesc);// Reset audio description stat
  }
  catch(error){
    console.log(error);
  }
  };

const audioGesture=Gesture.LongPress().onBegin(()=>{
    onStartRecord();
}).onEnd(()=>{
    onStopRecord();
      }).onTouchesCancelled(()=>{
        onStopRecord();
      })

  return (
    <View style={{justifyContent:'flex-end',position:'absolute',backgroundColor:'rgba(0,0,0,0.4)',height:'100%',width:'100%'}}>
      <View style={{}}></View>
           <TouchableOpacity onLongPress={()=>onStartRecord()}><View style={{alignItems:'center',justifyContent:'center',alignSelf:'center',marginBottom:20,height:100,width:100,borderRadius:50,backgroundColor:'white',elevation:10}}>
              <Icon name='mic' size={60} color={'black'}></Icon>
            <Text>{audioDesc!=null?audioDesc.recordTime:' '}</Text> 
            </View></TouchableOpacity>
            <TouchableOpacity onPress={()=>onStopRecord()} style={{marginBottom:80}}><Icon name='pause' color={'black'} size={100}></Icon></TouchableOpacity>  
            </View>
  )
}

export default MicView
