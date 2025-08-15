import { useState, useEffect } from 'react';
import { Alert, StyleSheet, TextInput, View, ScrollView, TouchableOpacity, Text, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { newNoticia } from '../../../api/noticias.js';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NewForm = ({ onClose }) => {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [resumen, setResumen] = useState('');
  const [imagen, setImagen] = useState('');
  const [fecha, setFecha] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await AsyncStorage.getItem('userId');
      if (id) {
        console.log("User ID encontrado:", id);
        setUserId(id);
      } else {
        console.log("No se encontró userId en AsyncStorage");
      }
    };
    fetchUserId();
  }, []);

  const handleSubmit = async () => {
    if (!titulo || !descripcion || !resumen || !imagen || !fecha) {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
      return;
    }

    const nuevaNoticia = {
      titulo,
      descripcion,
      resumen,
      imagen,
      fecha,
      autor: userId
    };

    try {
      await newNoticia(nuevaNoticia);
      Alert.alert('Éxito', 'La noticia ha sido agregada.');
      onClose();
    } catch (error) {
      Alert.alert('Error', 'No se pudo agregar la noticia.');
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formatted = selectedDate.toISOString().split('T')[0]; // YYYY-MM-DD
      setFecha(formatted);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      {/* Botón de cerrar */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Agregar Noticia</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <FontAwesome name="close" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Inputs */}
      <TextInput
        placeholder="Título"
        placeholderTextColor="#aaa"
        value={titulo}
        onChangeText={setTitulo}
        style={styles.input}
      />
      <TextInput
        placeholder="Descripción"
        placeholderTextColor="#aaa"
        value={descripcion}
        onChangeText={setDescripcion}
        style={[styles.input, styles.multiline]}
        multiline
      />
      <TextInput
        placeholder="Resumen"
        placeholderTextColor="#aaa"
        value={resumen}
        onChangeText={setResumen}
        style={styles.input}
      />
      <TextInput
        placeholder="URL de la Imagen"
        placeholderTextColor="#aaa"
        value={imagen}
        onChangeText={setImagen}
        style={styles.input}
      />
      
      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
        <TextInput
          placeholder="Fecha (YYYY-MM-DD)"
          placeholderTextColor="#aaa"
          value={fecha}
          editable={false}
          style={styles.input}
        />
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={fecha ? new Date(fecha) : new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
        />
      )}

      {/* Botones */}
      <TouchableOpacity style={styles.addButton} onPress={handleSubmit}>
        <Text style={styles.addButtonText}>Agregar Noticia</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    padding: 16,
    flexGrow: 1
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  headerTitle: {
    fontSize: 20,
    color: '#63FB00',
    fontWeight: 'bold'
  },
  closeButton: {
    padding: 6,
    backgroundColor: '#1A1A1A',
    borderRadius: 20
  },
  input: {
    backgroundColor: '#1A1A1A',
    color: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 12
  },
  multiline: {
    height: 100,
    textAlignVertical: 'top'
  },
  addButton: {
    backgroundColor: '#63FB00',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10
  },
  addButtonText: {
    color: '#000',
    fontWeight: 'bold'
  },
  cancelButton: {
    backgroundColor: 'red',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold'
  }
});

export default NewForm;
