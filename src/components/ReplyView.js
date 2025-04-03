import React from 'react'
import { View,Text, Image} from 'react-native'
import Video from 'react-native-video'
import Icon from 'react-native-vector-icons/MaterialIcons';

const ReplyView = ({reply,user}) => {
  return (
    <View
             style={{
               width: '95%',
               marginLeft: 10,
               position: 'absolute',
               bottom: 90,
             }}>
             <View
               style={{
                 width: '95%',
                 backgroundColor: 'green',
                 marginLeft: 10,
                 borderRadius: 5,
                 top: 4,
                 elevation: 10,
               }}>
               <View
                 style={{
                   marginLeft: 5,
                   marginTop: 5,
                   marginBottom: 10,
                   backgroundColor: 'rgba(0,0,0,0.3)',
                   padding: 10,
                   width: '97%',
                   borderRadius: 10,
                 }}>
                 <Text style={styles.label}>
                   {reply.uid === user ? 'You' : reply.name}
                 </Text>
                 {
                  reply.mediaType==='photo'?<Image source={{uri:reply.message}} style={{height:300,width:300}}></Image>:
                  reply.mediaType==='video'?<Video paused={true} source={{uri:reply.message}} style={{height:300,width:300}}></Video>:
                  reply.mediaType==='oneTimeImage'?<View>
                    <View style={{height:40,width:90,backgroundColor:'black',borderRadius:30,alignItems:'center',justifyContent:'center'}}>
                     <Text style={{color:'white',fontSize:20,fontWeight:'bold'}}>Shared</Text> 
                    </View>
                    <Text style={{color:'black',fontSize:20,fontWeight:'bold'}}>{reply.message.uploaderName}</Text>
                    <Image source={{uri:reply.message.uploaderProfileUrl}} style={{marginTop:10,height:200,width:200,resizeMode:'stretch'}}></Image></View>:
                  reply.mediaType==='audio'||reply.mediaType!=='text'?<View style={{height:'100%',flexDirection:'row',alignItems:'center',justifyContent:'flex-start'}}><Icon name={reply.mediaType==='audio'?'audiotrack':'file-open'} size={60} color={'black'}></Icon><Text style={{color:'black',fontSize:20,fontWeight:'bold',width:'70%'}}>{reply.fileName}</Text>{reply.mediaType==='audio'&&<Icon name='play-arrow' size={30} color={'black'}></Icon>}</View>:<Text style={{color:'black',fontSize:20,fontWeight:'bold'}}>{reply.message}</Text>
                 }
               </View>
             </View>
           </View>
  )
}

const styles={
    label: {
        color: 'black',
        fontSize: 20,
        fontWeight: 'bold',
      },
}

export default ReplyView
