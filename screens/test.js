/* eslint-disable react-native/no-inline-styles */
import React, { useRef, useState } from "react";
import {
  View,
  SafeAreaView,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
} from "react-native";
import StepIndicator from "react-native-step-indicator";
import Carousel, { Pagination } from "react-native-snap-carousel";

const thirdIndicatorStyles = {
  stepIndicatorSize: 25,
  currentStepIndicatorSize: 30,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: "#7eaec4",
  stepStrokeWidth: 3,
  stepStrokeFinishedColor: "#7eaec4",
  stepStrokeUnFinishedColor: "#dedede",
  separatorFinishedColor: "#7eaec4",
  separatorUnFinishedColor: "#dedede",
  stepIndicatorFinishedColor: "#7eaec4",
  stepIndicatorUnFinishedColor: "#ffffff",
  stepIndicatorCurrentColor: "#ffffff",
  stepIndicatorLabelFontSize: 0,
  currentStepIndicatorLabelFontSize: 0,
  stepIndicatorLabelCurrentColor: "transparent",
  stepIndicatorLabelFinishedColor: "transparent",
  stepIndicatorLabelUnFinishedColor: "transparent",
  labelColor: "#999999",
  labelSize: 13,
  currentStepLabelColor: "#7eaec4",
  labelAlign: "flex-start",
};

const PAGES = ["Page 1", "Page 2", "Page 3"];

export default function App() {
  const [currentPage, setCurrentPage] = useState(0);
  const carouselRef = useRef(null);
  const scrollAnim = useRef(new Animated.Value(0)).current;

  const onStepPress = (position) => {
    setCurrentPage(position);
    carouselRef.current && carouselRef.current.snapToItem(position);
  };

  const renderViewPagerPage = ({ item, index }) => {
    return (
      <View style={styles.page}>
        <View style={styles.test}>
          <Text>{item}</Text>
        </View>
      </View>
    );
  };

  const itemHeight = Dimensions.get("window").height;

  const fadeSlide = (index, animatedValue) => {
    const inputRange = [
      (index - 1) * itemHeight,
      index * itemHeight,
      (index + 1) * itemHeight,
    ];
    const outputRange = [0.3, 1, 0.3];

    const opacity = animatedValue.interpolate({
      inputRange,
      outputRange,
      extrapolate: "clamp",
    });

    return {
      opacity,
    };
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.stepIndicator}>
        <StepIndicator
          stepCount={3}
          customStyles={thirdIndicatorStyles}
          currentPosition={currentPage}
          onPress={onStepPress}
          labelAlign="left"
          labels={[
            "Set Daily Deadline",
            "Set Starting Day",
            "Add Payment Method",
          ]}
          direction="vertical"
        />
      </View>
      <Carousel
        layout={"default"}
        ref={carouselRef}
        data={PAGES}
        renderItem={renderViewPagerPage}
        sliderHeight={Dimensions.get("window").height}
        itemHeight={Dimensions.get("window").height}
        vertical={true}
        onSnapToItem={(index) => {
          setCurrentPage(index);
          Animated.timing(scrollAnim, {
            toValue: index,
            duration: 300,
            useNativeDriver: true,
          }).start();
        }}
        slideInterpolatedStyle={fadeSlide}
      />
      <Pagination
        dotsLength={PAGES.length}
        activeDotIndex={currentPage}
        containerStyle={styles.paginationContainer}
        dotStyle={styles.paginationDot}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
        vertical={true}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  stepIndicator: {
    zIndex: 1,

    position: "absolute",
    top: 50,
    left: 0,

    height: "20%",

    // borderColor: "black",
    // borderWidth: 1,
  },
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  paginationContainer: {
    position: "absolute",
    top: "50%",
    right: 0,
  },
});