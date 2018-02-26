import React, { Component } from "react"
import Styled from "styled-components"
import { Icon, Loader, Statistic } from "semantic-ui-react"

import NotFound from "./NotFound"
import ContentComponent from "./../ContentComponent"
import SummaryTable from "./SummaryTable"
import HeaderStatistics from "./HeaderStatistics"
import TransactionTable from "./TransactionTable"
import WalletLineChart from "./WalletLineChart"

import round from "./../../../helpers/round"
import parseSearchQuery from "./../../../helpers/parseSearchQuery"
import formatNumberForDisplay from "./../../../helpers/formatNumberForDisplay"

import { theme } from "./../../../constants"

const EditWalletIcon = Styled.i`
  margin-left: 12px !important;
  cursor: pointer;
  color: ${theme.colors.gray};
  font-size: 0.75em !important;

  &:hover {
    color: ${theme.colors.blue};
  }
`
const RemoveWalletIcon = Styled.i`
  cursor: pointer;
  color: ${theme.colors.gray};
  font-size: 0.75em !important;

  &:hover {
    color: ${theme.colors.red};
  }
`

export default class extends Component {
  componentWillMount() {
    const { fetchWallets, fetchCoins, wallets, coins } = this.props
    if (!wallets.fetched) {
      fetchWallets()
    }
    if (!coins.fetching_coins && !coins.fetched) {
      fetchCoins()
    }
  }

  walletName = () => parseSearchQuery(this.props.location.search).name

  render() {
    const {
      coins,
      wallets,
      requestEditWallet,
      requestDeleteWallet,
      requestCreateTransaction,
      requestDeleteTransaction,
      requestEditTransaction,
      requestTransactionNote,
      fetchTimeSeries
    } = this.props
    const wallet = wallets.by_name[this.walletName()]
    const coin = wallet ? coins.by_symbol[wallet.symbol] : null

    if (!coins.fetched || !wallets.fetched) {
      return <Loader active />
    } else if (!wallet) {
      return <NotFound walletName={this.walletName()} />
    } else {
      return (
        <ContentComponent
          header={
            <span>
              {wallet.name}
              <Icon
                as={EditWalletIcon}
                name="edit"
                onClick={e => requestEditWallet({ ...wallet, coin: coin })}
              />
              <Icon
                as={RemoveWalletIcon}
                name="remove circle"
                onClick={e => requestDeleteWallet(wallet.name)}
              />
            </span>
          }
          subHeader={`Your ${coin.name} Wallet`}
          coinSymbol={coin.symbol}
        >
          <HeaderStatistics {...{ wallet, coin }} />
          <SummaryTable {...{ wallet, coin }} />
          <WalletLineChart {...{ wallet, coins, fetchTimeSeries }} />
          <TransactionTable
            {...{
              wallet,
              coin,
              requestCreateTransaction,
              requestDeleteTransaction,
              requestEditTransaction,
              requestTransactionNote
            }}
          />
        </ContentComponent>
      )
    }
  }
}
