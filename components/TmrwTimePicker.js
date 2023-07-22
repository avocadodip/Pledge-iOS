import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import Modal from "react-native-modal";
import { Color } from "../GlobalStyles";
import TouchableRipple from "./TouchableRipple";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../database/firebase";
import ContentLoader, { Rect } from "react-content-loader/native";
import { useDayStatus } from "../hooks/DayStatusContext";
import { useSettings } from "../hooks/SettingsContext";

const HOURS = ["12", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"];
const MINUTES = ["00", "15", "30", "45"];
const CONTENT_LOADER_HEIGHT = 25;
const CONTENT_LOADER_WIDTH = 60;

const TmrwTimePicker = ({ altMessage }) => {
  const { currentUserID } = useSettings();
  const { dayStart, dayEnd } = useDayStatus();
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
          <Text style={styles.headerMessageText}>Tasks will open at </Text>
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

        <Text style={styles.headerMessageText}> and close at </Text>

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
      <Modal
        style={styles.bottomModal}
        isVisible={isModalVisible.start}
        onBackdropPress={() => toggleModal("start")}
        backdropTransitionOutTiming={0}
        animationOutTiming={500}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Change start time</Text>
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
          {/* SAVE BUTTON */}
          <TouchableRipple
            style={styles.confirmButton}
            onPress={() => handleTimeSave("start")}
          >
            <Text style={styles.buttonText}>Confirm</Text>
          </TouchableRipple>
        </View>
        {/* CANCEL BUTTON */}
        <View>
          <TouchableRipple
            style={styles.cancelButton}
            onPress={() => toggleModal("start")}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableRipple>
        </View>
      </Modal>

      {/* PM MODAL */}
      <Modal
        style={styles.bottomModal}
        isVisible={isModalVisible.end}
        onBackdropPress={() => toggleModal("end")}
        backdropTransitionOutTiming={0}
        animationOutTiming={500}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Change end time</Text>
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
          {/* SAVE BUTTON */}
          <TouchableRipple
            style={styles.confirmButton}
            onPress={() => handleTimeSave("end")}
          >
            <Text style={styles.buttonText}>Confirm</Text>
          </TouchableRipple>
        </View>
        {/* CANCEL BUTTON */}
        <View>
          <TouchableRipple
            style={styles.cancelButton}
            onPress={() => toggleModal("end")}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableRipple>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  // Header line styles
  headerMessageContainer: {
    marginTop: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  headerMessageText: {
    fontSize: 14,
    color: Color.white,
  },
  contentLoaderContainer: {
    width: CONTENT_LOADER_WIDTH,
    height: CONTENT_LOADER_HEIGHT,
    borderRadius: 5,
    overflow: "hidden",
    backgroundColor: "rgba(255, 255, 255, 0.12)",
  },
  headerButton: {
    borderRadius: 5,
    overflow: "hidden",
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    paddingHorizontal: 7,
    paddingVertical: 4,
  },
  headerButtonText: {
    color: Color.white,
    fontSize: 14,
    fontWeight: 500,
  },

  // Modal and modal content styles
  bottomModal: {
    justifyContent: "flex-end",
  },
  modalContent: {
    flexDirection: "col",
    backgroundColor: Color.fervo_red,
    paddingTop: 22,
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
  confirmButton: {
    backgroundColor: Color.fervo_red,
    width: "100%",
    paddingVertical: 20,
    justifyContent: "center",
    alignItems: "center",
    borderTopWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  cancelButton: {
    backgroundColor: Color.fervo_red,
    width: "100%",
    marginTop: 10,
    marginBottom: 10,
    paddingVertical: 20,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  buttonText: {
    color: Color.white,
    fontSize: 18,
  },
});

export default TmrwTimePicker;
