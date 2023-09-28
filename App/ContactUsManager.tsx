import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';

import UTILS from '../utilities/utils';

type ContactUsManagerProp = {
  pub: Object;
  isAtLeastOwner: Boolean;
  onEditInformation: Function;
};

const ContactUsManager = (props: ContactUsManagerProp) => {
  console.log('### Contact Us Manager');
  console.log(props);

  const infos = UTILS.contactUsManager.infos.map(el => {
    if (!props?.pub[el.field]) {
      return (
        <View key={el.field} style={styles.infoChildContainer}>
          <Text style={styles.infoLabel}>{el.label}:</Text>
        </View>
      );
    }
    if (el.field === 'phone') {
      return (
        <View key={el.field} style={styles.infoChildContainer}>
          <Text style={styles.infoLabel}>{el.label}</Text>
          <Text style={styles.infoValue}>
            : ({props?.pub?.phonePrefix}){props?.pub[el.field]}
          </Text>
        </View>
      );
    } else if (el.field === 'openTime' || el.field === 'closeTime') {
      const hours = parseInt(props?.pub[el.field] / 100, 10);
      const mins =
        parseInt(props?.pub[el.field] % 100, 10) === 0
          ? '00'
          : parseInt(props?.pub[el.field] % 100, 10);
      const time = `${hours}:${mins}`;
      return (
        <View key={el.field} style={styles.infoChildContainer}>
          <Text style={styles.infoLabel}>{el.label}: </Text>
          <Text style={styles.infoValue}>{time}</Text>
        </View>
      );
    } else if (el.field === 'vacationStart' || el.field === 'vacationEnd') {
      const date = new Date(props?.pub[el.field]);
      return (
        <View key={el.field} style={styles.infoChildContainer}>
          <Text style={styles.infoLabel}>{el.label}: </Text>
          <Text style={styles.infoValue}>{date.toLocaleDateString()}</Text>
        </View>
      );
    } else if (el.field === 'daysClosed') {
      let daysClosed = '';
      for (let i = 0; i <= props?.pub[el.field].length - 1; ++i) {
        const dayOfTheWeek = UTILS.dayOfWeek[props?.pub[el.field][i]];
        console.log(dayOfTheWeek);
        if (i === props?.pub[el.field].length - 1) {
          daysClosed += dayOfTheWeek;
        } else {
          daysClosed += dayOfTheWeek + ', ';
        }
      }
      return (
        <View key={el.field} style={styles.infoChildContainer}>
          <Text style={styles.infoLabel}>{el.label}: </Text>
          <Text style={styles.infoValue}>{daysClosed}</Text>
        </View>
      );
    } else {
      return (
        <View key={el.field} style={styles.infoChildContainer}>
          <Text style={styles.infoLabel}>{el.label}: </Text>
          <Text style={styles.infoValue}>{props?.pub[el.field]}</Text>
        </View>
      );
    }
  });


  return (
    <>
      <View style={styles.container}>
        <View style={{flex: 1}} />
        <View style={styles.card}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerTxt}>{props?.pub?.name}</Text>
            {props?.pub?.showOwner && (
              <Text style={styles.headerSubTxt}>
                by {props?.pub?.owner?.username}
              </Text>
            )}
          </View>
          <View style={styles.infoContainer}>{infos}</View>
        </View>
        {props.isAtLeastOwner && (
          <View style={styles.btnContainer}>
            <TouchableOpacity style={styles.btn} onPress={() => props.onEditInformation()}>
              <Text style={styles.btnTxt}>Edit Information</Text>
            </TouchableOpacity>
          </View>
        )}
        <View style={{flex: 1}} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'space-evenly', alignItems: 'center'},
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 5,
  },
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  headerTxt: {
    fontWeight: '700',
    fontSize: 28,
  },
  headerSubTxt: {
    fontWeight: '600',
    fontSize: 20,
  },
  infoContainer: {
    padding: 5,
  },
  infoChildContainer: {
    flexDirection: 'row',
    padding: 3,
    flexWrap: 'wrap',
  },
  infoLabel: {
    fontWeight: '500',
    fontSize: 16,
  },
  infoValue: {
    fontWeight: '300',
    fontSize: 15,
  },
  btnContainer: {
    flex: 1,
    padding: 3,
    marginTop: 10,
  },
  btn: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'pink',
    padding: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'black',
  },
  btnTxt: {
    fontSize: 18,
  },
});

export default ContactUsManager;
