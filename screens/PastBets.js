import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import {
  Color,
  SETTINGS_HORIZONTAL_PADDING,
  settingsPageStyles,
} from "../GlobalStyles";
import React from "react";
import SettingsHeader from "../components/settings/SettingsHeader";
import StatsBundle from "../components/stats/StatsBundle";
import { useThemes } from "../hooks/ThemesContext";
import { LinearGradient } from "expo-linear-gradient";
 
const PastBets = ({ navigation }) => {
  const { theme, backgroundGradient } = useThemes();
 
  return (
    <LinearGradient colors={backgroundGradient} style={{ flex: 1 }}>
      <SafeAreaView style={style.pageContainer}>
        <SettingsHeader navigation={navigation} header={"Past Bets"} />
        <StatsBundle even={false} month="Jul" day="2" />
        <StatsBundle even={true} month="Jul" day="2" />
        <StatsBundle even={false} month="Jun" day="31" />
      </SafeAreaView>
    </LinearGradient>
  );
};

export default PastBets;

const style = StyleSheet.create({
  pageContainer: {
    display: "flex",
    marginHorizontal: SETTINGS_HORIZONTAL_PADDING,
  },
});
