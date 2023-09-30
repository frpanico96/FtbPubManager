import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import Toast from 'react-native-toast-message';

type VacationDataProps = {
  vacationStartDate: Date;
  vacationEndDate: Date;
  vacationReason: String;
  onSave: Function;
};

const VacationData = (props: VacationDataProps) => {
  console.log('### Vacation Data');
  console.log(props);

  const [vacation, setVacation] = useState({
    vacationStart: props.vacationStartDate
      ? new Date(props.vacationStartDate)
      : new Date(),
    vacationEnd: props.vacationEndDate ? new Date(props.vacationEndDate) : new Date(),
    vacationReason: props?.vacationReason,
  });

  const handleSave = () => {
    if (vacation.vacationStart > vacation.vacationEnd) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Vacation Start can not happen after Vacation End',
        position: 'bottom',
      });
      return;
    }
    if (!vacation.vacationReason.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Populate Vacation Reason',
        position: 'bottom',
      });
      return;
    }
    const body = {
      vacationStart: vacation.vacationStart,
      vacationEnd: vacation.vacationEnd,
      vacationReason: vacation.vacationReason,
    };

    props.onSave(body);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.headerTxt}>
        Attention! Any changes will not be applied to existing reservation.
      </Text>
      <View style={styles.container}>
        <View style={styles.dateContainer}>
          <Text style={styles.dateTxt}>Vacation Start</Text>
          <DatePicker
            mode="date"
            date={vacation.vacationStart}
            onDateChange={newDate => {
              setVacation(prev => {
                const newState = {...prev};
                newState.vacationStart = newDate;
                return newState;
              });
            }}
          />
        </View>
        <View style={styles.dateContainer}>
          <Text style={styles.dateTxt}>Vacation End</Text>
          <DatePicker
            mode="date"
            date={vacation.vacationEnd}
            onDateChange={newDate => {
              setVacation(prev => {
                const newState = {...prev};
                newState.vacationEnd = newDate;
                return newState;
              });
            }}
          />
        </View>
        <View>
          <TextInput
            style={styles.txtInput}
            value={vacation.vacationReason}
            placeholder='Vacation Reason'
            onChangeText={newText => {
              setVacation(prev => {
                const newState = {...prev};
                newState.vacationReason = newText;
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
    justifyContent: 'space-evenly',
  },
  dateTxt: {
    fontWeight: '600',
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

export default VacationData;
