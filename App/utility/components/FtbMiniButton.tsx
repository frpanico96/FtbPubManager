import React, {useState} from 'react';
import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import BtnIcon from 'react-native-vector-icons/MaterialCommunityIcons';

type FtbMiniButtonProps = {
  name: String;
  disabled: Boolean;
  iconName: String;
  iconSize: Number;
  iconColor: String;
  btnText: String;
  onPressMiniBtn: Function;
};

const FtbMiniButton = (props: FtbMiniButtonProps) => {
  const [isPressed, setIsPressed] = useState(false);

  const styleBtn = StyleSheet.create({
    btnBackground: {borderColor: !isPressed ? 'black' : props.iconColor},
  });

  const handleMiniButtonPress = (btnName: String) => {
    setIsPressed(!isPressed);
    props.onPressMiniBtn(btnName);
  };

  return (
    <TouchableOpacity
      style={[styles.tileReviewFooterBtn, styleBtn.btnBackground]}
      disabled={props.disabled}
      onPress={() => handleMiniButtonPress(props.name)}>
      <View style={styles.tileReviewFooterIcon}>
        {(Platform.OS === 'ios' || Platform.OS === 'android') && (
          <BtnIcon
            name={props.iconName}
            size={props.iconSize}
            color={props.iconColor}
          />
        )}
      </View>
      <View style={styles.tileReviewFooterTxt}>
        <Text>{props.btnText}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tileReviewFooterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.2,
    borderRadius: 30,
    paddingVertical: 5,
    paddingHorizontal: 20,
  },
  tileReviewFooterIcon: {},
  tileReviewFooterTxt: {marginLeft: 5, fontSize: 15, fontWeight: '600'},
});

export default FtbMiniButton;
