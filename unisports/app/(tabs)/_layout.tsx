import { Tabs } from 'expo-router';
import { Home, CalendarDays, ClipboardList, User } from 'lucide-react-native';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: '#4F46E5',
      tabBarInactiveTintColor: '#64748b',
      tabBarStyle: { backgroundColor: '#0f172a', borderTopColor: '#1e293b', height: 60, paddingBottom: 8 },
      tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      headerStyle: { backgroundColor: '#0f172a' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold' },
    }}>
      <Tabs.Screen name="index"     options={{ title: 'Home',       tabBarIcon: ({ color }) => <Home size={22} color={color} /> }} />
      <Tabs.Screen name="events"    options={{ title: 'Events',     tabBarIcon: ({ color }) => <CalendarDays size={22} color={color} /> }} />
      <Tabs.Screen name="my-events" options={{ title: 'My Events',  tabBarIcon: ({ color }) => <ClipboardList size={22} color={color} /> }} />
      <Tabs.Screen name="profile"   options={{ title: 'Profile',    tabBarIcon: ({ color }) => <User size={22} color={color} /> }} />
    </Tabs>
  );
}
