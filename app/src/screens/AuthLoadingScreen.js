import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const jwt_decode = require('jwt-decode'); // Importación con require

const AuthLoadingScreen = ({ navigation }) => {
  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem('token');

      if (token) {
        // CORRECCIÓN FINAL: Accede a la función jwtDecode dentro del objeto importado
        const decoded = jwt_decode.jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
          // Token vencido
          await AsyncStorage.clear();
          navigation.replace('Login');
        } else {
          navigation.replace('Home');
        }
      } else {
        navigation.replace('Login');
      }
    };
    checkLogin();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#63FB00" />
    </View>
  );
};

export function LogoutScreen({ navigation }) {
  useEffect(() => {
    Alert.alert(
      "Cerrar sesión",
      "¿Estás seguro que quieres salir?",
      [
        {
          text: "Cancelar",
          onPress: () => navigation.goBack(), 
          style: "cancel"
        },
        {
          text: "Sí, salir",
          onPress: async () => {
            await AsyncStorage.clear();
            navigation.replace('Login');
          }
        }
      ]
    );
  }, []);

  return null;
}

export default AuthLoadingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
});