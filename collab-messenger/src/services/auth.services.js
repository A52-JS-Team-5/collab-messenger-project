import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth } from '../config/firebase-config';

/**
 * Registers a new user using the provided email and password.
 *
 * @param {string} email
 * @param {string} password
 * @returns {Promise} A promise that resolves with user credentials after successful registration.
 */
export const registerUser = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

/**
 * Logs in a user using the provided email and password.
 *
 * @param {string} email
 * @param {string} password
 * @returns {Promise} A promise that resolves with user credentials after successful login.
 */
export const loginUser = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

/**
 * Logs out the currently logged in user.
 *
 * @returns {Promise<void>} A promise that resolves when the user is successfully logged out
 */
export const logoutUser = () => {
  return signOut(auth);
};
