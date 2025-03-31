import React from 'react'
import { View,Text, } from 'react-native'

const ReplyView = ({reply,user}) => {
  return (
    <View
             style={{
               width: '95%',
               marginLeft: 10,
               position: 'absolute',
               bottom: 90,
             }}>
             <View
               style={{
                 width: '95%',
                 backgroundColor: 'green',
                 marginLeft: 10,
                 borderRadius: 5,
                 top: 4,
                 elevation: 10,
               }}>
               <View
                 style={{
                   marginLeft: 5,
                   marginTop: 5,
                   marginBottom: 10,
                   backgroundColor: 'rgba(0,0,0,0.3)',
                   padding: 10,
                   width: '97%',
                   borderRadius: 10,
                 }}>
                 <Text style={styles.label}>
                   {reply.uid === user ? 'You' : reply.name}
                 </Text>
                 <Text style={styles.label}>{reply.message}</Text>
               </View>
             </View>
           </View>
  )
}

const styles={
    label: {
        color: 'black',
        fontSize: 20,
        fontWeight: 'bold',
      },
}

export default ReplyView
