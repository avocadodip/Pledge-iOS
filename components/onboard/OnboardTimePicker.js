import React, { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import Modal from "react-native-modal";
import TouchableRipple from "../TouchableRipple";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useThemes } from "../../hooks/ThemesContext";
import { Color } from "../../GlobalStyles";
import BottomModal from "../BottomModal";
import GlowButton from "../GlowButton";

const HOURS = ["12", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"];
const MINUTES = ["00", "15", "30", "45"];

const OnboardTimePicker = ({ type, timePickerText, setTimePickerText }) => {
  const { theme, currentThemeName } = useThemes();
  const styles = getStyles(theme);

  const isValidTime = (time) => {
    return time && time.includes(':');
  };

  const getHourMinute = (time) => {
    if (isValidTime(time)) {
      let [hour, minute] = time.slice(0, -3).split(':');
      return { hour, minute };
    }
    return { hour: '7', minute: '30' };  // default values
  };

  let { hour: startHour, minute: startMinute } = getHourMinute(timePickerText.start);
  let { hour: endHour, minute: endMinute } = getHourMinute(timePickerText.end);

  const [isModalVisible, setModalVisible] = useState({
    start: false,
    end: false,
  });

  const [tempTime, setTempTime] = useState({
    startHour,
    startMinute,
    endHour,
    endMinute,
  });

  const toggleModal = (period) => {
    if (isModalVisible[period]) {
      // User is closing the modal, so we update the display text
      const formattedTime = `${tempTime[`${period}Hour`]}:${
        tempTime[`${period}Minute`]
      }`;
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
    // When modal is closed, set the display text to the selected time
    setTimePickerText((prev) => ({
      ...prev,
      [period]: formattedTime !== "7:30" ? formattedTime : "Pick time",
    }));
  };

  return (
    <>
      {type === "AM" ? (
        currentThemeName === "Dark" ? (
          <GlowButton
            height={42}
            width={125}
            color={"#e58d21"}
            onPress={() => toggleModal("start")}
          >
            <Text
              style={[
                styles.buttonText,
                timePickerText.start === "Pick time"
                  ? { opacity: 0.7 }
                  : { opacity: 1 },
              ]}
            >
              {timePickerText.start}
            </Text>
          </GlowButton>
        ) : (
          <TouchableOpacity
            style={styles.button}
            onPress={() => toggleModal("start")}
          >
            <Text
              style={[
                styles.buttonText,
                timePickerText.start === "Pick time"
                  ? { opacity: 0.7 }
                  : { opacity: 1 },
              ]}
            >
              {timePickerText.start}
            </Text>
          </TouchableOpacity>
        )
      ) : currentThemeName === "Dark" ? (
        <GlowButton
          height={42}
          width={125}
          color={"#8755f3"}
          onPress={() => toggleModal("end")}
        >
          <Text
            style={[
              styles.buttonText,
              timePickerText.end === "Pick time"
                ? { opacity: 0.7 }
                : { opacity: 1 },
            ]}
          >
            {timePickerText.end}
          </Text>
        </GlowButton>
      ) : (
        <TouchableOpacity
          style={styles.button}
          onPress={() => toggleModal("end")}
        >
          <Text
            style={[
              styles.buttonText,
              timePickerText.end === "Pick time"
                ? { opacity: 0.7 }
                : { opacity: 1 },
            ]}
          >
            {timePickerText.end}
          </Text>
        </TouchableOpacity>
      )}

      {/* AM MODAL */}
      <BottomModal
        isVisible={isModalVisible.start}
        onBackdropPress={() => {
          handleTimeSave("start");
          toggleModal("start");
        }}
        modalTitle={"Edit Start Time"}
      >
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
      </BottomModal>

      {/* PM MODAL */}
      <BottomModal
        isVisible={isModalVisible.end}
        onBackdropPress={() => {
          handleTimeSave("end");
          toggleModal("end");
        }}
        modalTitle={"Edit End Time"}
      >
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
      </BottomModal>
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
      height: 42,
      width: 130,
    },
    buttonText: {
      color: Color.white,
      fontSize: 23,
      fontWeight: 600,
    },

    // Modal and modal content styles
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
