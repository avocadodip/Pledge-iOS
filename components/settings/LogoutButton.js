import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { auth } from "../../database/firebase";
import TouchableRipple from "../TouchableRipple";
import LogoutIcon from "../../assets/icons/logout.svg";
import { Color } from "../../GlobalStyles";
const LogoutButton = () => {

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Sign out error", error);
    }
  };

  return (
    <TouchableRipple style={styles.button} onPress={handleLogout}>
      <LogoutIcon width={24} height={24} color={Color.fervo_red} />
      <Text style={styles.buttonText}>Log Out</Text>
    </TouchableRipple>
  );
};

export default LogoutButton;

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Color.white,
    gap: 15,
    height: 48,
    borderRadius: 17,
    width: "100%",
    overflow: "hidden",
  },
  buttonText: {
    color: Color.fervo_red,
    fontSize: 16,
    fontWeight: "600",
  },
});
