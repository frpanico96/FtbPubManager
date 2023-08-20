import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import FtbButton from './utility/FtbButton';

type MenuManagerProps = {
  role: String;
  onModifyMenu: Function;
};

type MenuManagerBtnProps = {
  onPressAction: Function;
};

type ActionType = {
  action: String;
  name: String;
};

const MenuManager: React.FC<MenuManagerProps> = ({role, onModifyMenu}) => {
  const handlePressAction = (action: ActionType) => {
    console.log(action);
    onModifyMenu(action);
  };

  return (
    <>
      {role !== 'customer' && <ManagerBtn onPressAction={handlePressAction} />}
    </>
  );
};

const ManagerBtn: React.FC<MenuManagerBtnProps> = ({onPressAction}) => {
  const handleNewFoodCategory = () => {
    onPressAction({action: 'new', name: 'food-category'});
  };
  const handleNewFood = () => {
    onPressAction({action: 'new', name: 'food'});
  };
  return (
    <View style={styles.btnContainer}>
      <FtbButton
        btnStyles={{btnStyle: styles.btn, btnTextStyle: styles.btnText}}
        onPressBtn={handleNewFoodCategory}
        text="New Food Category"
      />
      <FtbButton
        btnStyles={{btnStyle: styles.btn, btnTextStyle: styles.btnText}}
        onPressBtn={handleNewFood}
        text="New Food"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  btnContainer: {
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
