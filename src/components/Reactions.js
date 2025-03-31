import React from 'react'
import { View,Text,TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons';

const Reactions = ({options,currIndex,actualIndex,reactionfunction,reactionsArray,item}) => {
    if(options && currIndex == actualIndex ){
  return (
    
                        <View
                          style={{
                            backgroundColor: 'black',
                            borderRadius: 20,
                            height: 50,
                            width: '100%',
                            position: 'absolute',
                            zIndex: 1,
                            elevation: 10,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingLeft: 10,
                            paddingRight: 10,
                          }}>
                          <TouchableOpacity
                            onPress={()=>reactionfunction(reactionsArray[0],item)}>
                            <Icon name="favorite" size={30} color={'red'} />
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={()=>reactionfunction(reactionsArray[1],item)}>
                            <Text style={{fontSize: 25}}>😂</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={()=>reactionfunction(reactionsArray[2],item)}>
                            <Text style={{fontSize: 25}}>😭</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={()=>reactionfunction(reactionsArray[3],item)}>
                            <Text style={{fontSize: 25}}>😡</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={()=>reactionfunction(reactionsArray[4],item)}>
                            <Text style={{fontSize: 25}}>😎</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={()=>reactionfunction(reactionsArray[5],item)}>
                            <Text style={{fontSize: 25}}>💀</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={()=>reactionfunction(reactionsArray[6],item)}>
                            <Text style={{fontSize: 25}}>💯</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={()=>reactionfunction(reactionsArray[7],item)}>
                            <Text style={{fontSize: 25}}>🙏</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={()=>reactionfunction(reactionsArray[8],item)}>
                            <Text style={{fontSize: 25}}>🎉</Text>
                          </TouchableOpacity>
                        </View>
                      )
                    }
                    else{
                        return <View/>
                    }
}



export default Reactions
