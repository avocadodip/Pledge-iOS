import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { useBottomSheet } from "../../hooks/BottomSheetContext";
import PledgeDollarIcon from "../../assets/icons/pledge-dollar-icon.svg";
import FolderIcon from "../../assets/icons/amount-folder-icon.svg";
import DescriptLinesIcon from "../../assets/icons/descript-lines-icon.svg";
import { Color } from "../../GlobalStyles";
import { useThemes } from "../../hooks/ThemesContext";
import { LinearGradient } from "expo-linear-gradient";
import { useTmrwTodos } from "../../hooks/TmrwTodosContext";
 
export default function TodoBottomSheet() {
  const { theme, backgroundGradient } = useThemes();
  const { updateTodo } = useTmrwTodos();
  const {
    isBottomSheetOpen,
    isBottomSheetEditable,
    setIsBottomSheetOpen,
    selectedTodo,
    isOnboard,
  } = useBottomSheet();
  const bottomSheetRef = useRef(null);
  const snapPoints = ["75%"];
  const [todo, setTodo] = useState(selectedTodo || {});
  const todoRef = useRef(todo);
  const styles = getStyles(theme);

  // Set initial todo object
  useEffect(() => {
    setTodo(selectedTodo || {});
  }, [selectedTodo]);

  useEffect(() => {
    todoRef.current = todo; // Update the mutable ref when todo changes because todo value inside renderBackdrop callback is its initial value when the component is rendered.
  }, [todo]);

  // Updates todo object when a field is edited
  const handleInputChange = (field, value) => {
    setTodo({
      ...todo,
      [field]: value,
    });
  };

  const handleSheetChange = (index) => {
    if (index === -1) {
      setIsBottomSheetOpen(false);
    }
  };

  // Backdrop - when pressed, updates global todo array and closes sheet
  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        onPress={() => {
          if (isBottomSheetEditable) {
            updateTodo(todoRef.current);
          }
          setTimeout(() => {
            setIsBottomSheetOpen(false);
          }, 100); // Need to wait for animation to finish
        }}
      />
    ),
    [isBottomSheetEditable]
  );

  return isBottomSheetOpen ? (
    <BottomSheet
      ref={bottomSheetRef}
      index={isBottomSheetOpen ? 0 : -1}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      backdropComponent={renderBackdrop}
      onChange={handleSheetChange}
      backgroundComponent={null} // gets rid of white flash
      handleStyle={{ display: "none" }} // hide default handle
      style={{
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        flex: 1,
        overflow: "hidden",
      }}
    >
      <LinearGradient colors={backgroundGradient} style={{ flex: 1 }}>
        {isBottomSheetEditable ? (
          // Editable
          <View style={styles.bottomSheetContainer}>
            <View style={styles.dragHandleContainer}>
              <View style={styles.dragHandle}></View>
            </View>
            <View style={styles.numberTitleContainer}>
              <Text style={styles.number}>{selectedTodo.todoNumber}</Text>
              <TextInput
                style={styles.title}
                placeholder="New task"
                value={todo.title}
                onChangeText={(text) => handleInputChange("title", text)}
                placeholderTextColor={theme.textDisabled}
                textStyle={styles.text}
                autoCorrect={false}
                autoCapitalize="none"
                maxLength={46}
              />
            </View>
            <View style={styles.horizontalDivider} />
            <View style={styles.amountFolderContainer}>
              <PledgeDollarIcon color={theme.textHigh} />
              <TextInput
                style={styles.textInput}
                placeholder="Add pledge"
                value={todo.amount}
                onChangeText={(text) => handleInputChange("amount", text)}
                keyboardType="numeric"
                placeholderTextColor={theme.textDisabled}
                textStyle={styles.text}
                autoCorrect={false}
                autoCapitalize="none"
                maxLength={2}
              />
            </View>
            <View style={styles.horizontalDivider} />
            <View style={styles.amountFolderContainer}>
              <FolderIcon color={theme.textHigh} />
              <TextInput
                style={styles.textInput}
                placeholder="Add tag"
                value={todo.tag}
                onChangeText={(text) => handleInputChange("tag", text)}
                placeholderTextColor={theme.textDisabled}
                textStyle={styles.text}
                autoCorrect={false}
                autoCapitalize="none"
                maxLength={30}
              />
            </View>
            <View style={styles.horizontalDivider} />
            <View style={styles.descriptionContainer}>
              <DescriptLinesIcon color={theme.textHigh} />
              <TextInput
                style={styles.textInput}
                placeholder="Add description"
                value={todo.description}
                onChangeText={(text) => handleInputChange("description", text)}
                placeholderTextColor={theme.textDisabled}
                textStyle={styles.text}
                autoCorrect={false}
                autoCapitalize="none"
                multiline={true}
              />
            </View>
          </View>
        ) : (
          // Uneditable
          <View style={styles.bottomSheetContainer}>
            <View style={styles.dragHandleContainer}>
              <View style={styles.dragHandle}></View>
            </View>
            <View style={styles.numberTitleContainer}>
              <Text style={styles.number}>{selectedTodo.todoNumber}</Text>
              <Text style={styles.title}>{selectedTodo.title}</Text>
            </View>
            <View style={styles.horizontalDivider} />
            <View style={styles.amountFolderContainer}>
              <PledgeDollarIcon color={theme.textHigh} />
              <Text style={styles.text}>{selectedTodo.amount}</Text>
            </View>
            <View style={styles.horizontalDivider} />
            <View style={styles.amountFolderContainer}>
              <FolderIcon color={theme.textHigh} />
              <Text style={styles.text}>{selectedTodo.tag}</Text>
            </View>
            <View style={styles.horizontalDivider} />
            <View style={styles.descriptionContainer}>
              <DescriptLinesIcon color={theme.textHigh} />
              <Text style={styles.text}>{selectedTodo.description}</Text>
            </View>
          </View>
        )}
      </LinearGradient>
    </BottomSheet>
  ) : null;
}

const getStyles = (theme) =>
  StyleSheet.create({
    bottomSheetContainer: {
      flex: 1,
      flexDirection: "col",
      paddingHorizontal: 20,

      // borderWidth: 1,
      // borderColor: "black",
      // borderTopLeftRadius: 10,
      // borderTopRightRadius: 10,
      // overflow: "hidden",
    },
    dragHandleContainer: {
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
    },
    dragHandle: {
      backgroundColor: theme.primary,
      width: 45,
      height: 4,
      borderRadius: 3,
      marginTop: 15,
    },
    horizontalDivider: {
      borderBottomColor: theme.primary,
      opacity: 0.3,
      borderBottomWidth: StyleSheet.hairlineWidth,
    },

    // CONTAINERS
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
    }, 
    descriptionContainer: {
      paddingTop: 10,
      flexDirection: "row",
      gap: 23,
      alignItems: "center"

    },
    number: {
      color: theme.primary,
      fontSize: 40,
      fontWeight: "bold",
    },
    title: {
      color: theme.primary,
      fontSize: 30,
      fontWeight: "bold",
      width: "80%",
    },
    text: {
      color: theme.primary,
      fontSize: 16,
      fontWeight: 500,
      width: "80%",
      paddingVertical: 15,
    },
    textInput: {
      color: theme.primary,
      fontSize: 16,
      width: "80%",
      paddingVertical: 15,
      // paddingHorizontal: 10,
    },
  });
