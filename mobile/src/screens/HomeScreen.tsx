import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { colors, fontSize, radius, shadow, spacing } from "../theme";
import { categoriesApi, productsApi } from "../api/endpoints";
import { Category, Product } from "../types";
import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";
import { RootStackParamList } from "../navigation/types";
import { Pressable } from "react-native";

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const [catRes, prodRes] = await Promise.all([
        categoriesApi.list(),
        productsApi.list({ limit: 20 }),
      ]);
      setCategories(catRes.data);
      setProducts(prodRes.data.products);
    } catch (e) {
      // keep whatever was loaded before
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = () => {
    setRefreshing(true);
    load();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={products}
        keyExtractor={(p) => p.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between", paddingHorizontal: spacing.lg }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => navigation.navigate("ProductDetail", { id: item.slug || item.id })}
          />
        )}
        ListHeaderComponent={
          <View>
            <View style={styles.header}>
              <Text style={styles.logo}>JemlaMaroc</Text>
            </View>
            <View style={styles.searchWrap}>
              <SearchBar
                value=""
                editable={false}
                onPress={() => navigation.navigate("Search", {})}
              />
            </View>

            <FlatList
              data={categories}
              keyExtractor={(c) => c.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: spacing.lg,
                paddingTop: spacing.lg,
                gap: spacing.md,
              }}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.categoryChip}
                  onPress={() => navigation.navigate("Search", { category: item.slug })}
                >
                  <View style={styles.categoryIconCircle}>
                    <Text style={styles.categoryIcon}>{item.icon}</Text>
                  </View>
                  <Text style={styles.categoryLabel} numberOfLines={1}>
                    {item.nameFr}
                  </Text>
                </Pressable>
              )}
            />

            <Text style={styles.sectionTitle}>Nouveautés</Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: spacing.xxl }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    backgroundColor: colors.card,
  },
  logo: { fontSize: fontSize.xl, fontWeight: "800", color: colors.primary, letterSpacing: -0.3 },
  searchWrap: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    backgroundColor: colors.card,
    ...shadow.card,
  },
  categoryChip: {
    alignItems: "center",
    justifyContent: "flex-start",
    width: 68,
  },
  categoryIconCircle: {
    width: 56,
    height: 56,
    borderRadius: radius.full,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  categoryIcon: { fontSize: 24 },
  categoryLabel: { fontSize: fontSize.xs, color: colors.text, textAlign: "center" },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: "800",
    color: colors.text,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.lg,
  },
});
