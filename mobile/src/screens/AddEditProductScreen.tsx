import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { colors, fontSize, radius, spacing } from "../theme";
import { api } from "../api/client";
import { categoriesApi, productsApi } from "../api/endpoints";
import { Category } from "../types";
import { RootStackParamList } from "../navigation/types";
import useAuthStore from "../store/authStore";

type Nav = NativeStackNavigationProp<RootStackParamList>;
type EditRoute = RouteProp<RootStackParamList, "AddEditProduct">;

export default function AddEditProductScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<EditRoute>();
  const editingId = route.params?.id;
  const user = useAuthStore((s) => s.user);

  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [minOrderQty, setMinOrderQty] = useState("1");
  const [categoryId, setCategoryId] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!!editingId);

  useEffect(() => {
    categoriesApi.list().then(({ data }) => {
      setCategories(data);
      if (!editingId && data.length) setCategoryId(data[0].id);
    });
  }, [editingId]);

  useEffect(() => {
    if (!editingId) return;
    productsApi.get(editingId).then(({ data }) => {
      setTitle(data.title);
      setDescription(data.description);
      setPrice(String(data.price));
      setStock(String(data.stock));
      setMinOrderQty(String(data.minOrderQty));
      setCategoryId(data.categoryId);
      setImages(data.images);
      setLoading(false);
    });
  }, [editingId]);

  const pickImage = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("Permission requise", "Autorisez l'accès à vos photos");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.5,
      base64: true,
    });
    if (result.canceled || !result.assets?.[0]?.base64) return;

    setUploading(true);
    try {
      const { data } = await api.post("/upload", {
        data: `data:image/jpeg;base64,${result.assets[0].base64}`,
      });
      setImages((prev) => [...prev, data.url]);
    } catch {
      Alert.alert("Erreur", "Échec de l'envoi de l'image");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (url: string) => {
    setImages((prev) => prev.filter((i) => i !== url));
  };

  const submit = async () => {
    if (!title || !description || !price || !categoryId || images.length === 0) {
      Alert.alert("Erreur", "Remplissez tous les champs et ajoutez au moins une image");
      return;
    }
    setSaving(true);
    const payload = {
      title,
      description,
      price: parseFloat(price),
      stock: parseInt(stock, 10) || 0,
      minOrderQty: parseInt(minOrderQty, 10) || 1,
      categoryId,
      images,
      city: user?.city,
    };
    try {
      if (editingId) {
        await productsApi.update(editingId, payload);
      } else {
        await productsApi.create(payload);
      }
      navigation.goBack();
    } catch (e: any) {
      Alert.alert("Erreur", e?.response?.data?.message || "Échec de l'enregistrement");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = () => {
    if (!editingId) return;
    Alert.alert("Supprimer", "Voulez-vous vraiment supprimer ce produit ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: async () => {
          await productsApi.remove(editingId);
          navigation.goBack();
        },
      },
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <ActivityIndicator style={{ marginTop: spacing.xxl }} color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topBar}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </Pressable>
        <Text style={styles.topBarTitle}>{editingId ? "Modifier le produit" : "Nouveau produit"}</Text>
        {editingId ? (
          <Pressable onPress={confirmDelete} style={styles.deleteBtn}>
            <Ionicons name="trash-outline" size={20} color={colors.primary} />
          </Pressable>
        ) : (
          <View style={{ width: 36 }} />
        )}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.label}>Photos</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.imageRow}>
            {images.map((url) => (
              <View key={url} style={styles.imageThumbWrap}>
                <Image source={{ uri: url }} style={styles.imageThumb} />
                <Pressable style={styles.removeBtn} onPress={() => removeImage(url)}>
                  <Ionicons name="close" size={14} color={colors.white} />
                </Pressable>
              </View>
            ))}
            <Pressable style={styles.addImageBtn} onPress={pickImage} disabled={uploading}>
              {uploading ? (
                <ActivityIndicator color={colors.primary} />
              ) : (
                <Ionicons name="camera-outline" size={24} color={colors.textMuted} />
              )}
            </Pressable>
          </View>
        </ScrollView>

        <Text style={styles.label}>Titre</Text>
        <TextInput style={styles.input} value={title} onChangeText={setTitle} />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <Text style={styles.label}>Catégorie</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.catRow}>
            {categories.map((c) => (
              <Pressable
                key={c.id}
                style={[styles.catChip, categoryId === c.id && styles.catChipActive]}
                onPress={() => setCategoryId(c.id)}
              >
                <Text style={[styles.catChipText, categoryId === c.id && styles.catChipTextActive]}>
                  {c.icon} {c.nameFr}
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Prix (DH)</Text>
            <TextInput style={styles.input} value={price} onChangeText={setPrice} keyboardType="numeric" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Stock</Text>
            <TextInput style={styles.input} value={stock} onChangeText={setStock} keyboardType="numeric" />
          </View>
        </View>

        <Text style={styles.label}>Quantité minimum de commande</Text>
        <TextInput style={styles.input} value={minOrderQty} onChangeText={setMinOrderQty} keyboardType="numeric" />

        <Pressable style={styles.submitBtn} onPress={submit} disabled={saving}>
          {saving ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.submitText}>{editingId ? "Enregistrer" : "Publier"}</Text>
          )}
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.card },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  deleteBtn: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  topBarTitle: { fontSize: fontSize.md, fontWeight: "700", color: colors.text },
  content: { padding: spacing.lg },
  label: { fontSize: fontSize.sm, fontWeight: "600", color: colors.text, marginBottom: spacing.xs, marginTop: spacing.md },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    height: 48,
    fontSize: fontSize.md,
    color: colors.text,
  },
  textArea: { height: 100, paddingTop: spacing.sm, textAlignVertical: "top" },
  row: { flexDirection: "row", gap: spacing.md },
  imageRow: { flexDirection: "row", gap: spacing.sm },
  imageThumbWrap: { position: "relative" },
  imageThumb: { width: 80, height: 80, borderRadius: radius.md, backgroundColor: colors.bg },
  removeBtn: {
    position: "absolute",
    top: -6,
    right: -6,
    width: 20,
    height: 20,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  addImageBtn: {
    width: 80,
    height: 80,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  catRow: { flexDirection: "row", gap: spacing.sm },
  catChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  catChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  catChipText: { fontSize: fontSize.sm, color: colors.text },
  catChipTextActive: { color: colors.white, fontWeight: "600" },
  submitBtn: {
    marginTop: spacing.xl,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  submitText: { color: colors.white, fontWeight: "700", fontSize: fontSize.md },
});
