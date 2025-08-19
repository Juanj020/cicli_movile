import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
} from 'react-native';

const NewsDetailScreen = ({ route }) => {
  const { noticia } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{noticia.titulo}</Text>
      <Text style={styles.author}>Por {noticia.autor?.nombre || 'Desconocido'}</Text>
      <Text style={styles.date}>{noticia.fecha?.substring(0, 10)}</Text>
      {noticia.imagen && (
        <Image source={{ uri: noticia.imagen }} style={styles.image} />
      )}
      <Text style={styles.description}>{noticia.descripcion}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 16,   
    paddingBottom: 50
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#63FB00',
    marginBottom: 8,
  },
  author: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: '#888',
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 10,
    marginBottom: 16,
    resizeMode: 'cover',
  },
  description: {
    fontSize: 16,
    color: '#fff',
    lineHeight: 24,
    paddingBottom: 50
  },
});

export default NewsDetailScreen;