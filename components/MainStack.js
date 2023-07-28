import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import TabIcon from "./TabIcon";
import TodayActiveIcon from "../assets/icons/fire-active-icon.svg";
import TodayInactiveIcon from "../assets/icons/fire-inactive-icon.svg";
import TomorrowActiveIcon from "../assets/icons/add-active-icon.svg";
import TomorrowInactiveIcon from "../assets/icons/add-inactive-icon.svg";
import SettingsActiveIcon from "../assets/icons/settings-active-icon.svg";
import SettingsInactiveIcon from "../assets/icons/settings-inactive-icon.svg";
import { BOTTOM_TAB_HEIGHT } from "../GlobalStyles";
import { StyleSheet } from "react-native";
import Today from "../screens/Today";
import Tomorrow from "../screens/Tomorrow";
import Account from "../screens/Account";
import ChangeEmail from "../screens/ChangeEmail";
import PastBets from "../screens/PastBets";
import Transactions from "../screens/Transactions";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Settings from "../screens/Settings";
import { LinearGradient } from "expo-linear-gradient";
import { useThemes } from "../hooks/ThemesContext";
 
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

export default function MainStack() {
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
    </Tab.Navigator>
  );
}
