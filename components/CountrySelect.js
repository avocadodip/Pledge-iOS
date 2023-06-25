import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import {
  getCustomFlagImage,
  FLAGS,
  COUNTRY_NAMES,
} from "../utils/getFlagIcons";
import CountryPicker from "react-native-country-picker-modal";
import { TouchableOpacity } from "react-native";
import { Color } from "../GlobalStyles";
import { SearchBar } from "@rneui/themed";
import Modal from "react-native-modal";
import TouchableRipple from "./TouchableRipple";

const CountrySelect = ({ selectedCountry, setSelectedCountry }) => {
  const [countryCode, setCountryCode] = useState("US");
  const [countryModalVisible, setCountryModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    console.log(countryModalVisible);
  }, [countryModalVisible]);

  const FlagImage = getCustomFlagImage(countryCode);

  const filteredCountries = Object.entries(FLAGS).filter(
    ([code]) =>
      COUNTRY_NAMES[code] &&
      COUNTRY_NAMES[code].toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setCountryModalVisible(true)}
      >
        <View style={styles.flagWrapper}>
          <FlagImage width={30} height={24} />
        </View>
        <Text style={styles.text}>{selectedCountry}</Text>
      </TouchableOpacity>
      <Modal
        style={styles.bottomModal}
        isVisible={countryModalVisible}
        onBackdropPress={() => setCountryModalVisible(false)}
        animationOut={"slideOutDown"}
        animationInTiming={300}
        animationOutTiming={300}
        backdropTransitionOutTiming={0}
      >
        <View style={styles.modalContent}>
          <View style={styles.searchWrapper}>
            <SearchBar
              placeholder="Search"
              onChangeText={setSearchQuery}
              value={searchQuery}
              onClear={() => setSearchQuery("")}
              containerStyle={styles.searchContainer}
              inputContainerStyle={styles.searchInputContainer}
              inputStyle={styles.searchInputText}
              leftIconContainerStyle={styles.searchLeftIcon}
              placeholderTextColor={"grey"}
              round={true}
              lightTheme={true}
            />
          </View>
          <FlatList
            contentContainerStyle={styles.listContainer}
            data={filteredCountries}
            keyExtractor={(item) => item[0]} // use country code as key
            renderItem={({ item }) => {
              const [countryCode, FlagImage] = item;
              return (
                <TouchableRipple
                  onPress={() => {
                    setSelectedCountry(COUNTRY_NAMES[countryCode]);
                    setCountryCode(countryCode);
                    setCountryModalVisible(false);
                  }}
                >
                  <View style={styles.countryItem}>
                    <View style={styles.flagWrapper}>
                      <FlagImage width={30} height={24} />
                    </View>
                    <Text style={styles.countryName}>
                      {COUNTRY_NAMES[countryCode]}
                    </Text>
                  </View>
                </TouchableRipple>
              );
            }}
          />
        </View>
      </Modal>
    </>
  );
};

export default CountrySelect;

const styles = StyleSheet.create({
  button: {
    width: "100%",
    height: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingLeft: 16,
  },
  text: {
    color: "grey",
    fontSize: 17,
  },
  flagWrapper: {
    width: 30,
    height: 24,
    borderRadius: 5,
    overflow: "hidden",
  },

  //Modal styles
  bottomModal: {
    alignItems: "center",
    justifyContent: "center",
    height: 300,
  },
  modalContent: {
    flexDirection: "col",
    backgroundColor: Color.white,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    borderColor: "rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
    height: 500,
    width: 275,
    paddingTop: 20,
    paddingHorizontal: 20,
  },

  // Search Bar
  searchWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    overflow: "hidden",
    width: "100%",
  },
  searchContainer: {
    width: "100%",
    borderWidth: 0,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "transparent",
    margin: -5, // use to hide lines
  },
  searchInputContainer: {
    backgroundColor: "#cccccc",
  },
  searchInputText: {
    color: Color.fervo_white,
  },
  searchLeftIcon: {},

  // Modal list styles
  listContainer: {
    width: "100%",
    // borderColor: "black",
    // borderWidth: 1,
  },
  countryItem: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    paddingVertical: 10,
  },
  countryName: {
    fontSize: 17,
    color: "grey",
    fontWeight: 500,
    width: 150,
  },
});
