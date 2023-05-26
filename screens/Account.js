import React, { useContext, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { Color } from "../GlobalStyles";
import { SafeAreaView } from "react-native-safe-area-context";
import LeftArrowIcon from "../assets/icons/arrow-left.svg";
import { TouchableOpacity } from "react-native-gesture-handler";
import ToggleButtons from "../components/ToggleButtons";
import DaysActiveToggle from "../components/DaysActiveToggle";
import TimeButton from "../components/TimeButton";
import OnboardingPopup from "../components/OnboardingPopup";
import { ThemeContext } from "../ThemeContext";
import { classicTheme, darkTheme, lightTheme } from "../Themes";

const Account = ({ navigation }) => {
  const handlePress = (screenName) => {
    navigation.navigate(screenName);
  };

  const { chosenTheme, setChosenTheme } = useContext(ThemeContext);

  const handleThemeButtonPress = (index) => {
    switch (index) {
      case 0:
        setChosenTheme(classicTheme);
        break;
      case 1:
        setChosenTheme(lightTheme);
        break;
      case 2:
        setChosenTheme(darkTheme);
        break;
      default:
        break;
    }
  };

  const getStyles = () => {
    return StyleSheet.create({
      pageContainer: {
        flex: 1,
        alignItems: "center",
        paddingHorizontal: 20,
        backgroundColor: chosenTheme.accent,
      },
      headerContainer: {
        paddingTop: 20,
        paddingLeft: 20,
        width: "100%",
        flexDirection: "row",
        marginBottom: 20,
      },
      headerTitle: {
        color: chosenTheme.primary,
        fontSize: 20,
        marginLeft: 24,
      },
      preferenceContainer: {
        paddingLeft: 10,
        paddingTop: 20,
        width: "100%",
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      preferenceRightContainer: {
        width: 250,
        flexDirection: "row",
      },
      preferenceTitle: {
        color: chosenTheme.primary,
        fontSize: 16,
      },
      preferenceInput: {
        color: chosenTheme.primary,
        fontSize: 16,
        borderWidth: 1,
        width: 250,
        borderColor: chosenTheme.primary,
        padding: 10,
        borderRadius: 10,
      },
    });
  };
  
  const styles = getStyles();  

  return (
    <SafeAreaView style={styles.pageContainer}>
      {/* <OnboardingPopup
        texts={['Are you sure you want to delete your account?', 'Progress takes time and failure is a vital part of the process!','If you are struggling to complete tasks, try setting smaller tasks each day. It will pay off over time!']}
        buttonTitle="Let's give this one more go!"
        secondButtonTitle="Yes, delete my account."
      /> */}
      <View style={styles.headerContainer}>
        <TouchableOpacity	onPress={() => handlePress("SettingsScreen")}>
          <LeftArrowIcon
            width={24}
              height={24}
              // color={Color.white}
              color={chosenTheme.primary}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Account</Text>
      </View>
      <View style={styles.preferenceContainer}>
        <Text style={styles.preferenceTitle}> Name </Text>
        <TextInput style={styles.preferenceInput} placeholder="First Last" placeholderTextColor={Color.faint_white} autoCorrect={false} autoCapitalize="none"></TextInput>
      </View>
      <View style={styles.preferenceContainer}>
        <Text style={styles.preferenceTitle}> Email </Text>
        <TextInput style={styles.preferenceInput} placeholder="email@domain.com" placeholderTextColor={Color.faint_white} autoCorrect={false} autoCapitalize="none"></TextInput>
      </View>
      <View style={styles.preferenceContainer}>
        <Text style={styles.preferenceTitle}> Time Zone </Text>
        <TextInput style={styles.preferenceInput} placeholder="America/Chicago" placeholderTextColor={Color.faint_white} autoCorrect={false} autoCapitalize="none"></TextInput>
      </View>
      <View style={styles.preferenceContainer}>
        <Text style={styles.preferenceTitle}> Day Start </Text>
        <View style={styles.preferenceRightContainer}>
        <TimeButton defaultTime="9:00 AM" />
        </View>
      </View>
      <View style={styles.preferenceContainer}>
        <Text style={styles.preferenceTitle}> Day End </Text>
        <View style={styles.preferenceRightContainer}>
        <TimeButton defaultTime="11:00 PM" />
        </View>
      </View>
      <View style={styles.preferenceContainer}>
        <Text style={styles.preferenceTitle}> Days Active </Text>
        <View style={styles.preferenceRightContainer}>
          <DaysActiveToggle
            buttonCount={2}
            buttonTexts={['S', 'M', 'T', 'W', 'T','F','S']}
          />
        </View>
      </View>
      <View style={styles.preferenceContainer}>
        <Text style={styles.preferenceTitle}> Vacation </Text>
        <View style={styles.preferenceRightContainer}>
          <ToggleButtons
            buttonCount={2}
            buttonTexts={['On', 'Off']}
          />
        </View>
      </View>
      <View style={styles.preferenceContainer}>
        <Text style={styles.preferenceTitle}> Theme </Text>
        <View style={styles.preferenceRightContainer}>     
          <ToggleButtons
            buttonCount={3}
            buttonTexts={['Classic', 'Light', 'Dark']}
            onButtonPress={handleThemeButtonPress}
          />
        </View>   
      </View>
      <View style={styles.preferenceContainer}>
        <TouchableOpacity> 
        <Text style={[styles.preferenceTitle, {textDecorationLine:'underline'}]}>Delete account.</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default Account