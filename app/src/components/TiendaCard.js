// src/components/TiendaCard.js
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

export default function TiendaCard({ tienda, onPress }) {
    const defaultImage = require('../assets/ciclista6.jpg');

    return (
        <TouchableOpacity onPress={() => onPress(tienda)} style={styles.card} activeOpacity={0.8}>
            <Image
                source={
                    tienda.imagen && tienda.imagen.trim() !== ""
                        ? { uri: tienda.imagen }
                        : defaultImage
                }
                style={styles.image}
            />
            <View style={styles.info}>
                <Text style={styles.title}>{tienda.nombre}</Text>
                {tienda.localizacion && <Text style={styles.text}>{tienda.localizacion}</Text>}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        marginVertical: 8,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 5,
    },
    image: {
        width: '100%',
        height: 180,
    },
    info: {
        padding: 15,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 5,
    },
    text: {
        fontSize: 14,
        color: '#ccc',
    },
});