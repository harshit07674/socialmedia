import React from 'react';
import {TouchableOpacity, ActivityIndicator, Text,View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const AppButton = ({
  loading,
  color,
  width,
  alignment,
  labelColor,
  labelText,
  handleOnPress,
  iconName,
  iconColor
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        {backgroundColor: color, width: width, alignSelf: alignment},
      ]}
      onPress={handleOnPress}>
      {loading ? (
        <ActivityIndicator color={'white'} />
      ) : (
        <View style={{flexDirection:'row',width:'100%',alignItems:'center',justifyContent:'center'
        }}>
        <Text style={[styles.buttonText, {color: labelColor}]}>
          {labelText}
        </Text>
       {iconName && <Icon name={iconName} size={30} color={iconColor} style={{marginLeft:10}}></Icon>}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = {
  button: {
    paddingVertical: 15,
    borderRadius: 15,
  },
  buttonText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
  },
};

export default AppButton;