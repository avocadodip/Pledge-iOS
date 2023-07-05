import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import TouchableRipple from "../components/TouchableRipple";

const ChangeEmail = () => {
  const navigation = useNavigation();
  const handleBackPress = async () => {
    navigation.navigate("Account");
  };

  return (
    <SafeAreaView> 
      <TouchableRipple style={styles.backButton} onPress={handleBackPress}>
        {/* <LeftChevronIcon width={24} height={24} color={Color.white} /> */}
        <Text>Back</Text>
      </TouchableRipple>
    </SafeAreaView>
  );
};

export default ChangeEmail;

const styles = StyleSheet.create({});
