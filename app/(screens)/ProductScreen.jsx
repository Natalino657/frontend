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
import React, { useState, useEffect, useCallback } from "react";
import Toast from "react-native-toast-message";
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from "@react-navigation/native";
import {
  useGetProductsDetailsQuery,
  useCreateReviewMutation,
} from "../../Slices/productsApiSlice";
import Message from "../../components/Message";
import { Colors } from "../../constants/Utils";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "../../Slices/CartSlice";
import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import ProductImageCard from "../../components/ProductImageCard";
import ProductDetailsCard from "../../components/ProductDetailsCard";
import ProductReviewSections from "../../components/ProductReviewSections";
import AddReviewModal from "../../components/AddReviewModal";
import { useRouter, useLocalSearchParams } from "expo-router";

const ProductScreen = () => {
  const router = useRouter();

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { productId } = useLocalSearchParams();

  const [qty, setQty] = useState(1);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const { userInfo } = useSelector((state) => state.auth);

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

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
    [navigation],
  );

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductsDetailsQuery(productId);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

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

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart({ ...product, qty }));
      router.push("(screens)/Cart");
    } else {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Product data not loaded yet. Cannot add to cart",
        position: "top",
        visibilityTime: 7000,
      });
    }
  };

  const submitReviewHandler = async () => {
    try {
      if (!rating || rating === 0) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Please select a rating before submit",
          position: "top",
          visibilityTime: 7000,
        });
        return;
      }

      if (!comment.trim()) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Please write a comment before submit",
          position: "top",
          visibilityTime: 7000,
        });
        return;
      }

      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();

      refetch();
      Toast.show({
        type: "success",
        text1: "success",
        text2: "Review create successfully",
        position: "top",
        visibilityTime: 7000,
      });

      setRating(0);
      setComment("");
      setIsReviewModalOpen(false);
    } catch (error) {
      const errorMessage = error?.data?.message || error.error;

      if (errorMessage.toLowerCase().includes("already reviewed")) {
        setIsReviewModalOpen(false);
      }

      Toast.show({
        type: "error",
        text1: "Error",
        text2: errorMessage,
        position: "top",
        visibilityTime: 7000,
      });
    }
  };

  //const disableAddToCart = product?.countInStock === 0;

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
        <ProductDetailsCard
          product={product}
          qty={qty}
          setQty={setQty}
          handleAddToCart={handleAddToCart}
          disableAddToCart={product?.countInStock === 0}
        />

        <ProductReviewSections
          reviews={product.reviews}
          userInfo={userInfo}
          onAddReviewPress={() => setIsReviewModalOpen(true)}
        />
      </ScrollView>

      <AddReviewModal
        isVisible={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        rating={rating}
        setRating={setRating}
        comment={comment}
        setComment={setComment}
        onSubmit={submitReviewHandler}
        isLoading={loadingProductReview}
      />
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
