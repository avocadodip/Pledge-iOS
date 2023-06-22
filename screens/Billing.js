import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { CardField, useStripe } from "@stripe/stripe-react-native";
import { Color } from "../GlobalStyles";
import SettingsHeader from "../components/SettingsHeader";
import CountrySelect from "../components/CountrySelect";
import PoweredByStripeIcon from "../assets/icons/stripe-logo.svg";

const Billing = ({ navigation }) => {
  const [selectedCountry, setSelectedCountry] = useState("United States");

  const handleSaveCard = async () => {};

  return (
    <SafeAreaView style={styles.pageContainer}>
      <SettingsHeader navigation={navigation} header={"Add Payment Method"} />
      <View style={styles.inputSection}>
        <Text style={styles.inputTitle}>Name</Text>
        <TextInput style={styles.inputField} placeholder="Name" />
      </View>
      <View style={styles.inputSection}>
        <Text style={styles.inputTitle}>Country</Text>
        <View style={styles.inputField}>
          <CountrySelect
            selectedCountry={selectedCountry}
            setSelectedCountry={setSelectedCountry}
          />
        </View>
      </View>
      <View style={styles.inputSection}>
        <Text style={styles.inputTitle}>Card Details</Text>
        <CardField
          postalCodeEnabled={true}
          placeholders={{
            number: "1234 1234 1234 1234",
            expiration: "MM/YY",
            cvc: "CVC",
            postalCode: "ZIP",
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
      <View style={styles.poweredByStripeContainer}>
        <PoweredByStripeIcon height={30} width={150} />
      </View>
      <View style={styles.submitButtonContainer}>
        <TouchableOpacity style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Add Card</Text>
        </TouchableOpacity>
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
    backgroundColor: Color.white,
    borderColor: Color.white,
    borderWidth: 1,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    fontSize: 16,
    color: "grey",
    paddingLeft: 16,
    
  },
  cardField: {
    width: "100%",
    height: 65,
    marginVertical: 15,
    borderRadius: 8,
  },
  poweredByStripeContainer: {
    marginTop: 10,
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  submitButtonContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  submitButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 55,
    width: 270,
    marginTop: 35,
    borderRadius: 16,
    backgroundColor: "white",
  },
  submitButtonText: {
    color: "grey",
    fontSize: 20,
  },
});
