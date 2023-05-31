import { Text, TouchableOpacity, View } from "react-native";
import { useEffect, useState } from "react";
import { styles } from "./TodoStyles";
import DescriptLinesIcon from "../../assets/icons/descript-lines-icon.svg";
import RenderLockStatus from "./RenderLockStatus";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

const InfoTodo = ({
  todoNumber,
  title,
  description,
  amount,
  tag,
  isTodoLocked,
  isTodoComplete,
  handleOpenBottomSheet,
  handleLockTodo,
  handleCheckTodo,
}) => {

  // JSX
  return (
    <View style={styles.infoContainer}>
      <TouchableOpacity
        style={[styles.leftContainer]}
        onPress={handleOpenBottomSheet}
      >
        <View style={styles.upperHalfContainer}>
          <View style={styles.numberTitleContainer}>
            <Text style={styles.todoNumber}>{todoNumber}</Text>
            <Text style={styles.todoTitle}>{title}</Text>
          </View>
        </View>
        <View style={styles.lowerHalfContainer}>
          <View style={styles.tagDescriptionContainer}>
            {tag && (
              <View style={styles.tagContainer}>
                <View style={styles.tagBackground}>
                  <Text style={styles.todoTag}>{tag}</Text>
                </View>
              </View>
            )}
            {description && (
              <View style={styles.descriptionContainer}>
                <DescriptLinesIcon />
                <Text
                  style={styles.todoDescription}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {description}
                </Text>
              </View>
            )}
          </View>
          {amount && (
            <View style={styles.amountContainer}>
              <Text style={styles.todoAmount}>${amount}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
      <RenderLockStatus
        isTodoLocked={isTodoLocked}
        isTodoComplete={isTodoComplete}
        handleLockTodo={handleLockTodo}
        handleCheckTodo={handleCheckTodo}
        todoNumber={todoNumber}
      />
    </View>
  );
};
export default InfoTodo;
