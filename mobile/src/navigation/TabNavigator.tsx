import React from "react";
import { Alert, Platform, Pressable, StyleSheet, View } from "react-native";
import { createBottomTabNavigator, BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { colors, shadow } from "../theme";
import HomeScreen from "../screens/HomeScreen";
import SearchScreen from "../screens/SearchScreen";
import SellersListScreen from "../screens/SellersListScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { TabParamList } from "./types";
import useAuthStore from "../store/authStore";

const Tab = createBottomTabNavigator<TabParamList>();

const ICONS: Record<keyof TabParamList, keyof typeof Ionicons.glyphMap> = {
  Home: "home",
  SearchTab: "search",
  Sell: "add",
  Sellers: "storefront",
  Profile: "person",
};

// Never actually rendered: the Sell tab's press is intercepted below.
function SellPlaceholder() {
  return null;
}

function SellButton({ onPress }: Pick<BottomTabBarButtonProps, "onPress">) {
  return (
    <Pressable onPress={onPress} style={styles.sellButtonWrap} hitSlop={8}>
      <View style={styles.sellButtonCircle}>
        <Ionicons name="add" size={30} color={colors.white} />
      </View>
    </Pressable>
  );
}

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={ICONS[route.name as keyof TabParamList]} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: "Accueil" }} />
      <Tab.Screen name="SearchTab" component={SearchScreen} options={{ title: "Rechercher" }} />
      <Tab.Screen
        name="Sell"
        component={SellPlaceholder}
        options={{
          title: "",
          tabBarButton: (props) => <SellButton onPress={props.onPress} />,
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            const user = useAuthStore.getState().user;
            if (!user) {
              navigation.getParent()?.navigate("Login" as never);
            } else if (user.role !== "SELLER") {
              Alert.alert(
                "Compte acheteur",
                "Votre compte actuel est un compte acheteur. Contactez le support pour activer la vente."
              );
            } else {
              navigation.getParent()?.navigate("AddEditProduct" as never);
            }
          },
        })}
      />
      <Tab.Screen name="Sellers" component={SellersListScreen} options={{ title: "Fournisseur" }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: "Profil" }} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  sellButtonWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    top: Platform.OS === "android" ? -18 : -14,
  },
  sellButtonCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: colors.bg,
    ...shadow.raised,
  },
});
