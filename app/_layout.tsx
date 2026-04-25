import { Slot, useRouter, useSegments } from 'expo-router';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import * as ExpoSplashScreen from 'expo-splash-screen';
import SplashScreen from './splash';

export default function RootLayout() {
  return (
    <AuthProvider>
      <AuthChecker />
    </AuthProvider>
  );
}

const AuthChecker = () => {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    const prepareApp = async () => {
      try {
        // Attends 3 secondes (ou charge des données)
        await new Promise((resolve) => setTimeout(resolve, 3000));
      } catch (error) {
        console.error('Erreur lors du chargement :', error);
      } finally {
        setIsAppReady(true);
      }
    };

    prepareApp();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    if (!segments.length) return;

    if (!user && !inAuthGroup) {
      router.replace('/');
    } else if (user && inAuthGroup) {
      router.replace('/(tabs)/home');
    }
  }, [user, isLoading, segments]);

  if (!isAppReady) {
    return <SplashScreen onFinish={() => setIsAppReady(true)} />;
  }

  return (
    <Slot
      screenOptions={() => ({
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        animation: 'fade',
      })}
    />
  );
};
