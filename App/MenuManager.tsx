import React, {useCallback, useEffect, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import CheckBox from '@react-native-community/checkbox';
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

type MenuAccordionProps = {
  menuSection: Array;
  activeSection: Array;
  onSetActiveSection: Function;
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
  const [menuSection, setMenuSection] = useState([]);
  const [activeSection, setActiveSections] = useState([]);

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

  const buildMenu = menuObj => {
    const result = menuObj.reduce((accumulator, currentValue) => {
      const currentFoodCategory = currentValue.foodCategory;
      if (accumulator.findIndex(el => el.title === currentFoodCategory) < 0) {
        accumulator.push({title: currentFoodCategory, content: []});
      }
      const foodCategoryIndex = accumulator.findIndex(
        el => el.title === currentFoodCategory,
      );
      accumulator[foodCategoryIndex].content.push(currentValue);
      return [...accumulator];
    }, []);

    return result;
  };

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
        const menu = jsonRes.menu;
        const buildedMenu = buildMenu(menu);
        console.log(buildedMenu);
        setMenuSection(buildedMenu);
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

  const _updateActiveSections = activeSections => {
    setActiveSections(activeSections);
  };

  console.log(menuSection);

  return (
    <>
      <MenuAccordion
        menuSection={menuSection}
        activeSection={activeSection}
        onSetActiveSection={_updateActiveSections}
      />
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

const MenuAccordion: React.FC<MenuAccordionProps> = ({
  menuSection,
  activeSection,
  onSetActiveSection,
}) => {
  const _renderSectionTitle = section => {
    return <></>;
  };

  const _renderHeader = section => {
    return (
      <View style={styles.menuHeader}>
        <Text>{section.title}</Text>
      </View>
    );
  };

  const _renderContent = section => {
    return (
      <View>
        {section.content.map(el => {
          return (
            <>
              <TouchableOpacity key={el.id} style={styles.menuContentBtn}>
                <View style={styles.menuContentBtnInfoContainer}>
                  <View style={styles.menuContantentBtnInfoSubContainer}>
                    <Text style={styles.menuContentFoodName}>{el.food}</Text>
                    <Text style={styles.menuContentIngredients}>
                      {el.ingredients}
                    </Text>
                  </View>
                  <View style={styles.menuContantentBtnInfoSubContainer}>
                    {el.isVeganOk && <View style={styles.checkBoxContainer}>
                      <CheckBox
                        style={styles.checkBox}
                        disabled={true}
                        value={true}
                      />
                      <Text>Vegan OK</Text>
                    </View>}
                    {el.isVegetarianOk && <View style={styles.checkBoxContainer}>
                      <CheckBox
                        style={styles.checkBox}
                        disabled={true}
                        value={true}
                      />
                      <Text>Vegetarian OK</Text>
                    </View>}
                  </View>
                  <View style={styles.menuPriceContainer}>
                    <Text>{el.currency ? el.currency === 'USD' ? '$' : '€' : ''} {el.price}</Text>
                  </View> 
                </View>
              </TouchableOpacity>
            </>
          );
        })}
      </View>
    );
  };

  const _updateActiveSections = activeSections => {
    onSetActiveSection(activeSections);
  };

  return (
    <View style={styles.accordionContainer}>
      <ScrollView contentContainerStyle={styles.accordionScrollView}>
        <Accordion
          sections={menuSection}
          activeSections={activeSection}
          renderSectionTitle={_renderSectionTitle}
          renderHeader={_renderHeader}
          renderContent={_renderContent}
          onChange={_updateActiveSections}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  accordionContainer: {
    flex: 3,
    padding: 20,
  },
  accordionScrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuHeader: {
    width: 300,
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 5,
    backgroundColor: 'green',
    color: 'white',
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 5,
  },
  menuContentBtn: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 3,
    width: '100%',
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 5,
    marginBottom: 4,
  },
  menuContentBtnInfoContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  menuContantentBtnInfoSubContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    flex: 1,
    padding: 3,
  },
  menuContentFoodName: {
    flex: 1,
    fontSize: 16,
    flexWrap: 'wrap',
  },
  menuContentIngredients: {
    flex: 1,
    fontSize: 10,
    flexWrap: 'wrap',
  },
  menuPriceContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkBoxContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkBox: {
    height: 10,
    width: 10,
    marginRight: 3,
  },
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
