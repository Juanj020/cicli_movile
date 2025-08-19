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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getNoticiasVisibles } from '../../../api/noticias.js';
import { useNavigation, useIsFocused } from '@react-navigation/native';

const NoticiasScreen = () => {
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [noticias, setNoticias] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchNoticias = async () => {
        try {
            setLoading(true);
            const data = await getNoticiasVisibles();
            setNoticias(data);
        } catch (error) {
            Alert.alert('Error', 'No se pudieron cargar las noticias.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isFocused) {
            fetchNoticias();
        }
    }, [isFocused]);

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.noticiaContainer}
            onPress={() => navigation.navigate('NewsDetail', { noticia: item })} // Navega al detalle
        >
            {item.imagen && (
                <Image
                    source={{ uri: item.imagen }}
                    style={styles.imagen}
                />
            )}
            <View style={styles.textoContainer}>
                <Text style={styles.titulo}>{item.titulo}</Text>
                <Text numberOfLines={3} style={styles.descripcion}>{item.descripcion}</Text>
                <Text style={styles.autor}>Autor: {item.autor?.nombre || 'Desconocido'}</Text>
                <Text style={styles.fecha}>{item.fecha?.substring(0, 10)}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#63FB00" />
            ) : (
                <FlatList
                    data={noticias}
                    keyExtractor={(item) => item._id}
                    renderItem={renderItem}
                />
            )}

            {/* Botón flotante para la administración */}
            <TouchableOpacity
                style={styles.fabAdmin}
                onPress={() => navigation.navigate('NewsAdmin')}
            >
                <Ionicons name="settings" size={28} color="#fff" />
            </TouchableOpacity>

            {/* Botón flotante para crear una noticia */}
            <TouchableOpacity
                style={styles.fabAdd}
                onPress={() => navigation.navigate('NewsForm', { noticia: null })}
            >
                <Ionicons name="add" size={28} color="#fff" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#000',
    },
    noticiaContainer: {
        flexDirection: 'row',
        marginBottom: 16,
        backgroundColor: '#1A1A1A',
        borderRadius: 8,
        padding: 12,
    },
    imagen: {
        width: 100,
        height: 100,
        marginRight: 16,
        borderRadius: 8,
    },
    textoContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    titulo: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    descripcion: {
        marginTop: 4,
        color: '#ccc',
    },
    autor: {
        marginTop: 4,
        fontStyle: 'italic',
        color: '#aaa',
    },
    fecha: {
        marginTop: 4,
        color: 'gray',
    },
    fabAdd: {
        backgroundColor: '#63FB00',
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 16,
        right: 16,
    },
    fabAdmin: {
        backgroundColor: '#2196F3',
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 80,
        right: 16,
    },
});

export default NoticiasScreen;