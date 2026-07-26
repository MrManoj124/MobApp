import { router } from 'expo-router';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { CATEGORIES, GameCategory, SPORTS, SportType } from '../../constants/sports';
import { db } from '../../firebaseConfig';
