import {Link, router} from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, {useState} from "react";
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {auth} from "../firebaseConfig";

export default funtion Login(){
    const [email, setEmail]= useState('');
    const [password, setPassword]=useState('');

    const handleLogin = async () => {
        if(!email ||!password){
            alert("Please fill sll the fields");
            return;
        }
        try{
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log("Logged in user:", user);
      alert("Login successful!");

      
      router.push("/Home"); 
    } catch (error: any) {
      console.log(error);
      alert(error.message); 
    }
  };


   return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <Link href="/Register" style={styles.linkText}>
        Don’t have an account? Register
      </Link>
    </View>
  );
}

}
