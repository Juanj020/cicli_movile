import 'react-native-url-polyfill/auto';
import { AppRegistry } from 'react-native';
import AuthProvider from './src/context/AuthContext.js';
import Navigation from "./src/navigation/Navigation.js";

function App() {
  return (
    <AuthProvider>
      <Navigation />
    </AuthProvider>
  );
}

AppRegistry.registerComponent('main', () => App);