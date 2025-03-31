import React, {useEffect, useState} from 'react';
import {View, Text, Pressable, FlatList, Image, Alert, StatusBar, TextBase} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import {circle, linear} from 'react-native/Libraries/Animated/Easing';
import {TouchableOpacity} from 'react-native-gesture-handler';
import DraggableCommentSection from '../components/DraggableCommentSection';

const Home = ({navigation,route}) => {
  const [date, setDate] = useState('');
  const [userData, setUserData] = useState(null);
  const [postId, setPostId] = useState('');
  const [posts, setPosts] = useState(null);
  const [open, setOpen] = useState(false);
  const currId = auth().currentUser.uid;

  // allows user to like the post
  const addLike = async (id, likeNumber, likes) => {
    const reference = firebase
      .app()
      .database(
        'https://photoshare-e09d4-default-rtdb.asia-southeast1.firebasedatabase.app/',
      );
    try {
      if (likes.includes(currId)) {
        const ind = likes.indexOf(currId);
        likes.splice(ind, 1);
        await reference
          .ref('/SocialMediaPosts/')
          .child(id)
          .update({
            likesCount: likeNumber - 1,
            likes: likes,
          });
        return;
      }
      const newLikes = [currId, ...likes];

      await reference
        .ref('/SocialMediaPosts/')
        .child(id)
        .update({
          likesCount: likeNumber + 1,
          likes: newLikes,
        });
    } catch (error) {
      console.log(error);
    }
  };

  // format date and time from time stamp into human readable form
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

  // fetches profile of current user 
  const fetchProfile = async () => {
    try {
      const id = auth().currentUser.uid;
      const reference = firebase
        .app()
        .database(
          'https://photoshare-e09d4-default-rtdb.asia-southeast1.firebasedatabase.app/',
        )
        .ref('/SocialMediaUsers/')
        .child(id)
        .child('profile');

      await reference.on('value', snapshot => {
        const userData = snapshot.val();
        setUserData(userData);
        
      });
    } catch (error) {
      console.log(error);
    }
  };

  // fetches posts made by all the users 
  const fetchPosts = async () => {
    try {
      const reference = firebase
        .app()
        .database(
          'https://photoshare-e09d4-default-rtdb.asia-southeast1.firebasedatabase.app/',
        )
        .ref('/SocialMediaPosts/');

        const reference2 = firebase
        .app()
        .database(
          'https://photoshare-e09d4-default-rtdb.asia-southeast1.firebasedatabase.app/',
        )
        .ref('/SocialMediaUsers/');

      const user = auth().currentUser.uid;
      let followers;
        await reference2.child(user).child('Follows').once('value').then(snapshot=>{
          const data=snapshot.val();
          followers=Object.keys(data);
        })

      let userData;
      let posts;
      await reference.on('value', snapshot => {
        userData = snapshot.val();
        const actualData = Object.values(userData);
        console.log({act:actualData[0]});
        if (userData) {
           if(route.params.postId!=='123'){
            posts=actualData.sort((a,b)=>{
                if(a.id===route.params.postId){
                    return -1;
                }
                if(b.id===route.params.postId){
                    return 1;
                }
                return 0;
            })
            const post = posts.filter((data)=>{
              return followers.includes(data.uid);
            })
            setPosts(post);
           }
           else{
            const postData = Object.values(userData);
            const post = postData.filter((data)=>{
              return followers.includes(data.uid);
            })
          setPosts(post);
            } // Convert object to array for FlatList
          // Log the fetched userData
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchPosts();
    return()=>{
        fetchPosts();
        fetchProfile();
    }
  }, []);

  return (
    <View style={styles.screen}>
        <StatusBar backgroundColor={'white'} barStyle={'dark-content'}/>
      <FlatList
        contentContainerStyle={{flexGrow: 1, paddingBottom: 150}}
        data={posts}
        keyExtractor={item => item.id} // Assuming each post has a unique 'id'
        renderItem={({item}) => (
          <View style={styles.post}>
            <TouchableOpacity 
                                  onPress={() => navigation.navigate('userProfile', {uid: item.uid})}><View style={styles.row}>
              <Image
                source={{uri: item.profilePhoto}}
                style={styles.profilePhoto}></Image>
              <View style={{flexDirection: 'column'}}>
                <Text style={styles.label}>{item.name}</Text>
                <Text style={styles.text}>{item.dateOfPost}</Text>
                <Text style={styles.text}>{item.timeOfPost}</Text>
              </View>
              <Icon
                name="earth"
                size={40}
                color={'grey'}
                style={styles.globeIcon}></Icon>
            </View>
            </TouchableOpacity>
            <Text style={styles.caption}>{item.caption}</Text>
            <Image
              source={{uri: item.ImagePost}}
              style={styles.imagePost}></Image>             
            <View style={styles.divider}></View>
            <View style={styles.row2}>
              <TouchableOpacity
                onPress={() => addLike(item.id, item.likesCount, item.likes)}>
                <View style={styles.column}>
                  <Icon
                    name={
                      item.likes.includes(currId)
                        ? 'thumb-up'
                        : 'thumb-up-outline'
                    }
                    size={25}
                    color={item.likes.includes(currId) ? 'red' : 'black'}></Icon>
                  <Text style={styles.count}>{item.likesCount}</Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity
              style={{marginLeft:'45%'}}
                onPress={() => navigation.navigate('comment', {post: item})}>
                <View style={styles.column}>
                  <Icon name="comment-outline" size={25} color={'black'}></Icon>
                  <Text style={styles.count}>{item.commentCount}</Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity
             
                onPress={() =>
                  navigation.navigate('Friends', {isShare: true, item: item,isForward:false})
                }>
                <View style={styles.column}>
                  <Icon name="send" size={25} color={'black'}></Icon>
                  <Text style={styles.highlightText('black')}>Send</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = {
  roundedButton: {
    position: 'absolute',
    bottom: 80,
    zIndex: 1,
    left: 10,
    borderRadius: 50,
    height: 80,
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00303d',
  },
  screen: {
    height: '100%',
    width: '100%',
    backgroundColor: 'grey',
  },
  floatingActionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
    width: 80,
    borderRadius: 60,
    bottom: 80,
    right: 10,
    position: 'absolute',
    elevation: 10,
    backgroundColor: 'green',
  },
  post: {
    width: '100%',
    elevation: 8,
    backgroundColor: 'white',
    borderRadius: 10,
    marginTop: 10,
  },
  profilePhoto: {
    height: 70,
    width: 70,
    borderRadius: 35,
    margin: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  label: {
    marginTop: 10,
    fontSize: 26,
    color: 'black',
    fontWeight: 'bold',
  },
  text: {
    fontSize: 16,
    color: 'black',
  },
  caption: {
    marginTop: 10,
    fontSize: 20,
    color: 'black',
    marginLeft: 90,
    marginRight: 10,
  },
  globeIcon: {alignSelf: 'center', marginLeft: 10},
  imagePost: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    marginTop: 10,
    resizeMode: 'stretch',
    marginBottom: 10,
  },
  row2: {
    marginLeft: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginRight: 10,
  },
  column: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  highlightText: color => {
    return {
      fontSize: 18,
      fontWeight: 'bold',
      color: color,
      textAlign:'center'
    };
  },
  count: {
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
    TextAlign:'center',
    color:'black',
    marginLeft:10,
    alignSelf:'flex-start'
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'green',
    elevation: 6,
    margin: 10,
  },
  divider: {
    height: 2,
    width: '95%',
    marginLeft: 10,
    marginRight: 10,
    marginTop: 7,
    backgroundColor: 'grey',
    marginBottom: 10,
  },
};

export default Home;
