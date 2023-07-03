import { getIdToken } from "firebase/auth";
import { auth } from "../database/firebase";
import { paymentSheetAppearance } from "../GlobalStyles";
import {
  initPaymentSheet,
} from "@stripe/stripe-react-native";
import { API_URL, MERCHANT_DISPLAY_NAME } from "../constants";

// Initiailize payment sheet
export const initializePaymentSheet = async (stripeCustomerId, currentUserID) => {
  const idToken = await getIdToken(auth.currentUser, true);
 
  const response = await fetch(
    `${API_URL}/createSetupIntent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + idToken,
      },
      body: JSON.stringify({
        stripeCustomerId: stripeCustomerId,
        uid: currentUserID,
      }),
    }
  );

  // Handle response from your server.
  if (!response.ok) {
    throw new Error("Failed to setup intent.");
  }
  
  const { setupIntent, ephemeralKey } = await response.json();

  // Initialize payment sheet
  const { error } = await initPaymentSheet({
    merchantDisplayName: MERCHANT_DISPLAY_NAME,
    customerId: stripeCustomerId,
    customerEphemeralKeySecret: ephemeralKey,
    setupIntentClientSecret: setupIntent,
    appearance: paymentSheetAppearance,
  });

  if (error) {
    throw error; // Throw the error if initialization fails
  }
  // Promise resolves successfully if no error
};

// Fetch payment methods
export const fetchPaymentMethods = async (stripeCustomerId, currentUserID) => {
  const idToken = await getIdToken(auth.currentUser, true);

  const response = await fetch(
    `${API_URL}/listPaymentMethods`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + idToken,
      },
      body: JSON.stringify({
        stripeCustomerId: stripeCustomerId,
        uid: currentUserID,
      }),
    }
  );

  // Handle response from your server.
  if (!response.ok) {
    throw new Error("Failed to fetch payment methods.");
  }
  
  const paymentMethods = await response.json();

  return paymentMethods;
};

