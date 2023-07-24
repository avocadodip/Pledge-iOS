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
import TodoBottomSheet from "./components/TodoBottomSheet";
import { Color } from "./GlobalStyles";
import { BottomSheetProvider } from "./hooks/BottomSheetContext";
import { SettingsProvider, useSettings } from "./hooks/SettingsContext";
import { ThemesProvider, useThemes } from "./hooks/ThemesContext";
import { auth } from "./database/firebase";
import { onAuthStateChanged } from "@firebase/auth";
import useUpdateTimezoneOnAppActive from "./hooks/useUpdateTimezoneOnAppActive";
import { STRIPE_PUBLISHABLE_KEY } from "@env";
import EmailVerification from "./screens/EmailVerification";
import ForgotPassword from "./screens/ForgotPassword";
import { LinearGradient } from "expo-linear-gradient";
import { DayStatusProvider } from "./hooks/DayStatusContext";
import MainStack from "./components/MainStack";

const Stack = createNativeStackNavigator();

const AuthStack = ({ backgroundGradient }) => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen
      name="Signup"
      component={Signup}
      options={{ headerShown: false }}
      backgroundGradient={backgroundGradient}
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

const SplashStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen
      name="SplashScreen"
      component={Splash}
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
  const { theme, backgroundGradient } = useThemes();

  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isSplashScreen, setIsSplashScreen] = useState(true);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const {
    setCurrentUserID,
    settings: { isOnboarded },
    loading,
  } = useSettings();

  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  useEffect(() => {
    console.log(isSplashScreen);
  }, [isSplashScreen]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      // If user signed in:
      if (user && user.emailVerified) {
        setIsSignedIn(true);
        // setIsSplashScreen(true);

        // Load data

        // Hide splash screen

        // If user not signed in:
      } else {
        setIsSignedIn(false);
        await delay(2000);
        if (backgroundGradient) {
          console.log(backgroundGradient);
          setIsSplashScreen(false);
        }
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [backgroundGradient]);

  // const [hideSplashScreen, setHideSplashScreen] = useState(true);

  // useEffect(() => {
  //   const timeoutId = setTimeout(() => {
  //     setHideSplashScreen(true);
  //   }, 2000);
  //   return () => clearTimeout(timeoutId);
  // }, []);

  // useEffect(() => {
  //   setHideSplashScreen(!loading);
  // }, [loading]);

  useEffect(() => {
    if (isSignedIn) {
      const user = auth.currentUser;
      if (user) {
        setCurrentUserID(user.uid);
      }
    } else {
      console.log("current user: none");
      setCurrentUserID(null);
    }
  }, [isSignedIn, setCurrentUserID]);

  // If app state becomes active, update firebase timezone if user is in new timezone
  // useUpdateTimezoneOnAppActive(currentUserID);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="light" backgroundColor={Color.white} />
      <NavigationContainer theme={{ colors: {} }}>
        {isSignedIn ? (
          <LinearGradient colors={backgroundGradient} style={{ flex: 1 }}>
            <MainStack theme={theme} />
          </LinearGradient>
        ) : (
          <AuthStack backgroundGradient={backgroundGradient} />
        )}
        {/* {isSplashScreen && <SplashStack />} */}
      </NavigationContainer>
      <TodoBottomSheet backgroundGradient={backgroundGradient} />
    </View>
  );
}
