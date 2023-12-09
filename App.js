import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { MenuProvider } from "react-native-popup-menu";
import { StripeProvider } from "@stripe/stripe-react-native";
import { BottomSheetProvider } from "./hooks/BottomSheetContext";
import { SettingsProvider, useSettings } from "./hooks/SettingsContext";
import { ThemesProvider } from "./hooks/ThemesContext";
import { STRIPE_PUBLISHABLE_KEY } from "@env";
import MainStack, { AuthStack } from "./components/MainStack";
import { LinearGradient } from "expo-linear-gradient";
import { redGradientValues } from "./themes";
import Splash from "./components/Splash";
import TodoBottomSheet from "./components/todaytmrw/TodoBottomSheet";

export default function App() {
  return (
    <SettingsProvider>
      <ThemesProvider>
        <AppContent />
      </ThemesProvider>
    </SettingsProvider>
  );
}

function AppContent() {
  const { isAuthenticated, todayPageLoaded } = useSettings();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    if (isAuthenticated === false || (isAuthenticated === true && todayPageLoaded === true)) {
      setShowSplash(false);
    }
  }, [isAuthenticated, todayPageLoaded]);

  return (
    <NavigationContainer theme={{ colors: {} }} style={{ flex: 1 }}>
      {showSplash && <Splash />}

      {isAuthenticated && todayPageLoaded && (
        <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
          <MenuProvider>
            <BottomSheetProvider>
              <MainStack />
              <TodoBottomSheet />
            </BottomSheetProvider>
          </MenuProvider>
        </StripeProvider>
      )}

      {(!isAuthenticated || !todayPageLoaded) && (
        <LinearGradient colors={redGradientValues} style={{ flex: 1 }}>
          <StatusBar style={"light"} animated={true} />
          <AuthStack />
        </LinearGradient>
      )}
    </NavigationContainer>
  );
}
