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
}