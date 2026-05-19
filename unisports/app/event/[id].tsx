import { router, useLocalSearchParams } from 'expo-router';
import { addDoc, collection, doc, getDoc, getDocs, increment, query, Timestamp, updateDoc, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CATEGORIES, SPORTS } from '../../constants/sports';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebaseConfig';

export default function EventDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user, profile } = useAuth();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      const snap = await getDoc(doc(db, 'events', id));
      if (snap.exists()) setEvent({ id: snap.id, ...snap.data() });
      // Check existing registration
      if (user) {
        const q = query(collection(db, 'registrations'), where('eventId', '==', id), where('userId', '==', user.uid), where('status', '!=', 'cancelled'));
        const regSnap = await getDocs(q);
        setAlreadyRegistered(!regSnap.empty);
      }
      setLoading(false);
    };
    load();
  }, [id, user]);

  const handleRegister = async () => {
    if (!user || !profile || !event) return;
    const slots = (event.maxParticipants ?? 0) - (event.registeredCount ?? 0);
    if (slots <= 0) { Alert.alert('Full', 'This event is already full.'); return; }

    setRegistering(true);
    try {
      await addDoc(collection(db, 'registrations'), {
        eventId: id,
        userId: user.uid,
        userName: profile.name,
        faculty: profile.faculty,
        status: 'confirmed',
        registeredAt: Timestamp.now(),
      });
      await updateDoc(doc(db, 'events', id!), { registeredCount: increment(1) });
      setAlreadyRegistered(true);
      setEvent((prev: any) => ({ ...prev, registeredCount: (prev.registeredCount ?? 0) + 1 }));
      Alert.alert('Success! 🎉', 'You have been registered for this event.');
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally { setRegistering(false); }
  };

  if (loading) return <View style={styles.center}><ActivityIndicator color="#4F46E5" size="large" /></View>;
  if (!event) return <View style={styles.center}><Text style={styles.notFound}>Event not found.</Text></View>;

  const cat = CATEGORIES.find(c => c.id === event.category);
  const sport = SPORTS.find(s => s.id === event.sportId);
  const slots = (event.maxParticipants ?? 0) - (event.registeredCount ?? 0);

  return (
    <ScrollView style={styles.container}>
      {/* Banner */}
      <View style={[styles.banner, { backgroundColor: cat?.color ?? '#4F46E5' }]}>
        <Text style={styles.bannerIcon}>{sport?.icon ?? '🏅'}</Text>
        <Text style={styles.bannerSport}>{event.sport}</Text>
        <View style={styles.typeBadge}>
          <Text style={styles.typeBadgeText}>{event.sportType === 'indoor' ? '🏠 Indoor' : '☀️ Outdoor'}</Text>
        </View>
      </View>

      <View style={styles.body}>
        {/* Category badge */}
        {cat && (
          <View style={[styles.catBadge, { backgroundColor: cat.color + '22' }]}>
            <Text style={[styles.catBadgeText, { color: cat.color }]}>{cat.icon} {cat.label}</Text>
          </View>
        )}
        <Text style={styles.title}>{event.title}</Text>
        <Text style={styles.description}>{event.description}</Text>

        {/* Details grid */}
        <View style={styles.grid}>
          {[
            { label: 'Date', value: event.date ? new Date(event.date.seconds * 1000).toDateString() : 'TBD', icon: '📅' },
            { label: 'Venue', value: event.venue, icon: '📍' },
            { label: 'Sport', value: event.sport, icon: sport?.icon ?? '🏅' },
            { label: 'Slots', value: slots > 0 ? `${slots} remaining` : 'Full', icon: '👥' },
          ].map((item, i) => (
            <View key={i} style={styles.gridItem}>
              <Text style={styles.gridIcon}>{item.icon}</Text>
              <Text style={styles.gridLabel}>{item.label}</Text>
              <Text style={[styles.gridValue, item.label === 'Slots' && { color: slots <= 0 ? '#ef4444' : slots <= 5 ? '#f59e0b' : '#22c55e' }]}>
                {item.value}
              </Text>
            </View>
          ))}
        </View>

        {/* Register button */}
        {alreadyRegistered ? (
          <View style={styles.registeredBox}>
            <Text style={styles.registeredText}>✅ You are registered for this event</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/my-events')}>
              <Text style={styles.viewRegsLink}>View My Registrations →</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.registerBtn, (registering || slots <= 0) && styles.registerBtnDisabled]}
            onPress={handleRegister} disabled={registering || slots <= 0}>
            {registering ? <ActivityIndicator color="#fff" /> :
              <Text style={styles.registerBtnText}>{slots <= 0 ? 'Event Full' : 'Register for this Event'}</Text>}
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a' },
  notFound: { color: '#64748b', fontSize: 18 },
  banner: { height: 180, justifyContent: 'center', alignItems: 'center' },
  bannerIcon: { fontSize: 60 },
  bannerSport: { color: 'rgba(255,255,255,0.9)', fontSize: 16, fontWeight: '700', marginTop: 4 },
  typeBadge: { marginTop: 8, backgroundColor: 'rgba(0,0,0,0.25)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  typeBadgeText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  body: { padding: 20 },
  catBadge: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginBottom: 12 },
  catBadgeText: { fontSize: 13, fontWeight: '700' },
  title: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  description: { color: '#94a3b8', fontSize: 15, lineHeight: 22, marginBottom: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
  gridItem: { width: '47%', backgroundColor: '#1e293b', borderRadius: 10, padding: 14 },
  gridIcon: { fontSize: 20, marginBottom: 6 },
  gridLabel: { color: '#64748b', fontSize: 12, marginBottom: 4 },
  gridValue: { color: '#fff', fontSize: 14, fontWeight: '700' },
  registerBtn: { backgroundColor: '#4F46E5', borderRadius: 12, paddingVertical: 16, alignItems: 'center' },
  registerBtnDisabled: { backgroundColor: '#334155' },
  registerBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  registeredBox: { backgroundColor: '#16a34a22', borderRadius: 12, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#22c55e' },
  registeredText: { color: '#22c55e', fontWeight: '700', fontSize: 15, marginBottom: 8 },
  viewRegsLink: { color: '#4F46E5', fontSize: 14, fontWeight: '600' },
});
