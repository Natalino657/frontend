import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useState, useCallback } from "react";

import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "../constants/Utils";
import { useRouter, useLocalSearchParams, useNavigation } from "expo-router";
import { useSelector } from "react-redux";

const Header = () => {
  const [searchText, setSearchText] = useState("");

  const navigation = useNavigation();
  const router = useRouter();
  const { keyword = "" } = useLocalSearchParams();

  const HandleSearch = useCallback(() => {
    if (searchText.trim().length >= 2 || searchText.trim().length === 0) {
      router.setParams({
        keyword: searchText.trim(),
        pageNumber: "1",
      });
    }
  }, [searchText, router]);

  const clearSearch = () => {
    setSearchText("");
    router.setParams({
      keyword: searchText.trim(),
      pageNumber: "1",
    });
  };

  const showAllProducts = () => {
    setSearchText("");
    router.setParams({
      keyword: "",
      pageNumber: "1",
    });
  };

  return (
    <View style={styles.headerContainer}>
      <View style={styles.topRow}>
        <Image
          source={require("../assets/images/logo.png")}
          style={styles.logo}
        />
        <TouchableOpacity onPress={() => {}} style={styles.cartIconContainer}>
          <Ionicons name="cart" size={35} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchRow}>
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color={Colors.primary}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="search Products..."
            value={searchText}
            onChangeText={setSearchText}
            placeholderTextColor={Colors.lightGray}
            returnKeyLabel="search"
            onSubmitEditing={HandleSearch}
          />
          {searchText ? (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color={Colors.primary} />
            </TouchableOpacity>
          ) : null}
        </View>
        {searchText.length > 0 && (
          <TouchableOpacity style={styles.searchButton} onPress={HandleSearch}>
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        )}
      </View>
      {keyword && (
        <View style={styles.activeFilterRow}>
          <Text style={styles.filterText}>
            Showing result for : "{keyword}"
          </Text>
          <TouchableOpacity
            style={styles.showAllButton}
            onPress={showAllProducts}
          >
            <Text style={styles.showAllButtonText}>show All Products</Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.bottomRow}>
        <Text style={styles.welcomeText}>Welcome!!</Text>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "column",
    paddingHorizontal: 15,
    paddingvertical: 10,
    backgroundColor: Colors.offWhite,
    paddingBottom: 10,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  searchRow: {
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  logo: {
    width: 100,
    height: 60,
    resizeMode: "contain",
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 20,
    paddingHorizontal: 10,
    height: 40,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  searchButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    justifycontent: "center",
  },
  searchButtonText: {
    color: Colors.white,
    fontWeight: "600",
    fontsize: 14,
  },

  searchIcon: {
    marginRight: 5,
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.black,
    height: "100%",
  },

  clearButton: {
    padding: 5,
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },

  cartIconContainer: {
    //position: "relative",
  },

  cartBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: Colors.textRed,
    borderRadius: 20,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  cartBadgeText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: "bold",
  },
  welcomeText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.primary,
  },

  activeFilterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    paddingHorizontal: 5,
  },

  filterText: {
    color: Colors.primary,
    fontSize: 14,
    fontStyle: "italic",
  },

  showAllButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },

  showallButtonText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: "600",
  },
});
