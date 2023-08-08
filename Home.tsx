import React from 'react';
import {ImageBackground, StyleSheet, View} from 'react-native';

const HomePage = ({navigation, route}) => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('./assets/home-background.webp')}
        resizeMode="cover"
        style={styles.image}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  image: {flex: 1, justifyContent: 'center'},
});

export default HomePage;
