import { createNavigationContainerRef } from "@react-navigation/native";
import { RootStackParamList } from "./types";

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export function navigateToLogin() {
  if (navigationRef.isReady() && navigationRef.getCurrentRoute()?.name !== "Login") {
    navigationRef.navigate("Login" as never);
  }
}
