import React, { Component } from "react"
import Styled from "styled-components"
import { Header, Input, Modal, Statistic } from "semantic-ui-react"
import moment from "moment"

import Submit from "./../../Buttons/Submit"
import Cancel from "./../../Buttons/Cancel"
import DatePicker from "./../../Inputs/DatePicker"
import InputLabel from "./../../Inputs/InputLabel"
import SearchDropdown from "./../../Inputs/SearchDropdown"

import round from "./../../../helpers/round"
import formatNumberForDisplay from "./../../../helpers/formatNumberForDisplay"
import { calculateWalletQuantity } from "./../../../helpers/walletMetrics"

import { theme } from "./../../../constants"

const ModalInputContainer = Styled.div`
  & > * {margin-bottom: 12px;}
`

const ValueStatistic = Styled.div`
  margin-top: 4px !important;
`

const SENT = "sent"
const RECEIVED = "received"

export default class extends Component {
  constructor(props) {
    super(props)
    const { coin } = this.props.modals.create_transaction
    this.state = {
      time_transacted: moment(),
      type: RECEIVED,
      quantity: "",
      validQuantity: null,
      cost_per_coin_usd: coin.price_usd
    }
  }

  setTimeTransacted = date => this.setState({ time_transacted: date })
  setTransactionType = value =>
    this.setState({
      type: value,
      validQuantity: this.isValidQuantity(this.state.quantity, value)
    })
  setQuantity = (event, { value }) =>
    this.setState({
      quantity: value,
      validQuantity: this.isValidQuantity(value, this.state.type)
    })
  setPricePerCoin = (event, { value }) =>
    this.setState({ cost_per_coin_usd: value })

  isValidQuantity = (quantity, type) =>
    this.isValidFloat(quantity) &&
    this.parseFloatInput(quantity) !== 0 &&
    //make sure the user can't send more than exists in wallet
    (type === RECEIVED ||
      this.parseFloatInput(quantity) <
        calculateWalletQuantity(this.props.modals.create_transaction))
  isValidCost = cost =>
    this.isValidFloat(cost) && this.parseFloatInput(cost) > 0
  isValidFloat = value =>
    !!value.toString().length && !!value.toString().match(/^(\d*\.?\d*)$/)
  parseFloatInput = value => parseFloat(value.toString().trim())

  render() {
    const { closeModal, editWallet, modals, navigateTo } = this.props
    const wallet = modals.create_transaction
    const { coin } = modals.create_transaction
    const {
      time_transacted,
      quantity,
      cost_per_coin_usd,
      type,
      validQuantity
    } = this.state

    return (
      <Modal open size="tiny" onClose={closeModal}>
        <Modal.Header>Record a Transaction</Modal.Header>
        <Modal.Content>
          <ModalInputContainer>
            <InputLabel>Transaction Date</InputLabel>
            <DatePicker
              fluid
              selected={time_transacted}
              onChange={this.setTimeTransacted}
              maxDate={moment()}
            />
            <InputLabel>Transaction Type</InputLabel>
            <SearchDropdown
              options={[
                { value: SENT, text: "Sent" },
                { value: RECEIVED, text: "Received" }
              ]}
              value={type}
              onChange={this.setTransactionType}
            />
            <InputLabel>Quantity ({coin.symbol})</InputLabel>
            <Input
              fluid
              placeholder="Quantity"
              value={quantity}
              onChange={this.setQuantity}
              error={validQuantity === false}
            />
            <InputLabel>Price Per Coin</InputLabel>
            <Input
              fluid
              placeholder="Cost Per Coin (USD)"
              value={cost_per_coin_usd}
              onChange={this.setPricePerCoin}
              label={{ content: "$" }}
              error={!this.isValidCost(cost_per_coin_usd)}
            />
            {validQuantity && this.isValidCost ? (
              <div>
                <InputLabel>Transaction Value</InputLabel>
                <Statistic horizontal size="mini" as={ValueStatistic}>
                  <Statistic.Value>
                    ${formatNumberForDisplay(
                      round(
                        this.parseFloatInput(cost_per_coin_usd) *
                          this.parseFloatInput(quantity),
                        2
                      )
                    )}
                  </Statistic.Value>
                  <Statistic.Label>USD</Statistic.Label>
                </Statistic>
              </div>
            ) : null}
          </ModalInputContainer>
        </Modal.Content>
        <Modal.Actions>
          <Cancel onClick={closeModal} />
          <Submit
            disabled={!validQuantity || !this.isValidCost(cost_per_coin_usd)}
            onClick={e => {
              delete wallet.coin
              editWallet(wallet.name, {
                ...wallet,
                transactions: [
                  ...wallet.transactions,
                  {
                    time_recorded: moment(),
                    time_transacted: time_transacted,
                    quantity: this.parseFloatInput(quantity),
                    type: type,
                    cost_per_coin_usd: this.parseFloatInput(cost_per_coin_usd),
                    fee: null,
                    notes: []
                  }
                ]
              })
              closeModal()
              navigateTo(
                `/dashboard/wallet?name=${encodeURIComponent(wallet.name)}`
              )
            }}
          />
        </Modal.Actions>
      </Modal>
    )
  }
}
