import React, { useEffect } from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import UTILS from '../utilities/utils';

const MM_UTILS = UTILS.menuManager;

type MenuManagerProps = {
  role: String;
  pub: Object;
  onModifyMenu: Function;
};

type MenuManagerBtnProps = {
  onPressAction: Function;
};

type ActionType = {
  action: String;
  name: String;
  pubId: String;
};

const MenuManager: React.FC<MenuManagerProps> = ({role, pub, onModifyMenu}) => {
  const handlePressAction = (action: ActionType) => {
    console.log(action);
    const actionObj : ActionType = {action: action.action, pubId: pub['id']};
    onModifyMenu(actionObj);
  };

  console.log(pub);

  const fetchMenu = () => {
    const apiToCall = UTILS.serverBasePath + '/getMenu';
    fetch(apiToCall, {
      headers: {'Content-Type': 'application/json'},
      method: 'GET',
    })
      .then(res => res.json())
      .then(jsonRes => {
        console.log(jsonRes);
      });
  };

  useEffect(() => {
    //fetchMenu();
  }, []);

  return (
    <>
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
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 6,
  },
  btnText: {fontSize: 18, textAlign: 'center', padding: 6},
});

export default MenuManager;
