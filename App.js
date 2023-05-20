import React, { useContext, useRef, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, SafeAreaView, Image } from "react-native";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFonts } from "expo-font";
import Today from "./screens/Today";
import Tomorrow from "./screens/Tomorrow";
import Settings from "./screens/Settings";
import Login from "./screens/Login";
import Signup from "./screens/Signup";
import Splash from "./screens/Splash";
import Billing from "./screens/Billing";
import Account from "./screens/Account";
import Stats from "./screens/Stats";
import TodoBottomSheet from "./components/TodoBottomSheet";
import { Color } from "./GlobalStyles";
import { BottomSheetProvider } from "./hooks/BottomSheetContext";
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

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen
      name="Login"
      component={Login}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Signup"
      component={Signup}
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

const theme = {
  dark: false,
  colors: {
    primary: "rgb(255, 45, 85)",
    background: "#DD4F4F",
    card: "rgb(255, 255, 255)",
    text: "rgb(28, 28, 30)",
    border: "rgb(199, 199, 204)",
    notification: "rgb(255, 69, 58)",
  },
};

export default function App() {
  const [hideSplashScreen, setHideSplashScreen] = useState(true);
  const [fontsLoaded, error] = useFonts({
    Epilogue_regular: require("./assets/fonts/Epilogue_regular.ttf"),
    Epilogue_medium: require("./assets/fonts/Epilogue_medium.ttf"),
    Epilogue_semibold: require("./assets/fonts/Epilogue_semibold.ttf"),
    Epilogue_bold: require("./assets/fonts/Epilogue_bold.ttf"),
    Inter_regular: require("./assets/fonts/Inter_regular.ttf"),
    Inter_semibold: require("./assets/fonts/Inter_semibold.ttf"),
    Inter_bold: require("./assets/fonts/Inter_bold.ttf"),
  });

  React.useEffect(() => {
    setTimeout(() => {
      setHideSplashScreen(true);
    }, 2000);
  }, []);

  if (!fontsLoaded && !error) {
    return null;
  }

  const userLoggedIn = checkAuthState(); // Set this based on your authentication logic

  return (
    <BottomSheetProvider>
      <View style={{ flex: 1 }}>
        <NavigationContainer theme={theme}>
          {hideSplashScreen ? (
            userLoggedIn ? (
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
                          color={"white"}
                        />
                      ) : (
                        <TodayInactiveIcon
                          width={40}
                          height={40}
                          color={"white"}
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
                          color={"white"}
                        />
                      ) : (
                        <TomorrowInactiveIcon
                          width={40}
                          height={40}
                          color={"white"}
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
                          color={"white"}
                        />
                      ) : (
                        <SettingsInactiveIcon
                          width={40}
                          height={40}
                          color={"white"}
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
    </BottomSheetProvider>
  );
}

const styles = StyleSheet.create({
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
