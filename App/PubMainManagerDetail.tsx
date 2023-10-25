/**@frpanico
 * This component renders a component
 * which is the "detail" of an action selected in the PubMain component
 */
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
import TRANSLATIONS from '../translations/tranlastions';

import MenuManagerDetail from './MenuManagerDetail';
import ReservationManagerDetail from './ReservationManagerDetail';
import ContactUsManagerDetail from './ContactUsManagerDetail';
import ReviewManagerDetail from './ReviewManagerDetail';

const PubMainManagerDetail = ({navigation, route}) => {
  console.log('### Routing Params: ' + JSON.stringify(route.params));
  const actionName = route.params?.navigationInfo.name;
  const actionType = route.params?.navigationInfo.action;
  const pubId = route.params?.navigationInfo.pubId;
  const mainItem = route.params?.navigationInfo.mainItem;
  const dateTimeOfReservation = route.params?.navigationInfo?.date;
  const isPubOwner =
    route.params?.userInfo?.username === route.params?.pub?.owner?.username;
  const isAtLeastOwner = isPubOwner || route.params?.userInfo.role === 'admin';
  const pub = route.params?.navigationInfo?.pub;
  console.log('### Is Pub Owner ', isAtLeastOwner);
  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleNavigateToPreviousScreen = (refresher = true) => {
    if (
      actionType === UTILS.reservationManager['action-name-user-reservation']
    ) {
      handleGoBack();
    } else {
      navigation.navigate({
        name: 'PubMainManager',
        params: {
          userInfo: route.params?.userInfo,
          pub: route.params?.pub,
          cmp: route.params?.cmp,
          refreshMenu: refresher,
        },
        merge: true,
      });
    }
  };

  const componentToShow =
    actionName === UTILS.menuManager['menu-action-name'] ? (
      <MenuManagerDetail
        pubId={pubId}
        actionType={actionType}
        menu={mainItem}
        onGoBack={handleNavigateToPreviousScreen}
      />
    ) : actionName === UTILS.reservationManagerAction ? (
      <>
        <ReservationManagerDetail
          username={route.params?.userInfo?.username}
          isAtLeastOwner={isAtLeastOwner}
          pub={route.params?.pub}
          refresher={route.params?.refresher}
          dateTimeOfReservation={dateTimeOfReservation}
          actionType={actionType}
        />
      </>
    ) : actionName === UTILS.contactUsManager['contact-us-action'] ? (
      <ContactUsManagerDetail pub={pub} />
    ) : actionName === UTILS.reviewAction ? (
      <ReviewManagerDetail
        review={pub}
        loggedUser={route.params?.userInfo}
        isAtLeastOwner={isAtLeastOwner}
        onUpdateFeedback={handleNavigateToPreviousScreen}
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
          <TouchableOpacity
            style={styles.btn}
            onPress={() => handleNavigateToPreviousScreen(false)}>
            <Text style={styles.btnText}>{TRANSLATIONS['go-back-btn']}</Text>
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
