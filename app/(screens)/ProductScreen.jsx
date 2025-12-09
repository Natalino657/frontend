import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect } from "react";
import Toast from "react-native-toast-message";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useGetProductsDetailsQuery } from "../../Slices/productsApiSlice";
import Message from "../../components/Message";
import { Colors } from "../../constants/Utils";
import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import ProductImageCard from "../../components/ProductImageCard";
import ProductDetailsCard from "../../components/ProductDetailsCard";

const ProductScreen = () => {
  const route = useRoute();

  const navigation = useNavigation();

  const { productId } = route.params;

  const { qty, setQty } = useState(1);

  useEffect(
    () => {
      if (!productId) {
        Toast.show({
          type: "error",
          text1: "Erro",
          text2:
            "Product Id not found, please try again or select a product from the list.",
          position: "top",
          visibilityTime: 7000,
        });

        navigation.goBack();
      }
    },
    [productId],
    [navigation]
  );

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductsDetailsQuery(productId);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (error) {
    const errorMessage = error?.data?.message || error.error;
    return (
      <View style={styles.center}>
        <Message variant="error">{errorMessage}</Message>
        <TouchableOpacity
          style={styles.errorBackButton}
          onPress={navigation.goBack()}
        >
          <Text style={styles.errorBackButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.center}>
        <Message variant="info">No product data available</Message>
        <TouchableOpacity
          style={styles.errorBackButton}
          onPress={navigation.goBack()}
        >
          <Text style={styles.errorBackButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back-circle" size={40} color={Colors.primary} />
        </TouchableOpacity>
        <ProductImageCard imageUrl={product.image} />
        <ProductDetailsCard product={product} qty={qty} setQty={setQty} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProductScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.offWhite,
    paddingTop: Platform.OS === "android" ? 25 : 0,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.offWhite,
    padding: 20,
  },

  errorBackButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 2,
  },
  errorBackButtonText: {
    color: Colors.white,
    fontWeight: "600",
    fontSize: 16,
  },
  container: {
    padding: 18,
    paddingBottom: 30,
  },
  backButton: {
    marginVertical: 10,
    alignSelf: "flex-start",
  },
});
