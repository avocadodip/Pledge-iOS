// eas build --profile preview --platform ios --local

// eas build --profile development --platform ios --local
// npx expo start --dev-client
// Video used to set up Google Auth (using expo-auth-session, which may be removed in the future) https://www.youtube.com/watch?v=XB_gNDoOhjY&ab_channel=CodewithBeto
// TO-DO: When pushing to testflight, we must change "host.exp.Exponent" to "com.cewidiupleek.pledge" in Firebase console: Authentication --> Sign-in method --> Apple --> Services ID

// https://blog.devgenius.io/how-to-build-an-ios-expo-app-without-using-eas-build-78bfc4002a0f
// npx expo prebuild
// npx pod install
// open ios/PledgeBetOnYourself.xcworkspace
// Product --> Archive
import {
  Image,
  Pressable,
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
  reload,
  signInWithCredential,
  signInWithPopup,
} from "@firebase/auth";
import { auth } from "../database/firebase";
import * as AppleAuthentication from "expo-apple-authentication";
import * as Crypto from "expo-crypto";
import AnimatedButton from "../components/AnimatedButton";
import { redGradientValues } from "../themes";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  FadeInDown,
  FadeInUp,
  SlideInDown,
  SlideInUp,
  SlideOutDown,
  SlideOutUp,
} from "react-native-reanimated";

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
      try {
        const credential = GoogleAuthProvider.credential(id_token);
        signInWithCredential(auth, credential);
      } catch (error) {
        console.log("sign in error", error);
      }
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
    <LinearGradient style={styles.container} colors={redGradientValues}>
      <Animated.View entering={FadeInDown.duration(1000).delay(200)}>
        <Image
          source={require("../assets/icons/pledgetransparent.png")}
          style={{ width: 150, height: 150 }}
        />
      </Animated.View>

      <Animated.View
        style={styles.bottomContainer}
        entering={SlideInDown.duration(1500)}
        exiting={SlideOutDown.duration(1000)}
      >
        <View style={styles.buttonContainer}>
          <AnimatedButton
            style={[styles.authButton, styles.googleButton]}
            onPress={() => promptAsync()}
          >
            <Image
              source={require("../assets/logos/Google.png")}
              style={{ width: 22, height: 22 }}
            />
          </AnimatedButton>
          <AnimatedButton
            style={[styles.authButton, styles.appleButton]}
            onPress={() => appleSignIn()}
          >
            <Image
              source={require("../assets/logos/Apple.png")}
              style={{ width: 18, height: 23 }}
            />
          </AnimatedButton>
        </View>
      </Animated.View>
    </LinearGradient>
  );
};

export default Auth;

const styles = StyleSheet.create({
  container: {
    // borderWidth: 1,
    // borderColor: "white",
    flex: 1,
    justifyContent: "flex-end",
    justifyContent: "center",
    alignItems: "center",
  },
  bottomContainer: {
    // borderWidth: 1,
    // borderColor: "white",
    position: "absolute",
    bottom: 0,
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 60,
    paddingHorizontal: 30,
    paddingTop: 40,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: "#ffffff58",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 25,
  },
  authButton: {
    height: 60,
    width: 110,
    backgroundColor: "white",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  googleButton: {
    borderWidth: 0.8,
    borderColor: "#dfdfdf",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 5,
  },
  appleButton: {
    backgroundColor: "black",
  },
  promptText: {
    fontSize: 17,
    color: "#6c6c6c",
  },
});
