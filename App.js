import React, { useContext, useEffect, useRef, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, SafeAreaView, Image } from "react-native";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFonts } from "expo-font";
import Today from "./screens/Today";
import Onboard1 from "./screens/Onboard1";
import Onboard2 from "./screens/Onboard2";
import Tomorrow from "./screens/Tomorrow";
import Settings from "./screens/Settings";
import Signup from "./screens/Signup";
import Login from "./screens/Login";
import Splash from "./screens/Splash";
import Billing from "./screens/Billing";
import Account from "./screens/Account";
import Stats from "./screens/Stats";
import TodoBottomSheet from "./components/TodoBottomSheet";
import OnboardingPopup from "./components/OnboardingPopup";
import { Color } from "./GlobalStyles";

import { ThemeContext } from "./hooks/ThemeContext";
import { classicTheme, lightTheme, darkTheme } from './Themes';    

import { BottomSheetProvider } from "./hooks/BottomSheetContext";
import { SettingsProvider, useSettings } from "./hooks/SettingsContext";
// import { MenuProvider } from "react-native-popup-menu";
// import { IconRegistry, ApplicationProvider } from "@ui-kitten/components";
import TodayActiveIcon from "./assets/icons/fire-active-icon.svg";
import TodayInactiveIcon from "./assets/icons/fire-inactive-icon.svg";
import TomorrowActiveIcon from "./assets/icons/add-active-icon.svg";
import TomorrowInactiveIcon from "./assets/icons/add-inactive-icon.svg";
import SettingsActiveIcon from "./assets/icons/settings-active-icon.svg";
import SettingsInactiveIcon from "./assets/icons/settings-inactive-icon.svg";
import { checkAuthState } from "./utils/authHelper";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { auth } from "./database/firebase";
import { onAuthStateChanged } from "@firebase/auth";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

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
  </Stack.Navigator>
);

const TodayStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen
      name="TodayScreen"
      component={Today}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

const TomorrowStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen
      name="TomorrowScreen"
      component={Tomorrow}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

const SettingsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen
      name="SettingsScreen"
      component={Settings}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Account"
      component={Account}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Stats"
      component={Stats}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Billing"
      component={Billing}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

export default function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [initializing, setInitializing] = useState(true);

  const [chosenTheme, setChosenTheme] = useState(classicTheme);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsSignedIn(true);
        if (initializing) setInitializing(false);
      } else {
        setIsSignedIn(false);
        if (initializing) setInitializing(false);
      }
    });
  
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const [fontsLoaded, error] = useFonts({
    Epilogue_regular: require("./assets/fonts/Epilogue_regular.ttf"),
    Epilogue_medium: require("./assets/fonts/Epilogue_medium.ttf"),
    Epilogue_semibold: require("./assets/fonts/Epilogue_semibold.ttf"),
    Epilogue_bold: require("./assets/fonts/Epilogue_bold.ttf"),
    Inter_regular: require("./assets/fonts/Inter_regular.ttf"),
    Inter_semibold: require("./assets/fonts/Inter_semibold.ttf"),
    Inter_bold: require("./assets/fonts/Inter_bold.ttf"),
  });

  if (!fontsLoaded && !error) {
    return null;
  }

  const userLoggedIn = 1;
  // checkAuthState(); // Set this based on your authentication logic

  if (initializing) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ chosenTheme, setChosenTheme }}>
      <SettingsProvider>
        <BottomSheetProvider>
          <AppContent isSignedIn={isSignedIn} />
        </BottomSheetProvider>
      </SettingsProvider>
    </ThemeContext.Provider>
  );
}

function AppContent({ isSignedIn }) {
  const { chosenTheme } = useContext(ThemeContext);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: chosenTheme.accent,
    },
    tabBar: {
      backgroundColor: "transparent",
      borderTopWidth: 0,
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      height: 100,
    },
  });

  const [hideSplashScreen, setHideSplashScreen] = useState(true);
    // useEffect(() => {
  //   setTimeout(() => {
  //     setHideSplashScreen(true);
  //   }, 2000);
  // }, []);

  const { setCurrentUserID } = useSettings();

  useEffect(() => {
    if (isSignedIn) {
      const user = auth.currentUser;
      if (user) {
        setCurrentUserID(user.uid);
      }
    } else {
      setCurrentUserID(null);
    }
  }, [isSignedIn, setCurrentUserID]);

  return (
    <View style={styles.container}>
    <StatusBar style="light" backgroundColor={chosenTheme.primary} />
    <NavigationContainer>
      {hideSplashScreen ? (
        isSignedIn ? (
          <Tab.Navigator
            screenOptions={{
              headerShown: false,
              tabBarStyle: styles.tabBar,
              tabBarShowLabel: false,
            }}
          >
            <Tab.Screen
              name="Today"
              component={TodayStack}
              options={{
                tabBarIcon: ({ focused }) =>
                  focused ? (
                    <TodayActiveIcon
                      width={40}
                      height={40}
                      color={chosenTheme.primary}
                    />
                  ) : (
                    <TodayInactiveIcon
                      width={40}
                      height={40}
                      color={chosenTheme.primary}
                    />
                  ),
              }}
            />
            <Tab.Screen
              name="Tomorrow"
              component={TomorrowStack}
              options={{
                tabBarIcon: ({ focused }) =>
                  focused ? (
                    <TomorrowActiveIcon
                      width={40}
                      height={40}
                      color={chosenTheme.primary}
                    />
                  ) : (
                    <TomorrowInactiveIcon
                      width={40}
                      height={40}
                      color={chosenTheme.primary}
                    />
                  ),
              }}
            />
            <Tab.Screen
              name="Settings"
              component={SettingsStack}
              options={{
                tabBarIcon: ({ focused }) =>
                  focused ? (
                    <SettingsActiveIcon
                      width={40}
                      height={40}
                      color={chosenTheme.primary}
                    />
                  ) : (
                    <SettingsInactiveIcon
                      width={40}
                      height={40}
                      color={chosenTheme.primary}
                    />
                  ),
              }}
            />
          </Tab.Navigator>
        ) : (
          <AuthStack />
        )
      ) : (
        <Splash />
      )}
    </NavigationContainer>
    <TodoBottomSheet />
  </View>
  );
}