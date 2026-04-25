import { Tabs } from 'expo-router';

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={() => ({
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: 'gray',
        // headerShown: false,
        animation: 'fade',
      })}
    >
      <Tabs.Screen name='home' options={{ title: 'Accueil' }} />
      <Tabs.Screen name='profile' options={{ title: 'Mon compte' }} />
    </Tabs>
  );
}
