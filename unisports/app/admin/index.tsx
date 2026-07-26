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
}