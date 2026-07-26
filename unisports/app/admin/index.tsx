import { router } from 'expo-router';
import { collection, deleteDoc, doc, getDocs, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CATEGORIES } from '../../constants/sports';
import { db } from '../../firebaseConfig';

export default function AdminDashboard() {
  const [events, setEvents] = useState<any[]>([]);
  const [regs, setRegs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'events' | 'registrations'>('events');

  const fetchData = async () => {
    setLoading(true);
    try {
      const evSnap = await getDocs(query(collection(db, 'events'), orderBy('date')));
      setEvents(evSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      const regSnap = await getDocs(query(collection(db, 'registrations'), orderBy('registeredAt', 'desc')));
      setRegs(regSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) { console.log(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const deleteEvent = (id: string, title: string) => {
    Alert.alert('Delete Event', `Delete "${title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => { await deleteDoc(doc(db, 'events', id)); fetchData(); } }
    ]);
  };

  const stats = [
    { label: 'Total Events', value: events.length, color: '#4F46E5' },
    { label: 'Registrations', value: regs.length, color: '#059669' },
    { label: 'This Month', value: events.filter(e => e.date && new Date(e.date.seconds * 1000).getMonth() === new Date().getMonth()).length, color: '#D97706' },
  ];

  return (
    <View style={styles.container}>
      {/* Stats */}
      <View style={styles.statsRow}>
        {stats.map((s, i) => (
          <View key={i} style={[styles.statCard, { borderTopColor: s.color }]}>
            <Text style={[styles.statNumber, { color: s.color }]}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>
      </View>

      )
      }