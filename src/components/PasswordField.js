import React from 'react';
import {View, TextInput, TouchableOpacity} from 'react-native';
import {set} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialIcons';

const PasswordField = ({value, changeValue, isHidden, hintText, setHidden}) => {
  return (
    <View style={styles.passwordContainer}>
      <TextInput
        style={styles.passInput}
        placeholder={hintText}
        value={value}
        onChangeText={changeValue}
        secureTextEntry={isHidden}
      />
      <TouchableOpacity style={styles.iconContainer} onPress={setHidden}>
        <Icon
          name={isHidden ? 'visibility' : 'visibility-off'}
          size={24}
          color="black"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  passInput: {
    width: '90%',
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
    position: 'absolute',
    right: 10,
    top: 15,
  },
};

export default PasswordField;