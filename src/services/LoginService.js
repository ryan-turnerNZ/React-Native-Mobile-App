import {AsyncStorage} from 'react-native';
import {db} from '../config/database.js';

export interface User{
  username: string,
  password: string
}

/***
 * This service allows for users to interact with the Firestore for purposes related to
 * the users account such as login/logout
 */
export default class loginService {

  /***
   * Gets the username of the logged in user from AsyncStorage
   */
  async getLoggedInUser(){
    return await AsyncStorage.getItem('loggedInUser');
  }

  /***
   * Deletes the user using the username stored in AsyncStorage
   * that would be the username of the currently logged in user
   */
  async deleteUser(){
    try {
      const user =  await AsyncStorage.getItem('loggedInUser');
      await AsyncStorage.removeItem('loggedInUser');
      db.collection('users').doc(user).delete();
    } catch (error) {
      console.log(error);
    }
  }

  /***
   * Sets the value of loggedInUser in the AsyncStorage
   *
   * @param user Value to insert into AsyncStorage as the loggedInUser
   */
  setLoggedInUser = async (user: User) => {
    try {
      return await AsyncStorage.setItem('loggedInUser', user.username);
    } catch (error) {
      console.log(error);
    }
  };

  /***
   * Removes the loggedInUser key from AsyncStorage
   * effectively logging the user out from the app
   */
  logoutUser = async () =>{
    try {
      await AsyncStorage.removeItem('loggedInUser');
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * This method attempts to log a user into the application.
   * It checks that a document with the users username as an ID
   * is present in the collection of users in the database
   *
   * @param user The user attempting to be logged in
   */
  async loginUser(user: User){
    let validLogin = false;
    const docRef = db.collection('users').doc(user.username);
    await docRef.get().then((doc) => {
      if (doc.exists && doc.data().password === user.password){
        this.setLoggedInUser(user);
        validLogin = true;
      } else {
        validLogin = false;
      }
    }).catch((error) => {
      throw error;
    });
    return validLogin;
  }

  /**
   * Attempts to change a users password to a new value.
   * Checks that the users document is present in the collection before updating the
   * password value in that document
   *
   * @param values Object containing the username, oldPassword, and newPassword of the user changing their details
   */
  async changePassword(values: {username: string, oldPassword: string, newPassword: string}){
    let validChange = false;
    const docRef = db.collection('users').doc(values.username);
    await docRef.get().then((doc) => {
      if (doc.exists && doc.data().password === values.oldPassword){
        docRef.update({username: values.username, password:values.newPassword});
        validChange = true;
      } else {
        validChange = false;
      }
    }).catch((error) => {
      throw error;
    });
    return validChange;
  }
}
