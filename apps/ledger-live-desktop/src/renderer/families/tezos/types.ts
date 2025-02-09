import {
  TezosAccount,
  Transaction,
  TransactionStatus,
} from "@ledgerhq/live-common/families/tezos/types";

import { FieldComponentProps, LLDCoinFamily } from "../types";

export type TezosFamily = LLDCoinFamily<TezosAccount, Transaction, TransactionStatus>;
export type TezosFieldComponentProps = FieldComponentProps<
  TezosAccount,
  Transaction,
  TransactionStatus
>;
