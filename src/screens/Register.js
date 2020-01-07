import React, { Fragment } from 'react';
import {Alert, Image, StyleSheet, Text, TextInput, View} from 'react-native';
import {Formik} from 'formik';
import * as yup from 'yup';
import {Button} from 'react-native-elements';
import RegisterService from '../services/RegisterService';
import {handleBackButton, removeBackButtonHandler} from '../services/BackHandler';

/***
 * This file defines the Register Page and all its features/functions
 */
export default class Register extends React.Component {

  registerService: RegisterService;

  /***
   * Initializes the page and creates a RegisterService object for
   * use in the page
   */
  constructor(){
    super();
    this.registerService = new RegisterService();
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
    this.props.navigation.navigate('Login');
  };

  /***
   * This method creates the view of the page and defines its representation on the screen
   * @returns The representation of the page in React Components
   */
  render() {
    return (
      <View style={styles.container}>
        <Image source={require('../images/vault.png') } style={styles.vaultImage} />
        {//Form for registering a new account
        }
        <Formik
          initialValues={{ username: '', password: '' }}
          onSubmit={values => this.handleSubmit(values)}
          validationSchema={yup.object().shape({
            //Username validation requires minimum 3 letters and max 30, and must only contain letters and numbers
            username: yup
              .string()
              .min(3, 'Your username mut be at least 3 characters long')
              .max(30)
              .matches(/^[a-zA-Z0-9]+$/, 'Your username must contain only numbers and letters.')
              .required(),
            password: yup
            /**
             *  Password validation requires a min length of 5, max of 30. Regex requires at least
             *  1 uppercase, 1 lowercase, and 1 number
             */
              .string()
              .min(5, 'Your password mut be at least 5 characters long')
              .max(30, 'Your password may only be 30 characters long')
              .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$/,
                'Your password must contain at least one uppercase, one lowercase, and one number.')
              .required(),
          })}
        >
          {({ values, handleChange, errors, setFieldTouched, touched, isValid, handleSubmit }) => (
            //Styling for the form inputs
            <Fragment >
              <TextInput style={styles.form}
                         value={values.username}
                         onChangeText={handleChange('username')}
                         onBlur={() => setFieldTouched('username')}
                         placeholder="Username"
              />
              {touched.username && errors.username &&
              <Text style={styles.formError}>{errors.username}</Text>
              }
              <TextInput style={styles.form}
                         value={values.password}
                         onChangeText={handleChange('password')}
                         placeholder="Password"
                         onBlur={() => setFieldTouched('password')}
                         secureTextEntry={true}
              />
              {touched.password && errors.password &&
              <Text style={styles.formError}>{errors.password}</Text>
              }
              <Button
                title="Register Account"
                buttonStyle={styles.registerButton}
                disabled={!isValid}
                onPress={handleSubmit}
              />
              <Button
                title="Back"
                buttonStyle={styles.backButton}
                onPress={() => this.props.navigation.navigate('Login')}
              />
            </Fragment>
          )}
        </Formik>
      </View>
    );
  }

  /***
   * When the Form is submitted this methods calls the Register Service to
   * attempt to register the new user. On a fail the user is alerted to the
   * failure, on success the user is navigated to the login screen
   *
   * @param values An object containing the username and associated password to register
   */
  handleSubmit(values: {username: string, password: string}) {
    this.registerService.registerUser(values).then((pass) => {
      if (pass) {
        this.props.navigation.navigate('Login');
      } else {
        Alert.alert(
          'Registration Failed',
          'That username is unavailable'
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
    backgroundColor: '#f4f5f8',
  },
  registerButton: {
    backgroundColor: '#3880ff',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#0cd1e8',
    marginBottom: 20,
  },
  formError: {
    fontSize: 10,
    color: 'red',
  },
  vaultImage: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
    height: '40%',
    marginLeft: '5%',
    marginBottom: 30,
  },
});
