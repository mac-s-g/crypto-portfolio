import React, { Component } from "react"
import { Modal } from "semantic-ui-react"
import Submit from "./../Buttons/Submit"
import Cancel from "./../Buttons/Cancel"
import CoinDropdown from "./../Inputs/CoinDropdown"

export default class extends Component {
  state = { selected: [] }

  selectCoin = coin => this.setState({ selected: coin })

  render() {
    const { closeModal, addToWatchList, coins, watchList } = this.props
    const { selected } = this.state

    return (
      <Modal open size="tiny" onClose={closeModal} closeOnEscape={false}>
        <Modal.Header>Add to Watch List</Modal.Header>
        <Modal.Content>
          <CoinDropdown
            onChange={this.selectCoin}
            exclude={watchList.ranked}
            value={selected}
            multiple
            {...this.props}
          />
        </Modal.Content>
        <Modal.Actions>
          <Cancel onClick={closeModal} />
          <Submit
            disabled={selected.length == 0}
            onClick={() => {
              addToWatchList(selected)
              closeModal()
            }}
          />
        </Modal.Actions>
      </Modal>
    )
  }
}
