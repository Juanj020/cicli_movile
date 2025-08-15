import { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { getNoticiasVisibles, newNoticia } from '../../../api/noticias.js';
import NewForm from '../components/NoticiasForm.js';

const NoticiasScreen = () => {
  const [noticiaSeleccionada, setNoticiaSeleccionada] = useState(null);
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

  useEffect(() => {
    fetchNoticias();
  }, []);

  const generarYGuardarNoticia = async () => {
    try {
      setLoading(true);
      const prompt = `Genera una noticia ciclista en Colombia. Incluye título, descripción, autor y una imagen representativa (URL).`;

      const resGemini = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=TU_API_KEY`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        }
      );

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

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.noticiaContainer}
      onPress={() => setNoticiaSeleccionada(item)}
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
        <ActivityIndicator size="large" color="#2196F3" />
      ) : (
        <FlatList
          data={noticias}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
        />
      )}

      {/* Botón flotante para agregar noticias */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Botón flotante para generar noticias */}
      <TouchableOpacity
        style={styles.fabGenerar}
        onPress={generarYGuardarNoticia}
      >
        <Ionicons name="sparkles" size={26} color="#fff" />
      </TouchableOpacity>

      {/* Modal Formulario */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <NewForm onClose={() => { setModalVisible(false); fetchNoticias(); }} />
      </Modal>

      {/* Modal Detalle */}
      <Modal
  visible={!!noticiaSeleccionada}
  animationType="slide"
  onRequestClose={() => setNoticiaSeleccionada(null)}
>
  <ScrollView style={styles.modalDetalle}>

    {/* Encabezado de detalle con botón de cerrar */}
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Detalle de Noticia</Text>
      <TouchableOpacity
        onPress={() => setNoticiaSeleccionada(null)}
        style={styles.closeButton}
      >
        <FontAwesome name="close" size={20} color="#fff" />
      </TouchableOpacity>
    </View>

    {noticiaSeleccionada?.imagen && (
      <Image
        source={{ uri: noticiaSeleccionada.imagen }}
        style={styles.imagenGrande}
      />
    )}
    <Text style={styles.tituloDetalle}>{noticiaSeleccionada?.titulo}</Text>
    <Text style={styles.descripcionDetalle}>{noticiaSeleccionada?.descripcion}</Text>
    <Text style={styles.autorDetalle}>
      Autor: {noticiaSeleccionada?.autor?.nombre || 'Desconocido'}
    </Text>
    <Text style={styles.fechaDetalle}>
      {noticiaSeleccionada?.fecha?.substring(0, 10)}
    </Text>
  </ScrollView>
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
  fab: {
    backgroundColor: '#2196F3',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
  fabGenerar: {
    backgroundColor: '#FF9800',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 80,
    right: 16,
  },
  modalDetalle: {
    flex: 1,
    backgroundColor: '#000',
    padding: 16,
  },
  cerrarModal: {
    color: '#ff4444',
    fontSize: 16,
    marginBottom: 10,
  },
  imagenGrande: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  tituloDetalle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  descripcionDetalle: {
    fontSize: 16,
    color: '#ddd',
    marginBottom: 10,
  },
  autorDetalle: {
    fontStyle: 'italic',
    color: '#aaa',
  },
  fechaDetalle: {
    color: 'gray',
    marginTop: 4,
  },
  header: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 20
},
headerTitle: {
  fontSize: 20,
  color: '#63FB00',
  fontWeight: 'bold'
},
closeButton: {
  padding: 6,
  backgroundColor: '#1A1A1A',
  borderRadius: 20
}
});

export default NoticiasScreen;
