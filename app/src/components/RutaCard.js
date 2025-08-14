import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function RutaCard({ ruta, onPress }) {
  return (
    <TouchableOpacity
      onPress={() => onPress(ruta)}
      style={styles.card}
      activeOpacity={0.8}
    >
      <Image
        source={
          ruta.imagen && ruta.imagen.trim() !== ""
            ? { uri: ruta.imagen }
            : require('../assets/ciclista6.jpg')
        }
        style={styles.image}
      />
      <View style={styles.info}>
        <Text style={styles.title}>{ruta.nombreRut}</Text>
        <View style={styles.ratingContainer}>
          <FontAwesome
            name="star"
            size={16}
            color={ruta.promedio >= 4 ? "#FFD700" : ruta.promedio >= 2 ? "#FFA500" : "#FF4500"}
          />
          <Text style={styles.ratingText}>
            {ruta.promedio} ({ruta.totalVotos})
          </Text>
        </View>
        <Text style={styles.text}>Dificultad: {ruta.dificultad}</Text>
        <Text style={styles.text}>Kilómetros: {ruta.kilometros}</Text>
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
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  image: {
    width: '100%',
    height: 180,
  },
  info: {
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#63FB00',
  },
  text: {
    color: '#fff',
    fontSize: 14
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4
  },
  ratingText: {
    color: '#fff',
    marginLeft: 4,
    fontSize: 14
  }
});