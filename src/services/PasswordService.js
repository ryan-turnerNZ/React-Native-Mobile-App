import {AsyncStorage} from 'react-native';
import {db} from '../config/database.js';

export interface Password{
  passwordName: string,
  password: string
}

/***
 * This service allows for users to interact with the Firestore for purposes related to
 * the users stored passwords such as adding/deleting them
 */
export default class PasswordService {

  /**
   * Attempts to add a new password document to the users collection of
   * documents. First checks that the document doesnt already exist.
   * Returns a Promise containing a boolean that represents the success
   * or failure of the attempted password save.
   *
   * @param password The password to be added
   */
  async addPassword(password: Password){
    let validAdd = false;
    const user = await AsyncStorage.getItem('loggedInUser');
    const docRef = db.collection('users').doc(user).collection('passwords').doc(password.passwordName);
    await docRef.get().then((doc) => {
      if (!doc.exists){
        db.collection('users').doc(user).collection('passwords').doc(password.passwordName).set(password);
        validAdd = true;
      } else {
        validAdd = false;
      }
    }).catch((error) => {
      throw error;
    });
    return validAdd;
  }

  /**
   * Attempts tp update a given passwords document with a new password field.
   * This method first ensures that the password document exists
   *
   * @param password The password to be updates. Contains the new password within its
   * password field
   */
  async updatePassword(password: Password){
    let validChange = false;
    const user = await  AsyncStorage.getItem('loggedInUser');
    const docRef = db.collection('users').doc(user).collection('passwords').doc(password.passwordName);
    await docRef.get().then((doc) => {
      if (doc.exists && doc.data().passwordName === password.passwordName){
        docRef.update(password);
        validChange = true;
      } else {
        validChange = false;
      }
    }).catch((error) => {
      throw error;
    });
    return validChange;
  }

  /**
   * Removes a password from the users collection of password documents
   *
   * @param password The password to be deleted
   */
  async deletePassword(password: Password) {
    const user = await  AsyncStorage.getItem('loggedInUser');
    await db.collection('users').doc(user).collection('passwords').doc(password.passwordName).delete();
  }

  /**
   * Retrieves all the passwords associated with the user
   * and returns them as a Promise that contains an array
   * of Passwords
   */
  async getPasswords(){
    const user = await AsyncStorage.getItem('loggedInUser');
    const list: Password[] = [];
    await db.collection('users').doc(user).collection('passwords').get().then((snapshot) => {
      snapshot.forEach((doc) => {
        list.push(doc.data());
      });
    });
    return list;
  }

  /**
   * Removes all passwords associated with a the logged in user.
   * This is used when deleting an account as sub-collections
   * are not automatically deleted.
   */
  async deleteAllPasswords(){
    const user = await AsyncStorage.getItem('loggedInUser');
    this.getPasswords().then((list) => {
      for (const password of list){
        db.collection('users').doc(user).collection('passwords').doc(password.passwordName).delete();
      }
    });
  }
}
