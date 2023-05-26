import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity} from 'react-native'
import { Color } from "../GlobalStyles";
import LeftArrowIcon from "../assets/icons/arrow-left.svg";
import StatsBundle from "../components/StatsBundle";

import { ThemeContext } from "../hooks/ThemeContext";
import { classicTheme, darkTheme, lightTheme } from "../Themes";
import React, { useContext, useState } from "react";

const Stats = ({navigation}) => {
  const { chosenTheme, setChosenTheme } = useContext(ThemeContext);

  const getStyles = () => {
    return StyleSheet.create({
      pageContainer: {
        flex: 1,
        alignItems: "center",
        backgroundColor: chosenTheme.accent,
        // marginHorizontal: 20,
        // borderWidth: 1,
        // borderColor: 'black',
      },
      headerContainer: {
        paddingTop: 20,
        paddingLeft: 40,
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
        <Text style={styles.headerTitle}>Stats</Text>
      </View>
      <StatsBundle even={false} month="Jul" day="2"/>
      <StatsBundle even={true} month="Jul" day="2"/>
      <StatsBundle even={false} month="Jun" day="31"/>
      <StatsBundle even={true} month="Jun" day="30"/>

    </SafeAreaView>
  )
}

export default Stats