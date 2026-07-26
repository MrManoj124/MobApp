import { router } from 'expo-router';
import { collection, deleteDoc, doc, getDocs, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CATEGORIES } from '../../constants/sports';
import { db } from '../../firebaseConfig';
