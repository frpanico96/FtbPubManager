/**@frpanico
 * This component renders a specific component
 * Based on the action selected in the PubMain component
 */
import React from 'react';
import MenuManager from './MenuManager';
import Reservation from './Reservation';
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import IMAGES from '../utilities/asset';
import UTILS from '../utilities/utils';
import TRANSLATIONS from '../translations/tranlastions';
import ReservationManager from './ReservationManager';
import ContactUsManager from './ContactUsManager';
import ReviewManager from './ReviewManager';

type navigateToDetailObj = {
  action: String;
  name: String;
  pubId: String;
  date: String;
  pub: Object;
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

  const isPubOwner =
    route.params?.userInfo?.username === route.params?.pub.owner?.username;
  const isAtLeastOwner = isPubOwner || route.params?.userInfo?.role === 'admin';
  const isLoggedUser = route.params?.userInfo != null;
  console.log('### Is Pub Owner ', isAtLeastOwner);
  console.log('### Is logged user', isLoggedUser);

  const handleGoBack = () => {
    navigation.goBack();
  };
  console.log(route.params?.cmp);
  const componentToShow =
    route.params?.cmp === UTILS.menuAction ? (
      <MenuManager
        role={route.params?.userInfo?.role}
        pub={route.params?.pub}
        onModifyMenu={handleNavigateToDetail}
        refresher={route.params?.refreshMenu}
        isPubOwner={isPubOwner}
      />
    ) : route.params?.cmp === UTILS.reservationAction ? (
      <Reservation
        reservationForm={undefined}
        pub={route.params?.pub}
        username={route.params?.userInfo?.username}
        isAtLeastOwner={isAtLeastOwner}
        onBookSaved={handleGoBack}
      />
    ) : route.params?.cmp === UTILS.reservationManagerAction ? (
      <ReservationManager
        isAtLeastOwner={isAtLeastOwner}
        isNotGoingBack={route.params?.refreshMenu}
        onSearchReservation={(date: Date) => {
          const navigationObj: navigateToDetailObj = {
            action: 'search',
            name: UTILS.reservationManagerAction,
            pubId: route.params?.pub._id,
            date: date?.toISOString(),
          };
          handleNavigateToDetail(navigationObj);
        }}
        onGoBack={handleGoBack}
      />
    ) : route.params?.cmp === UTILS.contactUsAction ? (
      <ContactUsManager
        pub={route.params?.pub}
        isAtLeastOwner={isAtLeastOwner}
        onEditInformation={pub => {
          const navigationObj: navigateToDetailObj = {
            action: '',
            name: UTILS.contactUsManager['contact-us-action'],
            pubId: route.params?.pub?._id,
            date: '',
            pub: pub,
          };
          handleNavigateToDetail(navigationObj);
        }}
      />
    ) : route.params?.cmp === UTILS.reviewAction ? (
      <ReviewManager
        pub={route.params?.pub}
        isLoggedUser={isLoggedUser}
        isAtLeastOwner={isAtLeastOwner}
        loggedUser={route.params?.userInfo}
        onNavigateToDetail={(review: Object) => {
          const navigationObj: navigateToDetailObj = {
            action: '',
            name: UTILS.reviewAction,
            pubId: review?._id,
            date: '',
            pub: review,
          };
          handleNavigateToDetail(navigationObj);
        }}
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
            <Text style={styles.btnText}>{TRANSLATIONS['go-back-btn']}</Text>
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
