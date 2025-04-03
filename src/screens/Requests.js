import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  View,
  Text,
  FlatList,
  Button,
  Alert,
  Image,
  TouchableOpacity,
} from 'react-native';
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Requests = ({navigation}) => {
  const [users, setUsers] = useState(null);
  const [uiLoading, setLoading] = useState(false);
  const id = firebase.auth().currentUser.uid;
  let userData = null;

  // fetches all the follow requests received by current user
  const fetchRequests = async () => {
    try {
      setLoading(true);
      const reference = firebase
        .app()
        .database(
          'https://photoshare-e09d4-default-rtdb.asia-southeast1.firebasedatabase.app/',
        )
        .ref('/SocialMediaUsers/')
        .child(id)
        .child('requests');

      await reference.on('value', snapshot => {
        let userData = snapshot.val();
        if (userData === null) {
          setUsers(null);
        }
        if (userData) {
          setUsers(Object.values(userData));
          console.log(users);
        }
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // handles the accept response of user on request
  const acceptRequest = async (senderData) => {
    try {
        console.log(senderData);
      const reference = firebase
        .app()
        .database(
          'https://photoshare-e09d4-default-rtdb.asia-southeast1.firebasedatabase.app/'
        )
        .ref('/SocialMediaUsers/');

      await reference
        .child(id)
        .child('profile')
        .once('value')
        .then(snapshot => {
          userData = snapshot.val();
        });

      let senderProfile;
      await reference
        .child(senderData.uid)
        .child('profile')
        .once('value')
        .then(snapshot => {
          senderProfile = snapshot.val();
        });

      await reference.child(senderData.uid).child('Follows').child(id).set({
        uid: id,
        profilePhoto: userData.profilePhoto,
        isSeen:false,
        name: userData.name,
      });

      await reference.child(id).child('Follows').child(senderData.uid).set({
        uid: senderData.uid,
        profilePhoto: senderData.profilePhoto,
        isSeen:false,
        name: senderData.name,
      });

      Alert.alert('You Both Are Friends Now');

      await reference
        .child(id)
        .child('requests')
        .child(senderData.uid)
        .remove();

      await reference
        .child(senderData.uid)
        .child('request_sended')
        .child(id)
        .remove();

      const reqProcessData = senderProfile.requestProcessing;

      const ind = reqProcessData.indexOf(id);
      reqProcessData.splice(ind, 1);

      await reference.child(senderData.uid).child('profile').update({
        requestProcessing: reqProcessData,
      });
    } catch (error) {
      console.log(error);
    }
  };

  // handles rejection response of user on request
  const denyRequest = async(sender) => {
    console.log(sender);
    try {
      const reference = firebase
        .app()
        .database(
          'https://photoshare-e09d4-default-rtdb.asia-southeast1.firebasedatabase.app/',
        )
        .ref('/SocialMediaUsers/');

      await reference.child(id).child('requests').child(sender.uid).remove();
      await reference
        .child(sender.uid)
        .child('request_sended')
        .child(id)
        .remove();

      let senderProfile;
      await reference
        .child(sender.uid)
        .child('profile')
        .once('value')
        .then(snapshot => {
          senderProfile = snapshot.val();
        });

      const reqProcessData = senderProfile.requestProcessing;

      const ind = reqProcessData.indexOf(id);
      reqProcessData.splice(ind, 1);

      await reference.child(sender.uid).child('profile').update({
        requestProcessing: reqProcessData,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchRequests();
    return () => {
      fetchRequests();
    };
  }, []);

  if (uiLoading) {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator color={'black'}></ActivityIndicator>
      </View>
    );
  }
  return (
    <View style={{flex: 1, paddingTop: 20}}>
      <FlatList
        contentContainerStyle={{flexGrow: 1}}
        data={users}
        keyExtractor={item => item.uid} // Assuming each post has a unique 'id'
        renderItem={({item, index}) => (
          <View style={styles.container}>
            <TouchableOpacity onPress={()=>navigation.navigate('userProfile',{uid:item.uid})}><View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
              }}>
              <View style={styles.circle}>
                <Image
                  source={{uri: item.profilePhoto}}
                  style={styles.imageContainer}></Image>
              </View>
              <Text style={styles.label}>{'@' + item.name}</Text>
            </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => acceptRequest(item)}
              style={styles.roundedButton('green')}>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  height: '100%',
                }}>
                <Icon name="check" color={'black'} size={30}></Icon>
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: 16,
                    color: 'black',
                    marginTop: 10,
                  }}>
                  Accept
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => denyRequest(item)}
              style={styles.roundedButton('red')}>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  height: '100%',
                }}>
                <Icon name="close" color={'black'} size={30}></Icon>
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: 16,
                    color: 'black',
                    marginTop: 10,
                  }}>
                  Reject
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = {
  profile: {
    marginTop: 10,
    width: 80,
    height: 80,
    borderRadius: 50,
  },
  container: {
    width: '97%',
    marginLeft: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: 10,
    height: 100,
    backgroundColor: 'white',
    borderColor: 'grey',
    borderWidth: 2,
    borderRadius: 15,
    marginBottom: 6,
  },
  imageContainer: {
    resizeMode: 'stretch',
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  label: {
    fontSize: 13,
    fontWeight: 'bold',
    width:'40%',
    marginLeft: 10,
    color: 'black',
  },
  roundedButton: color => {
    return {
      marginRight: 10,
      alignItems: 'center',
      justifyContent: 'center',
      width: 55,
      height: 40,
      borderRadius: 20,
      backgroundColor: color,
      elevation: 10,
      
    };
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: '95%',
    marginLeft: 10,
    marginTop: 20,
    marginBottom: 20,
  },
  searchField: {
    width: '95%',
    marginLeft: 10,
    height: 50,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginTop: 10,
    marginBottom: 10,
    elevation: 10,
    backgroundColor: 'white',
  },
  searchInput: {
    color: 'black',
    fontSize: 18,
    height: 50,
    marginLeft: 7,
    marginRight: 10,
    width: '83%',
  },
  circle: {
    height: 50,
    width: 50,
    borderRadius: 50,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  searchIcon: {
    height: 50,
    width: 50,
    borderRadius: 50,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

export default Requests;
