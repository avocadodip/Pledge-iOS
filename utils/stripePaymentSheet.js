import { getIdToken } from "firebase/auth";
import { auth } from "../database/firebase";
import { initPaymentSheet } from "@stripe/stripe-react-native";
import { API_URL, MERCHANT_DISPLAY_NAME } from "@env";
import { Color } from "../GlobalStyles";

// Initiailize payment sheet
export const initializePaymentSheet = async (
  stripeCustomerId,
  currentUserID,
  theme
) => {
  // https://stripe.com/docs/elements/appearance-api (fonts & light/dark mode)
  const paymentSheetAppearance = {
    shapes: {
      borderRadius: 12,
      borderWidth: 0,
      shadow: 0,
    },
    colors: {
      primary: "#fcfdff",
      background: theme.accent,
      componentBackground: "#e86464",
      componentBorder: "#f3f8fa",
      componentDivider: Color.white,
      primaryText: Color.white,
      secondaryText: Color.white,
      componentText: Color.white,
      placeholderText: Color.white,
      icon: Color.white,
      error: "#e1e1e1",
    },
    primaryButton: {
      colors: {
        background: "#e86464",
        text: Color.white,
      },
      shapes: {
        borderWidth: 0,
        borderRadius: 12,
        shadow: 0,
      },
    },
  };

  const idToken = await getIdToken(auth.currentUser, true);

  const response = await fetch(`${API_URL}/createSetupIntent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + idToken,
    },
    body: JSON.stringify({
      stripeCustomerId: stripeCustomerId,
      uid: currentUserID,
    }),
  });

  // Handle response from your server.
  if (!response.ok) {
    const responseData = await response.json();
    console.log("Response:", responseData);
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

  return setupIntent;
};

// Fetch payment methods
export const fetchPaymentMethods = async (stripeCustomerId, currentUserID) => {
  const idToken = await getIdToken(auth.currentUser, true);

  const response = await fetch(`${API_URL}/listPaymentMethods`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + idToken,
    },
    body: JSON.stringify({
      stripeCustomerId: stripeCustomerId,
      uid: currentUserID,
    }),
  });

  // Handle response from your server.
  if (!response.ok) {
    throw new Error("Failed to fetch payment methods.");
  }

  const paymentMethods = await response.json();

  return paymentMethods;
};

export const retrieveSetupIntent = async (clientSecret) => {};
