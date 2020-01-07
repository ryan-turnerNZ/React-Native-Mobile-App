import React, {Fragment} from 'react';
import {View, Text, TextInput, StyleSheet, Image, Alert} from 'react-native';
import * as yup from 'yup';
import {Button} from 'react-native-elements';
import {Formik} from 'formik';
import PasswordService from '../services/PasswordService';
import type {Password} from '../services/PasswordService';
import {handleBackButton, removeBackButtonHandler} from '../services/BackHandler';

/***
 * This file defined the Suggest a Password page and its features
 */
export default class SuggestPassword extends React.Component{

  passwordService: PasswordService;

  // This state is defined here so the app can detect when the suggested password changes
  state = {
    suggestedPassword: '',
  };

  /***
   * Initializes a PasswordService for the page to use.
   */
  constructor(){
    super();
    this.passwordService = new PasswordService();
  }

  /***
   * When the page mounts this method initialises the handling
   * of when the android back button is pressed
   */
  componentDidMount() {
    handleBackButton(this.navigateBack);
    this.onSuggestPassword();
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
      <View style={styles.container}>
        <Image source={require('../images/vault.png') } style={styles.vaultImage} />
        <Text style={styles.title}>
          Get Suggested Password
        </Text>
        <Formik
          initialValues={{ passwordName: '', password: '' }}
          onSubmit={values => this.handleSubmit(values)}
          validationSchema={yup.object().shape({
            // Only required field is the password name as password is un-editable
            passwordName: yup
              .string()
              .required(),
          })}
        >
          {({ values, handleChange, errors, setFieldTouched, touched, isValid, handleSubmit }) => (
            //Styling for the Form inputs
            <Fragment >
              <TextInput style={styles.form}
                         value={values.passwordName}
                         onChangeText={handleChange('passwordName')}
                         onBlur={() => setFieldTouched('passwordName')}
                         placeholder="Password Name"
              />
              {touched.passwordName && errors.passwordName &&
              <Text style={styles.formError}>{errors.passwordName}</Text>
              }{
              // Suggested password in un-editable to avoid issues with its value not being picked up
            }
              <TextInput style={styles.form}
                         value={this.state.suggestedPassword}
                         onChangeText={() => {
                           handleChange('password');
                         }}
                         placeholder="Suggested Password"
                         onBlur={() => setFieldTouched('password')}
                         editable={false}
              />
              {touched.password && errors.password &&
              <Text style={styles.formError}>{errors.password}</Text>
              }{
              // Buttons for adding/suggesting passwords
            }
              <Button
                title="Add Password"
                buttonStyle={styles.loginButton}
                disabled={!isValid}
                onPress={handleSubmit}
              />
              <Button
                title="Suggest a Password"
                buttonStyle={styles.suggestButton}
                onPress={this.onSuggestPassword}
              />
            </Fragment>
          )}
        </Formik>
      </View>

    );
  }

  /***
   * This method creates a random string  containing letters and number that is then used to set the state
   * variable 'suggestedPassword'
   */
  onSuggestPassword = () => {
    const suggestedPass = Math.random().toString(36).substring(2, 8) + Math.random().toString(36).substring(2, 8);
    this.setState({
      suggestedPassword: suggestedPass,
    });
  };

  /***
   * When the Form is submitted this methods calls the PasswordService to attempt to add it. On a successful
   * password add the user is navigated to the Home screen, otherwise they are alerted to the failure
   *
   * @param values
   */
  handleSubmit(values: Password){
    this.passwordService.addPassword({passwordName: values.passwordName, password:this.state.suggestedPassword}).then((pass) => {
      if (pass) {
        this.props.navigation.navigate('Home');
      } else {
        Alert.alert('Invalid Password Name',
          'That password name is invalid or it is already in use',
          [
            {
              text: 'Close',
            },
          ]
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
  title: {
    fontSize: 32,
    justifyContent: 'flex-start',
    textDecorationLine: 'underline',
    textDecorationColor: 'grey',
    backgroundColor:  '#f4f5f8',
  },
  form: {
    fontSize: 28,
    justifyContent: 'center',
    backgroundColor:  '#f4f5f8',
    color: 'black',
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
  loginButton: {
    backgroundColor: '#3880ff',
    marginBottom: 20,
  },
  suggestButton: {
    backgroundColor: '#0cd1e8',
    marginBottom: 20,
  },
});

