export const GET_NOTIFICATIONS_DETAILS = "query ($past: Boolean!) {notifications(past: $past) { creator{full_name, email, phone}, id, created_at, expiration, message, custom_message, notification_type, updated_at, confirmed } }"

export const ACCEPT_NOTIFICATION = "mutation Mut ($notification: NotificationInput!, $id: Id!){update_notification(notification:$notification, id:$id){id}}"

export const DECLINE_NOTIFICATION = "mutation Mut ($notification: NotificationInput!, $id: Id!){update_notification(notification:$notification, id:$id){id}}"
