import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MenuProvider } from "react-native-popup-menu";
import { StripeProvider } from "@stripe/stripe-react-native";
import Signup from "./screens/Signup";
import Login from "./screens/Login";
import Splash from "./components/Splash";
import Intro from "./screens/Intro";
import { BottomSheetProvider } from "./hooks/BottomSheetContext";
import { SettingsProvider, useSettings } from "./hooks/SettingsContext";
import { ThemesProvider, useThemes } from "./hooks/ThemesContext";
import useUpdateTimezoneOnAppActive from "./hooks/useUpdateTimezoneOnAppActive";
import { STRIPE_PUBLISHABLE_KEY } from "@env";
import EmailVerification from "./screens/EmailVerification";
import ForgotPassword from "./screens/ForgotPassword";
import { DayStatusProvider } from "./hooks/DayStatusContext";
import MainStack from "./components/MainStack";
import { LinearGradient } from "expo-linear-gradient";
import TodoBottomSheet from "./components/todaytmrw/TodoBottomSheet";

const Stack = createNativeStackNavigator();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen
      name="Signup"
      component={Signup}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Login"
      component={Login}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="EmailVerification"
      component={EmailVerification}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="ForgotPassword"
      component={ForgotPassword}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

const IntroStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen
      name="IntroScreen"
      component={Intro}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

export default function App() {
  return (
    <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
      <MenuProvider>
        <SettingsProvider>
          <DayStatusProvider>
            <ThemesProvider>
              <BottomSheetProvider>
                <AppContent />
              </BottomSheetProvider>
            </ThemesProvider>
          </DayStatusProvider>
        </SettingsProvider>
      </MenuProvider>
    </StripeProvider>
  );
}

function AppContent() {
  const { theme, backgroundGradient, statusBarHidden } = useThemes();
  const [isSplashScreen, setIsSplashScreen] = useState(true);
  const { isAuthenticated } = useSettings();

  // Splash screen and data loading
  useEffect(() => {
    if (isAuthenticated) {
      const timerId = setTimeout(() => {
        // Hide after data loaded... command shift h
        setIsSplashScreen(false);
      }, 2000);
      return () => clearTimeout(timerId);
    } else {
      const timerId = setTimeout(() => {
        setIsSplashScreen(false);
      }, 2000);
      return () => clearTimeout(timerId);
    }
  }, [isAuthenticated]);

  // If app state becomes active, update firebase timezone if user is in new timezone
  // useUpdateTimezoneOnAppActive(currentUserID);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar
        style={theme.statusBar}
        animated={true}
        hidden={statusBarHidden}
      />
      <NavigationContainer theme={{ colors: {} }}>
        {isSplashScreen ? (
          <Splash />
        ) : isAuthenticated ? (
          <LinearGradient colors={backgroundGradient} style={{ flex: 1 }}>
            <MainStack />
          </LinearGradient>
        ) : (
          <LinearGradient colors={backgroundGradient} style={{ flex: 1 }}>
            <AuthStack />
          </LinearGradient>
        )}
      </NavigationContainer>
      <TodoBottomSheet />
    </View>
  );
}
