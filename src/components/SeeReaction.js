import React from 'react'
import { View,Text } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'

const SeeReaction = ({item,seeReactions,reactions}) => {

   if(seeReactions){
                   return <View
                     style={{
                       marginTop: 20,
                       height: 200,
                       alignSelf: 'flex-end',
                       width: '40%',
                       marginLeft: 10,
                       backgroundColor: 'rgba(220,220,220,1)',
                       elevation: 10,
                       borderRadius: 20,
                     }}>
                     {reactions=== 2 ? (
                       <View
                         style={{
                           flexDirection: 'row',
                           alignItems: 'flex-start',
                           justifyContent: 'space-between',
                         }}>
                         <Text
                           style={{
                             color: 'black',
                             marginTop: 20,
                             marginLeft: 10,
                             fontSize: 20,
                             fontWeight: 'bold',
                           }}>
                           {item.reactions[0] === id ? 'You' : route.params.name}
                         </Text>
                         <Text
                           style={{
                             color: 'black',
                             marginTop: 20,
                             marginRight: 10,
                             fontSize: 20,
                             fontWeight: 'bold',
                           }}>
                           {item.reactions[1]}
                         </Text>
                       </View>
                     ) : (
                       <View>
                         <View
                           style={{
                             flexDirection: 'row',
                             alignItems: 'flex-start',
                             justifyContent: 'space-between',
                           }}>
                           <Text
                             style={{
                               color: 'black',
                               marginTop: 20,
                               marginLeft: 10,
                               fontSize: 20,
                               fontWeight: 'bold',
                             }}>
                             {item.reactions[0] === id ? 'You' : route.params.name}
                           </Text>
                           <Text
                             style={{
                               color: 'black',
                               marginTop: 20,
                               marginRight: 10,
                               fontSize: 20,
                               fontWeight: 'bold',
                             }}>
                             {item.reactions[1]}
                           </Text>
                         </View>
                         <View
                           style={{
                             flexDirection: 'row',
                             alignItems: 'flex-start',
                             justifyContent: 'space-between',
                           }}>
                           <Text
                             style={{
                               color: 'black',
                               marginTop: 20,
                               marginLeft: 10,
                               fontSize: 20,
                               fontWeight: 'bold',
                             }}>
                             {item.reactions[2] === id ? 'You' : route.params.name}
                           </Text>
                           <Text
                             style={{
                               color: 'black',
                               marginTop: 20,
                               marginRight: 10,
                               fontSize: 20,
                               fontWeight: 'bold',
                             }}>
                             {item.reactions[3]}
                           </Text>
                         </View>
                       </View>
                     )}
                   </View>
   }
   else{
    return <View/>
   }
}

export default SeeReaction
