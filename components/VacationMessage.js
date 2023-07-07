import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import CircleRightArrow from "../assets/icons/circle-right-arrow.svg";

const VacationMessage = () => {
  return (
    <View style={styles.oneContainer}>
      <Text style={styles.infoText}>Welcome, Josh.</Text>
      <Text style={styles.infoText}>You're on vacation!</Text>
      <TouchableOpacity style={styles.todoButton}>
        <Text style={styles.todoButtonText}> Turn off vacation mode </Text>
        <CircleRightArrow/>
      </TouchableOpacity>
    </View>
  );
};

export default VacationMessage;

const styles = StyleSheet.create({})
