import React from 'react';
import {TextInput} from 'react-native-gesture-handler';

const InputField = ({
  totalWords,
  allowMultipleLines,
  valueTextSize,
  value,
  changeValue,
  hintText,
  type,
  fieldHeight,
}) => {
  return (
    <TextInput
      style={[styles.input, {fontSize: valueTextSize, height: fieldHeight}]}
      placeholder={hintText}
      keyboardType={type}
      placeholderTextColor={'grey'}
      maxLength={totalWords}
      multiline={allowMultipleLines}
      value={value}
      onChangeText={changeValue}
    />
  );
};

const styles = {
  input: {
    width: '95%',
    borderColor: 'black',
    color: 'black',
    borderWidth: 2,
    borderRadius: 15,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
    paddingLeft: 15,
    backgroundColor: 'transparent',
  },
};

export default InputField;
