import React from 'react'
import { View,Text } from 'react-native'
import Icon  from 'react-native-vector-icons/MaterialIcons'

const ForwardMessage = ({forward,}) => {
    if(forward===true){
    return <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'flex-start',
                              justifyContent: 'flex-start',
                            }}>
                            <Icon name="arrow-forward" size={25} color={'white'} />
                            <Text style={{color: 'white', fontSize: 15}}>
                              Forwarded
                            </Text>
                          </View>
    }
    else{
        return <View/>
    }
}

export default ForwardMessage
