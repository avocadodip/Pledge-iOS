import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Color } from "../GlobalStyles";
import RightChevronIcon from "../assets/icons/right-chevron.svg";
import UserCircleIcon from "../assets/icons/user-profile-circle.svg";
import HistoryIcon from "../assets/icons/history-icon.svg";
import CreditCardIcon from "../assets/icons/credit-card.svg";
import LogoutIcon from "../assets/icons/logout.svg";
import SunThemeIcon from "../assets/icons/sun-theme-icon.svg";
import GlobeIcon from "../assets/icons/globe-icon.svg";
import PlaneIcon from "../assets/icons/vacation-plane-icon.svg";
import DaysActiveIcon from "../assets/icons/days-active-icon.svg";

import OnboardingPopup from "../components/OnboardingPopup";
import TouchableRipple from "../components/TouchableRipple";
import React, { useState } from "react";
import { auth } from "../database/firebase";
import ThemeToggle from "../components/ThemeToggle";
import DaysActiveModal from "../components/DaysActiveModal";

import { useSettings } from "../hooks/SettingsContext";
import VacationToggle from "../components/VacationToggle";

const Settings = ({ navigation }) => {
  const {
    settings: { daysActive, vacationModeOn, timezone },
    currentUserID,
  } = useSettings();

  const [daysActiveModalVisible, setDaysActiveModalVisible] = useState(false);
  const buttonTexts = ["S", "M", "T", "W", "T", "F", "S"];
  const dayKeys = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const handleOpenDaysActiveModal = (action) => {
    if (action == true) {
      setDaysActiveModalVisible(true);
    } else setDaysActiveModalVisible(false);
  };

  const handlePress = (screenName) => {
    navigation.navigate(screenName);
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Sign out error", error);
    }
  };

  return (
    <SafeAreaView style={styles.pageContainer}>
      {/* <OnboardingPopup
        texts={['Are you sure you want to logout?', 'You will be fined for unentered tasks each day.']}
        buttonTitle="Back to settings."
        secondButtonTitle="Log me out."
      /> */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <View style={styles.mainContainer}>
        <View style={styles.sectionContainer}>
          <TouchableRipple
            style={styles.button}
            onPress={() => handlePress("Billing")}
          >
            <View style={styles.leftSettingsButton}>
              <CreditCardIcon width={24} height={24} color={Color.white} />
              <Text style={styles.buttonTitle}>Link Payment Method</Text>
            </View>
            <View style={styles.chevronContainer}>
              <RightChevronIcon width={24} height={24} color={Color.white} />
            </View>
          </TouchableRipple>
        </View>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeaderText}>App</Text>
        </View>
        <View style={styles.sectionContainer}></View>

        <View style={styles.sectionContainer}>
          <TouchableRipple
            style={styles.button}
            onPress={() => handlePress("Stats")}
          >
            <View style={styles.leftSettingsButton}>
              <HistoryIcon width={24} height={24} color={Color.white} />
              <Text style={styles.buttonTitle}>Past Bets</Text>
            </View>
            <View style={styles.chevronContainer}>
              <RightChevronIcon width={24} height={24} color={Color.white} />
            </View>
          </TouchableRipple>
          {/* DAYS ACTIVE */}
          <TouchableRipple
            style={styles.button}
            onPress={() => handleOpenDaysActiveModal(true)}
          >
            <View style={styles.leftSettingsButton}>
              <DaysActiveIcon width={25} height={25} color={Color.white} />
              <Text style={styles.buttonTitle}>Days Active</Text>
            </View>

            <View style={styles.chevronContainer}>
              <View style={styles.daysOfWeekTextContainer}>
                {dayKeys.map((dayKey, index) => (
                  <Text
                    style={{
                      fontSize: 16,
                      color: daysActive[dayKey]
                        ? "rgba(255, 255, 255, 1)"
                        : "rgba(255, 255, 255, 0.5)",
                      fontWeight: daysActive[dayKey]
                        ? 500
                        : 400,
                      opacity: 0.8,
                    }}
                    key={index}
                  >
                    {buttonTexts[index]}
                  </Text>
                ))}
              </View>
              <RightChevronIcon width={24} height={24} color={Color.white} />
            </View>
          </TouchableRipple>
          <DaysActiveModal
            currentUserID={currentUserID}
            daysActive={daysActive}
            isVisible={daysActiveModalVisible}
            handleToggleModal={handleOpenDaysActiveModal}
          />
          {/* VACATION */}
          <View style={styles.button}>
            <View style={styles.leftSettingsButton}>
              <PlaneIcon width={25} height={25} color={Color.white} />
              <Text style={styles.buttonTitle}>Vacation Mode</Text>
            </View>
            <View style={styles.chevronContainer}>
              <VacationToggle
                vacationModeOn={vacationModeOn}
                currentUserID={currentUserID}
              />
            </View>
          </View>
          {/* THEME */}
          <View style={styles.button}>
            <View style={styles.leftSettingsButton}>
              <SunThemeIcon width={25} height={25} color={Color.white} />
              <Text style={styles.buttonTitle}>Theme</Text>
            </View>
            <View style={styles.rightSettingsButton}>
              <ThemeToggle />
            </View>
          </View>
          {/* TIMEZONE */}
          <View style={styles.button}>
            <View style={styles.leftSettingsButton}>
              <GlobeIcon width={25} height={25} color={Color.white} />
              <Text style={styles.buttonTitle}>Time Zone</Text>
            </View>
            <Text style={styles.rightSideText}>{timezone}</Text>
          </View>
        </View>
      </View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderText}>Account</Text>
      </View>
      <View style={styles.sectionContainer}>
        {/* LOGOUT */}
        <TouchableRipple
          style={styles.button}
          onPress={() => handlePress("Account")}
        >
          <View style={styles.leftSettingsButton}>
            <UserCircleIcon width={24} height={24} color={Color.white} />
            <Text style={styles.buttonTitle}>Account</Text>
          </View>
          <View style={styles.chevronContainer}>
            <RightChevronIcon width={24} height={24} color={Color.white} />
          </View>
        </TouchableRipple>
        <TouchableRipple style={styles.button} onPress={handleLogout}>
          <View style={styles.leftSettingsButton}>
            <LogoutIcon width={24} height={24} color={Color.white} />
            <Text style={styles.buttonTitle}>Log Out</Text>
          </View>
        </TouchableRipple> 
        {/* DELETE ACCOUNT */}
        {/* <TouchableRipple style={styles.button} onPress={handleLogout}>
          <View style={styles.leftSettingsButton}>
            <TrashBinIcon width={24} height={24} color={Color.white} />
            <Text style={styles.buttonTitle}>Delete Account</Text>
          </View>
        </TouchableRipple> */}
      </View>
    </SafeAreaView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 20,
    // borderWidth: 1,
    // borderColor: 'black',
  },
  headerContainer: {
    paddingTop: 20,
    paddingLeft: 20,
    width: "100%",
    flexDirection: "col",
    marginBottom: 20,
  },
  headerTitle: {
    color: Color.white,
    fontSize: 30,
    fontWeight: "bold",
  },
  mainContainer: {
    width: "100%",
  },
  sectionContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    borderRadius: 16,
    width: "100%",
    overflow: "hidden",
  },
  sectionHeader: {
    width: "100%",
    marginTop: 30,
    marginBottom: 10,
  },
  sectionHeaderText: {
    color: Color.white,
    opacity: 0.8,
    fontSize: 16,
    textAlign: "left", // this line aligns text to the left
    marginLeft: 23,
  },
  chevronContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 7,
    gap: 16
  },
  button: {
    paddingLeft: 21,
    paddingRight: 15,
    height: 60,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftSettingsButton: {
    flexDirection: "row",
    alignItems: "center",
  },

  buttonTitle: {
    color: Color.white,
    fontSize: 17,
    marginLeft: 21,
    fontWeight: 500,
  },
  daysOfWeekTextContainer: {
    flexDirection: "row",
    gap: 4
  },
  rightSideText: {
    fontSize: 15,
    color: Color.white,
    opacity: 0.8,
    marginRight: 12,
  },
});
