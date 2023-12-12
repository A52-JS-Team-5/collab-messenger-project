import { db } from "../config/firebase-config";
import { get, push, ref, update } from "firebase/database";

export const createNotification = (message, type, elemId = null) => {
  const notificationRef = ref(db, `notifications`);

  const notification = {
    message: message,
    type: type,
    elemId,
    timestamp: Date.now(),
  };

  return push(notificationRef, notification)
    .then((newNotificationRef) => {
      return newNotificationRef.key;
    })
    .catch((error) => {
      console.log(`Error in creating notification: ${error.message}`);
    });
};

export const deleteNotification = (userId, notificationId) => {
  const updates = {};
  updates[`/users/${userId}/notifications/${notificationId}`] = null;
  updates[`notifications/${notificationId}/readBy/${userId}`] = null;

  return update(ref(db), updates)
    .then(() => {
      console.log('Notification deleted successfully');
    })
    .catch((error) => {
      console.error(`Error deleting notification: ${error.message}`);
    });
};

export const pushNotifications = (handle, notificationId) => {
  const updates = {};
  updates[`/users/${handle}/notifications/${notificationId}`] = true;

  return update(ref(db), updates)
    .catch((e) => console.log('Error updating details of notification: ', e.message));
};

export const getNotificationById = (notificationId) => {
  return get(ref(db, `notifications/${notificationId}`))
    .then(result => {
      if (!result.exists()) {
        throw new Error(`Notification with id ${notificationId} does not exist!`);
      }

      const notification = result.val();

      return {
        id: notificationId,
        message: notification.message,
        type: notification.type,
        elemId: notification.elemId ? notification.elemId : null,
        timestamp: notification.timestamp,
        readBy: notification.readBy ? Object.keys(notification.readBy) : [],
      }
    })
    .catch(e => console.log('Error in getting notification by ID: ', e.message))
};

export const markNotificationAsRead = (handle, notificationId) => {
  const updates = {};
  updates[`notifications/${notificationId}/readBy/${handle}`] = true;

  return update(ref(db), updates)
    .catch((e) => console.log('Error in marking notification as read: ', e.message));
};

export const markNotificationAsUnread = (handle, notificationId) => {
  const updates = {};
  updates[`notifications/${notificationId}/readBy/${handle}`] = null;

  return update(ref(db), updates)
    .catch((e) => console.log('Error in marking notification as unread: ', e.message));
};