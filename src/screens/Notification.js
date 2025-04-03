import React,{useState,useEffect} from 'react'
import {View,FlatList,Text,Image,TouchableOpacity} from 'react-native';
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';


const Notification = ({navigation}) => {
    const [followers,setFollows]=useState(null);
    const [currentUser,setCurrentUser]=useState(null);
    const [loading,setLoading]=useState(false);
    const id=auth().currentUser.uid; 
     
  // fetches followers of user
  const fetchFollows = async () => {
    try {
      setLoading(true);
      const reference = firebase
        .app()
        .database(
          'https://photoshare-e09d4-default-rtdb.asia-southeast1.firebasedatabase.app/',
        )
        .ref('/SocialMediaUsers/')
        .child(id)
        .child('Follows');

      await reference.orderByChild('isSeen').equalTo(false).once('value').then(snapshot => {
        const userData = snapshot.val();
        if (userData) {
          console.log(userData);
          setFollows(Object.values(userData));
          const actualData=Object.values(userData);
          actualData.forEach((userData)=>{
            if(userData.delete!==undefined && userData.delete===true){
              reference.child(userData.uid).remove();
            }
          })
          
        }
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const setNotificationSeen=async()=>{
    try{
        const reference = firebase
        .app()
        .database(
          'https://photoshare-e09d4-default-rtdb.asia-southeast1.firebasedatabase.app/',
        )
        .ref('/SocialMediaUsers/')
        .child(id)
        .child('Follows');
        followers.forEach(element => {
            console.log({followers:element.uid});
            if(element.delete===undefined){

            
            reference.child(element.uid).update({
                isSeen:true,
            })
          }
            
        });
    }
    catch(error){
        console.log(error);
    }
  }

  useEffect(() => {
    fetchFollows();
    return()=>{
      fetchFollows();
    }
  }, []);


  return (
    <View style={{height:'100%',width:'100%'}}>
    <FlatList style={{flex:1}}
      contentContainerStyle={{flexGrow:1}}
      data={followers}
      keyExtractor={(item)=>item.uid}
      renderItem={({item})=>{
        if(followers){
            setNotificationSeen();
        }
     return <View style={styles.container}>
                 <View
                   style={{
                     flexDirection: 'row',
                     alignItems: 'center',
                     justifyContent: 'flex-start',
                     width:'90%',
                     overflow:'hidden',
                   }}>
                    <TouchableOpacity onPress={()=>navigation.navigate('userProfile',{uid:item.uid})}>
                      
                   <View style={styles.circle}>
                     <Image
                       source={{uri: item.profilePhoto}}
                       style={styles.imageContainer}></Image>
                   </View>
                   </TouchableOpacity>
                   <Text style={styles.label(16)}>{'@' + item.name}</Text>
                   <Text style={styles.label(16)}>{item.delete!==undefined && item.delete===true?'Unfollowed You':'And You Are Friends'}</Text>
                 </View>                 
               </View>
      }}></FlatList>
    </View>
  )
}


const styles = {
    profile: {
      marginTop: 10,
      width: 80,
      height: 80,
      borderRadius: 50,
    },
    container: {
      width: '97%',
      marginLeft: 5,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingLeft: 10,
      height: 100,
      marginTop:20,
      backgroundColor: 'white',
      borderColor: 'grey',
      borderWidth: 2,
      borderRadius: 15,
      marginBottom: 6,
    },
    imageContainer: {
      resizeMode: 'stretch',
      width: 40,
      height: 40,
      borderRadius: 20,
    },
    label:size=>{
        return{
      fontSize: 16,
      fontWeight: 'bold',

      marginLeft:3,
      color: 'black',
        }
    },
    roundedButton: color => {
      return {
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: 60,
        height: 40,
        borderRadius: 20,
        backgroundColor: color,
        elevation: 10,
        marginLeft: 10,
      };
    },
    row: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      width: '95%',   
      marginLeft: 10,
      marginTop: 20,
      marginBottom: 20,
    },
}

export default Notification
