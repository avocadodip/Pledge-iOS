import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Color } from '../GlobalStyles';

import { ThemeContext } from "../hooks/ThemeContext";
import { classicTheme, darkTheme, lightTheme } from "../Themes";
import React, { useContext, useState } from "react";

const NextButton = ({ title }) => {
  const { chosenTheme, setChosenTheme } = useContext(ThemeContext);

  const getStyles = () => {
    return StyleSheet.create({
      nextButton: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 61,
        borderRadius: 20,
        backgroundColor: chosenTheme.primary,
        paddingHorizontal: 20,
      },
      nextButtonTitle: {
        fontWeight: 'bold',
        fontSize: 20,
        lineHeight: 20,
        color: chosenTheme.accent,
      },
    })
  };

  const styles = getStyles();  

  return (
    <TouchableOpacity style={styles.nextButton}>
      <Text style={styles.nextButtonTitle}>{title}</Text>
    </TouchableOpacity>
  );
};

export default NextButton;
