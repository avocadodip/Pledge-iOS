import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Color } from '../GlobalStyles';
import NextButton from './NextButton';

const OnboardingPopup = ({ texts, buttonTitle }) => {
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
        <NextButton title={buttonTitle} />
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
    flexDirection: 'row',
    flexWrap: 'wrap',
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
});

export default OnboardingPopup;
