import React, { PropTypes } from 'react'

import styles from './SearchField.scss'

const highlightSearchQueryInText = (text, searchQuery) => {
  const lowercaseTrimmedText = text.toString().replace(/\s\s+/g, ' ').trim().toLowerCase()

  return lowercaseTrimmedText
    .split(searchQuery.toLowerCase() || undefined) // split by filter
    .reduce((acc, item, index, arr) => [ ...acc, item, index <= arr.length - 2 && searchQuery.length && searchQuery ], [])
    .filter(o => o !== false)
    .reduce((acc, item, index) => [ ...acc, (acc[index - 1] || 0) + item.length ], [])
    .map((length, index, arr) => String(text).substring(arr[index - 1] || 0, length))
    .map((part, index) => (index % 2 === 0 ? <span>{part}</span> : <b>{part}</b>))
}

// Component
const UserListItem = ({ user, searchQuery, onClick, index, selectedIndex }) => {
  const { full_name, email, phone } = user

  return (
    <li
      className={`${index === selectedIndex && styles.selected}`}
      onMouseDown={() => onClick(user)}
    >
      <div>
        <label className={styles.contactLabel}>
          {highlightSearchQueryInText(
            full_name,
            searchQuery
          )
          }
        </label>
        <div className={styles.contactInfo}>
          {email &&
            <div className={styles.contactInfoColumn}>
              @ {highlightSearchQueryInText(email, searchQuery)}
            </div>
          }
          {phone &&
            <div className={styles.contactInfoColumn}>
              <i className="fa fa-mobile" aria-hidden="true" /> {highlightSearchQueryInText(
                                                                  phone,
                                                                  searchQuery
                                                                )}
            </div>
          }
        </div>
      </div>
    </li>
  )
}

UserListItem.propTypes = {
  user:          PropTypes.object,
  searchQuery:   PropTypes.string,
  onClick:       PropTypes.func,
  index:         PropTypes.number,
  selectedIndex: PropTypes.number
}

export default UserListItem
