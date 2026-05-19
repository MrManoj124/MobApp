import { router } from 'expo-router';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CATEGORIES } from '../../constants/sports';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebaseConfig';

export default function HomeScreen() {
  const { profile } = useAuth();
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUpcoming = async () => {
      try {
        const q = query(collection(db, 'events'), orderBy('date'), limit(3));
        const snap = await getDocs(q);
        setUpcoming(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (e) {
        console.log(e);
      } finally { setLoading(false); }
    };
    fetchUpcoming();
  }, []);

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.welcome}>Welcome back 👋</Text>
        <Text style={styles.name}>{profile?.name ?? 'Athlete'}</Text>
        <Text style={styles.faculty}>{profile?.faculty}</Text>
      </View>

      {/* Category Cards */}
      <Text style={styles.sectionTitle}>Game Categories</Text>
      <View style={styles.grid}>
        {CATEGORIES.map(cat => (
          <TouchableOpacity key={cat.id} style={[styles.catCard, { borderLeftColor: cat.color }]}
            onPress={() => router.push({ pathname: '/(tabs)/events', params: { category: cat.id } })}>
            <Text style={styles.catIcon}>{cat.icon}</Text>
            <Text style={styles.catLabel}>{cat.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Upcoming Events */}
      <Text style={styles.sectionTitle}>Upcoming Events</Text>
      {loading ? <ActivityIndicator color="#4F46E5" style={{ marginTop: 20 }} /> :
        upcoming.length === 0 ? <Text style={styles.empty}>No upcoming events</Text> :
          upcoming.map(event => (
            <TouchableOpacity key={event.id} style={styles.eventCard}
              onPress={() => router.push(`/event/${event.id}`)}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.sportIcon}>{event.icon ?? '🏅'}</Text>
              </View>
              <Text style={styles.eventMeta}>{event.sport} · {event.venue}</Text>
              <Text style={styles.eventDate}>{new Date(event.date?.seconds * 1000).toDateString()}</Text>
              <View style={[styles.categoryBadge, { backgroundColor: CATEGORIES.find(c => c.id === event.category)?.color + '22' }]}>
                <Text style={[styles.categoryBadgeText, { color: CATEGORIES.find(c => c.id === event.category)?.color }]}>
                  {CATEGORIES.find(c => c.id === event.category)?.label}
                </Text>
              </View>
            </TouchableOpacity>
          ))
      }
      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  header: { padding: 24, paddingTop: 40, backgroundColor: '#1e293b', marginBottom: 8 },
  welcome: { color: '#94a3b8', fontSize: 14 },
  name: { color: '#fff', fontSize: 28, fontWeight: 'bold', marginTop: 4 },
  faculty: { color: '#4F46E5', fontSize: 14, marginTop: 4 },
  sectionTitle: { color: '#94a3b8', fontSize: 13, fontWeight: '700', letterSpacing: 1, paddingHorizontal: 20, marginTop: 24, marginBottom: 12, textTransform: 'uppercase' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, gap: 10 },
  catCard: { width: '47%', backgroundColor: '#1e293b', borderRadius: 12, padding: 16, borderLeftWidth: 4, marginHorizontal: 4 },
  catIcon: { fontSize: 28, marginBottom: 8 },
  catLabel: { color: '#fff', fontSize: 14, fontWeight: '700' },
  eventCard: { backgroundColor: '#1e293b', borderRadius: 12, padding: 16, marginHorizontal: 16, marginBottom: 12 },
  eventTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold', flex: 1 },
  sportIcon: { fontSize: 20 },
  eventMeta: { color: '#94a3b8', fontSize: 13, marginTop: 4 },
  eventDate: { color: '#64748b', fontSize: 12, marginTop: 2 },
  categoryBadge: { marginTop: 10, alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  categoryBadgeText: { fontSize: 12, fontWeight: '700' },
  empty: { color: '#64748b', textAlign: 'center', marginTop: 20 },
});
