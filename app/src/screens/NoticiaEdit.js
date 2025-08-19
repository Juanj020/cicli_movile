import React, { useState, useEffect } from 'react';
import {
    View,
    TextInput,
    Button,
    StyleSheet,
    ScrollView,
    Alert,
    Text,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    Platform
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { updateNoticia } from '../../../api/noticias.js';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default function NoticiaEditScreen({ route, navigation }) {
    const { noticia } = route.params;

    const [form, setForm] = useState({
        titulo: noticia.titulo || '',
        descripcion: noticia.descripcion || '',
        resumen: noticia.resumen || '',
        imagen: noticia.imagen || '',
        fecha: new Date(noticia.fecha) || new Date(),
    });

    const [imagenSeleccionada, setImagenSeleccionada] = useState(form.imagen);
    const [loading, setLoading] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleChange = (name, value) => {
        setForm({ ...form, [name]: value });
    };

    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || form.fecha;
        setShowDatePicker(Platform.OS === 'ios');
        handleChange('fecha', currentDate);
    };

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert(
                'Permiso requerido',
                'Necesitas conceder permiso para acceder a la galería de fotos.'
            );
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.5,
            base64: true,
        });

        if (!result.canceled) {
            const uri = result.assets[0].uri;
            const base64 = result.assets[0].base64;
            setImagenSeleccionada(uri);
            handleChange('imagen', `data:image/jpeg;base64,${base64}`);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await updateNoticia(noticia._id, form);
            Alert.alert('Éxito', 'Noticia actualizada correctamente.');
            navigation.goBack();
        } catch (error) {
            console.error('Error al actualizar la noticia:', error);
            Alert.alert('Error', 'No se pudo actualizar la noticia. Por favor, intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
            {imagenSeleccionada ? (
                <Image
                    source={{ uri: imagenSeleccionada }}
                    style={styles.imagePreview}
                />
            ) : (
                <View style={styles.imagePlaceholder}>
                    <FontAwesome name="image" size={50} color="#ccc" />
                    <Text style={styles.imagePlaceholderText}>No hay imagen</Text>
                </View>
            )}

            <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
                <Text style={styles.imagePickerButtonText}>Cambiar Imagen</Text>
            </TouchableOpacity>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>* Título</Text>
                <TextInput
                    style={styles.input}
                    value={form.titulo}
                    onChangeText={(v) => handleChange('titulo', v)}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>* Descripción</Text>
                <TextInput
                    style={[styles.input, styles.multiline]}
                    multiline
                    value={form.descripcion}
                    onChangeText={(v) => handleChange('descripcion', v)}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>* Resumen</Text>
                <TextInput
                    style={[styles.input, styles.multiline]}
                    multiline
                    value={form.resumen}
                    onChangeText={(v) => handleChange('resumen', v)}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>* Fecha</Text>
                <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
                    <Text style={styles.datePickerText}>{form.fecha.toLocaleDateString()}</Text>
                </TouchableOpacity>
                {showDatePicker && (
                    <DateTimePicker
                        testID="datePicker"
                        value={form.fecha}
                        mode="date"
                        is24Hour={true}
                        display="default"
                        onChange={handleDateChange}
                    />
                )}
            </View>

            <Button title="Actualizar Noticia" onPress={handleSubmit} color="#63FB00" disabled={loading} />
            {loading && <ActivityIndicator size="small" color="#63FB00" style={{ marginTop: 10 }} />}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        padding: 16
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
    inputGroup: {
        marginBottom: 15,
    },
    label: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 5,
        fontWeight: 'bold',
    },
    input: {
        backgroundColor: '#1A1A1A',
        color: '#fff',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 8,
    },
    multiline: {
        height: 80,
        textAlignVertical: 'top'
    },
    datePickerButton: {
        backgroundColor: '#1A1A1A',
        padding: 10,
        borderRadius: 8,
    },
    datePickerText: {
        color: '#fff',
        fontSize: 16,
    },
});