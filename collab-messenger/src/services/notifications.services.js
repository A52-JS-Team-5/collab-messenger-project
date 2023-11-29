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
            console.log(`Error creating message: ${error.message}`);
        });
};

export const deleteNotification = (userId, notificationId) => {
    const updates = {};
    updates[`/users/${userId}/notifications/${notificationId}`] = null;

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
        .catch((e) => console.log('Error updating details', e.message));
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
            }
        })
        .catch(e => console.log(e.message))
}