/**@frpanico
 * Component that renders the menu
 * It is possible to create a new menu Item o modify an existing one
 */
import React, {useCallback, useEffect, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import CheckBox from '@react-native-community/checkbox';
import UTILS from '../utilities/utils';
import IMAGES from '../utilities/asset';
import TRANSLATIONS from '../translations/tranlastions';

const MM_UTILS = UTILS.menuManager;

type MenuManagerProps = {
  role: String;
  pub: Object;
  onModifyMenu: Function;
  refresher: Boolean;
  isPubOwner: Boolean;
};

type MenuManagerBtnProps = {
  onPressAction: Function;
};

type MenuAccordionProps = {
  menuSection: Array;
  activeSection: Array;
  isAtLeastOwner: Boolean;
  onSetActiveSection: Function;
  onPressMenuItem: Function;
};

type ActionType = {
  action: String;
  name: String;
  pubId: String;
  mainItem: Object;
};

const MenuManager: React.FC<MenuManagerProps> = ({
  role,
  pub,
  onModifyMenu,
  refresher,
  isPubOwner,
}) => {
  const [menuSection, setMenuSection] = useState([]);
  const [activeSection, setActiveSections] = useState([]);

  const isAtLeastOwner = isPubOwner || (role && role === 'admin');

  const handlePressAction = (action: ActionType) => {
    console.log(action);
    const actionObj: ActionType = {
      name: MM_UTILS['menu-action-name'],
      action: action.action,
      pubId: pub._id,
      mainItem: action.mainItem,
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
    result.sort((a: Object, b: Object) => {
      return (
        UTILS.menuManager['menu-food-categories-order'][a.title] -
        UTILS.menuManager['menu-food-categories-order'][b.title]
      );
    });
    return result;
  };

  const fetchMenu = (refresh: Boolean) => {
    console.log(refresh);
    const apiToCall = UTILS.serverBasePath + '/getMenu';
    fetch(apiToCall, {
      headers: {'Content-Type': 'application/json'},
      method: 'POST',
      body: JSON.stringify({pubId: pub._id}),
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

  const handleMenuItemPress = menuItem => {
    console.log(menuItem);
    const actionObj: ActionType = {
      action: 'edit',
      mainItem: menuItem,
    };
    _updateActiveSections([]);
    handlePressAction(actionObj);
  };

  console.log(menuSection);

  return (
    <>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Menu</Text>
      </View>
      {menuSection && menuSection.length > 0 && (
        <MenuAccordion
          menuSection={menuSection}
          activeSection={activeSection}
          onSetActiveSection={_updateActiveSections}
          onPressMenuItem={handleMenuItemPress}
          isAtLeastOwner={isAtLeastOwner}
        />
      )}
      <View style={styles.btnContainer}>
        {isAtLeastOwner && <ManagerBtn onPressAction={handlePressAction} />}
      </View>
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
        <Text style={styles.btnText}>{TRANSLATIONS['menu-new-item']}</Text>
      </TouchableOpacity>
    </View>
  );
};

const MenuAccordion: React.FC<MenuAccordionProps> = ({
  menuSection,
  activeSection,
  isAtLeastOwner,
  onPressMenuItem,
  onSetActiveSection,
}) => {
  const _renderSectionTitle = section => {
    return <></>;
  };

  const _renderHeader = section => {
    return (
      <View key={section.title} style={styles.menuHeader}>
        <ImageBackground
          style={styles.backgroundImage}
          imageStyle={styles.backgroundInsideImage}
          source={IMAGES['menu-btn-background']}
          resizeMode="cover">
          <Text style={styles.accordionSectionTitle}>
            {TRANSLATIONS[section.title]}
          </Text>
        </ImageBackground>
      </View>
    );
  };

  const _renderContent = section => {
    return (
      <View>
        {section.content.map(el => {
          return (
            <>
              <TouchableOpacity
                key={el._id}
                disabled={!isAtLeastOwner}
                style={styles.menuContentBtn}
                onLongPress={() => onPressMenuItem(el)}>
                <View style={styles.menuContentBtnInfoContainer}>
                  <View style={styles.menuContantentBtnInfoSubContainer}>
                    <Text style={styles.menuContentFoodName}>{el.food}</Text>
                    <Text style={styles.menuContentIngredients}>
                      {el.ingredients}
                    </Text>
                  </View>
                  <View style={styles.menuContantentBtnInfoSubContainer}>
                    {el.isVeganOk && (
                      <View style={styles.checkBoxContainer}>
                        <CheckBox
                          style={styles.checkBox}
                          disabled={true}
                          value={true}
                        />
                        <Text>{TRANSLATIONS['vegan-ok']}</Text>
                      </View>
                    )}
                    {el.isVegetarianOk && (
                      <View style={styles.checkBoxContainer}>
                        <CheckBox
                          style={styles.checkBox}
                          disabled={true}
                          value={true}
                        />
                        <Text>{TRANSLATIONS['vegetarian-ok']}</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.menuPriceContainer}>
                    <Text>
                      {el.currency ? (el.currency === 'USD' ? '$' : '€') : ''}{' '}
                      {el.price}
                    </Text>
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
  headerContainer: {
    paddingTop: 50,
  },
  headerText: {
    fontSize: 30,
    fontWeight: '700',
  },
  accordionContainer: {
    flex: 3,
    padding: 20,
  },
  accordionScrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundInsideImage: {
    borderRadius: 6,
  },
  accordionSectionTitle: {
    color: 'white',
    padding: 5,
    fontWeight: '700',
  },
  menuHeader: {
    width: 300,
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 5,
    backgroundColor: '#baf55b',
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
    flex: 2,
    flexDirection: 'column',
    justifyContent: 'center',
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
