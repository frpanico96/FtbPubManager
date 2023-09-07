import React from 'react';
import {View} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

type FtbDropDownPickerProps = {
  open: Boolean;
  value: String;
  items: Array<String>;
  placeHolder: String;
  containerStyle: Object;
  setOpen: Function;
  setValue: Function;
  setItems: Function;
};

const FtbDropDownPicker: React.FC<FtbDropDownPickerProps> = ({
  open,
  value,
  items,
  placeHolder,
  containerStyle,
  setOpen,
  setValue,
  setItems,
}) => {
  const handleSetOpen = () => {
    setOpen();
  };

  const handleSetValue = () => {
    setValue();
  };

  const handleSetItems = () => {
    setItems();
  };

  return (
    <View style={containerStyle}>
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={handleSetOpen}
        setValue={handleSetValue}
        setItems={handleSetItems}
        placeholder={placeHolder}
      />
    </View>
  );
};

export default FtbDropDownPicker;
