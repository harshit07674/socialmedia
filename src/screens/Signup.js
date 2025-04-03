import React, {useState} from 'react';
import {
  View,
  TextInput,
  Button,
  Image,
  Text,
  Alert,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import firebase from '@react-native-firebase/app';
import UploadImageView from '../components/UploadImageView';
import DialogBox from '../components/DialogBox';
import gallerryPermission from '../permissions/GallerryPermission';
import cameraPermission from '../permissions/CameraPermission';
import InputField from '../components/InputField';
import PasswordField from '../components/PasswordField';
import AppButton from '../components/AppButton';
import TextButton from '../components/TextButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import storage from '@react-native-firebase/storage';

const Signup = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [showConfirmPassword, setShowConfirmPassword] = useState(true);
  const [showPassword, setShowPassword] = useState(true);
  const [loading, setLoading] = useState(false);
  const followers = [];
  const following = [];

  // Handles the logic for creating a new user with validation
  const createUser = async () => {
    setLoading(true);
    try {
      // Password validation
      const minLength = /.{8,}/;
      const hasSpecialChar = /[^a-zA-Z0-9]/;
      const hasCapitalLetter = /[A-Z]/;
      const hasDigit = /\d/;

      if (
        name === '' ||
        password === '' ||
        confirmPassword === '' ||
        bio === ''
      ) {
        return Alert.alert('Please enter all details');
      }
      if (email.endsWith('@gmail.com') != true) {
        return Alert.alert('Error', 'Enter valid email');
      }

      if (!minLength.test(password)) {
        return Alert.alert(
          'Password is not valid',
          'Password must be at least 8 characters long',
        );
      }
      if (!hasSpecialChar.test(password)) {
        return Alert.alert(
          'Password is not valid',
          'Password must contain at least one special character',
        );
      }
      if (!hasCapitalLetter.test(password)) {
        return Alert.alert(
          'Password is not valid',
          'Password must contain at least one capital letter',
        );
      }
      if (!hasDigit.test(password)) {
        return Alert.alert(
          'Password is not valid',
          'Password must contain at least one digit',
        );
      }

      if (password !== confirmPassword) {
        return Alert.alert('Password and Confirm password do not match');
      }

      const reference = firebase
        .app()
        .database(
          'https://photoshare-e09d4-default-rtdb.asia-southeast1.firebasedatabase.app/',
        );
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );
      await AsyncStorage.setItem('isLoggedIn', 'true');
      const user = userCredential.user.uid;
      const dateTime = Date.now().toString();
      const storageReference = storage().ref(
        `/SocialMedia/${user}/profilePhoto`,
      );
      await storageReference.child(dateTime).putFile(profileImage);
      const url = await storageReference.child(dateTime).getDownloadURL();
      await reference
        .ref('/SocialMediaUsers/')
        .child(user)
        .child('profile')
        .set({
          name,
          email,
          uid: user,
          profilePhoto: url,
          isOnline:true,
          bio: bio,
          timeStamp: dateTime,
          totalPosts: 0,
        });
      await reference
        .ref('/SocialMediaUsers/')
        .child(user)
        .update({
          name,
          user,
          friends: ['1'],
        });
      Alert.alert('Success', 'You Have Signed In Successfully');
      navigation.replace('BottomNav');
    } catch (error) {
      console.log('Error creating user:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handles the logic for selecting an image from the camera or gallery
  const handleImagePicker = type => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };

    const callback = response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.assets && response.assets[0].uri) {
        setProfileImage(response.assets[0].uri);
      }
      setShowImagePicker(false);
    };

    if (type === 'camera') {
      cameraPermission(options, callback);
    }
    if (type === 'gallery') {
      gallerryPermission(options, callback);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{flexGrow: 1, paddingBottom: 200}}
      keyboardShouldPersistTaps="always"
      showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.label2}>Upload Photo</Text>
          <UploadImageView
            handlePress={() => setShowImagePicker(true)}
            imageUrl={profileImage}></UploadImageView>
          <DialogBox
            isHidden={showImagePicker}
            setHidden={() => setShowImagePicker(false)}
            handleCamera={() => handleImagePicker('camera')}
            handleGallerry={() => handleImagePicker('gallery')}></DialogBox>
          <Text style={styles.heading}>Welcome To Social Media</Text>
          <Text style={styles.label}>Email</Text>
          <InputField
            value={email}
            changeValue={setEmail}
            valueTextSize={16}
            hintText={'Enter Your Email'}></InputField>
          <Text style={styles.label}>Name</Text>
          <InputField
            value={name}
            changeValue={setName}
            valueTextSize={16}
            hintText={'Enter Your Full Name'}></InputField>
          <Text style={styles.label}>Password</Text>
          <PasswordField
            value={password}
            changeValue={setPassword}
            hintText={'Enter Your Password'}
            isHidden={showPassword}
            setHidden={() => {
              setShowPassword(!showPassword);
            }}></PasswordField>
          <Text style={styles.label}>Confirm Password</Text>
          <PasswordField
            value={confirmPassword}
            changeValue={setConfirmPassword}
            hintText={'Enter Above Password Again'}
            isHidden={showConfirmPassword}
            setHidden={() => {
              setShowConfirmPassword(!showConfirmPassword);
            }}></PasswordField>
          <Text style={styles.label}>Bio</Text>
          <InputField
            totalWords={200}
            allowMultipleLines={true}
            valueTextSize={16}
            value={bio}
            changeValue={setBio}
            hintText={'Enter Your Bio'}
            fieldHeight={120}></InputField>
          <AppButton
            handleOnPress={createUser}
            labelColor={'white'}
            labelText={'Sign Up'}
            color={'#00303d'}
            alignment={'center'}
            width={'50%'}
            loading={loading}></AppButton>
          <TextButton
            handlePress={() => navigation.navigate('Login')}
            label={'Already have account? Click Here'}
            alignment={'center'}></TextButton>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heading: {
    alignSelf: 'center',
    fontSize: 32,
    color: 'black',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    height: '25%',
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  label: {
    color: 'black',
    marginBottom: 5,
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    height: 50,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '95%',
    marginLeft: 10,
    position: 'relative',
  },
  iconContainer: {
    position: 'absolute',
    right: 10,
    top: 15,
  },
  button: {
    backgroundColor: '#00323d',
    borderRadius: 15,
    width: '50%',
    alignSelf: 'center',
    paddingVertical: 15,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  photoContainer: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    borderRadius: 250,
    borderColor: 'grey',
    borderWidth: 3,
    backgroundColor: '#00303d',
    marginBottom: 10,
    justifyContent: 'center',
  },
  label2: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    alignSelf: 'center',
    marginBottom: 10,
  },
  placeHolderIcon: {
    alignSelf: 'center',
  },
  circleImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalButtonText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#333',
  },
  cancelButton: {
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButtonText: {
    color: '#ff4444',
    fontSize: 16,
  },
  circle: {
    width: '100%',
    height: '100%',
    borderRadius: 150,
    resizeMode: 'stretch',
  },
});

export default Signup;
