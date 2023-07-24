import * as React from "react";
import { StyleSheet, View, Image, Text } from "react-native";
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
    // ...StyleSheet.absoluteFillObject, // This makes it an overlay
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2, // Set zIndex high so it appears above other elements
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
    fontSize: 24,
    fontWeight: "700",
    textAlign: "left",
    marginTop: 30,
    color: "white",
  },
});

export default Splash;