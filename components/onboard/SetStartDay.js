import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { Color } from "../../GlobalStyles";

const options = [
  {
    label: "Today",
    subtext: "Tasks must be completed by",
    date: "7:30 PM, July 23",
  },
  {
    label: "Tomorrow",
    subtext: "Tasks must be completed by",
    date: "7:30 PM, July 24",
  },
];

const SetStartDay = () => {
  const [selectedOption, setSelectedOption] = useState("Today");

  return (
    <View style={styles.container}>
      <Text style={styles.promptText}>
        I want to complete my first day of tasks
      </Text>
      {options.map((option) => (
        <TouchableOpacity
          key={option.label}
          style={[
            styles.button,
            selectedOption === option.label && styles.buttonSelected,
          ]}
          onPress={() => setSelectedOption(option.label)}
        >
          <Text
            style={[
              styles.buttonTitleText,
              selectedOption === option.label && styles.buttonTitleTextSelected,
            ]}
          >
            {option.label}
          </Text>
          <View style={styles.descContainer}>
            <Text
              style={[
                styles.buttonDescText,
                selectedOption === option.label && styles.buttonDescTextSelected,
              ]}
            >
              {option.subtext}{" "}
            </Text>
            <Text
              style={[
                styles.buttonDateText,
                selectedOption === option.label && styles.buttonDescTextSelected,
              ]}
            >
              {option.date}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default SetStartDay;

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    gap: 20,
  },
  promptText: {
    color: "white",
    fontSize: 20,
    fontWeight: 600,
  },

  // Unselected button styles
  button: {
    // Base styles
    flexDirection: "column",
    gap: 12,
    borderRadius: 12,
    width: "100%",
    height: 100,
    justifyContent: "center",
    alignItems: "center",

    // Unselected
    borderWidth: 2,
    borderColor: "#ffffffb1",
  },
  buttonTitleText: {
    color: "#ffffffb1",
    fontSize: 18,
    fontWeight: 600,
  },
  buttonDescText: {
    color: "#ffffffb1",
    fontSize: 16,
  },
  buttonDateText: {
    color: "#ffffffb1",
    fontSize: 16,
    fontWeight: 'bold'
  },

  // Selected button styles
  buttonSelected: {
    backgroundColor: "#ffffff",
  },
  buttonTitleTextSelected: {
    color: Color.fervo_red,
  },
  buttonDescTextSelected: {
    color: Color.fervo_red,
  },

  descContainer: {
    flexDirection: 'row',
  },
});
