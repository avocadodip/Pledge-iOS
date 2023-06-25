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
} from "react-native";
import {
  useStripe,
  createPaymentMethod,
  CardField,
  confirmPayment,
} from "@stripe/stripe-react-native";
import { Color } from "../GlobalStyles";
import SettingsHeader from "../components/SettingsHeader";
import CountrySelect from "../components/CountrySelect";
import PoweredByStripeIcon from "../assets/icons/stripe-logo.svg";
import TouchableRipple from "../components/TouchableRipple";
import { useSettings } from "../hooks/SettingsContext";
import LockIcon from "../assets/icons/lock-icon-outline.svg";

const Billing = ({ navigation }) => {
  const { currentUserEmail } = useSettings();

  const [name, setName] = useState("");
  const [country, setCountry] = useState("United States");
  const [card, setCard] = useState(null);

  const [isCardComplete, setIsCardComplete] = useState(false);

  // useEffect to track changes in input fields and check if all fields are completed
  const [allFieldsCompleted, setAllFieldsCompleted] = useState(false);
  useEffect(() => {
    if (name.trim() && country.trim() && isCardComplete) {
      setAllFieldsCompleted(true);
    } else {
      setAllFieldsCompleted(false);
    }
    console.log(allFieldsCompleted);
  }, [name, country, isCardComplete]);

  // Handle card save
  const handleSaveCard = async () => {
    console.log(card);

    // Attempt to create the payment method
    const { error, paymentMethod } = await createPaymentMethod({
      type: "Card",
      card: card,
      billing_details: {
        name: name,
        address: {
          country: country,
        },
      },
    });

    if (error) {
      console.log(error);
    } else if (paymentMethod) {
      // Send the paymentMethod.id to your server
      const response = await fetch("https://yourserver.com/save-card", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentMethodId: paymentMethod.id,
          customerId: "123", // Customer's Stripe ID if one exists, else this can be created on server-side
        }),
      });

      // Check the response from your server. If successful, save the payment method ID or any other data in state, or navigate to another screen, etc.
      if (response.ok) {
        // Success handling
      } else {
        // Error handling
      }
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
            onPress={handleSaveCard}
            disabled={!allFieldsCompleted}
          >
            {!allFieldsCompleted && (
              <LockIcon width={24} height={24} color={Color.white} />
            )}
            <Text style={styles.submitButtonText}>Add Card</Text>
          </TouchableRipple>
        </View>
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
