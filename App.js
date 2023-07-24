import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MenuProvider } from "react-native-popup-menu";
import { StripeProvider } from "@stripe/stripe-react-native";
import { useFonts } from "expo-font";
import Today from "./screens/Today";
import Tomorrow from "./screens/Tomorrow";
import Settings from "./screens/Settings";
import Signup from "./screens/Signup";
import Login from "./screens/Login";
import Splash from "./screens/Splash";
import Account from "./screens/Account";
import PastBets from "./screens/PastBets";
import TodoBottomSheet from "./components/TodoBottomSheet";
import { BOTTOM_TAB_HEIGHT, Color } from "./GlobalStyles";
import { BottomSheetProvider } from "./hooks/BottomSheetContext";
import { SettingsProvider, useSettings } from "./hooks/SettingsContext";
import { ThemesProvider, useThemes } from "./hooks/ThemesContext";
import TodayActiveIcon from "./assets/icons/fire-active-icon.svg";
import TodayInactiveIcon from "./assets/icons/fire-inactive-icon.svg";
import TomorrowActiveIcon from "./assets/icons/add-active-icon.svg";
import TomorrowInactiveIcon from "./assets/icons/add-inactive-icon.svg";
import SettingsActiveIcon from "./assets/icons/settings-active-icon.svg";
import SettingsInactiveIcon from "./assets/icons/settings-inactive-icon.svg";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { auth } from "./database/firebase";
import { onAuthStateChanged } from "@firebase/auth";
import useUpdateTimezoneOnAppActive from "./hooks/useUpdateTimezoneOnAppActive";
import { STRIPE_PUBLISHABLE_KEY } from "@env";
import Transactions from "./screens/Transactions";
import EmailVerification from "./screens/EmailVerification";
import ForgotPassword from "./screens/ForgotPassword";
import ChangeEmail from "./screens/ChangeEmail";
import { LinearGradient } from "expo-linear-gradient";
import { DayStatusProvider } from "./hooks/DayStatusContext";

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

// const IntroStack = () => (
//   <Stack.Navigator screenOptions={{ headerShown: false }}>
//     <Stack.Screen
//       name="IntroScreen"
//       component={Intro}
//       options={{ headerShown: false }}
//     />
//   </Stack.Navigator>
// );

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
  const [isSplashScreen, setIsSplashScreen] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // If user signed in:
      if (user && user.emailVerified) {
        setIsSignedIn(true);

        // Show splash screen

        // Load data
        
        if (initializing) setInitializing(false);
      // If user not signed in:
      } else {
        setIsSignedIn(false);
        if (initializing) setInitializing(false);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  console.log("splash");
  console.log(isSplashScreen);

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
          <DayStatusProvider>
            <ThemesProvider>
              <BottomSheetProvider>
                <AppContent isSignedIn={isSignedIn} isSplashScreen={isSplashScreen}/>
              </BottomSheetProvider>
            </ThemesProvider>
          </DayStatusProvider>
        </SettingsProvider>
      </MenuProvider>
    </StripeProvider>
  );
}

const getTabStyles = () =>
  StyleSheet.create({
    tabBar: {
      borderTopWidth: 0,
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      height: BOTTOM_TAB_HEIGHT,
      marginBottom: 7,
    },
  });

function AppContent({ isSignedIn, isSplashScreen }) {
  const { theme, backgroundGradient } = useThemes();
  const [themePalette, setThemePalette] = useState();
  const [tabStylesState, setTabStylesState] = useState();

  // Background color of app
  useEffect(() => {
    if (theme) {
      setThemePalette({
        colors: {
          // background:
          //   currentThemeName === "Classic"
          //     ? classicBackgroundColor
          //     : theme.accent,
          // background: () => <LinearGradient colors={["red", "blue"]} />,
        },
      });
    }
    setTabStylesState(getTabStyles());
  }, [theme, backgroundGradient]);

  const {
    setCurrentUserID,
    settings: { isOnboarded },
    loading,
  } = useSettings();

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
      <NavigationContainer theme={themePalette}>
        {!isSplashScreen ? (
          isSignedIn ? (
            <LinearGradient colors={backgroundGradient} style={{ flex: 1 }}>
              {/* // isIntroed ? ( */}
              <Tab.Navigator
                screenOptions={{
                  headerShown: false,
                  tabBarStyle: tabStylesState ? tabStylesState.tabBar : null,
                  tabBarShowLabel: false,
                  animation: "none", // Add this line to disable animation
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
                          color={theme.textHigh}
                        />
                      ) : (
                        <TodayInactiveIcon
                          width={40}
                          height={40}
                          color={theme.textHigh}
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
                          color={theme.textHigh}
                        />
                      ) : (
                        <TomorrowInactiveIcon
                          width={40}
                          height={40}
                          color={theme.textHigh}
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
                          color={theme.textHigh}
                        />
                      ) : (
                        <SettingsInactiveIcon
                          width={40}
                          height={40}
                          color={theme.textHigh}
                        />
                      ),
                  }}
                />
              </Tab.Navigator>
            </LinearGradient>
          ) : (
            // ) : (
            //   <IntroStack />
            // )
            <AuthStack backgroundGradient={backgroundGradient} />
          )
        ) : (
          <Splash />
        )}
      </NavigationContainer>
      <TodoBottomSheet backgroundGradient={backgroundGradient} />
    </View>
  );
}
