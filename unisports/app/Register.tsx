import {Link, router} from 'expo-router';
import {createUserWithEmailAndPassword} from "firebase/auth";
import {doc, setDoc} from "firebase/firestore";
import React, {useSate} from "react";
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {auth, db} from "../firebaseConfig";

export default function Register(){
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handlerRegister = async () => {
        if(!name || !email || !password) {
            alert("Please fill all the fields");
            return;
        }

        try{
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user= userCredential.user;

            await setDoc(doc(db, "users", user.uid),{
                name, email, createdAt : new Date();
            });

            alert("Account created successfully!");
            router.push('/Login');
        } catch (error){
            alert("Error registering user: " + error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Register</Text>
            <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
            />
            <TextInput

            
    )

}