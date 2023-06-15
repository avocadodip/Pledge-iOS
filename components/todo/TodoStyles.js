import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  numberContainer: {
    flexDirection: "column",
    width: "100%",
    height: "26%",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 15,
    overflow: 'hidden'
  },
  numberText: {
    color: "white",
    fontSize: 70,
    fontWeight: "bold",
  },
  finedContainer: {
    flexDirection: "column",
    width: "100%",
    height: "27%",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 15,
  },
  oneContainer: {
    flexDirection: "column",
    width: "100%",
    height: "27%",
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
    height: "27%",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 16,
    overflow: "hidden"
  },
  animatedLeftContainer: {

  },
  leftContainer: {
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    flex: 8,
    // width: "80%",

    height: "100%",
  },
  animatedRightContainer: {

  },
  rightContainer: {
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
  // infoContainer: {
  //   flexDirection: "row",
  //   width: "100%",
  //   height: "25%",
  //   justifyContent: "space-between",
  //   alignItems: "center",
  // },
  // leftContainer: {
  //   borderTopLeftRadius: 16,
  //   borderBottomLeftRadius: 16,
  //   backgroundColor: "rgba(255, 255, 255, 0.1)",
  //   // flex: 8,
  //   width: "80%",
  //   height: "100%",
  //   padding: 15,
  // },
  // rightContainer: {
  //   borderTopRightRadius: 16,
  //   borderBottomRightRadius: 16,
  //   backgroundColor: "rgba(255, 255, 255, 0.2)",
  //   // flex: 2,
  //   width: "20%",
  //   height: "100%",
  //   justifyContent: "center",
  //   alignItems: "center",
  // },
  upperHalfContainer: {
    flex: 4,
  },
  numberTitleContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 15,
    // borderWidth: 1,
    // borderColor: 'black',
    height: "100%",
    overflow: "hidden",
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
  tagContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-start",
  },
  tagBackground: {
    backgroundColor:
      "linear-gradient(0deg, rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.07)), rgba(255, 255, 255, 0.07)",
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 13,
  },
  amountContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor:
      "linear-gradient(0deg, rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.07)), rgba(255, 255, 255, 0.07)",
    borderRadius: 10,
    paddingVertical: 4,
    maxWidth: 80,
    alignSelf: "stretch",
  },
  todoNumber: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
  },
  todoTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "700",
  },
  todoTag: {
    color: "white",
    fontWeight: "500",
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
  todoAmount: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
  },

  finedText: {
    color: "white",
    opacity: 0.7,
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
  }
});
