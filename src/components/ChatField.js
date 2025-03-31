import React from 'react'
import { View,TextInput,TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'

const ChatField = ({micOption,chatText,setText,attachmentOption,chatFunction}) => {
  return (
   <View
           style={{
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
           }}>
            <TouchableOpacity onPress={micOption}><Icon name='mic' size={30} color={'white'} style={{marginLeft:10}}></Icon></TouchableOpacity> 
           <TextInput
             value={chatText}
             onChangeText={setText}
             style={{color: 'white', width: '63%', marginLeft: 10, fontSize: 18}}
             placeholder="Write Message..."
             placeholderTextColor={'white'}></TextInput>
           <TouchableOpacity onPress={attachmentOption}>
             <Icon name="attachment" color={'white'} size={30}></Icon>
           </TouchableOpacity>
           <TouchableOpacity onPress={chatFunction}>
             <Icon
               name="send"
               color={'white'}
               size={30}
               style={{marginLeft: 20}}></Icon>
           </TouchableOpacity>
         </View>
  )
}

export default ChatField
