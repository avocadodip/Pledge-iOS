import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Color } from "../GlobalStyles";

import { ThemeContext } from "../hooks/ThemeContext";
import { classicTheme, darkTheme, lightTheme } from "../Themes";
import React, { useContext, useState } from "react";

const ToggleButtons = ({ buttonCount, buttonTexts, onButtonPress}) => {
  const { chosenTheme, setChosenTheme } = useContext(ThemeContext);

  const getStyles = () => {
    return StyleSheet.create({
      container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      },
      button: {
        width: 70,
        height: 36,
        backgroundColor: chosenTheme.faintPrimary,
        alignItems: "center",
        paddingTop: 10,
        paddingBottom: 10,
        paddingHorizontal: 7,
        borderRadius: 10,
        marginRight: 8,
      },
      selectedButton: {
        backgroundColor: chosenTheme.primary,
      },
      buttonText: {
        fontSize: 16,
        lineHeight: 15,
        textAlignVertical: 'bottom',
        color: chosenTheme.primary,
      },
      selectedButtonText: {
        color: chosenTheme.accent,
      },
    })
  };

  const styles = getStyles();  

  const [selectedButton, setSelectedButton] = useState(0);

  const handleButtonPress = (index) => {
    setSelectedButton(index);
    onButtonPress(index);
  };

  return (
    <View style={styles.container}>
      {buttonTexts.map((text, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.button,
            selectedButton === index ? styles.selectedButton : null,
          ]}
          onPress={() => handleButtonPress(index)}
        >
          <Text
            style={[
              styles.buttonText,
              selectedButton === index ? styles.selectedButtonText : null,
            ]}
          >
            {text}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default ToggleButtons;