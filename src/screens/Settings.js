import React from 'react';
import {View, StyleSheet, Alert, Image} from 'react-native';
import {handleBackButton, removeBackButtonHandler} from '../services/BackHandler';
import {Button} from 'react-native-elements';
import LoginService from '../services/LoginService';
import PasswordService from '../services/PasswordService';

/***
 * This file defined the Settings page and its features
 */
export default class Settings extends React.Component{

  loginService: LoginService;
  passwordService: PasswordService;
  user: string;

  /***
   * Initializes a LoginService, and PasswordService for the page to use.
   * Then calls a method to get the user who is currently logged in
   */
  constructor() {
    super();
    this.loginService = new LoginService();
    this.passwordService = new PasswordService();
    this.getUser();
  }

  /***
   * This method get the user who is logged in, from the LoginService,
   * this is later passed as a navigation parameter to the Change Password
   * page
   */
  getUser(){
    this.loginService.getLoggedInUser().then((user) => {
      this.user = user;
    });
  }


  /***
   * When the page mounts this method initialises the handling
   * of when the android back button is pressed
   */
  componentDidMount() {
    handleBackButton(this.navigateBack);
  }

  /***
   * When the page is going to be left this method removes the handler for
   * the android backl button as to ensure multiple handlers aren't
   * instantiated
   */
  componentWillUnmount() {
    removeBackButtonHandler();
  }

  /***
   * This method tells the application what to do when the back button is pressed
   */
  navigateBack = () => {
    this.props.navigation.navigate('Home');
  };

  /***
   * This method creates the view of the page and defines its representation on the screen
   * @returns The representation of the page in React Components
   */
  render() {
    return (
      <View style={styles.container}>{
        // Very basic settings page with just several options buttons and an image
      }
        <Image source={require('../images/settings.png') } style={styles.settingsImage} />
        <Button
          title="Change Password"
          buttonStyle={styles.blueButton}
          onPress={() => this.props.navigation.navigate('ChangePassword', {user: this.user})}
        />
        <Button
          title="Logout"
          buttonStyle={styles.blueButton}
          onPress={this.onLogout}
        />
        <Button
          title="Delete Account"
          buttonStyle={styles.redButton}
          onPress={this.onDeleteAccount}
        />
      </View>

    );
  }

  /***
   * This function is used when the user clicks the logout button, and asks for confirmation
   */
  onLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you wish to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: this.confirmedLogout,
        },
      ],
      {cancelable: true},
    );
  };

  /***
   * When the user confirms their logout they are logged out using the LoginService, and
   * then navigated back to the Login screen
   */
  confirmedLogout = () => {
    this.loginService.logoutUser().then(() => {
      this.props.navigation.navigate('Login');
    });
  };

  /***
   * This function is used when the user clicks the Delete Account button, and asks for confirmation
   */
  onDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you wish to delete your account? You will lose all your stored passwords',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: this.confirmedDelete,
        },
      ],
      {cancelable: true},
    );
  };

  /***
   * When the user confirms their account deletion their account is delete
   * using the LoginService, and then they are navigated back to the Login screen
   */
  confirmedDelete = () => {
    this.passwordService.deleteAllPasswords().then(() => {
      this.loginService.deleteUser().then(() => {
        this.props.navigation.navigate('Login');
      });
    });
  };

}

/***
 * This is the styles sheet for this page
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: '4%',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: '#f4f5f8',
    display: 'flex',
  },
  blueButton: {
    backgroundColor: '#3880ff',
    marginBottom: 20,
  },
  redButton: {
    backgroundColor: '#f04141',
    marginBottom: 20,
  },
  settingsImage: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
    marginLeft:'25%',
    marginBottom:20,
  },
});

