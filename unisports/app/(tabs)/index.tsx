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

      
      ))}
    </View>
  );
}
