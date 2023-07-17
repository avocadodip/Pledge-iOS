import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity} from 'react-native'
import { Color, SETTINGS_HORIZONTAL_PADDING, settingsPageStyles } from "../GlobalStyles";
import React from 'react'
import LeftChevronIcon from "../assets/icons/chevron-left.svg";
import StatsBundle from "../components/StatsBundle";
import SettingsHeader from '../components/SettingsHeader';

const PastBets = ({navigation}) => {
 
  return (
    <SafeAreaView style={settingsPageStyles.pageContainer}>
      <SettingsHeader navigation={navigation} header={"Past Bets"}/>
      <StatsBundle even={false} month="Jul" day="2"/>
      <StatsBundle even={true} month="Jul" day="2"/>
      <StatsBundle even={false} month="Jun" day="31"/>
      <StatsBundle even={true} month="Jun" day="30"/>
    </SafeAreaView>
  )
} 
 
export default PastBets;

const style = StyleSheet.create({
  pageContainer: {
    display: "flex",
    marginHorizontal: SETTINGS_HORIZONTAL_PADDING,
  },
})