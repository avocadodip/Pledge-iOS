// todo
// - fix cardholder name/country not being added to stripe
// - navigate to settings page after card has been added
// - show last 4 digits of card info / change add payment method button
// - add reset/delete card button
// - detach payment method cloud function

import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import {
  useStripe,
  createPaymentMethod,
  CardField,
  confirmPayment,
  initPaymentSheet,
  presentPaymentSheet,
} from "@stripe/stripe-react-native";
import { Color, paymentSheetAppearance } from "../GlobalStyles";
import SettingsHeader from "../components/SettingsHeader";
import CountrySelect from "../components/CountrySelect";
import PoweredByStripeIcon from "../assets/icons/stripe-logo.svg";
import TouchableRipple from "../components/TouchableRipple";
import { useSettings } from "../hooks/SettingsContext";
import LockIcon from "../assets/icons/lock-icon-outline.svg";
import { getIdToken } from "firebase/auth";
import { auth } from "../database/firebase";

const Billing = ({ navigation }) => {
  const {
    currentUserEmail,
    currentUserID,
    currentUserFullName,
    settings: { stripeCustomerId },
  } = useSettings();
  const [name, setName] = useState("");
  const [country, setCountry] = useState("United States");

  // temp
  const [loading, setLoading] = useState(false);

  // useEffect to track changes in input fields and check if all fields are completed
  const [allFieldsCompleted, setAllFieldsCompleted] = useState(false);

  // Get setup intent
  const fetchPaymentSheetParams = async () => {
    const idToken = await getIdToken(auth.currentUser, true);

    const response = await fetch(
      "https://us-central1-fervo-1.cloudfunctions.net/createSetupIntent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + idToken,
        },
        body: JSON.stringify({
          stripeCustomerId: stripeCustomerId,
          uid: currentUserID
        }),
      }
    );

    // Handle response from your server.
    if (!response.ok) {
      throw new Error("Failed to setup intent.");
    }

    const { setupIntent, ephemeralKey, customer } = await response.json();

    return {
      setupIntent,
      ephemeralKey,
      customer,
    };
  };

  // Initiailize payment sheet
  const initializePaymentSheet = async () => {
    const { setupIntent, ephemeralKey, customer } =
      await fetchPaymentSheetParams();

    const { error } = await initPaymentSheet({
      merchantDisplayName: "Example, Inc.",
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      setupIntentClientSecret: setupIntent,
      appearance: paymentSheetAppearance,
    });
    if (!error) {
      setLoading(true);
    }
  };

  // Initialize payment sheet on mount
  useEffect(() => {
    initializePaymentSheet();
  }, []);

  // Open sheet when button clicked
  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      Alert.alert('Success', 'Your payment method is successfully set up for future payments!');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.pageContainer}>
        <SettingsHeader navigation={navigation} header={"Add Payment Method"} />
        {/* NAME */}
        <View style={styles.inputSection}>
          <Text style={styles.inputTitle}>Name</Text>
          <TextInput
            style={[styles.inputField, { paddingLeft: 16 }]}
            value={name}
            onChangeText={setName}
            placeholder="Name"
            autoCapitalize="words"
          />
        </View>
        {/* COUNTRY */}
        <View style={styles.inputSection}>
          <Text style={styles.inputTitle}>Country</Text>
          <View style={styles.inputField}>
            <CountrySelect
              selectedCountry={country}
              setSelectedCountry={setCountry}
            />
          </View>
        </View>
        {/* CARD DETAILS */}
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
              setIsCardComplete(cardDetails.complete);
              setCard(cardDetails);
            }}
          />
        </View>
        <View style={styles.poweredByStripeContainer}>
          <PoweredByStripeIcon height={30} width={150} />
        </View>
        <View style={styles.submitButtonWrapper}>
          <TouchableRipple
            style={[
              styles.submitButton,
              !allFieldsCompleted && styles.disabledButton,
            ]}
            // onPress={handleSaveCard}
            disabled={!allFieldsCompleted}
          >
            {!allFieldsCompleted && (
              <LockIcon width={24} height={24} color={Color.white} />
            )}
            <Text style={styles.submitButtonText}>Add Card</Text>
          </TouchableRipple>
        </View>
        <TouchableOpacity onPress={openPaymentSheet}>
          <Text>hi</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </TouchableWithoutFeedback>
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
    fontSize: 16,
    marginLeft: 5,
    marginBottom: 10,
  },
  inputField: {
    width: "100%",
    height: 62,
    marginBottom: 20,
    backgroundColor: Color.white,
    borderColor: Color.white,
    borderWidth: 1,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    fontSize: 17,
    color: "grey",
  },
  cardField: {
    width: "100%",
    height: 62,
    marginBottom: 20,
    borderRadius: 10,
  },
  poweredByStripeContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 40,
  },
  // submitButtonContainer: {
  //   flexDirection: "row",
  //   justifyContent: "center",
  //   width: "100%",
  // },
  submitButtonWrapper: {
    borderRadius: 10,
    overflow: "hidden",
    width: "100%",
  },
  submitButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
    height: 62,
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  submitButtonText: {
    color: "white",
    fontSize: 22,
    fontWeight: 600,
  },
  disabledButton: {
    opacity: 0.5,
  },
});
