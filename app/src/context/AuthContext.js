import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
const jwt_decode = require('jwt-decode'); // Importación con require

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      // CORRECCIÓN FINAL: Accede a la función jwtDecode dentro del objeto importado
      const decoded = jwt_decode.jwtDecode(token); 
      const isExpired = decoded.exp < Date.now() / 1000;
      if (isExpired) {
        await AsyncStorage.clear();
        setUser(null);
      } else {
        setUser({ ...decoded, token });
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (token) => {
    try {
      await AsyncStorage.setItem('token', token);
      
      // CORRECCIÓN FINAL: Accede a la función jwtDecode dentro del objeto importado
      const decoded = jwt_decode.jwtDecode(token); 
      console.log("Pasa 213", decoded);
      
      const nombre = await AsyncStorage.getItem('userNombre');
      setUser({ ...decoded, nombre, token });
    } catch (err) {
      console.error("Error en login():", err);
    }
  };

  const logout = async () => {
    await AsyncStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, checkAuth, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;