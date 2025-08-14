import React, { useState, useEffect } from "react";
import { SafeAreaView, View, Text, StyleSheet, FlatList, Image, Dimensions, TouchableOpacity, ScrollView } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const windowWidth = Dimensions.get("window").width;

const images = [
    { id: "1", src: require("../assets/ciclista1.jpg") },
    { id: "2", src: require("../assets/ciclista2.jpg") },
    { id: "3", src: require("../assets/ciclista3.jpg") },
    { id: "4", src: require("../assets/ciclista4.jpg") },
];

export default function Home() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [nombre, setNombre] = useState('');

    useEffect(() => {
        const fetchNombre = async () => {
            const name = await AsyncStorage.getItem('userNombre');
            if (name) setNombre(name);
        };

        fetchNombre();
    }, []);

    const onViewRef = React.useRef(({ changed }) => {
        if (changed && changed.length > 0) {
            setActiveIndex(changed[0].index);
        }
    });
    const viewConfigRef = React.useRef({ viewAreaCoveragePercentThreshold: 50 });

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerWelcome}>
                <Text style={styles.headerWelcomeText}>¡Bienvenido, {nombre}!</Text>
            </View>
            <ScrollView>
                <View style={styles.introContainer}>
                    <View style={styles.titulo}>
                        <Text style={styles.tituloCicli}>Cicli</Text>
                        <Text style={styles.tituloSan}>San</Text>
                    </View>

                    <View style={styles.introTextos}>
                        <Text style={styles.introTexto}>
                            Encontrarás diferentes rutas ciclísticas en las cuales podrás practicar. Hay mucha diversidad ya sea en el tipo de bicicleta, tu categoría (edad), clasificación (dificultad) y otros elementos.
                        </Text>
                        <Text style={styles.introTexto}>
                            También podrás registrarte para agregar nuevas rutas, explorar una tienda virtual ciclista y mantenerte al tanto de las noticias del mundo ciclista.
                        </Text>
                    </View>

                    <TouchableOpacity style={styles.botonWrapper} onPress={() => alert('Pronto más información!')}>
                        <LinearGradient
                            colors={["#00FF7F", "#32CD32"]} // Puedes usar tus colores
                            start={{ x: 0, y: 0 }}
                            end={{ x: 0, y: 1 }}
                            style={styles.boton}
                        >
                            <Text style={styles.botonTexto}>Conoce más</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
                <View style={styles.carouselContainer}>
                    <FlatList
                        data={images}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <Image source={item.src} style={styles.carouselImage} resizeMode="cover" />
                        )}
                        onViewableItemsChanged={onViewRef.current}
                        viewabilityConfig={viewConfigRef.current}
                    />
                    <View style={styles.indicatorContainer}>
                        {images.map((_, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.indicator,
                                    index === activeIndex ? styles.activeIndicator : null,
                                ]}
                            />
                        ))}
                    </View>
                </View>

                <View style={styles.infoContainer}>
                    <Text style={styles.title}>Sobre nosotros</Text>
                    <Text style={styles.paragraph}>
                        Esta es una página web dedicada a los ciclistas en Santander - Colombia, donde encontrarás rutas para practicar ciclismo, una tienda virtual y noticias del mundo ciclista.
                    </Text>
                    <Text style={styles.paragraph}>
                        Nuestro objetivo es formar una comunidad de ciclistas apasionados que salgan a pedalear en grupo y compartan experiencias.
                    </Text>
                    {/* Aquí puedes agregar el QR si tienes la imagen */}
                    {/* <Image source={require('../assets/qr.png')} style={styles.qrImage} /> */}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    headerWelcome: {
        position: 'absolute',
        top: 10,
        right: 16,
        zIndex: 10,
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8
        },
    headerWelcomeText: {
        color: '#63FB00',
        fontSize: 14,
        fontWeight: '600'
    },
    container: {
        flex: 1,
        paddingTop: 20,
        paddingHorizontal: 16,
        backgroundColor: '#000'
    }, introContainer: {
        padding: 20,
        backgroundColor: "#000",
    },
    titulo: {
        flexDirection: "row",
        alignItems: "baseline",
    },
    tituloCicli: {
        fontSize: 40,
        fontWeight: "bold",
        color: "#63FB00",
    },
    tituloSan: {
        fontSize: 40,
        color: "#fff",
        marginLeft: 5,
    },
    introTextos: {
        marginTop: 15,
    },
    introTexto: {
        fontSize: 16,
        lineHeight: 24,
        color: "#fff",
        marginBottom: 10,
    },botonWrapper: {
    marginTop: 20,
  borderRadius: 40,
  overflow: "hidden",
  alignItems: "center", // Centra el botón horizontalmente
  },
    boton: {
        backgroundColor: "#63FB00",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 30,
        alignSelf: "flex-start",
    },
    botonTexto: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    carouselContainer: {
        height: 200,
    },
    carouselImage: {
        width: windowWidth,
        height: 200,
    },
    indicatorContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 8,
    },
    indicator: {
        height: 8,
        width: 8,
        borderRadius: 4,
        backgroundColor: "#ccc",
        margin: 4,
    },
    activeIndicator: {
        backgroundColor: "#63FB00",
    },
    infoContainer: {
        paddingHorizontal: 20,
        paddingVertical: 30,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 12,
        color: "#63FB00",
    },
    paragraph: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 12,
        lineHeight: 22,
    },
    // qrImage: {
    //   width: 120,
    //   height: 120,
    //   alignSelf: "center",
    //   marginTop: 20,
    // },
});
