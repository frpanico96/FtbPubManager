import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import UTILS from '../utilities/utils';

type ReservationManagerStatusProp = {
  date: String;
  reservationId: String;
  username: String;
  mode: String;
  onConfirmAction: Function;
};

type CancelReservationProp = {
  date: String;
  onCancel: Function;
};

const ReservationManagerStatus: React.FC<ReservationManagerStatusProp> = ({
  reservationId,
  date,
  username,
  mode,
  onConfirmAction,
}) => {
  const handleConfirm = (status: String, callback: Boolean) => {
    const bodyObj = {
      status,
      callback,
      username,
      reservationId,
    };
    const apiToCall = '/updateReservationStatus';
    fetch(UTILS.serverBasePath + apiToCall, {
      headers: {'Content-Type': 'application/json'},
      method: 'POST',
      body: JSON.stringify(bodyObj),
    })
      .then(res => res.json())
      .then(jsonRes => {
        console.log(jsonRes);
        onConfirmAction();
      })
      .catch(error => console.log(error));
  };

  const handleCancel = () => {
    handleConfirm('cancelled', false);
  };

  const componentToShow =
    mode === UTILS.reservationManager['action-type-cancel'] ? (
      <CancelReservation date={date} onCancel={handleCancel} />
    ) : UTILS.reservationManager['action-type-status'] ? (
      <Text>Status</Text>
    ) : (
      <Text>NO ACTION</Text>
    );

  return <>{componentToShow}</>;
};

const CancelReservation: React.FC<CancelReservationProp> = ({
  date,
  onCancel,
}) => {
  return (
    <>
      <View style={styles.container}>
        <Text style={[styles.txtStyle, styles.infoTxt]}>
          Are you sure you want to <Text style={styles.actionTxt}>Cancel</Text>{' '}
          the reservation of {new Date(date).toUTCString()} ?
        </Text>
        <TouchableOpacity style={styles.btn} onPress={() => onCancel()}>
          <Text style={styles.txtStyle}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  btn: {
    padding: 10,
    borderRadius: 6,
    backgroundColor: 'pink',
  },
  txtStyle: {
    textAlign: 'center',
  },
  infoTxt: {
    padding: 10,
    marginBottom: 50,
    fontSize: 20,
  },
  actionTxt: {
    fontWeight: '600',
  },
});

export default ReservationManagerStatus;
