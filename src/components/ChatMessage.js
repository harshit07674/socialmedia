import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ChatMessage = ({ item, navigation, updateSeen }) => {
  return (
    <TouchableOpacity
      onLongPress={() => {
        // Handle long press actions
      }}
      onPress={() => {
        // Handle message press actions
      }}
    >
      <View style={styles.messageContainer(item)}>
        {item.isForward && (
          <View style={styles.forwardedMessage}>
            <Icon name="arrow-forward" size={25} color={'white'} />
            <Text style={styles.forwardedText}>Forwarded</Text>
          </View>
        )}
        <Text style={styles.senderName(item)}>{item.uid === id ? 'You' : item.name}</Text>
        <Text style={styles.messageText}>{item.message}</Text>
        <Text style={styles.timestamp}>{item.date + '.' + item.time}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = {
  messageContainer: (item) => ({
    backgroundColor: item.uid === id ? 'green' : 'blue',
    borderRadius: 15,
    padding: 10,
    margin: 10,
  }),
  forwardedMessage: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  forwardedText: {
    color: 'white',
    fontSize: 15,
  },
  senderName: (item) => ({
    fontSize: 13,
    fontWeight: 'bold',
    color: 'white',
  }),
  messageText: {
    fontSize: 18,
    color: 'white',
  },
  timestamp: {
    fontSize: 13,
    color: 'black',
  },
};

export default ChatMessage;
