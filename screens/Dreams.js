import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { useThemes } from "../hooks/ThemesContext";
import { APP_HORIZONTAL_PADDING, settingsPageStyles } from "../GlobalStyles";
import GearIcon from "../assets/icons/settings-active-icon.svg";
import PlusIcon from "../assets/icons/plus-thick.svg";
import { LinearGradient } from "expo-linear-gradient";
import TouchableRipple from "../components/TouchableRipple";
import { useSettings } from "../hooks/SettingsContext";
import { useDayChange } from "../hooks/useDayChange";
import { formatDateDifference } from "../utils/currentDate";
import AddDreamModal from "../components/dreams/AddDreamModal";
import EditDeleteDreamModal from "../components/dreams/EditDeleteDreamModal";

const Dreams = ({ navigation }) => {
  const { theme } = useThemes();
  const { todayDate } = useDayChange();
  const { dreamsArray } = useSettings();
  const styles = getStyles(theme);
  const [modalVisible, setModalVisible] = useState(false);
  const [editDeleteModalVisible, setEditDeleteModalVisible] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState("");
  const [selectedId, setSelectedId] = useState("");

  const toggleSettingsModal = () => {
    navigation.navigate("SettingsStack");
  };

  return (
    <>
      <SafeAreaView style={settingsPageStyles.pageContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.pageTitle}>Dreams</Text>
          <TouchableHighlight
            style={styles.gearButton}
            onPress={toggleSettingsModal}
            underlayColor="#00000023"
          >
            <GearIcon width={33} height={33} color={theme.textHigh} />
          </TouchableHighlight>
        </View>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* Dreams list */}
          {dreamsArray.map((dream, index) => (
            <LinearGradient
              style={{
                overflow: "hidden",
                marginTop: index > 0 ? 19 : 14,
                borderWidth: 3,
                borderColor: "#ffffff28",

                borderRadius: 30,
                overflow: "hidden",
              }}
              colors={[theme.faintPrimary, theme.faintPrimary]}
              start={{ x: 1, y: 1 }}
              end={{ x: 1, y: 0 }}
            >
              <TouchableRipple
                key={index}
                style={styles.dreamContainer}
                onPress={() => {
                  setEditDeleteModalVisible(true);
                  setSelectedTitle(dream.title);
                  setSelectedId(dream.id);
                }}
              >
                <View style={styles.leftContainer}>
                  {dream.doneCount !== 0 && (
                    <>
                      {formatDateDifference(todayDate, dream.lastCompleted) !==
                        "0d ago" && (
                        <Text style={styles.lastCompletedText}>
                          {formatDateDifference(todayDate, dream.lastCompleted)}
                        </Text>
                      )}
                    </>
                  )}
                  <Text style={styles.dreamTitle}>{dream.title}</Text>
                  <View style={styles.statsContainer}>
                    <Text style={styles.statsText}>{dream.doneCount} done</Text>
                    <Text style={styles.statsText}>
                      ${dream.amountPledged} pledged
                    </Text>
                  </View>
                </View>
                {/* <View style={styles.streakContainer}>
                  {dream.streak !== 0 && (
                    <>
                      <Text style={styles.fireEmoji}>🔥</Text>
                      <Text style={styles.streakText}>{dream.streak}</Text>
                    </>
                  )}
                </View> */}
              </TouchableRipple>
            </LinearGradient>
          ))}

          {/* Add new dream */}
          <LinearGradient
            style={{
              borderRadius: 30,
              overflow: "hidden",
              marginTop: 20,
            }}
            colors={[theme.faintPrimary, theme.faintPrimary]}
            start={{ x: 1, y: 1 }}
            end={{ x: 1, y: 0 }}
          >
            <TouchableRipple
              style={styles.addDreamContainer}
              onPress={() => {
                setModalVisible(true);
              }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 15 }}
              >
                <PlusIcon height={20} width={20} color={theme.textMedium} />
                <Text style={styles.addDreamText}>New dream</Text>
              </View>
            </TouchableRipple>
          </LinearGradient>
        </ScrollView>

        <AddDreamModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
        />
        <EditDeleteDreamModal
          modalVisible={editDeleteModalVisible}
          setModalVisible={setEditDeleteModalVisible}
          title={selectedTitle}
          id={selectedId}
        />
      </SafeAreaView>
    </>
  );
};

export default Dreams;

const getStyles = (theme) =>
  StyleSheet.create({
    scrollView: {
      paddingHorizontal: APP_HORIZONTAL_PADDING,
      paddingBottom: 200,
    },
    headerContainer: {
      paddingTop: 15,
      width: "100%",
      flexDirection: "row",
      justifyContent: "center",
      marginBottom: 13,
    },
    pageTitle: {
      color: theme.textHigh,
      fontSize: 24,
      fontWeight: "700",
    },
    gearButton: {
      position: "absolute",
      right: 20,
      top: 5,
      borderRadius: 50,
      padding: 10,
    },

    dreamContainer: {
      height: 125,
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-between",
      paddingLeft: 20,
      paddingRight: 10,
    },
    leftContainer: {
      flex: 16,
      flexDirection: "column",
      position: "relative",
    },
    lastCompletedText: {
      color: theme.textMedium,
      fontWeight: 500,
      fontSize: 13,
      position: "absolute",
      top: 13,
    },
    dreamTitle: {
      color: theme.textHigh,
      fontSize: 19,
      fontWeight: "bold",
      position: "absolute",
      top: "28%",
      lineHeight: 26,
    },
    statsContainer: {
      flexDirection: "row",
      gap: 20,
      position: "absolute",
      bottom: 13,
    },
    statsText: {
      color: theme.textMedium,
      fontSize: 13,
      fontWeight: "600",
    },

    streakContainer: {
      flex: 4,
      flexDirection: "col",
      alignItems: "center",
      justifyContent: "center",
    },
    fireEmoji: {
      fontSize: 40,
    },
    streakText: {
      color: "white",
      fontWeight: 700,
      fontSize: 15,
    },

    addDreamContainer: {
      height: 125,
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 30,
    },
    addDreamText: {
      color: theme.textMedium,
      fontWeight: 700,
      fontSize: 18,
    },
  });
