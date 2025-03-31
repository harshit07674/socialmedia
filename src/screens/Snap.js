import React,{useEffect, useState} from 'react'
import { View, FlatList, Image, Dimensions, TouchableOpacity,Alert } from 'react-native'
import auth from '@react-native-firebase/auth';
import firebase from '@react-native-firebase/app';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Snap = ({route}) => {
    const {
        width:screenWidth,
        height:screenHeight
    }=Dimensions.get('screen');
    const [snap,setSnap]=useState(null);

    const deleteSnap=async(snapId)=>{
        try{
            const reference = firebase
            .app()
            .database(
              'https://photoshare-e09d4-default-rtdb.asia-southeast1.firebasedatabase.app/',
            )
            .ref('/SocialMediaChats/')
            .child('snaps');
            route.params.id.sort();
            const room = route.params.id.join('_');
            await reference.child(room).child(snapId).remove();
        }
        catch(error){
            console.log(error);
        }
    }

    const fetchSnaps=async()=>{
        try{
            const reference = firebase
            .app()
            .database(
              'https://photoshare-e09d4-default-rtdb.asia-southeast1.firebasedatabase.app/',
            )
            .ref('/SocialMediaChats/')
            .child('snaps');
            route.params.id.sort();
            const room = route.params.id.join('_');
            await reference.child(room).orderByChild('uid').equalTo(route.params.sendId).once('value',snapshot=>{
                const data = snapshot.val();
                if(data){
                    setSnap(Object.values(data));
                }
            });
        }
        catch(error){
            console.log(error);
        }
    }

    useEffect(()=>{
        fetchSnaps();
    },[])

    const flatListRef = React.useRef(null);

    const scrollToNext = (index) => {
        if(index===snap.length-1){
            Alert.alert('Snaps over');
        }
        if(index<0){
            Alert.alert('No Snaps');
        }
        if (index < snap.length - 1) {
            flatListRef.current.scrollToIndex({ index: index + 1 });
        }
    };

    return (
        <View style={{height:screenHeight,width:screenWidth}}>
            <FlatList 
                ref={flatListRef}
                data={snap}
                contentContainerStyle={{flexGrow:1}}
                keyExtractor={(item)=>item.id}
                pagingEnabled
                scrollEnabled={false} // Disable default scrolling
                renderItem={({ item, index }) => {
                    if(item.isSeen===false){
                        deleteSnap(item.id);
                    }
                    return (
                        <View style={{height:screenHeight,width:screenWidth,alignItems:'center',justifyContent:'center'}}>
                            <Image source={{ uri: item.message }} style={{ height: '100%', width: '100%', resizeMode: 'stretch' }} />
                            <View style={{position:'absolute',height:70,width:70,borderRadius:35,backgroundColor:'white',elevation:10,top:'45%',right:'3%',alignItems:'center',justifyContent:'center'}}>
                            <TouchableOpacity onPress={() => scrollToNext(index)}>
                    <Icon name={'arrow-forward'} size={40} color={'black'} />
                </TouchableOpacity>
            </View>
            <View style={{position:'absolute',height:70,width:70,borderRadius:35,backgroundColor:'white',elevation:10,top:'45%',left:'3%',alignItems:'center',justifyContent:'center'}}>
                            <TouchableOpacity onPress={() => scrollToNext(index-1)}>
                    <Icon name={'arrow-back'} size={40} color={'black'} />
                </TouchableOpacity>
            </View>

                        </View> 
                    );
                }}
            />
        </View>
    )
}

export default Snap
