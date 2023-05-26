import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import { Color } from "../GlobalStyles";

import { ThemeContext } from "../hooks/ThemeContext";
import { classicTheme, darkTheme, lightTheme } from "../Themes";
import React, { useContext, useState } from "react";

const TimeButton = ({ defaultTime, amOnly, pmOnly }) => {
  const { chosenTheme, setChosenTheme } = useContext(ThemeContext);

  const getStyles = () => {
    return StyleSheet.create({
      button: {
        width: 120,
        height: 36,
        backgroundColor: chosenTheme.faintPrimary,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
      },
      timeText: {
        fontSize: 16,
        color: chosenTheme.primary,
      },
    })
  };

  const styles = getStyles();  

  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [selectedTime, setSelectedTime] = useState(moment(defaultTime, 'h:mm A').toDate());

  const showTimePicker = () => {
    setTimePickerVisibility(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  const handleTimeConfirm = (date) => {
  if (amOnly && moment(date).format('A') === 'PM') {
    // Adjust the time to the first available AM option
    date = moment(date).startOf('day').add(9, 'hours').toDate();
  } else if (pmOnly && moment(date).format('A') === 'AM') {
    // Adjust the time to the first available PM option
    date = moment(date).startOf('day').add(11, 'hours').toDate();
  }

  setSelectedTime(date);
  hideTimePicker();
  };
  

  const formatTime = (value) => {
    let formattedTime = moment(value).format('h:mm');
  
    if (amOnly) {
      formattedTime += ' AM';
    } else if (pmOnly) {
      formattedTime += ' PM';
    } else {
      formattedTime += ' ' + moment(value).format('A');
    }
  
    return formattedTime;
  };
  
  

  return (
    <>
      <TouchableOpacity style={styles.button} onPress={showTimePicker}>
        <Text style={styles.timeText}>
          {formatTime(selectedTime)}
        </Text>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        onConfirm={handleTimeConfirm}
        onCancel={hideTimePicker}
        minuteInterval={15}
        date={selectedTime}
        // textColor="black"
      />
    </>
  );
};

export default TimeButton;
