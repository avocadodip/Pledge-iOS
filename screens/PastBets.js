import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { APP_HORIZONTAL_PADDING, BOTTOM_TAB_HEIGHT } from "../GlobalStyles";
import SettingsHeader from "../components/settings/SettingsHeader";
import PastBetsDay from "../components/stats/PastBetsDay";
import { useThemes } from "../hooks/ThemesContext";
import { LinearGradient } from "expo-linear-gradient";
import { useSettings } from "../hooks/SettingsContext";
import { useDayChange } from "../hooks/useDayChange";

const PastBets = ({ navigation }) => {
  const { backgroundGradient, theme } = useThemes();
  const { fetchPastBets, pastBetsArray, fetchingPastBets } = useSettings();
  const { todayDate } = useDayChange();

  // Initial fetch
  useEffect(() => {
    fetchPastBets();
  }, []);

  // Subsequent fetches
  const handleLoadMore = () => {
    fetchPastBets();
  };

  // Loading indicator
  const renderFooter = () => {
    if (fetchingPastBets) {
      return (
        <View style={{ marginTop: 30 }}>
          <ActivityIndicator color={theme.textMedium} />
        </View>
      );
    }
    return null;
  };

  return (
    <LinearGradient colors={backgroundGradient} style={{ flex: 1 }}>
      <SafeAreaView style={style.pageContainer}>
        <SettingsHeader navigation={navigation} header={"Past Bets"} />
        {pastBetsArray.length === 0 && !fetchingPastBets ? (
          <View
            style={{
              height: "75%",
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 20,

            }}
          >
            <Text
              style={{
                textAlign: "center",
                color: theme.textHigh,
                fontSize: 16,
                fontWeight: 500,
              }}
            >
              Previous bets will appear here.
            </Text>
          </View>
        ) : (
          <FlatList
            data={pastBetsArray}
            renderItem={({ item: dayData, index }) => (
              <PastBetsDay dayData={dayData} index={index} />
            )}
            keyExtractor={(item, index) => index.toString()}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
            contentContainerStyle={{
              paddingHorizontal: APP_HORIZONTAL_PADDING,
              paddingBottom: 150,
            }} // Horizontal padding of 16
            showsVerticalScrollIndicator={false}
          />
        )}
      </SafeAreaView>
    </LinearGradient>
  );
};

export default PastBets;

const style = StyleSheet.create({
  pageContainer: {
    display: "flex",
  },
});
