import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../database/firebase"; 
import ContentLoader, { Rect } from "react-content-loader/native";
import { useDayStatus } from "../../hooks/DayStatusContext";
import { useSettings } from "../../hooks/SettingsContext";
import BottomModal from "../BottomModal";
import { useThemes } from "../../hooks/ThemesContext";
import { useDayChange } from "../../hooks/useDayChange";

const HOURS = ["12", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"];
const MINUTES = ["00", "15", "30", "45"];
const CONTENT_LOADER_HEIGHT = 25;
const CONTENT_LOADER_WIDTH = 60;
 
const TmrwTimePicker = ({ altMessage }) => {
  const { theme } = useThemes();
  const styles = getStyles(theme);
  const { currentUserID } = useSettings();
  const { tmrwDOW } = useDayChange();
  const {
    settings: { dayStart, dayEnd },
  } = useSettings();  
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

  useEffect(() => {
    if (dayStart && dayEnd) {
      setSelectedTime({ start: dayStart, end: dayEnd });
      setTempTime({
        startHour: dayStart.split(":")[0],
        startMinute: dayStart.split(":")[1],
        endHour: dayEnd.split(":")[0],
        endMinute: dayEnd.split(":")[1],
      });
    }
  }, [dayStart, dayEnd]);

  const toggleModal = (period) => {
    setModalVisible((prev) => ({ ...prev, [period]: !prev[period] }));
  };

  const handleTimeSave = async (period) => {
    let formattedTime = `${tempTime[`${period}Hour`]}:${
      tempTime[`${period}Minute`]
    }`;
    setSelectedTime((prev) => ({ ...prev, [`${period}`]: formattedTime }));
    let fieldToUpdate = period === "start" ? "dayStart" : "dayEnd";
    await updateDoc(doc(db, "users", currentUserID), {
      [fieldToUpdate]: formattedTime,
    });
    toggleModal(period);
  };

  return (
    <View>
      {/* HEADER MESSAGE LINE */}

      <View style={styles.headerMessageContainer}>
        {altMessage ? (
          <Text style={styles.headerMessageText}>Day will open at </Text>
        ) : (
          <Text style={styles.headerMessageText}>Tmrw will start at </Text>
        )}

        {dayStart == "" || !dayStart ? (
          <View style={styles.contentLoaderContainer}>
            <ContentLoader
              speed={0.6}
              height={CONTENT_LOADER_HEIGHT}
              width={CONTENT_LOADER_WIDTH}
              backgroundColor="#e16564"
              foregroundColor="#f27b7b"
            >
              <Rect width="100%" height="100%" />
            </ContentLoader>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => toggleModal("start")}
          >
            <Text style={styles.headerButtonText}>
              {`${selectedTime.start} AM`}
            </Text>
          </TouchableOpacity>
        )}

        <Text style={styles.headerMessageText}> and end at </Text>

        {dayEnd == "" || !dayEnd ? (
          <View style={styles.contentLoaderContainer}>
            <ContentLoader
              speed={0.6}
              height={CONTENT_LOADER_HEIGHT}
              width={CONTENT_LOADER_WIDTH}
              backgroundColor="#e16564"
              foregroundColor="#f27b7b"
            >
              <Rect width="100%" height="100%" />
            </ContentLoader>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => toggleModal("end")}
          >
            <Text style={styles.headerButtonText}>
              {`${selectedTime.end} PM`}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* AM MODAL */}
      <BottomModal
        // style={styles.bottomModal}
        isVisible={isModalVisible.start}
        onBackdropPress={() => handleTimeSave("start")}
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
                color={theme.primary}
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
                color={theme.primary}
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
        onBackdropPress={() => handleTimeSave("end")}
        modalTitle={"Edit Deadline"}
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
                color={theme.primary}
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
                color={theme.primary}
                key={index}
                label={time}
                value={time}
              />
            ))}
          </Picker>
          <Text style={styles.timePickerText}>PM</Text>
        </View>
      </BottomModal>
    </View>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    // Header line styles
    headerMessageContainer: {
      marginTop: 5,
      flexDirection: "row",
      alignItems: "center",
    },
    headerMessageText: {
      fontSize: 14,
      color: theme.primary,
    },
    contentLoaderContainer: {
      width: CONTENT_LOADER_WIDTH,
      height: CONTENT_LOADER_HEIGHT,
      borderRadius: 5,
      overflow: "hidden",
      backgroundColor: theme.faintPrimary,
    },
    headerButton: {
      borderRadius: 5,
      overflow: "hidden",
      backgroundColor: theme.faintPrimary,
      paddingHorizontal: 7,
      paddingVertical: 4,
    },
    headerButtonText: {
      color: theme.primary,
      fontSize: 14,
      fontWeight: 500,
    },

    timePickerContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 15
    },
    timePicker: {
      // borderColor: "black",
      // borderWidth: 1,
      width: 100,
      marginVertical: 15,
    },
    timePickerText: {
      color: theme.primary,
      fontSize: 20,
    },
  });

export default TmrwTimePicker;
