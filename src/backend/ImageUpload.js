

 // Handles the logic for selecting an image from the camera or gallery
 const handleImagePicker = type => {
    let selectedImage='';
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
          selectedImage= response.assets[0].uri;
      }
     return {image:selectedImage,opened:false};
    };

    if (type === 'camera') {
      cameraPermission(options, callback);
    }
    if (type === 'gallery') {
      gallerryPermission(options, callback);
    }
  };

export default handleImagePicker;