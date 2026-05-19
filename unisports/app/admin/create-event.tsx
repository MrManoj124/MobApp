import { router } from 'expo-router';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { CATEGORIES, GameCategory, SPORTS, SportType } from '../../constants/sports';
import { db } from '../../firebaseConfig';

export default function CreateEvent() {
  const [form, setForm] = useState({
    title: '', sport: '', sportId: '', sportType: 'outdoor' as SportType,
    category: 'faculty' as GameCategory, venue: '', description: '',
    maxParticipants: '20', dateStr: '',
  });
  const [loading, setLoading] = useState(false);
  const [showSports, setShowSports] = useState(false);
  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleCreate = async () => {
    if (!form.title || !form.sport || !form.venue || !form.dateStr) {
      Alert.alert('Missing Fields', 'Please fill in Title, Sport, Venue and Date.'); return;
    }
    const dateObj = new Date(form.dateStr);
    if (isNaN(dateObj.getTime())) { Alert.alert('Invalid Date', 'Use format YYYY-MM-DD'); return; }

    setLoading(true);
    try {
      await addDoc(collection(db, 'events'), {
        title: form.title, sport: form.sport, sportId: form.sportId,
        sportType: form.sportType, category: form.category,
        venue: form.venue, description: form.description,
        maxParticipants: parseInt(form.maxParticipants) || 20,
        registeredCount: 0,
        date: Timestamp.fromDate(dateObj),
        createdAt: Timestamp.now(),
      });
      Alert.alert('Created! 🎉', 'Event has been created successfully.', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally { setLoading(false); }
  };

  const Field = ({ label, placeholder, value, onChangeText, keyboardType = 'default' }: any) => (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={styles.input} placeholder={placeholder} placeholderTextColor="#475569"
        value={value} onChangeText={onChangeText} keyboardType={keyboardType} />
    </View>
  );

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <Field label="Event Title *" placeholder="e.g. Faculty Cricket Championship" value={form.title} onChangeText={(v: string) => set('title', v)} />
      <Field label="Venue *" placeholder="e.g. Main Sports Ground" value={form.venue} onChangeText={(v: string) => set('venue', v)} />
      <Field label="Date * (YYYY-MM-DD)" placeholder="2024-08-15" value={form.dateStr} onChangeText={(v: string) => set('dateStr', v)} />
      <Field label="Max Participants" placeholder="20" value={form.maxParticipants} onChangeText={(v: string) => set('maxParticipants', v)} keyboardType="number-pad" />
      <Field label="Description" placeholder="Event details..." value={form.description} onChangeText={(v: string) => set('description', v)} />

      {/* Sport picker */}
      <View style={styles.field}>
        <Text style={styles.label}>Sport *</Text>
        <TouchableOpacity style={styles.picker} onPress={() => setShowSports(!showSports)}>
          <Text style={form.sport ? styles.pickerSelected : styles.pickerPlaceholder}>
            {form.sport ? `${SPORTS.find(s => s.id === form.sportId)?.icon ?? '🏅'} ${form.sport}` : 'Select a sport...'}
          </Text>
          <Text style={styles.chevron}>{showSports ? '▲' : '▼'}</Text>
        </TouchableOpacity>
        {showSports && (
          <View style={styles.dropdown}>
            <Text style={styles.dropdownSection}>🏠 Indoor</Text>
            {SPORTS.filter(s => s.type === 'indoor').map(s => (
              <TouchableOpacity key={s.id} style={styles.dropdownItem}
                onPress={() => { set('sport', s.name); set('sportId', s.id); set('sportType', s.type); setShowSports(false); }}>
                <Text style={styles.dropdownText}>{s.icon} {s.name}</Text>
              </TouchableOpacity>
            ))}
            <Text style={styles.dropdownSection}>☀️ Outdoor</Text>
            {SPORTS.filter(s => s.type === 'outdoor').map(s => (
              <TouchableOpacity key={s.id} style={styles.dropdownItem}
                onPress={() => { set('sport', s.name); set('sportId', s.id); set('sportType', s.type); setShowSports(false); }}>
                <Text style={styles.dropdownText}>{s.icon} {s.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Category */}
      <View style={styles.field}>
        <Text style={styles.label}>Game Category *</Text>
        <View style={styles.chipRow}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity key={cat.id}
              style={[styles.chip, form.category === cat.id && { backgroundColor: cat.color }]}
              onPress={() => set('category', cat.id)}>
              <Text style={[styles.chipText, form.category === cat.id && { color: '#fff' }]}>
                {cat.icon} {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Sport type toggle */}
      <View style={styles.field}>
        <Text style={styles.label}>Sport Type</Text>
        <View style={styles.toggleRow}>
          {(['indoor', 'outdoor'] as SportType[]).map(t => (
            <TouchableOpacity key={t} style={[styles.toggleBtn, form.sportType === t && styles.toggleBtnActive]}
              onPress={() => set('sportType', t)}>
              <Text style={[styles.toggleText, form.sportType === t && { color: '#fff' }]}>
                {t === 'indoor' ? '🏠 Indoor' : '☀️ Outdoor'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity style={[styles.createBtn, loading && { opacity: 0.6 }]} onPress={handleCreate} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.createBtnText}>Create Event</Text>}
      </TouchableOpacity>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', padding: 16 },
  field: { marginBottom: 18 },
  label: { color: '#94a3b8', fontSize: 13, fontWeight: '700', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: { backgroundColor: '#1e293b', color: '#fff', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15 },
  picker: { backgroundColor: '#1e293b', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 14, flexDirection: 'row', justifyContent: 'space-between' },
  pickerSelected: { color: '#fff', fontSize: 15 },
  pickerPlaceholder: { color: '#475569', fontSize: 15 },
  chevron: { color: '#64748b' },
  dropdown: { backgroundColor: '#1e293b', borderRadius: 10, marginTop: 4, maxHeight: 280 },
  dropdownSection: { color: '#64748b', fontSize: 12, fontWeight: '700', paddingHorizontal: 14, paddingTop: 10, paddingBottom: 4, textTransform: 'uppercase' },
  dropdownItem: { paddingHorizontal: 14, paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#0f172a' },
  dropdownText: { color: '#fff', fontSize: 15 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { backgroundColor: '#1e293b', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 },
  chipText: { color: '#64748b', fontSize: 13, fontWeight: '600' },
  toggleRow: { flexDirection: 'row', backgroundColor: '#1e293b', borderRadius: 10, padding: 4, gap: 4 },
  toggleBtn: { flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  toggleBtnActive: { backgroundColor: '#4F46E5' },
  toggleText: { color: '#64748b', fontWeight: '600', fontSize: 14 },
  createBtn: { backgroundColor: '#4F46E5', borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  createBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
