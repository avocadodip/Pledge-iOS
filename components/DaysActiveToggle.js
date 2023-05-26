import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Color } from "../GlobalStyles";

const DaysActiveToggle = ({ buttonCount, buttonTexts }) => {
  const [selectedButtons, setSelectedButtons] = useState(
    Array(buttonCount).fill(false)
  );

  const handleButtonPress = (index) => {
    setSelectedButtons((prevSelectedButtons) => {
      const newSelectedButtons = [...prevSelectedButtons];
      newSelectedButtons[index] = !newSelectedButtons[index];
      return newSelectedButtons;
    });
  };

  return (
    <View style={styles.container}>
      {buttonTexts.map((text, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.button,
            selectedButtons[index] ? styles.selectedButton : null,
          ]}
          onPress={() => handleButtonPress(index)}
        >
          <Text
            style={[
              styles.buttonText,
              selectedButtons[index] ? styles.selectedButtonText : null,
            ]}
          >
            {text}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: 28,
    height: 36,
    backgroundColor: "rgba(243,243,243,0.1)",
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 7,
    borderRadius: 10,
    marginRight: 8,
  },
  selectedButton: {
    backgroundColor: Color.white,
  },
  buttonText: {
    fontSize: 16,
    lineHeight: 15,
    textAlignVertical: 'bottom',
    color: Color.white,
  },
  selectedButtonText: {
    color: Color.fervo_red,
  },
});

export default DaysActiveToggle;