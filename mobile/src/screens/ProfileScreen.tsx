import React from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { colors, fontSize, radius, spacing } from "../theme";
import useAuthStore from "../store/authStore";
import { RootStackParamList } from "../navigation/types";

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function ProfileScreen() {
  const navigation = useNavigation<Nav>();
  const { user, logout } = useAuthStore();

  if (!user) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.guestWrap}>
          <Ionicons name="person-circle-outline" size={72} color={colors.textLight} />
          <Text style={styles.guestTitle}>Connectez-vous</Text>
          <Text style={styles.guestSubtitle}>
            Accédez à votre compte pour commander et gérer vos produits
          </Text>
          <Pressable style={styles.loginBtn} onPress={() => navigation.navigate("Login")}>
            <Text style={styles.loginBtnText}>Se connecter</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const confirmLogout = () => {
    Alert.alert("Déconnexion", "Voulez-vous vraiment vous déconnecter ?", [
      { text: "Annuler", style: "cancel" },
      { text: "Déconnexion", style: "destructive", onPress: () => logout() },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user.name.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.phone}>{user.phone}</Text>
      </View>

      <View style={styles.menu}>
        {user.role === "SELLER" ? (
          <MenuItem
            icon="storefront-outline"
            label="Mon espace fournisseur"
            onPress={() => navigation.navigate("SellerDashboard")}
          />
        ) : null}
        <MenuItem icon="location-outline" label={user.city || "Ville non renseignée"} onPress={() => {}} />
        <MenuItem icon="log-out-outline" label="Déconnexion" onPress={confirmLogout} danger />
      </View>
    </SafeAreaView>
  );
}

function MenuItem({
  icon,
  label,
  onPress,
  danger,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
  onPress: () => void;
  danger?: boolean;
}) {
  return (
    <Pressable style={styles.menuItem} onPress={onPress}>
      <Ionicons name={icon} size={20} color={danger ? colors.primary : colors.text} />
      <Text style={[styles.menuLabel, danger && { color: colors.primary }]}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color={colors.textLight} />
    </Pressable>
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
  header: { alignItems: "center", paddingVertical: spacing.xl, backgroundColor: colors.card },
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
  phone: { fontSize: fontSize.sm, color: colors.textMuted, marginTop: 2 },
  menu: { marginTop: spacing.lg, backgroundColor: colors.card },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuLabel: { flex: 1, fontSize: fontSize.md, color: colors.text },
});
