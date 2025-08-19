// src/screens/Rutes.js
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet, View, TouchableOpacity, Text  } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getRutasVisibles } from '../../../api/rutas.js';
import RutaCard from '../components/RutaCard.js';
import { Ionicons } from '@expo/vector-icons';

export default function Rutes({ navigation }) {
  const [rutas, setRutas] = useState([]);
  const [rutasFiltradas, setRutasFiltradas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('Todos');

  const fetchRutas = async () => {
    try {
      const data = await getRutasVisibles();
      setRutas(data);
      setRutasFiltradas(data);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener rutas visibles:', error);
      setLoading(false);
    }
  };

  // 🔄 Usa useFocusEffect en lugar de useEffect
  useFocusEffect(
    React.useCallback(() => {
      fetchRutas();
    }, [])
  );


  const handlePress = (ruta) => {
    navigation.navigate('RutaDetail', { ruta });
  };

  const aplicarFiltro = (nivel) => {
    setFiltro(nivel);
    if (nivel === 'Todos') {
      setRutasFiltradas(rutas);
    } else {
      setRutasFiltradas(rutas.filter(r => r.dificultad?.toLowerCase() === nivel.toLowerCase()));
    }
  };

  const BotonFiltro = ({ label }) => (
    <TouchableOpacity
      style={[styles.botonFiltro, filtro === label && styles.botonActivo]}
      onPress={() => aplicarFiltro(label)}
    >
      <Text style={[styles.textoBoton, filtro === label && styles.textoActivo]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Botones de filtro */}
      <View style={styles.filtrosContainer}>
        <BotonFiltro label="Todos" />
        <BotonFiltro label="Baja" />
        <BotonFiltro label="Mediana" />
        <BotonFiltro label="Dificil" />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#63FB00" />
      ) : (
        <FlatList
          data={rutasFiltradas}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <RutaCard ruta={item} onPress={handlePress} />}
        />
      )}
      <TouchableOpacity
        style={[styles.botonFlotante, styles.botonSugerir]}
        onPress={() => navigation.navigate('SugerirRuta')}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
      {/* Nuevo botón flotante para el panel de administración */}
      <TouchableOpacity
        style={[styles.botonFlotante, styles.botonAdmin]}
        onPress={() => navigation.navigate('RutasAdmin')}
      >
        <Ionicons name="settings-outline" size={28} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#000'
  },
  filtrosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12
  },
  botonFiltro: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#222'
  },
  botonActivo: {
    backgroundColor: '#63FB00'
  },
  textoBoton: {
    color: '#fff',
    fontWeight: 'bold'
  },
  textoActivo: {
    color: '#000'
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
    backgroundColor: '#63FB00', // Verde
  },
  botonAdmin: {
    backgroundColor: '#FF9800', // Naranja
    bottom: 90, // Para que no se superpongan
  },
});
