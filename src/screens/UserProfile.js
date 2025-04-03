import React, {use, useEffect, useState} from 'react';
import {
  View,
  Image,
  Text,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Video from 'react-native-video';

const UserProfile = ({navigation, route}) => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState(null);
  const [uiLoading, setLoading] = useState(false);
  const [mode,setMode]=useState('images');
  const [currIndex,setIndex]=useState(-1);
  const [paused,setPaused]=useState(true);
  const [followCount,setFollowCount]=useState(0);
  const [followers,setFollowers]=useState(null);

  // logout user and sends user to login screen
  const handleLogout = async () => {
    try {
      await AsyncStorage.setItem('isLoggedIn', 'false');
      await auth().signOut();
      navigation.replace('Login');
    } catch (error) {
      console.log(error);
    }
  };

  // fetches all the posts of current user
  const fetchPosts = async () => {
    try {
      const reference = firebase
        .app()
        .database(
          'https://photoshare-e09d4-default-rtdb.asia-southeast1.firebasedatabase.app/',
        )
        .ref('/SocialMediaPosts/');
        let postData;
        if(mode==='images'){
          await reference
        .orderByChild('uid')
        .equalTo(route.params.uid)
        .on('value', snapshot => {
          const userData = snapshot.val();
          if (userData) {
            postData=Object.values(userData); 
            console.log(postData);
            const posts=postData.filter((post)=>{
              return post.mediaType==='image';
             });
             setPosts(posts);
          }
        });         
         }
         else{
          await reference
          .orderByChild('uid')
          .equalTo(route.params.uid)
          .on('value', snapshot => {
            const userData = snapshot.val();
            if (userData) {
              postData=Object.values(userData); 
              console.log(postData);
              const posts=postData.filter((post)=>{
                return post.mediaType==='video';
               });
               setPosts(posts);
            }
         })
        
        
        setPosts(posts);
        console.log({posts});
        }
    } catch (error) {
      console.log(error);
    }
  };

  // fetches profile details of current user 
  const fetchProfile = async () => {
    setLoading(true);
    try {
      const reference = firebase
        .app()
        .database(
          'https://photoshare-e09d4-default-rtdb.asia-southeast1.firebasedatabase.app/',
        )
        .ref('/SocialMediaUsers/')
        .child(route.params.uid)
        .child('profile');

      await reference.on('value', snapshot => {
        const userData = snapshot.val();
        console.log(userData);
        setUser(userData);
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFollowers=async()=>{
    try{
      const reference = firebase
      .app()
      .database(
        'https://photoshare-e09d4-default-rtdb.asia-southeast1.firebasedatabase.app/',
      )
      .ref('/SocialMediaUsers/')
      .child(route.params.uid);

      await reference.child('Follows').on('value',snapshot=>{
       const followers=snapshot.val();
       if(followers){
        const actualData = Object.values(followers);
        setFollowers(actualData);
        setFollowCount(actualData.length); 
       }
      });
    }
    catch(error){
      console.log(error);
    }
  }

  useEffect(() => {
    fetchProfile();
    fetchPosts();
    fetchFollowers();
    return () => {
      fetchProfile();
      fetchPosts();
      fetchFollowers();
    };
  }, [mode]);

  if (uiLoading) {
    return (
      <View style={styles.loadingState}>
        <ActivityIndicator color={'blue'}></ActivityIndicator>
      </View>
    );
  }
  return (
    <View style={styles.screen}>
      {user && (
        <Image source={{uri: user.profilePhoto}} style={styles.circle}></Image>
      )}
      <Text style={styles.label}>{user && user.name}</Text>
      <View style={styles.bioContainer}>
        <Text style={styles.bio}>{user && user.bio}</Text>
      </View>
      <TouchableOpacity onPress={()=>navigation.navigate('followers',{followers})}><View style={styles.row}>
        <Text style={styles.label}>Total Followers: </Text>
        <Text style={styles.label}>{ followCount}</Text>
      </View></TouchableOpacity>
      <View style={styles.row}>
        <Text style={styles.label}>Total Posts: </Text>
        <Text style={styles.label}>{user && user.totalPosts}</Text>
      </View>
      <View style={styles.postsContainer}>
        <FlatList
          contentContainerStyle={{flexGrow: 1}}
          columnWrapperStyle={{width: '100%', paddingLeft: 10}}
          numColumns={2}
          data={posts}
          renderItem={({item,index}) => {
           
            return <Image
              source={{uri: item.ImagePost}}
              style={{
                height: 200,
                width: posts.length == 1 ? '97%' : '47%',
                marginRight: 10,
                marginTop:10,
                resizeMode:'stretch'
              }}></Image>
            }}
          keyExtractor={item => item.id}></FlatList>
        <TouchableOpacity
          style={styles.centerButton}
          onPress={() => handleLogout()}>
          <Text style={styles.buttonLabel}>Logout </Text>
          <Icon name={'logout'} size={20} color={'white'}></Icon>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.centerButton}
          onPress={() => navigation.navigate('edit',{profile:user})}>
          <Text style={styles.buttonLabel}>Edit Profile </Text>
          <Icon name={'person'} size={20} color={'white'}></Icon>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = {
  loadingState: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  screen: {
    height: '100%',
    width: '100%',
  },
  postsContainer: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginLeft: 10,
  },
  label: {
    marginTop: 10,
    fontSize: 24,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  bio: {
    fontSize: 18,
    color: 'black',
    textAlign: 'left',
    marginLeft: 10,
  },
  circle: {
    width: 130,
    height: 130,
    alignSelf: 'center',
    borderRadius: 70,
    marginTop: 10,
  },
  bioContainer: {
    height: 70,
    width: '95%',
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    justifyContent: 'center',
    borderRadius: 15,
    elevation: 8,
    backgroundColor: 'white',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  centerButton: {
    alignSelf: 'center',
    marginBottom: 20,
    borderRadius: 30,
    marginTop:10,
    height: 50,
    width: 130,
    backgroundColor: 'red',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLabel: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
};

export default UserProfile;
