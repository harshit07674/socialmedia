import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {Alert} from 'react-native';

// Checks permission for gallery access
const gallerryPermission = async (options, callback) => {
  try {
    const gallerryPermission = await check(
      PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
    );
    if (
      gallerryPermission === RESULTS.GRANTED ||
      gallerryPermission === RESULTS.LIMITED
    ) {
      launchImageLibrary(options, callback);
      return true;
    }

    if (gallerryPermission === RESULTS.DENIED) {
      const req = await request(PERMISSIONS.ANDROID.READ_MEDIA_IMAGES);
      if (req === RESULTS.GRANTED || req === RESULTS.LIMITED) {
        launchImageLibrary(options, callback);
        return true;
      }
      Alert.alert(
        'Gallery permission is required to access gallery and pick photos',
      );
      return false;
    }

    if (
      gallerryPermission === RESULTS.BLOCKED ||
      gallerryPermission === RESULTS.UNAVAILABLE
    ) {
      Alert.alert(
        'Gallery Permission Required',
        'Please go to settings and enable gallery permission and pick photos',
      );
      return false;
    }
  } catch (error) {
    Alert.alert('Error', 'Something went wrong');
    return false;
  }
};

export default gallerryPermission;
