import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { colors, fontSize, radius, shadow, spacing } from "../theme";
import { Product } from "../types";

function formatPrice(price: number): string {
  return `${price.toLocaleString("fr-FR")} DH`;
}

export default function ProductCard({
  product,
  onPress,
}: {
  product: Product;
  onPress: () => void;
}) {
  const image = product.images?.[0];

  return (
    <Pressable
      style={({ pressed }) => [styles.wrapper, pressed && styles.wrapperPressed]}
      onPress={onPress}
    >
      <View style={styles.card}>
        <View style={styles.imageWrap}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} contentFit="cover" />
          ) : (
            <View style={[styles.image, styles.imagePlaceholder]}>
              <Ionicons name="image-outline" size={28} color={colors.textLight} />
            </View>
          )}
          {product.minOrderQty > 1 ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Min {product.minOrderQty}</Text>
            </View>
          ) : null}
        </View>
        <View style={styles.info}>
          <Text style={styles.price}>{formatPrice(product.price)}</Text>
          <Text style={styles.title} numberOfLines={2}>
            {product.title}
          </Text>
          {product.city ? (
            <View style={styles.cityRow}>
              <Ionicons name="location-outline" size={11} color={colors.textLight} />
              <Text style={styles.city}>{product.city}</Text>
            </View>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "48%",
    marginBottom: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.card,
    ...shadow.card,
  },
  wrapperPressed: { opacity: 0.85 },
  card: {
    borderRadius: radius.lg,
    overflow: "hidden",
    backgroundColor: colors.card,
  },
  imageWrap: { position: "relative" },
  image: { width: "100%", aspectRatio: 1, backgroundColor: colors.bg },
  imagePlaceholder: { alignItems: "center", justifyContent: "center" },
  badge: {
    position: "absolute",
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: "rgba(15, 40, 73, 0.88)",
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  badgeText: { color: colors.white, fontSize: fontSize.xs, fontWeight: "700" },
  info: { padding: spacing.sm, paddingTop: spacing.sm },
  price: { fontSize: fontSize.lg, fontWeight: "800", color: colors.primary, marginBottom: 2 },
  title: {
    fontSize: fontSize.sm,
    color: colors.text,
    marginBottom: 4,
    minHeight: 34,
    lineHeight: 17,
  },
  cityRow: { flexDirection: "row", alignItems: "center", gap: 3 },
  city: { fontSize: fontSize.xs, color: colors.textLight },
});
