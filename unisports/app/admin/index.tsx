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

      {/* Create button */}
      <TouchableOpacity style={styles.createBtn} onPress={() => router.push('/admin/create-event')}>
        <Text style={styles.createBtnText}>+ Create New Event</Text>
      </TouchableOpacity>

      {/* Tabs */}
      <View style={styles.tabs}>
        {(['events', 'registrations'] as const).map(tab => (
          <TouchableOpacity key={tab} style={[styles.tab, activeTab === tab && styles.tabActive]} onPress={() => setActiveTab(tab)}>
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab === 'events' ? `Events (${events.length})` : `Registrations (${regs.length})`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? <ActivityIndicator color="#4F46E5" style={{ marginTop: 30 }} /> : (
        <ScrollView style={{ flex: 1 }}>
          {activeTab === 'events' ? (
            events.map(event => {
              const cat = CATEGORIES.find(c => c.id === event.category);
              return (
                <View key={event.id} style={styles.card}>
                  <View style={styles.cardRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.cardTitle}>{event.title}</Text>
                      <Text style={styles.cardMeta}>{event.sport} · {cat?.label}</Text>
                      <Text style={styles.cardMeta}>📅 {event.date ? new Date(event.date.seconds * 1000).toDateString() : 'TBD'}</Text>
                      <Text style={styles.cardMeta}>👥 {event.registeredCount ?? 0} / {event.maxParticipants} registered</Text>
                    </View>
                    <View style={styles.cardActions}>
                      <TouchableOpacity style={styles.deleteBtn} onPress={() => deleteEvent(event.id, event.title)}>
                        <Text style={styles.deleteBtnText}>🗑️</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })
          ) : (
            regs.map(reg => (
              <View key={reg.id} style={styles.card}>
                <Text style={styles.cardTitle}>{reg.userName}</Text>
                <Text style={styles.cardMeta}>Faculty: {reg.faculty}</Text>
                <Text style={styles.cardMeta}>Event ID: {reg.eventId}</Text>
                <View style={[styles.statusBadge, { backgroundColor: reg.status === 'confirmed' ? '#22c55e22' : '#f59e0b22' }]}>
                  <Text style={{ color: reg.status === 'confirmed' ? '#22c55e' : '#f59e0b', fontSize: 12, fontWeight: '700' }}>{reg.status}</Text>
                </View>
              </View>
            ))
          )}
          <View style={{ height: 30 }} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  statsRow: { flexDirection: 'row', padding: 16, gap: 10 },
  statCard: { flex: 1, backgroundColor: '#1e293b', borderRadius: 10, padding: 14, borderTopWidth: 3 },
  statNumber: { fontSize: 28, fontWeight: 'bold' },
  statLabel: { color: '#64748b', fontSize: 12, marginTop: 2 },
  createBtn: { backgroundColor: '#4F46E5', marginHorizontal: 16, borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginBottom: 16 },
  createBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  tabs: { flexDirection: 'row', marginHorizontal: 16, backgroundColor: '#1e293b', borderRadius: 10, padding: 4, marginBottom: 12 },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  tabActive: { backgroundColor: '#4F46E5' },
  tabText: { color: '#64748b', fontWeight: '600', fontSize: 13 },
  tabTextActive: { color: '#fff' },
  card: { backgroundColor: '#1e293b', borderRadius: 10, padding: 14, marginHorizontal: 16, marginBottom: 10 },
  cardRow: { flexDirection: 'row', alignItems: 'flex-start' },
  cardTitle: { color: '#fff', fontSize: 15, fontWeight: 'bold', marginBottom: 4 },
  cardMeta: { color: '#64748b', fontSize: 13, marginTop: 2 },
  cardActions: { marginLeft: 8 },
  deleteBtn: { backgroundColor: '#ef444422', borderRadius: 8, padding: 10 },
  deleteBtnText: { fontSize: 18 },
  statusBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, marginTop: 6 },
});
