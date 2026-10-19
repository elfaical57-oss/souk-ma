import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { colors, fontSize, radius, spacing } from "../theme";
import { sellersApi } from "../api/endpoints";
import { Product } from "../types";
import { RootStackParamList } from "../navigation/types";
import useAuthStore from "../store/authStore";

type Nav = NativeStackNavigationProp<RootStackParamList>;

function formatPrice(price: number): string {
  return `${price.toLocaleString("fr-FR")} DH`;
}

export default function DashboardScreen() {
  const navigation = useNavigation<Nav>();
  const user = useAuthStore((s) => s.user);
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<{ productCount: number; totalRevenue: number; totalOrders: number } | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    if (!user || user.role !== "SELLER") {
      setLoading(false);
      return;
    }
    Promise.all([sellersApi.myProducts(), sellersApi.dashboardStats()])
      .then(([prodRes, statsRes]) => {
        setProducts(prodRes.data);
        setStats(statsRes.data);
      })
      .finally(() => setLoading(false));
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  if (!user) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.guestWrap}>
          <Ionicons name="storefront-outline" size={64} color={colors.textLight} />
          <Text style={styles.guestTitle}>Espace fournisseur</Text>
          <Text style={styles.guestSubtitle}>Connectez-vous pour gérer vos produits</Text>
          <Pressable style={styles.loginBtn} onPress={() => navigation.navigate("Login")}>
            <Text style={styles.loginBtnText}>Se connecter</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (user.role !== "SELLER") {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.guestWrap}>
          <Ionicons name="storefront-outline" size={64} color={colors.textLight} />
          <Text style={styles.guestTitle}>Devenir fournisseur</Text>
          <Text style={styles.guestSubtitle}>
            Votre compte actuel est un compte acheteur. Contactez le support pour activer la vente.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={products}
        keyExtractor={(p) => p.id}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
        contentContainerStyle={{ paddingBottom: spacing.xxl }}
        ListHeaderComponent={
          <View>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Mon espace fournisseur</Text>
            </View>
            {stats ? (
              <View style={styles.statsRow}>
                <StatCard label="Produits" value={String(stats.productCount)} />
                <StatCard label="Commandes" value={String(stats.totalOrders)} />
                <StatCard label="Revenus" value={formatPrice(stats.totalRevenue)} />
              </View>
            ) : null}
            <View style={styles.listHeaderRow}>
              <Text style={styles.sectionTitle}>Mes produits</Text>
              <Pressable
                style={styles.addBtn}
                onPress={() => navigation.navigate("AddEditProduct", undefined)}
              >
                <Ionicons name="add" size={18} color={colors.white} />
                <Text style={styles.addBtnText}>Ajouter</Text>
              </Pressable>
            </View>
          </View>
        }
        ListEmptyComponent={
          !loading ? <Text style={styles.emptyText}>Aucun produit pour le moment</Text> : undefined
        }
        renderItem={({ item }) => (
          <Pressable
            style={styles.productRow}
            onPress={() => navigation.navigate("AddEditProduct", { id: item.id })}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.productTitle} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.productMeta}>
                {formatPrice(item.price)} · Stock: {item.stock}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textLight} />
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  guestWrap: { flex: 1, alignItems: "center", justifyContent: "center", padding: spacing.xl },
  guestTitle: { fontSize: fontSize.lg, fontWeight: "700", color: colors.text, marginTop: spacing.md },
  guestSubtitle: { fontSize: fontSize.sm, color: colors.textMuted, textAlign: "center", marginTop: spacing.xs },
  loginBtn: {
    marginTop: spacing.xl,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
  },
  loginBtnText: { color: colors.white, fontWeight: "700" },
  header: { padding: spacing.lg },
  headerTitle: { fontSize: fontSize.xl, fontWeight: "800", color: colors.text },
  statsRow: { flexDirection: "row", gap: spacing.sm, paddingHorizontal: spacing.lg },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statValue: { fontSize: fontSize.md, fontWeight: "800", color: colors.primary },
  statLabel: { fontSize: fontSize.xs, color: colors.textMuted, marginTop: 2 },
  listHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  sectionTitle: { fontSize: fontSize.lg, fontWeight: "700", color: colors.text },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
  },
  addBtnText: { color: colors.white, fontWeight: "700", fontSize: fontSize.sm },
  productRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  productTitle: { fontSize: fontSize.md, color: colors.text, fontWeight: "600" },
  productMeta: { fontSize: fontSize.xs, color: colors.textMuted, marginTop: 2 },
  emptyText: { textAlign: "center", color: colors.textMuted, marginTop: spacing.xl },
});
