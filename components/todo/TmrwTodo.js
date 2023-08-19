import { Text, View } from "react-native";
import { getTodoStyles, variableFontSize } from "./TodoStyles";
import DescriptLinesIcon from "../../assets/icons/descript-lines-icon.svg";
import RenderTmrwLock from "./RenderTmrwLock.js";
import { default as TouchableNipple } from "../TouchableRipple";
import { useThemes } from "../../hooks/ThemesContext";
import { useBottomSheet } from "../../hooks/BottomSheetContext";
import { useDayStatus } from "../../hooks/DayStatusContext";

// (only shows when timeStatus == 1 || 2)
const TmrwTodo = ({
  todoData,
}) => {
  const { theme } = useThemes();
  const { openBottomSheet } = useBottomSheet();
  const styles = getTodoStyles(theme);
  const { todoNumber, title, description, amount, tag, isLocked } = todoData;
  const { timeStatus } = useDayStatus();

  return (
    <View style={styles.infoContainer}>
      <TouchableNipple
        onPress={() => {openBottomSheet(todoNumber)}}
        style={[
          styles.leftContainer,
          { padding: 0 },
          timeStatus === 2 && styles.disabledOpacity,
        ]}
      >
        <View 
          style={[styles.leftContainerInner, { width: "100%", padding: 16 }]}
        >
          {tag && (
            <View style={styles.tagContainer}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          )}
          <View style={styles.titleContainer}>
            <Text
              style={[styles.titleText, { fontSize: variableFontSize(title) }]}
            >
              {title}
              {description !== "" && (
                <Text
                  style={[
                    styles.moreText,
                    { fontSize: variableFontSize(title, true) },
                  ]}
                >
                  {" "}more...
                </Text>
              )}
            </Text>
          </View>
        </View>
        {amount && (
          <View style={styles.amountContainer}>
            <Text style={styles.amountText}>${amount}</Text>
          </View>
        )}
      </TouchableNipple>
      <RenderTmrwLock
        isLocked={isLocked}
        todoNumber={todoNumber}
      />
    </View>
  );
};
export default TmrwTodo;
