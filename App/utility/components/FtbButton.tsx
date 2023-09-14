/**@frpanico
 * Generic Button
 * Actually not used beacuse of not responding well with flexbox
 */
import React from 'react';
import {TouchableOpacity, Text, View, StyleSheet} from 'react-native';

type FtbBtnProps = {
  btnStyles: BtnStyle;
  onPressBtn: Function;
  text: String;
};

type BtnStyle = {
  btnStyle: Object;
  btnTextStyle: Object;
};

const FtbButton: React.FC<FtbBtnProps> = ({btnStyles, onPressBtn, text}) => {
  const handlePress = () => onPressBtn();
  return (
    <View style={styles.container}>
      <TouchableOpacity style={btnStyles.btnStyle} onPress={handlePress}>
        <Text style={btnStyles.btnTextStyle}>{text}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {padding: 3},
});

export default FtbButton;
