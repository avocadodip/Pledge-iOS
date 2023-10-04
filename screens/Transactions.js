import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  SectionList,
  ActivityIndicator,
} from "react-native";
import { APP_HORIZONTAL_PADDING, BOTTOM_TAB_HEIGHT } from "../GlobalStyles";
import SettingsHeader from "../components/settings/SettingsHeader";
import { useSettings } from "../hooks/SettingsContext";
import WeekBundle from "../components/stats/WeekBundle";
import { useThemes } from "../hooks/ThemesContext";
import { LinearGradient } from "expo-linear-gradient";

const Transactions = ({ navigation }) => {
  const { theme, backgroundGradient } = useThemes();
  const {
    transactionsArray,
    fetchTransactions,
    fetchingTransactions,
    settings: { hasBeenChargedBefore },
  } = useSettings();
  const styles = getStyles(theme);

  useEffect(() => {
    fetchTransactions();
  }, []);

  let message = "Today: Jun 30\nNext payment: Jul 1, 11:45 pm";
  return (
    <LinearGradient colors={backgroundGradient} style={{ flex: 1 }}>
      <SafeAreaView style={styles.pageContainer}>
        <SettingsHeader navigation={navigation} header={"Transactions"} />
        {hasBeenChargedBefore || true ? (
          fetchingTransactions ? (
            <View style={{ marginTop: 30 }}>
              <ActivityIndicator color={theme.textMedium} style={{ flex: 1 }} />
            </View>
          ) : transactionsArray ? (
            transactionsArray.length > 0 ? (
              <SectionList
                sections={transactionsArray}
                keyExtractor={(item, index) => item + index}
                renderItem={({ item, section }) => (
                  <View style={styles.bundleContainer}>
                    <WeekBundle
                      transactionsData={item}
                      isFirstSection={transactionsArray.indexOf(section) === 0}
                    />
                  </View>
                )}
                renderSectionHeader={({ section: { title } }) => (
                  <Text style={styles.descriptorText}>{title}</Text>
                )}
                contentContainerStyle={{
                  paddingHorizontal: APP_HORIZONTAL_PADDING,
                  paddingTop: 7,
                }}
                style={styles.sectionList}
                renderSectionFooter={() => <View style={{ height: 10 }} />}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <View style={styles.textBox}>
                <Text style={styles.infoText}>
                  Weekly charges will appear here.{"\n\n"}
                  When a credit card is set up, a charge will occur on
                  Saturday at 11:45pm.
                </Text>
              </View>
            )
          ) : (
            <View>
              <Text>Attach credit card</Text>
            </View>
          )
        ) : (
          <View>
            <Text>Attach credit card</Text>
          </View>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
};

export default Transactions;

const getStyles = (theme) =>
  StyleSheet.create({
    pageContainer: {
      display: "flex",
      marginBottom: BOTTOM_TAB_HEIGHT + 90,
    },
    sectionList: {
      width: "100%",
      height: "100%",
    },
    bundleContainer: {
      marginBottom: 10,
    },
    descriptorText: {
      width: "100%",
      color: theme.textMedium,
      fontSize: 14,
      textAlign: "left",
      marginLeft: 16,
      marginBottom: 8,
    },

    textBox: {
      height: "90%",
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 20,
    },
    infoText: {
      textAlign: "center",
      color: theme.textHigh,
      fontSize: 16,
      fontWeight: 500,
    },
  });
