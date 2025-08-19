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
    ActivityIndicator
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { updateRuta } from '../../../api/rutas.js';

export default function RutaEditScreen({ route, navigation }) {
    const { ruta } = route.params;

    const [form, setForm] = useState({
        nombreRut: ruta.nombreRut || '',
        descripcion: ruta.descripcion || '',
        dificultad: ruta.dificultad || 'Fácil',
        kilometros: ruta.kilometros?.toString() || '',
        punto_partida: ruta.punto_partida || '',
        punto_llegada: ruta.punto_llegada || '',
        tiempo_aprox: ruta.tiempo_aprox || '',
        altitud_min: ruta.altitud_min?.toString() || '',
        altitud_max: ruta.altitud_max?.toString() || '',
        recomendaciones: ruta.recomendaciones || '',
        imagen: ruta.imagen || '',
        link: ruta.link || '',
        estado: ruta.estado || 'Invisible'
    });

    const [imagenSeleccionada, setImagenSeleccionada] = useState(form.imagen);
    const [loading, setLoading] = useState(false);

    const handleChange = (name, value) => {
        setForm({ ...form, [name]: value });
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
            await updateRuta(ruta._id, form);
            Alert.alert('Éxito', 'Ruta actualizada correctamente.');
            navigation.goBack();
        } catch (error) {
            console.error('Error al actualizar la ruta:', error);
            Alert.alert('Error', 'No se pudo actualizar la ruta.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
            <Image
                source={imagenSeleccionada ? { uri: imagenSeleccionada } : require('../assets/ciclista6.jpg')}
                style={styles.banner}
            />

            <TouchableOpacity style={styles.botonImagen} onPress={pickImage}>
                <Text style={styles.botonImagenTexto}>Cambiar Imagen</Text>
            </TouchableOpacity>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>* Nombre de la ruta</Text>
                <TextInput
                    style={styles.input}
                    value={form.nombreRut}
                    onChangeText={(v) => handleChange('nombreRut', v)}
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
                <Text style={styles.label}>* Dificultad</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={form.dificultad}
                        style={styles.picker}
                        onValueChange={(itemValue) => handleChange('dificultad', itemValue)}
                        dropdownIconColor="#fff"
                        dropdownIconRippleColor="#63FB00"
                    >
                        <Picker.Item label="Fácil" value="Fácil" style={styles.pickerItem} />
                        <Picker.Item label="Mediana" value="Mediana" style={styles.pickerItem} />
                        <Picker.Item label="Difícil" value="Difícil" style={styles.pickerItem} />
                    </Picker>
                </View>
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Kilómetros</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={form.kilometros}
                    onChangeText={(v) => handleChange('kilometros', v)}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>* Punto de partida</Text>
                <TextInput
                    style={styles.input}
                    value={form.punto_partida}
                    onChangeText={(v) => handleChange('punto_partida', v)}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>* Punto de llegada</Text>
                <TextInput
                    style={styles.input}
                    value={form.punto_llegada}
                    onChangeText={(v) => handleChange('punto_llegada', v)}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Tiempo aproximado</Text>
                <TextInput
                    style={styles.input}
                    value={form.tiempo_aprox}
                    onChangeText={(v) => handleChange('tiempo_aprox', v)}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Altitud mínima</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={form.altitud_min}
                    onChangeText={(v) => handleChange('altitud_min', v)}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Altitud máxima</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={form.altitud_max}
                    onChangeText={(v) => handleChange('altitud_max', v)}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Recomendaciones</Text>
                <TextInput
                    style={styles.input}
                    value={form.recomendaciones}
                    onChangeText={(v) => handleChange('recomendaciones', v)}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Link</Text>
                <TextInput
                    style={styles.input}
                    value={form.link}
                    onChangeText={(v) => handleChange('link', v)}
                />
            </View>

            <Button title="Actualizar Ruta" onPress={handleSubmit} color="#63FB00" disabled={loading} />
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
    banner: {
        width: '100%',
        height: 200,
        alignSelf: 'center',
        marginBottom: 10,
        borderRadius: 10,
        resizeMode: 'cover',
    },
    botonImagen: {
        backgroundColor: '#1A1A1A',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 10,
    },
    botonImagenTexto: {
        color: '#fff',
        fontSize: 16,
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
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 10,
    },
    multiline: {
        height: 80,
        textAlignVertical: 'top'
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#fff',
        borderRadius: 8,
        overflow: 'hidden',
    },
    picker: {
        backgroundColor: '#fff',
        color: '#000',
    },
    pickerItem: {
        backgroundColor: '#fff',
        color: '#000',
    },
});