import PropTypes from 'prop-types'
import React, { Component } from 'react'

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

  constructor(props) {
    super(props)

    this.ul = React.createRef()
    this.outerDiv = React.createRef()
  }

  componentDidMount() {
    const { searchQuery } = this.props
    if (!searchQuery) {
      this.filter.input.focus()
    } else {
      this.filter.input.blur()
    }
  }

  onUserClick = user => {
    const { user: propsUser, downloadUser } = this.props
    if (propsUser === undefined || propsUser.id !== user.id) {
      downloadUser(user.id, user.rights)
    }
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
      downloadUser,
      user
    } = this.props

    const list = dropdownContent.map(cont => cont)

    const show = selected < 0 && !user
    const showFirst = separateFirst

    const showList = list.length > 0 && !(showFirst && list.length === 1)

    return (
      <div className={styles.searchField} ref={this.outerDiv}>
        <Input
          onChange={onChange}
          value={searchQuery}
          label={placeholder}
          placeholder={placeholder}
          type="text"
          align="left"
          ref={component => this.filter = component}
          highlight={highlight}
          style={inputStyles}
          readOnly={!show}
          key="input"
        />

        {show
        && (
          <div>
            {showFirst
            && (
              <UsersList
                className={styles.separated}
                users={[ list.shift() ]}
                onClick={this.onUserClick}
                searchQuery={searchQuery}
                selectedIndex={selected}
                key="UserListFist"
              />
            )
            }
            <div className={`${styles.drop}`} ref={this.ul} key="UserListDiv">
              {showList
              && (
                <UsersList
                  className={styles.scrollable}
                  users={list}
                  onClick={this.onUserClick}
                  searchQuery={searchQuery}
                  selectedIndex={selected}
                  key="UserList"
                />
              )
              }
              <ButtonsTable
                className={styles.buttons}
                buttons={buttons}
                onClick={downloadUser}
                key="buttonTable"
              />
            </div>
          </div>
        )
        }
      </div>
    )
  }
}
