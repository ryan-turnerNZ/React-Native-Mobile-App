import {db} from '../config/database.js';

export interface User{
  username: string,
  password: string
}

/***
 * This service allows for users to interact with the Firestore for purposes related to
 * the registering
 */
export default class RegisterService {

  constructor() {

  }


  /***
   * Attempts to register a user. Checks to ensure the username is not
   * already taken
   *
   * @param user User to atempt to register
   */
  async registerUser(user: User){
    let goodRegistration = true;
    const docRef = db.collection('users'). doc(user.username);
    await docRef.get().then((doc) => {
      if (doc.exists) {
        goodRegistration = false;
      } else {
        goodRegistration = true;
        db.collection('users').doc(user.username).set(user);
      }
    }).catch((error) => {
      throw error;
    });
    return goodRegistration;
  }
}
