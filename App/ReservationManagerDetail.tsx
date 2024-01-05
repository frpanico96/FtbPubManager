/**@frpanico
 * detail component of the reservation manager feature
 * It shows reservation and it is possibile to modify them
 */
import React, {useState, useCallback, useRef} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {View, Text, TouchableOpacity, StyleSheet, Animated, Platform} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {GestureHandlerRootView, ScrollView} from 'react-native-gesture-handler';

import UTILS from '../NodeApp/utilities/utils';
import CheckBox from '@react-native-community/checkbox';
import ReservationManagerModal from './ReservationManagerModal';
import TRANSLATIONS from '../NodeApp/translations/tranlastions';

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
  pub: Object;
  dateTimeOfReservation: DateObj;
  isAtLeastOwner: Boolean;
  refresher: Boolean;
  actionType: String;
};

type ReservationTileProp = {
  reservation: Object;
  isAtLeastOwner: Boolean;
  username: String;
  onTileEvent: Function;
  allUserReservationMode: Boolean;
};

type TileEvent = {
  reservation: Object;
  actionType: String;
};

const ReservationManagerDetail: React.FC<ReservationManagerDetailProp> = ({
  username,
  pub,
  dateTimeOfReservation,
  isAtLeastOwner,
  refresher,
  actionType,
}) => {
  const [workDay, setWorkday] = useState({});
  // const [reservations, setReservations] = useState([]);
  // const [stopReservations, setStopReservations] = useState(false);
  /* Modal State */
  const [modalState, setModalState] = useState({
    showModal: false,
    actionType: '',
    modalReservation: {},
  });

  const fetchReservations = (stopRefresher: Boolean) => {
    console.log(stopRefresher);
    if (stopRefresher) {
      return;
    }
    console.log(isAtLeastOwner);
    const apiToCall =
      actionType === UTILS.reservationManager['action-name-user-reservation']
        ? '/getUserReservation'
        : isAtLeastOwner
        ? '/getReservation'
        : '/getUserPubReservation';
    const bodyObj =
      actionType === UTILS.reservationManager['action-name-user-reservation']
        ? {username}
        : isAtLeastOwner
        ? {date: dateTimeOfReservation, pubId: pub._id}
        : {username, pubId: pub._id};
    console.log(bodyObj);
    fetch(UTILS.serverBasePath + apiToCall, {
      headers: {'Content-Type': 'application/json'},
      method: 'POST',
      body: JSON.stringify(bodyObj),
    })
      .then(res => res.json())
      .then(jsonRes => {
        console.log(jsonRes);
        let todayWorkDay;
        if (!jsonRes.workday) {
          todayWorkDay = {reservations: jsonRes.reservations};
        } else {
          todayWorkDay = jsonRes.workday;
        }
        setWorkday(todayWorkDay);
      })
      .catch(error => console.log(error));
  };

  const handleStopReservations = () => {
    const apiToCall = '/stopReservations';
    const bodyObj = {
      workdayId: workDay._id,
      stopReservations: !workDay.stopReservations,
      pubId: pub._id,
    };
    fetch(UTILS.serverBasePath + apiToCall, {
      headers: {'Content-Type': 'application/json'},
      method: 'POST',
      body: JSON.stringify(bodyObj),
    })
      .then(res => res.json())
      .then(jsonRes => {
        console.log(jsonRes);
        setWorkday(jsonRes.workday);
      })
      .catch(error => console.log(error));
  };

  useFocusEffect(
    useCallback(() => {
      fetchReservations(modalState.showModal);
    }, [modalState.showModal]),
  );

  console.log(workDay?.reservations);

  const handleTileEvent = (tileEvent: TileEvent) => {
    console.log(tileEvent);
    setModalState(prev => {
      const newState = {...prev};
      newState.actionType = tileEvent.actionType;
      newState.modalReservation = tileEvent.reservation;
      newState.showModal = true;
      return newState;
    });
  };

  const handleConfirmAction = (reservation: Object) => {
    console.log(reservation);
    setModalState(prev => {
      const newState = {...prev};
      newState.showModal = false;
      return newState;
    });
  };

  return (
    <>
      <GestureHandlerRootView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          {workDay?.reservations?.length > 0 &&
            workDay.reservations.map(reservation => {
              return (
                <ReservationTile
                  key={reservation._id}
                  reservation={reservation}
                  username={username}
                  isAtLeastOwner={isAtLeastOwner}
                  onTileEvent={handleTileEvent}
                  allUserReservationMode={
                    actionType ===
                    UTILS.reservationManager['action-name-user-reservation']
                  }
                />
              );
            })}
        </ScrollView>
        {isAtLeastOwner && (
          <View style={styles.btnContainer}>
            <TouchableOpacity
              style={styles.btn}
              onPress={handleStopReservations}>
              <Text style={styles.btnTxt}>
                {workDay?.stopReservations
                  ? TRANSLATIONS['reservation-enable-reservation']
                  : TRANSLATIONS['reservation-disable-reservation']}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        <ReservationManagerModal
          toggleModal={modalState.showModal}
          onToggleModal={toggle =>
            setModalState(prev => {
              const newState = {...prev};
              newState.showModal = toggle;
              return newState;
            })
          }
          actionType={modalState.actionType}
          username={username}
          pub={pub}
          reservation={modalState.modalReservation}
          onConfirmAction={handleConfirmAction}
        />
      </GestureHandlerRootView>
    </>
  );
};

const ReservationTile: React.FC<ReservationTileProp> = ({
  reservation,
  isAtLeastOwner,
  username,
  onTileEvent,
  allUserReservationMode,
}) => {
  // /* Status Combobox state */
  // const [open, setOpen] = useState(false);
  // const [status, setStatus] = useState(reservation?.status);
  // const [statusItems, setStatusItems] = useState(UTILS.reservationManager['status-options']);

  const swipeableRef = useRef(null);

  const closeSwipeable = () => {
    swipeableRef.current.close();
  };

  const handleEditButtonPress = () => {
    const tileEvent: TileEvent = {
      reservation: reservation,
      actionType: UTILS.reservationManager['action-type-edit'],
    };
    closeSwipeable();
    onTileEvent(tileEvent);
  };

  const handleCancelButtonPress = () => {
    const tileEvent: TileEvent = {
      reservation: reservation,
      actionType: UTILS.reservationManager['action-type-cancel'],
    };
    closeSwipeable();
    onTileEvent(tileEvent);
  };

  const handleStatusButtonPress = () => {
    const tileEvent: TileEvent = {
      reservation: reservation,
      actionType: UTILS.reservationManager['action-type-status'],
    };
    closeSwipeable();
    onTileEvent(tileEvent);
  };

  const renderRightActions = (progress, dragX) => {
    const upperCustomer = Platform.OS === 'android' ? 1.6 : 0.9;
    const upperOwner = Platform.OS === 'android' ? 0.84 : 0.64;
    const upperOutput = isAtLeastOwner ? upperOwner : upperCustomer;
    const textFontSize = isAtLeastOwner ? 10 : 12;
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [upperOutput, 0],
    });

    const isReservationActive =
      reservation?.status === 'booked' && !allUserReservationMode;

    return (
      <>
        {isReservationActive && (
          <TouchableOpacity
            style={{
              backgroundColor: 'pink',
              justifyContent: 'center',
              transform: [{scale}],
            }}
            onPress={handleEditButtonPress}>
            <Animated.Text
              style={{fontSize: textFontSize, transform: [{scale}]}}>
              {TRANSLATIONS['reservation-edit-swipe']}
            </Animated.Text>
          </TouchableOpacity>
        )}
        {isReservationActive && (
          <TouchableOpacity
            style={{
              flexWrap: 'wrap',
              backgroundColor: 'red',
              justifyContent: 'center',
              transform: [{scale}],
            }}
            onPress={handleCancelButtonPress}>
            <Animated.Text
              style={{fontSize: textFontSize, transform: [{scale}]}}>
              {TRANSLATIONS['reservation-cancel-swipe']}
            </Animated.Text>
          </TouchableOpacity>
        )}
        {isReservationActive && isAtLeastOwner && (
          <TouchableOpacity
            style={{
              backgroundColor: '#04cc89',
              justifyContent: 'center',
              transform: [{scale}],
            }}
            onPress={handleStatusButtonPress}>
            <Animated.Text
              style={{fontSize: textFontSize, transform: [{scale}]}}>
              {TRANSLATIONS['reservation-status-swipe']}
            </Animated.Text>
          </TouchableOpacity>
        )}
      </>
    );
  };
  return (
    <>
      <View style={styles.tileViewContainer}>
        <Swipeable
          ref={swipeableRef}
          renderRightActions={renderRightActions}
          containerStyle={styles.tileSwipeable}
          friction={1}
          onSwipeableWillOpen={left => console.log('swiping')}>
          <View style={styles.reservationContainer}>
            <View style={styles.userInfoDateContainer}>
              {reservation?.pub?.name && (
                <Text style={styles.userInfoTxt}>
                  {reservation?.pub?.name?.toUpperCase()}
                </Text>
              )}
              <View style={styles.userInfoContainer}>
                <Text style={styles.userInfoTxt}>
                  {!reservation?.contact?.isGuest
                    ? reservation?.contact?.user?.username
                    : TRANSLATIONS['reservation-guest']}
                </Text>
                <Text>{reservation?.contact?.phonePrefix}</Text>
                <Text style={styles.userInfoPhoneTxt}>
                  {reservation?.contact?.phoneNumber}
                </Text>
              </View>
              <Text style={styles.dateTxt}>
                {new Date(reservation.dateTimeOfReservation)
                  .toLocaleString()
                  .replace(/(.*)\D\d+/, '$1')}
              </Text>
              <Text>
                {reservation?.numberOfPeople}{' '}
                {TRANSLATIONS['reservation-people']}
              </Text>
            </View>
            <View style={styles.reservationStatusContainer}>
              <View style={styles.statusCombobox}>
                <Text>{TRANSLATIONS[reservation?.status]}</Text>
              </View>
              {isAtLeastOwner && (
                <View style={styles.checkBoxContainer}>
                  <CheckBox
                    style={styles.checkBox}
                    disabled={true}
                    value={reservation?.callBack}
                  />
                  <Text>{TRANSLATIONS['reservation-callback']}</Text>
                </View>
              )}
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
    fontWeight: '600',
    marginRight: 5,
  },
  userInfoPhoneTxt: {
    marginLeft: 2,
  },
  dateTxt: {
    padding: 0,
    marginBottom: 5,
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
  btnContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  btn: {
    backgroundColor: 'pink',
    padding: 10,
    borderRadius: 6,
    borderColor: 'black',
    borderWidth: 1,
  },
  btnTxt: {fontSize: 16},
});

export default ReservationManagerDetail;
