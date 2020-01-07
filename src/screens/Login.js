import React, { Fragment } from 'react';
import {Alert, Image, StyleSheet, Text, TextInput, View} from 'react-native';
import {Formik} from 'formik';
import * as yup from 'yup';
import {Button} from 'react-native-elements';
import LoginService from '../services/LoginService';
import {removeBackButtonHandler} from '../services/BackHandler';

/***
 * This file defines the Login Page and all its features/functions
 */
export default class Login extends React.Component {

  loginService: LoginService;

  /***
   * Initializes the page and creates a LoginService object for
   * use in the page
   */
  constructor(){
    super();
    this.loginService = new LoginService();
  }

  /***
   * When the page mounts this method initialises the handling
   * of when the android back button is pressed
   */
  componentDidMount() {
    removeBackButtonHandler();
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
   * This method creates the view of the page and defines its representation on the screen
   * @returns The representation of the page in React Components
   */
  render() {
    return (
      <View style={styles.container}>
        <Image source={require('../images/vault.png') } style={styles.vaultImage} />
        {//Creates a Login Form using Formik
          }
        <Formik
          initialValues={{ username: '', password: '' }}
          onSubmit={values => this.handleSubmit(values)}
          validationSchema={yup.object().shape({
            // Validation schema only requires both fields, no min/max or regex
            username: yup
              .string()
              .required('This is required'),
            password: yup
              .string()
              .required(),
          })}
        >
          {({ values, handleChange, errors, setFieldTouched, touched, isValid, handleSubmit }) => (
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
                title="Sign In"
                buttonStyle={styles.loginButton}
                disabled={!isValid}
                onPress={handleSubmit}
              />
              <Button
                title="Register"
                buttonStyle={styles.registerButton}
                onPress={() => this.props.navigation.navigate('Register')}
              />
            </Fragment>
          )}
        </Formik>
      </View>
    );
  }

  /***
   * When the Form is submitted the LoginService attempts to log the user is with
   * the provided values. On success the user is naigated to the Home screen.
   * On failure the user is alerted to the failure.
   *
   * @param values Object containing the username and password for login
   */
  handleSubmit(values: {username: string, password: string}) {
    this.loginService.loginUser(values).then((pass) => {
      if (pass) {
        this.props.navigation.navigate('Home');
      } else {
        Alert.alert(
          'Login Failed',
          'Incorrect username or password'
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
  loginButton: {
    backgroundColor: '#3880ff',
    marginBottom: 20,
  },
  registerButton: {
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
