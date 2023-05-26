import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Color } from '../GlobalStyles';
import NextButton from './NextButton';

import { ThemeContext } from "../ThemeContext";
import { classicTheme, darkTheme, lightTheme } from "../Themes";
import React, { useContext, useState } from "react";

const OnboardingPopup = ({ texts, buttonTitle, secondButtonTitle }) => {
  const { chosenTheme, setChosenTheme } = useContext(ThemeContext);

  const getStyles = () => {
    return StyleSheet.create({
      overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999, // Ensure a higher value than other components
      },
      frame: {
        width: 387,
        backgroundColor: chosenTheme.accent,
        borderWidth: 3,
        borderColor: chosenTheme.primary,
        borderRadius: 15,
        padding: 40,
        gap: 30,
        flexDirection: 'column', // Change to column direction
        alignItems: 'flex-start', // Align left
      },
      text: {
        fontSize: 20,
        lineHeight: 30,
        color: chosenTheme.primary,
        flexShrink: 1,
      },
      boldText: {
        fontWeight: 'bold',
      },
      buttonContainer: {
        marginTop: 20,
        gap: 10,
      },
    })
  };

  const styles = getStyles();  

  return (
    <View style={styles.overlay}>
      <View style={styles.frame}>
        {texts.map((text, index) => (
          <Text
            key={index}
            style={[styles.text, index === 0 ? styles.boldText : null]}
          >
            {text}
          </Text>
        ))}
        <View style={styles.buttonContainer}>
          <NextButton title={buttonTitle} />
          {secondButtonTitle && (
            <TouchableOpacity
              style={styles.secondButton}
              title={secondButtonTitle}
            >
              <Text
                style={[styles.text, { textDecorationLine: 'underline' }]}
              >
              {secondButtonTitle}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default OnboardingPopup;
