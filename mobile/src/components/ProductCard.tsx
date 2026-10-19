import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { colors, fontSize, radius, spacing } from "../theme";
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
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.imageWrap}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} contentFit="cover" />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]} />
        )}
        {product.minOrderQty > 1 ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Min {product.minOrderQty}</Text>
          </View>
        ) : null}
      </View>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {product.title}
        </Text>
        <Text style={styles.price}>{formatPrice(product.price)}</Text>
        {product.city ? <Text style={styles.city}>{product.city}</Text> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    backgroundColor: colors.card,
    borderRadius: radius.md,
    marginBottom: spacing.md,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
  },
  imageWrap: { position: "relative" },
  image: { width: "100%", aspectRatio: 1, backgroundColor: colors.bg },
  imagePlaceholder: { alignItems: "center", justifyContent: "center" },
  badge: {
    position: "absolute",
    top: spacing.xs,
    left: spacing.xs,
    backgroundColor: colors.dark,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  badgeText: { color: colors.white, fontSize: fontSize.xs, fontWeight: "600" },
  info: { padding: spacing.sm },
  title: { fontSize: fontSize.sm, color: colors.text, marginBottom: 4, minHeight: 34 },
  price: { fontSize: fontSize.md, fontWeight: "700", color: colors.primary },
  city: { fontSize: fontSize.xs, color: colors.textMuted, marginTop: 2 },
});
