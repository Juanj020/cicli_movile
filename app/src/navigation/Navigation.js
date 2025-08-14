import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useContext, useEffect } from 'react';
import { StatusBar } from 'react-native';
import { AuthContext } from '../context/AuthContext.js';
import HomeScreen from '../screens/Home.js';
import LoginScreen from '../screens/Login.js';
import NewsScreen from '../screens/News.js';
import ProfileScreen from '../screens/Profile.js';
import RegisterScreen from '../screens/RegisterUser.js';
import StoreScreen from '../screens/Store.js';
import RutaDetailScreen from '../components/RutaDetail.js';
import RutasScreen from '../screens/Rutes.js';
import RecuperarScreen from '../screens/Recuperar.js';
import ResetPasswordScreen from '../screens/ResetPassword.js';
import SugerirRuta from '../screens/SugerirRuta.js';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

function RutesStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Rutas" component={RutasScreen} /> 
            <Stack.Screen name="RutaDetail" component={RutaDetailScreen} />
            <Stack.Screen name="SugerirRuta" component={SugerirRuta} />
        </Stack.Navigator>
    );
}

function TabNavigation() {
    return (
        <>
            <StatusBar barStyle="light-content" backgroundColor="#000" />
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => {
                        let iconName;

                        if (route.name === 'Home') iconName = 'home';
                        else if (route.name === 'RutesTab') iconName = 'map';
                        else if (route.name === 'News') iconName = 'newspaper';
                        else if (route.name === 'Store') iconName = 'cart';

                        return <Ionicons name={iconName} size={size} color={color} />;
                    },
                    tabBarActiveTintColor: '#63FB00',
                    tabBarInactiveTintColor: 'gray',
                    tabBarStyle: {
                        backgroundColor: '#000',
                        borderTopColor: '#111',
                    }
                })}
            >
                <Tab.Screen name="Home" component={HomeScreen} />
                <Tab.Screen name="RutesTab" component={RutesStack} />
                <Tab.Screen name="News" component={NewsScreen} />
                <Tab.Screen name="Store" component={StoreScreen} />
            </Tab.Navigator>
        </>
    );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="RegisterUser" component={RegisterScreen} />
      <Stack.Screen name="Recuperar" component={RecuperarScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
    </Stack.Navigator>
  );
}

function MainDrawer() {
  const { logout } = useContext(AuthContext);

  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#000' }, // barra negra arriba
        headerTintColor: '#fff', // texto blanco
        drawerStyle: {
          backgroundColor: '#333', // fondo gris del menú
        },
        drawerLabelStyle: {
          color: '#fff', // texto blanco en las opciones
        },
        drawerActiveTintColor: '#63FB00', // color del texto/icono activo
        drawerInactiveTintColor: '#ccc', // color del texto/icono inactivo
      }}
    >
      <Drawer.Screen name="Inicio" component={TabNavigation} />
      <Drawer.Screen name="Perfil" component={ProfileScreen} />
      <Drawer.Screen name="Cerrar sesión">
        {() => {
          logout();
          return null;
        }}
      </Drawer.Screen>
    </Drawer.Navigator>
  );
}

export default function Navigation() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null; // <- o mostrar una pantalla de carga

  return (
    <NavigationContainer>
      {/* <MainDrawer /> */}
      {user ? <MainDrawer /> : <AuthStack />}
    </NavigationContainer>
  );
}