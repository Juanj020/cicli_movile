import { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { newUser } from '../../../api/users.js'; // Asegúrate que aquí esté bien el path

export default function RegisterUser({ navigation })  {

  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    password: '',
    telefono: '',
    rol: 'USER',
  });

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validarFormulario = () => {
    const { nombre, correo, password, telefono, rol } = formData;

    if (!nombre || !correo || !password || !telefono || !rol) {
      Alert.alert("Error", "Llene todos los campos");
      return false;
    }

    if (telefono.length !== 10) {
      Alert.alert("Error", "El teléfono debe tener mínimo 10 dígitos");
      return false;
    }

    if (password.length < 8) {
      Alert.alert("Error", "La contraseña debe tener mínimo 8 caracteres");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validarFormulario()) return;

    try {
      console.log('Enviando datos:', formData);
      const resultado = await newUser(formData);

      if (resultado.success === false) {
        Alert.alert("Error", resultado.msg);
      } else {
        Alert.alert("Éxito", "Usuario registrado correctamente");
        navigation.replace('Login')
      }
    } catch (error) {
      Alert.alert("Error", `Algo salió mal al registrar ${error}`);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image source={require('../assets/ciclista6.jpg')} style={styles.image} />

        <View style={styles.formContainer}>
          <Text style={styles.title}>Crea tu cuenta 🚴‍♀️</Text>

          <TextInput
            placeholder="Nombre"
            placeholderTextColor="#999"
            style={styles.input}
            onChangeText={(text) => handleChange('nombre', text)}
            value={formData.nombre}
          />
          <TextInput
            placeholder="Correo"
            placeholderTextColor="#999"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={(text) => handleChange('correo', text)}
            value={formData.correo}
          />
          <TextInput
            placeholder="Contraseña"
            placeholderTextColor="#999"
            style={styles.input}
            secureTextEntry
            onChangeText={(text) => handleChange('password', text)}
            value={formData.password}
          />
          <TextInput
            placeholder="Teléfono"
            placeholderTextColor="#999"
            style={styles.input}
            keyboardType="numeric"
            onChangeText={(text) => handleChange('telefono', text)}
            value={formData.telefono}
          />

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Registrarse</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.replace('Login')}>
            <Text style={styles.linkText}>¿Ya tienes cuenta? Inicia sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

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