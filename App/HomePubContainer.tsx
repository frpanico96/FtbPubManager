import React, {useState} from 'react';
import HomePage from '../App/Home';
import PubList from '../App/PubList';

const HomePubContainer = ({navigation, route}) => {
  const handleNavigate = cmp => {
    navigation.navigate(cmp);
  };

  return (
    <>
      {!route.params?.hasUserOrGuestLoggedIn ? (
        <HomePage onNavigate={handleNavigate} />
      ) : (
        <PubList/>
      )}
    </>
  );
};

export default HomePubContainer;
