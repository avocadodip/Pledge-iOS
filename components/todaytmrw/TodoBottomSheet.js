import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableHighlight,
  TouchableOpacity,
} from "react-native";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { useBottomSheet } from "../../hooks/BottomSheetContext";
import PledgeDollarIcon from "../../assets/icons/pledge-dollar-icon.svg";
import FolderIcon from "../../assets/icons/amount-folder-icon.svg";
import DescriptLinesIcon from "../../assets/icons/descript-lines-icon.svg";
import RightArrowIcon from "../../assets/icons/arrow-small-right.svg";
import { Color } from "../../GlobalStyles";
import { useThemes } from "../../hooks/ThemesContext";
import { LinearGradient } from "expo-linear-gradient";
import { useTmrwTodos } from "../../hooks/TmrwTodosContext";
import { useSettings } from "../../hooks/SettingsContext";
import { useNavigation } from "@react-navigation/native";

export default function TodoBottomSheet() {
  const { theme, backgroundGradient } = useThemes();
  const {
    settings: { isPaymentSetup },
  } = useSettings();
  const { updateTodo } = useTmrwTodos();
  const {
    isBottomSheetOpen,
    setIsBottomSheetOpen,
    isBottomSheetEditable,
    selectedTodo,
  } = useBottomSheet();
  const bottomSheetRef = useRef(null);
  const snapPoints = ["75%"];
  const [todo, setTodo] = useState(selectedTodo || {});
  const todoRef = useRef(todo);
  const styles = getStyles(theme);
  const navigation = useNavigation();

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
      if (isBottomSheetEditable) {
        updateTodo(todoRef.current);
      }
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

  const handleNavigateToAddPayment = () => {
    updateTodo(todoRef.current);

    bottomSheetRef.current.close();
    setIsBottomSheetOpen(false);

    setTimeout(() => {
      navigation.navigate("Settings");
    }, 500);
  };

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
                onChangeText={(text) =>
                  handleInputChange(
                    "title",
                    text.charAt(0).toUpperCase() + text.slice(1)
                  )
                }
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
              {isPaymentSetup ? (
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
              ) : (
                <TouchableOpacity onPress={handleNavigateToAddPayment}>
                  <View
                    style={[
                      styles.addPaymentButton,
                      { flexDirection: "row", alignItems: "center", gap: 4 },
                    ]}
                  >
                    <Text style={styles.addPaymentButtonText}>
                      To make a pledge, add payment method
                    </Text>
                    <RightArrowIcon
                      width={17}
                      height={17}
                      color={theme.accent}
                    />
                  </View>
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.horizontalDivider} />
            <View style={styles.amountFolderContainer}>
              <FolderIcon color={theme.textHigh} />
              <TextInput
                style={styles.textInput}
                placeholder="Add tag"
                value={todo.tag}
                onChangeText={(text) =>
                  handleInputChange(
                    "tag",
                    text.charAt(0).toUpperCase() + text.slice(1)
                  )
                }
                placeholderTextColor={theme.textDisabled}
                textStyle={styles.text}
                autoCorrect={false}
                autoCapitalize="none"
                maxLength={30}
              />
            </View>
            <View style={styles.horizontalDivider} />
            <View style={styles.descriptionContainer}>
              <View style={{marginTop: 2}}>
                <DescriptLinesIcon color={theme.textHigh} />
              </View>
              <TextInput
                style={styles.textInput}
                placeholder="Add description"
                value={todo.description}
                onChangeText={(text) =>
                  handleInputChange(
                    "description",
                    text.charAt(0).toUpperCase() + text.slice(1)
                  )
                }
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
      height: 50,
    },
    descriptionContainer: {
      paddingTop: 10,
      flexDirection: "row",
      gap: 23,
      // alignItems: "center",
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

    addPaymentButton: {
      paddingVertical: 6,
      paddingHorizontal: 9,
      backgroundColor: "#ffffff",
      borderRadius: 6,
    },
    addPaymentButtonText: {
      color: theme.accent,
      fontWeight: 500,
    },
  });
