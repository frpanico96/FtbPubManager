import React from 'react';
import MenuManager from './MenuManager';
import {ImageBackground, StyleSheet, Text, View} from 'react-native';
import FtbButton from './utility/FtbButton';
import IMAGES from '../utilities/asset';

type navigateToDetailObj = {
  action: String;
  name: String;
};

const PubMainManager = ({navigation, route}) => {
  console.log('### PubMainManager ROUTE ' + JSON.stringify(route.params));

  const handleNavigateToDetail = (navigationInfo: navigateToDetailObj) => {
    console.log('### NavigationInfo' + JSON.stringify(navigationInfo));
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const componentToShow =
    route.params?.cmp === 'pub-main-menu' ? (
      <MenuManager
        role={route.params?.userInfo?.role}
        onModifyMenu={handleNavigateToDetail}
      />
    ) : null;

  return (
    <>
      <ImageBackground
        source={IMAGES['home-background']}
          resizeMode="cover"
        style={styles.pubListBackgroundImage}>
          <View style={styles.container}>
            {componentToShow}
            <FtbButton
              btnStyles={{btnStyle: styles.btn, btnTextStyle: styles.btnText}}
              text="Go Back"
              onPressBtn={handleGoBack}
            />
          </View>
       </ImageBackground>
    </>
  );
};

const styles = StyleSheet.create({
  container: {justifyContent: 'center', alignItems: 'center'},
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn: {
    backgroundColor: 'pink',
    width: '40%',
    padding: 3,
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 6,
    marginTop: 10,
  },
  btnText: {fontSize: 18, textAlign: 'center', padding: 6},
});

export default PubMainManager;
