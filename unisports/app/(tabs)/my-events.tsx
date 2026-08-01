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
