import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableHighlight,
  TouchableOpacity,
  ScrollView,
  Dimensions,
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
    dreamsArray,
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

  const findDreamTitleById = (id, dreams) => {
    const dream = dreams.find((d) => d.id === id);
    return dream ? dream.title : null;
  };

  // Set initial todo object
  useEffect(() => {
    setTodo(selectedTodo || {});
  }, [selectedTodo]);

  useEffect(() => {
    todoRef.current = todo; // Update the mutable ref when todo changes because todo value inside renderBackdrop callback is its initial value when the component is rendered.
    console.log(todo);
  }, [todo]);

  // Updates todo object when a field is edited
  const handleInputChange = (field, value) => {
    setTodo((prevTodo) => {
      const updatedTodo = {
        ...prevTodo,
        [field]: value,
      };
      todoRef.current = updatedTodo; // Update todoRef here
      return updatedTodo;
    });
  };

  const renderRow = (dreams, isEvenRow) => (
    <View style={{ flexDirection: "row", marginTop: isEvenRow ? 0 : 10 }}>
      {isEvenRow && (
        <TouchableOpacity
          key={100}
          onPress={() => setTodo({ ...todo, tag: "" })}
          style={[
            styles.dreamButton,
            todo.tag === "" ? styles.selectedDreamButton : null,
          ]}
        >
          <Text
            style={[
              styles.dreamText,
              todo.tag === "" ? styles.selectedDreamText : null,
            ]}
          >
            None
          </Text>
        </TouchableOpacity>
      )}

      {dreams
        .filter((_, index) => index % 2 === (isEvenRow ? 0 : 1))
        .map((dream, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setTodo({ ...todo, tag: dream.id })}
            style={[
              styles.dreamButton,
              todo.tag === dream.id ? styles.selectedDreamButton : null,
            ]}
          >
            <Text
              style={[
                styles.dreamText,
                todo.tag === dream.id ? styles.selectedDreamText : null,
              ]}
            >
              {dream.title}
            </Text>
          </TouchableOpacity>
        ))}
    </View>
  );

  // Backdrop - when pressed, updates global todo array and closes sheet
  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        onPress={() => {
          if (isBottomSheetEditable) {
            if (todo.amount === "") {
              setTodo((prevTodo) => ({
                ...prevTodo,
                amount: "0",
              }));
              todoRef.current = { ...todoRef.current, amount: "0" };
            }
            updateTodo(todoRef.current);
          }
          setTimeout(() => {
            setIsBottomSheetOpen(false);
          }, 100); // Need to wait for animation to finish
        }}
      />
    ),
    [isBottomSheetEditable, todo]
  );

  const handleSheetChange = (index) => {
    if (index === -1) {
      setIsBottomSheetOpen(false);
    }
  };

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
      backgroundComponent={null} // gets rid of white flash
      handleStyle={{ display: "none" }} // hides default handle
      onChange={handleSheetChange} // handle drag close
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
                autoFocus={true}
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
            <View style={styles.dreamsContainer}>
              <FolderIcon color={theme.textHigh} />
              {/* <TextInput
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
              /> */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={true}
                style={styles.dreamScrollview}
                indicatorStyle="white"
                contentContainerStyle={{ alignItems: "center" }}
              >
                <View style={{ flexDirection: "column" }}>
                  {[true, false].map((isEvenRow, index) =>
                    renderRow(dreamsArray, isEvenRow)
                  )}
                </View>
              </ScrollView>
              <View style={{ height: 3, backgroundColor: "white" }} />
            </View>
            <View style={styles.horizontalDivider} />
            <View style={styles.descriptionContainer}>
              <View style={{ marginTop: 2 }}>
                <DescriptLinesIcon color={theme.textHigh} />
              </View>
              <TextInput
                style={styles.textInput}
                placeholder="Add note"
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
              <Text style={styles.text}>
                {findDreamTitleById(selectedTodo.tag, dreamsArray)}
              </Text>
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
      // flex: 1,
      flexDirection: "col",
      paddingLeft: 16,

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
      gap: 16,
    },
    amountFolderContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
      height: 50,
    },
    descriptionContainer: {
      paddingTop: 10,
      flexDirection: "row",
      gap: 16,
      // alignItems: "center",
    },
    number: {
      color: theme.primary,
      fontSize: 33,
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

    // DREAMS
    dreamsContainer: {
      flexDirection: "row",
      alignItems: "center",
      height: 100,
      paddingTop: 8,
    },
    dreamScrollview: {
      paddingBottom: 10,
      width: "100%",
      height: "100%",
      marginLeft: 16,
    },
    dreamButton: {
      marginRight: 5,
      backgroundColor: theme.faintPrimary, //"#3d3d3d"
      paddingHorizontal: 6,
      paddingVertical: 6,
      borderRadius: 10,
      // opacity: 0.8
    },
    dreamText: {
      color: theme.textDisabled,
      fontSize: 14,
      fontWeight: "500",
    },
    selectedDreamButton: {
      marginRight: 5,
      backgroundColor: theme.lightPrimary, //"#343434",
      paddingHorizontal: 4.5,
      paddingVertical: 4.5,
      borderRadius: 10,
      borderWidth: 1.5,
      borderColor: theme.overlayPrimary,
    },
    selectedDreamText: {
      color: theme.textHigh,
      fontSize: 14,
      fontWeight: "500",
    },
  });
