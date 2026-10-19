import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { colors, fontSize, radius, spacing } from "../theme";
import { productsApi } from "../api/endpoints";
import { Product } from "../types";
import { RootStackParamList } from "../navigation/types";
import { openWhatsApp, orderMessage } from "../utils/whatsapp";

type Nav = NativeStackNavigationProp<RootStackParamList>;
type DetailRoute = RouteProp<RootStackParamList, "ProductDetail">;

const { width } = Dimensions.get("window");

function formatPrice(price: number): string {
  return `${price.toLocaleString("fr-FR")} DH`;
}

export default function ProductDetailScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<DetailRoute>();
  const [product, setProduct] = useState<Product | null>(null);
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productsApi
      .get(route.params.id)
      .then(({ data }) => {
        setProduct(data);
        setQty(data.minOrderQty || 1);
      })
      .finally(() => setLoading(false));
  }, [route.params.id]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <ActivityIndicator style={{ marginTop: spacing.xxl }} color={colors.primary} />
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={{ textAlign: "center", marginTop: spacing.xxl }}>Produit introuvable</Text>
      </SafeAreaView>
    );
  }

  const whatsapp = product.seller?.sellerProfile?.whatsapp;
  const sellerName = product.seller?.sellerProfile?.businessName || product.seller?.name;

  const handleOrder = () => {
    if (!whatsapp) return;
    openWhatsApp(whatsapp, orderMessage(product.title, qty, product.city || ""));
  };

  const carouselImages = product.images.length ? product.images : [undefined];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View>
          <FlatList
            data={carouselImages}
            keyExtractor={(_, i) => String(i)}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) =>
              setActiveImage(Math.round(e.nativeEvent.contentOffset.x / width))
            }
            renderItem={({ item: img }) => (
              <Image
                source={img ? { uri: img } : undefined}
                style={styles.heroImage}
                contentFit="cover"
              />
            )}
          />
          <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color={colors.white} />
          </Pressable>
          {product.images.length > 1 ? (
            <View style={styles.dots}>
              {product.images.map((_, i) => (
                <View
                  key={i}
                  style={[styles.dot, i === activeImage && styles.dotActive]}
                />
              ))}
            </View>
          ) : null}
        </View>

        <View style={styles.content}>
          <Text style={styles.price}>{formatPrice(product.price)}</Text>
          <Text style={styles.title}>{product.title}</Text>
          <View style={styles.metaRow}>
            {product.city ? (
              <View style={styles.metaChip}>
                <Ionicons name="location-outline" size={14} color={colors.textMuted} />
                <Text style={styles.metaText}>{product.city}</Text>
              </View>
            ) : null}
            <View style={styles.metaChip}>
              <Ionicons name="cube-outline" size={14} color={colors.textMuted} />
              <Text style={styles.metaText}>Stock: {product.stock}</Text>
            </View>
          </View>

          {product.minOrderQty > 1 ? (
            <View style={styles.moqBanner}>
              <Text style={styles.moqText}>
                Quantité minimum de commande : {product.minOrderQty}
              </Text>
            </View>
          ) : null}

          {product.bulkPrices && product.bulkPrices.length > 0 ? (
            <View style={styles.bulkBox}>
              <Text style={styles.sectionTitle}>Tarifs dégressifs</Text>
              {product.bulkPrices.map((bp, i) => (
                <View key={i} style={styles.bulkRow}>
                  <Text style={styles.bulkQty}>À partir de {bp.qty}</Text>
                  <Text style={styles.bulkPrice}>{formatPrice(bp.price)}</Text>
                </View>
              ))}
            </View>
          ) : null}

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{product.description}</Text>

          {sellerName ? (
            <Pressable
              style={styles.sellerCard}
              onPress={() =>
                navigation.navigate("SellerProfile", {
                  id: product.seller?.sellerProfile?.slug || product.sellerId,
                })
              }
            >
              <View style={styles.sellerAvatar}>
                <Text style={styles.sellerAvatarText}>{sellerName.charAt(0).toUpperCase()}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.sellerName}>{sellerName}</Text>
                <Text style={styles.sellerSub}>Voir le profil fournisseur</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            </Pressable>
          ) : null}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.stepper}>
          <Pressable
            style={styles.stepBtn}
            onPress={() => setQty((q) => Math.max(product.minOrderQty, q - 1))}
          >
            <Ionicons name="remove" size={18} color={colors.text} />
          </Pressable>
          <Text style={styles.stepValue}>{qty}</Text>
          <Pressable style={styles.stepBtn} onPress={() => setQty((q) => q + 1)}>
            <Ionicons name="add" size={18} color={colors.text} />
          </Pressable>
        </View>
        <Pressable style={styles.orderBtn} onPress={handleOrder} disabled={!whatsapp}>
          <Ionicons name="logo-whatsapp" size={20} color={colors.white} />
          <Text style={styles.orderBtnText}>Commander</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.card },
  scrollContent: { paddingBottom: spacing.xl },
  heroImage: { width, height: width, backgroundColor: colors.bg },
  backBtn: {
    position: "absolute",
    top: spacing.lg,
    left: spacing.lg,
    width: 38,
    height: 38,
    borderRadius: radius.full,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  dots: {
    position: "absolute",
    bottom: spacing.md,
    alignSelf: "center",
    flexDirection: "row",
    gap: 6,
  },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "rgba(255,255,255,0.5)" },
  dotActive: { backgroundColor: colors.white, width: 18 },
  content: { padding: spacing.lg },
  price: { fontSize: fontSize.xxl, fontWeight: "800", color: colors.primary },
  title: { fontSize: fontSize.lg, color: colors.text, marginTop: spacing.xs, fontWeight: "600" },
  metaRow: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.md },
  metaChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.bg,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radius.full,
  },
  metaText: { fontSize: fontSize.xs, color: colors.textMuted },
  moqBanner: {
    marginTop: spacing.lg,
    backgroundColor: colors.primaryLight,
    padding: spacing.sm,
    borderRadius: radius.md,
  },
  moqText: { color: colors.primaryDark, fontSize: fontSize.sm, fontWeight: "600" },
  bulkBox: { marginTop: spacing.lg },
  bulkRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  bulkQty: { color: colors.text, fontSize: fontSize.sm },
  bulkPrice: { color: colors.primary, fontWeight: "700", fontSize: fontSize.sm },
  sectionTitle: { fontSize: fontSize.md, fontWeight: "700", color: colors.text, marginTop: spacing.lg, marginBottom: spacing.xs },
  description: { fontSize: fontSize.sm, color: colors.textMuted, lineHeight: 20 },
  sellerCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginTop: spacing.xl,
    padding: spacing.md,
    backgroundColor: colors.bg,
    borderRadius: radius.md,
  },
  sellerAvatar: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    backgroundColor: colors.dark,
    alignItems: "center",
    justifyContent: "center",
  },
  sellerAvatarText: { color: colors.white, fontWeight: "700", fontSize: fontSize.md },
  sellerName: { fontSize: fontSize.md, fontWeight: "600", color: colors.text },
  sellerSub: { fontSize: fontSize.xs, color: colors.textMuted, marginTop: 2 },
  footer: {
    flexDirection: "row",
    gap: spacing.md,
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.card,
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
  },
  stepBtn: { width: 38, height: 44, alignItems: "center", justifyContent: "center" },
  stepValue: { width: 32, textAlign: "center", fontSize: fontSize.md, fontWeight: "600" },
  orderBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    backgroundColor: colors.success,
    borderRadius: radius.md,
  },
  orderBtnText: { color: colors.white, fontWeight: "700", fontSize: fontSize.md },
});
