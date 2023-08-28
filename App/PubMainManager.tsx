/**@frpanico
 * This component renders a specific component
 * Based on the action selected in the PubMain component
 */
import React from 'react';
import MenuManager from './MenuManager';
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import IMAGES from '../utilities/asset';
import UTILS from '../utilities/utils';

type navigateToDetailObj = {
  action: String;
  name: String;
  pubId: String;
};

const PubMainManager = ({navigation, route}) => {
  console.log('### PubMainManager ROUTE ' + JSON.stringify(route.params));

  const handleNavigateToDetail = (navigationInfo: navigateToDetailObj) => {
    console.log('### NavigationInfo' + JSON.stringify(navigationInfo));
    navigation.navigate({
      name: 'PubMainManagerDetail',
      params: {
        navigationInfo,
        userInfo: route.params?.userInfo,
        pub: route.params?.pub,
        cmp: route.params?.cmp,
      },
      merge: true,
    });
  };

  const isPubOwner = route.params?.userInfo.username === route.params?.pub.owner;

  console.log('### Is Pub Owner ', isPubOwner);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const componentToShow =
    route.params?.cmp === 'pub-main-menu' ? (
      <MenuManager
        role={route.params?.userInfo?.role}
        pub={route.params?.pub}
        onModifyMenu={handleNavigateToDetail}
        refresher={route.params?.refreshMenu}
        isPubOwner={isPubOwner}
      />
    ) : null;

  return (
    <>
      <ImageBackground
        source={IMAGES['home-background']}
        resizeMode="cover"
        style={styles.backgroundImage}>
        {componentToShow}
        <View style={styles.btnContainer}>
          <TouchableOpacity style={styles.btn} onPress={handleGoBack}>
            <Text style={styles.btnText}>{UTILS.goBack}</Text>
          </TouchableOpacity>
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
  btnContainer: {padding: 7},
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
