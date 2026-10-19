import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabNavigator from "./TabNavigator";
import ProductDetailScreen from "../screens/ProductDetailScreen";
import SellerProfileScreen from "../screens/SellerProfileScreen";
import SearchScreen from "../screens/SearchScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import AddEditProductScreen from "../screens/AddEditProductScreen";
import DashboardScreen from "../screens/DashboardScreen";
import { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="SellerProfile" component={SellerProfileScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="Login" component={LoginScreen} options={{ presentation: "modal" }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ presentation: "modal" }} />
      <Stack.Screen name="AddEditProduct" component={AddEditProductScreen} options={{ presentation: "modal" }} />
      <Stack.Screen name="SellerDashboard" component={DashboardScreen} />
    </Stack.Navigator>
  );
}
