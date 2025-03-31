import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
  TextBase,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth'; // Importing the eye icon
import AppButton from '../components/AppButton';
import InputField from '../components/InputField';
import PasswordField from '../components/PasswordField';
import TextButton from '../components/TextButton';
import analytics from '@react-native-firebase/analytics';
import handleGoogleSignIn from '../backend/HandleGoogleSignin';

const Login = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for password visibility

  // log event to firebase analytics
  const logEvent = async () => {
    try {
      await analytics.logEvent('Event', {message: 'user on login screen'});
    } catch (error) {
      console.log('error');
    }
  };

  useEffect(() => {
    logEvent();
  }, []);

  // handles google sign in
  const googleSign = async () => {
    try {
      const user = await handleGoogleSignIn();
      if (user) {
        console.log(user);
      }
      await AsyncStorage.setItem('isLoggedIn', 'true');
      navigation.replace('BottomNav');
    } catch (error) {
      console.log(error);
    }
  };

  // handles authentication go user and login in user
  const handleLogin = async () => {
    try {
      setLoading(true);
      if (!email || !password) {
        Alert.alert('Error', 'Please enter both username and password');
        return;
      }
      if (email.endsWith('@gmail.com') === false) {
        return Alert.alert('Enter valid Email');
      }
      const signData = await auth().signInWithEmailAndPassword(email, password);
      const signUser = signData.user.uid.toString();
      const userId = auth().currentUser.uid.toString();
      if (signUser === userId) {
        await AsyncStorage.setItem('isLoggedIn', 'true');
        setEmail('');
        setPassword('');
        navigation.replace('BottomNav');
      }
    } catch (error) {
      console.log(error);
      return Alert.alert('Error', 'Incorrect email or password');
    } finally {
      setLoading(false);
      setEmail('');
      setPassword('');
    }
  };

  return (
    <KeyboardAvoidingView style={{flex: 1}}>
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        keyboardShouldPersistTaps="always">
        <View style={styles.container}>
          <Text style={styles.title}>Welcome Back</Text>
          <InputField
            value={email}
            changeValue={setEmail}
            hintText={'Enter Your Email'}
            valueTextSize={18}
            fieldHeight={50}></InputField>
          <PasswordField
            value={password}
            changeValue={setPassword}
            hintText={'Enter your Password'}
            isHidden={showPassword}
            setHidden={() => {
              setShowPassword(!showPassword);
            }}></PasswordField>
          <AppButton
            color={'#00303d'}
            labelColor={'white'}
            labelText={'Login'}
            width={'70%'}
            alignment={'center'}
            loading={loading}
            handleOnPress={handleLogin}
            iconName={'sign-in'}
            iconColor={'white'}></AppButton>
          <View style={{marginTop: 10}}>
            <AppButton
              color={'#00303d'}
              labelColor={'white'}
              labelText={'Login With Google'}
              width={'70%'}
              alignment={'center'}
              loading={false}
              handleOnPress={googleSign}
              iconName={'google'}
              iconColor={'white'}></AppButton>
          </View>
          <TextButton
            handlePress={() => navigation.navigate('Signin')}
            label={`Don't Have An Account? Sign Up`}
            alignment={'center'}></TextButton>
          <TextButton
            handlePress={() => navigation.navigate('PasswordReset')}
            label={'Forget Password? Click Here'}
            alignment={'center'}></TextButton>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-start',
    backgroundColor: '#f5f5f5',
  },
  title: {
    alignSelf: 'center',
    fontSize: 36,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 20,
  },
  input: {
    width: '95%',
    height: 60,
    borderColor: 'grey',
    borderWidth: 2,
    marginTop: 10,
    marginLeft: 10,
    borderRadius: 15,
    padding: 20,
    fontSize: 18,
    marginBottom: 10,
  },
  passInput: {
    width: '95%',
    height: 60,
    paddingRight: 30,
    fontSize: 18,
    paddingLeft: 20,
  },
  passwordContainer: {
    flexDirection: 'row',
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 15,
    marginBottom: 15,
    width: '95%',
    marginLeft: 10,
  },
  iconContainer: {
    right: 20,
    top: 15,
  },
  textButton: {
    marginTop: 15,
    alignSelf: 'center',
    color: 'black',
    fontWeight: 'bold',
    fontSize: 20,
  },
  button: {
    backgroundColor: '#00323d',
    paddingVertical: 15,
    width: '50%',
    alignSelf: 'center',
    borderRadius: 15,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
  },
  topBanner: {
    height: '40%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'blue',
  },
});

export default Login;
