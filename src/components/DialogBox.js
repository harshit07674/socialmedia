import React from 'react';
import {View, Modal, Text, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const DialogBox = ({isHidden, setHidden, handleCamera, handleGallerry}) => {
  return (
    <Modal
      visible={isHidden}
      transparent={true}
      animationType="slide"
      onRequestClose={setHidden}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.modalButton} onPress={handleCamera}>
            <Icon name="add-a-photo" size={50} color={'black'} />
            <Text style={styles.modalButtonText}>Take Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.modalButton} onPress={handleGallerry}>
            <Icon name="perm-media" size={50} color={'black'} />
            <Text style={styles.modalButtonText}>Choose from Gallery</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={setHidden}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={setHidden}></TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = {
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalButtonText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#333',
  },
  cancelButton: {
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButtonText: {
    color: '#ff4444',
    fontSize: 16,
  },
};

export default DialogBox;
