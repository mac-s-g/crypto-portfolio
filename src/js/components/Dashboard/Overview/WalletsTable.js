import React, { Component } from "react"
import Styled from "styled-components"
import { Icon, Statistic, Table } from "semantic-ui-react"

//internal components
import Pie from "./../../Charts/Pie"
import SubHeader from "./../SubHeader"
import CoinLogo from "./../../CoinLogo/"

//helpers
import round from "./../../../helpers/round"
import formatNumberForDisplay from "./../../../helpers/formatNumberForDisplay"
import getRotatingThemeColor from "./../../../helpers/getRotatingThemeColor"
import {
  aggregateWalletsValue,
  calculateWalletValue,
  calculateWalletQuantity,
  calculateWalletTotalTx
} from "./../../../helpers/walletMetrics"

import { theme } from "./../../../constants"

const MIN_PERCENT_ANGLE = 3

//styled components
const TableComponent = Styled.div`
  display: block;
`

const WalletsTable = Styled.table`
  &.ui.table tr.active {
    background-color: ${theme.colors.gray_table} !important;
  }
`

const WalletNameLink = Styled.a`
  cursor: pointer;
  display: inline-block;
  margin-right: 10px;
`

const WalletSymbolLabel = Styled.span`
  color: ${theme.colors.gray};
  font-weight: bold;
  font-size: 10px;
  display: inline-block;
`

//pie chart component for wallets in portfolio
export default class extends Component {
  state = {
    selected: null,
    sort: {
      column: "portfolio_weight",
      direction: "descending"
    }
  }

  //on pie slice hover
  hoverSelect = name => this.setState({ selected: name })
  //on pie slice click
  walletLink = wallet =>
    this.props.navigateTo(`/dashboard/wallet?name=${encodeURI(wallet)}`)

  handleSort = column => {
    const { sort } = this.state
    const direction =
      column == sort.column && "descending" == sort.direction
        ? "ascending"
        : "descending"
    this.setState({
      sort: {
        column: column,
        direction: direction
      }
    })
  }

  prepareTableData = (wallets, coins, totalValue) =>
    Object.keys(wallets).map(name => {
      const cost_basis = calculateWalletTotalTx(wallets[name])
      const wallet_value = calculateWalletValue(
        wallets[name],
        coins.by_symbol[wallets[name].symbol].price_usd
      )
      return {
        ...wallets[name],
        name: name,
        market_price: `$${formatNumberForDisplay(
          round(coins.by_symbol[wallets[name].symbol].price_usd, 2)
        )}`,
        quantity: formatNumberForDisplay(
          calculateWalletQuantity(wallets[name])
        ),
        cost_basis_raw: cost_basis,
        cost_basis: !!cost_basis ? (
          `$${formatNumberForDisplay(round(cost_basis, 2))}`
        ) : (
          <Icon name="question circle outline" />
        ),
        value_raw: wallet_value,
        value: `$${formatNumberForDisplay(round(wallet_value, 2))}`,
        capital_gain: !!cost_basis ? (
          `$${formatNumberForDisplay(round(wallet_value - cost_basis, 2))}`
        ) : (
          <Icon name="question circle outline" />
        ),
        percent_gain: !!cost_basis ? (
          `${formatNumberForDisplay(
            round(100 * (wallet_value - cost_basis) / cost_basis, 2)
          )}%`
        ) : (
          <Icon name="question circle outline" />
        ),
        portfolio_weight: `${formatNumberForDisplay(
          round(
            100 *
              calculateWalletValue(
                wallets[name],
                coins.by_symbol[wallets[name].symbol].price_usd
              ) /
              totalValue,
            2
          )
        )}%`
      }
    })

  sortTable = (data, column, direction) => {
    switch (column) {
      case "name":
        //string compare
        return data.sort(function(a, b) {
          return direction == "ascending"
            ? a[column].localeCompare(b[column])
            : b[column].localeCompare(a[column])
        })
      default:
        return data.sort(function(a, b) {
          return direction == "ascending"
            ? parseFloat(a[column].toString().replace(/[^0-9\.\-]/g, "")) -
                parseFloat(b[column].toString().replace(/[^0-9\.\-]/g, ""))
            : parseFloat(b[column].toString().replace(/[^0-9\.\-]/g, "")) -
                parseFloat(a[column].toString().replace(/[^0-9\.\-]/g, ""))
        })
    }
    return data
  }

