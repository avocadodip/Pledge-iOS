import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import { Color } from "../GlobalStyles";

const TimeButton = ({ defaultTime }) => {
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [selectedTime, setSelectedTime] = useState(moment(defaultTime, 'h:mm A').toDate());

  const showTimePicker = () => {
    setTimePickerVisibility(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  const handleTimeConfirm = (date) => {
    setSelectedTime(date);
    hideTimePicker();
  };

  const formatTime = (value) => {
    return moment(value).format('h:mm A');
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
      />
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 120,
    height: 36,
    backgroundColor: "rgba(243,243,243,0.1)",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  timeText: {
    fontSize: 16,
    color: Color.white,
  },
});

export default TimeButton;
