// src/screens/RutaDetail.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Linking,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { saveCalificacion, getPromedioCalificacion } from '../../../api/calificaciones.js';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RutaDetail({ route }) {
  const { ruta } = route.params;

  const [userRating, setUserRating] = useState(0); 
  const [promedio, setPromedio] = useState(0);
  const [totalVotos, setTotalVotos] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

 useEffect(() => {
  const fetchUserId = async () => {
    const id = await AsyncStorage.getItem('userId');
    if (id) {
      setUserId(id);
    } else {
      console.log("No se encontró userId en AsyncStorage");
    }
  };
  fetchUserId();
}, []);

  // 🔹 Cargar promedio desde backend
  useEffect(() => {
    const fetchPromedio = async () => {
      try {
        const data = await getPromedioCalificacion(ruta._id);
        setPromedio(data.promedio || 0);
        setTotalVotos(data.totalVotos || 0);
      } catch (error) {
        console.error("Error obteniendo promedio:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPromedio();
  }, []);

  useEffect(() => {
    if (userId && ruta?._id) {
      fetchCalificacionUsuario();
    }
  }, [userId, ruta]);

  // 🔹 Guardar calificación
  const handleVote = async (rating) => {
  setUserRating(rating);
  try {
    await saveCalificacion(ruta._id, userId, rating);
    const { promedio, totalVotos } = await getPromedioCalificacion(ruta._id);
    setPromedio(promedio);
    setTotalVotos(totalVotos);
    } catch (error) {
      console.error("Error guardando calificación:", error);
      Alert.alert("Error", "No se pudo guardar tu calificación.");
    }
  };

  const fetchCalificacionUsuario = async () => {
  try {
    const response = await fetch(`https://ciclysan.onrender.com/api/calificacion/ruta/${ruta._id}/usuario/${userId}`);
    const data = await response.json();

    if (data && data.rating !== undefined) {
      setUserRating(data.rating); // Para que aparezca la calificación previa
    }
  } catch (error) {
    console.error("Error obteniendo calificación del usuario:", error);
  }
};

  const getStarColor = (rating) => {
    if (rating >= 4) return '#FFD700';
    if (rating >= 2) return '#FFA500';
    return '#FF4500';
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
        <ActivityIndicator size="large" color="#63FB00" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image
        source={
          ruta?.imagen && String(ruta.imagen).trim().length > 0
            ? { uri: ruta.imagen }
            : require('../assets/ciclista6.jpg')
        }
        style={styles.image}
      />

      <Text style={styles.title}>{ruta.nombreRut}</Text>

      {/* Promedio */}
      <View style={styles.ratingContainer}>
        <FontAwesome name="star" size={18} color={getStarColor(promedio)} />
        <Text style={styles.ratingText}>
          {promedio} ({totalVotos} votos)
        </Text>
      </View>

      <Text style={styles.label}>Descripción</Text>
      <Text style={styles.text}>{ruta.descripcion}</Text>

      <View style={styles.infoContainer}>
        <Text style={styles.info}>📍 Partida: {ruta.punto_partida}</Text>
        <Text style={styles.info}>🏁 Llegada: {ruta.punto_llegada}</Text>
        <Text style={styles.info}>⚡ Dificultad: {ruta.dificultad}</Text>
        <Text style={styles.info}>🚴 Kilómetros: {ruta.kilometros}</Text>
        <Text style={styles.info}>⏱ Tiempo: {ruta.tiempo_aprox}</Text>
        <Text style={styles.info}>⬇️ Altitud min: {ruta.altitud_min}</Text>
        <Text style={styles.info}>⬆️ Altitud max: {ruta.altitud_max}</Text>
        <Text style={styles.info}>💡 Recomendaciones: {ruta.recomendaciones}</Text>
      </View>

      {ruta.link && (
        <TouchableOpacity style={styles.mapsButton} onPress={() => Linking.openURL(ruta.link)}>
          <Text style={styles.mapsText}>Ver en Google Maps</Text>
        </TouchableOpacity>
      )}

      {/* Calificación */}
      <Text style={styles.label}>Califica esta ruta</Text>
      <View style={styles.voteSection}>
        <View style={styles.voteContainer}>
          {[1, 2, 3, 4, 5].map((num) => (
            <TouchableOpacity key={num} onPress={() => handleVote(num)}>
              <FontAwesome
                name={userRating >= num ? 'star' : 'star-o'}
                size={36}
                color={userRating >= num ? '#FFD700' : '#ccc'}
                style={styles.star}
              />
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.ratingText}>
          {promedio} ({totalVotos} votos)
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#000' },
  image: { width: '100%', height: 220, borderRadius: 10, marginBottom: 12 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#63FB00', marginBottom: 8 },
  ratingContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  ratingText: {
  color: '#fff',
  fontSize: 16,
  marginTop: 6,
},
  label: { color: '#63FB00', fontSize: 18, fontWeight: 'bold', marginTop: 10, marginBottom: 4 },
  text: { color: '#ccc', fontSize: 15, marginBottom: 12 },
  infoContainer: { backgroundColor: '#1A1A1A', borderRadius: 8, padding: 12, marginBottom: 12 },
  info: { color: '#fff', fontSize: 14, marginBottom: 4 },
  mapsButton: { backgroundColor: '#63FB00', padding: 12, borderRadius: 8, alignItems: 'center', marginVertical: 12 },
  mapsText: { color: '#000', fontWeight: 'bold' },
  voteSection: {
  alignItems: 'center',
  marginTop: 16,
  marginBottom: 24,
},
  voteContainer: {
  flexDirection: 'row',
  justifyContent: 'center',
  marginVertical: 8,
},
  star: { marginHorizontal: 6 },
});
