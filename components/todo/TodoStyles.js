import { StyleSheet } from "react-native";

const TODO_HEIGHT = "31%";
const BORDER_RADIUS = 24;

export const variableFontSize = (text) => {
  let length = text.length;

  if (length < 10) {
    return 35; // Large font size
  } else if (length < 15) {
    return 32; // Medium font size
  } else if (length < 20) {
    return 27; // Medium font size
  } else {
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
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      padding: 15,
      overflow: "hidden",
    },
    numberText: {
      color: "white",
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
      backgroundColor: "rgba(255, 255, 255, 0.1)",
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
      backgroundColor: "rgba(255, 255, 255, 0.1)",
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
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      height: "100%",

      flex: 8,
      display: "flex",
      padding: 16,
      flexDirection: "column",
      justifyContent: "flex-end",
      alignItems: "flex-start",
      gap: 6,
      // borderWidth: 1,
      // borderColor: "blue",
    },
    leftContainerInner: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      height: '100%',
      // borderWidth: 1,
      // borderColor: "purple",
    },
    tagTitleContainer: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end",
      alignItems: "flex-start",
      gap: 3,
      height: 93,
      alignSelf: "stretch",
      // borderWidth: 1,
      // borderColor: "white",
      width: "100%",
    },
    amountContainer: {
      justifyContent: "flex-end",
      alignItems: "center",
      backgroundColor:
        "linear-gradient(0deg, rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.07)), rgba(255, 255, 255, 0.07)",
      borderRadius: 8,
      // width: 57,
      height: 35,
      padding: 5,
      paddingHorizontal: 12,
      // borderWidth: 1,
      // borderColor: "white",

      display: 'flex',
      alignSelf: 'flex-start',
    },
    tagContainer: {
      justifyContent: "center",
      alignItems: "center",
      backgroundColor:
        "linear-gradient(0deg, rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.07)), rgba(255, 255, 255, 0.07)",
      borderRadius: 8,
      // paddingVertical: 8,
      paddingHorizontal: 10,
      height: 24,
      // borderWidth: 1,
      // borderColor: "white",
    },
    tagText: {
      color: "white",
      fontSize: 12,
      lineHeight: 12,
      fontWeight: 500,
    },
    titleContainer: {
      height: 66,
      width: "100%",
      justifyContent: "center",
      // borderWidth: 1,
      // borderColor: "green",
    },
    titleText: {
      color: "white",
      fontSize: 40,
      fontWeight: "700",
    },
    amountText: {
      color: "white",
      fontSize: 20,
      lineHeight: 19,
      fontWeight: "bold",
    },

    // Right styles
    rightContainer: {
      borderTopRightRadius: 16,
      borderBottomRightRadius: 16,
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      flex: 2,
      height: "100%",
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
    },
    rightDisabledContainer: {
      borderTopRightRadius: 16,
      borderBottomRightRadius: 16,
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      flex: 2,
      // width: "20%",
      height: "100%",
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
      borderLeftWidth: 1.5,
      borderLeftColor: "rgba(255, 255, 255, 0.1)",
    },
    checkDisabledContainer: {
      borderTopRightRadius: 16,
      borderBottomRightRadius: 16,
      backgroundColor: "rgba(255, 255, 255, 0.1)",
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
      backgroundColor: "rgba(255, 255, 255, 0.2)",
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
      color: "white",
      fontSize: 30,
      fontWeight: "bold",
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

    finedText: {
      color: theme.textDisabled,
      fontSize: 22,
      fontWeight: "bold",
    },

    infoText: {
      color: "white",
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
      backgroundColor: "rgba(0, 0, 0, 0.2)",
      paddingHorizontal: 20,
      paddingVertical: 10,
      alignItems: "center",
      borderRadius: 10,
      // borderWidth: 1,
      // borderColor: "black",
    },

    todoButtonText: {
      color: "white",
      fontWeight: "bold",
      fontSize: 20,
      // borderWidth: 1,
      // borderColor: "black",
    },
  });
