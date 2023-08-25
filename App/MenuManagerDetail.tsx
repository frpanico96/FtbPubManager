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
import CheckBox from '@react-native-community/checkbox';
import UTILS from '../utilities/utils';

type MenuManagerDetailProps = {
  pubId: String;
  actionType: String;
  onGoBack: Function;
};

type MenuItemProps = {
  foodName: String;
  foodCategory: String;
  ingredients: String;
  isVeganOk: Boolean;
  isVegetarianOk: Boolean;
  onSave: Function;
};

type SaveFormProps = {
  food: String;
  foodCategory: String;
  ingredients: String;
  isVeganOk: Boolean;
  isVegetarianOk: Boolean;
  pub: String;
};

const MenuManagerDetail: React.FC<MenuManagerDetailProps> = ({
  pubId,
  actionType,
  onGoBack,
}) => {
  const handleSaveToDb = (formObj: SaveFormProps) => {
    fetch(UTILS.serverBasePath + '/createMenu', {
      headers: {'Content-Type': 'application/json'},
      method: 'POST',
      body: JSON.stringify(formObj),
    })
      .then(res => res.json())
      .then(jsonRes => {
        console.log(jsonRes);
        Toast.show({
          type: jsonRes.error ? 'error' : 'success',
          text1: jsonRes.error ? jsonRes.error : 'Success',
          text2: jsonRes.error
            ? 'Menu Item not correctly created'
            : 'Menu Item created correctly',
          position: 'bottom',
        });
        onGoBack();
      })
      .catch(error => console.log(error));
  };

  const handleSaveForm = (saveObj: SaveFormProps) => {
    const formObj = {...saveObj};
    formObj.pub = pubId;
    console.log(formObj);
    handleSaveToDb(formObj);
  };

  return (
    <>
      <View style={styles.fakeRow} />
      <View style={styles.card}>
        <MenuItemForm
          foodName=""
          foodCategory=""
          ingredients=""
          isVeganOk={false}
          isVegetarianOk={false}
          onSave={handleSaveForm}
        />
      </View>
      <View style={styles.fakeRow} />
    </>
  );
};

const MenuItemForm: React.FC<MenuItemProps> = ({
  foodName,
  foodCategory,
  ingredients,
  isVeganOk,
  isVegetarianOk,
  onSave,
}) => {
  const [foodInput, setFoodInput] = useState(foodName);
  const [ingredientsInput, setIngredientsInput] = useState(ingredients);
  const [isVegan, setIsVegan] = useState(isVeganOk);
  const [isVegetarian, setIsVegetarian] = useState(isVegetarianOk);
  const [open, setOpen] = useState(false);
  const [foodCategoryInput, setFoodCategoryInput] = useState(foodCategory);
  const [items, setItems] = useState(UTILS.menuManager['menu-food-categories']);

  const onPressSave = () => {
    const saveObj: SaveFormProps = {
      food: foodInput,
      ingredients: ingredientsInput,
      foodCategory: foodCategoryInput,
      isVeganOk: isVegan,
      isVegetarianOk: isVegetarian,
      pub: '',
    };
    onSave(saveObj);
  };

  return (
    <>
      <TextInput
        style={styles.inputTxt}
        placeholder="Food Name"
        value={foodInput}
        onChangeText={setFoodInput}
      />
      <TextInput
        style={styles.inputTxt}
        placeholder="Garlic, Onion, ..."
        value={ingredientsInput}
        onChangeText={setIngredientsInput}
      />
      <View style={styles.combobox}>
        <DropDownPicker
          open={open}
          value={foodCategoryInput}
          items={items}
          setOpen={setOpen}
          setValue={setFoodCategoryInput}
          setItems={setItems}
        />
      </View>
      <View style={styles.checkBoxesContainer}>
        <View style={styles.checkBoxContainer}>
          <CheckBox
            style={styles.checkBox}
            value={isVegan}
            onValueChange={newValue => setIsVegan(newValue)}
          />
          <Text>VeganOK?</Text>
        </View>
        <View style={styles.checkBoxContainer}>
          <CheckBox
            style={styles.checkBox}
            value={isVegetarian}
            onValueChange={newValue => setIsVegetarian(newValue)}
          />
          <Text>VegetarianOK?</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.btn} onPress={onPressSave}>
        <Text style={styles.btnText}>Save</Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  fakeRow: {flex: 1},
  card: {
    width: 300,
    height: 300,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    flex: 3,
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
  combobox: {
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000,
  },
  checkBoxesContainer: {
    justifyContent: 'center',
  },
  checkBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 3,
  },
  checkBox: {
    alignSelf: 'center',
    marginRight: 10,
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
