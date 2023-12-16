import {
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Text,
  View,
  Alert,
  StatusBar,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  APP_HORIZONTAL_PADDING,
  BOTTOM_TAB_HEIGHT,
  SETTINGS_HORIZONTAL_PADDING,
  settingsPageStyles,
} from "../GlobalStyles";
import RightChevronIcon from "../assets/icons/chevron-right.svg";
import HistoryIcon from "../assets/icons/history-icon.svg";
import CreditCardIcon from "../assets/icons/credit-card.svg";
import SunThemeIcon from "../assets/icons/sun-theme-icon.svg";
import GlobeIcon from "../assets/icons/globe-icon.svg";
import PlaneIcon from "../assets/icons/vacation-plane-icon.svg";
import DaysActiveIcon from "../assets/icons/days-active-icon.svg";
import TouchableRipple from "../components/TouchableRipple";
import React, { useEffect, useState, useRef } from "react";
import { auth, db } from "../database/firebase";
import ThemeToggle from "../components/settings/ThemeToggle";
import DaysActiveModal from "../components/settings/DaysActiveModal";
import NotificationsModal from "../components/settings/NotificationsModal";
import MissedTaskFineModal from "../components/settings/MissedTaskFineModal";
import { useSettings } from "../hooks/SettingsContext";
import { useThemes } from "../hooks/ThemesContext";
import VacationToggle from "../components/settings/VacationToggle";
import {
  fetchPaymentMethods,
  initializePaymentSheet,
} from "../utils/stripePaymentSheet";
import { presentPaymentSheet } from "@stripe/stripe-react-native";
import ContentLoader, { Rect, Circle, Path } from "react-content-loader/native";
import PlusIcon from "../assets/icons/plus-icon.svg";
import MailIcon from "../assets/icons/mail-alt.svg";
import MoneyIcon from "../assets/icons/money-icon.svg";
import LogoutIcon from "../assets/icons/logout.svg";
import NotificationBellIcon from "../assets/icons/notification-bell-icon.svg";
import { daysOfWeek } from "../utils/currentDate";
import DeleteAccountButton from "../components/settings/DeleteAccountButton";
import TaskFineIcon from "../assets/icons/missed-task-fine-icon.svg";
import PigIcon from "../assets/icons/pig-icon.svg";
import LockDollarIcon from "../assets/icons/lock-dollar.svg";
import { getClassicColor } from "../themes";
import { useCheckNotificationPerms } from "../hooks/useAppStateChange";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import XMarkIcon from "../assets/icons/x-mark.svg";
import { doc, updateDoc } from "firebase/firestore";

const BUTTON_HEIGHT = 51;
const BUTTON_TEXTS = ["S", "M", "T", "W", "T", "F", "S"];

