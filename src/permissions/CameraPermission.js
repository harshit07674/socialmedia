import {Alert} from 'react-native';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

// Checks permission for camera access
const cameraPermission = async (options, callback) => {
  try {
    const cameraPermission = await check(PERMISSIONS.ANDROID.CAMERA);
    if (
      cameraPermission === RESULTS.GRANTED ||
      cameraPermission === RESULTS.LIMITED
    ) {
      launchCamera(options, callback);
      return true;
    }

    if (cameraPermission === RESULTS.DENIED) {
      const req = await request(PERMISSIONS.ANDROID.CAMERA);
      if (req === RESULTS.GRANTED || req === RESULTS.LIMITED) {
        launchCamera(options, callback);
        return true;
      }
      Alert.alert(
        'Camera permission is required to access camera and take photos',
      );
      return false;
    }

    if (
      cameraPermission === RESULTS.BLOCKED ||
      cameraPermission === RESULTS.UNAVAILABLE
    ) {
      Alert.alert(
        'Camera Permission Required',
        'Please go to settings and enable camera permission to take photos',
      );
      return false;
    }
  } catch (error) {
    Alert.alert('Error', 'Something went wrong');
    return false;
  }
};

export default cameraPermission;
