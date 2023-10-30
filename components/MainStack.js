import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import TabIcon from "./TabIcon";
import TodayIcon from "../assets/icons/tab-today.svg";
// import TodayInactiveIcon from "../assets/icons/fire-inactive-icon.svg";
import TmrwIcon from "../assets/icons/tab-tmrw.svg";
// import TomorrowInactiveIcon from "../assets/icons/add-inactive-icon.svg";
import DreamsIcon from "../assets/icons/tab-dreams.svg";
// import RocketInactiveIcon from "../assets/icons/rocket-launch-inactive.svg";
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
import DeleteAccount from "../screens/DeleteAccount";
import Dreams from "../screens/Dreams";

const Stack = createNativeStackNavigator();
const RootStack = createNativeStackNavigator();
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
  <RootStack.Navigator screenOptions={{ headerShown: false }}>
    <RootStack.Group>
      <RootStack.Screen
        name="SettingsScreen"
        component={Settings}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="Account"
        component={Account}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="ChangeEmail"
        component={ChangeEmail}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="DeleteAccount"
        component={DeleteAccount}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="PastBets"
        component={PastBets}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="Transactions"
        component={Transactions}
        options={{ headerShown: false }}
      />
    </RootStack.Group>
  </RootStack.Navigator>
);

const DreamsStack = () => {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Group>
        <RootStack.Screen name="Dreams" component={Dreams} />
      </RootStack.Group>
      <RootStack.Group screenOptions={{ presentation: "modal" }}>
        <RootStack.Screen name="SettingsStack" component={SettingsStack} />
      </RootStack.Group>
    </RootStack.Navigator>
  );
};

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
              type={"today"}
              focused={focused}
              activeIcon={TodayIcon}
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
              type={"tmrw"}
              focused={focused}
              activeIcon={TmrwIcon}
              theme={theme}
            />
          ),
        }}
      />
      <Tab.Screen
        name="DreamsStack"
        component={DreamsStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              type={"dreams"}
              focused={focused}
              activeIcon={DreamsIcon}
              theme={theme}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
