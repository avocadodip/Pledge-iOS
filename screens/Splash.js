import * as React from "react";
import { StyleSheet, View, Image, Text } from "react-native";
import { FontSize, FontFamily } from "../GlobalStyles";
import { LinearGradient } from "expo-linear-gradient";
import { redGradientValues } from "../themes";

const Splash = () => {
  return (
    <LinearGradient colors={redGradientValues} style={styles.pageContainer}>
      <View style={styles.splash}>
        <View style={styles.logoIconContainer}>
          <Image
            style={styles.logoIcon}
            resizeMode="cover"
            source={require("../assets/icons/FervoWhite.png")}
          />
          <Text style={styles.appName}>Pledge</Text>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoIconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  logoIcon: {
    width: 132,
    height: 132,
  },
  appName: {
    fontSize: FontSize.size_31xl,
    fontWeight: "700",
    fontFamily: FontFamily.epilogueBold,
    textAlign: "left",
    marginTop: 30,
    color: "white",
  },
});

export default Splash;
