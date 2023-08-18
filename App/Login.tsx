/**@frpanico
 * UI login file
 * From this page the user can log in or sign up
 */
import React, {useState} from 'react';
import {TextInput, TouchableOpacity, View, Text} from 'react-native';
import {ImageBackground, StyleSheet} from 'react-native';
import Toast from 'react-native-toast-message';
import IMAGES from '../assets/asset';

const URL_SEVER_PATH = 'http://localhost:5001/api/auth/';

const Login = ({navigation, route}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigateToPubList = userInfo => {
    navigation.navigate({
      name: 'HomePubContainer',
      params: {hasUserOrGuestLoggedIn: true, userInfo},
      merge: true,
    });
  };

  const handleSignIn = () => {
    console.log('signed In');
    console.log(username);
    console.log(password);
    console.log({username, password});
    fetch(URL_SEVER_PATH + '/login', {
      headers: {'Content-Type': 'application/json'},
      method: 'POST',
      body: JSON.stringify({username: username, password: password}),
    })
      .then(res => res.json())
      .then(jsonRes => {
        Toast.show({
          type: jsonRes.error ? 'error' : 'success',
          text1: jsonRes.error ? jsonRes.error : 'Success',
          text2: jsonRes.error
            ? 'Check username and password or Register now!'
            : 'Login Successfully',
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
    fetch(URL_SEVER_PATH + '/register', {
      headers: {'Content-Type': 'application/json'},
      method: 'POST',
      body: JSON.stringify({username: username, password: password}),
    })
      .then(res => res.json())
      .then(jsonRes => {
        console.log(jsonRes);
        Toast.show({
          type: jsonRes.error ? 'error' : 'success',
          text1: jsonRes.error ? jsonRes.error : 'Success',
          text2: jsonRes.error
            ? 'Try registering again'
            : 'Registration was Successfull',
          position: 'bottom',
        });
        if (!jsonRes.error) {
          navigateToPubList();
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
        <View style={{flex: 1}} />
        <View style={styles.card}>
          <Text style={styles.headerTxt}>Sign In or Register!</Text>
          <TextInput
            style={styles.inputTxt}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
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
              <Text style={styles.btnTxt}>Sign In</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn} onPress={handleSignUp}>
              <Text style={styles.btnTxt}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{flex: 1}} />
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
