/**@frpanico
 * Junction file for Home and PubList
 * It displays the publist or the homepage
 * based on the login status of the user
 */
import React from 'react';
import HomePage from '../App/Home';
import PubList from '../App/PubList';

const HomePubContainer = ({navigation, route}) => {
  const handleNavigate = (cmp: String) => {
    navigation.navigate(cmp);
  };

  const handlePubNavigation = (pub: Object) => {
    console.log('# Pub: ' + JSON.stringify(pub));
    navigation.navigate({
      name: 'PubMain',
      params: {userInfo: route.params?.userInfo, pub},
      merge: true,
    });
  };

  return (
    <>
      {!route.params?.hasUserOrGuestLoggedIn ? (
        <HomePage onNavigate={handleNavigate} />
      ) : (
        <PubList
          onPubNavigate={handlePubNavigation}
          userInfo={route.params?.userInfo}
          onLogOut={handleNavigate}
        />
      )}
    </>
  );
};

export default HomePubContainer;
