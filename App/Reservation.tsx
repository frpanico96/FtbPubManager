import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import UTILS from '../utilities/utils';

type ContactInfo = {
  phoneNumber: String;
  phonePrefix: String;
  username: String;
};

type ReservationPropObj = {
  contactInfo: ContactInfo;
  numberOfPeople: Number;
  dateTimeOfReservation: Date;
};

type ReservationPropForm = {
  formObj: ReservationPropObj;
  onSave: Function;
};

type ReservationProp = {
  reservationForm: ReservationPropObj;
  pubId: String;
};

const Reservation: React.FC<ReservationProp> = ({reservationForm, pubId}) => {
  const handleSave = (reservationFormObj: ReservationPropObj) => {
    console.log(reservationFormObj);
    console.log(pubId);
  };

  return (
    <>
      <View style={styles.fakeRow} />
      <ReservationForm formObj={reservationForm} onSave={handleSave} />
      <View style={styles.fakeRow} />
    </>
  );
};

const ReservationForm: React.FC<ReservationPropForm> = ({formObj, onSave}) => {
  const [chosenDate, setChosenDate] = useState(
    formObj?.dateTimeOfReservation ? formObj.dateTimeOfReservation : new Date(),
  );
  const [numberOfPeopleInput, setNumberOfPeopleInput] = useState(
    formObj?.numberOfPeople?.toString(),
  );
  const [phoneNumber, setPhoneNumber] = useState(
    formObj?.contactInfo?.phoneNumber,
  );
  /* Phone Prefix DropDown State */
  const [open, setOpen] = useState(false);
  const [prefix, setPrefix] = useState(formObj?.contactInfo?.phonePrefix);
  const [prefixItems, setPrefixItems] = useState(
    UTILS.reservation['prefix-options'],
  );

  const handleSave = () => {
    const saveObj: ReservationPropObj = {
      contactInfo: {
        phoneNumber: phoneNumber,
        phonePrefix: prefix,
        username: '',
      },
      numberOfPeople: parseInt(numberOfPeopleInput, 10),
      dateTimeOfReservation: chosenDate,
    };
    onSave(saveObj);
  };

  return (
    <View style={styles.card}>
      <View style={styles.contactInfoContainer}>
        <View style={styles.comboboxPrefix}>
          <DropDownPicker
            open={open}
            value={prefix}
            items={prefixItems}
            setOpen={setOpen}
            setValue={setPrefix}
            setItems={setPrefixItems}
            placeholder=""
          />
        </View>
        <TextInput
          style={styles.inputTxtPhone}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholder="Insert Phone Number"
        />
      </View>
      <DatePicker
        date={chosenDate}
        onDateChange={setChosenDate}
        minimumDate={new Date()}
        minuteInterval={15}
      />
      <TextInput
        style={styles.inputTxt}
        value={numberOfPeopleInput}
        onChangeText={setNumberOfPeopleInput}
        placeholder="Number Of People"
      />
      <View style={styles.btnContainer}>
        <TouchableOpacity style={styles.btn} onPress={handleSave}>
          <Text style={styles.btnText}>Book</Text>
        </TouchableOpacity>
      </View>
    </View>
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
    flex: 3,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  cardHeader: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  inputTxt: {
    borderStyle: 'solid',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    width: '100%',
    height: '13%',
  },
  contactInfoContainer: {
    flexDirection: 'row',
    width: '100%',
    zIndex: 1000,
  },
  inputTxtPhone: {
    flex: 2,
    borderStyle: 'solid',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  comboboxPrefix: {
    flex: 1,
  },
  checkBoxesContainer: {
    justifyContent: 'center',
  },
  checkBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 3,
  },
  checkBox: {
    alignSelf: 'center',
    marginRight: 10,
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

export default Reservation;
