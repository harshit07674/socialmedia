import React from 'react';
import {Image, View, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const UploadImageView = ({handlePress, imageUrl}) => {
  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={styles.circleContainer}>
        {imageUrl ? (
          <Image source={{uri: imageUrl}} style={styles.circle} />
        ) : (
          <View style={styles.circle}>
            <Icon name="add-a-photo" size={50} color={'black'} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = {
  circleContainer: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  circle: {
    width: '80%',
    height: 200,
    borderRadius: 10,
    borderColor: 'black',
    resizeMode: 'stretch',
    borderWidth: 3,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
};

export default UploadImageView;
