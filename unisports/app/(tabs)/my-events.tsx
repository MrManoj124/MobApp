import { router } from 'expo-router';
import { collection, deleteDoc, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CATEGORIES } from '../../constants/sports';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebaseConfig';

interface Registration {
  id: string;
  eventId: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  registeredAt: any;
  event?: any;
}

export default function MyEventsScreen() {
  const { user } = useAuth();
  const [regs, setRegs] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRegs = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const q = query(collection(db, 'registrations'), where('userId', '==', user.uid));
      const snap = await getDocs(q);
      const data = await Promise.all(snap.docs.map(async d => {
        const reg = { id: d.id, ...d.data() } as Registration;
        const eventSnap = await getDoc(doc(db, 'events', reg.eventId));
        reg.event = eventSnap.exists() ? { id: eventSnap.id, ...eventSnap.data() } : null;
        return reg;
      }));
      setRegs(data.filter(r => r.status !== 'cancelled'));
    } catch (e) { console.log(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchRegs(); }, [user]);

  const cancelReg = async (regId: string) => {
    Alert.alert('Cancel Registration', 'Are you sure you want to cancel?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes, Cancel', style: 'destructive', onPress: async () => {
          await deleteDoc(doc(db, 'registrations', regId));
          fetchRegs();
        }
      }
    ]);
  };

  const statusColor = (s: string) => s === 'confirmed' ? '#22c55e' : s === 'pending' ? '#f59e0b' : '#ef4444';

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Registrations</Text>
      {loading ? <ActivityIndicator color="#4F46E5" style={{ marginTop: 40 }} /> :
        regs.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyIcon}>🏅</Text>
            <Text style={styles.emptyText}>You haven't registered for any events yet.</Text>
            <TouchableOpacity style={styles.browseBtn} onPress={() => router.push('/(tabs)/events')}>
              <Text style={styles.browseBtnText}>Browse Events</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView>
            {regs.map(reg => {
              const cat = CATEGORIES.find(c => c.id === reg.event?.category);
              return (
                <View key={reg.id} style={styles.card}>
                  <View style={styles.cardTop}>
                    <Text style={styles.title}>{reg.event?.title ?? 'Unknown Event'}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: statusColor(reg.status) + '22' }]}>
                      <Text style={[styles.statusText, { color: statusColor(reg.status) }]}>{reg.status}</Text>
                    </View>
                  </View>
                  <Text style={styles.sport}>🏅 {reg.event?.sport}</Text>
                  {cat && (
                    <View style={[styles.catBadge, { backgroundColor: cat.color + '22' }]}>
                      <Text style={[styles.catText, { color: cat.color }]}>{cat.icon} {cat.label}</Text>
                    </View>
                  )}
                  <Text style={styles.date}>
                    📅 {reg.event?.date ? new Date(reg.event.date.seconds * 1000).toDateString() : 'TBD'}
                  </Text>
                  <Text style={styles.venue}>📍 {reg.event?.venue}</Text>
                  <Text style={styles.regDate}>
                    Registered: {reg.registeredAt ? new Date(reg.registeredAt.seconds * 1000).toLocaleDateString() : ''}
                  </Text>
                  <View style={styles.actions}>
                    <TouchableOpacity style={styles.detailBtn} onPress={() => router.push(`/event/${reg.eventId}`)}>
                      <Text style={styles.detailBtnText}>View Details</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cancelBtn} onPress={() => cancelReg(reg.id)}>
                      <Text style={styles.cancelBtnText}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
            <View style={{ height: 30 }} />
          </ScrollView>
        )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', paddingTop: 16 },
  heading: { color: '#fff', fontSize: 22, fontWeight: 'bold', paddingHorizontal: 20, marginBottom: 16 },
  card: { backgroundColor: '#1e293b', borderRadius: 12, padding: 16, marginHorizontal: 16, marginBottom: 12 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 },
  title: { color: '#fff', fontSize: 16, fontWeight: 'bold', flex: 1, marginRight: 8 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusText: { fontSize: 12, fontWeight: '700', textTransform: 'capitalize' },
  sport: { color: '#94a3b8', fontSize: 13, marginBottom: 8 },
  catBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, marginBottom: 8 },
  catText: { fontSize: 12, fontWeight: '700' },
  date: { color: '#64748b', fontSize: 13, marginBottom: 2 },
  venue: { color: '#475569', fontSize: 12, marginBottom: 4 },
  regDate: { color: '#334155', fontSize: 11, marginBottom: 12 },
  actions: { flexDirection: 'row', gap: 10 },
  detailBtn: { flex: 1, backgroundColor: '#4F46E5', borderRadius: 8, paddingVertical: 10, alignItems: 'center' },
  detailBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  cancelBtn: { flex: 1, backgroundColor: '#ef444422', borderRadius: 8, paddingVertical: 10, alignItems: 'center', borderWidth: 1, borderColor: '#ef4444' },
  cancelBtnText: { color: '#ef4444', fontWeight: '700', fontSize: 14 },
  emptyBox: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80 },
  emptyIcon: { fontSize: 60, marginBottom: 16 },
  emptyText: { color: '#475569', fontSize: 16, textAlign: 'center', marginBottom: 24 },
  browseBtn: { backgroundColor: '#4F46E5', paddingHorizontal: 28, paddingVertical: 14, borderRadius: 10 },
  browseBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
