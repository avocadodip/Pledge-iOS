import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StripeProvider } from "@stripe/stripe-react-native";
import { BottomSheetProvider } from "./hooks/BottomSheetContext";
import { SettingsProvider, useSettings } from "./hooks/SettingsContext";
import { ThemesProvider } from "./hooks/ThemesContext";
import { STRIPE_PUBLISHABLE_KEY } from "@env";
import MainStack from "./components/MainStack";
import Splash from "./components/Splash";
import TodoBottomSheet from "./components/todaytmrw/TodoBottomSheet";
import { MenuProvider } from "react-native-popup-menu";
import Auth from "./screens/Auth";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaView } from "react-native";

const Stack = createStackNavigator();

export default function App() {
  return (
    <SettingsProvider>
      <ThemesProvider>
        <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
          <MenuProvider>
            <AppContent />
          </MenuProvider>
        </StripeProvider>
      </ThemesProvider>
    </SettingsProvider>
  );
}

function AppContent() {
  const { isAuthenticated, todayPageLoaded, finishSignup } = useSettings();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    if (
      isAuthenticated === false ||
      (isAuthenticated === true && todayPageLoaded === true) ||
      finishSignup
    ) {
      setShowSplash(false);
    }
  }, [isAuthenticated, todayPageLoaded, finishSignup]);

  if (showSplash) {
    return <Splash />;
  }

  return (
    <NavigationContainer theme={{ colors: {} }} style={{ flex: 1 }}>
      <Stack.Navigator>
        {isAuthenticated && (finishSignup || todayPageLoaded) ? (
          <Stack.Screen
            name="Home"
            options={{ headerShown: false, animationEnabled: false }}
          >
            {() => (
              <BottomSheetProvider>
                <MainStack />
                <TodoBottomSheet />
              </BottomSheetProvider>
            )}
          </Stack.Screen>
        ) : (
          <Stack.Screen
            name="Auth"
            component={Auth}
            options={{ headerShown: false, animationEnabled: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
