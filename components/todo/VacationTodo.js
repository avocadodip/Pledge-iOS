import { Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { styles } from "./TodoStyles";
import CircleRightArrow from "../../assets/icons/circle-right-arrow.svg";

const VacationTodo = () => {
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

export default VacationTodo;
