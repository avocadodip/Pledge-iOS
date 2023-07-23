import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Modal from "react-native-modal";
import { Color } from "../GlobalStyles";
import { useThemes } from "../hooks/ThemesContext";
import { LinearGradient } from "expo-linear-gradient";

const BottomModal = ({ isVisible, children, onBackdropPress, modalTitle }) => {
  const { theme, backgroundGradient } = useThemes();
  const styles = getStyles(theme);

  return (
    <Modal
      style={styles.bottomModal}
      isVisible={isVisible}
      onBackdropPress={onBackdropPress}
      backdropTransitionOutTiming={0}
      animationOutTiming={500}
    >
      <LinearGradient colors={backgroundGradient} style={styles.modalContainer}>
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
      height: 350,
    },
    modalContent: {
        flexDirection: "col",
        paddingTop: 22,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 20,
        borderColor: "rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
      },
      modalTitle: {
        fontSize: 18,
        fontWeight: 500,
        marginBottom: 1,
        color: Color.white,
      },
  });

export default BottomModal;
