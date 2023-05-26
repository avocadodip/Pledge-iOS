import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Color } from '../GlobalStyles';
import NextButton from './NextButton';

const OnboardingPopup = ({ texts, buttonTitle, secondButtonTitle }) => {
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

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999, // Ensure a higher value than other components
  },
  frame: {
    width: 387,
    backgroundColor: '#DD4F4F',
    borderWidth: 3,
    borderColor: Color.white,
    borderRadius: 15,
    padding: 40,
    gap: 30,
    flexDirection: 'column', // Change to column direction
    alignItems: 'flex-start', // Align left
  },
  text: {
    fontSize: 20,
    lineHeight: 30,
    color: '#FFFFFF',
    flexShrink: 1,
  },
  boldText: {
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: 20,
    gap: 10,
  },
});

export default OnboardingPopup;
