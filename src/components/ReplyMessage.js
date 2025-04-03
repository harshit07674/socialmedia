import React from 'react';
import { View,Text,Image, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Video from 'react-native-video';
import auth from '@react-native-firebase/auth';

const ReplyMessage = ({item,name}) => {
  const id = auth().currentUser.uid;
  return (
     <View>
       <View style={{padding:10,backgroundColor:'rgba(0,0,0,0.3)'}}> 
       <Text>{name!==item.message.replyToName?'You':item.message.replyToName}</Text>
      {
        item.message.mediaType==='photo'?<Image source={{uri:item.message.replyTo
        }} style={{height:180,width:180}}></Image>:
        item.message.mediaType==='video'?<Video paused={true} source={{uri:item.message.replyTo}} style={{height:200,width:200}}></Video>:
        item.message.mediaType==='oneTimeImage'?<View>
          <Text style={{color:'white',fontSize:20,fontWeight:'bold'}}>{item.message.replyTo.replyToName}</Text>
                            <View style={{height:40,width:90,backgroundColor:'black',borderRadius:30,alignItems:'center',justifyContent:'center'}}>
                             <Text style={{color:'white',fontSize:20,fontWeight:'bold'}}>Shared</Text> 
                            </View>
                            <Text style={{color:'black',fontSize:20,fontWeight:'bold'}}>{item.message.replyTo.uploaderName}</Text>
                            <Image source={{uri:item.message.replyTo.url}} style={{marginTop:10,height:200,width:200,resizeMode:'stretch'}}></Image></View>:
        item.message.mediaType==='audio'||item.message.mediaType!=='text'?<View style={{flexDirection:'row',width:'100%',alignItems:'center',justifyContent:'flex-start'}}><Icon name={item.message.mediaType==='audio'?'audiotrack':'file-open'} color={'black'} size={40}></Icon><Text style={{color:'black',fontSize:20,fontWeight:'bold'}}>{item.message.fileName}</Text>{item.message.mediaType==='audio'&&<Icon name='play-arrow' size={30} color={'black'}></Icon>}</View>:
        <Text>{item.message.replyTo}</Text>
      }
      </View>
      <Text style={{color:'white',fontSize:18}}>{item.replyMessage}</Text>
     </View>
                            
  )
}

export default ReplyMessage
