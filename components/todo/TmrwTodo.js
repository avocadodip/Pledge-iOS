import { Text, View } from "react-native";
import { getTodoStyles } from "./TodoStyles";
import DescriptLinesIcon from "../../assets/icons/descript-lines-icon.svg";
import RenderTmrwLock from "./RenderTmrwLock.js";
import { default as TouchableNipple } from "../TouchableRipple";
import { useThemes } from "../../hooks/ThemesContext";

// (only shows when timeStatus == 1 || 2)
const TmrwTodo = ({
  todoNumber,
  title,
  description,
  amount,
  tag,
  isLocked,
  handleOpenBottomSheet,
  handleLockTodo,
  timeStatus,
}) => {
  const { theme } = useThemes();
  const styles = getTodoStyles(theme);

  return (
    <View
      style={styles.infoContainer}
    >
      <TouchableNipple
        onPress={handleOpenBottomSheet}
        style={[styles.leftContainer, timeStatus === 2 && styles.disabledOpacity]}
      >
        <View style={styles.tagTitleContainer}>
          {tag && (
            <View style={styles.tagContainer}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          )}
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>{title}</Text>
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
        handleLockTodo={handleLockTodo}
        todoNumber={todoNumber}
        timeStatus={timeStatus}
      />
    </View>
  );
};
export default TmrwTodo;
