import invariant from "invariant";
import React, { useCallback } from "react";
import { Trans } from "react-i18next";
import { isStash } from "@ledgerhq/live-common/families/polkadot/logic";
import { getAccountBridge } from "@ledgerhq/live-common/bridge/index";
import { SyncSkipUnderPriority } from "@ledgerhq/live-common/bridge/react/index";
import { urls } from "~/config/urls";
import AccountFooter from "~/renderer/modals/Send/AccountFooter";
import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import Alert from "~/renderer/components/Alert";
import ErrorBanner from "~/renderer/components/ErrorBanner";
import { StepProps } from "../types";
import AmountField from "../fields/AmountField";
import RewardDestinationField from "../fields/RewardDestinationField";

export default function StepAmount({
  account,
  onChangeTransaction,
  transaction,
  status,
  error,
}: StepProps) {
  invariant(account && transaction, "account and transaction required");
  const bridge = getAccountBridge(account);
  const { rewardDestination } = transaction;
  const setRewardDestination = useCallback(
    (rewardDestination: string) => {
      onChangeTransaction(
        bridge.updateTransaction(transaction, {
          rewardDestination,
        }),
      );
    },
    [bridge, transaction, onChangeTransaction],
  );

  // If account is not a stash, it's a fresh bond transaction.
  const showRewardDestination = !isStash(account);
  return (
    <Box flow={1}>
      <SyncSkipUnderPriority priority={100} />
      <TrackPage category="Bond Flow" name="Step 1" flow="stake" action="bond" currency="dot" />
      {error && <ErrorBanner error={error} />}
      <Alert
        type="primary"
        learnMoreUrl={urls.stakingPolkadot}
        learnMoreLabel={<Trans i18nKey="polkadot.bond.steps.amount.learnMore" />}
        mb={4}
      >
        <Trans i18nKey="polkadot.bond.steps.amount.info" />
      </Alert>
      {showRewardDestination ? (
        <RewardDestinationField
          rewardDestination={rewardDestination || "Slash"}
          onChange={setRewardDestination}
        />
      ) : null}
      <AmountField
        transaction={transaction}
        account={account}
        onChangeTransaction={onChangeTransaction}
        status={status}
      />
    </Box>
  );
}
export function StepAmountFooter({
  transitionTo,
  account,
  onClose,
  status,
  bridgePending,
}: StepProps) {
  invariant(account, "account required");
  const { errors } = status;
  const hasErrors = Object.keys(errors).length;
  const canNext = !bridgePending && !hasErrors;
  return (
    <>
      <AccountFooter account={account} status={status} />
      <Box horizontal>
        <Button mr={1} secondary onClick={onClose}>
          <Trans i18nKey="common.cancel" />
        </Button>
        <Button
          disabled={!canNext}
          isLoading={bridgePending}
          primary
          onClick={() => transitionTo("connectDevice")}
        >
          <Trans i18nKey="common.continue" />
        </Button>
      </Box>
    </>
  );
}
