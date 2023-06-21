import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Button,
  Image,
} from "react-native";
import { CardField, useStripe } from "@stripe/stripe-react-native";
import CountryPicker, {
  FlagButton,
  CallingCode,
} from "react-native-country-picker-modal";
import { Color } from "../GlobalStyles";
import AmericanFlag from "../assets/flags/US-UnitedStates.svg";
import Svg from "react-native-svg";
import SettingsHeader from "../components/SettingsHeader";

const Billing = ({ navigation }) => {


  const [countryCode, setCountryCode] = useState("US");
  const [selectedCountry, setSelectedCountry] = useState("United States");
  const [countryModalVisible, setCountryModalVisible] = useState(false);

  const handleSaveCard = async () => {};

  // https://flagpack.xyz/
  const getCustomFlagImageUrl = (countryCode) => {
    const flagFileName = `${countryCode}-UnitedStates.svg`;
    const customFlagImageUrl = `../assets/flags/${flagFileName}`;
    // console.log(customFlagImageUrl);
    return customFlagImageUrl;
  }; 

  return (
    <SafeAreaView style={styles.pageContainer}>
      <SettingsHeader navigation={navigation} header={"Add Payment Method"}/>
      <View style={styles.inputSection}>
        <Text style={styles.inputTitle}>Name</Text>
        <TextInput style={styles.inputField} placeholder="Name" />
      </View>
      <View style={styles.inputSection}>
        <Text style={styles.inputTitle}>Country</Text>

        <TouchableOpacity
          style={styles.inputField}
          onPress={() => setCountryModalVisible(true)}
        >
          <CountryPicker
            theme={{ fontSize: 16 }}
            withFilter={true}
            visible={countryModalVisible}
            withEmoji={false}
            withFlag={false}
            withFlagButton={true}
            onClose={() => setCountryModalVisible(false)}
            onSelect={(country) => {
              setSelectedCountry(country.name);
              setCountryModalVisible(false);
            }}
            withCountryNameButton={true}
            renderFlagButton={(props) => {
              const { countryCode, flagSize } = props;
              console.log(props);
              const customFlagImageUrl = getCustomFlagImageUrl("US");
              console.log(customFlagImageUrl);
              return (
                <View
                  style={{
                    width: 30,
                    height: 24,
                    borderRadius: 5,
                    overflow: "hidden",
                  }}
                >
                  <Image
                    style={{ width: flagSize, height: flagSize }}
                    source={{ uri: customFlagImageUrl }}
                  />
                  <AmericanFlag />
                </View>
              );
            }}
          />
          <Text>{selectedCountry}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputSection}>
        <Text style={styles.inputTitle}>Card Details</Text>
        <CardField
          postalCodeEnabled={true}
          placeholders={{
            number: "1234 1234 1234 1234",
          }}
          cardStyle={{
            backgroundColor: "#FFFFFF",
            textColor: "#000000",
          }}
          style={styles.cardField}
          onCardChange={(cardDetails) => {
            console.log("cardDetails", cardDetails);
          }}
          onFocus={(focusedField) => {
            console.log("focusField", focusedField);
          }}
        />
      </View>
      <View style={styles.inputSection}>
        <Text style={styles.inputTitle}>Powered by Stripe</Text>
      </View>
    </SafeAreaView>
  );
};

export default Billing;

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 20,
  },
  inputSection: {
    flexDirection: "col",
    width: "100%",
  },
  inputTitle: {
    color: Color.white,
    fontSize: 18,
    marginLeft: 5,
  },
  inputField: {
    width: "100%",
    height: 65,
    marginVertical: 15,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  cardField: {
    width: "100%",
    height: 65,
    marginVertical: 15,
    borderRadius: 8,
  },
});
