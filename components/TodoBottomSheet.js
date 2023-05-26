import { View, Text, TextInput, StyleSheet } from "react-native";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { useBottomSheet } from "../hooks/BottomSheetContext";
import PledgeDollarIcon from "../assets/icons/pledge-dollar-icon.svg";
import FolderIcon from "../assets/icons/amount-folder-icon.svg";
import DescriptLinesIcon from "../assets/icons/descript-lines-icon.svg";
import { Color } from "../GlobalStyles";

import { ThemeContext } from "../hooks/ThemeContext";
import { classicTheme, darkTheme, lightTheme } from "../Themes";
import React, { useCallback, useEffect, useRef, useState, useContext } from "react";

export default function TodoBottomSheet() {
  const {
    isBottomSheetOpen,
    setIsBottomSheetOpen,
    isBottomSheetEditable,
    selectedTodo,
    updateTodo,
    isOnboard,
  } = useBottomSheet();
  const bottomSheetRef = useRef(null);
  const snapPoints = ["75%"];
  const [todo, setTodo] = useState(selectedTodo || {});

  const { chosenTheme, setChosenTheme } = useContext(ThemeContext);

  const getStyles = () => {
    return StyleSheet.create({
      bottomSheetContainer: {
        backgroundColor: chosenTheme.accent,
        flex: 1,
        flexDirection: "col",
        paddingHorizontal: 20,
      },
      bottomSheetTabBar: {
        backgroundColor: chosenTheme.accent,
      },
      dragHandleContainer: {
        alignSelf: "center",
      },
      dragHandle: {
        width: 45,
        height: 4,
        borderRadius: 3,
        backgroundColor: chosenTheme.primary,
        marginTop: 15,
      },
      horizontalDivider: {
        borderBottomColor: chosenTheme.primary,
        opacity: 0.3,
        borderBottomWidth: StyleSheet.hairlineWidth,
      },
      numberTitleContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 45,
        marginBottom: 20,
        gap: 23,
      },
      amountFolderContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 23,
        marginVertical: 4,
      },
      descriptionContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 23,
        // marginVertical: 18,
        // borderWidth: 1,
        // borderColor: 'black',
      },
      number: {
        color: chosenTheme.primary,
        fontSize: 40,
        fontWeight: "bold",
      },
      title: {
        color: chosenTheme.primary,
        fontSize: 30,
        fontWeight: "bold",
        width: "80%",
      },
      text: {
        color: chosenTheme.primary,
        fontSize: 16,
        fontWeight: "500",
        lineHeight: 18,
        width: "80%",
        paddingVertical: 15,
      },
      textInput: {
        color: chosenTheme.primary,
        fontSize: 16,
        fontWeight: "500",
        lineHeight: 18,
        width: "80%",
        paddingVertical: 15,
        // paddingHorizontal: 10,
      },
    })
  };

  const styles = getStyles();  

  useEffect(() => {
    console.log(isBottomSheetOpen);
  }, [isBottomSheetOpen]);

  useEffect(() => {
    setTodo(selectedTodo || {});
  }, [selectedTodo]);

  const handleInputChange = (field, value) => {
    setTodo({
      ...todo,
      [field]: value,
    });
  };

  const handleSheetChanges = (index) => {
    if (index === -1) {
      setIsBottomSheetOpen(false);
      if (isBottomSheetEditable) {
        updateTodo(todo);
      }
    }
  };

  // renders
  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    []
  );

  return isBottomSheetOpen ? (
    <BottomSheet
      ref={bottomSheetRef}
      index={isBottomSheetOpen ? 0 : -1}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      onChange={handleSheetChanges}
      backgroundStyle={{ backgroundColor: chosenTheme.accent }}
      backdropComponent={renderBackdrop}
      handleComponent={() => (
        <View style={styles.dragHandleContainer}>
          <View style={styles.dragHandle}></View>
        </View>
      )}
    >
      {isBottomSheetEditable ? (
        // Editable
        <View style={styles.bottomSheetContainer}>
          <View style={styles.numberTitleContainer}>
            <Text style={styles.number}>{selectedTodo.todoNumber}</Text>
            <TextInput
              style={styles.title}
              placeholder="New task"
              value={todo.title}
              onChangeText={(text) => handleInputChange("title", text)}
              placeholderTextColor= {chosenTheme.overlayPrimary}
              textStyle={styles.text}
              autoCorrect={false}
              autoCapitalize="none"
            />
          </View>
          <View style={styles.horizontalDivider} />
          <View style={styles.amountFolderContainer}>
            <PledgeDollarIcon 
              color={chosenTheme.primary}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Add pledge"
              value={todo.amount}
              onChangeText={(text) => handleInputChange("amount", text)}
              keyboardType="numeric"
              placeholderTextColor= {chosenTheme.overlayPrimary}
              textStyle={styles.text}
              autoCorrect={false}
              autoCapitalize="none"
            />
          </View>
          <View style={styles.horizontalDivider} />
          <View style={styles.amountFolderContainer}>
            <FolderIcon 
              color={chosenTheme.primary}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Add tag"
              value={todo.tag}
              onChangeText={(text) => handleInputChange("tag", text)}
              placeholderTextColor= {chosenTheme.overlayPrimary}
              textStyle={styles.text}
              autoCorrect={false}
              autoCapitalize="none"
            />
          </View>
          <View style={styles.horizontalDivider} />
          <View style={styles.descriptionContainer}>
            <DescriptLinesIcon 
              color={chosenTheme.primary}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Add description"
              value={todo.description}
              onChangeText={(text) => handleInputChange("description", text)}
              placeholderTextColor= {chosenTheme.overlayPrimary}
              textStyle={styles.text}
              autoCorrect={false}
              autoCapitalize="none"
            />
          </View>
        </View>
      ) : (
        // Uneditable
        <View style={styles.bottomSheetContainer}>
          <View style={styles.numberTitleContainer}>
            <Text style={styles.number}>{selectedTodo.todoNumber}</Text>
            <Text style={styles.title}>{selectedTodo.title}</Text>
          </View>
          <View style={styles.horizontalDivider} />
          <View style={styles.amountFolderContainer}>
            <PledgeDollarIcon 
              color={chosenTheme.primary}
            />
            <Text style={styles.text}>{selectedTodo.amount}</Text>
          </View>
          <View style={styles.horizontalDivider} />
          <View style={styles.amountFolderContainer}>
            <FolderIcon 
              color={chosenTheme.primary}
            />
            <Text style={styles.text}>{selectedTodo.tag}</Text>
          </View>
          <View style={styles.horizontalDivider} />
          <View style={styles.descriptionContainer}>
            <DescriptLinesIcon 
              color={chosenTheme.primary}
            />
            <Text style={styles.text}>{selectedTodo.description}</Text>
          </View>
        </View>
      )}
    </BottomSheet>
  ) : null;
}