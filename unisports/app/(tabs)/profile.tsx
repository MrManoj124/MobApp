import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.avatar}>👤</Text>
        <Text style={styles.name}>Student User</Text>
        <Text style={styles.email}>student@university.edu</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Account</Text>
        <Text style={styles.infoText}>Faculty: Computer Science</Text>
        <Text style={styles.infoText}>Role: Player</Text>
        <Text style={styles.infoText}>Joined events: 2</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => router.replace('/Login')}>
        <Text style={styles.buttonText}>Go to Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', padding: 16 },
  card: { backgroundColor: '#1e293b', borderRadius: 12, padding: 16, marginBottom: 12 },
  avatar: { fontSize: 34, marginBottom: 8 },
  name: { color: '#fff', fontSize: 18, fontWeight: '700' },
  email: { color: '#64748b', fontSize: 13, marginTop: 4 },
  sectionTitle: { color: '#fff', fontSize: 15, fontWeight: '700', marginBottom: 8 },
  infoText: { color: '#94a3b8', fontSize: 13, marginTop: 4 },
  button: { backgroundColor: '#4F46E5', borderRadius: 10, paddingVertical: 12, alignItems: 'center', marginTop: 6 },
  buttonText: { color: '#fff', fontWeight: '700' },
});
