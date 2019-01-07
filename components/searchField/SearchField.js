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
    }
    this.validateContent(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.validateContent(nextProps)
  }

  validateContent(nextProps) {
    const selected = nextProps.dropdownContent.length === 1 ? 0 : nextProps.selected
    const show = this.state.selected !== nextProps.selected && nextProps.selected >= 0 ?
      false :
      this.state.show

    if (selected !== this.state.selected || show !== this.state.show) {
      this.setState({
        ...this.state,
        selected,
        show
      })
    }
  }

  hide = () => setTimeout(
    () => this.setState({
      ...this.state,
      show: false
    }),
    100
  )

  show = () => {
    this.setState({
      ...this.state,
      show: true
    })
  }

  onUserClick = user => {
    if (this.props.user === undefined || this.props.user.id !== user.id) {
      this.props.downloadUser(user.id, user.rights)
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
      downloadUser
    } = this.props

    const list = dropdownContent.filter((_, index) => {
      if (selected >= 0) {
        return index === selected
      } else {
        return true
      }
    })

    const showFirst = separateFirst

    const showList = list.length > 0 && !(showFirst && list.length === 1)

    return (
      <div className={styles.searchField}>
        <Input
          onChange={onChange}
          value={searchQuery}
          label={placeholder}
          placeholder={placeholder}
          type="text"
          align="left"
          onFocus={this.show}
          onBlur={this.hide}
          ref={component => this.filter = component}
          highlight={highlight}
          style={inputStyles}
        />

        {this.state.show &&
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
