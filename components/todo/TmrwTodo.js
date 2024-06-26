import { Text, View } from "react-native";
import { getTodoStyles, variableFontSize } from "./TodoStyles";
import DescriptLinesIcon from "../../assets/icons/descript-lines-icon.svg";
import RenderTmrwLock from "./RenderTmrwLock.js";
import { default as TouchableNipple } from "../TouchableRipple";
import { useThemes } from "../../hooks/ThemesContext";
import { useBottomSheet } from "../../hooks/BottomSheetContext";
import { useSettings } from "../../hooks/SettingsContext";

// (only shows when timeStatus == 1 || 2)
const TmrwTodo = ({ todoData }) => {
  const { theme } = useThemes();
  const { openBottomSheet } = useBottomSheet();
  const styles = getTodoStyles(theme);
  const { todoNumber = '', title = '', description = '', amount = '', tag = '', isLocked = false } = todoData;
  const { dreamsArray, timeStatus } = useSettings();

  const findDreamTitleById = (id, dreams) => {
    const dream = dreams.find((d) => d.id === id);
    return dream ? dream.title : null;
  };

  const dreamTitle = findDreamTitleById(tag, dreamsArray);

  const formattedAmount =
    amount !== null && amount !== undefined ? amount.toString() : "";
  return (
    <View style={styles.infoContainer}>
      <TouchableNipple
        onPress={() => {
          openBottomSheet("tmrw", todoNumber);
        }}
        style={[
          styles.leftContainer,
          { padding: 0 },
          timeStatus === 2 && styles.disabledOpacity,
        ]}
      >
        <View
          style={[styles.leftContainerInner, { width: "100%", padding: 16 }]}
        >
          {dreamTitle && (
            <View style={styles.tagContainer}>
              <Text style={styles.tagText}>{dreamTitle}</Text>
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
                  {" "}
                  more...
                </Text>
              )}
            </Text>
          </View>
        </View>
        {formattedAmount && (
          <View style={styles.amountContainer}>
            <Text style={styles.amountText}>${formattedAmount}</Text>
          </View>
        )}
      </TouchableNipple>
      <RenderTmrwLock isLocked={isLocked} todoNumber={todoNumber} />
    </View>
  );
};
export default TmrwTodo;
