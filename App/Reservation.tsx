/**@frpanico
 * Reservation UI Component
 * It allows to book a reservation
 */
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
import Toast from 'react-native-toast-message';
import UTILS from '../utilities/utils';

type ContactInfo = {
  phoneNumber: String;
  phonePrefix: String;
  username: String;
  isGuest: Boolean;
};

type DateObj = {
  dateStr: String;
  year: String;
  month: String;
  day: String;
  hour: String;
  minute: String;
};

type ReservationPropObj = {
  contactInfo: ContactInfo;
  numberOfPeople: Number;
  dateTimeOfReservation: DateObj;
};

type ReservationPropForm = {
  formObj: ReservationPropObj;
  onSave: Function;
};

type ReservationProp = {
  reservationForm: ReservationPropObj;
  pubId: String;
  username: String;
  reservationId: String;
  isAtLeastOwner: Boolean;
  onBookSaved: Function;
};

const Reservation: React.FC<ReservationProp> = ({
  reservationForm,
  pubId,
  username,
  reservationId,
  isAtLeastOwner,
  onBookSaved,
}) => {
  const submitForm = (formToSubmit: ReservationPropObj) => {
    console.log('#IsAtLeastOwner', isAtLeastOwner);
    const bodyObj = {
      contactInfo: formToSubmit.contactInfo,
      numberOfPeople: formToSubmit.numberOfPeople,
      date: formToSubmit.dateTimeOfReservation,
      pubId: pubId,
    };
    if (reservationId) {
      bodyObj.reservationId = reservationId;
    }
    if (isAtLeastOwner) {
      bodyObj.contactInfo.username = '';
      bodyObj.contactInfo.isGuest = true;
    }
    console.log(bodyObj);
    const apiToCall = !reservationForm
      ? '/createReservation'
      : '/updateReservation';
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
        if (!jsonRes.error) {
          onBookSaved();
        }
      });
  };

  const handleSave = (formToSubmit: ReservationPropObj) => {
    formToSubmit.contactInfo.username = username;
    submitForm(formToSubmit);
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
  //console.log('form', formObj);
  const [chosenDate, setChosenDate] = useState(
    formObj?.dateTimeOfReservation ? new Date(formObj.dateTimeOfReservation?.dateStr) : new Date(),
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

  const minimumDate = formObj?.dateTimeOfReservation ? new Date(formObj.dateTimeOfReservation?.dateStr) : new Date();

  const handleSave = () => {
    const dateObj: DateObj = {
      dateStr: chosenDate.toISOString(),
      year: chosenDate.getFullYear().toString(),
      month: chosenDate.getMonth().toString(),
      day: chosenDate.getDate().toString(),
      hour: chosenDate.getHours().toString(),
      minute: chosenDate.getMinutes().toString(),
    };

    console.log(dateObj);

    const saveObj: ReservationPropObj = {
      contactInfo: {
        phoneNumber: phoneNumber,
        phonePrefix: prefix,
        username: '',
      },
      numberOfPeople: parseInt(numberOfPeopleInput, 10),
      dateTimeOfReservation: dateObj,
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
        minimumDate={minimumDate}
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
