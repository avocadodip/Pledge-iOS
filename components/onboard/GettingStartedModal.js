import {
  Modal,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  FlatList,
  Dimensions,
  Animated,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import StepIndicator from "react-native-step-indicator";
import SetDeadline from "./SetDeadline";
import NextButton from "./NextButton";
import SetStartDay from "./SetStartDay";
import { Color } from "../../GlobalStyles";
import { useThemes } from "../../hooks/ThemesContext";

const steps = ["Set daily deadline", "Set start day", "Lock in 3 tasks"];

const GettingStartedModal = ({ modalVisible, setModalVisible }) => {
  const { theme } = useThemes();
  const [modalHeight, setModalHeight] = useState(0);
  const styles = getStyles(theme, modalHeight);
  const [currentPage, setCurrentPage] = useState(0);
  const scrollAnim = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
  const [isScrolling, setIsScrolling] = useState(false);

  const [ startTime, setStartTime ] = useState("Choose time");
  const [ endTime, setEndTime ] = useState("Choose time");

  // Gets modal height
  const onLayout = (event) => {
    const { height } = event.nativeEvent.layout;
    setModalHeight(height);
  };

  useEffect(() => {
    if (!modalVisible) {
      setCurrentPage(0);
      setIsScrolling(false);
    }
  }, [modalVisible]);

  const stepIndicatorStyles = {
    stepIndicatorSize: 25,
    currentStepIndicatorSize: 30,

    // border
    currentStepStrokeWidth: 3,
    stepStrokeWidth: 3,
    stepStrokeCurrentColor: "#e7e7e7",
    stepStrokeFinishedColor: "#e7e7e7",
    stepStrokeUnFinishedColor: theme.stepStrokeFinishedColor,

    // line
    separatorStrokeWidth: 2,
    separatorFinishedColor: "#e7e7e7",
    separatorUnFinishedColor: "#ffffff2a",

    // inside circle
    stepIndicatorFinishedColor: "#e7e7e7",
    stepIndicatorUnFinishedColor: theme.stepIndicatorUnFinishedColor,
    stepIndicatorCurrentColor: "#ffffff",

    stepIndicatorLabelFontSize: 0,
    currentStepIndicatorLabelFontSize: 10,
    stepIndicatorLabelCurrentColor: "transparent",
    stepIndicatorLabelFinishedColor: "transparent",
    stepIndicatorLabelUnFinishedColor: "transparent",

    labelAlign: "left",
  };

  // Render conditionally styled labels
  const renderLabel = ({ position, label, currentPosition }) => {
    return (
      <Text
        style={
          position === currentPosition
            ? styles.stepLabelSelected
            : styles.stepLabel
        }
      >
        {label}
      </Text>
    );
  };

  // Scroll from page to page animation
  const onPageChange = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollAnim } } }],
    {
      listener: (event) => {
        const page = Math.round(
          event.nativeEvent.contentOffset.y / modalHeight
        );
        if (page !== currentPage) {
          setCurrentPage(page);
        }
        setIsScrolling(true); // set isScrolling to true
      },
      useNativeDriver: false,
    }
  );

  // Step indicator press
  const onStepPress = (position) => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({
        offset: position * modalHeight,
        animated: true,
      });
    }
  };

  // Next button press
  const onNextPress = () => {
    if (currentPage < steps.length - 1) {
      flatListRef.current.scrollToIndex({
        animated: true,
        index: currentPage + 1,
      });
    }
  };

  const renderViewPagerPage = ({ item, index }) => {
    // Animation - content opacity based on scroll location
    const opacity = isScrolling
      ? scrollAnim.interpolate({
          inputRange: [
            (index - 1) * modalHeight,
            index * modalHeight,
            (index + 1) * modalHeight,
          ],
          outputRange: [-3, 1, -3],
          extrapolate: "clamp",
        })
      : 1;

    // Render each page content
    let PageContent;
    if (index === 0) {
      PageContent = <SetDeadline />;
    } else if (index === 1) {
      PageContent = <SetStartDay />;
    } else {
      PageContent = <Text>Carrot</Text>;
    }

    return (
      <Animated.View style={[styles.pageContainer, { opacity }]}>
        <View style={styles.pageContent}>
          <View style={styles.contentContainer}>{PageContent}</View>
          <View style={styles.nextButtonContainer}>
            <NextButton action={onNextPress} text={"Next"} />
          </View>
        </View>
      </Animated.View>
    );
  };

  return (
    <Modal
      visible={modalVisible}
      animationType="slide"
      onDismiss={() => setModalVisible(false)}
      onRequestClose={() => setModalVisible(false)}
      presentationStyle={"pageSheet"}
    >
      <TouchableWithoutFeedback
        onPressOut={(e) => {
          if (e.nativeEvent.locationY > 150) {
            setModalVisible(false);
          }
        }}
      >
        <View style={styles.container} onLayout={onLayout}>
          <Text style={styles.gettingStartedText}>Set Up Your First Day</Text>
          <View style={styles.stepIndicator}>
            <StepIndicator
              stepCount={3}
              customStyles={stepIndicatorStyles}
              currentPosition={currentPage}
              onPress={onStepPress}
              renderLabel={renderLabel}
              labelAlign="left"
              labels={steps}
              direction="vertical"
            />
          </View>
          <FlatList
            ref={flatListRef}
            data={steps}
            renderItem={renderViewPagerPage}
            keyExtractor={(item, index) => "page_" + index}
            pagingEnabled
            vertical
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={onPageChange}
            getItemLayout={(data, index) => ({
              length: modalHeight,
              offset: modalHeight * index,
              index,
            })}
          />
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const getStyles = (theme, modalHeight) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.accent,
    },
    pageContainer: {
      height: modalHeight,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 20,
    },
    pageContent: {
      position: "absolute",
      top: 200,
      flex: 1,
      height: "70%",
      width: "100%",
    },
    contentContainer: {
      flex: 8,
      width: "100%",
      justifyContent: "center",
    },
    nextButtonContainer: {
      flex: 2,
      justifyContent: "center",
      width: "100%",
      alignItems: "center",
    },
    gettingStartedText: {
      fontSize: 25,
      fontWeight: "700",
      color: "white",
      width: 120,
      marginLeft: 20,
      position: "absolute",
      top: 50,

      // borderWidth: 1,
      // borderColor: "black",
    },
    stepIndicator: {
      zIndex: 1,
      position: "absolute",
      top: 40,
      right: 0,
      height: "18%",
      width: "60%",
      flexDirection: "row",
      gap: 20,
    },
    stepLabel: {
      fontSize: 17,
      fontWeight: "500",
      color: "#ffffffbd",
      paddingLeft: 10,
      fontWeight: "400",
    },
    stepLabelSelected: {
      fontSize: 17,
      fontWeight: "500",
      color: "#ffffff",
      paddingLeft: 10,
      fontWeight: "700",
    },
  });

export default GettingStartedModal;
