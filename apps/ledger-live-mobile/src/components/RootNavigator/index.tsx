import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Config from "react-native-config";
import { createStackNavigator } from "@react-navigation/stack";
import useFeature from "@ledgerhq/live-common/featureFlags/useFeature";
import { NavigatorName } from "../../const";
import { hasCompletedOnboardingSelector } from "../../reducers/settings";
import BaseNavigator from "./BaseNavigator";
import BaseOnboardingNavigator from "./BaseOnboardingNavigator";
import { RootStackParamList } from "./types/RootNavigator";
import { AnalyticsContext } from "../../analytics/AnalyticsContext";
import { StartupTimeMarker } from "../../StartupTimeMarker";
import { enableListAppsV2 } from "@ledgerhq/live-common/apps/hw";

export default function RootNavigator() {
  const hasCompletedOnboarding = useSelector(hasCompletedOnboardingSelector);
  const goToOnboarding = !hasCompletedOnboarding && !Config.SKIP_ONBOARDING;
  const [analyticsSource, setAnalyticsSource] = useState<undefined | string>(undefined);
  const [analyticsScreen, setAnalyticsScreen] = useState<undefined | string>(undefined);

  const listAppsV2 = useFeature("listAppsV2");
  useEffect(() => {
    if (!listAppsV2) return;
    enableListAppsV2(listAppsV2.enabled);
  }, [listAppsV2]);

  return (
    <StartupTimeMarker>
      <AnalyticsContext.Provider
        value={{
          source: analyticsSource,
          screen: analyticsScreen,
          setSource: setAnalyticsSource,
          setScreen: setAnalyticsScreen,
        }}
      >
        <Stack.Navigator
          id={NavigatorName.RootNavigator}
          screenOptions={{
            headerShown: false,
          }}
        >
          {goToOnboarding ? (
            <Stack.Screen name={NavigatorName.BaseOnboarding} component={BaseOnboardingNavigator} />
          ) : null}
          <Stack.Screen name={NavigatorName.Base} component={BaseNavigator} />
          {hasCompletedOnboarding ? (
            <Stack.Screen name={NavigatorName.BaseOnboarding} component={BaseOnboardingNavigator} />
          ) : null}
        </Stack.Navigator>
      </AnalyticsContext.Provider>
    </StartupTimeMarker>
  );
}
const Stack = createStackNavigator<RootStackParamList>();
