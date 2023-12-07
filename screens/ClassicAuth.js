// This file is not being used -- Auth.js is. This just contains the ChatGPT style auth styles ("Continue with Apple and Continue with Google") to be saved if needed in future projects.
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect } from "react";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import {
  GoogleAuthProvider,
  OAuthProvider,
  signInWithCredential,
  signInWithPopup,
} from "@firebase/auth";
import { auth } from "../database/firebase";
import * as AppleAuthentication from "expo-apple-authentication";
import * as Crypto from "expo-crypto";

const BUTTON_BORDER_RADIUS = 15;
const BUTTON_HEIGHT = 50;

WebBrowser.maybeCompleteAuthSession();

const Auth = () => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId:
      "339175420075-v42r1ddjnh204setp3dqbvcrra44ld67.apps.googleusercontent.com",
    expoClientId:
      "339175420075-0i79q167q44hfaskb1ffs8urr8fpa8gn.apps.googleusercontent.com",
  });

  useEffect(() => {
    if (response?.type == "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential);
    }
  }, [response]);

  const appleSignIn = async () => {
    const csrf = Math.random().toString(36).substring(2, 15);
    const nonce = Math.random().toString(36).substring(2, 10);
    const hashedNonce = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      nonce
    );

    try {
      const appleCredential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      console.log(appleCredential);
      const { identityToken } = appleCredential;

      let credential;
      if (identityToken) {
        try {
          credential = new OAuthProvider("apple.com").credential({
            idToken: identityToken,
            rawNonce: nonce, 
          });
          console.log("firebase credential fetched");

          const { user } = await signInWithCredential(auth, credential);
          console.log("user signed in");
          console.log(user);
        } catch (error) {
          console.error("Error signing in: ", error);
        }

      }
    } catch (e) {
      if (e.code === "ERR_REQUEST_CANCELED") {
        // handle that the user canceled the sign-in flow
      } else {
        // handle other errors
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.bottomContainer}>
        <AppleAuthentication.AppleAuthenticationButton
          buttonType={
            AppleAuthentication.AppleAuthenticationButtonType.CONTINUE
          }
          buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.WHITE}
          cornerRadius={BUTTON_BORDER_RADIUS}
          style={styles.appleButton}
          onPress={() => appleSignIn()}
        />
        <TouchableOpacity
          style={styles.googleButton}
          onPress={() => promptAsync()}
        >
          <Image
            source={require("../assets/images/Google.png")}
            style={{ width: 22, height: 22 }}
          />
          <Text style={styles.googleText}>Continue with Google</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Auth;

const styles = StyleSheet.create({
  container: {
    // borderWidth: 1,
    // borderColor: "white",
    flex: 1,
    justifyContent: "flex-end",
  },
  bottomContainer: {
    // borderWidth: 1,
    // borderColor: "white",
    alignItems: "center",
    gap: 13,
    paddingBottom: 50,
    paddingHorizontal: 30,
    paddingTop: 25,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: "black",
  },
  appleButton: {
    width: "100%",
    height: BUTTON_HEIGHT,
    // Corner radius must be set in component
  },
  googleButton: {
    width: "100%",
    height: BUTTON_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: BUTTON_BORDER_RADIUS,
    gap: 3,
    backgroundColor: "#302c34",
  },
  googleText: {
    fontSize: 19,
    fontWeight: 500,
    color: "white",
  },
});
