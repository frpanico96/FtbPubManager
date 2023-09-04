import React, {useState, useCallback} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {GestureHandlerRootView, ScrollView} from 'react-native-gesture-handler';

import UTILS from '../utilities/utils';
import DropDownPicker from 'react-native-dropdown-picker';
import CheckBox from '@react-native-community/checkbox';

type DateObj = {
  dateStr: String;
  year: String;
  month: String;
  day: String;
  hour: String;
  minute: String;
};

type ReservationManagerDetailProp = {
  username: String;
  pubId: String;
  dateTimeOfReservation: DateObj;
  isAtLeastOwner: Boolean;
  refresher: Boolean;
};

type ReservationTileProp = {
  reservation: Object;
  isAtLeastOwner: Boolean;
  username: String;
};

const ReservationManagerDetail: React.FC<ReservationManagerDetailProp> = ({
  username,
  pubId,
  dateTimeOfReservation,
  isAtLeastOwner,
  refresher,
}) => {
  const [reservations, setReservations] = useState([]);

  const fetchReservations = (refresher: Boolean) => {
    console.log(refresher);
    const apiToCall = isAtLeastOwner
      ? '/getReservation'
      : '/getUserReservation';
    const bodyObj = isAtLeastOwner
      ? {date: dateTimeOfReservation, pubId}
      : {username, pubId};
    console.log(bodyObj);
    fetch(UTILS.serverBasePath + apiToCall, {
      headers: {'Content-Type': 'application/json'},
      method: 'POST',
      body: JSON.stringify(bodyObj),
    })
      .then(res => res.json())
      .then(jsonRes => {
        console.log(jsonRes);
        setReservations(jsonRes.reservations);
      })
      .catch(error => console.log(error));
  };

  useFocusEffect(
    useCallback(() => {
      fetchReservations(refresher);
    }, []),
  );

  console.log(reservations);
  

  return (
    <>
      <GestureHandlerRootView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          {reservations.length > 0 && reservations.map(reservation => {
            return <ReservationTile key={reservation._id} reservation={reservation} username={username} isAtLeastOwner={isAtLeastOwner} />
          })}
        </ScrollView>
      </GestureHandlerRootView>
    </>
  );
};

const ReservationTile: React.FC<ReservationTileProp> = ({
  reservation,
  isAtLeastOwner,
  username,
}) => {

  // /* Status Combobox state */
  // const [open, setOpen] = useState(false);
  // const [status, setStatus] = useState(reservation?.status);
  // const [statusItems, setStatusItems] = useState(UTILS.reservationManager['status-options']);

  const renderRightActions = () => {
    return (
      <>
        <TouchableOpacity style={{backgroundColor: 'pink', justifyContent: 'center'}}>
          <Text>Edit Reservation</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{backgroundColor: 'red', justifyContent: 'center'}}>
          <Text>Cancel Reservation</Text>
        </TouchableOpacity>
      </>
    );
  };
  return (
    <>
      <View style={styles.tileViewContainer}>
        <Swipeable
          renderRightActions={renderRightActions}
          containerStyle={styles.tileSwipeable}>
          <View style={styles.reservationContainer}>
            <View style={styles.userInfoDateContainer}>
              <View style={styles.userInfoContainer}>
                <Text>{username}</Text>
                <Text>{` (${reservation?.contact?.phonePrefix}) ${reservation?.contact?.phoneNumber}`}</Text>
              </View>
              <Text style={styles.dateTxt}>{(new Date(reservation.dateTimeOfReservation)).toUTCString()}</Text>
            </View>
            <View style={styles.reservationStatusContainer}>
              <View style={styles.statusCombobox}>
                <Text>{reservation?.status}</Text>
              </View>
              <View style={styles.checkBoxContainer}>
                <CheckBox
                  style={styles.checkBox}
                  disabled={true}
                  value={reservation?.callBack}
                />
                <Text>CallBack</Text>
              </View>
            </View>
          </View>
        </Swipeable>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, width: '100%'},
  scrollView: {flexGrow: 1, justifyContent: 'space-evenly'},
  tileViewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    padding: 5,
  },
  tileSwipeable: {
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 6,
    borderColor: 'black',
    borderWidth: 1,
  },
  reservationContainer: {
    flexDirection: 'row',
    width: '100%',
    padding: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfoDateContainer: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  userInfoContainer: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  userInfoTxt: {
    padding: 3,
  },
  dateTxt: {
    padding: 0,
  },
  reservationStatusContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusCombobox: {
    width: '100%',
    marginBottom: 5,
  },
  checkBoxContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkBox: {
    height: 10,
    width: 10,
    marginRight: 3,
  },
});

export default ReservationManagerDetail;
