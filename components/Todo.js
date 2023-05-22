import React, { useState } from "react";
import { Alert, View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import CheckIcon from "../assets/icons/check-icon.svg";
import { useBottomSheet } from "../hooks/BottomSheetContext";
import DescriptLinesIcon from "../assets/icons/descript-lines-icon.svg";
import LockIcon from "../assets/icons/lock-icon.svg";
import UnlockIcon from "../assets/icons/unlock-icon.svg";

const Todo = ({
  todoNumber,
  title,
  description,
  amount,
  tag,
  componentType,
  isLocked,
}) => {
  const [isTodoLocked, setIsTodoLocked] = useState(isLocked);

  const { setIsBottomSheetOpen, setSelectedTodo, setIsBottomSheetEditable } = useBottomSheet();

  const handleOpenBottomSheet = () => {
    setSelectedTodo({
      todoNumber,
      title,
      description,
      amount,
      tag,
      isTodoLocked,
    });
    setIsBottomSheetOpen(true);
    if (isTodoLocked == null || isTodoLocked == true) {
      // (isLocked == null on today page)
      setIsBottomSheetEditable(false);
    } else setIsBottomSheetEditable(true);
  };

  const handleNewTodoPress = () => {
    setIsBottomSheetEditable(true);
    setIsBottomSheetOpen(true);
    setSelectedTodo({
      todoNumber,
      title,
      description,
      amount,
      tag,
      isTodoLocked,
    });
  };

  const showAlert = (missingField) => {
    let message;
    if (missingField === "title") {
      message = "Fill in a name for the task to lock it!";
    } else if (missingField === "amount") {
      message = "Fill in a pledge amount to lock the task!";
    }
    Alert.alert(
      "Missing fields",
      message,
      [{ text: "OK", onPress: () => setIsBottomSheetOpen(true) }],
      { cancelable: true }
    );
  };

  const handleLockTodo = () => {
    if (title == "") {
      showAlert("title");
      return;
    }

    if (amount == "") {
      showAlert("amount");
      return;
    }

    // convert amount to number before saving to database
    setIsTodoLocked(true);
  };

  // 1. number [tmrw page]
  if (componentType == "number") {
    return (
      <TouchableOpacity style={styles.numberContainer} onPress={handleNewTodoPress}>
        <Text style={styles.numberText}>{todoNumber}</Text>
      </TouchableOpacity>
    );
  }
  // 2. fined [today page]
  else if (componentType == "fined") {
    return (
      <View style={styles.finedContainer}>
        <Text style={styles.finedText}>No task entered.</Text>
        <Text style={styles.finedText}>-$1</Text>
      </View>
    );
  }
  // 3. info [today/tmrw page]
  else if (componentType == "info") {
    return (
      <View style={styles.infoContainer}>
        <TouchableOpacity style={styles.leftContainer} onPress={handleOpenBottomSheet}>
          <View style={styles.upperHalfContainer}>
            <View style={styles.numberTitleContainer}>
              <Text style={styles.todoNumber}>{todoNumber}</Text>
              <Text style={styles.todoTitle}>{title}</Text>
            </View>
          </View>
          <View style={styles.lowerHalfContainer}>
            <View style={styles.tagDescriptionContainer}>
              {tag && (
                <View style={styles.tagContainer}>
                  <View style={styles.tagBackground}>
                    <Text style={styles.todoTag}>{tag}</Text>
                  </View>
                </View>
              )}
              {description && (
                <View style={styles.descriptionContainer}>
                  <DescriptLinesIcon />
                  <Text style={styles.todoDescription} numberOfLines={1} ellipsizeMode="tail">
                    {description}
                  </Text>
                </View>
              )}
            </View>
            {amount && (
              <View style={styles.amountContainer}>
                <Text style={styles.todoAmount}>${amount}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
        {isTodoLocked === true ? (
          <View
            style={{
              ...styles.rightContainer,
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            }}
          >
            <LockIcon />
          </View>
        ) : isTodoLocked === false ? (
          <TouchableOpacity style={styles.rightContainer} onPress={handleLockTodo}>
            <UnlockIcon />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.rightContainer}>
            <CheckIcon />
          </TouchableOpacity>
        )}
      </View>
    );
  }
  else if (componentType == "onboard") {
    return (
      <View style={[styles.infoContainer, { height: 86 }]}>
        <View style={styles.leftContainer}>
          <View style={styles.upperHalfContainer}>
            <View style={styles.numberTitleContainer}>
              <Text style={styles.todoNumber}>{todoNumber}</Text>
              <TextInput 
                autoCorrect={false}
                multiline={true}
                numberOfLines={2}
                style={[styles.todoTitle, { flexGrow: 1, flexShrink: 1, lineHeight: 24 }]}
                placeholder={'Write a screenplay'}
                placeholderTextColor="rgba(243, 243, 243, 0.5)"
                maxLength={40}
                // borderWidth={1}
                // borderColor={"black"}
              />
            </View>
          </View>
        </View>
        {isTodoLocked === true ? (
          <View
            style={{
              ...styles.rightContainer,
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            }}
          >
            <LockIcon />
          </View>
        ) : isTodoLocked === false ? (
          <TouchableOpacity style={styles.rightContainer} onPress={handleLockTodo}>
            <UnlockIcon />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.rightContainer}>
            <CheckIcon />
          </TouchableOpacity>
        )}
      </View>
    );
  }
};

const styles = StyleSheet.create({
  numberContainer: {
    flexDirection: "column",
    width: "100%",
    height: "25%",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 15,
  },
  finedContainer: {
    flexDirection: "column",
    width: "100%",
    height: "25%",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 15,
  },
  infoContainer: {
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
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    flex: 2,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  upperHalfContainer: {
    flex: 4,
  },
  numberTitleContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 15,
    // borderWidth: 1,
    // borderColor: 'black',
    height: "100%",
    overflow: "hidden",
  },
  lowerHalfContainer: {
    flex: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tagDescriptionContainer: {
    flex: 1,
    flexDirection: "column",
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
    alignSelf: "stretch",
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
  numberText: {
    color: "white",
    fontSize: 80,
    fontWeight: "700",
  },
  finedText: {
    color: "white",
    opacity: 0.7,
    fontSize: 22,
    fontWeight: "bold",
  },
});

export default Todo;
