/**@frpanico
 * Component that renders the form
 * To create a new Menu Item or edit an existing one
 */
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

import UTILS from '../NodeApp/utilities/utils';
import TRANSLATIONS from '../NodeApp/translations/tranlastions';

type MenuManagerDetailProps = {
  pubId: String;
  actionType: String;
  menu: Object;
  onGoBack: Function;
};

type MenuItemProps = {
  foodName: String;
  foodCategory: String;
  ingredients: String;
  isVeganOk: Boolean;
  isVegetarianOk: Boolean;
  price: Number;
  currency: String;
  onSave: Function;
};

type SaveFormProps = {
  food: String;
  foodCategory: String;
  ingredients: String;
  isVeganOk: Boolean;
  isVegetarianOk: Boolean;
  price: Number;
  currency: String;
  pubId: String;
};

const MenuManagerDetail: React.FC<MenuManagerDetailProps> = ({
  pubId,
  actionType,
  menu,
  onGoBack,
}) => {
  const handleSaveToDb = (formObj: SaveFormProps) => {
    const apiToCall = actionType === 'new' ? '/createMenu' : '/updateMenu';
    const body = actionType === 'new' ? formObj : {...formObj, _id: menu._id};
    fetch(UTILS.serverBasePath + apiToCall, {
      headers: {'Content-Type': 'application/json'},
      method: 'POST',
      body: JSON.stringify(body),
    })
      .then(res => res.json())
      .then(jsonRes => {
        console.log(jsonRes);
        Toast.show({
          type: jsonRes.error ? 'error' : 'success',
          text1: jsonRes.error ? TRANSLATIONS['generic-error'] : TRANSLATIONS['generic-success'],
          text2: jsonRes.error
            ? `${TRANSLATIONS['menu-item-failure']} ${
                actionType === 'new'
                  ? TRANSLATIONS['menu-created']
                  : TRANSLATIONS['menu-updated']
              }`
            : `${TRANSLATIONS['menu-item-success']} ${
                actionType === 'new'
                  ? TRANSLATIONS['menu-created']
                  : TRANSLATIONS['menu-updated']
              } `,
          position: 'bottom',
        });
        onGoBack();
      })
      .catch(error => console.log(error));
  };

  const handleSaveForm = (saveObj: SaveFormProps) => {
    const formObj = {...saveObj};
    formObj.pubId = pubId;
    console.log(formObj);
    handleSaveToDb(formObj);
  };

  return (
    <>
      <View style={styles.fakeRow} />
      <View style={styles.card}>
        <MenuItemForm
          foodName={menu?.food}
          foodCategory={menu?.foodCategory}
          ingredients={menu?.ingredients}
          isVeganOk={menu?.isVeganOk ? menu.isVeganOk : false}
          isVegetarianOk={menu?.isVegetarianOk ? menu.isVegetarianOk : false}
          price={menu?.price?.toString()}
          currency={menu?.currency}
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
  price,
  currency,
  onSave,
}) => {
  const [foodInput, setFoodInput] = useState(foodName);
  const [ingredientsInput, setIngredientsInput] = useState(ingredients);
  const [isVegan, setIsVegan] = useState(isVeganOk);
  const [isVegetarian, setIsVegetarian] = useState(isVegetarianOk);
  const [priceInput, setPriceInput] = useState(price);
  /* Food Category Combobox State */
  const [open, setOpen] = useState(false);
  const [foodCategoryInput, setFoodCategoryInput] = useState(foodCategory);
  const [items, setItems] = useState(UTILS.menuManager['menu-food-categories']);
  /* Currency Combobox State */
  const [openCurr, setOpenCurr] = useState(false);
  const [currInput, setCurrInput] = useState(currency);
  const [itemsCurr, setItemsCurr] = useState(
    UTILS.menuManager['menu-item-currency'],
  );
  const onPressSave = () => {
    const saveObj: SaveFormProps = {
      food: foodInput,
      ingredients: ingredientsInput,
      foodCategory: foodCategoryInput,
      isVeganOk: isVegan,
      isVegetarianOk: isVegetarian,
      price: priceInput,
      currency: currInput,
      pub: '',
    };
    onSave(saveObj);
  };

  return (
    <>
      <TextInput
        style={styles.inputTxt}
        placeholder={TRANSLATIONS['menu-item-food-placeholder']}
        value={foodInput}
        onChangeText={setFoodInput}
      />
      <TextInput
        style={styles.inputTxt}
        placeholder={TRANSLATIONS['menu-item-description-placeholder']}
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
          placeholder={TRANSLATIONS['menu-item-category-placeholder']}
        />
      </View>
      <View style={styles.priceContainer}>
        <TextInput
          style={styles.inputTxtPrice}
          value={priceInput}
          onChangeText={setPriceInput}
          placeholder="12.39"
        />
        <View style={styles.comboboxCurrency}>
          <DropDownPicker
            open={openCurr}
            value={currInput}
            items={itemsCurr}
            setOpen={setOpenCurr}
            setValue={setCurrInput}
            setItems={setItemsCurr}
            placeholder=""
          />
        </View>
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
        <Text style={styles.btnText}>{TRANSLATIONS['generic-save']}</Text>
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
  priceContainer: {
    flexDirection: 'row',
    width: '80%',
    zIndex: 1000,
  },
  inputTxtPrice: {
    flex: 2,
    borderStyle: 'solid',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  comboboxCurrency: {
    flex: 1,
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
