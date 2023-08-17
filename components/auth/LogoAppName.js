import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Color } from "../../GlobalStyles";

const LogoAppName = () => {
  return (
    <View style={styles.logoContainer}>
      <Image
        source={require("../../assets/icons/FervoWhite.png")}
        style={{ width: 100, height: 100 }}
      />
      <Text style={styles.appNameText}>Pledge</Text>
    </View>
  );
};

export default LogoAppName;

const styles = StyleSheet.create({
  logoContainer: {
    flexDirection: "col",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 35,
    gap: 5
  },
  appNameText: {
    fontSize: 50,
    color: Color.white,
    fontWeight: "bold",
  },
});
