import React from 'react'
import {View,Text,TouchableOpacity,Modal} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const FileDialog = ({receiver,fileSize,fileType,fileName,fileUrl,isVisible,visibleFunction,fileSendFunction}) => {
  return (
   <Modal transparent={true}
   animationType="slide" visible={isVisible} onRequestClose={visibleFunction} style={{height:'100%',width:'100%',alignItems:'center',justifyContent:'center'}}>
    <View style={{height:'100%',width:'100%',backgroundColor:'rgba(0,0,0,0.8)'}}>
   <View style={{height:200,width:'90%',marginLeft:6,borderRadius:20,marginTop:'50%',backgroundColor:'white',elevation:10,alignSelf:'center',flexDirection:'row',alignItems:'center',justifyContent:'flex-start',paddingLeft:10,paddingRight:20}}>
    <Icon name='file-open' size={100} color={'black'}></Icon>
    <Text style={{fontSize:20,color:'black',fontWeight:'bold'}}>{fileName}</Text>
    </View>
    <View style={styles.squareContainer}>
                <View style={styles.circularNameLabel}>
                  <Text style={{fontSize: 16, fontWeight: 'bold', color: 'white'}}>
                    {receiver}
                  </Text>
                </View>
                <TouchableOpacity onPress={fileSendFunction}>
                  <View style={styles.circularButton}>
                    <Icon name={'send'} color={'white'} size={35}></Icon>
                  </View>
                </TouchableOpacity>
              </View>
               
   </View>
   </Modal> 
  )
}

const styles={
    squareContainer: {
        height: 80,
        width: '100%',
        marginTop: '90%',
        backgroundColor: 'black',
        elevation: 10,
        flexDirection: 'row',
        paddingLeft: 15,
        paddingRight: 15,
        alignItems: 'center',
        justifyContent: 'space-between',
      },
      circularNameLabel: {
        borderRadius: 40,
        elevation: 10,
        padding: 10,
        backgroundColor: 'grey',
        alignItems: 'center',
        justifyContent: 'center',
      },
      circularButton: {
        height: 50,
        width: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
        backgroundColor: 'green',
        elevation: 10,
      },
}

export default FileDialog
