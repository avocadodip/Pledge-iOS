import React, { useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import { Color } from "../GlobalStyles";
import { useThemes } from "../hooks/ThemesContext";
import { LinearGradient } from "expo-linear-gradient";
import XMarkIcon from "../assets/icons/x-mark.svg";

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
        <View style={styles.closeButtonContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={throttledOnPress}
          >
            <XMarkIcon width={20} height={20} color={theme.primary} />
          </TouchableOpacity>
        </View>
        <View style={styles.modalContent}>
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
    },
    modalContent: {
      flexDirection: "col",
      paddingTop: 22,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 20,
      borderColor: "rgba(0, 0, 0, 0.1)",
      overflow: "hidden",

      //   borderColor: "black",
      //   borderWidth: 1,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 500,
      marginBottom: 1,
      color: theme.primary,
    },

    // Close button styles
    closeButtonContainer: {
      position: "absolute",
      top: 15,
      right: 15,
    },
    closeButton: {
      borderRadius: 20,
      backgroundColor: "#ffffff2a",
      flex: 1,
      width: "100%",
      borderRadius: 20,
      padding: 4,
    },
  });

export default BottomModal;
