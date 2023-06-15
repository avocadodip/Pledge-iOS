import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "./TodoStyles";
import DescriptLinesIcon from "../../assets/icons/descript-lines-icon.svg";
import RenderLockStatus from "./RenderLockStatus";
import TouchableRipple from "../TouchableRipple";


const TmrwTodo = ({
  todoNumber,
  title,
  description,
  amount,
  tag,
  isTodoLocked,
  handleOpenBottomSheet,
  handleLockTodo,
}) => {
  // JSX
  return (
    <View style={[styles.infoContainer]}>
      <TouchableRipple
        onPress={handleOpenBottomSheet}
        style={styles.leftContainer}
      >
        <View style={[styles.upperHalfContainer, { margin: 15 }]}>
          <View style={styles.numberTitleContainer}>
            <Text style={styles.todoNumber}>{todoNumber}</Text>
            <Text style={styles.todoTitle}>{title}</Text>
          </View>
        </View>
        <View style={[styles.lowerHalfContainer, { margin: 15 }]}>
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
      </TouchableRipple>
      <RenderLockStatus
        isTodoLocked={isTodoLocked}
        handleLockTodo={handleLockTodo}
        todoNumber={todoNumber}
      />
    </View>
  );
};
export default TmrwTodo;
