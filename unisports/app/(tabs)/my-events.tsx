import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

const myEvents = [
  { id: '1', title: 'Faculty Cricket Championship', date: 'Sat · 8:00 AM', venue: 'Main Ground', status: 'Confirmed' },
  { id: '2', title: 'Indoor Badminton Sprint', date: 'Sun · 2:00 PM', venue: 'Sports Hall', status: 'Pending' },
];

export default function MyEventsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>My events</Text>
      <Text style={styles.subtitle}>These are the sports activities you joined.</Text>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryValue}>2</Text>
        <Text style={styles.summaryLabel}>Events joined this month</Text>
      </View>

      {myEvents.map((event) => (
        <View key={event.id} style={styles.card}>
          <Text style={styles.cardTitle}>{event.title}</Text>
          <Text style={styles.cardMeta}>{event.date}</Text>
          <Text style={styles.cardMeta}>📍 {event.venue}</Text>
          <View style={[styles.statusBadge, event.status === 'Confirmed' ? styles.statusConfirmed : styles.statusPending]}>
            <Text style={styles.statusText}>{event.status}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  content: { padding: 16, paddingBottom: 30 },
  title: { color: '#fff', fontSize: 22, fontWeight: '700' },
  subtitle: { color: '#64748b', fontSize: 13, marginTop: 4, marginBottom: 12 },
  summaryCard: { backgroundColor: '#1e293b', borderRadius: 12, padding: 14, marginBottom: 12 },
  summaryValue: { color: '#fff', fontSize: 24, fontWeight: '700' },
  summaryLabel: { color: '#64748b', fontSize: 13, marginTop: 4 },
  card: { backgroundColor: '#1e293b', borderRadius: 12, padding: 14, marginBottom: 12 },
  cardTitle: { color: '#fff', fontSize: 15, fontWeight: '700', marginBottom: 4 },
  cardMeta: { color: '#64748b', fontSize: 13, marginTop: 2 },
  statusBadge: { alignSelf: 'flex-start', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4, marginTop: 8 },
  statusConfirmed: { backgroundColor: '#22c55e22' },
  statusPending: { backgroundColor: '#f59e0b22' },
  statusText: { color: '#fff', fontSize: 12, fontWeight: '700' },
});
