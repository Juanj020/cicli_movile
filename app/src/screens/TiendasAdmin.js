// src/screens/TiendasAdminScreen.js
import React, { useState, useEffect } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { getTiendasVisiblesAdmin, deleteTienda, toggleTiendaVisibilidad } from '../../../api/store.js';

const TiendasAdminScreen = () => {
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [tiendas, setTiendas] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTiendas = async () => {
        try {
            setLoading(true);
            const data = await getTiendasVisiblesAdmin();
            setTiendas(data);
        } catch (error) {
            Alert.alert('Error', 'No se pudieron cargar las tiendas de administración.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isFocused) {
            fetchTiendas();
        }
    }, [isFocused]);

    const handleToggleVisibility = async (id, estadoActual) => {
        const nuevoEstado = estadoActual === 'Visible' ? 'Invisible' : 'Visible';
        try {
            await toggleTiendaVisibilidad(id, nuevoEstado);
            fetchTiendas();
        } catch (error) {
            Alert.alert('Error', 'No se pudo cambiar la visibilidad de la tienda.');
        }
    };

    const handleDelete = async (id) => {
        Alert.alert(
            'Confirmar eliminación',
            '¿Estás seguro de que quieres eliminar esta tienda?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteTienda(id);
                            fetchTiendas();
                        } catch (error) {
                            Alert.alert('Error', 'No se pudo eliminar la tienda.');
                        }
                    },
                },
            ],
            { cancelable: true }
        );
    };

    const handleEdit = (tienda) => {
        navigation.navigate('TiendaEdit', { tienda });
    };

    const renderItem = ({ item }) => (
        <View style={styles.tiendaContainer}>
            {item.imagen && (
                <Image
                    source={{ uri: item.imagen }}
                    style={styles.imagen}
                />
            )}
            <View style={styles.textoContainer}>
                <Text style={styles.nombre}>{item.nombre}</Text>
                <Text style={styles.localizacion}>
                    {item.localizacion}
                </Text>
            </View>
            <View style={styles.accionesContainer}>
                <Switch
                    trackColor={{ false: "#767577", true: "#63FB00" }}
                    thumbColor={item.estado === 'Visible' ? "#f4f3f4" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={() => handleToggleVisibility(item._id, item.estado)}
                    value={item.estado === 'Visible'}
                />
                <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => handleEdit(item)}
                >
                    <Ionicons name="create-outline" size={24} color="#007BFF" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDelete(item._id)}
                >
                    <Ionicons name="trash-outline" size={24} color="#FF0000" />
                </TouchableOpacity>
            </View>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#63FB00" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.tituloHeader}>Panel de Administración de Tiendas</Text>
            </View>
            <TouchableOpacity
                style={styles.botonAgregar}
                onPress={() => navigation.navigate('SugerirTiendaIA')}
            >
                <Ionicons name="add-circle-outline" size={24} color="#fff" />
                <Text style={styles.botonAgregarTexto}>Agregar Tienda IA</Text>
            </TouchableOpacity>
            <FlatList
                data={tiendas}
                keyExtractor={(item) => item._id}
                renderItem={renderItem}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#000',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    logo: {
        width: 80,
        height: 80,
        marginBottom: 10,
    },
    tituloHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#63FB00',
        textAlign: 'center',
    },
    botonAgregar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#63FB00',
        paddingVertical: 12,
        borderRadius: 8,
        marginBottom: 16,
        elevation: 3,
    },
    botonAgregarTexto: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    tiendaContainer: {
        flexDirection: 'row',
        marginBottom: 16,
        backgroundColor: '#1A1A1A',
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
    },
    imagen: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 12,
    },
    textoContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    nombre: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    localizacion: {
        marginTop: 4,
        color: '#ccc',
        fontSize: 12,
    },
    accionesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    editButton: {
        marginLeft: 10,
    },
    deleteButton: {
        marginLeft: 10,
    },
    // Estilos del botón de IA
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
});

export default TiendasAdminScreen;