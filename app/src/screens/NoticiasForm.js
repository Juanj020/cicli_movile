import React, { useState, useEffect } from 'react';
import {
    Alert,
    StyleSheet,
    TextInput,
    View,
    ScrollView,
    Text,
    Image,
    Button
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { newNoticia, putNoticia } from '../../../api/noticias.js';

const NewsForm = ({ route }) => {
    const navigation = useNavigation();
    const { noticia } = route.params || {};

    const [form, setForm] = useState({
        titulo: '',
        descripcion: '',
        autor: '',
        imagen: '',
        ...noticia,
        autor: noticia?.autor?.nombre || '',
    });

    const handleChange = (name, value) => {
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async () => {
        try {
            if (noticia) {
                // Lógica para editar
                await putNoticia(noticia._id, { ...form, autor: { nombre: form.autor } });
                Alert.alert('Éxito', 'Noticia actualizada correctamente.');
            } else {
                // Lógica para crear
                await newNoticia({ ...form, autor: { nombre: form.autor } });
                Alert.alert('Éxito', 'Noticia creada correctamente.');
            }
            navigation.goBack();
        } catch (error) {
            console.error('Error al guardar noticia:', error);
            Alert.alert('Error', 'No se pudo guardar la noticia.');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.headerTitle}>{noticia ? 'Editar Noticia' : 'Crear Noticia'}</Text>
            
            <TextInput
                placeholder="Título"
                style={styles.input}
                onChangeText={(v) => handleChange('titulo', v)}
                value={form.titulo}
                placeholderTextColor="#ccc"
            />
            <TextInput
                placeholder="Descripción"
                style={[styles.input, styles.textArea]}
                onChangeText={(v) => handleChange('descripcion', v)}
                value={form.descripcion}
                multiline
                placeholderTextColor="#ccc"
            />
            <TextInput
                placeholder="Autor"
                style={styles.input}
                onChangeText={(v) => handleChange('autor', v)}
                value={form.autor}
                placeholderTextColor="#ccc"
            />
            <TextInput
                placeholder="Imagen (URL)"
                style={styles.input}
                onChangeText={(v) => handleChange('imagen', v)}
                value={form.imagen}
                placeholderTextColor="#ccc"
            />
            {form.imagen && (
                <Image source={{ uri: form.imagen }} style={styles.imagePreview} />
            )}
            
            <Button
                title={noticia ? 'Guardar Cambios' : 'Crear Noticia'}
                onPress={handleSubmit}
                color="#63FB00"
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        flexGrow: 1,
        backgroundColor: '#000',
    },
    headerTitle: {
        fontSize: 24,
        color: '#63FB00',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20
    },
    input: {
        backgroundColor: '#1A1A1A',
        color: '#fff',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginBottom: 12
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top'
    },
    imagePreview: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 12,
        resizeMode: 'cover'
    }
});

export default NewsForm;