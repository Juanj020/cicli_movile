import React, { useContext } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { AuthContext } from '../context/AuthContext.js';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const { user } = useContext(AuthContext);

  return (
    <ScrollView style={styles.container}>
      {/* Imagen de portada */}
      <Image
        source={require('../assets/profile-bg2.jpg')} // Puedes poner una imagen de fondo tuya
        style={styles.coverImage}
      />

      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <Image
          source={require('../assets/avatar.png')} // Puedes reemplazar con avatar real
          style={styles.avatar}
        />
      </View>

      {/* Nombre */}
      <Text style={styles.name}>{user?.nombre || 'Usuario'}</Text>
      <Text style={styles.role}>
        {user?.rol === 'ADMIN' ? 'Administrador' : 'Usuario'}
      </Text>

      {/* Tarjeta de información */}
      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Ionicons name="mail" size={20} color="#63FB00" />
          <Text style={styles.infoText}>{user?.correo || 'No disponible'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="call" size={20} color="#63FB00" />
          <Text style={styles.infoText}>{user?.telefono || 'No disponible'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="person" size={20} color="#63FB00" />
          <Text style={styles.infoText}>{user?.rol || 'No disponible'}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  coverImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: -50,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#63FB00',
  },
  name: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  role: {
    color: '#63FB00',
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 20,
  },
  infoCard: {
    backgroundColor: '#111',
    margin: 20,
    borderRadius: 10,
    padding: 15,
    shadowColor: '#63FB00',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 5,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomColor: '#222',
    borderBottomWidth: 1,
  },
  infoText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },
});
