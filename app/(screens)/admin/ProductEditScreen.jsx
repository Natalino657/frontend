import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Image,
  Platform,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import Toast from "react-native-toast-message";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  useGetProductsDetailsQuery,
  useUpdateProductMutation,
  useUploadProductImageMutation,
} from "../../../Slices/productsApiSlice";
import * as ImagePicker from "expo-image-picker";
import { Colors } from "../../../constants/Utils";
import { BASE_URL } from "../../../constants/Urls";
import FormContainer from "../../../components/FormContainer";
import Message from "../../../components/Message";

const ProductEditScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const productId = params.id;

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState("");

  const {
    data: product,
    isLoading,
    refetch,
    error: productError,
  } = useGetProductsDetailsQuery(productId);

  const [updateProduct, { isLoading: loadingUpdate }] =
    useUpdateProductMutation();

  const [uploadProductImage, { isLoading: loadingUpload }] =
    useUploadProductImageMutation();

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price.toString());
      setImage(product.image);
      setCountInStock(product.countInStock.toString());
      setCategory(product.category);
      setDescription(product.description);
    }
  }, [product]);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    return imagePath.startsWith("http") ? imagePath : `${BASE_URL}${imagePath}`;
  };

  // testar imagePath

  const submitHandler = async () => {
    try {
      await updateProduct({
        productId,
        name,
        price: Number(price),
        image,
        category,
        description,
        countInStock: Number(countInStock),
      }).unwrap();

      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Product update successFully",
      });
      refetch();
      setTimeout(() => router.back(), 300);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error?.data?.message || error.error,
      });
      refetch();
      setTimeout(() => router.back(), 300);
    }
  };

  const uploadFileHandler = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Toast.show({
          type: "error",
          text1: "permission denied",
          text2: "Camara roll access is required",
        });
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled) {
        const formData = new FormData();
        formData.append("image", {
          uri: result.assets[0].uri,
          type: "image/jpeg",
          name: "image.jpg",
        });
        const response = await uploadProductImage(formData).unwrap();
        setImage(response.image);
        Toast.show({
          type: "success",
          text1: "uploaded",
          text2: "Image Uploaded successfuly",
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "uploaded feiled",
        text2: error?.data?.message || error.error || error?.message,
      });
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (productError) {
    return (
      <View style={styles.centered}>
        <Message variant="error">
          {productError?.data?.message || productError.error}
        </Message>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled"
        >
          <FormContainer>
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
              >
                <Ionicons
                  name="chevron-back-circle"
                  size={35}
                  color={Colors.primary}
                />
              </TouchableOpacity>
              <Text style={styles.title}>Edit Product</Text>
            </View>

            <View style={styles.form}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter name"
                  placeholderTextColor={Colors.secondaryTextColor}
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Price</Text>
                <TextInput
                  style={styles.input}
                  value={price}
                  onChangeText={setPrice}
                  placeholder="Enter Price"
                  placeholderTextColor={Colors.secondaryTextColor}
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Image</Text>

                {image && (
                  <View style={styles.imageContainer}>
                    <Image
                      source={{ uri: getImageUrl(image) }}
                      style={styles.productImage}
                    />
                    <Text style={styles.imageUrl}>{getImageUrl(image)}</Text>
                  </View>
                )}

                <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={uploadFileHandler}
                >
                  <Text style={styles.uploadButtonText}>
                    {loadingUpload ? (
                      <ActivityIndicator size="small" color={Colors.white} />
                    ) : (
                      "Upload Image"
                    )}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Count in stock</Text>
                <TextInput
                  style={styles.input}
                  value={countInStock}
                  onChangeText={setCountInStock}
                  placeholder="Enter count in stock"
                  keyboardType="numeric"
                  placeholderTextColor={Colors.secondaryTextColor}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Category</Text>
                <TextInput
                  style={styles.input}
                  value={category}
                  onChangeText={setCategory}
                  placeholder="Enter category"
                  placeholderTextColor={Colors.secondaryTextColor}
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Descripion</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Enter descripion"
                  multiline
                  numberOfLines={4}
                  placeholderTextColor={Colors.secondaryTextColor}
                />
              </View>

              <TouchableOpacity
                style={[
                  styles.submitButton,
                  loadingUpdate && styles.submitButtonDisabled,
                ]}
                onPress={submitHandler}
                disabled={loadingUpdate}
              >
                {loadingUpdate ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color={Colors.white} />
                    <Text style={styles.submitButtonText}>Update...</Text>
                  </View>
                ) : (
                  <Text style={styles.submitButtonText}>Update Product</Text>
                )}
              </TouchableOpacity>
            </View>
          </FormContainer>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ProductEditScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.offWhite,
    paddingTop: Platform.OS === "android" ? 20 : 0,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
    paddingHorizontal: 5,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.offWhite,
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginLeft: 15,
    color: Colors.primary,
  },
  form: {
    backgroundColor: Colors.white,
    borderRadius: 15,
    padding: 20,
    shadowColor: Colors.darkGray,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    gap: 15,
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: Colors.textColor,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    backgroundColor: Colors.white,
    color: Colors.textColor,
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  imageContainer: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  imageUrl: {
    fontSize: 12,
    color: Colors.secondaryTextColor,
    textAlign: "center",
  },
  uploadButton: {
    backgroundColor: Colors.secondary,
    paddingVertical: 15,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  uploadButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  submitButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  errorText: {
    color: Colors.textRed,
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
  },
  productImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: Colors.offWhite,
    resizeMode: "contain",
  },
});
