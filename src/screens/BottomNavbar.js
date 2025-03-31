import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Alert,
  Animated,
  Text,
  SnapshotViewIOS,
} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from './Home';
import UsersScreen from './UsersScreen';
import Requests from './Requests';
import UploadPost from './UploadPost';
import {circle} from 'react-native/Libraries/Animated/Easing';
import Video from 'react-native-video';


const Tab = createBottomTabNavigator();

const BottomNavbar = ({navigation}) => {
  const [notifications,setNotifications]=useState(0);
  const [currentTab, setCurrentTab] = useState('Home');
  const id = auth().currentUser.uid;

  // fetches no of notifications for user
  const fetchNotificationCount=async()=>{
    try{
    const reference = firebase
        .app()
        .database(
          'https://photoshare-e09d4-default-rtdb.asia-southeast1.firebasedatabase.app/',
        )
        .ref('/SocialMediaUsers/')
        .child(id)
        .child('Follows');

        await reference.orderByChild('isSeen').equalTo(false).on('value',snapshot=>{
          if(snapshot.val()===null || snapshot.val()===undefined){
            setNotifications(0);
          }
          else{
            setNotifications(Object.values(snapshot.val()).length);
          }
  })
}
catch(error){
  console.log(error);
}
  }

  useEffect(()=>{
  fetchNotificationCount();
  return()=>{
    fetchNotificationCount();
  }
  },[])

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          position: 'absolute',
          bottom: 7,
          left: 20,
          right: 20,
          elevation: 10,
          backgroundColor: 'rgba(0, 0, 0, 0.8)', // Background color
          borderRadius: 30,
          height: 60,
        },
        tabBarActiveTintColor: 'green',
        tabBarInactiveTintColor: 'white',
        headerRight: () =>  (
             <TouchableOpacity
              onPress={() => navigation.navigate('Friends', {isShare: false})}>
              <View style={styles.circle}>
                <Icon name="chat" size={30} color={'black'}></Icon>
              </View>
             </TouchableOpacity>
           ),
        
        headerLeft:()=>(
          <View style={styles.headerLeft}>
          <TouchableOpacity 
            onPress={() => navigation.navigate('userProfile', {uid: id})}>
            <View style={styles.circle}>
              <Icon name="person" size={30} color={'black'}></Icon>
            </View>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => navigation.navigate('notification')}>
            <View style={styles.circle}>
              {notifications>0 && <View style={styles.smallCircle}>
               <Text style={styles.label}>{notifications}</Text> 
              </View>}
              <Icon name="notifications" size={30} color={'black'}></Icon>
            </View>
          </TouchableOpacity>
          </View>
        ),
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        initialParams={{postId:'123'}}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="home" size={size} color={color} />
          ),
          title:'',
        }}
      />
       <Tab.Screen
        name="Upload"
        component={UploadPost}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="add-a-photo" size={size} color={color} />
          ),
          title: '',
        }}></Tab.Screen>
      <Tab.Screen
        name="Chat"
        component={UsersScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="search" size={size} color={color} />
          ),
          title: '',
        }}></Tab.Screen>
      <Tab.Screen
        name="Request"
        component={Requests}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="favorite" size={size} color={color} />
          ),
          title: '',
        }}></Tab.Screen>
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  circle: {
    height: 40,
    width: 40,
    borderRadius: 35,
    backgroundColor: 'white',
    elevation: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginLeft:10,
    marginBottom:7,
    borderColor: 'black',
    borderWidth: 2,
  },
  headerLeft:{
    marginLeft:10,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'flex-start'
  },
  smallCircle:{
    height:25,
    width:25,
    borderRadius:20,
    backgroundColor:'red',
    position:'absolute',
    top:-5,
    alignItems:'center',
    justifyContent:'center',
    left:27,
    zIndex:1
  },
  label:{
    color:'white',
    fontSize:13,
  }
});

export default BottomNavbar;
