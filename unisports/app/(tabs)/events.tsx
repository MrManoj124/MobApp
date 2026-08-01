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

      
    </ScrollView>
  );
}
