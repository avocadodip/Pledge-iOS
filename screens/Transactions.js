import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  SectionList,
} from "react-native";
import {
  BOTTOM_TAB_HEIGHT,
  Color,
  SETTINGS_HORIZONTAL_PADDING,
  settingsPageStyles,
} from "../GlobalStyles";
import SettingsHeader from "../components/settings/SettingsHeader";
import { db } from "../database/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useSettings } from "../hooks/SettingsContext";
import WeekBundle from "../components/stats/WeekBundle";
import { useThemes } from "../hooks/ThemesContext";
import { LinearGradient } from "expo-linear-gradient";

const formatWeekID = (weekID) => {
  const year = weekID.slice(0, 4);
  const month = weekID.slice(4, 6);
  const dayStart = weekID.slice(6, 8);
  const dayEnd = weekID.slice(9, 11);
  return `${parseInt(month)}/${parseInt(dayStart)}/${year} - ${parseInt(
    month
  )}/${parseInt(dayEnd)}/${year}`;
};

const Transactions = ({ navigation }) => {
  const { theme, backgroundGradient } = useThemes();
  const styles = getStyles(theme);
  const {
    settings: { isPaymentSetup, hasBeenChargedBefore },
    currentUserID,
  } = useSettings();
  const [weeksList, setWeeksList] = useState([]);

  const fetchWeeks = async () => {
    const finesCol = collection(db, "users", currentUserID, "fines");
    const finesSnapshot = await getDocs(finesCol);
    const weeksData = finesSnapshot.docs.map((doc) => ({
      id: formatWeekID(doc.id),
      data: doc.data(),
    }));
    setWeeksList(weeksData);
  };

  useEffect(() => {
    fetchWeeks();
  }, []);

  const tempData = [
    {
      weekDateRange: "Jun 25 - Jul 1",
      totalWeeklyFine: "-$11.00",
      isCharged: "Upcoming",
      index: 0,
      noInputCount: "5",
      noInputFine: "-$5.00",
      isPaymentSetup: true,
      finedTasks: [
        {
          date: "6/25/23",
          title: "Walk the dawg",
          tag: "Walk Milo",
          amount: "-$3.00",
        },
        {
          date: "6/26/23",
          title: "Become a lost cause",
          tag: "",
          amount: "-$3.00",
        },
      ],
    },
    {
      weekDateRange: "Jun 18 - Jun 24",
      totalWeeklyFine: "-$10.00",
      isCharged: "Charged",
      index: 1,
      noInputCount: "5",
      noInputFine: "-$5.00",
      isPaymentSetup: true,
      finedTasks: [
        {
          date: "6/19/23",
          title: "Walk the dawg",
          tag: "Walk Milo",
          amount: "-$3.00",
        },
        {
          date: "6/19/23",
          title: "Mow the lawn",
          tag: "Landscaping",
          amount: "-$2.00",
        },
      ],
    },
    {
      weekDateRange: "Jun 18 - Jun 24",
      totalWeeklyFine: "-$10.00",
      isCharged: "Charged",
      index: 1,
      noInputCount: "5",
      noInputFine: "-$5.00",
      isPaymentSetup: true,
      finedTasks: [
        {
          date: "6/19/23",
          title: "Walk the dawg",
          tag: "Walk Milo",
          amount: "-$3.00",
        },
        {
          date: "6/19/23",
          title: "Mow the lawn",
          tag: "Landscaping",
          amount: "-$2.00",
        },
      ],
    },
    {
      weekDateRange: "Jun 11 - Jun 17",
      totalWeeklyFine: "$0",
      isCharged: "Charged",
      index: 2,
      noInputCount: "5",
      noInputFine: "-$5.00",
      isPaymentSetup: false,
      finedTasks: [],
    },
  ];

  let message = "Today: Jun 30\nNext payment: Jul 1, 11:45 pm";

  const DATA = [
    {
      title: "Upcoming",
      data: [tempData[0]],
    },
    {
      title: "Past Charges",
      data: tempData.slice(1),
    },
  ];

  return (
    <LinearGradient colors={backgroundGradient} style={{ flex: 1 }}>
      <SafeAreaView style={styles.pageContainer}>
        <View style={{ paddingHorizontal: SETTINGS_HORIZONTAL_PADDING }}>
          <SettingsHeader navigation={navigation} header={"Transactions"} />
        </View>

        {/* Show upcoming transaction if user has set up credit card & Show past transactions if user has been charged before */}
        {hasBeenChargedBefore || true ? (
          <SectionList
            sections={DATA}
            keyExtractor={(item, index) => item + index}
            renderItem={({ item, section }) => (
              <View style={styles.bundleContainer}>
                <WeekBundle
                  weekDateRange={item.weekDateRange}
                  totalWeeklyFine={item.totalWeeklyFine}
                  isCharged={item.isCharged}
                  noInputCount={item.noInputCount}
                  noInputFine={item.noInputFine}
                  finedTasks={item.finedTasks}
                  isFirstSection={DATA.indexOf(section) === 0}
                />
              </View>
            )}
            renderSectionHeader={({ section: { title } }) => (
              <Text style={styles.descriptorText}>{title}</Text>
            )}
            contentContainerStyle={{
              paddingHorizontal: SETTINGS_HORIZONTAL_PADDING,
            }}
            style={styles.sectionList}
            renderSectionFooter={() => <View style={{ height: 10 }} />}
          />
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
  });
