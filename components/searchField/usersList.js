import React, { PropTypes } from 'react'

import UserListItem from './userListItem'

const UsersList = ({ users, className, ...props }) => {
  return (
    <ul className={className}>
      {
        users.map((user, index) => (
          <UserListItem
            key={user.id}
            user={user}
            index={index}
            {...props}
          />
        ))
      }
    </ul>
  )
}

UsersList.propTypes = {
  users:     PropTypes.array.isRequired,
  className: PropTypes.string,
  onClick:   PropTypes.func
}

export default UsersList
