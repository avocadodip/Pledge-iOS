import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import TabIcon from "./TabIcon";
import TodayIcon from "../assets/icons/tab-today.svg";
import TmrwIcon from "../assets/icons/tab-tmrw.svg";
import DreamsIcon from "../assets/icons/tab-dreams.svg";
import { BOTTOM_TAB_HEIGHT } from "../GlobalStyles";
import { StyleSheet } from "react-native";
import Today from "../screens/Today";
import Tomorrow from "../screens/Tomorrow";
import PastBets from "../screens/PastBets";
import Transactions from "../screens/Transactions";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Settings from "../screens/Settings";
import { LinearGradient } from "expo-linear-gradient";
import { useThemes } from "../hooks/ThemesContext";
import DeleteAccount from "../screens/DeleteAccount";
import Dreams from "../screens/Dreams";
import { StatusBar } from "expo-status-bar";
import { useSettings } from "../hooks/SettingsContext";
import FinishSignup from "../screens/FinishSignup";

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

const TomorrowScreen = () => (
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
  const { finishSignup } = useSettings();
  const tabStyles = getTabStyles();
  const { theme, backgroundGradient } = useThemes();

  if (finishSignup) {
    return (
      <FinishSignup />
    );
  }

  return (
    <LinearGradient colors={backgroundGradient} style={{ flex: 1 }}>


      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: tabStyles.tabBar,
          tabBarShowLabel: false,
          unmountOnBlur: false,
        }}
        initialRouteName="Today"
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
          component={TomorrowScreen}
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
    </LinearGradient>
  );
}
