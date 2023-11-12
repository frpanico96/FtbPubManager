/**@frpanico
 * Contact Us - Contact Component
 */
import React, {useState} from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import DropDownPicker from 'react-native-dropdown-picker';
import UTILS from '../../../utilities/utils';
import Toast from 'react-native-toast-message';
import TRANSLATIONS from '../../../translations/tranlastions';

type ContactDataProps = {
  phoneNumber: String;
  phonePrefix: String;
  email: String;
  onSave: Function;
};

const ContactData = (props: ContactDataProps) => {
  const [open, setOpen] = useState(false);
  const [phonePrefix, setPhonePrefix] = useState(props?.phonePrefix);
  const [prefixItems, setPrefixItems] = useState(
    UTILS.reservation['prefix-options'],
  );
  const [phoneNumber, setPhoneNumber] = useState(props?.phoneNumber);
  const [email, setEmail] = useState(props?.email);

  const handleSave: Object = () => {
    console.log(phoneNumber);
    console.log(phonePrefix);

    const regex = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
    if (!regex.test(phoneNumber)) {
      Toast.show({
        type: 'error',
        text1: TRANSLATIONS['generic-error'],
        text2: TRANSLATIONS['invalid-phone-number'],
        position: 'bottom',
      });
      return;
    } else if (!phonePrefix) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: TRANSLATIONS['invalid-phone-prefix'],
        position: 'bottom',
      });
      return;
    } else if (!email) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: TRANSLATIONS['invalid-email'],
        position: 'bottom',
      });
      return;
    }

    const obj = {phoneNumber, phonePrefix, email};
    props.onSave(obj);
  };

  return (
    <View style={styles.card}>
      <View style={styles.flexRow}>
        <View style={styles.comboboxPrefix}>
          <DropDownPicker
            open={open}
            value={phonePrefix}
            items={prefixItems}
            setOpen={setOpen}
            setValue={setPhonePrefix}
            setItems={setPrefixItems}
            placeholder=""
          />
        </View>
        <TextInput
          style={[styles.txtInput, styles.phoneInput]}
          placeholder={TRANSLATIONS['reservation-phone-placeholder']}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />
      </View>
      <View style={styles.emailContainer}>
        <TextInput
          style={[styles.txtInput]}
          placeholder={TRANSLATIONS['contact-us-email-placeholder']}
          value={email}
          onChangeText={setEmail}
        />
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
    flex: 3,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    padding: 10,
    width: '100%',
  },
  flexRow: {
    flexDirection: 'row',
    width: '100%',
    zIndex: 1000,
  },
  emailContainer: {
    flex: 1,
    width: '100%',
    marginTop: 10,
  },
  comboboxPrefix: {
    flex: 1,
  },
  phoneInput: {
    flex: 2,
  },
  txtInput: {
    backgroundColor: 'white',
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 6,
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
});

export default ContactData;
