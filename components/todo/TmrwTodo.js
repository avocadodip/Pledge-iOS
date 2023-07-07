import { Text, View } from "react-native";
import { getTodoStyles } from "./TodoStyles";
import DescriptLinesIcon from "../../assets/icons/descript-lines-icon.svg";
import RenderTmrwLock from "./RenderTmrwLock.js";
import { default as TouchableNipple } from "../TouchableRipple";
import { useThemes } from "../../hooks/ThemesContext";

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
    <View style={[styles.infoContainer]}>
      <TouchableNipple
        onPress={handleOpenBottomSheet}
        style={styles.leftContainer}
      >
        <View style={styles.tagTitleContainer}>
          {/* {tag && ( */}
          <View style={styles.tagContainer}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
          {/* )} */}
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>{title}</Text>
          </View>
        </View>
        {amount && (
          <View style={styles.amountContainer}>
            <Text style={styles.amountText}>${amount}</Text>
          </View>
        )}
        {/* <View
          style={[
            styles.upperHalfContainer,
            { margin: 15 },
            timeStatus === 2 && styles.disabledOpacity,
          ]}
        >
          <View style={styles.numberTitleContainer}>
            <Text style={styles.todoNumber}>{todoNumber}</Text>
            <Text style={styles.todoTitle}>{title}</Text>
          </View>
        </View>
        <View
          style={[
            styles.lowerHalfContainer,
            { margin: 15 },
            timeStatus === 2 && styles.disabledOpacity,
          ]}
        >
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
        </View> */}
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
