import * as firebase from 'firebase';
import '@firebase/firestore';

/***
 * This file initializes the Firestore object to allow for access to the
 * database
 */
let app = firebase.initializeApp({
  apiKey: 'AIzaSyB2urydpw_spNJ_B8C4iKuKS581yCpNxC4',
  authDomain: 'swen325-project2-d8610.firebaseapp.com',
  databaseURL: 'https://swen325-project2-d8610.firebaseio.com',
  projectId: 'swen325-project2-d8610',
  storageBucket: '',
  messagingSenderId: '747498989539',
  appId: '1:747498989539:web:6c32b78965b41f441a62d6',
});

export const db = app.firestore();

