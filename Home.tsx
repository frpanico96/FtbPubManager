import React from 'react';
import {Button, Text} from 'react-native';

const HomePage = ({navigation, route}) => {
  return <Text>This is {route.params.name}s Home Page</Text>;
};

export default HomePage;
