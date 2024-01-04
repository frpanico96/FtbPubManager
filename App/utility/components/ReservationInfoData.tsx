/**@frpanico
 * Contact Us - Reservation Info Component
 */
import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import SelectMultiple from 'react-native-select-multiple';

import UTILS from '../../../NodeApp/utilities/utils';
import CheckBox from '@react-native-community/checkbox';
import Toast from 'react-native-toast-message';
import TRANSLATIONS from '../../../NodeApp/translations/tranlastions';

type ReservationInfoDataProps = {
  reservationDelay: Number;
  showOwner: Boolean;
  phoneNumberRequired: Boolean;
  daysClosed: Array<Number>;
  onSave: Function;
};

const ReservationInfoData = (props: ReservationInfoDataProps) => {
  console.log('### Reservation Info');
  console.log(props);

  const daysClosedArr = props.daysClosed.map(day => {
    return {label: UTILS.dayOfWeek[day], value: day};
  });

  const label = () => {
    return <Text style={styles.txtLabel}>Days Closed</Text>;
  };

  const [reservationInfo, setReservationInfo] = useState({
    reservationDelay: props?.reservationDelay?.toString(),
    showOwner: props.showOwner,
    phoneNumberRequired: props.phoneNumberRequired,
  });

  //console.log(daysClosedArr);

  const [daysClosed, setDaysClosed] = useState(daysClosedArr);
  // const [reservationDelay, setReservationDelay] = useState(
  //   props.reservationDelay.toString(),
  // );
  // const [showOwner, setShowOwner] = useState(props.showOwner);
  // const checkBoxGroup = UTILS.dayOfWeekOptions.map(el => {
  //   return (
  //     <Checkbox key={el.value} value={el.value.toString()}>
  //       {el.label}
  //     </Checkbox>
  //   );
  // });

  const handleSave = () => {
    console.log(daysClosed);
    console.log(reservationInfo);

    const reservationDelay = parseInt(reservationInfo.reservationDelay, 10);

    if (!Number.isInteger(reservationDelay) || reservationDelay < 0) {
      Toast.show({
        type: 'error',
        text1: TRANSLATIONS['generic-error'],
        text2: TRANSLATIONS['contact-us-invalid-delay'],
        position: 'bottom',
      });
      return;
    }
    const daysClosedBodyNotSorted = daysClosed.map(el => el.value);
    const daysClosedBody = daysClosedBodyNotSorted.sort((a, b) => a - b);

    console.log(daysClosedBody);

    const body = {
      reservationDelay,
      showOwner: reservationInfo.showOwner,
      daysClosed: daysClosedBody,
      phoneNumberRequired: reservationInfo.phoneNumberRequired,
    };
    props.onSave(body);
  };

  return (
    <View style={[styles.container, styles.card]}>
      <View style={styles.container}>
        <Text style={styles.txtLabel}>
          {TRANSLATIONS['contact-us-delay-placeholder']}
        </Text>
        <TextInput
          style={styles.txtInput}
          placeholder="Reservation Delay"
          value={reservationInfo.reservationDelay}
          onChangeText={newText => {
            setReservationInfo(prev => {
              const newState = {...prev};
              newState.reservationDelay = newText;
              return newState;
            });
          }}
        />
      </View>
      <View style={styles.groupContainer}>
        <Text style={styles.txtLabel}>
          {TRANSLATIONS['contact-us-days-closed-label']}
        </Text>
        <SelectMultiple
          items={UTILS.dayOfWeekOptions}
          selectedItems={daysClosed}
          onSelectionsChange={setDaysClosed}
          labelStyle={styles.checkBoxLabel}
        />
        {/* <NativeBaseProvider>
          <Box alignItems="center">
            <VStack space={2}>
              <HStack alignItems="baseline">
                <Heading fontSize="lg">Days Closed</Heading>
              </HStack>
              <Checkbox.Group value={daysClosed} onChange={setDaysClosed}>
                {checkBoxGroup}
              </Checkbox.Group>
            </VStack>
          </Box>
        </NativeBaseProvider> */}
      </View>
      <View style={styles.container}>
        <View style={styles.checkBoxContainer}>
          <CheckBox
            style={styles.checkBox}
            value={reservationInfo.showOwner}
            onValueChange={newValue => {
              setReservationInfo(prev => {
                const newState = {...prev};
                newState.showOwner = newValue;
                return newState;
              });
            }}
          />
          <Text>{TRANSLATIONS['contact-us-show-owner-label']}</Text>
        </View>
        <View style={styles.checkBoxContainer}>
          <CheckBox
            style={styles.checkBox}
            value={reservationInfo.phoneNumberRequired}
            onValueChange={newValue => {
              setReservationInfo(prev => {
                const newState = {...prev};
                newState.phoneNumberRequired = newValue;
                return newState;
              });
            }}
          />
          <Text>{TRANSLATIONS['contact-us-phone-required-label']}</Text>
        </View>
        {/* <NativeBaseProvider>
          <Box alignItems="center">
            <VStack space={2}>
              <Checkbox value={showOwner} onChange={setShowOwner}>Show Owner</Checkbox>
            </VStack>
          </Box>
        </NativeBaseProvider> */}
      </View>
      <View style={styles.btnContainer}>
        <TouchableOpacity style={styles.btn} onPress={handleSave}>
          <Text style={styles.btnTxt}>{TRANSLATIONS['generic-save']}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    width: '100%',
  },
  groupContainer: {
    flex: 2,
    width: '100%',
    marginBottom: 10,
  },
  row: {
    flex: 1,
  },
  txtLabel: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  txtInput: {
    backgroundColor: 'white',
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 6,
    width: '100%',
  },
  checkBoxLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
  btnContainer: {
    flex: 1,
    width: '100%',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn: {
    width: '80%',
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderStyle: 'solid',
    backgroundColor: 'pink',
    alignItems: 'center',
  },
  btnTxt: {
    fontSize: 18,
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
});

export default ReservationInfoData;
