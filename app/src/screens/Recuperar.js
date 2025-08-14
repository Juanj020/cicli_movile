import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function RecuperarScreen({ navigation }) {
    const [correo, setEmail] = useState('');

    const handleSendCode = async () => {
        if (!correo) return Alert.alert("Error", "Por favor ingresa tu correo.");

        try {
            const res = await fetch("https://ciclysan.onrender.com/api/auth/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ correo })
            });

            const data = await res.json();
            if (res.ok) {
                Alert.alert("Código enviado", "Revisa tu correo electrónico.");
                navigation.navigate("ResetPassword", { correo });
            } else {
                Alert.alert("Error", data.message || "No se pudo enviar el código.");
            }
        } catch (error) {
            Alert.alert("Error", "No se pudo conectar al servidor.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Recuperar contraseña</Text>
            <TextInput
                placeholder="Ingresa tu correo"
                placeholderTextColor="#999"
                value={correo}
                onChangeText={setEmail}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TouchableOpacity style={styles.button} onPress={handleSendCode}>
                <Text style={styles.buttonText}>Enviar código</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: "#000", 
        padding: 20, 
        justifyContent: "center" },
    title: { 
        color: "#63FB00", 
        fontSize: 22, 
        marginBottom: 20, 
        textAlign: "center" 
    },
    input: {
        backgroundColor: "#1a1a1a", 
        color: "#fff", 
        padding: 12, 
        borderRadius: 10,
        marginBottom: 15, 
        borderWidth: 1, 
        borderColor: "#333"
    },
    button: { 
        backgroundColor: "#63FB00", 
        padding: 12, 
        borderRadius: 10, 
        alignItems: "center" 
    },
    buttonText: { 
        color: "#000", 
        fontWeight: "bold" 
    }
});
