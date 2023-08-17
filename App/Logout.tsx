import React, {useEffect} from 'react';

const Logout = ({navigation, route}) => {

  /* To Do: Effective Logout
  * Expiring jwt token
  */

  useEffect(() => {
    console.log('### Logout Mounted');

    navigation.navigate({
      name: 'HomePubContainer',
      params: {hasUserOrGuestLoggedIn: false, userInfo: undefined},
      merge: true,
    });
  }, []);

  return <></>;
};

export default Logout;
