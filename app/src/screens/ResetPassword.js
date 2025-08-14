import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ResetPasswordScreen({ route, navigation }) {
  const { correo } = route.params;
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');

  const handleResetPassword = async () => {
    if (!otp || !password) return Alert.alert("Error", "Completa todos los campos.");

    try {
      const res = await fetch("https://ciclysan.onrender.com/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, otp, password })
      });

      const data = await res.json();
      if (res.ok) {
        Alert.alert("Éxito", "Contraseña actualizada. Ahora inicia sesión.");
        navigation.navigate("Login");
      } else {
        Alert.alert("Error", data.message || "No se pudo actualizar la contraseña.");
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo conectar al servidor.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Restablecer contraseña</Text>
      <TextInput
        placeholder="Código recibido"
        placeholderTextColor="#999"
        value={otp}
        onChangeText={setOtp}
        style={styles.input}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Nueva contraseña"
        placeholderTextColor="#999"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
        <Text style={styles.buttonText}>Cambiar contraseña</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 20, justifyContent: "center" },
  title: { color: "#63FB00", fontSize: 22, marginBottom: 20, textAlign: "center" },
  input: {
    backgroundColor: "#1a1a1a", color: "#fff", padding: 12, borderRadius: 10,
    marginBottom: 15, borderWidth: 1, borderColor: "#333"
  },
  button: { backgroundColor: "#63FB00", padding: 12, borderRadius: 10, alignItems: "center" },
  buttonText: { color: "#000", fontWeight: "bold" }
});
