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
import UTILS from '../NodeApp/utilities/utils';
import TRANSLATIONS from '../NodeApp/translations/tranlastions';

type ContactInfo = {
  phoneNumber: String;
  phonePrefix: String;
  username: String;
  isGuest: Boolean;
};

// type DateObj = {
//   dateStr: String;
//   year: String;
//   month: String;
//   day: String;
//   hour: String;
//   minute: String;
// };

type ReservationPropObj = {
  contactInfo: ContactInfo;
  numberOfPeople: Number;
  dateTimeOfReservation: String;
};

type ReservationPropForm = {
  formObj: ReservationPropObj;
  pub: Object;
  onSave: Function;
};

type ValidationObj = {
  success: Boolean;
  message: String;
};

type ReservationProp = {
  reservationForm: ReservationPropObj;
  pub: Object;
  username: String;
  reservationId: String;
  isAtLeastOwner: Boolean;
  onBookSaved: Function;
};

const Reservation: React.FC<ReservationProp> = ({
  reservationForm,
  pub,
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
      dateTimeOfReservation: formToSubmit.dateTimeOfReservation,
      pubId: pub._id,
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
          text1: TRANSLATIONS[jsonRes.message],
          text2: jsonRes.error
            ? TRANSLATIONS[jsonRes.error]
              ? TRANSLATIONS[jsonRes.error]
              : jsonRes.error
            : TRANSLATIONS['reservation-booked-sucessfully'],
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
      <ReservationForm
        formObj={reservationForm}
        pub={pub}
        onSave={handleSave}
      />
      <View style={styles.fakeRow} />
    </>
  );
};

