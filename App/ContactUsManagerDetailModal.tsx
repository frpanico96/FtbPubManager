import React, {useState} from 'react';
import {
  View,
  Modal,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import DropDownPicker from 'react-native-dropdown-picker';

import UTILS from '../utilities/utils';

type ContactUsManagerDetailModalProps = {
  toggleModal: Boolean;
  actionName: String;
  pub: Object;
  onConfirmAction: Function;
  onToggleModal: Function;
};

type ContactDataProps = {
  phoneNumber: String;
  phonePrefix: String;
};

const ContactUsManagerDetailModal = (
  props: ContactUsManagerDetailModalProps,
) => {

  console.log('### Modal', props.pub);

  const component =
    props.actionName === UTILS.contactUsManager['contact-data-name'] ? (
      <ContactData
        phoneNumber={props.pub?.phone}
        phonePrefix={props.pub?.phonePrefix}
      />
    ) : (
      <Text>No Action Available</Text>
    );

  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={props.toggleModal}
        onRequestClose={() => props.onToggleModal(!props.toggleModal)}>
        <View style={styles.modalBodyContainer}>
          <View style={styles.modalView}>
            {component}
            <View style={{flex: 1}}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  props.onToggleModal(!props.toggleModal);
                }}>
                <Text>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const ContactData = (props: ContactDataProps) => {
  const [open, setOpen] = useState(false);
  const [prefix, setPrefix] = useState(props?.phonePrefix);
  const [prefixItems, setPrefixItems] = useState(
    UTILS.reservation['prefix-options'],
  );
  const [phoneNumber, setPhoneNumber] = useState(props?.phoneNumber);

  const handleSave = () => {
    console.log(phoneNumber);
    console.log(prefix);
  }

  return (
    <View style={styles.card}>
      <View style={styles.flexRow}>
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
          style={[styles.txtInput, styles.phoneInput]}
          placeholder="Enter phone number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />
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
  modalBodyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  modalView: {
    width: '100%',
    flex: 1,
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: 'pink',
  },
  card: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: 'pink',
    padding: 10,
    width: '100%',
  },
  flexRow: {
    flexDirection: 'row',
    width: '100%',
    zIndex: 1000,
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

export default ContactUsManagerDetailModal;
