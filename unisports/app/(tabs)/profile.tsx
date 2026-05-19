import { router } from 'expo-router';
import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function ProfileScreen() {
  const { profile, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: async () => { await logout(); router.replace('/Login'); } }
    ]);
  };

  const infoRows = [
    { label: 'Name', value: profile?.name },
    { label: 'Email', value: profile?.email },
    { label: 'Faculty', value: profile?.faculty },
    { label: 'Role', value: profile?.role },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Avatar */}
      <View style={styles.avatarSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{profile?.name?.[0]?.toUpperCase() ?? '?'}</Text>
        </View>
        <Text style={styles.name}>{profile?.name}</Text>
        <Text style={styles.role}>{profile?.role === 'admin' ? '🛡️ Admin' : '🎓 Student'}</Text>
      </View>

      {/* Info */}
      <View style={styles.card}>
        {infoRows.map((row, i) => (
          <View key={i} style={[styles.row, i < infoRows.length - 1 && styles.rowBorder]}>
            <Text style={styles.label}>{row.label}</Text>
            <Text style={styles.value}>{row.value ?? '—'}</Text>
          </View>
        ))}
      </View>

      {/* Admin panel link */}
      {profile?.role === 'admin' && (
        <TouchableOpacity style={styles.adminBtn} onPress={() => router.push('/admin')}>
          <Text style={styles.adminBtnText}>🛡️ Admin Dashboard</Text>
        </TouchableOpacity>
      )}

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  avatarSection: { alignItems: 'center', paddingTop: 40, paddingBottom: 24, backgroundColor: '#1e293b' },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#4F46E5', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarText: { color: '#fff', fontSize: 36, fontWeight: 'bold' },
  name: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  role: { color: '#94a3b8', fontSize: 14, marginTop: 4 },
  card: { backgroundColor: '#1e293b', borderRadius: 12, margin: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: '#0f172a' },
  label: { color: '#64748b', fontSize: 14 },
  value: { color: '#fff', fontSize: 14, fontWeight: '600', maxWidth: '60%', textAlign: 'right' },
  adminBtn: { backgroundColor: '#7c3aed', marginHorizontal: 16, borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginBottom: 12 },
  adminBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  logoutBtn: { backgroundColor: '#ef444422', marginHorizontal: 16, borderRadius: 10, paddingVertical: 14, alignItems: 'center', borderWidth: 1, borderColor: '#ef4444' },
  logoutText: { color: '#ef4444', fontWeight: '700', fontSize: 15 },
});
