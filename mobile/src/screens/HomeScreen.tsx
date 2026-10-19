import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { colors, fontSize, radius, spacing } from "../theme";
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
              contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: spacing.sm }}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.categoryChip}
                  onPress={() => navigation.navigate("Search", { category: item.slug })}
                >
                  <Text style={styles.categoryIcon}>{item.icon}</Text>
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
    paddingBottom: spacing.sm,
  },
  logo: { fontSize: fontSize.xl, fontWeight: "800", color: colors.primary },
  searchWrap: { paddingHorizontal: spacing.lg, marginBottom: spacing.lg },
  categoryChip: {
    alignItems: "center",
    justifyContent: "center",
    width: 76,
    paddingVertical: spacing.sm,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryIcon: { fontSize: 24, marginBottom: 4 },
  categoryLabel: { fontSize: fontSize.xs, color: colors.text, textAlign: "center" },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: "700",
    color: colors.text,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.lg,
  },
});
