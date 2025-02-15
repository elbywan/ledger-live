import React, { Component } from "react";
import { compose } from "redux";
import { createStructuredSelector } from "reselect";
import { withTranslation, TFunction } from "react-i18next";
import { connect } from "react-redux";
import styled from "styled-components";
import { Account } from "@ledgerhq/types-live";
import { openModal } from "~/renderer/actions/modals";
import Box from "~/renderer/components/Box";
import DownloadCloud from "~/renderer/icons/DownloadCloud";
import Label from "~/renderer/components/Label";
import Button from "~/renderer/components/Button";
import { activeAccountsSelector } from "~/renderer/reducers/accounts";

type Props = {
  t: TFunction;
  openModal: (b: string) => void;
  primary?: boolean;
  accounts: Account[];
};
const mapDispatchToProps = {
  openModal,
};
const mapStateToProps = createStructuredSelector({
  accounts: activeAccountsSelector,
});
class ExportOperationsBtn extends Component<Props> {
  openModal = () => this.props.openModal("MODAL_EXPORT_OPERATIONS");
  render() {
    const { t, primary, accounts } = this.props;
    if (!accounts.length && !primary) return null;
    return primary ? (
      <Button
        small
        primary
        event="ExportAccountOperations"
        disabled={!accounts.length}
        onClick={this.openModal}
      >
        {t("exportOperationsModal.cta")}
      </Button>
    ) : (
      <LabelWrapper onClick={this.openModal}>
        <Box mr={1}>
          <DownloadCloud />
        </Box>
        <span>{t("exportOperationsModal.title")}</span>
      </LabelWrapper>
    );
  }
}
export default compose<React.ComponentType<Props>>(
  connect(mapStateToProps, mapDispatchToProps),
  withTranslation(),
)(ExportOperationsBtn);

const LabelWrapper = styled(Label)`
  &:hover {
    color: ${p => p.theme.colors.wallet};
    cursor: pointer;
  }
  color: ${p => p.theme.colors.wallet};
  font-size: 13px;
  font-family: "Inter", Arial;
  font-weight: 600;
`;
