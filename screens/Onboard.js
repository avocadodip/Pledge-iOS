/* eslint-disable react-native/no-inline-styles */
import React, { useState } from "react";
import { StyleSheet, View, Text } from 'react-native';
import StepIndicator from 'react-native-step-indicator';
import Swiper from 'react-native-swiper';
import { MaterialIcons } from '@expo/vector-icons';

const PAGES = ['Page 1', 'Page 2', 'Page 3'];

const thirdIndicatorStyles = {
  stepIndicatorSize: 25,
  currentStepIndicatorSize: 30,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: '#7eaec4',
  stepStrokeWidth: 3,
  stepStrokeFinishedColor: '#7eaec4',
  stepStrokeUnFinishedColor: '#dedede',
  separatorFinishedColor: '#7eaec4',
  separatorUnFinishedColor: '#dedede',
  stepIndicatorFinishedColor: '#7eaec4',
  stepIndicatorUnFinishedColor: '#ffffff',
  stepIndicatorCurrentColor: '#ffffff',
  stepIndicatorLabelFontSize: 0,
  currentStepIndicatorLabelFontSize: 0,
  stepIndicatorLabelCurrentColor: 'transparent',
  stepIndicatorLabelFinishedColor: 'transparent',
  stepIndicatorLabelUnFinishedColor: 'transparent',
  labelColor: '#999999',
  labelSize: 13,
  currentStepLabelColor: '#7eaec4',
};



export default function App() {
  const [currentPage, setCurrentPage] = useState(0);

  const onStepPress = (position) => {
    setCurrentPage(position);
  };

  const renderViewPagerPage = (data) => {
    return (
      <View key={data} style={styles.page}>
        <Text>{data}</Text>
      </View>
    );
  };


  return (
    <View style={styles.container}>
      <View style={styles.stepIndicator}>
        <StepIndicator
          stepCount={3}
          customStyles={thirdIndicatorStyles}
          currentPosition={currentPage}
          onPress={onStepPress}
          labels={['Approval', 'Shipping', 'Delivery']}
        />
      </View>
      <Swiper
        style={{ flexGrow: 1 }}
        loop={false}
        index={currentPage}
        autoplay={false}
        showsButtons
        onIndexChanged={(page) => {
          setCurrentPage(page);
        }}
      >
        {PAGES.map((page) => renderViewPagerPage(page))}
      </Swiper>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  stepIndicator: {
    marginVertical: 50,
  },
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepLabel: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
    color: '#999999',
  },
  stepLabelSelected: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
    color: '#4aae4f',
  },
});

// import { SafeAreaView, StyleSheet, Text, View } from "react-native";
// import React, { useState } from "react";
// import { useThemes } from "../hooks/ThemesContext";
// import StepIndicator from "react-native-step-indicator";
// import { Button } from "react-native";

// const labels = [
//   "Cart",
//   "Delivery Address",
//   "Order Summary", 
// ];
// const customStyles = {
//   stepIndicatorSize: 25,
//   currentStepIndicatorSize: 30,
//   separatorStrokeWidth: 2,
//   currentStepStrokeWidth: 3,
//   stepStrokeCurrentColor: "#fe7013",
//   stepStrokeWidth: 3,
//   stepStrokeFinishedColor: "#fe7013",
//   stepStrokeUnFinishedColor: "#aaaaaa",
//   separatorFinishedColor: "#fe7013",
//   separatorUnFinishedColor: "#aaaaaa",
//   stepIndicatorFinishedColor: "#fe7013",
//   stepIndicatorUnFinishedColor: "#ffffff",
//   stepIndicatorCurrentColor: "#ffffff",
//   stepIndicatorLabelFontSize: 13,
//   currentStepIndicatorLabelFontSize: 13,
//   stepIndicatorLabelCurrentColor: "#fe7013",
//   stepIndicatorLabelFinishedColor: "#ffffff",
//   stepIndicatorLabelUnFinishedColor: "#aaaaaa",
//   labelColor: "#e5e5e5",
//   labelSize: 13,
//   currentStepLabelColor: "#fe7013",
// };

// const Onboard = () => {
//   const { theme } = useThemes();
//   const styles = getStyles(theme);

//   const [currentPosition, setCurrentPosition] = useState(0);

//   const nextPage = () => {
//     if (currentPosition < labels.length - 1) {
//       setCurrentPosition((oldPosition) => oldPosition + 1);
//     }
//   };

//   const previousPage = () => {
//     if (currentPosition > 0) {
//       setCurrentPosition((oldPosition) => oldPosition - 1);
//     }
//   };

//   return (
//     <SafeAreaView style={styles.pageContainer}>
//       <Text style={styles.headerText}>Before we begin!</Text>
//       <View style={styles.stepIndicatorContainer}>
//         <StepIndicator
//           customStyles={customStyles}
//           currentPosition={currentPosition}
//           labels={labels}
//           stepCount={3}
//         />
//       </View>
//       <View style={styles.buttonsContainer}>
//         <Button title="Previous" onPress={previousPage} />
//         <Button title="Next" onPress={nextPage} />
//       </View>
//     </SafeAreaView>
//   );
// };

// export default Onboard;

// const getStyles = (theme) =>
//   StyleSheet.create({
//     pageContainer: {
//       flex: 1,
//       alignItems: "center",
//       marginHorizontal: 20,
//     },
//     headerText: {
//       color: theme.textHigh,
//       fontSize: 25,
//       fontWeight: 600,
//     },

//     stepIndicatorContainer: {
//       width: "100%"
//     },
//   });
