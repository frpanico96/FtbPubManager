import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

import UTILS from '../utilities/utils';
import ContactUsManagerDetailModal from './ContactUsManagerDetailModal';

type ContactUsManagerDetailsProps = {
  pub: Object;
};

const ContactUsManagerDetail = (props: ContactUsManagerDetailsProps) => {
  const [modal, setModal] = useState({
    showModal: false,
    actionName: '',
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
        pub={props.pub}
        actionName={modal.actionName}
        onConfirmAction={() => console.log('Confirm')}
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
