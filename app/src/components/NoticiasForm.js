// FormularioNoticia.js
import { useState } from 'react';
import { Alert, Button, StyleSheet, TextInput, View } from 'react-native';
import { newNoticia } from '../../../api/noticias.js'; // Asegúrate de que la ruta sea correcta

const NewForm = ({ onClose }) => {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [resumen, setResumen] = useState('');
  const [imagen, setImagen] = useState('');
  const [fecha, setFecha] = useState('');

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
      autor: 'ID_DEL_AUTOR', // Reemplaza con el ID del autor correspondiente
    };

    try {
      await newNoticia(nuevaNoticia);
      Alert.alert('Éxito', 'La noticia ha sido agregada.');
      onClose();
    } catch (error) {
      Alert.alert('Error', 'No se pudo agregar la noticia.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Título"
        value={titulo}
        onChangeText={setTitulo}
        style={styles.input}
      />
      <TextInput
        placeholder="Descripción"
        value={descripcion}
        onChangeText={setDescripcion}
        style={styles.input}
      />
      <TextInput
        placeholder="Resumen"
        value={resumen}
        onChangeText={setResumen}
        style={styles.input}
      />
      <TextInput
        placeholder="URL de la Imagen"
        value={imagen}
        onChangeText={setImagen}
        style={styles.input}
      />
      <TextInput
        placeholder="Fecha (YYYY-MM-DD)"
        value={fecha}
        onChangeText={setFecha}
        style={styles.input}
      />
      <Button title="Agregar Noticia" onPress={handleSubmit} />
      <Button title="Cancelar" onPress={onClose} color="red" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 12,
  },
});

export default NewForm;
