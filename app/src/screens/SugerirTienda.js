// src/screens/SugerirTienda.js
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, ScrollView, Alert, Text, Image, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { postTiendas } from '../../../api/store.js';
import { Ionicons } from '@expo/vector-icons';

export default function SugerirTienda({ navigation }) {
    const [form, setForm] = useState({
        nombre: '',
        localizacion: '',
        contacto: '',
        web: '',
        imagen: '',
        estado: 'Invisible'
    });

    const handleChange = (name, value) => {
        setForm({ ...form, [name]: value });
    };

    const handleImagePicker = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permiso denegado', 'Necesitamos acceso a la galería para subir una imagen.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
            base64: true,
        });

        if (!result.canceled) {
            handleChange('imagen', `data:image/jpeg;base64,${result.assets[0].base64}`);
        }
    };

    const validateRequired = () => {
        const requiredFields = ['nombre', 'localizacion', 'contacto', 'web'];
        for (let field of requiredFields) {
            if (!form[field].trim()) {
                Alert.alert('Campo requerido', `Por favor completa el campo: ${field}`);
                return false;
            }
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validateRequired()) return;

        try {
            const contactosArray = form.contacto.split(',').map(c => c.trim()).filter(c => c);

            const tiendaData = {
                nombre: form.nombre,
                localizacion: form.localizacion,
                contacto: contactosArray,
                web: form.web,
                imagen: form.imagen,
                estado: form.estado
            };

            await postTiendas(tiendaData);
            Alert.alert('Sugerencia enviada', 'Gracias por tu sugerencia. Se revisará y se añadirá pronto.');
            navigation.goBack();
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'No se pudo enviar la sugerencia.');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#63FB00" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Sugerir Tienda</Text>
            </View>
            <Text style={styles.infoText}>
                Llena los siguientes campos para sugerir una nueva tienda de ciclismo.
                Tu sugerencia será revisada por un administrador antes de ser publicada.
            </Text>

            <Text style={styles.label}>Nombre de la tienda</Text>
            <TextInput
                placeholder="Ej: La Biela Shop"
                placeholderTextColor="#666"
                style={styles.input}
                onChangeText={(v) => handleChange('nombre', v)}
                value={form.nombre}
            />

            <Text style={styles.label}>Localización</Text>
            <TextInput
                placeholder="Ej: Carrera 11 # 96 - 46, Bogotá, Colombia"
                placeholderTextColor="#666"
                style={styles.input}
                onChangeText={(v) => handleChange('localizacion', v)}
                value={form.localizacion}
            />

            <Text style={styles.label}>Contacto</Text>
            <TextInput
                placeholder="Ej: +57 301 3721666, info@labielashop.com (separar con comas)"
                placeholderTextColor="#666"
                style={styles.input}
                onChangeText={(v) => handleChange('contacto', v)}
                value={form.contacto}
            />

            <Text style={styles.label}>Página web</Text>
            <TextInput
                placeholder="Ej: https://labielashop.com/"
                placeholderTextColor="#666"
                style={styles.input}
                onChangeText={(v) => handleChange('web', v)}
                value={form.web}
            />
            
            <Text style={styles.label}>Imagen</Text>
            <TouchableOpacity style={styles.imagePickerButton} onPress={handleImagePicker}>
                <Text style={styles.imagePickerButtonText}>Seleccionar Imagen</Text>
            </TouchableOpacity>
            
            {form.imagen ? (
                <Image source={{ uri: form.imagen }} style={styles.imagePreview} />
            ) : (
                <View style={styles.imagePlaceholder}>
                    <Ionicons name="image-outline" size={50} color="#666" />
                    <Text style={styles.imagePlaceholderText}>Vista previa de la imagen</Text>
                </View>
            )}
            
            <Button title="Enviar sugerencia" onPress={handleSubmit} color="#63FB00" />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#000',
        padding: 16,
        paddingBottom: 40
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20
    },
    backButton: {
        position: 'absolute',
        left: 0,
        padding: 5
    },
    headerTitle: {
        fontSize: 24,
        color: '#63FB00',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    infoText: {
        color: '#ccc',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 20,
    },
    label: {
      color: '#63FB00',
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    input: {
        backgroundColor: '#1A1A1A',
        color: '#fff',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 12,
        marginBottom: 12,
        fontSize: 16,
    },
    imagePickerButton: {
      backgroundColor: '#1A1A1A',
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
      marginBottom: 12,
    },
    imagePickerButtonText: {
      color: '#fff',
      fontWeight: 'bold'
    },
    imagePreview: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 12,
        resizeMode: 'cover'
    },
    imagePlaceholder: {
        width: '100%',
        height: 200,
        backgroundColor: '#1A1A1A',
        borderRadius: 8,
        marginBottom: 12,
        justifyContent: 'center',
        alignItems: 'center'
    },
    imagePlaceholderText: {
        color: '#ccc',
        marginTop: 5
    }
});