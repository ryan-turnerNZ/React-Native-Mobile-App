import React, {Fragment} from 'react';
import {Alert, StyleSheet, Text, TextInput, View} from 'react-native';
import {handleBackButton, removeBackButtonHandler} from '../services/BackHandler';
import LoginService from '../services/LoginService';
import * as yup from 'yup';
import {Button} from 'react-native-elements';
import {Formik} from 'formik';

/***
 * This file defined the Change Password page and its features
 */
export default class ChangePassword extends React.Component{

  loginService: LoginService;
  username: string;

  /***
   * Initializes a LoginService for the page to use,
   * and retrieves the name of the user from the navigation parameters
   */
  constructor(props) {
    super(props);
    this.loginService = new LoginService();
    this.username = this.props.navigation.getParam('user');
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
    this.props.navigation.navigate('Settings');
  };

  /***
   * This method creates the view of the page and defines its representation on the screen
   * @returns The representation of the page in React Components
   */
  render() {
    return (
      <View style={styles.container}>
        {
          // Creates a Formik Form to allow a user to change their password
        }
        <Formik
          initialValues={{ username: this.username, oldPassword: '', newPassword: '' }}
          onSubmit={values => this.handleSubmit(values)}
          validationSchema={yup.object().shape({
            // Sets the validation for the form inputs
            username: yup
              .string()
              .required(),
            oldPassword: yup
              .string()
              .required(),
            newPassword: yup
              .string()
              .min(5, 'Your password mut be at least 5 characters long')
              .max(30, 'Your password may only be 30 characters long')
              .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$/,
                'Your password must contain at least one uppercase, one lowercase, and one number.')
              .required(),
          })}
        >
          {({ values, handleChange, errors, setFieldTouched, touched, isValid, handleSubmit }) => (
            // This Fragment contains the visual aspects of the input form and what to do on input interaction
            <Fragment >
              <TextInput style={styles.form}
                         value={values.username}
                         onChangeText={handleChange('username')}
                         onBlur={() => setFieldTouched('username')}
                         placeholder="Username"
                         editable={false}
              />
              {touched.username && errors.username &&
              <Text style={styles.formError}>{errors.username}</Text>
              }
              <TextInput style={styles.form}
                         value={values.oldPassword}
                         onChangeText={handleChange('oldPassword')}
                         placeholder="Old Password"
                         onBlur={() => setFieldTouched('oldPassword')}
                         secureTextEntry={true}
              />
              {touched.oldPassword && errors.oldPassword &&
              <Text style={styles.formError}>{errors.oldPassword}</Text>
              }
              <TextInput style={styles.form}
                         value={values.newPassword}
                         onChangeText={handleChange('newPassword')}
                         placeholder="New Password"
                         onBlur={() => setFieldTouched('newPassword')}
                         secureTextEntry={true}
              />
              {touched.newPassword && errors.newPassword &&
              <Text style={styles.formError}>{errors.newPassword}</Text>
              }{
              // Buttons for navigation and form submission
            }
              <Button
                title="Change Password"
                buttonStyle={styles.confirmButton}
                disabled={!isValid}
                onPress={handleSubmit}
              />
              <Button
                title="Back"
                buttonStyle={styles.backButton}
                onPress={() => this.props.navigation.navigate('Settings')}
              />
            </Fragment>
          )}
        </Formik>
      </View>
    );
  }

  /***
   * This method is called when the form is submitted and asks
   * the user to confirm their decision to change their password
   *
   * @param values An object containing the user's username, their old password, and their new password
   */
  handleSubmit(values: {username: string, oldPassword: string, newPassword: string}){
    Alert.alert('Change Password',
      'Are you sure you wish to change your password?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: () => this.confirmedSubmit(values),
        },
      ],
      {cancelable: true},
    );
  }

  /***
   * Called when the user confirms their password change. This method calls
   * for the password service to change the password. On a fail the user is
   * informed, on a success the user is directed back to the settings page
   *
   * @param values An object containing the user's username, their old password, and their new password
   */
  confirmedSubmit(values: {username: string, oldPassword: string, newPassword: string}) {
    this.loginService.changePassword(values).then((pass) => {
      if (pass) {
        this.props.navigation.navigate('Settings');
      } else {
        Alert.alert(
          'Password Change Failed',
          'You Have failed to change your password. Please enter the correct old password'
        );
      }
    });
  }
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
  form: {
    fontSize: 28,
    justifyContent: 'center',
    backgroundColor:  '#f4f5f8',
  },
  formError: {
    fontSize: 10,
    color: 'red',
  },
  vaultImage: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
    height:'40%',
    marginLeft: '10%',
  },
  confirmButton: {
    backgroundColor: '#3880ff',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#0cd1e8',
    marginBottom: 20,
  },
});
