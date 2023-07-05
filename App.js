import React, { useContext, useEffect, useRef, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from "react-native";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MenuProvider } from "react-native-popup-menu";
import { StripeProvider } from "@stripe/stripe-react-native";
import { useFonts } from "expo-font";
import Today from "./screens/Today";
import Onboard1 from "./screens/Onboard1";
import Onboard2 from "./screens/Onboard2";
import Tomorrow from "./screens/Tomorrow";
import Settings from "./screens/Settings";
import Signup from "./screens/Signup";
import Login from "./screens/Login";
import Splash from "./screens/Splash";
import Account from "./screens/Account";
import PastBets from "./screens/PastBets";
import TodoBottomSheet from "./components/TodoBottomSheet";
import OnboardingPopup from "./components/OnboardingPopup";
import { BOTTOM_TAB_HEIGHT, Color } from "./GlobalStyles";
import { BottomSheetProvider } from "./hooks/BottomSheetContext";
import { SettingsProvider, useSettings } from "./hooks/SettingsContext";
import { ThemesProvider, useThemes } from "./hooks/ThemesContext";
// import { MenuProvider } from "react-native-popup-menu";
// import { IconRegistry, ApplicationProvider } from "@ui-kitten/components";
import TodayActiveIcon from "./assets/icons/fire-active-icon.svg";
import TodayInactiveIcon from "./assets/icons/fire-inactive-icon.svg";
import TomorrowActiveIcon from "./assets/icons/add-active-icon.svg";
import TomorrowInactiveIcon from "./assets/icons/add-inactive-icon.svg";
import SettingsActiveIcon from "./assets/icons/settings-active-icon.svg";
import SettingsInactiveIcon from "./assets/icons/settings-inactive-icon.svg";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { auth } from "./database/firebase";
import { onAuthStateChanged } from "@firebase/auth";
import TouchableRipple from "./components/TouchableRipple";
import useUpdateTimezoneOnAppActive from "./hooks/useUpdateTimezoneOnAppActive";
import { STRIPE_PUBLISHABLE_KEY } from "./constants";
import Transactions from "./screens/Transactions";
import EmailVerification from "./screens/EmailVerification";
import ForgotPassword from "./screens/ForgotPassword";
import ChangeEmail from "./screens/ChangeEmail";

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
      name="ChangeEmail"
      component={ChangeEmail}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="PastBets"
      component={PastBets}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Transactions"
      component={Transactions}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

export default function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.emailVerified) {
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

  useEffect(() => {
    console.log("isSignedIn state has changed: ", isSignedIn);
  }, [isSignedIn]);

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

  if (initializing) {
    return null;
  }

  return (
    <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
      <MenuProvider>
        <SettingsProvider>
          <ThemesProvider>
            <BottomSheetProvider>
              <AppContent isSignedIn={isSignedIn} />
            </BottomSheetProvider>
          </ThemesProvider>
        </SettingsProvider>
      </MenuProvider>
    </StripeProvider>
  );
}

function AppContent({ isSignedIn }) {
  const { theme } = useThemes();

  const getStyles = (theme) =>
    StyleSheet.create({
      tabBar: {
        backgroundColor: theme ? theme.accent : 'defaultColor',
        borderTopWidth: 0,
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: BOTTOM_TAB_HEIGHT,
        marginBottom: 7,
      },
    });

  const [themePalette, setThemePalette] = useState();
  const [stylesState, setStylesState] = useState();

  useEffect(() => {
    if (theme) {
      setThemePalette({
        colors: {
          background: theme.accent,
        },
      });
      setStylesState(getStyles(theme));
    }
  }, [theme]);

  const styles = getStyles(theme);

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
      console.log("current user: none");
      setCurrentUserID(null);
    }
  }, [isSignedIn, setCurrentUserID]);

  // If app state becomes active, update firebase timezone if user is in new timezone
  // useUpdateTimezoneOnAppActive(currentUserID);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="light" backgroundColor={Color.white} />
      <NavigationContainer theme={themePalette}>
        {hideSplashScreen ? (
          isSignedIn ? (
            <Tab.Navigator
              screenOptions={{
                headerShown: false,
                tabBarStyle: stylesState ? stylesState.tabBar : null,
                tabBarShowLabel: false,
              }}
            >
              <Tab.Screen
                name="Today"
                component={TodayStack}
                options={{
                  tabBarIcon: ({ focused }) =>
                    focused ? (
                      <TodayActiveIcon width={40} height={40} color={"white"} />
                    ) : (
                      <TodayInactiveIcon
                        width={40}
                        height={40}
                        color={"white"}
                      />
                    ),

                  // tabBarButton: (props) => (
                  //   <TouchableRipple {...props}>
                  //     {props.children}
                  //   </TouchableRipple>
                  // ),
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

                  // tabBarButton: (props) => (
                  //   <TouchableRipple {...props}>
                  //     {props.children}
                  //   </TouchableRipple>
                  // ),
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
  );
}
