import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ChatInput = ({ chatText, setChatText, addChat, setOpenAttachment }) => {
  return (
    <View style={styles.container}>
      <TextInput
        value={chatText}
        onChangeText={setChatText}
        style={styles.input}
        placeholder="Write Message..."
        placeholderTextColor={'white'}
      />
      <TouchableOpacity onPress={() => setOpenAttachment(true)}>
        <Icon name="attachment" color={'white'} size={30} />
      </TouchableOpacity>
      <TouchableOpacity onPress={addChat}>
        <Icon name="send" color={'white'} size={30} style={{ marginLeft: 20 }} />
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  container: {
    backgroundColor: 'black',
    height: 60,
    flexDirection: 'row',
    borderRadius: 30,
    width: '95%',
    marginLeft: 10,
    elevation: 10,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  input: {
    color: 'white',
    width: '70%',
    marginLeft: 15,
    fontSize: 18,
  },
};

export default ChatInput;
