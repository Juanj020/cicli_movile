// src/screens/SugerirTiendaIA.js
import React, { useState } from 'react';
import {
    View,
    TextInput,
    Button,
    StyleSheet,
    ScrollView,
    Alert,
    Text,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { postTiendas } from '../../../api/store.js'; // Asume que esta función existe
import { Ionicons } from '@expo/vector-icons';

// Reemplaza con tu propia clave de API de Gemini
const GEMINI_API_KEY = "TU_CLAVE_AQUI"; 
const API_BACKEND = "https://ciclysan.onrender.com/api";

export default function SugerirTiendaIA({ navigation }) {
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState('');

    const handleGenerarYGuardar = async () => {
        if (!prompt.trim()) {
            Alert.alert('Error', 'Por favor, ingresa una descripción para generar la tienda.');
            return;
        }

        setLoading(true);
        setResponse('');
        try {
            const resGemini = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{
                                text: `Genera los datos de una tienda ciclista basada en la siguiente descripción. Responde en formato JSON, sin texto adicional, con las siguientes claves: nombre, localizacion, contacto (array de strings), web (string), imagen (url de imagen). Descripción: ${prompt}`
                            }]
                        }]
                    })
                }
            );

            if (!resGemini.ok) {
                throw new Error('Error al conectar con la API de Gemini');
            }

            const dataGemini = await resGemini.json();
            const content = dataGemini.candidates[0].content.parts[0].text;
            const cleanContent = content.replace(/```json|```/g, '').trim();

            const tiendaData = JSON.parse(cleanContent);
            tiendaData.estado = "Invisible"; // O "Visible", según tu lógica de negocio

            const resBackend = await postTiendas(tiendaData);

            if (resBackend.ok) {
                Alert.alert('Éxito', 'Tienda generada y guardada correctamente.');
                navigation.goBack();
            } else {
                Alert.alert('Error', 'No se pudo guardar la tienda en el backend.');
            }

        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Ocurrió un error inesperado al generar la tienda.');
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
                <Text style={styles.headerTitle}>Generar Tienda con IA</Text>
                <Text style={styles.infoText}>
                    Escribe una descripción de la tienda que deseas generar. La IA creará una tienda ciclista con los datos que pidas.
                </Text>

                <TextInput
                    style={styles.input}
                    placeholder="Ej: Una tienda de bicicletas vintage en el centro de Bucaramanga con contacto y página web."
                    placeholderTextColor="#ccc"
                    multiline
                    numberOfLines={4}
                    value={prompt}
                    onChangeText={setPrompt}
                />
                
                <TouchableOpacity
                    style={styles.botonGenerar}
                    onPress={handleGenerarYGuardar}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#000" />
                    ) : (
                        <Text style={styles.textoBotonGenerar}>Generar y Guardar</Text>
                    )}
                </TouchableOpacity>

                {response ? (
                    <View style={styles.responseContainer}>
                        <Text style={styles.responseText}>Respuesta de la IA:</Text>
                        <Text style={styles.responseContent}>{response}</Text>
                    </View>
                ) : null}

            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        padding: 16
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 24,
        color: '#63FB00',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20
    },
    infoText: {
        color: '#ccc',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        backgroundColor: '#1A1A1A',
        color: '#fff',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 12,
        marginBottom: 12,
        fontSize: 16,
        minHeight: 120,
        textAlignVertical: 'top',
    },
    botonGenerar: {
        backgroundColor: '#63FB00',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    textoBotonGenerar: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
    },
    responseContainer: {
        marginTop: 20,
        padding: 15,
        backgroundColor: '#1A1A1A',
        borderRadius: 8,
    },
    responseText: {
        color: '#63FB00',
        fontWeight: 'bold',
        marginBottom: 5,
    },
    responseContent: {
        color: '#fff',
    },
});