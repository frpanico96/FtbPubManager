import App from '../App/App';
import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '../App/Login';
import Toast from 'react-native-toast-message';
import HomePubContainer from './HomePubContainer';

const Stack = createNativeStackNavigator();

const AppContainer = () => {
  const [hasUserOrGuestLoggedIn, setHasUserOrGuestLoggedIn] = useState(false);

  const handleUserOrGuestLoggedIn = () => {
    setHasUserOrGuestLoggedIn(true);
  };

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="HomePubContainer" component={HomePubContainer} />
          <Stack.Screen name="Login" component={Login} />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </>
  );
};

export default AppContainer;
