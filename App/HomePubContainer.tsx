/**@frpanico
 * Junction file for Home and PubList
 * It displays the publist or the homepage
 * based on the login status of the user
 */
import React, {useState} from 'react';
import HomePage from '../App/Home';
import PubList from '../App/PubList';

const HomePubContainer = ({navigation, route}) => {
  const handleNavigate = cmp => {
    navigation.navigate(cmp);
  };

  const handlePubNavigation = pub => {
    console.log('# Pub: ' + JSON.stringify(pub));
    navigation.navigate({
      name: 'PubMain',
      params: {userInfo: route.params?.userInfo, pub: pub},
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