const Settings = () => {
  const navigation = useNavigation();

  const { currentUserEmail } = useSettings();
  const {
    theme,
    currentClassicColor,
    currentThemeName,
    backgroundGradient,
    saveTheme,
  } = useThemes();
  const styles = getStyles(theme);
  const {
    settings: {
      daysActive,
      timezone,
      stripeCustomerId,
      isPaymentSetup,
      last4Digits,
      notificationsEnabled,
      notificationTimes,
      missedTaskFine,
    },
    currentUserID,
  } = useSettings();
  const notificationPerms = useCheckNotificationPerms(currentUserID);
  const [loading, setLoading] = useState(false);
  const [isPaymentInitialized, setIsPaymentInitialized] = useState(false);
  const [daysActiveModalVisible, setDaysActiveModalVisible] = useState(false);
  const [notifsModalVisible, setNotifsModalVisible] = useState(false);
  const [missedTaskFineModalVisible, setMissedTaskFineModalVisible] =
    useState(false);

  useEffect(() => {
    loadPaymentSheet();
  }, [currentThemeName, currentClassicColor]);

  const handleOpenDaysActiveModal = (action) => {
    if (action == true) {
      setDaysActiveModalVisible(true);
    } else setDaysActiveModalVisible(false);
  };

  const handleLogout = async () => {
    try {
      navigation.navigate("Dreams");
      await auth.signOut();
    } catch (error) {
      console.error("Sign out error", error);
    }
  };

  const handleOpenNotifsModal = (action) => {
    if (action == true) {
      setNotifsModalVisible(true);
    } else setNotifsModalVisible(false);
  };
  const handleOpenMissedTaskFineModal = (action) => {
    if (action == true) {
      setMissedTaskFineModalVisible(true);
    } else setMissedTaskFineModalVisible(false);
  };

  const loadPaymentSheet = async () => {
    try {
      await initializePaymentSheet(stripeCustomerId, currentUserID, theme);
    } catch (error) {
      console.log("boo!");
      console.error(error);
    }
    setLoading(false);
  };

  const MAX_RETRIES = 2; // maximum number of retries
  // Opens payment sheet
  const openPaymentSheet = async (retryCount = 0) => {
    if (retryCount >= MAX_RETRIES) {
      // Alert.alert('Max retries reached.');
      return;
    }

    setTimeout(() => {}, 300);

    const { error } = await presentPaymentSheet();

    console.log(error);

    if (!error) {
      setLoading(true);
      loadPaymentSheet();
    } else {
      if (error.code !== "Canceled") {
        if (error.code === "Failed") {
          setLoading(true);
          loadPaymentSheet();
          openPaymentSheet(retryCount + 1);
        }
        // Alert.alert(`Error code: ${error.code}`, error.message);
      }
    }
  };

  useEffect(() => {
    setLoading(true);
    loadPaymentSheet();
  }, []);

  // Set state when isPaymentSetup is fetched
  useEffect(() => {
    if (isPaymentSetup !== undefined) {
      setIsPaymentInitialized(isPaymentSetup);
    }
  }, [isPaymentSetup]);

  const handleCloseModal = () => {
    navigation.navigate("Dreams");
  };

  return (
    <LinearGradient colors={backgroundGradient} style={{ flex: 1 }}>
      <View style={styles.pageContainer}>
        {/* <OnboardingPopup
        texts={['Are you sure you want to logout?', 'You will be fined for unentered tasks each day.']}
        buttonTitle="Back to settings."
        secondButtonTitle="Log me out."
      /> */}
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>
        <View style={styles.closeButtonContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleCloseModal}
          >
            <XMarkIcon width={20} height={20} color={theme.primary} />
          </TouchableOpacity>
        </View>

        <View>
          <View style={styles.sectionContainer}>
            {loading ? (
              <ContentLoader
                speed={0.6}
                height={BUTTON_HEIGHT}
                backgroundColor={
                  currentThemeName === "Classic"
                    ? getClassicColor(
                        currentClassicColor,
                        "ContentLoaderBackgroundColor"
                      )
                    : getClassicColor(
                        currentThemeName,
                        "ContentLoaderBackgroundColor"
                      )
                }
                foregroundColor={
                  currentThemeName === "Classic"
                    ? getClassicColor(
                        currentClassicColor,
                        "ContentLoaderForegroundColor"
                      )
                    : getClassicColor(
                        currentThemeName,
                        "ContentLoaderForegroundColor"
                      )
                }
              >
                <Rect width="100%" height="100%" />
              </ContentLoader>
            ) : (
              <>
                <TouchableRipple
                  style={styles.button}
                  onPress={openPaymentSheet}
                >
                  <View style={styles.leftSettingsButton}>
                    <CreditCardIcon
                      width={24}
                      height={24}
                      color={theme.textHigh}
                    />

                    {isPaymentInitialized ? (
                      <Text style={styles.buttonTitle}>Payment Method</Text>
                    ) : (
                      <Text style={styles.buttonTitle}>
                        Add a payment method
                      </Text>
                    )}
                  </View>
                  <View style={styles.chevronContainer}>
                    {isPaymentInitialized ? (
                      <Text style={styles.rightSideText}>{last4Digits}</Text>
                    ) : (
                      <PlusIcon width={27} height={27} color={theme.textHigh} />
                    )}
                  </View>
                </TouchableRipple>
              </>
            )}
          </View>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>App</Text>
          </View>
          <View style={styles.sectionContainer}></View>

          <View style={styles.sectionContainer}>
            {/* MISSED FINE */}
            <TouchableRipple
              style={styles.button}
              onPress={() => handleOpenMissedTaskFineModal(true)}
            >
              <View style={styles.leftSettingsButton}>
                <LockDollarIcon width={26} height={26} color={theme.textHigh} />

                <Text style={styles.buttonTitle}>Non-Input Fine</Text>
              </View>
              {missedTaskFine === 0 ? (
                <Text
                  style={[styles.rightSideText, { color: theme.textDisabled }]}
                >
                  Off
                </Text>
              ) : (
                <Text style={styles.rightSideText}>${missedTaskFine}</Text>
              )}
            </TouchableRipple>
            <MissedTaskFineModal
              currentUserID={currentUserID}
              isVisible={missedTaskFineModalVisible}
              handleToggleModal={handleOpenMissedTaskFineModal}
              missedTaskFine={missedTaskFine}
              isPaymentSetup={isPaymentSetup}
            />
            {/* NOTIFICATIONS */}
            <TouchableRipple
              style={styles.button}
              onPress={() => handleOpenNotifsModal(true)}
            >
              <View style={styles.leftSettingsButton}>
                <NotificationBellIcon
                  width={24}
                  height={24}
                  color={theme.textHigh}
                />
                <Text style={styles.buttonTitle}>Notifications</Text>
              </View>
              <View style={styles.chevronContainer}>
                <View style={styles.daysOfWeekTextContainer}>
                  {notificationsEnabled && notificationPerms ? (
                    <Text style={styles.rightSideText}>On</Text>
                  ) : (
                    <Text
                      style={[
                        styles.rightSideText,
                        { color: theme.textDisabled },
                      ]}
                    >
                      Off
                    </Text>
                  )}
                </View>
              </View>
            </TouchableRipple>
            <NotificationsModal
              currentUserID={currentUserID}
              daysActive={daysActive}
              isVisible={notifsModalVisible}
              handleToggleModal={handleOpenNotifsModal}
              notificationsEnabled={notificationsEnabled}
              notificationTimes={notificationTimes}
              notificationPerms={notificationPerms}
            />
            {/* DAYS ACTIVE */}
            <TouchableRipple
              style={styles.button}
              onPress={() => handleOpenDaysActiveModal(true)}
            >
              <View style={styles.leftSettingsButton}>
                <DaysActiveIcon width={25} height={25} color={theme.textHigh} />
                <Text style={styles.buttonTitle}>Days Active</Text>
              </View>

              <View style={styles.chevronContainer}>
                <View style={styles.daysOfWeekTextContainer}>
                  {Object.values(daysActive).every(Boolean) ? (
                    <Text
                      style={{
                        fontSize: 15,
                        color: theme.textHigh,
                        fontWeight: 500,
                      }}
                    >
                      All
                    </Text>
                  ) : (
                    daysOfWeek.map((dayKey, index) => (
                      <Text
                        style={{
                          fontSize: 15,
                          color: daysActive[dayKey]
                            ? theme.textHigh
                            : theme.textDisabled,
                          fontWeight: daysActive[dayKey] ? 500 : 400,
                          opacity: 0.8,
                        }}
                        key={index}
                      >
                        {BUTTON_TEXTS[index]}
                      </Text>
                    ))
                  )}
                </View>
              </View>
            </TouchableRipple>
            <DaysActiveModal
              isVisible={daysActiveModalVisible}
              handleToggleModal={handleOpenDaysActiveModal}
            />
            {/* VACATION */}
            <View style={styles.button}>
              <View style={styles.leftSettingsButton}>
                <PlaneIcon width={25} height={25} color={theme.textHigh} />
                <Text style={styles.buttonTitle}>Vacation Mode</Text>
              </View>
              <View style={styles.chevronContainer}>
                <VacationToggle />
              </View>
            </View>
            {/* THEME */}
            <TouchableRipple
              style={styles.button}
              onPress={() => {
                if (currentThemeName === "Dark") {
                  saveTheme("Classic");
                } else {
                  saveTheme("Dark");
                }
              }}
            >
              <View style={styles.leftSettingsButton}>
                <SunThemeIcon width={25} height={25} color={theme.textHigh} />
                <Text style={styles.buttonTitle}>Theme</Text>
              </View>
              {/* <View style={styles.rightSettingsButton}>
                <ThemeToggle />
              </View> */}
              <Text style={styles.rightSideText}>{currentThemeName}</Text>
            </TouchableRipple>
            {/* TIMEZONE */}
            {/* <View style={styles.button}>
              <View style={styles.leftSettingsButton}>
                <GlobeIcon width={25} height={25} color={theme.textHigh} />
                <Text style={styles.buttonTitle}>Time Zone</Text>
              </View>
              <Text style={styles.rightSideText}>{timezone}</Text>
            </View> */}
          </View>
        </View>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeaderText}>Account</Text>
        </View>
        <View style={styles.sectionContainer}>
          <TouchableRipple
            style={styles.button}
            onPress={() => navigation.navigate("PastBets")}
          >
            <View style={styles.leftSettingsButton}>
              <HistoryIcon width={24} height={24} color={theme.textHigh} />
              <Text style={styles.buttonTitle}>Past Bets</Text>
            </View>
            <View style={styles.chevronContainer}>
              <RightChevronIcon width={24} height={24} color={theme.textHigh} />
            </View>
          </TouchableRipple>
          <TouchableRipple
            style={styles.button}
            onPress={() => navigation.navigate("Transactions")}
          >
            <View style={styles.leftSettingsButton}>
              <PigIcon width={26} height={26} color={theme.textHigh} />
              <Text style={styles.buttonTitle}>Charges</Text>
            </View>
            <View style={styles.chevronContainer}>
              <RightChevronIcon width={24} height={24} color={theme.textHigh} />
            </View>
          </TouchableRipple>
          {/* <TouchableRipple
            style={styles.button}
            onPress={() => navigation.navigate("ChangeEmail")}
          >
            <View style={styles.leftSettingsButton}>
              <MailIcon width={25} height={25} color={theme.textHigh} />
              <Text style={styles.buttonTitle}>Email</Text>
            </View>
            <View style={{ width: 160 }}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{ ...styles.rightSideText, textAlign: "right" }}
              >
                {currentUserEmail}
              </Text>
            </View>
          </TouchableRipple> */}

          <TouchableRipple style={styles.button} onPress={handleLogout}>
            <View style={styles.leftSettingsButton}>
              <LogoutIcon width={25} height={25} color={theme.textHigh} />
              <Text style={styles.buttonTitle}>Logout</Text>
            </View>
          </TouchableRipple>
        </View>
        <DeleteAccountButton
          currentUserID={currentUserID}
          navigation={navigation}
        />
        <View style={{ height: 60 }}></View>
      </View>
    </LinearGradient>
  );
};

