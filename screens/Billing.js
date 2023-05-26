import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity} from 'react-native'
import { Color } from "../GlobalStyles";
import LeftArrowIcon from "../assets/icons/arrow-left.svg";

import { ThemeContext } from "../ThemeContext";
import { classicTheme, darkTheme, lightTheme } from "../Themes";
import React, { useContext, useState } from "react";

const Billing = ({navigation}) => {
  const { chosenTheme, setChosenTheme } = useContext(ThemeContext);

  const getStyles = () => {
    return StyleSheet.create({
      pageContainer: {
        flex: 1,
        alignItems: "center",
        backgroundColor: chosenTheme.accent,
        paddingHorizontal: 20,
        // borderWidth: 1,
        // borderColor: 'black',
      },
      headerContainer: {
        paddingTop: 20,
        paddingLeft: 20,
        width: "100%",
        flexDirection: "row",
        marginBottom: 20,
        // borderWidth: 1,
        // borderColor: 'black',
      },
      headerTitle: {
        color: chosenTheme.primary,
        fontSize: 20,
        marginLeft: 24,
        // borderWidth: 1,
        // borderColor: 'black',
      },
    })
  };

  const styles = getStyles();  
  const handlePress = (screenName) => {
    navigation.navigate(screenName);
  };

  return (
    <SafeAreaView style={styles.pageContainer}>
      <View style={styles.headerContainer}>
        <TouchableOpacity	onPress={() => handlePress("SettingsScreen")}>
          <LeftArrowIcon
            width={24}
              height={24}
              color={chosenTheme.primary}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Billing</Text>
      </View>
    </SafeAreaView>
  )
}

export default Billing