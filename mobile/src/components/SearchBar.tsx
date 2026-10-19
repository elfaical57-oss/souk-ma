import React from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fontSize, radius, spacing } from "../theme";

export default function SearchBar({
  value,
  onChangeText,
  onSubmit,
  editable = true,
  onPress,
  placeholder = "Rechercher un produit, une catégorie...",
}: {
  value: string;
  onChangeText?: (v: string) => void;
  onSubmit?: () => void;
  editable?: boolean;
  onPress?: () => void;
  placeholder?: string;
}) {
  const content = (
    <View style={styles.wrap}>
      <Ionicons name="search" size={18} color={colors.textMuted} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        editable={editable}
        placeholder={placeholder}
        placeholderTextColor={colors.textLight}
        returnKeyType="search"
      />
    </View>
  );

  if (!editable && onPress) {
    return <Pressable onPress={onPress}>{content}</Pressable>;
  }
  return content;
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.bg,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    height: 44,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  input: { flex: 1, fontSize: fontSize.md, color: colors.text },
});
