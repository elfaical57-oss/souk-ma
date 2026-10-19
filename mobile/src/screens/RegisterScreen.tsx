import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { colors, fontSize, radius, spacing } from "../theme";
import useAuthStore from "../store/authStore";
import { RootStackParamList } from "../navigation/types";

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function RegisterScreen() {
  const navigation = useNavigation<Nav>();
  const register = useAuthStore((s) => s.register);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isSeller, setIsSeller] = useState(false);
  const [businessName, setBusinessName] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!name || !phone || !password || (isSeller && !businessName)) {
      Alert.alert("Erreur", "Remplissez tous les champs");
      return;
    }
    setLoading(true);
    try {
      await register({
        name,
        phone,
        password,
        role: isSeller ? "SELLER" : "BUYER",
        businessName: isSeller ? businessName : undefined,
        sellsWholesale: isSeller ? true : undefined,
      });
      navigation.goBack();
    } catch (e: any) {
      Alert.alert("Erreur", e?.response?.data?.message || "Inscription impossible");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>Créer un compte</Text>

          <Text style={styles.label}>Nom complet</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} placeholderTextColor={colors.textLight} />

          <Text style={styles.label}>Téléphone</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="0612345678"
            keyboardType="phone-pad"
            placeholderTextColor={colors.textLight}
          />

          <Text style={styles.label}>Mot de passe</Text>
          <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry placeholderTextColor={colors.textLight} />

          <Pressable style={styles.toggleRow} onPress={() => setIsSeller((v) => !v)}>
            <View style={[styles.checkbox, isSeller && styles.checkboxActive]} />
            <Text style={styles.toggleLabel}>Je veux vendre en gros (fournisseur)</Text>
          </Pressable>

          {isSeller ? (
            <>
              <Text style={styles.label}>Nom de l'entreprise</Text>
              <TextInput
                style={styles.input}
                value={businessName}
                onChangeText={setBusinessName}
                placeholderTextColor={colors.textLight}
              />
            </>
          ) : null}

          <Pressable style={styles.submitBtn} onPress={submit} disabled={loading}>
            {loading ? <ActivityIndicator color={colors.white} /> : <Text style={styles.submitText}>S'inscrire</Text>}
          </Pressable>

          <Pressable onPress={() => navigation.goBack()} style={styles.linkWrap}>
            <Text style={styles.linkText}>
              Déjà un compte ? <Text style={styles.linkBold}>Se connecter</Text>
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.card },
  content: { padding: spacing.xl },
  title: { fontSize: fontSize.xxl, fontWeight: "800", color: colors.text, marginBottom: spacing.xl },
  label: { fontSize: fontSize.sm, color: colors.text, marginBottom: spacing.xs, marginTop: spacing.md, fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    height: 48,
    fontSize: fontSize.md,
    color: colors.text,
  },
  toggleRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginTop: spacing.lg },
  checkbox: { width: 20, height: 20, borderRadius: 4, borderWidth: 1.5, borderColor: colors.border },
  checkboxActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  toggleLabel: { fontSize: fontSize.sm, color: colors.text },
  submitBtn: {
    marginTop: spacing.xl,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  submitText: { color: colors.white, fontWeight: "700", fontSize: fontSize.md },
  linkWrap: { marginTop: spacing.lg, alignItems: "center" },
  linkText: { color: colors.textMuted, fontSize: fontSize.sm },
  linkBold: { color: colors.primary, fontWeight: "700" },
});
