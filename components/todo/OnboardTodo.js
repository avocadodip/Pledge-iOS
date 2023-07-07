import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { getTodoStyles } from "./TodoStyles";
import { useThemes } from "../../hooks/ThemesContext";
// import { renderLockStatus } from "./RenderLockStatus";

const OnboardTodo = ({ todoNumber, isTodoLocked, handleLockTodo }) => {
  const { theme } = useThemes();
  const styles = getTodoStyles(theme);

  return (
    <View style={[styles.infoContainer, { height: 86 }]}>
      <View style={styles.leftContainer}>
        <View style={styles.upperHalfContainer}>
          <View style={styles.numberTitleContainer}>
            <Text style={styles.todoNumber}>{todoNumber}</Text>
            <TextInput
              autoCorrect={false}
              multiline={true}
              numberOfLines={2}
              style={[
                styles.todoTitle,
                { flexGrow: 1, flexShrink: 1, lineHeight: 24 },
              ]}
              placeholder={"Write a screenplay"}
              placeholderTextColor="rgba(243, 243, 243, 0.5)"
              maxLength={40}
              // borderWidth={1}
              // borderColor={"black"}
            />
          </View>
        </View>
      </View>
      {/* <RenderLockStatus
      isTodoLocked={isTodoLocked}
      handleLockTodo={handleLockTodo}
    /> */}
    </View>
  );
};
export default OnboardTodo;
