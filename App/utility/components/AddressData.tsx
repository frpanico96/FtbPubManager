/**@frpanico
 * Contact Us - Address Component
 */
import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import TRANSLATIONS from '../../../translations/tranlastions';

type AddressDataProps = {
  address: String;
  onSave: Function;
};

const AddressData = (props: AddressDataProps) => {
  const [address, setAddress] = useState(props.address);

  const handleSave = () => {
    const body = {address};
    props.onSave(body);
  };

  return (
    <View style={styles.card}>
      <TextInput
        style={styles.txtInput}
        value={address}
        onChangeText={setAddress}
        placeholder={TRANSLATIONS['contact-us-address-placeholder']}
      />
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
    justifyContent: 'space-between',
    padding: 10,
    width: '100%',
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

export default AddressData;
