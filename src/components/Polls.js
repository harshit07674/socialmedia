import React,{useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, Alert} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';


const Polls = ({item, chatList}) => {
  const id = auth().currentUser.uid;
  const [correctIndex,setCorrectIndex]=useState(-1);
  const [userIndex,setUserIndex]=useState(-1);

  useEffect(()=>{
correctIndex==item.message.answerIndex;
  },[])

  const updateAnswer = async index => {
    try {
      chatList.sort();
      const room = chatList.join('_');

      const reference = firebase
        .app()
        .database(
          'https://photoshare-e09d4-default-rtdb.asia-southeast1.firebasedatabase.app/',
        )
        .ref('/SocialMediaChats/')
        .child(room).child('chats');
      if (item.answerGiven === undefined) {
        await reference.child(item.id).update({
          answerGiven: [id],
        });
      } else {
        if (item.answerGiven.includes(id)) {
          return Alert.alert('You have already given answer');
        }
        await reference.child(item.id).update({
          answerGiven: [id, ...item.answerGiven],
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={{width: '100%'}}>
      <View
        style={{
          backgroundColor: 'white',
          borderColor: 'black',
          borderWidth: 2,
          borderRadius: 20,
          padding: 10,
        }}>
        <Text style={{color: 'black', FontSize: 20, fontWeight: 'bold'}}>
          {item.message.pollQuestion}
        </Text>
      </View>
      <Text
        style={{
          marginTop: 10,
          color: 'black',
          fontSize: 18,
          fontWeight: 'bold',
        }}>
        Answers
      </Text>
      <TouchableOpacity onPress={() => {updateAnswer(1)
        setUserIndex(1);
      }}>
        <View
          style={{
            marginBottom: 10,
            backgroundColor:
              item.answerGiven !== undefined &&
              item.answerGiven.includes(id) &&
              item.message.answerIndex === 1
                ? 'green':item.answerGiven !== undefined &&
                item.answerGiven.includes(id)
              ? 'red'
              
                : 'white',
            borderColor: 'black',
            borderWidth: 2,
            borderRadius: 20,
            padding: 10,
          }}>
          <Text style={{color: 'black', FontSize: 20, fontWeight: 'bold'}}>
            {item.message.pollAnswers[0]}
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => {updateAnswer(2)
        setUserIndex(2);
      }}>
        <View
          style={{
            marginBottom: 10,
            backgroundColor:
              item.answerGiven !== undefined &&
              item.answerGiven.includes(id) &&
              item.message.answerIndex === 2
                ? 'green'
                : item.answerGiven !== undefined &&
                  item.answerGiven.includes(id)
                ? 'red'
                : 'white',
            borderColor: 'black',
            borderWidth: 2,
            borderRadius: 20,
            padding: 10,
          }}>
          <Text style={{color: 'black', FontSize: 20, fontWeight: 'bold'}}>
            {item.message.pollAnswers[1]}
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => {updateAnswer(3)
        setUserIndex(3);
      }}>
        <View
          style={{
            marginBottom: 10,
            backgroundColor:
              item.answerGiven !== undefined &&
              item.answerGiven.includes(id) &&
              item.message.answerIndex === 3
                ? 'green':item.answerGiven !== undefined &&
                item.answerGiven.includes(id)
              ? 'red'
              
                : 'white',
            borderColor: 'black',
            borderWidth: 2,
            borderRadius: 20,
            padding: 10,
          }}>
          <Text style={{color: 'black', FontSize: 20, fontWeight: 'bold'}}>
            {item.message.pollAnswers[2]}
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => {updateAnswer(4)
        setUserIndex(4);
      }}>
        <View
          style={{
            marginBottom: 10,
            backgroundColor:
              item.answerGiven !== undefined &&
              item.answerGiven.includes(id) &&
              item.message.answerIndex === 4
                ? 'green':item.answerGiven !== undefined &&
                item.answerGiven.includes(id)
              ? 'red'
              
                : 'white',
            borderColor: 'black',
            borderWidth: 2,
            borderRadius: 20,
            padding: 10,
          }}>
          <Text style={{color: 'black', FontSize: 20, fontWeight: 'bold'}}>
            {item.message.pollAnswers[3]}
          </Text>
        </View>
      </TouchableOpacity>
      {item.answerGiven!==undefined && item.answerGiven.includes(id) && <Text style={{color:userIndex===correctIndex?'black':'red',fontWeight:'bold',fontSize:20}}>{userIndex===correctIndex?'Correct Answer':'Wrong Answer'}</Text>}
    </View>
  );
};

export default Polls;
