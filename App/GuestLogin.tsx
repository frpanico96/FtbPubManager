/**@frpanico
 * Middleware file to join as a guest
 */
import React, {useEffect} from 'react';
import LoadingSpinner from './utility/components/LoadingSpinner';

const GuestLogin = ({navigation, route}) => {
  useEffect(() => {
    console.log('### Guest Login Mounted');

    setTimeout(() => {
      navigation.navigate({
        name: 'HomePubContainer',
        params: {hasUserOrGuestLoggedIn: true},
        merge: true,
      });
    }, 1500);
  }, [navigation]);

  return (
    <>
      <LoadingSpinner size="large" color="pink" />
    </>
  );
};

export default GuestLogin;
