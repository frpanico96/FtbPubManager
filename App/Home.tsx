/**@frpanico
 * UI file for the HomePage
 * the Home allows to login or join as a guest
 */
import React from 'react';
import {
  Image,
  ImageBackground,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import IMAGES from '../utilities/asset';

type HomePageProps = {
  onNavigate: Function;
};

const HomePage = ({onNavigate}: HomePageProps) => {
  const onPressCustomer = () => {
    onNavigate('Login');
  };
  const onPressGuest = () => {
    onNavigate('Guest');
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={IMAGES['home-background']}
        resizeMode="cover"
        style={styles.backgroundImage}>
        <View style={styles.imageContainer}>
          <Image source={IMAGES['home-logo']} style={styles.image} />
        </View>
        <View style={styles.loginBtnCotainer}>
          <TouchableOpacity style={styles.guestBtn} onPress={onPressGuest}>
            <ImageBackground
              imageStyle={styles.backgroundImgBtnImageStyle}
              style={styles.backgroundImgBtn}
              resizeMode="cover"
              source={IMAGES['home-guest-btn']}>
              <Text style={styles.guestBtnTxt}>I am a Guest</Text>
            </ImageBackground>
          </TouchableOpacity>
          <Text onPress={onPressCustomer}>Login as Customer</Text>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  backgroundImage: {flex: 1},
  image: {flex: 1, width: null, height: null, resizeMode: 'contain'},
  imageContainer: {flex: 1},
  loginBtnCotainer: {
    padding: 100,
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  backgroundImgBtn: {
    padding: 10,
    borderRadius: 10,
    width: 300,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundImgBtnImageStyle: {
    borderRadius: 6,
  },
  guestBtn: {},
  guestBtnTxt: {
    fontSize: 30,
    color: '#CCDDFF',
  },
});

export default HomePage;
