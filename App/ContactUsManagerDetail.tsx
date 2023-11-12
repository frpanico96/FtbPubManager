/**@frpanico
 * Contact Us - Detail Component
 */
import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

import UTILS from '../utilities/utils';
import ContactUsManagerDetailModal from './ContactUsManagerDetailModal';
import Toast from 'react-native-toast-message';
import TRANSLATIONS from '../translations/tranlastions';

type ContactUsManagerDetailsProps = {
  pub: Object;
};

const ContactUsManagerDetail = (props: ContactUsManagerDetailsProps) => {
  const [modal, setModal] = useState({
    showModal: false,
    actionName: '',
    pub: props.pub,
  });

  const onPressAction = (actionName: String) => {
    console.log(actionName);
    setModal(prev => {
      const newState = {...prev};
      newState.showModal = true;
      newState.actionName = actionName;
      return newState;
    });
  };

  const onConfirmAction = (body: Object) => {
    console.log('### Contact Detail');
    body.pubId = props.pub._id;
    console.log(body, modal.actionName);
    const apiToCall =
      modal.actionName === UTILS.contactUsManager['contact-data-name']
        ? '/updateContactInfo'
        : modal.actionName === UTILS.contactUsManager['address-name']
        ? '/updateAddressInfo'
        : modal.actionName === UTILS.contactUsManager['opening-closing-name']
        ? '/updateOpenCloseInfo'
        : modal.actionName === UTILS.contactUsManager['vacation-name']
        ? '/updateVacationInfo'
        : modal.actionName === UTILS.contactUsManager['reservation-info-name']
        ? '/updateReservationInfo'
        : 'no-api';
    fetch(UTILS.serverBasePath + apiToCall, {
      headers: {'Content-Type': 'application/json'},
      method: 'POST',
      body: JSON.stringify(body),
    })
      .then(res => res.json())
      .then(jsonRes => {
        console.log(jsonRes);
        if (jsonRes.error) {
          Toast.show({
            type: 'error',
            text1: TRANSLATIONS['generic-error'],
            text2: TRANSLATIONS[jsonRes.error] ? TRANSLATIONS[jsonRes.error] : jsonRes.error,
            position: 'bottom',
          });
          return;
        }
        Toast.show({
          type: 'success',
          text1: TRANSLATIONS['generic-success'],
          text2: TRANSLATIONS[jsonRes.message] ? TRANSLATIONS[jsonRes.message] : jsonRes.message,
          position: 'bottom',
        });
        setTimeout(() => {
          setModal(prev => {
            const newState = {...prev};
            newState.showModal = false;
            newState.pub = jsonRes.newPub;
            return newState;
          });
        }, 1000);
      })
      .catch(error => {
        console.log(error);
        Toast.show({
          type: 'error',
          text1: TRANSLATIONS['generic-error'],
          text2: TRANSLATIONS[error] ? TRANSLATIONS[error] : error,
          position: 'bottom',
        });
      });
  };

  const btns = UTILS.contactUsManager.actions.map(el => {
    return (
      <View key={el.name} style={styles.btnContainer}>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => onPressAction(el.name)}>
          <Text style={styles.btnTxt}>{el.label}</Text>
        </TouchableOpacity>
      </View>
    );
  });

  return (
    <>
      <View style={styles.container}>
        <View style={styles.row} />
        <View style={styles.btnListContainer}>{btns}</View>
        <View style={styles.row} />
      </View>
      <ContactUsManagerDetailModal
        toggleModal={modal.showModal}
        onToggleModal={(toggle: Boolean) =>
          setModal(prev => {
            const newState = {...prev};
            newState.showModal = toggle;
            return newState;
          })
        }
        pub={modal.pub}
        actionName={modal.actionName}
        onConfirmAction={onConfirmAction}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '80%',
  },
  row: {flex: 1},
  btnListContainer: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
  },
  btnContainer: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
  },
  btn: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fcb3f5',
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'black',
  },
  btnTxt: {
    fontSize: 18,
  },
});

export default ContactUsManagerDetail;
