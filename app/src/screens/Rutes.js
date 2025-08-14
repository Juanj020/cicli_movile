// src/screens/Rutes.js
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet, View, TouchableOpacity, Text  } from 'react-native';
import { getRutasVisibles } from '../../../api/rutas.js';
import RutaCard from '../components/RutaCard.js';
import { Ionicons } from '@expo/vector-icons';

export default function Rutes({ navigation }) {
  const [rutas, setRutas] = useState([]);
  const [rutasFiltradas, setRutasFiltradas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('Todos');

  useEffect(() => {
    const fetchRutas = async () => {
      const data = await getRutasVisibles();
      setRutas(data);
      setRutasFiltradas(data);
      setLoading(false);
    };
    fetchRutas();
  }, []);

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
      style={styles.botonFlotante}
      onPress={() => navigation.navigate('SugerirRuta')}
    >
      <Ionicons name="add" size={28} color="#fff" />
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
  backgroundColor: '#63FB00',
  borderRadius: 30,
  width: 60,
  height: 60,
  justifyContent: 'center',
  alignItems: 'center',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 3,
  elevation: 5,
},
});
