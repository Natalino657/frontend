import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Product from "../../components/Product";
const index = () => {
  const NaninaText = "inicial";
  return (
    <SafeAreaView style={styles.container}>
      <Text>{NaninaText}</Text>
    </SafeAreaView>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "flex-start",
  },
});
