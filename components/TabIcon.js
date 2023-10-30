// TabIcon.js
import React from "react";
import { View } from "react-native";

export default function TabIcon({
  type,
  focused,
  activeIcon: ActiveIcon,
  inactiveIcon: InactiveIcon,
  theme,
}) {
  return focused ? (
    <>
      <View>
        <ActiveIcon width={40} height={40} color={theme.textHigh} />
      </View>
    </>
  ) : (
    <ActiveIcon width={35} height={35} color={theme.textDisabled} />
  );
}
