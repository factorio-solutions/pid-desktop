import React, { Component, PropTypes } from 'react'

import Input        from '../input/Input'
import UsersList    from './usersList'
import ButtonsTable from './buttonsTable'

import styles      from './SearchField.scss'
import inputStyles from '../input/ReservationInput.scss'


export default class SearchField extends Component {
  static propTypes = {
    dropdownContent: PropTypes.array.isRequired,
    searchQuery:     PropTypes.string,
    selected:        PropTypes.number,
    onChange:        PropTypes.func,
    buttons:         PropTypes.array,
    placeholder:     PropTypes.string,
    highlight:       PropTypes.bool,
    separateFirst:   PropTypes.bool,
    user:            PropTypes.object,
    downloadUser:    PropTypes.func
  }

  static defaultProps = {
    buttons: []
  }

  constructor(props) {
    super(props)
    this.state = {
      selected: this.props.selected,
      show:     true
    }
  }

  componentDidMount() {
    if (!this.props.searchQuery) {
      this.filter.input.focus()
    } else {
      this.filter.input.blur()
      this.hide()
    }
    document.addEventListener('mousedown', this.handleClick)
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClick)
  }

  onUserClick = user => {
    if (this.props.user === undefined || this.props.user.id !== user.id) {
      this.props.downloadUser(user.id, user.rights)
      this.hide()
    }
  }

  handleClick = event => {
    if (
      this.outerDiv &&
      !this.outerDiv.contains(event.target) &&
      this.state.show
    ) {
      this.hide()
    }
  }

  hide = () => {
    this.setState({
      ...this.state,
      show: false
    })
  }

  show = () => {
    this.setState({
      ...this.state,
      show: true
    })
  }

  render() {
    const {
      dropdownContent,
      buttons,
      placeholder,
      searchQuery,
      onChange,
      highlight,
      separateFirst,
      selected,
      downloadUser
    } = this.props

    const list = dropdownContent.map(cont => cont)
    // dropdownContent.filter((_, index) => {
    //   if (selected >= 0) {
    //     return index === selected
    //   } else {
    //     return true
    //   }
    // })

    // TODO: When the list is split and user selected -> line is selected in both lists.
    const show = (selected < 0 || this.state.show) && list.length > 0

    const showFirst = separateFirst

    const showList = list.length > 0 && !(showFirst && list.length === 1)

    return (
      <div className={styles.searchField} ref={div => this.outerDiv = div}>
        <Input
          onChange={onChange}
          value={searchQuery}
          label={placeholder}
          placeholder={placeholder}
          type="text"
          align="left"
          onFocus={this.show}
          ref={component => this.filter = component}
          highlight={highlight}
          style={inputStyles}
        />

        {show &&
          <div>
            {showFirst &&
              <UsersList
                className={styles.separated}
                users={[ list.shift() ]}
                onClick={this.onUserClick}
                searchQuery={searchQuery}
                selectedIndex={selected}
              />
            }
            <div className={`${styles.drop}`} ref={ul => this.ul = ul}>
              {showList &&
                <UsersList
                  className={styles.scrollable}
                  users={list}
                  onClick={this.onUserClick}
                  searchQuery={searchQuery}
                  selectedIndex={selected}
                />
              }

              <ButtonsTable
                className={styles.buttons}
                buttons={buttons}
                onClick={downloadUser}
              />
            </div>
          </div>
        }
      </div>
    )
  }
}
