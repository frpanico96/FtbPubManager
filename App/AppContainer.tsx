/**@frpanico
 * Main UI file that contains
 * all the screens for the app
 */
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '../App/Login';
import Toast from 'react-native-toast-message';
import HomePubContainer from './HomePubContainer';
import GuestLogin from './GuestLogin';
import Logout from './Logout';
import PubMain from './PubMain';
import PubMainManager from './PubMainManager';
import PubMainManagerDetail from './PubMainManagerDetail';

const Stack = createNativeStackNavigator();

const AppContainer = () => {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            options={{headerShown: false, title: 'Home'}}
            name="HomePubContainer"
            component={HomePubContainer}
          />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen
            options={{headerShown: false}}
            name="Guest"
            component={GuestLogin}
          />
          <Stack.Screen
            options={{headerShown: false}}
            name="Logout"
            component={Logout}
          />
          <Stack.Screen options={{headerShown: false}} name="PubMain" component={PubMain} />
          <Stack.Screen options={{headerShown: false}} name="PubMainManager" component={PubMainManager} />
          <Stack.Screen name="PubMainManagerDetail" component={PubMainManagerDetail} />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </>
  );
};

export default AppContainer;
