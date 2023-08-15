import React from 'react';
import {
  Image,
  ImageBackground,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

const HomePage = ({onNavigate}) => {
  const onPressCustomer = () => {
    onNavigate('Login');
  };
  const onPressGuest = () => {
    onNavigate('Help');
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/home-neutral-background-img.jpeg')}
        resizeMode="cover"
        style={styles.backgroundImage}>
        <View style={styles.imageContainer}>
          <Image
            source={require('../assets/FTB_PubManager_LOGO-removebg-preview.png')}
            style={styles.image}
          />
        </View>
        <View style={styles.loginBtnCotainer}>
          <TouchableOpacity style={styles.guestBtn} onPress={onPressGuest}>
            <ImageBackground
              imageStyle={styles.backgroundImgBtnImageStyle}
              style={styles.backgroundImgBtn}
              resizeMode="cover"
              source={require('../assets/home-guest-btn-img.webp')}>
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
