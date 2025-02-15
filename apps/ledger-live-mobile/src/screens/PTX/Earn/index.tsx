import React from "react";
import { useLocalLiveAppManifest } from "@ledgerhq/live-common/platform/providers/LocalLiveAppProvider/index";
import {
  useRemoteLiveAppContext,
  useRemoteLiveAppManifest,
} from "@ledgerhq/live-common/platform/providers/RemoteLiveAppProvider/index";
import { useTheme } from "styled-components/native";
import { Flex, InfiniteLoader } from "@ledgerhq/native-ui";
import TrackScreen from "../../../analytics/TrackScreen";
import GenericErrorView from "../../../components/GenericErrorView";
import { useLocale } from "../../../context/Locale";
import { WebPTXPlayer } from "../../../components/WebPTXPlayer";
import { EarnLiveAppNavigatorParamList } from "../../../components/RootNavigator/types/EarnLiveAppNavigator";
import { StackNavigatorProps } from "../../../components/RootNavigator/types/helpers";
import { ScreenName } from "../../../const";
import { counterValueCurrencySelector, discreetModeSelector } from "../../../reducers/settings";
import { useSelector } from "react-redux";

export type Props = StackNavigatorProps<EarnLiveAppNavigatorParamList, ScreenName.Earn>;

const appManifestNotFoundError = new Error("App not found"); // FIXME move this elsewhere.
const DEFAULT_EARN_APP_ID = "earn";

export function EarnScreen({ route }: Props) {
  const { theme } = useTheme();
  const { locale } = useLocale();
  const { ticker: currencyTicker } = useSelector(counterValueCurrencySelector);
  const discreet = useSelector(discreetModeSelector);

  const { platform: appId, ...params } = route.params || {};
  const searchParams = route.path
    ? new URL("ledgerlive://" + route.path).searchParams
    : new URLSearchParams();

  const localManifest = useLocalLiveAppManifest(DEFAULT_EARN_APP_ID);
  const remoteManifest = useRemoteLiveAppManifest(DEFAULT_EARN_APP_ID);
  const { state: remoteLiveAppState } = useRemoteLiveAppContext();
  const manifest = localManifest || remoteManifest;

  return manifest ? (
    <>
      <TrackScreen category="EarnDashboard" name="Earn" />
      <WebPTXPlayer
        manifest={manifest}
        inputs={{
          theme,
          lang: locale,
          currencyTicker,
          discreetMode: discreet ? "true" : "false",
          ...params,
          ...Object.fromEntries(searchParams.entries()),
        }}
      />
    </>
  ) : (
    <Flex flex={1} p={10} justifyContent="center" alignItems="center">
      {remoteLiveAppState.isLoading ? (
        <InfiniteLoader />
      ) : (
        <GenericErrorView error={appManifestNotFoundError} />
      )}
    </Flex>
  );
}
