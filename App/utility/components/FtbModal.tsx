import React from 'react';
import {Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import TRANSLATIONS from '../../../translations/tranlastions';
import Toast from 'react-native-toast-message';

type FtbModalProps = {
  animationType: String;
  transparent: Boolean;
  visible: Boolean;
  onToggleModal: Function;
  componentToShow: JSX.Element;
};

const FtbModal = (props: FtbModalProps) => {
  return (
    <Modal
      animationType={props.animationType}
      transparent={props.transparent}
      visible={props.visible}
      onRequestClose={() => props.onToggleModal(!props.visible)}>
      <View style={styles.modalBodyContainer}>
        <View style={styles.modalView}>
          {props.componentToShow}
          <View>
            <TouchableOpacity
              style={styles.button}
              onPress={() => props.onToggleModal(false)}>
              <Text style={styles.textStyle}>
                {TRANSLATIONS['reservation-modal-btn']}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <Toast />
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBodyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    flex: 1,
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  textStyle: {
    color: 'gray',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: 'pink',
  },
});

export default FtbModal;
