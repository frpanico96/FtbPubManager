import React from 'react';
import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import IMAGES from '../utilities/asset';
import UTILS from '../utilities/utils';
import MenuManagerDetail from './MenuManagerDetail';

const PubMainManagerDetail = ({navigation, route}) => {
  console.log('### Routing Params: ' + JSON.stringify(route.params));
  const actionName = route.params?.navigationInfo.name;
  const actionType = route.params?.navigationInfo.action;
  const pubId = route.params?.navigationInfo.pubId;
  const 
  menuItem = route.params?.navigationInfo.menu;

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleNavigateToPreviousScreen = () => {
    navigation.navigate({
      name: 'PubMainManager',
      params: {
        userInfo: route.params?.userInfo,
        pub: route.params?.pub,
        cmp: route.params?.cmp,
        refreshMenu: true,
      },
      merge: true,
    });
  };

  const componentToShow =
    actionName === UTILS.menuManager['menu-action-name'] ? (
      <MenuManagerDetail
        pubId={pubId}
        actionType={actionType}
        menu={menuItem}
        onGoBack={handleNavigateToPreviousScreen}
      />
    ) : (
      <Text>Hello</Text>
    );

  return (
    <View style={styles.container}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  backgroundImage: {flex: 1, justifyContent: 'center', alignItems: 'center'},
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

export default PubMainManagerDetail;
