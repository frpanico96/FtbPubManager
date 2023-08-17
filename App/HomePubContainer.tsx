import React, {useState} from 'react';
import HomePage from '../App/Home';
import PubList from '../App/PubList';

const HomePubContainer = ({navigation, route}) => {
  const handleNavigate = cmp => {
    navigation.navigate(cmp);
  };

  const handlePubNavigation = pub => {
    console.log('# Pub: ' + JSON.stringify(pub));
  }

  return (
    <>
      {!route.params?.hasUserOrGuestLoggedIn ? (
        <HomePage onNavigate={handleNavigate} />
      ) : (
        <PubList onPubNavigate={handlePubNavigation} userInfo={route.params?.userInfo} onLogOut={handleNavigate}/>
      )}
    </>
  );
};

export default HomePubContainer;
