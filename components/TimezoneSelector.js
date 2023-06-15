import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import Modal from "react-native-modal";

const TimezoneSelector = ({ timezone }) => {

  return (
    <SafeAreaView>
      <View>
        <Text>{timezone}</Text>
      </View>
    </SafeAreaView>
  );
};

export default TimezoneSelector;

const styles = StyleSheet.create({});
