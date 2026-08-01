import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const eventList = [
  {
    id: 'cricket',
    title: 'Faculty Cricket Championship',
    sport: 'Cricket',
    venue: 'Main Ground',
    date: 'Saturday · 8:00 AM',
    category: 'Faculty',
    description: 'Open tournament for all faculty teams with a friendly competition format.',
    spots: 8,
  },
  {
    id: 'badminton',
    title: 'Inter-Department Badminton',
    sport: 'Badminton',
    venue: 'Sports Hall',
    date: 'Sunday · 4:00 PM',
    category: 'Department',
    description: 'Single and double matches for students who want a quick game.',
    spots: 12,
  },
];

export default function EventsScreen() {
  const [joined, setJoined] = useState<string[]>(['cricket']);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Available events</Text>
      <Text style={styles.subtitle}>Choose an event and tap join to reserve your spot.</Text>

      {eventList.map((event) => {
        const isJoined = joined.includes(event.id);

        return (
          <View key={event.id} style={styles.card}>
            <View style={styles.cardTop}>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{event.title}</Text>
                <Text style={styles.cardMeta}>{event.sport} · {event.venue}</Text>
                <Text style={styles.cardMeta}>{event.date}</Text>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{event.category}</Text>
              </View>
            </View>

            <Text style={styles.cardDesc}>{event.description}</Text>

            <View style={styles.footerRow}>
              <Text style={styles.spotsText}>{event.spots} spots left</Text>
              <TouchableOpacity
                style={[styles.joinBtn, isJoined && styles.joinBtnActive]}
                onPress={() => {
                  setJoined((prev) =>
                    prev.includes(event.id) ? prev.filter((id) => id !== event.id) : [...prev, event.id]
                  );
                }}
              >
                <Text style={[styles.joinBtnText, isJoined && styles.joinBtnTextActive]}>{isJoined ? 'Joined' : 'Join'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  content: { padding: 16, paddingBottom: 30 },
  title: { color: '#fff', fontSize: 22, fontWeight: '700' },
  subtitle: { color: '#64748b', fontSize: 13, marginTop: 4, marginBottom: 12 },
  card: { backgroundColor: '#1e293b', borderRadius: 12, padding: 14, marginBottom: 12 },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start' },
  cardTitle: { color: '#fff', fontSize: 15, fontWeight: '700', marginBottom: 4 },
  cardMeta: { color: '#64748b', fontSize: 13, marginTop: 2 },
  badge: { marginLeft: 8, backgroundColor: '#4F46E522', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  badgeText: { color: '#4F46E5', fontSize: 12, fontWeight: '700' },
  cardDesc: { color: '#94a3b8', fontSize: 13, marginTop: 10, lineHeight: 18 },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  spotsText: { color: '#64748b', fontSize: 12 },
  joinBtn: { backgroundColor: '#334155', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8 },
  joinBtnActive: { backgroundColor: '#4F46E5' },
  joinBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  joinBtnTextActive: { color: '#fff' },
});
