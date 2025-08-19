// src/screens/TiendaEdit.js
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    ScrollView,
    Alert,
    Button,
    Image,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { putTiendas } from '../../../api/store.js';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

export default function TiendaEditScreen({ route }) {
    const { tienda } = route.params;
    const navigation = useNavigation();
    const [editedTienda, setEditedTienda] = useState(tienda);
    const [loading, setLoading] = useState(false);

    // Múltiples contactos
    const handleAddContact = () => {
        setEditedTienda({
            ...editedTienda,
            contacto: [...editedTienda.contacto, ''],
        });
    };

    const handleRemoveContact = (index) => {
        const newContactos = editedTienda.contacto.filter((_, i) => i !== index);
        setEditedTienda({ ...editedTienda, contacto: newContactos });
    };

    const handleContactChange = (index, value) => {
        const newContactos = [...editedTienda.contacto];
        newContactos[index] = value;
        setEditedTienda({ ...editedTienda, contacto: newContactos });
    };

    // Selector de imágenes
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
            const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
            setEditedTienda({ ...editedTienda, imagen: base64Image });
        }
    };
    
    const handleUpdate = async () => {
        setLoading(true);
        try {
            await putTiendas(editedTienda._id, editedTienda);
            Alert.alert('Éxito', 'Tienda actualizada correctamente.');
            navigation.goBack();
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'No se pudo actualizar la tienda.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.title}>Editar Tienda: {editedTienda.nombre}</Text>

                <Text style={styles.label}>Nombre</Text>
                <TextInput
                    style={styles.input}
                    value={editedTienda.nombre}
                    onChangeText={(text) => setEditedTienda({ ...editedTienda, nombre: text })}
                />
                
                <Text style={styles.label}>Localización</Text>
                <TextInput
                    style={styles.input}
                    value={editedTienda.localizacion}
                    onChangeText={(text) => setEditedTienda({ ...editedTienda, localizacion: text })}
                />

                <Text style={styles.label}>Página Web</Text>
                <TextInput
                    style={styles.input}
                    value={editedTienda.web}
                    onChangeText={(text) => setEditedTienda({ ...editedTienda, web: text })}
                />
                
                {/* Campo de imagen */}
                <Text style={styles.label}>Imagen</Text>
                <TouchableOpacity style={styles.imagePickerButton} onPress={handleImagePicker}>
                    <Ionicons name="image-outline" size={24} color="#fff" />
                    <Text style={styles.imagePickerButtonText}>Seleccionar Imagen</Text>
                </TouchableOpacity>
                {editedTienda.imagen ? (
                    <Image source={{ uri: editedTienda.imagen }} style={styles.imagePreview} />
                ) : (
                    <View style={styles.imagePlaceholder}>
                        <Ionicons name="image-outline" size={50} color="#ccc" />
                        <Text style={styles.imagePlaceholderText}>No hay imagen seleccionada</Text>
                    </View>
                )}

                {/* Múltiples campos de contacto */}
                <Text style={styles.label}>Contactos</Text>
                {editedTienda.contacto.map((contact, index) => (
                    <View key={index} style={styles.contactContainer}>
                        <TextInput
                            style={[styles.input, styles.contactInput]}
                            value={contact}
                            onChangeText={(text) => handleContactChange(index, text)}
                            placeholder="Teléfono, correo, etc."
                            placeholderTextColor="#ccc"
                        />
                        <TouchableOpacity onPress={() => handleRemoveContact(index)} style={styles.removeButton}>
                            <Ionicons name="remove-circle-outline" size={24} color="#FF0000" />
                        </TouchableOpacity>
                    </View>
                ))}
                <TouchableOpacity onPress={handleAddContact} style={styles.addButton}>
                    <Ionicons name="add-circle-outline" size={24} color="#63FB00" />
                    <Text style={styles.addButtonText}>Añadir Contacto</Text>
                </TouchableOpacity>

                <Button
                    title={loading ? "Actualizando..." : "Guardar Cambios"}
                    onPress={handleUpdate}
                    color="#63FB00"
                    disabled={loading}
                />
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000', // ✅ Fondo para el KeyboardAvoidingView
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 40,
        backgroundColor: '#000', // ✅ Fondo para el ScrollView
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#63FB00',
        textAlign: 'center',
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        color: '#fff',
        marginBottom: 5,
        fontWeight: 'bold',
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
    contactContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    contactInput: {
        flex: 1,
        marginBottom: 0,
        marginRight: 10,
    },
    removeButton: {
        padding: 5,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1A1A1A',
        padding: 12,
        borderRadius: 8,
        marginBottom: 20,
    },
    addButtonText: {
        color: '#63FB00',
        marginLeft: 8,
        fontWeight: 'bold',
    },
    imagePickerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1A1A1A',
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
        justifyContent: 'center',
    },
    imagePickerButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 10,
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
    },
});