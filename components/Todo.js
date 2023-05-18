import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import CheckIcon from "../assets/icons/check-icon.svg";
import { useBottomSheet } from "../BottomSheetContext";
import DescriptLinesIcon from "../assets/icons/descript-lines-icon.svg";

const Todo = ({ todoNumber, title, description, amount, tag }) => {
  const { isBottomSheetOpen, setIsBottomSheetOpen, setSelectedTodo } =
    useBottomSheet();

  const handlePress = () => {
    setSelectedTodo({ todoNumber, title, description, amount, tag });
    setIsBottomSheetOpen(true);
  };

  return (
    // 3. Active todo
    <View style={styles.container}>
      <TouchableOpacity style={styles.leftContainer} onPress={handlePress}>
        <View style={styles.upperHalfContainer}>
          <View style={styles.numberTitleContainer}>
            <Text style={styles.todoNumber}>{todoNumber}</Text>
            <Text style={styles.todoTitle}>{title}</Text>
          </View>
        </View>
        <View style={styles.lowerHalfContainer}>
          <View style={styles.tagDescriptionContainer}>
            <View style={styles.tagContainer}>
              <View style={styles.tagBackground}>
                <Text style={styles.todoTag}>{tag}</Text>
              </View>
            </View>
            <View style={styles.descriptionContainer}>
              <DescriptLinesIcon />
              <Text
                style={styles.todoDescription}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {description}
              </Text>
            </View>
          </View>
          <View style={styles.amountContainer}>
            <Text style={styles.todoAmount}>{amount}</Text>
          </View>
        </View>
      </TouchableOpacity>
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
    height: "25%",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftContainer: {
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    flex: 8,
    height: "100%",
    padding: 15,
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
    flex: 4,
    // justifyContent: "center", //commented out this to shift number/title to the top
  },
  numberTitleContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 15,
  },
  lowerHalfContainer: {
    flex: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tagDescriptionContainer: {
    flex: 1,
    flexDirection: "col",
    gap: 4,
    justifyContent: "flex-start",
  },
  tagContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-start",
  },
  tagBackground: {
    backgroundColor:
      "linear-gradient(0deg, rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.07)), rgba(255, 255, 255, 0.07)",
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 13,
  },
  amountContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor:
      "linear-gradient(0deg, rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.07)), rgba(255, 255, 255, 0.07)",
    borderRadius: 10,
    paddingVertical: 4,
    maxWidth: 80,
    alignSelf: "stretch", // Added alignSelf to stretch the container
  },
  todoNumber: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
  },
  todoTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "700",
  },
  todoTag: {
    color: "white",
    fontWeight: "500",
  },
  descriptionContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  todoDescription: {
    color: "white",
    maxWidth: "80%",
    fontWeight: "500",
  },
  todoAmount: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
  },
});

export default Todo;
