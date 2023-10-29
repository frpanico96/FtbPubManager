/**@frpanico
 * UI login file
 * From this page the user can log in or sign up
 */
import React, {useState} from 'react';
import {TextInput, TouchableOpacity, View, Text} from 'react-native';
import {ImageBackground, StyleSheet} from 'react-native';
import Toast from 'react-native-toast-message';

import IMAGES from '../utilities/asset';
import UTILS from '../utilities/utils';
import TRANSLATIONS from '../translations/tranlastions';
import {type UserInfo} from './utility/types/types';

const Login = ({navigation, route}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigateToPubList = (userInfo: UserInfo) => {
    navigation.navigate({
      name: 'HomePubContainer',
      params: {hasUserOrGuestLoggedIn: true, userInfo},
      merge: true,
    });
  };

  const handleSignIn = () => {
    console.log('signed In');
    console.log(UTILS.serverBasePath);
    fetch(UTILS.serverBasePath + '/login', {
      headers: {'Content-Type': 'application/json'},
      method: 'POST',
      body: JSON.stringify({username: username, password: password}),
    })
      .then(res => res.json())
      .then(jsonRes => {
        console.log(jsonRes);
        Toast.show({
          type: jsonRes.error ? 'error' : 'success',
          text1: jsonRes.error
            ? TRANSLATIONS[jsonRes.error]
              ? TRANSLATIONS[jsonRes.error]
              : jsonRes.error
            : TRANSLATIONS['generic-success'],
          text2: jsonRes.error
            ? TRANSLATIONS['login-generic-error']
            : TRANSLATIONS['login-login-success'],
          position: 'bottom',
        });
        if (!jsonRes.error) {
          const objToRoute = {
            username: jsonRes.user.username,
            role: jsonRes.user.role,
          };
          navigateToPubList(objToRoute);
        }
      })
      .catch(error => console.log(error));
  };

  const handleSignUp = () => {
    console.log('signed Up');
    fetch(UTILS.serverBasePath + '/register', {
      headers: {'Content-Type': 'application/json'},
      method: 'POST',
      body: JSON.stringify({username: username, password: password}),
    })
      .then(res => res.json())
      .then(jsonRes => {
        console.log(jsonRes);
        Toast.show({
          type: jsonRes.error ? 'error' : 'success',
          text1: jsonRes.error
            ? TRANSLATIONS[jsonRes.error]
              ? TRANSLATIONS[jsonRes.error]
              : jsonRes.error
            : TRANSLATIONS['generic-success'],
          text2: jsonRes.message
            ? TRANSLATIONS[jsonRes.message]
              ? TRANSLATIONS[jsonRes.message]
              : jsonRes.message
            : TRANSLATIONS['generic-success'],
          position: 'bottom',
        });
        if (!jsonRes.error) {
          const objToRoute = {
            username: jsonRes.user.username,
            role: jsonRes.user.role,
          };
          navigateToPubList(objToRoute);
        }
      })
      .catch(error => console.log(error));
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={IMAGES['home-background']}
        resizeMode="cover"
        style={styles.backgroundImage}>
        <View style={styles.container} />
        <View style={styles.card}>
          <Text style={styles.headerTxt}>{TRANSLATIONS['login-header']}</Text>
          <TextInput
            style={styles.inputTxt}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
          <TextInput
            secureTextEntry={true}
            style={styles.inputTxt}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
          />
          <View style={styles.btnContainer}>
            <TouchableOpacity style={styles.btn} onPress={handleSignIn}>
              <Text style={styles.btnTxt}>
                {TRANSLATIONS['login-sing-in-btn']}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn} onPress={handleSignUp}>
              <Text style={styles.btnTxt}>
                {TRANSLATIONS['login-sign-up-btn']}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.container} />
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  card: {
    flex: 3,
    width: 300,
    height: 300,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  backgroundImage: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  inputTxt: {
    borderStyle: 'solid',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    width: '80%',
    height: '15%',
  },
  btnContainer: {flexDirection: 'row'},
  btn: {
    width: '40%',
    padding: 10,
    marginLeft: 10,
    marginRight: 10,
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 5,
    backgroundColor: 'pink',
  },
  btnTxt: {textAlign: 'center'},
  headerTxt: {textAlign: 'center', fontSize: 30},
});

export default Login;
