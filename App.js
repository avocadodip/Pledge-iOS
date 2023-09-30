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
import { LinearGradient } from "expo-linear-gradient";
import TodoBottomSheet from "./components/todaytmrw/TodoBottomSheet";
import { TmrwTodosProvider } from "./hooks/TmrwTodosContext";
import { redGradientValues } from "./themes";
import { TodayTodosProvider } from "./hooks/TodayTodosContext";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import TabIcon from "./components/TabIcon";
import TodayActiveIcon from "./assets/icons/fire-active-icon.svg";
import TodayInactiveIcon from "./assets/icons/fire-inactive-icon.svg";
import TomorrowActiveIcon from "./assets/icons/add-active-icon.svg";
import TomorrowInactiveIcon from "./assets/icons/add-inactive-icon.svg";
import SettingsActiveIcon from "./assets/icons/settings-active-icon.svg";
import SettingsInactiveIcon from "./assets/icons/settings-inactive-icon.svg";
import { BOTTOM_TAB_HEIGHT } from "./GlobalStyles";
import { StyleSheet } from "react-native";
import Today from "./screens/Today"; 
import Tomorrow from "./screens/Tomorrow";
import Account from "./screens/Account";
import ChangeEmail from "./screens/ChangeEmail";
import PastBets from "./screens/PastBets";
import Transactions from "./screens/Transactions";
import Settings from "./screens/Settings";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


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

// const MainStack = () => {
//   const tabStyles = getTabStyles();
//   const { theme } = useThemes();

//   return (
//     <Tab.Navigator
//       screenOptions={{
//         headerShown: false,
//         tabBarStyle: tabStyles.tabBar,
//         tabBarShowLabel: false,
//       }}
//     >
//       <Tab.Screen
//         name="Today"
//         component={TodayStack}
//         options={{
//           tabBarIcon: ({ focused }) => (
//             <TabIcon
//               focused={focused}
//               activeIcon={TodayActiveIcon}
//               inactiveIcon={TodayInactiveIcon}
//               theme={theme}
//             />
//           ),
//         }}
//       />
//       <Tab.Screen
//         name="Tomorrow"
//         component={TomorrowStack}
//         options={{
//           tabBarIcon: ({ focused }) => (
//             <TabIcon
//               focused={focused}
//               activeIcon={TomorrowActiveIcon}
//               inactiveIcon={TomorrowInactiveIcon}
//               theme={theme}
//             />
//           ),
//         }}
//       />
//       <Tab.Screen
//         name="Settings"
//         component={SettingsStack}
//         options={{
//           tabBarIcon: ({ focused }) => (
//             <TabIcon
//               focused={focused}
//               activeIcon={SettingsActiveIcon}
//               inactiveIcon={SettingsInactiveIcon}
//               theme={theme}
//             />
//           ),
//         }}
//       />
//     </Tab.Navigator>
//   );
// }

const MainStack = () => {
  const tabStyles = getTabStyles();
  const { theme } = useThemes();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: tabStyles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Today"
        component={TodayStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              activeIcon={TodayActiveIcon}
              inactiveIcon={TodayInactiveIcon}
              theme={theme}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Tomorrow"
        component={TomorrowStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              activeIcon={TomorrowActiveIcon}
              inactiveIcon={TomorrowInactiveIcon}
              theme={theme}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              activeIcon={SettingsActiveIcon}
              inactiveIcon={SettingsInactiveIcon}
              theme={theme}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Auth"
        component={AuthStack}
        options={{ tabBarButton: () => null }}
      />
    </Tab.Navigator>
  );
};

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
    <SettingsProvider>
      <AppContent />
    </SettingsProvider>
  );
} 

function AppContent() {
  const { isAuthenticated, userDataFetched, appReadyToRender } = useSettings();
  const [isSplashScreen, setIsSplashScreen] = useState(true);

  useEffect(() => {
    const timerId = setTimeout(() => {
      if (!isAuthenticated || (isAuthenticated && appReadyToRender)) {
        setIsSplashScreen(false);
      }
    }, 2000);
    return () => clearTimeout(timerId);
  }, [isAuthenticated, appReadyToRender]);

  // useEffect(() => {
  //   console.log("userDataFetched: " + userDataFetched);
  //   console.log("appReadyToRender: " + appReadyToRender);
  //   console.log("auth: " + isAuthenticated);
  //   console.log("isSplash: " + isSplashScreen);
  // }, [userDataFetched, appReadyToRender, isAuthenticated, isSplashScreen]);

  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer theme={{ colors: {} }}>
        {isSplashScreen && (
          <>
            <StatusBar style={"light"} animated={true} />
            <Splash />
          </>
        )}

        {isAuthenticated && userDataFetched && (
          <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
            <MenuProvider>
              <DayStatusProvider>
                <TmrwTodosProvider>
                  <TodayTodosProvider>
                    <ThemesProvider>
                      <BottomSheetProvider>
                        <AuthenticatedApp />
                      </BottomSheetProvider>
                    </ThemesProvider>
                  </TodayTodosProvider>
                </TmrwTodosProvider>
              </DayStatusProvider>
            </MenuProvider>
          </StripeProvider>
        )}

        {!isAuthenticated && !userDataFetched && (
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
  const { theme, backgroundGradient, statusBarHidden } = useThemes();

  return (
    <>
      <LinearGradient colors={backgroundGradient} style={{ flex: 1 }}>
        <StatusBar
          style={theme.statusBar}
          animated={true}
          hidden={statusBarHidden}
        />
        <MainStack />
      </LinearGradient>
      <TodoBottomSheet />
    </>
  );
}
