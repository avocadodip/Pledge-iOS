import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Color } from "../GlobalStyles";
import RightChevronIcon from "../assets/icons/right-chevron.svg";
import UserCircleIcon from "../assets/icons/user-profile-circle.svg";
import LibraryIcon from "../assets/icons/library-outline.svg";
import CreditCardIcon from "../assets/icons/credit-card.svg";
import LogoutIcon from "../assets/icons/logout.svg";
import OnboardingPopup from "../components/OnboardingPopup";

import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { auth } from "../database/firebase";

const Settings = ({ navigation }) => {
  const handlePress = (screenName) => {
    navigation.navigate(screenName);
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Sign out error", error);
    }
  }

  return (
    <SafeAreaView style={styles.pageContainer}>
      <OnboardingPopup
        texts={['Are you sure you want to logout?', 'You will be fined for unentered tasks each day.']}
        buttonTitle="Back to settings."
        secondButtonTitle="Log me out."
      />
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>
      <View style={styles.settingsButtonContainer}>
        <TouchableOpacity 
						style={styles.settingsButton}
						onPress={() => handlePress("Account")}
				>
          <View style={styles.leftSettingsButton}>
            <UserCircleIcon
              width={24}
              height={24}
              color={Color.white}
            />
            <Text style={styles.buttonTitle}> Account </Text> 
          </View>
          <RightChevronIcon
              width={24}
              height={24}
              color={Color.white}
            />
        </TouchableOpacity>
      </View>
      <View style={styles.settingsButtonContainer}>
	      <TouchableOpacity 
					style={styles.settingsButton}
					onPress={() => handlePress("Stats")}
				>
          <View style={styles.leftSettingsButton}>
            <LibraryIcon
              width={24}
              height={24}
              color={Color.white}
            />
            <Text style={styles.buttonTitle}> Stats </Text> 
          </View>
          <RightChevronIcon
              width={24}
              height={24}
              color={Color.white}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.settingsButtonContainer}>
	      <TouchableOpacity 
						style={styles.settingsButton}
						onPress={() => handlePress("Billing")}
				>
          <View style={styles.leftSettingsButton}>
            <CreditCardIcon
              width={24}
              height={24}
              color={Color.white}
            />
            <Text style={styles.buttonTitle}> Billing </Text> 
          </View>
          <RightChevronIcon
              width={24}
              height={24}
              color={Color.white}
            />
        </TouchableOpacity>
      </View>
      <View style={styles.settingsButtonContainer}>
	      <TouchableOpacity 
						style={styles.settingsButton}
						onPress={handleLogout}
				>
          <View style={styles.leftSettingsButton}>
            <LogoutIcon
              width={24}
              height={24}
              color={Color.white}
            />
            <Text style={styles.buttonTitle}>Logout</Text> 
          </View>
          <RightChevronIcon
              width={24}
              height={24}
              color={Color.white}
            />
        </TouchableOpacity>
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
    // borderWidth: 1,
    // borderColor: 'black',
  },
  settingsButtonContainer: {
    width: "100%",
    borderTopWidth: 1,
    borderColor: Color.border_white,
    marginBottom: 20,
  },
  settingsButton: {
    paddingHorizontal: 20,
    paddingTop: 20,
    flexDirection: "row",
    justifyContent: 'space-between',
  },
  leftSettingsButton: {
    flexDirection: "row",
  },
  headerTitle: {
    color: Color.white,
    fontSize: 30,
    fontWeight: "bold",
  },
  buttonTitle: {
    color: Color.white,
    fontSize: 20,
    marginLeft: 24,
  },
});