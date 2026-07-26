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

  }
}