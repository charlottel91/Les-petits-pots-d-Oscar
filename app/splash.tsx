import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const SPLASH_DURATION = 4000;
const ZOOM_DURATION = 900;

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withTiming(1.15, {
        duration: ZOOM_DURATION,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true,
    );

    const timer = setTimeout(onFinish, SPLASH_DURATION);
    return () => clearTimeout(timer);
  }, [onFinish, scale]);

  const animatedImageStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.background}>
      <Animated.View style={styles.container}>
        <Animated.Image
          source={require('@/assets/images/baby.png')}
          style={[styles.image, animatedImageStyle]}
        />
        <Text style={styles.text}>Les petits pots d&apos;Oscar !</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(145, 7, 145, 0.7)',
    padding: 20,
  },
  image: {
    height: 200,
    width: 200,
    marginBottom: 40,
    backgroundColor: 'transparent',
  },
  text: {
    marginTop: 20,
    fontSize: 38,
    fontWeight: 'bold',
    color: '#FEFEFE',
  },
});
