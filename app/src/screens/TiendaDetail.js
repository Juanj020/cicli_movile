// src/screens/TiendaDetail.js
import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TiendaDetail({ route }) {
  const { tienda } = route.params;

  const handleOpenLink = (url) => {
    if (url && url.trim() !== '') {
      Linking.openURL(url).catch(err => console.error("Couldn't open URL", err));
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: tienda.imagen }}
        style={styles.image}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{tienda.nombre}</Text>

        <Text style={styles.label}>Localización</Text>
        <Text style={styles.info}>{tienda.localizacion}</Text>
        
        {tienda.contacto && tienda.contacto.length > 0 && (
          <View>
            <Text style={styles.label}>Contacto</Text>
            {tienda.contacto.map((c, index) => (
              <Text key={index} style={styles.info}>{c}</Text>
            ))}
          </View>
        )}

        {tienda.web && (
          <View>
            <Text style={styles.label}>Página Web</Text>
            <TouchableOpacity onPress={() => handleOpenLink(tienda.web)}>
              <Text style={styles.link}>{tienda.web}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 16
  },
  image: {
    width: '100%',
    height: 220,
    borderRadius: 10,
    marginBottom: 12
  },
  infoContainer: {
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#63FB00',
    marginBottom: 12
  },
  label: {
    color: '#63FB00',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 4
  },
  info: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 8
  },
  link: {
    color: '#007AFF', // Un azul estándar para enlaces
    fontSize: 14,
    textDecorationLine: 'underline'
  }
});