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
import TiendasScreen from '../screens/Store.js';
import RutaDetailScreen from '../components/RutaDetail.js';
import RutasScreen from '../screens/Rutes.js';
import RecuperarScreen from '../screens/Recuperar.js';
import ResetPasswordScreen from '../screens/ResetPassword.js';
import SugerirRuta from '../screens/SugerirRuta.js';
import RutasAdminScreen from '../screens/RutasAdmin.js';
import RutaEditScreen from '../screens/RutaEdit.js';
import NewsAdminScreen from '../screens/NewsAdmin.js';
import NewsForm from '../screens/NoticiasForm.js';
import NewsDetailScreen from '../screens/NewsDetail.js';
import NoticiaEditScreen from '../screens/NoticiaEdit.js';
import TiendaDetailScreen from '../screens/TiendaDetail.js';
import SugerirTiendaScreen from '../screens/SugerirTienda.js'; // 🆕 Importa la nueva vista
import TiendasAdminScreen from '../screens/TiendasAdmin.js';
import TiendaEditScreen from '../screens/TiendaEdit.js';
import SugerirTiendaIA from '../screens/SugerirTiendaIA.js';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

function RutesStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Rutas" component={RutasScreen} /> 
            <Stack.Screen name="RutaDetail" component={RutaDetailScreen} />
            <Stack.Screen name="SugerirRuta" component={SugerirRuta} />
            <Stack.Screen name="RutasAdmin" component={RutasAdminScreen} />
            <Stack.Screen name="RutaEdit" component={RutaEditScreen} />
        </Stack.Navigator>
    );
}

// 🆕 Crea una Stack para las noticias
function NewsStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="News" component={NewsScreen} />
            <Stack.Screen name="NewsAdmin" component={NewsAdminScreen} />
            <Stack.Screen name="NewsForm" component={NewsForm} />
            <Stack.Screen name="NewsDetail" component={NewsDetailScreen} />
            <Stack.Screen name="NoticiaEdit" component={NoticiaEditScreen} />
        </Stack.Navigator>
    );
}

function StoreStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Tiendas" component={TiendasScreen} />
            <Stack.Screen name="TiendaDetail" component={TiendaDetailScreen} />
            <Stack.Screen name="SugerirTienda" component={SugerirTiendaScreen} />
            <Stack.Screen name="TiendasAdmin" component={TiendasAdminScreen} />
            <Stack.Screen name="TiendaEdit" component={TiendaEditScreen} />
            <Stack.Screen name="SugerirTiendaIA" component={SugerirTiendaIA} />
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
                        else if (route.name === 'Rutes') iconName = 'map';
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
                <Tab.Screen name="Rutes" component={RutesStack} />
                {/* ✅ Paso 2: Usa el NewsStack en lugar de la pantalla News */}
                <Tab.Screen name="News" component={NewsStack} />
                <Tab.Screen name="Store" component={StoreStack} />
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
        headerStyle: { backgroundColor: '#000' },
        headerTintColor: '#fff',
        drawerStyle: {
          backgroundColor: '#333',
        },
        drawerLabelStyle: {
          color: '#fff',
        },
        drawerActiveTintColor: '#63FB00',
        drawerInactiveTintColor: '#ccc',
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

  if (loading) return null;

  return (
    <NavigationContainer>
      {user ? <MainDrawer /> : <AuthStack />}
    </NavigationContainer>
  );
}