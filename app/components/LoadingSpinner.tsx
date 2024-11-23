// First create LoadingSpinner component (new file LoadingSpinner.tsx)
import React from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { theme } from '../utils/theme';

const LoadingSpinner = () => {
  const spinValue = new Animated.Value(0);

  React.useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.spinner,
          { transform: [{ rotate: spin }] }
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 4,
    borderColor: theme.darkGreen,
    borderTopColor: theme.sharpGreen,
  },
});

export default LoadingSpinner;