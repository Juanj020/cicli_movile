import { useEffect, useState } from "react";
import { ActivityIndicator, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const API_BACKEND = "https://ciclysan.onrender.com/api"; // ⚠️ Ajusta esto
const TOKEN_GEMINIS = process.env.TOKEN_GEMINIS;

export default function Store() {
  const [tiendas, setTiendas] = useState([]);
  const [loading, setLoading] = useState(true);

  const obtenerTiendas = async () => {
    try {
      const res = await fetch(`${API_BACKEND}/tienda`);
      const data = await res.json();
      setTiendas(data);
    } catch (error) {
      console.error("Error al obtener tiendas:", error);
    } finally {
      setLoading(false);
    }
  };

  const generarYGuardarTienda = async () => {
    try {
      const prompt = `Genera una recomendación de una tienda ciclista en Bucaramanga. Incluye si puedes: imagen (url), contacto, página web.`;
      const resGemini = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyAP9oC0wp9-4VW6BEQf_zJLyRks8bh6s_Q`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });

      const data = await resGemini.json();
      const texto = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No se generó.";

      // Extraer info (mejorable con NLP)
      const urlMatch = texto.match(/https?:\/\/[^\s]+/);
      const contactoMatch = texto.match(/(Contacto|Teléfono|Whatsapp):?\s*(.*)/i);
      const telMatch = texto.match(/(\+?\d[\d\s\-]{7,15})/);

      const nuevaTienda = {
        descripcion: texto,
        imagen: urlMatch?.[0] || null,
        contacto: contactoMatch?.[2] || telMatch?.[0] || null,
        web: urlMatch?.[0] || null
      };

      // Guardar en backend
      await fetch(`${API_BACKEND}/tienda/tiendas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevaTienda)
      });

      obtenerTiendas(); // recarga
    } catch (error) {
      console.error("Error al generar/guardar tienda:", error);
    }
  };

  useEffect(() => {
    obtenerTiendas();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titulo}>🏬 Tiendas Ciclistas BGA</Text>
      <TouchableOpacity onPress={generarYGuardarTienda} style={styles.botonGenerar}>
        <Text style={styles.textoBoton}>+ Generar Tienda</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#63FB00" />
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
          {tiendas.map((tienda, index) => (
            <View key={index} style={styles.card}>
              {tienda.imagen ? (
                <Image source={{ uri: tienda.imagen }} style={styles.imagen} resizeMode="cover" />
              ) : (
                <View style={styles.noImagen}>
                  <Text style={styles.noImagenTexto}>Sin imagen disponible</Text>
                </View>
              )}
              <Text style={styles.contenido}>{tienda.descripcion}</Text>
              {tienda.contacto && <Text style={styles.contacto}>📞 {tienda.contacto}</Text>}
              {tienda.web && <Text style={styles.contacto}>🌐 {tienda.web}</Text>}
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingTop: 20,
    paddingHorizontal: 16
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#63FB00",
    marginBottom: 16,
    textAlign: "center"
  },
  card: {
    backgroundColor: "#111",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#63FB00",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 5
  },
  imagen: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 12
  },
  noImagen: {
    width: "100%",
    height: 200,
    backgroundColor: "#222",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12
  },
  noImagenTexto: {
    color: "gray",
    fontStyle: "italic"
  },
  contenido: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 8
  },
  contacto: {
    color: "#63FB00",
    fontSize: 14
  },
  botonGenerar: {
    backgroundColor: '#63FB00',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  textoBoton: {
    color: '#000',
    fontWeight: 'bold',
  }
});
