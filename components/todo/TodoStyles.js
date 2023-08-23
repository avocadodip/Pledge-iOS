import { StyleSheet } from "react-native";

const TODO_HEIGHT = "30.5%";
const BORDER_RADIUS = 24;

// Task name || "more..."
export const variableFontSize = (text, isMore) => {
  let length = text.length;

  if (length < 10) {
    if (isMore) return 20;
    return 35; // Large font size
  } else if (length < 15) {
    if (isMore) return 18;
    return 30; // Medium font size
  } else if (length < 20) {
    if (isMore) return 16;
    return 25; // Medium font size
  } else {
    if (isMore) return 14;
    return 20; // Small font size
  }
};

export const getTodoStyles = (theme) =>
  StyleSheet.create({
    numberContainer: {
      flexDirection: "column",
      width: "100%",
      height: TODO_HEIGHT,
      justifyContent: "center",
      alignItems: "center",
      gap: 20,
      borderRadius: BORDER_RADIUS,
      backgroundColor: theme.lightPrimary,
      padding: 15,
      overflow: "hidden",
    },
    numberText: {
      color: theme.primary,
      fontSize: 70,
      fontWeight: "bold",
    },
    finedContainer: {
      flexDirection: "column",
      width: "100%",
      height: TODO_HEIGHT,
      justifyContent: "center",
      alignItems: "center",
      gap: 20,
      borderRadius: BORDER_RADIUS,
      backgroundColor: theme.faintPrimary,
      padding: 15,
    },
    oneContainer: {
      flexDirection: "column",
      width: "100%",
      height: TODO_HEIGHT,
      justifyContent: "center",
      alignItems: "center",
      gap: 28,
      borderRadius: 16,
      backgroundColor: theme.faintPrimary,
      padding: 15,
    },
    infoContainer: {
      flexDirection: "row",
      width: "100%",
      height: TODO_HEIGHT,
      borderRadius: BORDER_RADIUS,
      overflow: "hidden",
      // borderWidth: 1,
      // borderColor: "black",
    },

    // Left styles (scroll down more for right styles)
    leftContainer: {
      backgroundColor: theme.faintPrimary,
      height: "100%",
      flex: 8,
    },
    leftContainerInner: {
      display: "flex",
      justifyContent: "center",
      height: "100%",
    },

    // TAG
    tagContainer: {
      position: "absolute",
      left: 14,
      top: 14,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.faintPrimary,
      borderRadius: 8,
      paddingVertical: 6,
      paddingHorizontal: 8,
    },
    tagText: {
      color: theme.primary,
      fontSize: 12,
      lineHeight: 12,
      fontWeight: 500,
    },

    // TITLE/DESCRIPTION
    titleContainer: {
      width: "100%",
      flexDirection: "row",
      alignItems: "baseline",
    },
    moreText: {
      color: "#ffffff83",
      fontSize: 20,
      fontWeight: "700",
    },
    titleText: {
      color: theme.primary,
      fontSize: 40,
      fontWeight: "700",
    },

    // AMOUNT
    amountContainer: {
      position: "absolute",
      left: 14,
      bottom: 14,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.faintPrimary,
      borderRadius: 8,
      height: 35,
      padding: 5,
      paddingHorizontal: 12,
    },
    amountText: {
      color: theme.primary,
      fontSize: 20,
      fontWeight: "bold",
    },

    // Right styles
    rightContainer: {
      borderTopRightRadius: 16,
      borderBottomRightRadius: 16,
      backgroundColor: theme.lightPrimary,
      flex: 2,
      height: "100%",
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
    },
    rightDisabledContainer: {
      borderTopRightRadius: 16,
      borderBottomRightRadius: 16,
      backgroundColor: theme.faintPrimary,
      flex: 2,
      height: "100%",
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
      borderLeftWidth: 1.5,
      borderLeftColor: theme.faintPrimary,
    },
    checkDisabledContainer: {
      borderTopRightRadius: 16,
      borderBottomRightRadius: 16,
      backgroundColor: theme.faintPrimary,
      flex: 2,
      // width: "20%",
      height: "100%",
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
    },
    disabledOpacity: {
      opacity: 0.6,
    },
    disabledCompleteContainer: {
      borderTopRightRadius: 16,
      borderBottomRightRadius: 16,
      backgroundColor: theme.lightPrimary,
      flex: 2,
      // width: "20%",
      height: "100%",
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
    },
    upperHalfContainer: {
      flex: 4,
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
    todoNumber: {
      color: theme.primary,
      fontSize: 30,
      fontWeight: "bold",
    },
    descriptionContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    todoDescription: {
      color: theme.primary,
      maxWidth: "80%",
      fontWeight: "500",
    },

    finedText: {
      color: theme.textDisabled,
      fontSize: 22,
      fontWeight: "bold",
    },

    infoText: {
      color: theme.primary,
      opacity: 1,
      fontSize: 20,
      fontWeight: "bold",
      lineHeight: 20,
      // borderColor: "black",
      // borderWidth: 1,
    },

    todoButton: {
      flexDirection: "row",
      gap: 10,
      backgroundColor: theme.faintPrimary,
      paddingHorizontal: 20,
      paddingVertical: 10,
      alignItems: "center",
      borderRadius: 10,
      // borderWidth: 1,
      // borderColor: "black",
    },

    todoButtonText: {
      color: theme.primary,
      fontWeight: "bold",
      fontSize: 20,
      // borderWidth: 1,
      // borderColor: "black",
    },
  });
