/**@frpanico
 * Middleware file to logout
 */
import React, {useEffect} from 'react';
import LoadingSpinner from './utility/LoadingSpinner';

const Logout = ({navigation, route}) => {
  /* To Do: Effective Logout
   * Expiring jwt token
   */

  useEffect(() => {
    console.log('### Logout Mounted');

    setTimeout(() => {
      navigation.navigate({
        name: 'HomePubContainer',
        params: {hasUserOrGuestLoggedIn: false, userInfo: undefined},
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

export default Logout;
