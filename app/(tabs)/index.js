import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Plata,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Product from "../../components/Product";

const Home = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text>{NaninaText}</Text>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "flex-start",
  },
});
