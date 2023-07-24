// TabIcon.js
import React from 'react';

export default function TabIcon({ focused, activeIcon: ActiveIcon, inactiveIcon: InactiveIcon, theme }) {
  return focused ? (
    <ActiveIcon
      width={40}
      height={40}
      color={theme.textHigh}
    />
  ) : (
    <InactiveIcon
      width={40}
      height={40}
      color={theme.textHigh}
    />
  );
}
