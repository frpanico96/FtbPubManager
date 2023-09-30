import React from 'react';
import {View, Modal, Text, TouchableOpacity, StyleSheet} from 'react-native';

import ContactData from './utility/components/ContactData';

import UTILS from '../utilities/utils';
import Toast from 'react-native-toast-message';
import AddressData from './utility/components/AddressData';
import OpenCloseData from './utility/components/OpenCloseData';
import VacationData from './utility/components/VacationData';

type ContactUsManagerDetailModalProps = {
  toggleModal: Boolean;
  actionName: String;
  pub: Object;
  onConfirmAction: Function;
  onToggleModal: Function;
};

const ContactUsManagerDetailModal = (
  props: ContactUsManagerDetailModalProps,
) => {
  console.log('### Modal', props.pub);

  const handleConfirm = (body: Object) => {
    console.log('### Contact Modal');
    props.onConfirmAction(body);
  };

  const component =
    props.actionName === UTILS.contactUsManager['contact-data-name'] ? (
      <ContactData
        phoneNumber={props.pub?.phone}
        phonePrefix={props.pub?.phonePrefix}
        onSave={handleConfirm}
      />
    ) : props.actionName === UTILS.contactUsManager['address-name'] ? (
      <AddressData address={props.pub?.address} onSave={handleConfirm} />
    ) : props.actionName === UTILS.contactUsManager['opening-closing-name'] ? (
      <OpenCloseData
        openTime={props.pub?.openTime}
        closeTime={props.pub?.closeTime}
        onSave={handleConfirm}
      />
    ) : props.actionName === UTILS.contactUsManager['vacation-name'] ? (
      <VacationData vacationStartDate={props.pub?.vacationStart} vacationEndDate={props.pub?.vacationEnd} 
      vacationReason={props.pub?.vacationReason} onSave={handleConfirm}/>
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
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                props.onToggleModal(!props.toggleModal);
              }}>
              <Text>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Toast />
      </Modal>
    </>
  );
};

// const ContactData = (props: ContactDataProps) => {
//   const [open, setOpen] = useState(false);
//   const [prefix, setPrefix] = useState(props?.phonePrefix);
//   const [prefixItems, setPrefixItems] = useState(
//     UTILS.reservation['prefix-options'],
//   );
//   const [phoneNumber, setPhoneNumber] = useState(props?.phoneNumber);

//   const handleSave = () => {
//     console.log(phoneNumber);
//     console.log(prefix);
//   }

//   return (
//     <View style={styles.card}>
//       <View style={styles.flexRow}>
//         <View style={styles.comboboxPrefix}>
//           <DropDownPicker
//             open={open}
//             value={prefix}
//             items={prefixItems}
//             setOpen={setOpen}
//             setValue={setPrefix}
//             setItems={setPrefixItems}
//             placeholder=""
//           />
//         </View>
//         <TextInput
//           style={[styles.txtInput, styles.phoneInput]}
//           placeholder="Enter phone number"
//           value={phoneNumber}
//           onChangeText={setPhoneNumber}
//         />
//       </View>
//       <View style={styles.btnContainer}>
//         <TouchableOpacity style={styles.btn} onPress={handleSave}>
//           <Text style={styles.btnTxt}>Save</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

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
  flexCol: {
    flex: 1,
  },
});

export default ContactUsManagerDetailModal;
