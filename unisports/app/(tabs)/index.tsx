import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const quickStats = [
  { label: 'Upcoming', value: '3', color: '#4F46E5' },
  { label: 'Joined', value: '2', color: '#059669' },
  { label: 'Open Spots', value: '14', color: '#D97706' },
];

const featuredEvents = [
  { id: '1', title: 'Faculty Football Cup', time: 'Saturday · 10:00 AM', venue: 'Main Field' },
  { id: '2', title: 'Indoor Badminton Sprint', time: 'Sunday · 2:00 PM', venue: 'Sports Hall' },
];

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome back</Text>
      <Text style={styles.subtitle}>Find your next game, join a team, and keep track of your activity.</Text>

      <View style={styles.heroCard}>
        <Text style={styles.heroBadge}>This week</Text>
        <Text style={styles.heroTitle}>3 new sports events are waiting for you</Text>
        <Text style={styles.heroText}>Browse the schedule, register quickly, and stay ahead of your plans.</Text>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => router.push('/(tabs)/events' as any)}>
          <Text style={styles.primaryBtnText}>Browse Events</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsRow}>
        {quickStats.map((item) => (
          <View key={item.label} style={styles.statCard}>
            <Text style={[styles.statValue, { color: item.color }]}>{item.value}</Text>
            <Text style={styles.statLabel}>{item.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Featured</Text>
      </View>

      {featuredEvents.map((event) => (
        <View key={event.id} style={styles.card}>
          <Text style={styles.cardTitle}>{event.title}</Text>
          <Text style={styles.cardMeta}>{event.time}</Text>
          <Text style={styles.cardMeta}>📍 {event.venue}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', padding: 16 },
  title: { color: '#fff', fontSize: 24, fontWeight: '700' },
  subtitle: { color: '#64748b', fontSize: 14, marginTop: 4, marginBottom: 16 },
  heroCard: { backgroundColor: '#1e293b', borderRadius: 16, padding: 16, marginBottom: 16 },
  heroBadge: { color: '#4F46E5', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', marginBottom: 6 },
  heroTitle: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 6 },
  heroText: { color: '#94a3b8', fontSize: 13, marginBottom: 14 },
  primaryBtn: { backgroundColor: '#4F46E5', borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  primaryBtnText: { color: '#fff', fontWeight: '700' },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  statCard: { flex: 1, backgroundColor: '#1e293b', borderRadius: 10, padding: 12 },
  statValue: { fontSize: 20, fontWeight: '700' },
  statLabel: { color: '#64748b', fontSize: 12, marginTop: 2 },
  sectionHeader: { marginBottom: 10 },
  sectionTitle: { color: '#fff', fontSize: 16, fontWeight: '700' },
  card: { backgroundColor: '#1e293b', borderRadius: 12, padding: 14, marginBottom: 10 },
  cardTitle: { color: '#fff', fontSize: 15, fontWeight: '700', marginBottom: 4 },
  cardMeta: { color: '#64748b', fontSize: 13, marginTop: 2 },
});
