import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity} from 'react-native'
import { Color } from "../GlobalStyles";
import React from 'react'
import LeftChevronIcon from "../assets/icons/chevron-left.svg";
import StatsBundle from "../components/StatsBundle";
import SettingsHeader from '../components/SettingsHeader';

const Stats = ({navigation}) => {
 
  return (
    <SafeAreaView style={styles.pageContainer}>
      <SettingsHeader navigation={navigation} header={"Stats"}/>
      <StatsBundle even={false} month="Jul" day="2"/>
      <StatsBundle even={true} month="Jul" day="2"/>
      <StatsBundle even={false} month="Jun" day="31"/>
      <StatsBundle even={true} month="Jun" day="30"/>
    </SafeAreaView>
  )
}

export default Stats

const styles = StyleSheet.create({
    pageContainer: {
    flex: 1,
    alignItems: "center",
  },
})