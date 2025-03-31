import React from 'react';
import { View,Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ReplyMessage = ({replyToName,replyTo,replyMessage}) => {
  return (
                          <View>
                            <View
                              style={{
                                borderLeftColor: 'purple',
                                borderLeftWidth: 8,
                                padding: 10,
                                marginTop: 7,
                                borderRadius: 10,
                                backgroundColor: 'rgba(0,0,0,0.3)',
                                width: '100%',
                                marginBottom: 7,
                              }}>
                              <Text style={{color: 'white', fontSize: 16}}>
                                {replyToName}
                              </Text>
                              <Text style={{color: 'white', fontSize: 18}}>
                                {replyTo}
                              </Text>
                            </View>
                            <Text style={{color: 'white', fontSize: 18}}>
                              {replyMessage}
                            </Text>
                          </View>
                            
  )
}

export default ReplyMessage
