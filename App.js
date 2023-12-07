import React, { useCallback, useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MenuProvider } from "react-native-popup-menu";
import { StripeProvider } from "@stripe/stripe-react-native";
import { BottomSheetProvider } from "./hooks/BottomSheetContext";
import { SettingsProvider, useSettings } from "./hooks/SettingsContext";
import { ThemesProvider, useThemes } from "./hooks/ThemesContext";
import { STRIPE_PUBLISHABLE_KEY } from "@env";
import MainStack, { AuthStack } from "./components/MainStack";
import { LinearGradient } from "expo-linear-gradient";
import TodoBottomSheet from "./components/todaytmrw/TodoBottomSheet";
import { redGradientValues } from "./themes";
import * as SplashScreen from "expo-splash-screen";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  return (
    <SettingsProvider>
      <AppContent />
    </SettingsProvider>
  );
}

function AppContent() {
  const { isAuthenticated } = useSettings();
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    let unsubscribe;

    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        // await Font.loadAsync({
        //   CourierPrime: require("./assets/fonts/CourierPrime-Regular.ttf"),
        // });

        // Wait for authentication to choose true or false to avoid flash from auth to app
        await new Promise((resolve) => setTimeout(resolve, 400));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();

    // Define the cleanup function directly inside useEffect
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <NavigationContainer theme={{ colors: {} }}>
        {isAuthenticated ? (
          <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
            <MenuProvider>
              <ThemesProvider>
                <BottomSheetProvider>
                  <AuthenticatedApp />
                </BottomSheetProvider>
              </ThemesProvider>
            </MenuProvider>
          </StripeProvider>
        ) : (
          <LinearGradient colors={redGradientValues} style={{ flex: 1 }}>
            <StatusBar style={"light"} animated={true} />
            <AuthStack />
          </LinearGradient>
        )}
      </NavigationContainer>
    </View>
  );
}

function AuthenticatedApp() {
  const { theme, backgroundGradient } = useThemes();

  return (
    <>
      <LinearGradient colors={backgroundGradient} style={{ flex: 1 }}>
        <StatusBar
          style={theme.statusBar}
          animated={true}
        />
        <MainStack />
      </LinearGradient>
      <TodoBottomSheet />
    </>
  );
}
