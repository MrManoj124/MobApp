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

}