import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity} from 'react-native'
import { Color } from "../GlobalStyles";
import React from 'react'
import LeftArrowIcon from "../assets/icons/arrow-left.svg";
import StatsBundle from "../components/StatsBundle";

const Stats = ({navigation}) => {
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
              color={Color.white}
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

const styles = StyleSheet.create({
    pageContainer: {
    flex: 1,
    alignItems: "center",
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
    color: Color.white,
    fontSize: 20,
    marginLeft: 24,
    // borderWidth: 1,
    // borderColor: 'black',
  },
})