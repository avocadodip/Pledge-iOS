import * as React from "react";
import { StyleSheet, View, Image, Text } from "react-native";
import { FontSize, FontFamily, Border, Color } from "../GlobalStyles";
 
const Splash = () => {
  return (
    <View style={styles.splash}>
      <View style={styles.image2} />
      <View style={styles.splashChild} />
      <View style={styles.beaconlogo51Parent}>
        <Image
          style={styles.beaconlogo51Icon}
          resizeMode="cover"
          source={require("../assets/beaconlogo.png")}
        />
        <Text style={styles.beacon}>beacon</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  image2: {
    top: 939,
    left: -19,
    width: 896,
    height: 414,
    transform: [
      {
        rotate: "-90deg",
      },
    ],
    position: "absolute",
  },
  splashChild: {
    top: 459,
    left: 154,
    width: 195,
    position: "absolute",
  },
  beaconlogo51Icon: {
    width: 132,
    height: 135,
  },
  beacon: {
    fontSize: FontSize.size_31xl,
    lineHeight: 69,
    fontWeight: "700",
    fontFamily: FontFamily.epilogueBold,
    textAlign: "left",
    marginTop: 11,
    width: 195,
  },
  beaconlogo51Parent: {
    top: 313,
    left: 110,
    alignItems: "center",
    position: "absolute",
  },
  splash: {
    borderRadius: Border.br_11xl,
    backgroundColor: Color.white,
    flex: 1,
    width: "100%",
    height: 896,
    overflow: "hidden",
  },
});

export default Splash;