const ReservationForm: React.FC<ReservationPropForm> = ({
  formObj,
  pub,
  onSave,
}) => {
  //console.log('form', formObj);
  const [chosenDate, setChosenDate] = useState(
    formObj?.dateTimeOfReservation
      ? new Date(formObj.dateTimeOfReservation)
      : calculateMinumDate(pub),
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

  const minimumDate = formObj?.dateTimeOfReservation
    ? new Date(formObj.dateTimeOfReservation)
    : calculateMinumDate(pub);

  const isUpdate = formObj?.dateTimeOfReservation != null;

  const handleSave = () => {
    // const dateObj: DateObj = {
    //   dateStr: chosenDate.toISOString(),
    //   year: chosenDate.getFullYear().toString(),
    //   month: chosenDate.getMonth().toString(),
    //   day: chosenDate.getDate().toString(),
    //   hour: chosenDate.getHours().toString(),
    //   minute: chosenDate.getMinutes().toString(),
    // };
    const saveObj: ReservationPropObj = {
      contactInfo: {
        phoneNumber: phoneNumber,
        phonePrefix: prefix,
        username: '',
      },
      numberOfPeople: parseInt(numberOfPeopleInput, 10),
      dateTimeOfReservation: chosenDate.toISOString(),
    };
    const validation = reservationValidation(pub, saveObj, isUpdate);
    console.log('Validation', validation);
    if (!validation.success) {
      Toast.show({
        type: 'error',
        text1: TRANSLATIONS['generic-error'],
        text2: validation.message,
        position: 'bottom',
      });
      return;
    }
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
          placeholder={TRANSLATIONS['reservation-phone-placeholder']}
        />
      </View>
      <DatePicker
        date={chosenDate}
        onDateChange={setChosenDate}
        minimumDate={minimumDate}
        minuteInterval={15}
        textColor={UTILS.datePickerColor}
        mode={isUpdate ? 'time' : 'datetime'}
      />
      <TextInput
        style={styles.inputTxt}
        value={numberOfPeopleInput}
        onChangeText={setNumberOfPeopleInput}
        placeholder={TRANSLATIONS['reservation-numberofpeople-placeholder']}
      />
      <View style={styles.btnContainer}>
        <TouchableOpacity style={styles.btn} onPress={handleSave}>
          <Text style={styles.btnText}>{TRANSLATIONS['reservation-book-btn']}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

function calculateMinumDate(pub: Object): Date {
  const HOUR_CONVERSION = 60 * 60 * 1000;

  const inputDate = new Date();

  console.log('### Calculating Minimum Date');
  console.log(pub.openTime);
  console.log(pub.closeTime);
  console.log(pub.daysClosed);
  if (pub.openTime == null || pub.closeTime == null || pub.daysClosed == null) {
    console.log('### Exiting for null inputs');
    return inputDate;
  }

  // calculate Open/Close DateTime
  const openCloseTime = {
    openHours: parseInt(pub.openTime / 100, 10),
    openMins: parseInt(pub.openTime % 100, 10),
    closeHours: parseInt(pub.closeTime / 100, 10),
    closeMins: parseInt(pub.closeTime % 100, 10),
  };
  console.log('OpenCloseObj', openCloseTime);
  const openTime = new Date();
  openTime.setHours(openCloseTime.openHours, openCloseTime.openMins, 0, 0);
  const closeTime = new Date();

  if (openCloseTime.openHours > openCloseTime.closeHours) {
    closeTime.setDate(closeTime.getDate() + 1);
  }
  closeTime.setHours(openCloseTime.closeHours, openCloseTime.closeMins, 0, 0);

  console.log('OpenTime', openTime);
  console.log('CloseTime', closeTime);

  console.log('Start', inputDate);
  inputDate.setTime(
    inputDate.getTime() + pub.reservationDelay * HOUR_CONVERSION,
  );

  console.log(inputDate > closeTime);

  if (inputDate < openTime) {
    inputDate.setDate(openTime.getDate() + 1);
    inputDate.setHours(openCloseTime.openHours, openCloseTime.openMins, 0, 0);
  }

  if (inputDate > closeTime) {
    inputDate.setDate(inputDate.getDate() + 1);
    inputDate.setHours(openCloseTime.openHours, openCloseTime.openMins, 0, 0);
  }

  console.log(inputDate.getDay());

  const vacationStart = new Date(pub.vacationStart);
  const vacationEnd = new Date(pub.vacationEnd);

  let minDateChecks = false;
  //let count = 0;
  do {
    // count++
    // if(count === 4) minDateChecks = true;
    console.log('### Cycle Start ###');
    console.log('isClosingDay', isClosingDay(inputDate, pub.daysClosed));
    console.log(
      'isVacationDay',
      isVacation(inputDate, vacationStart, vacationEnd),
    );
    if (isClosingDay(inputDate, pub.daysClosed)) {
      const firstNonClosingDay = pub.daysClosed[pub.daysClosed.length - 1] + 1;
      // console.log('Cycle', count, firstNonClosingDay);
      inputDate.setDate(
        inputDate.getDate() + (firstNonClosingDay - inputDate.getDay()),
      );
      continue;
    }
    if (isVacation(inputDate, vacationStart, vacationEnd)) {
      // console.log('Cycle', count);
      inputDate.setDate(vacationEnd.getDate());
      inputDate.setHours(openCloseTime.openHours, openCloseTime.openMins, 0, 0);
      continue;
    }
    // count++;
    // console.log('Cycle', count);
    minDateChecks = true;
  } while (!minDateChecks);

  // if(pub.daysClosed.indexOf(inputDate.getDay()) > -1)
  // {
  //   const firstNonClosingDay = pub.daysClosed[pub.daysClosed.length - 1] + 1;
  //   console.log(firstNonClosingDay);
  //   inputDate.setDate(inputDate.getDate() + (firstNonClosingDay - inputDate.getDay()))
  // }

  console.log('End', inputDate);

  return inputDate;
}

/* TBD to move checks on client or leave some on server */
function reservationValidation(
  pub: Object,
  formObject: ReservationPropObj,
  isUpdate: Boolean,
): ValidationObj {
  let result: ValidationObj = {
    success: true,
    message: '',
  };

  console.log(formObject.dateTimeOfReservation);

  result = isPastDate(new Date(formObject.dateTimeOfReservation), isUpdate);

  if (result.success) {
    result = validatePhoneNumber(
      formObject.contactInfo.phoneNumber,
      formObject.contactInfo.phonePrefix,
      pub?.phoneNumberRequired,
    );
    if (result.success) {
      result = reservationDateValidation(
        pub,
        new Date(formObject.dateTimeOfReservation),
      );
      if (result.success) {
        result = numberOfPeopleValidation(formObject.numberOfPeople);
      }
    }
  }

  return result;
}

function isPastDate(
  dateTimeOfReservation: Date,
  isUpdate: Boolean,
): ValidationObj {
  console.log(dateTimeOfReservation);
  const limitReservation = new Date();
  const result: ValidationObj = {
    success: true,
    message: '',
  };
  if (dateTimeOfReservation < limitReservation && !isUpdate) {
    result.success = false;
    result.message = TRANSLATIONS['reservation-validation-past-date'];
  }
  return result;
}

function validatePhoneNumber(
  phoneNumber: String,
  phonePrefix: String,
  phoneNumberRequired: Boolean,
): ValidationObj {
  const result: ValidationObj = {
    success: true,
    message: '',
  };
  if (!phoneNumberRequired) {
    return result;
  }
  const regex = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
  if (!regex.test(phoneNumber)) {
    result.success = false;
    result.message = TRANSLATIONS['invalid-phone-number'];
  } else if (!phonePrefix) {
    result.success = false;
    result.message = TRANSLATIONS['invalid-phone-prefix'];
  }
  return result;
}

function numberOfPeopleValidation(numberOfPeople: Number): ValidationObj {
  const result: ValidationObj = {
    success: true,
    message: '',
  };
  if (!Number.isInteger(numberOfPeople) || numberOfPeople < 0) {
    result.success = false;
    result.message = TRANSLATIONS['reservation-validation-number-of-people'];
  }
  return result;
}

function reservationDateValidation(
  pub: Object,
  dateTimeOfReservation: Date,
): ValidationObj {
  const result: ValidationObj = {
    success: true,
    message: '',
  };

  const openCloseTime = {
    openHours: parseInt(pub.openTime / 100, 10),
    openMins: parseInt(pub.openTime % 100, 10),
    closeHours: parseInt(pub.closeTime / 100, 10),
    closeMins: parseInt(pub.closeTime % 100, 10),
  };

  console.log(dateTimeOfReservation);

  const openTime = new Date();
  openTime.setFullYear(
    dateTimeOfReservation.getFullYear(),
    dateTimeOfReservation.getMonth(),
    dateTimeOfReservation.getDate(),
  );
  openTime.setHours(openCloseTime.openHours, openCloseTime.openMins, 0, 0);
  const closeTime = new Date();
  closeTime.setFullYear(
    dateTimeOfReservation.getFullYear(),
    dateTimeOfReservation.getMonth(),
    dateTimeOfReservation.getDate(),
  );
  if (openCloseTime.openHours > openCloseTime.closeHours) {
    closeTime.setDate(closeTime.getDate() + 1);
  }
  closeTime.setHours(openCloseTime.closeHours, openCloseTime.closeMins, 0, 0);

  const vacationStart = new Date(pub.vacationStart);
  const vacationEnd = new Date(pub.vacationEnd);

  console.log('Open', openTime);
  console.log('Close', closeTime);
  console.log('DaysClosed', pub.daysClosed);
  console.log('VacationStart', pub.vacationStart);
  console.log('VacationEnd', pub.vacationEnd);
  console.log('Day of  reservation', dateTimeOfReservation.getDay());
  if (dateTimeOfReservation < openTime) {
    console.log('Open Time Check');
    result.success = false;
    result.message = TRANSLATIONS['reservation-validation-pub-opens-at']+ ' ' + openTime.toLocaleString();
  } else if (dateTimeOfReservation > closeTime) {
    console.log('Close Time Check');
    result.success = false;
    result.message = TRANSLATIONS['reservation-validation-pub-closes-at'] + ' ' + closeTime.toLocaleString();
  } else if (pub.daysClosed.indexOf(dateTimeOfReservation.getDay()) > -1) {
    console.log('Days closed Check');
    result.success = false;
    result.message = TRANSLATIONS['reservation-validation-pub-closed'];
  } else if (
    dateTimeOfReservation >= vacationStart &&
    dateTimeOfReservation < vacationEnd
  ) {
    console.log('Vacation Check');
    result.success = false;
    result.message =
      TRANSLATIONS['reservation-validation-pub-vacation'] + ' ' +
      vacationEnd.toLocaleDateString();
  }

  return result;
}

function isClosingDay(inputDate: Date, closingDays: Number[]) {
  return closingDays.indexOf(inputDate.getDay()) > -1;
}

function isVacation(inputDate: Date, vacationStart: Date, vacationEnd: Date) {
  return inputDate >= vacationStart && inputDate < vacationEnd;
}

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
