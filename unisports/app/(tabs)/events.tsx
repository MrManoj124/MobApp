import { router, useLocalSearchParams } from 'expo-router';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { CATEGORIES, GameCategory, SPORTS } from '../../constants/sports';
import { db } from '../../firebaseConfig';

export default function EventsScreen() {
  const params = useLocalSearchParams();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<GameCategory | 'all'>((params.category as GameCategory) ?? 'all');
  const [activeSportType, setActiveSportType] = useState<'all' | 'indoor' | 'outdoor'>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'events'), orderBy('date'));
        const snap = await getDocs(q);
        setEvents(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (e) { console.log(e); }
      finally { setLoading(false); }
    };
    fetchEvents();
  }, []);

  const filtered = events.filter(e => {
    const matchCat = activeCategory === 'all' || e.category === activeCategory;
    const matchType = activeSportType === 'all' || e.sportType === activeSportType;
    const matchSearch = !search || e.title.toLowerCase().includes(search.toLowerCase()) || e.sport?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchType && matchSearch;
  });

  return (
    <View style={styles.container}>
      {/* Search */}
      <TextInput style={styles.search} placeholder="Search events or sport..." placeholderTextColor="#475569"
        value={search} onChangeText={setSearch} />

      {/* Category filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
        <TouchableOpacity style={[styles.filterChip, activeCategory === 'all' && styles.filterChipActive]}
          onPress={() => setActiveCategory('all')}>
          <Text style={[styles.filterChipText, activeCategory === 'all' && styles.filterChipTextActive]}>All</Text>
        </TouchableOpacity>
        {CATEGORIES.map(cat => (
          <TouchableOpacity key={cat.id}
            style={[styles.filterChip, activeCategory === cat.id && { backgroundColor: cat.color }]}
            onPress={() => setActiveCategory(cat.id)}>
            <Text style={[styles.filterChipText, activeCategory === cat.id && { color: '#fff' }]}>
              {cat.icon} {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Indoor/Outdoor toggle */}
      <View style={styles.toggleRow}>
        {(['all', 'indoor', 'outdoor'] as const).map(t => (
          <TouchableOpacity key={t} style={[styles.toggleBtn, activeSportType === t && styles.toggleBtnActive]}
            onPress={() => setActiveSportType(t)}>
            <Text style={[styles.toggleText, activeSportType === t && styles.toggleTextActive]}>
              {t === 'all' ? 'All Types' : t === 'indoor' ? '🏠 Indoor' : '☀️ Outdoor'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Events list */}
      {loading ? <ActivityIndicator color="#4F46E5" style={{ marginTop: 40 }} /> : (
        <ScrollView style={{ flex: 1 }}>
          {filtered.length === 0 ? (
            <Text style={styles.empty}>No events found</Text>
          ) : filtered.map(event => {
            const cat = CATEGORIES.find(c => c.id === event.category);
            const slots = (event.maxParticipants ?? 0) - (event.registeredCount ?? 0);
            return (
              <TouchableOpacity key={event.id} style={styles.card} onPress={() => router.push(`/event/${event.id}`)}>
                <View style={styles.cardHeader}>
                  <View style={[styles.catDot, { backgroundColor: cat?.color ?? '#4F46E5' }]} />
                  <Text style={styles.catText}>{cat?.label}</Text>
                  <Text style={styles.typeTag}>{event.sportType === 'indoor' ? '🏠' : '☀️'} {event.sportType}</Text>
                </View>
                <Text style={styles.cardTitle}>{event.title}</Text>
                <Text style={styles.cardSport}>{SPORTS.find(s => s.id === event.sportId)?.icon ?? '🏅'} {event.sport}</Text>
                <View style={styles.cardFooter}>
                  <Text style={styles.cardDate}>📅 {event.date ? new Date(event.date.seconds * 1000).toDateString() : 'TBD'}</Text>
                  <Text style={[styles.slots, { color: slots <= 5 ? '#ef4444' : '#22c55e' }]}>
                    {slots > 0 ? `${slots} slots left` : 'Full'}
                  </Text>
                </View>
                <Text style={styles.venue}>📍 {event.venue}</Text>
              </TouchableOpacity>
            );
          })}
          <View style={{ height: 30 }} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  search: { margin: 16, backgroundColor: '#1e293b', color: '#fff', borderRadius: 10, paddingHorizontal: 16, paddingVertical: 12, fontSize: 14 },
  filterRow: { paddingLeft: 16, marginBottom: 8 },
  filterChip: { backgroundColor: '#1e293b', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, marginRight: 8, height: 36, justifyContent: 'center' },
  filterChipActive: { backgroundColor: '#4F46E5' },
  filterChipText: { color: '#94a3b8', fontSize: 13, fontWeight: '600' },
  filterChipTextActive: { color: '#fff' },
  toggleRow: { flexDirection: 'row', marginHorizontal: 16, marginBottom: 12, backgroundColor: '#1e293b', borderRadius: 10, padding: 4 },
  toggleBtn: { flex: 1, paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  toggleBtnActive: { backgroundColor: '#4F46E5' },
  toggleText: { color: '#64748b', fontSize: 13, fontWeight: '600' },
  toggleTextActive: { color: '#fff' },
  card: { backgroundColor: '#1e293b', borderRadius: 12, padding: 16, marginHorizontal: 16, marginBottom: 12 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  catDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  catText: { color: '#94a3b8', fontSize: 12, flex: 1 },
  typeTag: { color: '#64748b', fontSize: 12 },
  cardTitle: { color: '#fff', fontSize: 17, fontWeight: 'bold', marginBottom: 4 },
  cardSport: { color: '#94a3b8', fontSize: 14, marginBottom: 8 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardDate: { color: '#64748b', fontSize: 13 },
  slots: { fontSize: 13, fontWeight: '700' },
  venue: { color: '#475569', fontSize: 12, marginTop: 6 },
  empty: { color: '#475569', textAlign: 'center', marginTop: 60, fontSize: 16 },
});
