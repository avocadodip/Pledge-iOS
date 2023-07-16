import React, { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import Modal from "react-native-modal";
import TouchableRipple from "../TouchableRipple";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useThemes } from "../../hooks/ThemesContext";
import { Color } from "../../GlobalStyles";

const HOURS = ["12", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"];
const MINUTES = ["00", "15", "30", "45"];
 
const OnboardTimePicker = ({ type, timePickerText, setTimePickerText }) => {
  const { theme } = useThemes();
  const styles = getStyles(theme);
  let dayStart = "7:30";
  let dayEnd = "7:30";
  const [isModalVisible, setModalVisible] = useState({
    start: false,
    end: false,
  });
  const [selectedTime, setSelectedTime] = useState({
    start: dayStart,
    end: dayEnd,
  });

  const [tempTime, setTempTime] = useState({
    startHour: dayStart.split(":")[0],
    startMinute: dayStart.split(":")[1],
    endHour: dayEnd.split(":")[0],
    endMinute: dayEnd.split(":")[1],
  });

  const toggleModal = (period) => {
    if (isModalVisible[period]) {
      // User is closing the modal, so we update the display text
      const formattedTime = `${tempTime[`${period}Hour`]}:${
        tempTime[`${period}Minute`]
      }`;
      setSelectedTime((prev) => ({ ...prev, [`${period}`]: formattedTime }));
      setTimePickerText((prev) => ({
        ...prev,
        [period]: `${formattedTime} ${period === "start" ? "AM" : "PM"}`,
      }));
    }

    // Toggle the modal visibility
    setModalVisible((prev) => ({ ...prev, [period]: !prev[period] }));
  };

  const handleTimeSave = (period) => {
    let formattedTime = `${tempTime[`${period}Hour`]}:${
      tempTime[`${period}Minute`]
    }`;
    setSelectedTime((prev) => ({ ...prev, [`${period}`]: formattedTime }));
    // When modal is closed, set the display text to the selected time
    setTimePickerText((prev) => ({
      ...prev,
      [period]: formattedTime !== "7:30" ? formattedTime : "Pick time",
    }));
  };

  return (
    <>
      {type === "AM" ? (
        <TouchableOpacity
          style={styles.button}
          onPress={() => toggleModal("start")}
        >
          <Text style={styles.buttonText}>{timePickerText.start}</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.button}
          onPress={() => toggleModal("end")}
        >
          <Text style={styles.buttonText}>{timePickerText.end}</Text>
        </TouchableOpacity>
      )}

      {/* AM MODAL */}
      <Modal
        style={styles.bottomModal}
        isVisible={isModalVisible.start}
        onBackdropPress={() => {
          handleTimeSave("start");
          toggleModal("start");
        }}
        backdropTransitionOutTiming={0}
        animationOutTiming={500}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Day Start Time</Text>
          <View style={styles.timePickerContainer}>
            <Picker
              style={styles.timePicker}
              selectedValue={tempTime.startHour}
              onValueChange={(itemValue) =>
                setTempTime((prev) => ({ ...prev, startHour: itemValue }))
              }
              selectionColor={"transparent"} // doesn't work
            >
              {HOURS.map((time, index) => (
                <Picker.Item
                  color={Color.white}
                  key={index}
                  label={time}
                  value={time}
                />
              ))}
            </Picker>
            <Text style={styles.timePickerText}>:</Text>
            <Picker
              style={styles.timePicker}
              selectedValue={tempTime.startMinute}
              onValueChange={(itemValue) =>
                setTempTime((prev) => ({ ...prev, startMinute: itemValue }))
              }
            >
              {MINUTES.map((time, index) => (
                <Picker.Item
                  color={Color.white}
                  key={index}
                  label={time}
                  value={time}
                />
              ))}
            </Picker>
            <Text style={styles.timePickerText}>AM</Text>
          </View>
        </View>
      </Modal>

      {/* PM MODAL */}
      <Modal
        style={styles.bottomModal}
        isVisible={isModalVisible.end}
        onBackdropPress={() => {
          handleTimeSave("end");
          toggleModal("end");
        }}
        backdropTransitionOutTiming={0}
        animationOutTiming={500}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Day End Time</Text>
          <View style={styles.timePickerContainer}>
            <Picker
              style={styles.timePicker}
              selectedValue={tempTime.endHour}
              onValueChange={(itemValue) =>
                setTempTime((prev) => ({ ...prev, endHour: itemValue }))
              }
              selectionColor={"transparent"} // doesn't work
            >
              {HOURS.map((time, index) => (
                <Picker.Item
                  color={Color.white}
                  key={index}
                  label={time}
                  value={time}
                />
              ))}
            </Picker>
            <Text style={styles.timePickerText}>:</Text>
            <Picker
              style={styles.timePicker}
              selectedValue={tempTime.endMinute}
              onValueChange={(itemValue) =>
                setTempTime((prev) => ({ ...prev, endMinute: itemValue }))
              }
            >
              {MINUTES.map((time, index) => (
                <Picker.Item
                  color={Color.white}
                  key={index}
                  label={time}
                  value={time}
                />
              ))}
            </Picker>
            <Text style={styles.timePickerText}>PM</Text>
          </View>
        </View>
      </Modal>
    </>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    // button styles
    button: {
      borderRadius: 5,
      overflow: "hidden",
      backgroundColor: "rgba(255, 255, 255, 0.12)",
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 7,
      width: 120,
    },
    buttonText: {
      color: Color.white,
      fontSize: 23,
      fontWeight: 600,
    },

    // Modal and modal content styles
    bottomModal: {
      justifyContent: "flex-end",
      marginBottom: 30,
    },
    modalContent: {
      flexDirection: "col",
      backgroundColor: Color.fervo_red,
      paddingTop: 22,
      paddingBottom: 26,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 20,
      borderColor: "rgba(0, 0, 0, 0.1)",
      overflow: "hidden",
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 500,
      marginBottom: 1,
      color: Color.white,
    },
    timePickerContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    timePicker: {
      // borderColor: "black",
      // borderWidth: 1,
      width: 100,
      marginVertical: 15,
    },
    timePickerText: {
      color: Color.white,
      fontSize: 20,
    },
  });

export default OnboardTimePicker;
