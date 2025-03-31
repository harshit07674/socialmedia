import React, {useEffect} from 'react';
import {View, Image} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Splash = ({navigation}) => {
  
  //checks whether user is logged in or not and directs user to relevant screen
  const fetchLogin = async () => {
    try {
      const data = await AsyncStorage.getItem('isLoggedIn');
      if (data === 'true') {
        navigation.replace('BottomNav');
      } else {
        navigation.replace('Login');
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLogin();
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <View style={styles.screen}>
      <Image
        source={require('../assets/logo/social_bg.png')}
        style={styles.splashImage}></Image>
    </View>
  );
};

const styles = {
  screen: {
    height: '100%',
    width: '100%',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashImage: {
    height: '40%',
    width: '70%',
  },
};

export default Splash;
