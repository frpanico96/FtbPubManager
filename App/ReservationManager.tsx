import React, {useEffect, useState} from 'react';
import {StyleSheet, View, TouchableOpacity, Text} from 'react-native';
import DatePicker from 'react-native-date-picker';
import LoadingSpinner from './utility/LoadingSpinner';

type ReservationManagerProp = {
  isAtLeastOwner: Boolean;
  onSearchReservation: Function;
};

type ReservationManagerDatePickerProp = {
  onChooseDate: Function;
};

const ReservationManager: React.FC<ReservationManagerProp> = ({
  isAtLeastOwner,
  onSearchReservation,
}) => {
  useEffect(() => {
    if (!isAtLeastOwner) {
      setTimeout(() => {
        onSearchReservation(undefined);
      }, 1500);
    }
  }, [isAtLeastOwner, onSearchReservation]);

  return (
    <>
      {!isAtLeastOwner ? (
        <LoadingSpinner size="large" color="pink" />
      ) : (
        <ReservationManagerDatePicker
          onChooseDate={(date: Date) => onSearchReservation(date)}
        />
      )}
    </>
  );
};

const ReservationManagerDatePicker: React.FC<
  ReservationManagerDatePickerProp
> = ({onChooseDate}) => {
  const [date, setDate] = useState(new Date());

  const handlePressSearch = () => {
    onChooseDate(date);
  };

  return (
    <>
      <View style={styles.fakeRow} />
      <View style={styles.card}>
        <DatePicker
          mode="date"
          is24hourSource="device"
          date={date}
          onDateChange={setDate}
        />
        <View style={styles.btnContainer}>
          <TouchableOpacity style={styles.btn} onPress={handlePressSearch}>
            <Text style={styles.btnText}>Search</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.fakeRow} />
    </>
  );
};

const styles = StyleSheet.create({
  fakeRow: {flex: 1},
  card: {
    width: 300,
    height: 300,
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#FFFFFF',
    flex: 2,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  btnContainer: {
    marginTop: 10,
    width: '80%',
  },
  btn: {
    backgroundColor: 'pink',
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 6,
    padding: 5,
  },
  btnText: {
    fontSize: 18,
    textAlign: 'center',
  },
});
export default ReservationManager;
