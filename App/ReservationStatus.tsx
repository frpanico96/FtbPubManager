/**@frpanico
 * Component that allows to modify a reservation
 * It is possible to modify reservation detail
 * Cancel a reservation
 * Update the status and callback of a reservation (pub's owner and admin only)
 */
import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import UTILS from '../utilities/utils';
import DropDownPicker from 'react-native-dropdown-picker';
import CheckBox from '@react-native-community/checkbox';
import Toast from 'react-native-toast-message';

type ReservationManagerStatusProp = {
  date: String;
  reservationId: String;
  username: String;
  mode: String;
  status: String;
  callBack: Boolean;
  onConfirmAction: Function;
};

type CancelReservationProp = {
  date: String;
  onCancel: Function;
};

type ReservationStatusProp = {
  status: String;
  callback: Boolean;
  onUpdate: Function;
};

const ReservationManagerStatus: React.FC<ReservationManagerStatusProp> = ({
  reservationId,
  date,
  username,
  mode,
  status,
  callBack,
  onConfirmAction,
}) => {
  const handleConfirm = (status: String, callback: Boolean) => {
    const bodyObj = {
      status,
      callback,
      username,
      reservationId,
    };
    console.log(bodyObj);
    const apiToCall = '/updateReservationStatus';
    fetch(UTILS.serverBasePath + apiToCall, {
      headers: {'Content-Type': 'application/json'},
      method: 'POST',
      body: JSON.stringify(bodyObj),
    })
      .then(res => res.json())
      .then(jsonRes => {
        console.log(jsonRes);
        Toast.show({
          type: jsonRes.error ? 'error' : 'success',
          text1: jsonRes.error ? 'Error' : 'Success',
          text2: jsonRes.error
            ? jsonRes.error
            : 'Reservation Booked successfully',
          position: 'bottom',
        });
        onConfirmAction();
      })
      .catch(error => console.log(error));
  };

  const handleCancel = () => {
    handleConfirm('cancelled', false);
  };

  const handleUpdateState = (status: String, callback: Boolean) => {
    handleConfirm(status, callback);
  };

  const componentToShow =
    mode === UTILS.reservationManager['action-type-cancel'] ? (
      <CancelReservation date={date} onCancel={handleCancel} />
    ) : UTILS.reservationManager['action-type-status'] ? (
      <ReservationStatus
        status={status}
        callback={callBack}
        onUpdate={handleUpdateState}
      />
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
          the reservation of {new Date(date).toLocaleString().replace(/(.*)\D\d+/, '$1')} ?
        </Text>
        <TouchableOpacity style={styles.btn} onPress={() => onCancel()}>
          <Text style={styles.txtStyle}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const ReservationStatus: React.FC<ReservationStatusProp> = ({
  status,
  callback,
  onUpdate,
}) => {
  const [callBack, setCallBack] = useState(callback);
  /* DropDownPicker State */
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(status);
  const [items, setItems] = useState(
    UTILS.reservationManager['status-options'],
  );

  const handlePressSave = () => {
    console.log(value, callBack);
    onUpdate(value, callBack);
  };

  return (
    <View style={styles.statusContainer}>
      <View style={styles.dropDownContainer}>
        <DropDownPicker
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          placeHolder={''}
        />
      </View>
      <View style={styles.checkBoxContainer}>
        <CheckBox
          style={styles.checkBox}
          value={callBack}
          onValueChange={newValue => setCallBack(newValue)}
        />
        <Text>CallBack</Text>
      </View>
      <View style={styles.btnContainer}>
        <TouchableOpacity style={styles.btn} onPress={handlePressSave}>
          <Text style={styles.txtStyle}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  btnContainer: {
    flex: 1,
    padding: 10,
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
  statusContainer: {
    flex: 1,
  },
  dropDownContainer: {
    width: '100%',
    zIndex: 2000,
    padding: 10,
  },
  checkBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  checkBox: {
    height: 20,
    width: 20,
    marginRight: 3,
  },
});

export default ReservationManagerStatus;
