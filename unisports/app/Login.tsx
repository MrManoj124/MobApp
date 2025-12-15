import {Link, router} from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, {useState} from "react";
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {auth} from "../firebaseConfig";