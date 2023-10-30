import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity, // Import TouchableOpacity
  View,
} from "react-native";
import React, { useState } from "react";
import { useThemes } from "../../hooks/ThemesContext";
import { useSettings } from "../../hooks/SettingsContext";
import { addDoc, collection, doc } from "firebase/firestore";
import { db } from "../../database/firebase";
import { useDayChange } from "../../hooks/useDayChange";
import { LinearGradient } from "expo-linear-gradient";

const AddDreamModal = ({ modalVisible, setModalVisible }) => {
  const [dreamTitle, setDreamTitle] = useState("");
  const { theme, backgroundGradient, currentThemeName } = useThemes();
  const { currentUserID } = useSettings();
  const { todayDate } = useDayChange();
  const styles = getStyles(theme);

  const addDream = async () => {
    try {
      // Get a reference to the dreams collection for the current user
      const dreamsCollection = collection(
        doc(db, "users", currentUserID),
        "dreams"
      );

      // Create a new document in the dreams collection with the provided data
      const newDreamRef = await addDoc(dreamsCollection, {
        title: dreamTitle,
        amountPledged: 0,
        doneCount: 0,
        lastCompleted: null,
        streak: 0,
        createdAt: todayDate,
      });

      setDreamTitle("");

      console.log("New dream added with ID: ", newDreamRef.id);
    } catch (e) {
      console.error("Error adding dream: ", e);
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
      animationInTiming={1000} // Make modal leave slower
    >
      <TouchableOpacity // Wrap centeredView with TouchableOpacity to handle outside modal taps
        style={styles.overlay}
        onPress={() => setModalVisible(!modalVisible)}
        activeOpacity={1}
      >
        <View style={styles.centeredView}>
          <LinearGradient colors={backgroundGradient} style={styles.modalView}>
            <TextInput
              style={styles.modalTextInput}
              placeholder="ex. publish a book"
              placeholderTextColor={theme.textMedium} // Set placeholder text color
              onChangeText={(text) => setDreamTitle(text)}
              value={dreamTitle}
              maxLength={50} // Set max character length to 30
              autoFocus={true}
            />
            <TouchableHighlight
              style={[
                styles.addButton,
                { opacity: dreamTitle.length < 7 ? 0.5 : 1 },
              ]}
              onPress={() => {
                addDream();
                setModalVisible(!modalVisible);
              }}
              underlayColor={theme.faintPrimary}
              disabled={dreamTitle.length < 7}
            >
              <LinearGradient
                colors={
                  currentThemeName === "Dark"
                    ? ["#F13434", "#E89C44"]
                    : [theme.faintPrimary, theme.faintPrimary]
                }
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 10,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={styles.addButtonText}>Add dream</Text>
              </LinearGradient>
            </TouchableHighlight>
          </LinearGradient>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default AddDreamModal;

const getStyles = (theme) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.5)", // Everything around modal dims
    },
    centeredView: {
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22,
      width: "100%",
      paddingHorizontal: 20,
    },
    modalView: {
      width: "100%",
      paddingVertical: 25,
      paddingHorizontal: 35,
      backgroundColor: theme.accent,
      borderRadius: 20,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    modalTextInput: {
      marginBottom: 15,
      width: "100%", // Make TextInput wider
      height: 50, // Make TextInput bigger
      fontSize: 20, // Set text size
      color: theme.textHigh, // Set text color
    },
    addButton: {
      width: "100%",
      height: 40,
      borderRadius: 10,
      elevation: 2,
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
    },
    addButtonText: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center",
      fontSize: 16,
    },
  });
