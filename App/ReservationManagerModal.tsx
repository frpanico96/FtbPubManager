/**@frpanico
 * Modal opened when the users modify a reservation
 * It show the ReservationStatus component based on what the user selected
 * On the ReservationManagerDetail component
 */
import React from 'react';
import {Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Reservation from './Reservation';
import UTILS from '../utilities/utils';
import ReservationManagerStatus from './ReservationStatus';

type ModalProps = {
  toggleModal: Boolean;
  reservation: Object;
  actionType: String;
  username: String;
  pub: Object;
  onToggleModal: Function;
  onConfirmAction: Function;
};

const ReservationManagerModal: React.FC<ModalProps> = ({
  toggleModal,
  reservation,
  actionType,
  username,
  pub,
  onToggleModal,
  onConfirmAction,
}) => {
  const handleConfirmAction = () => {
    onConfirmAction(reservation);
  };

  const reservationFormObj = {
    contactInfo: {
      phoneNumber: reservation?.contact?.phoneNumber,
      phonePrefix: reservation?.contact?.phonePrefix,
      username: reservation?.contact?.user?.username,
    },
    dateTimeOfReservation: reservation?.dateTimeOfReservation,
    numberOfPeople: reservation.numberOfPeople,
  };

  console.log(actionType);

  const componentToShow =
    actionType === UTILS.reservationManager['action-type-edit'] ? (
      <Reservation
        reservationForm={reservationFormObj}
        username={username}
        pub={pub}
        reservationId={reservation?._id}
        onBookSaved={() => onToggleModal(!toggleModal)}
      />
    ) : (
      <ReservationManagerStatus
        date={reservation?.dateTimeOfReservation}
        username={reservation?.contact?.user?.username}
        mode={actionType}
        reservationId={reservation?._id}
        status={reservation?.status}
        callBack={reservation?.callBack}
        onConfirmAction={() => onToggleModal(!toggleModal)}
      />
    );

  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={toggleModal}
        onRequestClose={() => onToggleModal(!toggleModal)}>
        <View style={styles.modalBodyContainer}>
          <View style={styles.modalView}>
            {componentToShow}
            <View>
              <TouchableOpacity
                style={styles.button}
                onPress={handleConfirmAction}>
                <Text style={styles.textStyle}>Close</Text>
              </TouchableOpacity>
            </View>
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

export default ReservationManagerModal;
