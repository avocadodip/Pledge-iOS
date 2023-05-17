import React from "react";
import { View, Text, StyleSheet } from "react-native";
import CheckIcon from "../assets/icons/check-icon.svg";

const Todo = ({ todoNumber, title, description, amount, tag }) => {
  return (
    // 3. Active todo
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        <View style={styles.upperHalfContainer}>
          <View style={styles.numberTitleContainer}>
            <Text style={styles.todoNumber}>{todoNumber}</Text>
            <Text style={styles.todoTitle}>{title}</Text>
          </View>
        </View>
        <View styles={styles.lowerHalfContainer}>
          <View style={styles.tagDescriptionContainer}>
            <Text style={styles.todoTag}>{tag}</Text>
            <Text
              style={styles.todoDescription}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {description}
            </Text>
          </View>
          <View style={styles.amountContainer}>
            <Text style={styles.todoAmount}>{amount}</Text>
          </View>
        </View>
      </View>
      <View style={styles.rightContainer}>
        <CheckIcon />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    height: "23%",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftContainer: {
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    flex: 8,
    height: "100%",
  },
  rightContainer: {
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.17)",
    flex: 2,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  upperHalfContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  numberTitleContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 10,
  },
  lowerHalfContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tagDescriptionContainer: {
    flex: 1,
    justifyContent: "flex-start",
  },
  amountContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  todoNumber: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  todoTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  todoTag: {
    color: "white",
  },
  todoDescription: {
    color: "white",
    maxWidth: "50%",
  },
  todoAmount: {
    color: "white",
  },
});

export default Todo;
