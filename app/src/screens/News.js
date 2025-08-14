import { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList, Image,
  Modal, StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
// Importa la función que carga las noticias
import { getNoticiasVisibles, newNoticia } from '../../../api/noticias.js';

const NoticiasScreen = () => {
  const [noticias, setNoticias] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
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

  // 1. Llama a la función `fetchNoticias` cuando el componente se monta
  useEffect(() => {
    fetchNoticias();
  }, []);

  const generarYGuardarNoticia = async () => {
    try {
      setLoading(true);
      const prompt = `Genera una noticia ciclista en Colombia. Incluye título, descripción, autor y una imagen representativa (URL).`;
      
      const resGemini = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyAP9oC0wp9-4VW6BEQf_zJLyRks8bh6s_Q`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      const data = await resGemini.json();
      const texto = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No se generó.";
      
      const tituloMatch = texto.match(/Título: (.+)/i);
      const descripcionMatch = texto.match(/Descripción:([\s\S]*?)Autor:/i);
      const autorMatch = texto.match(/Autor: (.+)/i);
      const imagenMatch = texto.match(/https?:\/\/[^\s]+/);

      const nuevaNoticia = {
        titulo: tituloMatch?.[1]?.trim() || "Noticia ciclista",
        descripcion: descripcionMatch?.[1]?.trim() || texto,
        autor: { nombre: autorMatch?.[1]?.trim() || "Desconocido" },
        imagen: imagenMatch?.[0] || null
      };
      
      await newNoticia(nuevaNoticia);

      Alert.alert("Generada", "La noticia fue generada correctamente.");
      fetchNoticias();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo generar la noticia.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Esta función se encarga de renderizar cada item de la lista
  const renderItem = ({ item }) => (
    <View style={styles.noticiaContainer}>
      {item.imagen && <Image source={{ uri: item.imagen }} style={styles.imagen} />}
      <View style={styles.textoContainer}>
        <Text style={styles.titulo}>{item.titulo}</Text>
        <Text numberOfLines={3} style={styles.descripcion}>{item.descripcion}</Text>
        <Text style={styles.autor}>Autor: {item.autor?.nombre || 'Desconocido'}</Text>
        <Text style={styles.fecha}>{item.fecha?.substring(0, 10)}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#2196F3" />
      ) : (
        // 3. Usa FlatList para renderizar la lista de noticias
        <FlatList
          data={noticias} // `data` es el array de noticias
          keyExtractor={(item) => item._id}
          renderItem={renderItem} // `renderItem` es la función para renderizar cada item
        />
      )}

      <TouchableOpacity
        style={styles.botonAgregar}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.textoBoton}>Agregar Noticia</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.botonGenerar}
        onPress={generarYGuardarNoticia}
      >
        <Text style={styles.textoBoton}>+ Generar Noticia</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <Text>Formulario para agregar noticias</Text>
      </Modal>
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
    backgroundColor: '#111',
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
    color: '#ddd',
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
  botonAgregar: {
    backgroundColor: '#2196F3',
    padding: 12,
    alignItems: 'center',
    borderRadius: 8,
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
  botonGenerar: {
    backgroundColor: '#FF9800',
    padding: 12,
    alignItems: 'center',
    borderRadius: 8,
    position: 'absolute',
    bottom: 80,
    right: 16,
  },
  textoBoton: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default NoticiasScreen;