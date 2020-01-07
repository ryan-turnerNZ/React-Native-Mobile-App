import * as firebase from 'firebase';
import '@firebase/firestore';

/***
 * This file initializes the Firestore object to allow for access to the
 * database
 */
let app = firebase.initializeApp({
  apiKey: 'API Key Here',
  authDomain: 'swen325-project2-d8610.firebaseapp.com',
  databaseURL: 'https://swen325-project2-d8610.firebaseio.com',
  projectId: 'swen325-project2-d8610',
  storageBucket: '',
  messagingSenderId: '747498989539',
  appId: 'App Id Here',
});

export const db = app.firestore();

