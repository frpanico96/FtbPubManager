import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import DatePicker from 'react-native-date-picker';

type OpenCloseDataProps = {
  openTime: Number;
  closeTime: Number;
  onSave: Function;
};

const OpenCloseData = (props: OpenCloseDataProps) => {
  const openDate = new Date();
  const closedDate = new Date();

  if (props.openTime) {
    const hours = parseInt(props.openTime / 100, 10);
    const mins = parseInt(props.openTime % 100, 10);
    openDate.setHours(hours, mins, 0);
  }

  if (props.closeTime) {
    const hours = parseInt(props.closeTime / 100, 10);
    const mins = parseInt(props.closeTime % 100, 10);
    closedDate.setHours(hours, mins, 0);
  }

  const [openCloseData, setOpenCloseData] = useState({
    openTime: openDate,
    closeTime: closedDate,
  });

  const handleSave = () => {
    const openHours = openCloseData.openTime.getHours();
    const openMins =
      openCloseData.openTime.getMinutes() === 0
        ? openCloseData.openTime.getMinutes() + '0'
        : openCloseData.openTime.getMinutes();
    const closeHours = openCloseData.closeTime.getHours();
    const closeMins =
      openCloseData.closeTime.getMinutes() === 0
        ? openCloseData.closeTime.getMinutes() + '0'
        : openCloseData.closeTime.getMinutes();

    const openTime = parseInt(openHours + '' + openMins, 10);
    const closeTime = parseInt(closeHours + '' + closeMins, 10);

    const body = {openTime, closeTime};

    props.onSave(body);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.headerTxt}>
        Attention! Any changes Open/Close information will not be applied to
        existing reservation.
      </Text>
      {/* <View style={styles.headerContainer}>

      </View> */}
      <View style={styles.container}>
        <View style={styles.dateContainer}>
          <Text>Open Time</Text>
          <DatePicker
            mode="time"
            date={openCloseData.openTime}
            onDateChange={newDate => {
              setOpenCloseData(prev => {
                const newState = {...prev};
                newState.openTime = newDate;
                return newState;
              });
            }}
          />
        </View>
        <View style={styles.dateContainer}>
          <Text>Close Time</Text>
          <DatePicker
            mode="time"
            date={openCloseData.closeTime}
            onDateChange={newDate => {
              setOpenCloseData(prev => {
                const newState = {...prev};
                newState.closeTime = newDate;
                return newState;
              });
            }}
          />
        </View>
      </View>
      <View style={styles.btnContainer}>
        <TouchableOpacity style={styles.btn} onPress={handleSave}>
          <Text style={styles.btnTxt}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    width: '100%',
  },
  headerContainer: {
    flex: 1,
  },
  container: {
    flex: 3,
    marginTop: 10,
  },
  headerTxt: {
    fontSize: 8,
    fontWeight: '800',
    marginBottom: 10,
    marginTop: 0,
  },
  dateContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  selectMultiple: {
    flex: 1,
  },
  txtInput: {
    width: '100%',
    backgroundColor: 'white',
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 6,
  },
  btnContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn: {
    width: '80%',
    padding: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderStyle: 'solid',
    backgroundColor: 'pink',
    alignItems: 'center',
  },
  btnTxt: {
    fontSize: 18,
  },
});

export default OpenCloseData;