  render() {
    const { wallets, coins, totalValue } = this.props
    const { selected, sort } = this.state
    const { column, direction } = sort

    let table_data = this.prepareTableData(wallets, coins, totalValue)
    table_data = this.sortTable(table_data, column, direction)

    let aggr_cost_basis = 0,
      aggr_wallet_value = 0

    return (
      <TableComponent>
        <Table as={WalletsTable} unstackable sortable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell
                sorted={column === "name" ? direction : null}
                onClick={() => this.handleSort("name")}
              >
                Investment
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={column === "market_price" ? direction : null}
                onClick={() => this.handleSort("market_price")}
              >
                Coin Price
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={column === "quantity" ? direction : null}
                onClick={() => this.handleSort("quantity")}
              >
                Total Holding
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={column === "cost_basis" ? direction : null}
                onClick={() => this.handleSort("cost_basis")}
              >
                Cost Basis
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={column === "value" ? direction : null}
                onClick={() => this.handleSort("value")}
              >
                Current Value
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={column === "capital_gain" ? direction : null}
                onClick={() => this.handleSort("capital_gain")}
              >
                Capital Gain
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={column === "percent_gain" ? direction : null}
                onClick={() => this.handleSort("percent_gain")}
              >
                % Gain
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={column === "portfolio_weight" ? direction : null}
                onClick={() => this.handleSort("portfolio_weight")}
              >
                Portfolio Weight
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {table_data.map(wallet => {
              aggr_cost_basis += wallet.cost_basis_raw
              aggr_wallet_value += wallet.value_raw
              return (
                <Table.Row
                  key={wallet.name}
                  active={!!selected && selected == wallet.name}
                  onMouseEnter={() => this.hoverSelect(wallet.name)}
                  onMouseLeave={() => this.hoverSelect(null)}
                >
                  <Table.Cell>
                    <WalletNameLink onClick={e => this.walletLink(wallet.name)}>
                      {wallet.name}
                    </WalletNameLink>
                    <WalletSymbolLabel>{wallet.symbol}</WalletSymbolLabel>
                  </Table.Cell>
                  {/*current price*/}
                  <Table.Cell>{wallet.market_price}</Table.Cell>
                  {/*total holding*/}
                  <Table.Cell>{wallet.quantity}</Table.Cell>
                  {/*wallet cost basis*/}
                  <Table.Cell>{wallet.cost_basis}</Table.Cell>
                  {/*wallet value*/}
                  <Table.Cell>{wallet.value}</Table.Cell>
                  {/*capital gain*/}
                  <Table.Cell
                    positive={
                      !!wallet.cost_basis_raw &&
                      round(wallet.value_raw, 2) >
                        round(wallet.cost_basis_raw, 2)
                    }
                    negative={
                      !!wallet.cost_basis_raw &&
                      round(wallet.value_raw, 2) <
                        round(wallet.cost_basis_raw, 2)
                    }
                  >
                    {wallet.capital_gain}
                  </Table.Cell>
                  {/*percent gain*/}
                  <Table.Cell
                    positive={
                      !!wallet.cost_basis_raw &&
                      round(wallet.value_raw, 2) >
                        round(wallet.cost_basis_raw, 2)
                    }
                    negative={
                      !!wallet.cost_basis_raw &&
                      round(wallet.value_raw, 2) <
                        round(wallet.cost_basis_raw, 2)
                    }
                  >
                    {wallet.percent_gain}
                  </Table.Cell>
                  {/*portfolio weight*/}
                  <Table.Cell>{wallet.portfolio_weight}</Table.Cell>
                </Table.Row>
              )
            })}
          </Table.Body>
          <Table.Footer>
            <Table.Row>
              <Table.HeaderCell>Total</Table.HeaderCell>
              {/*coin price*/}
              <Table.HeaderCell />
              {/*total holding*/}
              <Table.HeaderCell />
              {/*cost basis*/}
              <Table.HeaderCell>
                {!!aggr_cost_basis
                  ? `$${formatNumberForDisplay(round(aggr_cost_basis, 2))}`
                  : "-"}
              </Table.HeaderCell>
              {/*wallet value*/}
              <Table.HeaderCell>
                ${formatNumberForDisplay(round(aggr_wallet_value, 2))}
              </Table.HeaderCell>
              {/*capital gain*/}
              <Table.HeaderCell>
                {!!aggr_cost_basis
                  ? `$${formatNumberForDisplay(
                      round(aggr_wallet_value - aggr_cost_basis, 2)
                    )}`
                  : "-"}
              </Table.HeaderCell>
              {/*percent gain*/}
              <Table.HeaderCell>
                {!!aggr_cost_basis
                  ? `${formatNumberForDisplay(
                      round(
                        100 *
                          (aggr_wallet_value - aggr_cost_basis) /
                          aggr_cost_basis,
                        2
                      )
                    )}%`
                  : "-"}
              </Table.HeaderCell>
              <Table.HeaderCell />
            </Table.Row>
          </Table.Footer>
        </Table>
      </TableComponent>
    )
  }
}