export default Settings;

const getStyles = (theme) =>
  StyleSheet.create({
    pageContainer: {
      paddingHorizontal: APP_HORIZONTAL_PADDING,
      paddingTop: 20,
    },
    headerContainer: {
      width: "100%",
      flexDirection: "column",
      marginBottom: 30,
      alignItems: "center",
    },
    headerTitle: {
      color: theme.textHigh,
      fontSize: 20,
      fontWeight: "600",
    },
    sectionContainer: {
      backgroundColor: theme.faintPrimary,
      borderRadius: 16,
      width: "100%",
      overflow: "hidden",
    },
    sectionHeader: {
      width: "100%",
      marginTop: 16,
      marginBottom: 10,
    },
    sectionHeaderText: {
      color: theme.textMedium,
      opacity: 0.8,
      fontSize: 14,
      textAlign: "left",
      marginLeft: 16,
    },
    chevronContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
    },
    button: {
      paddingLeft: 16,
      paddingRight: 15,
      height: BUTTON_HEIGHT,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    leftSettingsButton: {
      flexDirection: "row",
      alignItems: "center",
    },
    buttonTitle: {
      color: theme.textHigh,
      fontSize: 15,
      marginLeft: 16,
      fontWeight: 500,
    },
    daysOfWeekTextContainer: {
      flexDirection: "row",
      gap: 4,
    },
    rightSideText: {
      fontSize: 15,
      color: theme.textHigh,
    },

    // Close button styles
    closeButtonContainer: {
      position: "absolute",
      top: 17,
      right: 20,
    },
    closeButton: {
      borderRadius: 20,
      backgroundColor: "#ffffff2a",
      flex: 1,
      width: "100%",
      borderRadius: 20,
      padding: 6,
    },
  });
