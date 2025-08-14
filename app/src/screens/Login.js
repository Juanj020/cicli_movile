import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useContext, useState } from 'react';
import {
  Alert,
  Image, KeyboardAvoidingView, Platform, ScrollView,
  StyleSheet,
  Text, TextInput, TouchableOpacity,
  View
} from 'react-native';
import { AuthContext } from '../context/AuthContext.js';

const LoginScreen = ({ navigation }) => {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [verPassword, setVerPassword] = useState(false);
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    const info = { correo, password };

    try {
      console.log("Enviando info:", info);

      const res = await fetch("https://ciclysan.onrender.com/api/auth", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(info)
      });
      console.log("Pasa 1");
      
      
      const data = await res.json();
      console.log("Pasa 2");
      
      if (data.token) {
        await AsyncStorage.setItem('userId', data.userId);
    
        await AsyncStorage.setItem('userNombre', data.nombre);
        console.log("Pasa 4");
        await login(data.token);
        console.log("Pasa 5");
        Alert.alert("Éxito", "Sesión iniciada correctamente.");
      } else {
        Alert.alert("Error", data.msg || "Credenciales incorrectas.");

      }
    } catch (error) {
      Alert.alert("Error", "No se pudo conectar al servidor.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'padding'} // usa padding también en Android
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled" // permite que los botones funcionen sin cerrar teclado
        showsVerticalScrollIndicator={false}
      >
        <Image source={require('../assets/ciclista6.jpg')} style={styles.image} />

        <View style={styles.formContainer}>
          <Text style={styles.title}>Bienvenido a CicliSan 🚴‍♂️</Text>

          <TextInput
            placeholder="Correo"
            placeholderTextColor="#999"
            value={correo}
            onChangeText={setCorreo}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Contraseña"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!verPassword}
              style={styles.passwordInput}
            />
            <TouchableOpacity onPress={() => setVerPassword(!verPassword)}>
              <Ionicons
                name={verPassword ? 'eye-off' : 'eye'}
                size={22}
                color="#999"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Continuar</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Recuperar')}>
            <Text style={styles.linkText}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('RegisterUser')}>
            <Text style={styles.linkText}>¿No tienes cuenta? Regístrate aquí</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContainer: {
  padding: 20,
  paddingBottom: 60, // más espacio extra para que no se corte
  flexGrow: 1,       // importante para que ScrollView se expanda
  justifyContent: 'center', 
},
  image: {
    width: '100%',
    height: 220,
    resizeMode: 'cover',
    borderRadius: 15,
    marginBottom: 20,
  },
  formContainer: {
    width: '100%',
    backgroundColor: '#111',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#63FB00',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 5,
  },
  title: {
    color: '#63FB00',
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#1a1a1a',
    color: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333',
    paddingHorizontal: 12,
    marginBottom: 15,
  },
  passwordInput: {
    flex: 1,
    color: '#fff',
    paddingVertical: 12,
  },
  button: {
    backgroundColor: '#63FB00',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkText: {
    color: '#63FB00',
    textAlign: 'center',
    marginTop: 15,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
