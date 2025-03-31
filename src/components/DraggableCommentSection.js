import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';

const DraggableCommentSection = ({id}) => {
    const currId = auth().currentUser.uid;
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [height, setHeight] = useState(new Animated.Value(0));

    useEffect(() => {
        fetchComments();
    }, []);

    const fetchComments = async () => {
        const reference = firebase
        .app()
        .database(
          'https://photoshare-e09d4-default-rtdb.asia-southeast1.firebasedatabase.app/',
        ).ref('/SocialMediaPosts/').child(id);// Adjust the path as necessary

        reference.on('value', snapshot => {
            const data = snapshot.val();
            if (data) {
                setComments(Object.values(data));
            }
        });
    };
    const formatTime=(userDate)=>{
        const actualTimeStamp = parseInt(userDate);
                const date = new Date(actualTimeStamp);
                const actual = date.toLocaleString('en-IN');
                let time = date.getHours();
                let formatTime = '';
                let meridian = '';
                let minute = date.getMinutes();
                if (time > 12) {
                    time = time % 12;
                    meridian = 'pm';
                    formatTime = time === 0 ? '12' : time < 10 ? '0' + time : time.toString();
                } else {
                    meridian = 'am';
                    formatTime = time < 10 ? '0' + time : time.toString();
                }
                const formatMinute = minute < 10 ? '0' + minute : minute.toString();
                const formatedDate = actual.split(' ')[0] + ',' + date.getUTCDate() + ' ' + actual.split(' ')[1] + ' ' + date.getUTCFullYear() + ' ' ;
                const realTime= formatTime + ':' + formatMinute + ' ' + meridian;
                return {realTime,formatedDate};
    }

    const addComment = async () => {
        if (commentText.trim()) {
            const reference = firebase
                .app()
                .database('https://photoshare-e09d4-default-rtdb.asia-southeast1.firebasedatabase.app/')
                .ref('/SocialMediaPosts/').child(id); // Adjust the path as necessary

const dateTime= Date.now().toString();
const realDate=formatTime(dateTime);

            const newComment = {
                comment: commentText,
                id: currId+dateTime,
                date:realDate.formatedDate,
                time:realDate.realTime,
            };

            await reference.child(currId+dateTime).set(newComment);
            setCommentText('');
        }
    };

    const toggleSection = () => {
        setIsOpen(!isOpen);
        Animated.timing(height, {
            toValue: isOpen ? 0 : 300, // Adjust height as necessary
            duration: 300,
            useNativeDriver: false,
        }).start();
    };

    return (
        <Animated.View style={[styles.container, { height }]}>
            <TouchableOpacity onPress={toggleSection} style={styles.header}>
                <Text style={styles.headerText}>Comments</Text>
                <Icon name={isOpen ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={30} />
            </TouchableOpacity>
            {isOpen && (
                <>
                    <FlatList
                        data={comments}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <View style={styles.comment}>
                                <Text>{item.text}</Text>
                            </View>
                        )}
                    />
                    <View style={styles.inputContainer}>
                        <TextInput
                            value={commentText}
                            onChangeText={setCommentText}
                            style={styles.input}
                            placeholder='Add a comment...'
                        />
                        <TouchableOpacity onPress={addComment}>
                            <Icon name='send' size={30} color='green' />
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderColor: 'grey',
        elevation: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        backgroundColor: '#f0f0f0',
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    comment: {
        padding: 10,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
    },
});

export default DraggableCommentSection;
