/**@frpanico
 * Middleware file to join as a guest
 */
import React, {useEffect} from 'react';
import LoadingSpinner from './utility/components/LoadingSpinner';
import Toast from 'react-native-toast-message';

import UTILS from '../NodeApp/utilities/utils';

const GuestLogin = ({navigation, route}) => {
  useEffect(() => {
    console.log('### Guest Login Mounted');

    setTimeout(() => {
      fetch(UTILS.serverBasePath + '/guestLogin', {
        headers: {'Content-Type': 'application/json'},
        method: 'GET',
      })
        .then(res => res.json())
        .then(jsonRes => {
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: 'Check In succesfully',
            position: 'bottom',
          });
          navigation.navigate({
            name: 'HomePubContainer',
            params: {hasUserOrGuestLoggedIn: true},
            merge: true,
          });
        })
        .catch(error => {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: error,
            position: 'bottom',
          });
          navigation.goBack();
        });
    }, 1500);
  }, [navigation]);

  return (
    <>
      <LoadingSpinner size="large" color="pink" />
      <Toast />
    </>
  );
};

export default GuestLogin;
