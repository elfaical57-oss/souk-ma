import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { colors, fontSize, radius, shadow, spacing } from "../theme";
import { sellersApi } from "../api/endpoints";
import { SellerListItem } from "../types";
import { RootStackParamList } from "../navigation/types";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function SellersListScreen() {
  const navigation = useNavigation<Nav>();
  const [sellers, setSellers] = useState<SellerListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    try {
      const { data } = await sellersApi.list();
      setSellers(data);
      setError(false);
    } catch {
      setError(true);
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

  if (loading) {
    return (
      <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
        <ActivityIndicator style={{ marginTop: spacing.xxl }} color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <FlatList
        data={sellers}
        keyExtractor={(s) => s.id}
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListHeaderComponent={<Text style={styles.header}>Fournisseurs</Text>}
        ListEmptyComponent={
          error ? (
            <ErrorState onRetry={load} />
          ) : (
            <EmptyState icon="storefront-outline" message="Aucun fournisseur pour le moment" />
          )
        }
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() =>
              navigation.navigate("SellerProfile", { id: item.slug || item.userId })
            }
          >
            {item.logo ? (
              <Image
                source={{ uri: item.logo }}
                style={styles.logo}
                contentFit="cover"
                transition={200}
              />
            ) : (
              <View style={styles.logoFallback}>
                <Text style={styles.logoFallbackText}>
                  {item.businessName.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
            <View style={{ flex: 1 }}>
              <View style={styles.nameRow}>
                <Text style={styles.name} numberOfLines={1}>
                  {item.businessName}
                </Text>
                {item.verified ? (
                  <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                ) : null}
              </View>
              <View style={styles.metaRow}>
                <Ionicons name="location-outline" size={12} color={colors.textLight} />
                <Text style={styles.metaText}>{item.city}</Text>
                <Text style={styles.metaDot}>·</Text>
                <Ionicons name="cube-outline" size={12} color={colors.textLight} />
                <Text style={styles.metaText}>{item._count.products} produits</Text>
              </View>
              {item.sellsWholesale ? (
                <View style={styles.wholesaleBadge}>
                  <Text style={styles.wholesaleBadgeText}>Vente en gros</Text>
                </View>
              ) : null}
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: { fontSize: fontSize.xxl, fontWeight: "800", color: colors.text, marginBottom: spacing.lg },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadow.card,
  },
  logo: { width: 52, height: 52, borderRadius: radius.full, backgroundColor: colors.bg },
  logoFallback: {
    width: 52,
    height: 52,
    borderRadius: radius.full,
    backgroundColor: colors.dark,
    alignItems: "center",
    justifyContent: "center",
  },
  logoFallbackText: { color: colors.white, fontWeight: "700", fontSize: fontSize.lg },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  name: { fontSize: fontSize.md, fontWeight: "700", color: colors.text, flexShrink: 1 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 },
  metaText: { fontSize: fontSize.xs, color: colors.textLight },
  metaDot: { color: colors.textLight, marginHorizontal: 2 },
  wholesaleBadge: {
    alignSelf: "flex-start",
    backgroundColor: colors.primaryLight,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    marginTop: spacing.xs,
  },
  wholesaleBadgeText: { fontSize: fontSize.xs, color: colors.primaryDark, fontWeight: "600" },
});
