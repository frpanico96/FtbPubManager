import React, {useState} from 'react';
import {
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import DropDownPicker from 'react-native-dropdown-picker';
import UTILS from '../utilities/utils';

type MenuManagerDetailProps = {
  name: String;
  actionType: String;
  onGoBack: Function;
};

type FoodCategoryFormProps = {
  isCategory: Boolean;
  foodOrCategoryName: String;
  ingredients: String;
  menuNumber: String;
  categories: Array<String>;
  category: String;
  onSave: Function;
};

type SaveFormObj = {
  categoryOrFoodName: String;
  foodCategory: String;
  number: Number;
  ingredients: String;
};

const MenuManagerDetail: React.FC<MenuManagerDetailProps> = ({
  name,
  actionType,
  onGoBack,
}) => {
  const isCategory = name === UTILS.menuManager['food-category-action'];
  const apiToCall = isCategory
    ? UTILS.serverBasePath + '/createFoodCategory'
    : UTILS.serverBasePath + '/createFood';
  console.log(apiToCall);
  const handleSave = (formObj: SaveFormObj) => {
    console.log('### MM_CategoryName: ' + formObj.categoryOrFoodName);
    fetch(apiToCall, {
      headers: {'Content-Type': 'application/json'},
      method: 'POST',
      body: JSON.stringify({name: formObj.categoryOrFoodName}),
    })
      .then(res => res.json())
      .then(jsonRes => {
        console.log(jsonRes);
        Toast.show({
          type: jsonRes.error ? 'error' : 'success',
          text1: jsonRes.error ? jsonRes.error : 'Success',
          text2: jsonRes.error
            ? jsonRes.error
            : 'Category Successfully Created',
          position: 'top',
        });
      });
  };
  return (
    <>
      <FoodOrCategoryForm
        foodOrCategoryName=""
        isCategory={isCategory}
        onSave={handleSave}
      />
    </>
  );
};

const FoodOrCategoryForm: React.FC<FoodCategoryFormProps> = ({
  foodOrCategoryName,
  menuNumber,
  ingredients,
  categories,
  category,
  onSave,
}) => {
  const [foodOrCategoryInput, setfoodOrCategoryInput] =
    useState(foodOrCategoryName);
  const [selectedMenuNumber, setSelectedMenuNumber] = useState(menuNumber);
  const [selectedIngredients, setSelectedIngredients] = useState(ingredients);
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(category);
  const [items, setItems] = useState(categories);
  const onPressSave = () => {
    console.log('### Cateogry Name: ' + foodOrCategoryInput);
    const saveObj: SaveFormObj = {categoryOrFoodName: foodOrCategoryInput};
    onSave(saveObj);
  };
  const header = 'New Menu Item';
  return (
    <>
      <View style={{flex: 1}} />
      <View style={styles.card}>
        <Text style={styles.cardHeader}>{header}</Text>

        <TouchableOpacity style={styles.btn} onPress={onPressSave}>
          <Text style={styles.btnText}>{UTILS.save}</Text>
        </TouchableOpacity>
      </View>
      <View style={{flex: 1}} />
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
    height: '20%',
  },
  btn: {
    backgroundColor: 'pink',
    width: '60%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 6,
    padding: 5,
  },
  btnText: {
    fontSize: 18,
    textAlign: 'center',
  },
});

export default MenuManagerDetail;
