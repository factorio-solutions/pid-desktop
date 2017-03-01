<<<<<<< HEAD
export const GET_NOTIFICATIONS_DETAILS = "query ($past: Boolean!) {notifications(past: $past) { creator{full_name, email, phone}, id, created_at, expiration, message, custom_message, notification_type, updated_at, confirmed } }"

export const ACCEPT_NOTIFICATION = "mutation Mut ($notification: NotificationInput!, $id: Id!){update_notification(notification:$notification, id:$id){id}}"

export const DECLINE_NOTIFICATION = "mutation Mut ($notification: NotificationInput!, $id: Id!){update_notification(notification:$notification, id:$id){id}}"
=======
// get notification with all the details
export const GET_NOTIFICATIONS_DETAILS = `query ($past: Boolean!) {
  notifications(past: $past) {
    creator {
      full_name
      email
      phone
    }
    id
    created_at
    expiration
    message
    custom_message
    notification_type
    updated_at
    confirmed
  }
}
`

// accept notification
export const ACCEPT_NOTIFICATION = `mutation Mut($notification: NotificationInput!, $id: Id!) {
  update_notification(notification: $notification, id: $id) {
    id
  }
}
`

// decline notification
export const DECLINE_NOTIFICATION = `mutation Mut($notification: NotificationInput!, $id: Id!) {
  update_notification(notification: $notification, id: $id) {
    id
  }
}
`
>>>>>>> feature/new_api
