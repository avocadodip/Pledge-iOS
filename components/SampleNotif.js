import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import Animated, { FadeInDown } from "react-native-reanimated";

const SampleNotif = () => {
  return (
    <Animated.View
      entering={FadeInDown.duration(1000).delay(300)}
      style={styles.sampleNotif}
    >
      <Image
        source={require("../assets/icons/pledgetransparent.png")}
        style={{ width: 50, height: 50 }}
      />
      <View style={styles.sampleNotifContent}>
        <View style={styles.sampleNotifTopContent}>
          <Text style={styles.appName}>Pledge</Text>
          <Text style={styles.timestamp}>now</Text>
        </View>
        <Text style={styles.sampleNotifMessage}>
          You have 3 hours left to complete your day!
        </Text>
      </View>
    </Animated.View>
  );
};

export default SampleNotif;

const styles = StyleSheet.create({
    // SAMPLE NOTIF STYLES
    sampleNotif: {
      backgroundColor: "rgba(211, 211, 211, 0.8)",
      borderRadius: 17,
      flexDirection: "row",
      alignItems: "center",
      gap: 3,
      paddingVertical: 12,
      paddingLeft: 10,
      paddingHorizontal: 15,
      width: "100%",
    },
    sampleNotifContent: {
      flexDirection: "column",
      gap: 4,
      width: "80%",
    },
    sampleNotifTopContent: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    appName: {
      fontSize: 15,
      color: "black",
      fontWeight: "500",
    },
    timestamp: {
      fontSize: 15,
      color: "grey",
      fontWeight: "400",
    },
    sampleNotifMessage: {
      fontSize: 15,
      lineHeight: 17,
      color: "black",
      fontWeight: "400",
    },
});
