import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ChatHeader = ({ navFunction,profile, name, online,option,forwardFunction,copyFunction,replyFunction }) => {
  return (
    <View style={styles.topBar}>
      <TouchableOpacity onPress={navFunction}>
        <Icon name="arrow-back" size={25} color={'black'} />
      </TouchableOpacity>
      <Image style={styles.circle} source={{ uri: profile }} />
      <View>
        <Text style={[styles.label, { marginLeft: 10 }]}>
          {'@' + name}
        </Text>
        <View style={styles.row}>
          <View style={styles.status(online)} />
          <Text style={styles.statusText}>
            {online ? 'Online' : 'Offline'}
          </Text>
        </View>
      </View>
      {option===true && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginLeft: 20,
            }}>
            <TouchableOpacity onPress={replyFunction}>
              <Icon name="reply" size={30} color={'black'}></Icon>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={forwardFunction}>
              <Icon name="forward" size={30} color={'black'}></Icon>
            </TouchableOpacity>
            <TouchableOpacity onPress={copyFunction}>
              <Icon name="file-copy" size={30} color={'black'}></Icon>
            </TouchableOpacity>
          </View>
        )}
    </View>
  );
};

const styles = {
  topBar: {
    height: 60,
    width: '100%',
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 10,
  },
  circle: {
    marginLeft: 10,
    height: 50,
    width: 50,
    borderRadius: 25,
    resizeMode: 'stretch',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  status: (isStatus) => ({
    marginTop: 7,
    backgroundColor: isStatus ? 'green' : 'red',
    width: 13,
    height: 13,
    borderRadius: 20,
    marginLeft: 10,
    marginRight: 6,
  }),
  label: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  },
  statusText: {
    marginTop: 3,
    color: 'black',
    fontSize: 14,
  },
};

export default ChatHeader;
