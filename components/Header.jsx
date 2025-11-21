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
  const { Keyword = "" } = useLocalSearchParams();

  const HandleSearch = useCallback(() => {
    if (searchText.trim().length >= 2 || searchText.trim().length === 0) {
      router.setParams({
        Keyword: searchText.trim(),
        pageNumber: "1",
      });
    }
  }, [searchText, router]);

  const clearSearch = () => {
    searchText("");
    router.setParams({
      Keyword: searchText.trim(),
      pageNumber: "1",
    });
  };

  const showAllProducts = () => {
    setSearchText("");
    router.setParams({
      Keyword: "",
      pageNumber: "1",
    });
  };

  return (
    <View style={styles.headerContainer}>
      <View Style={styles.topRow}>
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
            onChange={setSearchText}
            placeholderTextColor={Colors.lightGray}
            returnKeyLabel="search"
            onSubmitEditing={HandleSearch}
          />
        </View>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({});
