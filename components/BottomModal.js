import React, { useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import { Color } from "../GlobalStyles";
import { useThemes } from "../hooks/ThemesContext";
import { LinearGradient } from "expo-linear-gradient";
import XMarkIcon from "../assets/icons/x-mark.svg";
import { Button } from "react-native";

const BottomModal = ({ isVisible, children, onBackdropPress, modalTitle }) => {
  const { theme, backgroundGradient } = useThemes();
  const styles = getStyles(theme);
  const timerRef = useRef(null);

  // Prevent user from double tapping to re-open
  const throttledOnPress = () => {
    if (!timerRef.current) {
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
      }, 500);
      onBackdropPress();
    }
  };


  return (
    <Modal
      style={styles.bottomModal}
      isVisible={isVisible}
      onBackdropPress={throttledOnPress}
      backdropTransitionOutTiming={0}
      animationOutTiming={500}
    >
      <LinearGradient colors={backgroundGradient} style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.closeButtonContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={throttledOnPress}>
              <XMarkIcon width={20} height={20} color={theme.primary} />
            </TouchableOpacity>
          </View>

          <Text style={styles.modalTitle}>{modalTitle}</Text>
          {children}
        </View>
      </LinearGradient>
    </Modal>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    bottomModal: {
      justifyContent: "flex-end",
      marginBottom: 30,
    },
    modalContainer: {
      flexDirection: "col",
      backgroundColor: theme.accent,
      alignItems: "center",
      borderRadius: 20,
      borderColor: "rgba(0, 0, 0, 0.1)",
      overflow: "hidden",

      borderWidth: 3,
      borderColor: "#ffffff0b",
    },
    modalContent: {
      width: "100%",
      paddingHorizontal: 17,
      paddingVertical: 17,
      flexDirection: "col",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 20,
      overflow: "hidden",
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 500,
      marginBottom: 20,
      color: theme.primary,
    },

    // Close button styles
    closeButtonContainer: {
      position: "absolute",
      top: 11,
      right: 15,
    },
    closeButton: {
      borderRadius: 20,
      backgroundColor: "#ffffff2a",
      flex: 1,
      width: "100%",
      borderRadius: 20,
      padding: 6,
    },
  });

export default BottomModal;
