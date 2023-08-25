import React, {useCallback, useEffect, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import UTILS from '../utilities/utils';

const MM_UTILS = UTILS.menuManager;

type MenuManagerProps = {
  role: String;
  pub: Object;
  onModifyMenu: Function;
  refresher: Boolean;
};

type MenuManagerBtnProps = {
  onPressAction: Function;
};

type ActionType = {
  action: String;
  name: String;
  pubId: String;
};

const MenuManager: React.FC<MenuManagerProps> = ({
  role,
  pub,
  onModifyMenu,
  refresher,
}) => {

  const [test, setTest] = useState(false);

  const handlePressAction = (action: ActionType) => {
    console.log(action);
    const actionObj: ActionType = {
      name: MM_UTILS['menu-action-name'],
      action: action.action,
      pubId: pub.id,
    };
    onModifyMenu(actionObj);
  };

  console.log(pub);

  const fetchMenu = (refresh: Boolean) => {
    console.log(refresh);
    const apiToCall = UTILS.serverBasePath + '/getMenu';
    fetch(apiToCall, {
      headers: {'Content-Type': 'application/json'},
      method: 'POST',
      body: JSON.stringify({pubId: pub.id}),
    })
      .then(res => res.json())
      .then(jsonRes => {
        console.log(jsonRes);
      });
  };

  useFocusEffect(
    useCallback(() => {
      fetchMenu(refresher);
    }, [refresher]),
  );

  useEffect(() => {
    //fetchMenu();
  }, []);

  return (
    <>
      <TouchableOpacity style={{marginTop: 200}} onPress={() => setTest(currentValue => !currentValue)}>
        <Text>Test</Text>
      </TouchableOpacity>
      {role !== 'customer' && <ManagerBtn onPressAction={handlePressAction} />}
    </>
  );
};

const ManagerBtn: React.FC<MenuManagerBtnProps> = ({onPressAction}) => {
  const handleNewMenuItem = () => {
    onPressAction({action: 'new'});
  };
  return (
    <View style={styles.btnContainer}>
      <TouchableOpacity style={styles.btn} onPress={handleNewMenuItem}>
        <Text style={styles.btnText}>{MM_UTILS['mm-new-menu']}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  btnContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  btn: {
    backgroundColor: 'pink',
    width: '100%',
    padding: 3,
    marginTop: 100,
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 6,
  },
  btnText: {fontSize: 18, textAlign: 'center', padding: 6},
});

export default MenuManager;
