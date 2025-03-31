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
import {TextInput} from 'react-native-gesture-handler';
import {circle} from 'react-native/Libraries/Animated/Easing';

const UsersScreen = ({navigation}) => {
  const [users, setUsers] = useState(null);
  const [uiLoading, setLoading] = useState(false);
  const [sendedRequests, setSendedRequests] = useState(null);
  const [followers, setFollowers] = useState(null);

  const [searchText, setSearch] = useState('');
  const id = firebase.auth().currentUser.uid;
  let userData = null;

  // Fetches data of all users from Firebase Realtime Database
  const fetchUsersFromFirebase = async () => {
    try {
      const reference = firebase
        .app()
        .database(
          'https://photoshare-e09d4-default-rtdb.asia-southeast1.firebasedatabase.app/',
        )
        .ref('/SocialMediaUsers/');

      const snapshot = await reference.on('value', snapshot => {
        const userData = snapshot.val();
        if (userData) {
          const data = Object.values(userData);
          const filterData = data.filter((element)=>{
          return element.user!==id;
          });
          console.log(filterData);
          setUsers(filterData);
        }
      });
      const snapshot2 = await reference
        .child(id)
        .child('profile')
        .on('value', snapshot => {
          const requestData = snapshot.val();
          if (requestData) {
            console.log(requestData.requestProcessing);
            const data = Object.values(requestData);
            if(snapshot.val().requestProcessing===undefined){
                setSendedRequests(["123"]);
            }
            else{
            setSendedRequests(snapshot.val().requestProcessing);
            }
          }
        });

      await reference
        .child(id)
        .child('Follows')
        .on('value', snapshot => {
          const followData = snapshot.val();
          if(followData!==null){
          const keys = Object.keys(followData);
          setFollowers(keys);
          }
          else{
            setFollowers(["123"]);
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  // Sends follow request to intended user
  const sendRequest = async (receiverId, item) => {
    try {
      if (sendedRequests.includes(receiverId)) {
        return Alert.alert(
          'You Have Already Sent Request To This User Please Wait For Response',
        );
      }
      console.log({item: item});
      const reference = firebase
        .app()
        .database(
          'https://photoshare-e09d4-default-rtdb.asia-southeast1.firebasedatabase.app/',
        )
        .ref('/SocialMediaUsers/');

      await reference
        .child(id)
        .child('profile')
        .once('value')
        .then(snapshot => {
          userData = snapshot.val();
        });

      await reference.child(receiverId).child('requests').child(id).set({
        name: userData.name,
        profilePhoto: userData.profilePhoto,
        uid: id,
      });
      await reference.child(id).child('request_sended').child(receiverId).set({
        uid: receiverId,
      });

      if (
        userData.requestProcessing === null ||
        userData.requestProcessing === undefined
      ) {
        await reference
          .child(id)
          .child('profile')
          .update({
            requestProcessing: [receiverId],
          });
      } else {
        const requests = userData.requestProcessing;
        await reference
          .child(id)
          .child('profile')
          .update({
            requestProcessing: [receiverId, ...userData.requestProcessing],
          });
      }
    } catch (error) {
      console.log(error);
    }
  };

  // searches user by username and return all users if no user is searched
  const searchUser = async () => {
    try {
      const reference = firebase
        .app()
        .database(
          'https://photoshare-e09d4-default-rtdb.asia-southeast1.firebasedatabase.app/',
        )
        .ref('/SocialMediaUsers/');
      if (searchText !== '') {
        await reference
          .orderByChild('name')
          .equalTo(searchText.trim())
          .on('value', snapshot => {
            const data = snapshot.val();
            if (data) {
              const formatedData = Object.values(data);
              console.log(data);
              setUsers(formatedData);
            }
          });
      } else {
        fetchUsersFromFirebase();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    searchUser();
    return () => {
      searchUser();
    };
  }, [searchText]);

  if (uiLoading) {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator color={'black'}></ActivityIndicator>
      </View>
    );
  }
  return (
    <View style={{width: '100%', height: '100%'}}>
      <View style={styles.searchField}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search For User..."
          value={searchText}
          onChangeText={setSearch}></TextInput>
        <View style={styles.searchIcon}>
          <Icon name="search" color={'white'} size={30}></Icon>
        </View>
      </View>
      <FlatList
        style={{flex: 1}}
        contentContainerStyle={{flexGrow: 1, paddingBottom: 80}}
        data={users}
        keyExtractor={item => item.user} // Assuming each post has a unique 'id'
        renderItem={({item}) => (
          <TouchableOpacity 
                      onPress={() => navigation.navigate('userProfile', {uid: item.user})}><View style={styles.container}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
              }}>
              <View style={styles.circle}>
                <Image
                  source={{uri: item.profile.profilePhoto}}
                  style={styles.imageContainer}></Image>
              </View>
              <Text style={styles.label}>{'@' + item.name}</Text>
            </View>
            <TouchableOpacity
              onPress={() => sendRequest(item.profile.uid, item.profile)}
              style={styles.roundedButton}>
              {followers.includes(item.user) ||
              sendedRequests.includes(item.user) ? (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Icon name="check" color={'black'} size={30}></Icon>
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: 'bold',
                      color: 'black',
                      marginLeft: 5,
                    }}>
                    {followers.includes(item.user) ? 'Added' : 'Sent'}
                  </Text>
                </View>
              ) : (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Icon name="add" color={'black'} size={30}></Icon>
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: 'bold',
                      color: 'black',
                      marginLeft: 5,
                    }}>
                    {'Add'}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
          </TouchableOpacity>
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
    justifyContent: 'space-between',
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
    width: 80,
    height: 80,
    borderRadius: 50,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
    color: 'black',
  },
  roundedButton: {
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'yellow',
    elevation: 10,
    marginLeft: 10,
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
    height: 80,
    width: 80,
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

export default UsersScreen;
