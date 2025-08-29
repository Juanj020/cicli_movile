import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Switch,
    Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { getRutasAdmin, toggleRutaVisibilidad, deleteRuta, } from '../../../api/rutas.js';

const RutaAdminItem = ({ ruta, onToggle, onEdit, onDelete }) => (
    <View style={styles.itemContainer}>
        <Image
            source={
                ruta.imagen && ruta.imagen.trim() !== ""
                    ? { uri: ruta.imagen }
                    : require('../assets/ciclista6.jpg')
            }
            style={styles.imagen}
            onError={() => console.log('Error al cargar la imagen')}
        />
        <View style={styles.infoContainer}>
            <Text style={styles.nombre}>{ruta.nombreRut}</Text>
            <Text style={styles.info}>Dificultad: {ruta.dificultad}</Text>
        </View>
        <View style={styles.actionsContainer}>
            {/* Botón de visibilidad */}
            <Switch
                value={ruta.estado === 'Visible'}
                onValueChange={() => onToggle(ruta._id, ruta.estado)}
                trackColor={{ false: '#767577', true: '#63FB00' }}
                thumbColor={ruta.estado === 'Visible' ? '#f4f3f4' : '#f4f3f4'}
            />
            {/* Botones de acción */}
            <TouchableOpacity onPress={() => onEdit(ruta)}>
                <Ionicons name="create-outline" size={24} color="#FF9800" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onDelete(ruta._id)}>
                <Ionicons name="trash-outline" size={24} color="#FF5252" />
            </TouchableOpacity>
            {/* Botón de la IA (por ahora solo un icono) */}
            <TouchableOpacity onPress={() => Alert.alert('Función de IA', 'Tokens de IA acabados, intente más tarde.')}>
                <Ionicons name="sparkles-outline" size={24} color="#63FB00" />
            </TouchableOpacity>
        </View>
    </View>
);

export default function RutasAdminScreen({ navigation }) {
    const [rutas, setRutas] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRutas = async () => {
        try {
            setLoading(true);
            const data = await getRutasAdmin();
            setRutas(data);
        } catch (error) {
            console.error('Error al obtener las rutas para admin:', error);
            Alert.alert('Error', 'No se pudieron cargar las rutas de administración.');
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
        fetchRutas();
        }, [])
    );

    const handleToggle = async (id, estadoActual) => {
        const nuevoEstado = estadoActual === 'Visible' ? 'Invisible' : 'Visible';
        try {
            await toggleRutaVisibilidad(id, nuevoEstado);
            Alert.alert('Éxito', `La ruta ahora es ${nuevoEstado}.`);
            fetchRutas(); // Recarga las rutas para ver el cambio
        } catch (error) {
            console.error('Error al cambiar la visibilidad:', error);
            Alert.alert('Error', 'No se pudo actualizar la visibilidad.');
        }
    };

    const handleDelete = (id) => {
        Alert.alert(
            "Eliminar Ruta",
            "¿Estás seguro de que quieres eliminar esta ruta?",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Eliminar",
                    onPress: async () => {
                        try {
                            await deleteRuta(id);
                            Alert.alert('Eliminada', 'La ruta fue eliminada correctamente.');
                            fetchRutas(); // Recarga las rutas
                        } catch (error) {
                            console.error('Error al eliminar la ruta:', error);
                            Alert.alert('Error', 'No se pudo eliminar la ruta.');
                        }
                    }
                }
            ]
        );
    };

    const handleEdit = (ruta) => {
        // Navega a una pantalla de edición, pasando la ruta como parámetro
        navigation.navigate('RutaEdit', { ruta });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Panel de Administración de Rutas</Text>
            
            {/* Botón grande para agregar rutas */}
            <TouchableOpacity 
                style={styles.botonAgregar} 
                onPress={() => Alert.alert("Aviso", "Tokens de IA acabados, intente más tarde.")}
            >
                <Ionicons name="add-circle-outline" size={24} color="#fff" />
                <Text style={styles.botonAgregarTexto}>Agregar Ruta IA</Text>
            </TouchableOpacity>
            
            {loading ? (
                <ActivityIndicator size="large" color="#63FB00" />
            ) : (
                <FlatList
                    data={rutas}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <RutaAdminItem
                            ruta={item}
                            onToggle={handleToggle}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#000',
    },
    titulo: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#63FB00',
        textAlign: 'center',
        marginBottom: 20,
    },
    // Estilos para el nuevo botón de agregar
    botonAgregar: {
        backgroundColor: '#63FB00',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
        width: '100%',
    },
    botonAgregarTexto: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    itemContainer: {
        flexDirection: 'row',
        backgroundColor: '#1A1A1A',
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    imagen: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 10,
    },
    infoContainer: {
        flex: 1,
    },
    nombre: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    info: {
        color: '#ccc',
        fontSize: 12,
    },
    actionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: 120,
    },
});