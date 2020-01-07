import React, {Fragment} from 'react';
import {View, Text, TextInput, StyleSheet, Image, Alert} from 'react-native';
import * as yup from 'yup';
import {Button} from 'react-native-elements';
import {Formik} from 'formik';
import PasswordService from '../services/PasswordService';
import type {Password} from '../services/PasswordService';
import {handleBackButton, removeBackButtonHandler} from '../services/BackHandler';

/***
 * Thisfile defines the AddPassword page and its features/functions
 */
export default class AddPassword extends React.Component{

  passwordService: PasswordService;

  /***
   * Constructor initializes the page and creates an instance
   * of the PasswordService for use in the page
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
  }

  /***
   * When the page is going to be left this method removes the handler for
   * the android back button as to ensure multiple handlers aren't
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
          Add a Password
        </Text>{
        // Form for adding a new password
      }
        <Formik
          initialValues={{ passwordName: '', password: '' }}
          onSubmit={values => this.handleSubmit(values)}
          validationSchema={yup.object().shape({
            // validation schema only requires that form values are filled
            passwordName: yup
              .string()
              .required(),
            password: yup
              .string()
              .required(),
          })}
        >
          {({ values, handleChange, errors, setFieldTouched, touched, isValid, handleSubmit }) => (
            <Fragment >{
              //This is the styling for the form inputs
            }
              <TextInput style={styles.form}
                         value={values.passwordName}
                         onChangeText={handleChange('passwordName')}
                         onBlur={() => setFieldTouched('passwordName')}
                         placeholder="Password Name"
              />
              {touched.passwordName && errors.passwordName &&
              <Text style={styles.formError}>{errors.passwordName}</Text>
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
                title="Add Password"
                buttonStyle={styles.loginButton}
                disabled={!isValid}
                onPress={handleSubmit}
              />
            </Fragment>
          )}
        </Formik>
      </View>

    );
  }

  /***
   * When the Form is submitted this method is called. Uses the
   * PasswordService to attempt to add the password to the users
   * collection. On success they are navigated to the Home scree,
   * on failure an alert pop-ups
   *
   * @param values passwordName and password for the new password
   */
  handleSubmit(values: Password){
    this.passwordService.addPassword(values).then((pass) => {
      if (pass) {
        this.props.navigation.navigate('Home');
      } else {
        Alert.alert('Invalid Password Name',
          'That password name is invalid as it is already in use',
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
