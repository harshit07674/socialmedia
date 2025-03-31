import React from 'react';
import {Text} from 'react-native';

const TextButton = ({handlePress, label, alignment}) => {
  return (
    <Text style={styles.textButton(alignment)} onPress={handlePress}>
      {label}
    </Text>
  );
};

const styles = {
  textButton: alignment => {
    return {
      marginTop: 15,
      alignSelf: alignment,
      color: 'black',
      fontWeight: 'bold',
      fontSize: 20,
    };
  },
};

export default TextButton;
