import React, {useState} from 'react';
import {
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import UTILS from '../utilities/utils';

type MenuManagerDetailProps = {
  name: String;
  actionType: String;
  onGoBack: Function;
};

type FoodCategoryFormProps = {
  isCategory: Boolean;
  foodOrCategoryName: String;
  onSave: Function;
};

const MenuManagerDetail: React.FC<MenuManagerDetailProps> = ({
  name,
  actionType,
  onGoBack,
}) => {
  const handleSave = ({categoryName}) => {
    console.log('### MM_CategoryName: ' + categoryName);
  };
  const isCategory = name === UTILS['menuManager']['food-category-action'];
  return (<>
    <FoodOrCategoryForm foodOrCategoryName="" isCategory={isCategory} onSave={handleSave} />
  </>);
};

const FoodOrCategoryForm: React.FC<FoodCategoryFormProps> = ({
  foodOrCategoryName,
  isCategory,
  onSave,
}) => {
  const [foodOrCategoryInput, setfoodOrCategoryInput] = useState(foodOrCategoryName);
  const onPressSave = () => {
    console.log('### Cateogry Name: ' + foodOrCategoryInput);
    onSave({foodOrCategoryInput});
  };
  const header = isCategory ? 
  UTILS['menuManager']['food-category-card'] : UTILS['menuManager']['food-card'];
  const placeHolder = isCategory ? UTILS['menuManager']['food-category-placeholder'] : UTILS['menuManager']['food-placeholder'];
  return (
    <>
    <View style={{flex: 1}}></View>
    <View style={styles.card}>
      <Text style={styles.cardHeader}>{header}</Text>
      <TextInput
        placeholder={placeHolder}
        value={foodOrCategoryInput}
        onChangeText={setfoodOrCategoryInput}
        style={styles.inputTxt}
      />
      <TouchableOpacity style={styles.btn} onPress={onPressSave}>
        <Text style={styles.btnText}>Save</Text>
      </TouchableOpacity>
    </View>
    <View style={{flex: 1}}></View>
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 300,
    height: 300,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    flex: 2,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  cardHeader: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  inputTxt: {
    borderStyle: 'solid',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    width: '80%',
    height: '15%',
  },
  btn: {
    backgroundColor: 'pink',
    width: '60%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 6,
  },
  btnText: {
    fontSize: 18,
    textAlign: 'center'
  },
});

export default MenuManagerDetail;