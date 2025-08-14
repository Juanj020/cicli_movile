import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { DrawerActions } from '@react-navigation/native';

export default function CustomHeaderLeft() {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={{ marginLeft: 15 }}
      onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
    >
      <Ionicons name="menu" size={28} color="black" />
    </TouchableOpacity>
  );
}