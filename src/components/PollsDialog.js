import React,{useState} from 'react'
import {View,Text,TouchableOpacity,TextInput,Alert} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons';
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';

const PollsDialog = ({chatIdList,setPolls}) => {
    const [pollsQuestion,setPollQuestion]=useState('');
    const [pollsAnswer1,setPollAnswer1]=useState('');
    const [pollsAnswer2,setPollAnswer2]=useState('');
    const [pollsAnswer3,setPollAnswer3]=useState('');
    const [pollsAnswer4,setPollAnswer4]=useState('');
    const [answerIndex,setAnswerIndex]=useState(-1);
    const [dropDown,setDropDown]=useState(false);
    const dropDownItems=[1,2,3,4];

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

    const sendPoll=async()=>{
        try{
            if(pollsQuestion===''||pollsAnswer1===''||pollsAnswer2===''||pollsAnswer3===''||pollsAnswer4===''||answerIndex===-1){
               return Alert.alert('Please Enter All Inputs');
            }
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
     chatIdList.sort();
     const room = chatIdList.join('_');

     const reference = firebase
       .app()
       .database(
         'https://photoshare-e09d4-default-rtdb.asia-southeast1.firebasedatabase.app/',
       )
       .ref('/SocialMediaChats/')
       .child(room).child('chats');
       const dateTime=Date.now().toString();
       const realDate = formatTime(dateTime);
       const pollAnswers=[pollsAnswer1,pollsAnswer2,pollsAnswer3,pollsAnswer4];
       const message={
        pollQuestion:pollsQuestion,
        pollAnswers,
        answerIndex
       }
       await reference.child(dateTime).set({
        uid: id,
            message: message,
            profilePhoto: data.profilePhoto,
            name: data.name,
            isSeen: false,
            isForward: false,
            isReply: false,
            isMedia: false,
            mediaType:'polls',
            isShared: false,
            snap:false,
            id: dateTime,
            date: realDate.formatedDate,
            time: realDate.realTime,
       });
    }
    catch(error){
        console.log(error);
    }
    finally{
     setPolls();
    }
         
    }
   
  return (
    <View style={{paddingLeft:10,paddingTop:50,position:'absolute',zIndex:1,backgroundColor:'white',height:'100%',width:'100%'}}>
        <Text style={{fontSize:20,fontWeight:'bold',color:'green',alignSelf:'center',marginBottom:10}}>Polls</Text>
    <Text style={{fontSize:18,color:'black'}}>Question</Text>
    <TextInput value={pollsQuestion} onChangeText={setPollQuestion} style={{height:60,borderRadius:20,borderColor:'black',color:'black',borderWidth:2,width:'95%',paddingLeft:10}} placeholder='Question 1...' placeholderTextColor={'black'}></TextInput>
    <Text style={{marginTop:30,color:'black',fontSize:18}}>Answers</Text>
    <TextInput value={pollsAnswer1} onChangeText={setPollAnswer1} style={{marginTop:20,height:60,borderRadius:20,borderColor:'black',borderWidth:2,width:'95%',color:'black',paddingLeft:10}} placeholder='Answer 1...' placeholderTextColor={'black'}></TextInput>
    <TextInput value={pollsAnswer2} onChangeText={setPollAnswer2} style={{marginTop:20,height:60,borderRadius:20,borderColor:'black',borderWidth:2,width:'95%',color:'black',paddingLeft:10}} placeholder='Answer 2...' placeholderTextColor={'black'}></TextInput>
    <TextInput value={pollsAnswer3} onChangeText={setPollAnswer3} style={{marginTop:20,height:60,borderRadius:20,borderColor:'black',borderWidth:2,width:'95%',color:'black',paddingLeft:10}} placeholder='Answer 3...' placeholderTextColor={'black'}></TextInput>
    <TextInput value={pollsAnswer4} onChangeText={setPollAnswer4} style={{marginTop:20,height:60,borderRadius:20,borderColor:'black',borderWidth:2,width:'95%',color:'black',paddingLeft:10}} placeholder='Answer 4...' placeholderTextColor={'black'}></TextInput>
    <View style={{flexDirection:'row',width:'100%',alignSelf:'flex-start',justifyContent:'flex-start',alignItems:'center',marginTop:20}}>
    <Text style={{fontSize:20,color:'black',fontWeight:'bold'}}>Select Answer: </Text>    
    <View style={{width:140,alignItems:'center',justifyContent:'center',backgroundColor:'white',borderColor:'black',borderRadius:20,borderWidth:2,padding:10}}>
        <Text style={{fontSize:20,fontWeight:'bold',color:'black'}}>{answerIndex===-1?"Not Selected":answerIndex.toString()}</Text>
        </View> 
    <TouchableOpacity onPress={()=>setDropDown(!dropDown)}><Icon name={dropDown?'arrow-drop-up':'arrow-drop-down'} size={40} color={'black'}></Icon></TouchableOpacity>   
    {dropDown && <View style={{justifyContent:'space-between',height:140,width:140,backgroundColor:'white',position:'absolute',zIndex:1,borderRadius:20,elevation:10,top:50,left:'35%'}}>
       <TouchableOpacity onPress={()=>{setAnswerIndex(1)
        setDropDown(false);
       }}><Text style={{color:'black',fontSize:20,fontWeight:'bold',textAlign:'center'}}>{dropDownItems[0]}</Text></TouchableOpacity>
       <TouchableOpacity onPress={()=>{setAnswerIndex(2)
        setDropDown(false);
       }}><Text style={{color:'black',fontSize:20,fontWeight:'bold',textAlign:'center'}}>{dropDownItems[1]}</Text></TouchableOpacity>
       <TouchableOpacity onPress={()=>{setAnswerIndex(3)
        setDropDown(false);
       }}><Text style={{color:'black',fontSize:20,fontWeight:'bold',textAlign:'center'}}>{dropDownItems[2]}</Text></TouchableOpacity>
       <TouchableOpacity onPress={()=>{setAnswerIndex(4)
        setDropDown(false);
       }}><Text style={{color:'black',fontSize:20,fontWeight:'bold',textAlign:'center'}}>{dropDownItems[3]}</Text></TouchableOpacity>
        </View>}
    </View>
    <TouchableOpacity onPress={()=>sendPoll()}><View style={{height:50,width:50,backgroundColor:'white',elevation:10,borderRadius:30,marginLeft:'80%',marginTop:20,alignItems:'center',justifyContent:'center'}}>
    <Icon name='send' size={30} color={'black'}></Icon>    
    </View></TouchableOpacity>
    </View>
  )
}

export default PollsDialog
