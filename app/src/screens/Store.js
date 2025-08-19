// src/screens/TiendasScreen.js
import React, { useEffect, useState, useContext } from "react";
import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import TiendaCard from '../components/TiendaCard.js';
import { getTiendasVisibles } from '../../../api/store.js';
import { AuthContext } from '../context/AuthContext.js'; // 🆕 Importa el contexto de autenticación

const API_BACKEND = "https://ciclysan.onrender.com/api";

export default function TiendasScreen({ navigation }) {
    const [tiendas, setTiendas] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext); // 🆕 Usa el contexto para obtener el usuario

    const obtenerTiendas = async () => {
        try {
            const data = await getTiendasVisibles();
            setTiendas(data);
        } catch (error) {
            console.error("Error al obtener tiendas:", error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            obtenerTiendas();
        }, [])
    );

    const handlePress = (tienda) => {
        navigation.navigate('TiendaDetail', { tienda });
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#63FB00" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.tituloHeader}>Tiendas Recomendadas</Text>
            <FlatList
                data={tiendas}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => <TiendaCard tienda={item} onPress={handlePress} />}
                contentContainerStyle={styles.listContent}
            />
            {/* Botón flotante para sugerir tienda */}
            <TouchableOpacity
                style={[styles.botonFlotante, styles.botonSugerir]}
                onPress={() => navigation.navigate('SugerirTienda')}
            >
                <Ionicons name="add" size={28} color="#fff" />
            </TouchableOpacity>

            {/* 🆕 Renderiza el botón de administración solo si el usuario es 'ADMIN' */}
            {user && user.rol === 'ADMIN' && (
                <TouchableOpacity
                    style={[styles.botonFlotante, styles.botonAdmin]}
                    onPress={() => navigation.navigate('TiendasAdmin')}
                >
                    <Ionicons name="settings-outline" size={28} color="#fff" />
                </TouchableOpacity>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
        padding: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    tituloHeader: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#63FB00',
        textAlign: 'center',
        marginBottom: 20,
    },
    listContent: {
        paddingBottom: 20,
    },
    botonFlotante: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    botonSugerir: {
        backgroundColor: '#63FB00',
    },
    botonAdmin: {
        backgroundColor: '#FF9800',
        bottom: 90,
    },
});