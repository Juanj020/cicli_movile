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
import { getNoticias, deleteNoticia, toggleNoticiaVisibilidad } from '../../../api/noticias.js';
import { useNavigation, useIsFocused } from '@react-navigation/native';

const NewsAdminScreen = () => {
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [noticias, setNoticias] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNoticias = async () => {
        try {
            setLoading(true);
            const data = await getNoticias();
            setNoticias(data);
        } catch (error) {
            Alert.alert('Error', 'No se pudieron cargar las noticias de administración.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isFocused) {
            fetchNoticias();
        }
    }, [isFocused]);

    const handleToggleVisibility = async (id, estadoActual) => {
        const nuevoEstado = estadoActual === 'Visible' ? 'Invisible' : 'Visible';
        try {
            await toggleNoticiaVisibilidad(id, nuevoEstado);
            Alert.alert('Éxito', `La noticia ahora es ${nuevoEstado}.`);
            fetchNoticias();
        } catch (error) {
            console.error('Error al cambiar la visibilidad:', error);
            Alert.alert('Error', 'No se pudo actualizar la visibilidad.');
        }
    };

    const handleDelete = (id) => {
        Alert.alert(
            'Confirmar eliminación',
            '¿Estás seguro de que quieres eliminar esta noticia?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteNoticia(id);
                            Alert.alert('Éxito', 'Noticia eliminada correctamente.');
                            fetchNoticias();
                        } catch (error) {
                            Alert.alert('Error', 'No se pudo eliminar la noticia.');
                        }
                    },
                },
            ]
        );
    };

    const handleEdit = (noticia) => {
        navigation.navigate('NoticiaEdit', { noticia });
    };

    const handleAIAction = () => {
        Alert.alert('Función de IA', 'Esta función se implementará más tarde.');
    };

    const renderItem = ({ item }) => (
        <View style={styles.noticiaContainer}>
            <Image
                source={{ uri: item.imagen }}
                style={styles.imagen}
                onError={() => console.log('Error al cargar la imagen de la noticia')}
            />
            <View style={styles.textoContainer}>
                <Text style={styles.titulo} numberOfLines={2} ellipsizeMode='tail'>
                    {item.titulo}
                </Text>
                {item.autor && <Text style={styles.autor}>Autor: {item.autor.nombre}</Text>}
                <Text style={styles.estado}>Estado: {item.estado}</Text>
            </View>
            <View style={styles.accionesContainer}>
                {/* Botón de visibilidad con Switch */}
                <Switch
                    value={item.estado === 'Visible'}
                    onValueChange={() => handleToggleVisibility(item._id, item.estado)}
                    trackColor={{ false: '#767577', true: '#63FB00' }}
                    thumbColor={item.estado === 'Visible' ? '#f4f3f4' : '#f4f3f4'}
                />
                {/* Botón de editar */}
                <TouchableOpacity onPress={() => handleEdit(item)}>
                    <Ionicons name="create-outline" size={24} color="#FF9800" style={styles.icon} />
                </TouchableOpacity>
                {/* Botón de eliminar */}
                <TouchableOpacity onPress={() => handleDelete(item._id)}>
                    <Ionicons name="trash-outline" size={24} color="#FF5252" style={styles.icon} />
                </TouchableOpacity>
                {/* Botón de la IA */}
                <TouchableOpacity onPress={() => Alert.alert('Función de IA', 'Tokens de IA acabados, intente más tarde.')}>
                    <Ionicons name="sparkles-outline" size={24} color="#63FB00" style={styles.icon} />
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
            <Text style={styles.tituloHeader}>Panel de Administración de Noticias</Text>
            {/* Botón grande para agregar noticias con IA */}
            <TouchableOpacity
                style={styles.botonAgregar}
                onPress={() => Alert.alert("Aviso", "Tokens de IA acabados, intente más tarde.")}
            >
                <Ionicons name="add-circle-outline" size={24} color="#fff" />
                <Text style={styles.botonAgregarTexto}>Agregar Noticia IA</Text>
            </TouchableOpacity>

            <FlatList
                data={noticias}
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
    tituloHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#63FB00',
        textAlign: 'center',
        marginBottom: 20,
    },
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
    noticiaContainer: {
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
    titulo: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    autor: {
        marginTop: 4,
        color: '#ccc',
        fontStyle: 'italic',
    },
    estado: {
        marginTop: 4,
        color: '#63FB00',
        fontWeight: 'bold',
    },
    accionesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: 140,
        marginLeft: 10,
    },
    icon: {
        padding: 5,
    },
});

export default NewsAdminScreen;