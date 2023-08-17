import React, {useEffect} from 'react';

const GuestLogin = ({navigation, route}) => {
  useEffect(() => {
    console.log('### Guest Login Mounted');

    navigation.navigate({
      name: 'HomePubContainer',
      params: {hasUserOrGuestLoggedIn: true},
      merge: true,
    });
  }, []);

  return <></>;
};

export default GuestLogin;
