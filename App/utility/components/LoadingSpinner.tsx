/**@frpanico
 * Utility Component
 * Showing a loading spinner
 * Accepts params
 * -- size
 * -- color
 */
import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';

type SpinnerProps = {
  size: string;
  color: string;
};

const LoadingSpinner: React.FC<SpinnerProps> = ({size, color}) => {
  console.log('### size ' + size);
  console.log('### color ' + color);
  return (
    <View style={styles.container}>
      <ActivityIndicator style={styles.spinner} size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center'},
  spinner: {padding: 10},
})

export default LoadingSpinner;
