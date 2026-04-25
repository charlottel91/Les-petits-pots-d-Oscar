import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Image } from 'expo-image';
import { useState } from 'react';
import { StyleSheet } from 'react-native';
import LoginScreen from './login';
import RegisterScreen from './register';

export default function Auth() {
  const [isSignin, setSignin] = useState(true);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ dark: '#000', light: '#FFF' }}
      headerImage={
        <Image
          source={require('@/assets/images/baby-eat.png')}
          style={styles.image}
        />
      }
    >
      <ThemedView style={styles.container}>
        <ThemedText type='title' style={styles.title}>
          Les petits pots d&apos;Oscar
        </ThemedText>
        {isSignin ? (
          <LoginScreen handlePressForm={() => setSignin(false)} />
        ) : (
          <RegisterScreen handlePressForm={() => setSignin(true)} />
        )}
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  image: {
    height: 400,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 25,
  },
  title: {
    marginBottom: 30,
  },
});
