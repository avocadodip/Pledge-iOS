import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Color } from '../GlobalStyles';

const NextButton = ({ title }) => {
  return (
    <TouchableOpacity style={styles.nextButton}>
      <Text style={styles.nextButtonTitle}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  nextButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 61,
    borderRadius: 20,
    backgroundColor: Color.white,
    paddingHorizontal: 20,
  },
  nextButtonTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    lineHeight: 20,
    color: '#DD4F4F',
  },
});

export default NextButton;
