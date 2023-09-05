import React from 'react';
import {Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

type ModalProps = {
  toggleModal: Boolean;
  reservation: Object;
  actionType: String;
  onToggleModal: Function;
  onConfirmAction: Function;
};

const ReservationManagerModal: React.FC<ModalProps> = ({
  toggleModal,
  reservation,
  actionType,
  onToggleModal,
  onConfirmAction,
}) => {

  const handleConfirmAction = () => {
    onConfirmAction(reservation);
  }

  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={toggleModal}
        onRequestClose={() => onToggleModal(!toggleModal)}>
        <View style={styles.modalBodyContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Hello World</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={handleConfirmAction}>
              <Text style={styles.textStyle}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalBodyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
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

export default ReservationManagerModal;
