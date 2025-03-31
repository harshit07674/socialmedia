import React from 'react'
import { View,Text,TouchableOpacity,Image } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons';

const SharedMessage = ({item,navFunction,profileNav}) => {
  return (
    <View>
                            <View
                              style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: 30,
                                width: 60,
                                borderRadius: 20,
                                backgroundColor: 'black',
                                marginTop: 7,
                              }}>
                              <Text style={styles.text('flex-start')}>Shared</Text>
                            </View>
                            <TouchableOpacity
                              onPress={profileNav}>
                              <View style={{flexDirection: 'row'}}>
                                <Image
                                  source={{uri: item.message.uploaderProfileUrl}}
                                  style={{
                                    width: 30,
                                    height: 30,
                                    borderRadius: 30,
                                    resizeMode: 'stretch',
                                    marginTop: 10,
                                    marginBottom: 10,
                                  }}></Image>
                                <Text
                                  style={{
                                    fontSize: 18,
                                    fontWeight: 'bold',
                                    color: 'white',
                                    marginTop: 10,
                                  }}>
                                  {' ' + item.message.uploaderName}
                                </Text>
                              </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={navFunction
                              }>
                              <View
                                style={{
                                  overFlow: 'hidden',
                                  height: 350,
                                  width: '100%',
                                  backgroundColor: 'white',
                                  borderRadius: 20,
                                  elevation: 5,
                                }}>
                                <Image
                                  source={{uri: item.message.url}}
                                  style={styles.media}></Image>
                                <View style={{flexDirection: 'row'}}>
                                  <Text
                                    style={{
                                      fontSize: 18,
                                      fontWeight: 'bold',
                                      color: 'black',
                                    }}>
                                    Caption{' '}
                                  </Text>
                                  <Text style={{fontSize: 18, color: 'black'}}>
                                    {item.message.uploaderCaption}
                                  </Text>
                                </View>
                              </View>
                            </TouchableOpacity>
                          </View>
  )
}

const styles={
    media: {
        height: 300,
        width: 300,
        resizeMode: 'stretch',
      },
      text: (align, color) => {
        return {
          fontSize: 13,
          fontWeight: 'bold',
          color: color ? color : 'white',
          alignSelf: align,
          marginRight: 5,
          marginLeft: 5,
        };
      },
}

export default SharedMessage
