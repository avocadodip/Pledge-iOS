import React, { useCallback, useContext, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { useBottomSheet } from "../BottomSheetContext";
import PledgeDollarIcon from "../assets/icons/pledge-dollar-icon.svg";
import FolderIcon from "../assets/icons/amount-folder-icon.svg";
import DescriptLinesIcon from "../assets/icons/descript-lines-icon.svg";
import { Color } from "../GlobalStyles";

export default function TodoBottomSheet() {
  const { isBottomSheetOpen, setIsBottomSheetOpen, selectedTodo } =
    useBottomSheet();
  const bottomSheetRef = useRef(null);
  const snapPoints = ["75%"];

  const handleSheetChanges = (index) => {
    if (index === -1) {
      setIsBottomSheetOpen(false);
    }
  };

  // renders
  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    []
  );

  return isBottomSheetOpen ? (
    <BottomSheet
      ref={bottomSheetRef}
      index={isBottomSheetOpen ? 0 : -1}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      onChange={handleSheetChanges}
      backgroundStyle={{ backgroundColor: Color.fervo_red }}
      backdropComponent={renderBackdrop}
      handleComponent={() => (
        <View style={styles.dragHandleContainer}>
          <View style={styles.dragHandle}></View>
        </View>
      )}
    >
      <View style={styles.bottomSheetContainer}>
        <View style={styles.numberTitleContainer}>
          <Text style={styles.number}>{selectedTodo.todoNumber}</Text>
          <Text style={styles.title}>{selectedTodo.title}</Text>
        </View>
        <View style={styles.horizontalDivider} />
        <View style={styles.amountFolderContainer}>
          <PledgeDollarIcon />
          <Text style={styles.text}>{selectedTodo.amount}</Text>
        </View>
        <View style={styles.horizontalDivider} />
        <View style={styles.amountFolderContainer}>
          <FolderIcon />
          <Text style={styles.text}>{selectedTodo.tag}</Text>
        </View>
        <View style={styles.horizontalDivider} />
        <View style={styles.descriptionContainer}>
          <DescriptLinesIcon />
          <Text style={styles.text}>{selectedTodo.description}</Text>
        </View>
      </View>
    </BottomSheet>
  ) : null;
}

const styles = StyleSheet.create({
  bottomSheetContainer: {
    backgroundColor: Color.fervo_red,
    flex: 1,
    flexDirection: "col",
    paddingHorizontal: 20,
  },
  bottomSheetTabBar: {
    backgroundColor: Color.fervo_red,
  },
  dragHandleContainer: {
    alignSelf: "center",
  },
  dragHandle: {
    width: 45,
    height: 4,
    borderRadius: 3,
    backgroundColor: "white",
    marginTop: 15,
  },
  horizontalDivider: {
    borderBottomColor: "white",
    opacity: 0.3,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
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
    marginVertical: 18,
  },
  descriptionContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 23,
    marginVertical: 18,
  },
  number: {
    color: "white",
    fontSize: 40,
    fontWeight: "bold",
  },
  title: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
  },
  text: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 25
  },
});
