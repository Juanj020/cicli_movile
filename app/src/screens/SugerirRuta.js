import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, ScrollView, Alert, Text, Image } from 'react-native';
import { postRutas } from '../../../api/rutas.js';

export default function SugerirRuta({ navigation }) {
  const [form, setForm] = useState({
    nombreRut: '',
    descripcion: '',
    dificultad: '',
    kilometros: '',
    punto_partida: '',
    punto_llegada: '',
    tiempo_aprox: '',
    altitud_min: '',
    altitud_max: '',
    recomendaciones: '',
    imagen: '',
    link: '',
    estado: 'Invisible'
  });

  const handleChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  const validateRequired = () => {
    const requiredFields = ['nombreRut', 'descripcion', 'dificultad', 'punto_partida', 'punto_llegada'];
    for (let field of requiredFields) {
      if (!form[field].trim()) {
        Alert.alert('Campo requerido', `Por favor completa el campo: ${field.replace('_', ' ')}`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateRequired()) return;

    try {
      await postRutas(form);
      Alert.alert(
        'Ruta enviada',
        'Gracias por sugerir una ruta. Tu propuesta será revisada y, si es aprobada, aparecerá en la lista.'
      );
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo enviar la ruta.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Imagen o banner */}
      <Image
        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/854/854878.png' }}
        style={styles.banner}
      />

      {/* Texto informativo */}
      <Text style={styles.infoText}>
        💡 Esta es una sugerencia de ruta. Será revisada antes de aparecer en la aplicación.
      </Text>

      {/* Campos */}
      <TextInput placeholder="* Nombre de la ruta. Ej: Girón - Kilometro 16" style={styles.input} onChangeText={(v) => handleChange('nombreRut', v)} />
      <TextInput placeholder="* Descripción" style={[styles.input, styles.multiline]} multiline onChangeText={(v) => handleChange('descripcion', v)} />
      <TextInput placeholder="* Dificultad" style={styles.input} onChangeText={(v) => handleChange('dificultad', v)} />
      <TextInput placeholder="Kilómetros" style={styles.input} keyboardType="numeric" onChangeText={(v) => handleChange('kilometros', v)} />
      <TextInput placeholder="* Punto de partida" style={styles.input} onChangeText={(v) => handleChange('punto_partida', v)} />
      <TextInput placeholder="* Punto de llegada" style={styles.input} onChangeText={(v) => handleChange('punto_llegada', v)} />
      <TextInput placeholder="Tiempo aproximado" style={styles.input} onChangeText={(v) => handleChange('tiempo_aprox', v)} />
      <TextInput placeholder="Altitud mínima" style={styles.input} keyboardType="numeric" onChangeText={(v) => handleChange('altitud_min', v)} />
      <TextInput placeholder="Altitud máxima" style={styles.input} keyboardType="numeric" onChangeText={(v) => handleChange('altitud_max', v)} />
      <TextInput placeholder="Recomendaciones" style={styles.input} onChangeText={(v) => handleChange('recomendaciones', v)} />
      <TextInput placeholder="Imagen (URL)" style={styles.input} onChangeText={(v) => handleChange('imagen', v)} />
      <TextInput placeholder="Link" style={styles.input} onChangeText={(v) => handleChange('link', v)} />

      {/* Botón */}
      <Button title="Enviar sugerencia" onPress={handleSubmit} color="#63FB00" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 16
  },
  banner: {
    width: 80,
    height: 80,
    alignSelf: 'center',
    marginBottom: 10
  },
  infoText: {
    color: '#ccc',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 10
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10
  },
  multiline: {
    height: 80,
    textAlignVertical: 'top'
  }
});
