import React, {useState, useEffect} from 'react';
import {View, Image, Text, TouchableOpacity, PanResponder} from 'react-native';
import {FlatList, TextInput} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';

const Comment = ({navigation, route}) => {
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState(null);
  const [commentSectionHeight, setCommentSectionHeight] = useState(300); // Initial height
  const currId = auth().currentUser.uid;
  const [isReply,setReply]=useState(false);
  const [currIndex,setIndex]=useState(-1);
  const [replyText,setReplyText]=useState(null);
  const [seeReply,setSeeReply]=useState(false);
  const [replies,setCommentReplies]=useState(null);

  const fetchReplies=async(commentId)=>{
    try{
    const reference = firebase
    .app()
    .database(
      'https://photoshare-e09d4-default-rtdb.asia-southeast1.firebasedatabase.app/',
    )
    .ref('/SocialMediaPosts/')
    .child(route.params.post.id)
    .child('comments').child(commentId).child('replies');

    await reference.once('value').then(snapshot=>{
      if(snapshot.exists){
        const data = snapshot.val();
        console.log(data);
        setCommentReplies(Object.values(data));
      }
    })
  }
  catch(error){
    console.log(error);
  }
  }

  useEffect(() => {
    fetchComments();
    return()=>{
      fetchComments();
    }
  }, []);

  // fetches all comments on particular post
  const fetchComments = async () => {
    const reference = firebase
      .app()
      .database(
        'https://photoshare-e09d4-default-rtdb.asia-southeast1.firebasedatabase.app/',
      )
      .ref('/SocialMediaPosts/')
      .child(route.params.post.id)
      .child('comments');

    reference.on('value', snapshot => {
      const data = snapshot.val();
      if (data) {
        setComments(Object.values(data));
      }
    });
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

  // adds new comment on post
  const addComment = async () => {
    try {
    
      if (commentText.trim()) {
        const userReference = firebase
        .app()
        .database(
          'https://photoshare-e09d4-default-rtdb.asia-southeast1.firebasedatabase.app/',
        )
        .ref('/SocialMediaUsers/')
        .child(currId)
        const reference = firebase
          .app()
          .database(
            'https://photoshare-e09d4-default-rtdb.asia-southeast1.firebasedatabase.app/',
          )
          .ref('/SocialMediaPosts/').child(route.params.post.id)
          .child('comments');
          let user;
          await userReference.child('profile').once('value').then(snapshot=>{
           user=snapshot.val();
          })
        const dateTime = Date.now().toString();
        const realDate = formatTime(dateTime);
        if(isReply){
        await reference.child(replyText.id).child('replies').child(dateTime+currId).set({
            id:dateTime+currId,
            replyText:commentText,
            replyName:user.name,
            replyUid:currId,
            profilePhoto:user.profilePhoto,
            date:realDate.formatedDate,
            time:realDate.realTime, 
        });
        let reply;
        await reference.child(replyText.id).once('value').then(snapshot=>{
          reply = snapshot.val();
        })
        if(reply.replyCount===undefined){
          await reference.child(replyText.id).update({
            replyCount:1,
          })
        }
        else{
          const replies=reply.replyCount+1;
          await reference.child(replyText.id).update({
            replyCount:replies,
          })
        }
        
        }
        else{
        const newComment = {
          comment: commentText,
          id: currId + dateTime,
          commentName:user.name,
          profilePhoto:user.profilePhoto,
          date: realDate.formatedDate,
          time: realDate.realTime,
        };

        await reference.child(currId + dateTime).set(newComment);
      }
        setCommentText('');
        setReply(false);
        setReplyText(null);
        setIndex(-1);
      }

      const reference3 = firebase
        .app()
        .database(
          'https://photoshare-e09d4-default-rtdb.asia-southeast1.firebasedatabase.app/',
        )
        .ref('/SocialMediaPosts/')
        .child(route.params.post.id);
      const postComments = route.params.post.commentCount + 1;
      await reference3.update({
        commentCount: postComments,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      return gestureState.dy > 10; // Start dragging if moved down
    },
    onPanResponderMove: (evt, gestureState) => {
      const newHeight = commentSectionHeight + gestureState.dy; // Adjust height based on drag
      setCommentSectionHeight(newHeight > 300 ? newHeight : 300); // Minimum height
    },
    onPanResponderRelease: (evt, gestureState) => {
      setCommentSectionHeight(300); // Reset to initial height
    },
  });

  return (
    <View style={styles.screen}>
      <Image
        source={{uri: route.params.post.ImagePost}}
        style={styles.image}></Image>
      <View style={styles.commentSection}>
        <View style={styles.handle}></View>
        <FlatList
          style={{flex:1}}
          data={comments}
          keyExtractor={item => item.id}
          contentContainerStyle={{flexGrow: 1}}
          renderItem={({item,index}) => (
            <View style={styles.commentTile(40)}>
              <View style={styles.commentRow(0, 'flex-start')}>
                <Image
                  style={styles.circle}
                  source={{uri: item.profilePhoto}}></Image>
                <Text style={styles.text}>@</Text>
                <Text style={styles.text}>{item.commentName + '.'}</Text>
              </View>
              <View style={styles.commentRow(50, 'space-between')}>
                <Text style={styles.text}>{item.date + '.'}</Text>
                <Text style={styles.text}>{item.time}</Text>
              </View>
              <Text style={styles.commentText}>{item.comment}</Text>
              <View style={{flexDirection:'row',alignItems:'flex-start',justifyContent:'flex-start'}}><TouchableOpacity onPress={()=>{setReply(true)
                 setReplyText(item);
              }}><Text style={{marginLeft:50,color:'black',fontSize:16,fontWeight:'bold'}}>Reply</Text></TouchableOpacity>
              {item.replyCount!==undefined && <TouchableOpacity onPress={()=>{
                if(seeReply){
                  setIndex(-1);
                }
                else{
                  setIndex(index);
                }
                if(seeReply){
                  setCommentReplies(null);
                }
                else{
                  fetchReplies(item.id);
                }
                setSeeReply(!seeReply);
                
                
              }}>
              <Text style={{marginLeft:50,color:seeReply && index===currIndex?'blue':'black',fontSize:16,fontWeight:'bold'}}>{item.replyCount===1?'See 1 Reply':'See '+item.replyCount.toString()+' Replies'}</Text>  
              </TouchableOpacity>}
              </View>
              {seeReply && index===currIndex && <View>
              <FlatList contentContainerStyle={{flexGrow: 1}} data={replies} keyExtractor={(item)=>item.id} renderItem={({item})=>{
                return (
                  <View style={{width:'80%',marginLeft:60,marginRight:20}}>
                    <View style={styles.commentTile(20)}>
              <View style={styles.commentRow(0, 'flex-start')}>
              <Image
                  style={styles.circle}
                  source={{uri: item.profilePhoto}}></Image>
                <Text style={styles.text}>@</Text>
                <Text style={styles.text}>{item.replyName + '.'}</Text>
              </View>
              <View style={styles.commentRow(50, 'space-between')}>
                <Text style={styles.text}>{item.date + '.'}</Text>
                <Text style={styles.text}>{item.time}</Text>
              </View>
              <Text style={styles.commentText}>{item.replyText}</Text>
              </View>
                  </View>
                )
              }}></FlatList>
              </View>}
            </View>
          )}>
        </FlatList>
        {isReply===true && <View style={{width:'75%',alignSelf:'center',backgroundColor:'rgba(190,190,190,1)',elevation:10,justifyItems:'flex-start',borderRadius:15}}>
          <TouchableOpacity onPress={()=>{
            setReply(false);
            setReplyText(null);
          }}><Icon style={{marginRight:10,alignSelf:'flex-end'}} name='close' size={30} color={'black'}></Icon></TouchableOpacity>
          <View style={{marginLeft:10,flexDirection:'row',alignItems:'flex-start',justifyContent:'flex-start'}}><Image source={{uri:replyText.profilePhoto}} style={{height:30,width:30,borderRadius:20,resizeMode:'stretch'}}></Image>
          <Text style={{color:'black',fontSize:18,marginLeft:10}}>{replyText.commentName}</Text>
          </View>
          <Text style={{color:'black',fontSize:18,marginLeft:50}}>{replyText.comment}</Text>
        </View>} 
        <View style={styles.commentField}>
          <View style={styles.circle}></View>
          <TextInput
            placeholder="Write Your Comment..."
            placeholderTextColor={'grey'}
            style={styles.chatTextField}
            value={commentText}
            onChangeText={setCommentText}></TextInput>
          <TouchableOpacity onPress={() => addComment()}>
            <Icon
              style={styles.sendIcon}
              name={'send'}
              color={'black'}
              size={40}></Icon>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = {
  text: {
    fontSize: 13,
    color: 'black',
  },
  commentText: {
    fontSize: 20,
    margin: 10,
    marginLeft: 50,
    color: 'black',
  },
  screen: {
    height: '100%',
    width: '100%',
  },
  image: {
    height: 200,
    width: '50%',
    alignSelf: 'center',
  },
  commentSection:{
    flex:1,
    height:'70%',
    backgroundColor: 'white',
    elevation: 7,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    bottom:0,
    position:'absolute'
    
  },
  handle: {
    height: 3,
    width: 50,
    borderRadius: 20,
    position: 'absolute',
    backgroundColor: 'grey',
    top: 20,
    alignSelf: 'center',
  },
  commentTile:(size)=> {
    return{
    width: '100%',
    marginLeft: 10,
    marginRight: 10,
    marginTop: size,
    }
  },
  commentField: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifycontent: 'flex-start',
    marginBottom: 20,
  },
  chatTextField: {
    width: '78%',
    height: 50,
    borderRadius: 10,
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 2,
    elevation: 7,
    fontSize: 15,
  },
  sendIcon: {
    alignSelf: 'center',
    marginRight: 10,
  },
  circle: {
    width: 30,
    height: 30,
    alignSelf: 'center',
    borderRadius: 30,
    backgroundColor: 'black',
    marginRight: 10,
    marginLeft: 10,
  },
  commentRow: (margin, align) => {
    return {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifycontent: align,
      marginLeft: margin,
    };
  },
};

export default Comment;
