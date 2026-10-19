import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { colors, fontSize, radius, spacing } from "../theme";
import { api } from "../api/client";
import { Product, SellerProfile } from "../types";
import ProductCard from "../components/ProductCard";
import { RootStackParamList } from "../navigation/types";
import { openWhatsApp } from "../utils/whatsapp";

type Nav = NativeStackNavigationProp<RootStackParamList>;
type SellerRoute = RouteProp<RootStackParamList, "SellerProfile">;

interface SellerData {
  id: string;
  name: string;
  city?: string;
  sellerProfile: SellerProfile;
  products: Product[];
}

export default function SellerProfileScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<SellerRoute>();
  const [data, setData] = useState<SellerData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/sellers/${route.params.id}`)
      .then(({ data }) => setData(data))
      .finally(() => setLoading(false));
  }, [route.params.id]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <ActivityIndicator style={{ marginTop: spacing.xxl }} color={colors.primary} />
      </SafeAreaView>
    );
  }

  if (!data) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={{ textAlign: "center", marginTop: spacing.xxl }}>Fournisseur introuvable</Text>
      </SafeAreaView>
    );
  }

  const profile = data.sellerProfile;

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={data.products}
        keyExtractor={(p) => p.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between", paddingHorizontal: spacing.lg }}
        contentContainerStyle={{ paddingBottom: spacing.xxl }}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => navigation.navigate("ProductDetail", { id: item.slug || item.id })}
          />
        )}
        ListHeaderComponent={
          <View>
            <View style={styles.topBar}>
              <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
                <Ionicons name="arrow-back" size={22} color={colors.text} />
              </Pressable>
            </View>
            <View style={styles.header}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{profile.businessName.charAt(0).toUpperCase()}</Text>
              </View>
              <Text style={styles.name}>{profile.businessName}</Text>
              {profile.verified ? (
                <View style={styles.verifiedBadge}>
                  <Ionicons name="checkmark-circle" size={14} color={colors.success} />
                  <Text style={styles.verifiedText}>Fournisseur vérifié</Text>
                </View>
              ) : null}
              <Text style={styles.city}>{profile.city}</Text>
              {profile.description ? (
                <Text style={styles.description}>{profile.description}</Text>
              ) : null}
              {profile.whatsapp ? (
                <Pressable
                  style={styles.contactBtn}
                  onPress={() =>
                    openWhatsApp(
                      profile.whatsapp!,
                      `Bonjour ${profile.businessName}, je vous contacte depuis JemlaMaroc.`
                    )
                  }
                >
                  <Ionicons name="logo-whatsapp" size={18} color={colors.white} />
                  <Text style={styles.contactBtnText}>Contacter</Text>
                </Pressable>
              ) : null}
            </View>
            <Text style={styles.sectionTitle}>Produits ({data.products.length})</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  topBar: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
  backBtn: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  header: { alignItems: "center", padding: spacing.xl, backgroundColor: colors.card },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: radius.full,
    backgroundColor: colors.dark,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: colors.white, fontSize: fontSize.xxl, fontWeight: "700" },
  name: { fontSize: fontSize.lg, fontWeight: "700", color: colors.text, marginTop: spacing.md },
  verifiedBadge: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: spacing.xs },
  verifiedText: { fontSize: fontSize.xs, color: colors.success, fontWeight: "600" },
  city: { fontSize: fontSize.sm, color: colors.textMuted, marginTop: spacing.xs },
  description: { fontSize: fontSize.sm, color: colors.textMuted, textAlign: "center", marginTop: spacing.md },
  contactBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.success,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    marginTop: spacing.lg,
  },
  contactBtnText: { color: colors.white, fontWeight: "700" },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: "700",
    color: colors.text,
    margin: spacing.lg,
  },
});
