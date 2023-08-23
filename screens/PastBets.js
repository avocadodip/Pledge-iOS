import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { APP_HORIZONTAL_PADDING, BOTTOM_TAB_HEIGHT } from "../GlobalStyles";
import SettingsHeader from "../components/settings/SettingsHeader";
import StatsItem from "../components/stats/StatsItem";
import { useThemes } from "../hooks/ThemesContext";
import { LinearGradient } from "expo-linear-gradient";
import { useSettings } from "../hooks/SettingsContext";

const PastBets = ({ navigation }) => {
  const { backgroundGradient } = useThemes();
  const { fetchPastBets, pastBetsArray, fetchingPastBets } = useSettings();

  useEffect(() => {
    fetchPastBets();
  }, []);

  const handleLoadMore = () => {
    fetchPastBets();
  };

  const renderFooter = () => {
    if (!fetchingPastBets) return null;
    return <ActivityIndicator style={{ color: "#000" }} />;
  };

  return (
    <LinearGradient colors={backgroundGradient} style={{ flex: 1 }}>
      <SafeAreaView style={style.pageContainer}>
        <SettingsHeader navigation={navigation} header={"Past Bets"} />
        <FlatList
          data={pastBetsArray}
          renderItem={({ item: dayData, index }) => (
            <StatsItem dayData={dayData} index={index} />
          )}
          keyExtractor={(item, index) => index.toString()}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          contentContainerStyle={{ paddingHorizontal: APP_HORIZONTAL_PADDING }} // Horizontal padding of 16
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

export default PastBets;

const style = StyleSheet.create({
  pageContainer: {
    display: "flex",
    marginBottom: BOTTOM_TAB_HEIGHT + 90,
  },
});
