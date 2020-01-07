import React, {Fragment} from 'react';
import {View, Text, TextInput, Alert, StyleSheet} from 'react-native';
import PasswordService from '../services/PasswordService';
import type {Password} from '../services/PasswordService';
import {handleBackButton, removeBackButtonHandler} from '../services/BackHandler';
import {Formik} from 'formik';
import * as yup from 'yup';
import {Button} from 'react-native-elements';

/***
 * This file defines the Password Details page and its features/functions
 */
export default class PasswordDetails extends React.Component{

  passwordService: PasswordService;
  password: Password;
  //State is used to keep track of whether the password is hidden/revealed
  state = {
    passwordHidden: true,
  };

  /***
   * Initializes the page and creates an instance of a LoginService
   * and a PasswordService for use in the page
   */
  constructor(props) {
    super(props);
    this.passwordService = new PasswordService();
    this.password = this.props.navigation.getParam('password');
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
    this.props.navigation.navigate('ViewPassword');
  };

  /***
   * This method creates the view of the page and defines its representation on the screen
   * @returns The representation of the page in React Components
   */
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          Password Details
        </Text>
        <Formik
          //This form allowed for a user to edit the password value of the password they are currently viewing
          initialValues={{ passwordName: this.password.passwordName, password: this.password.password }}
          onSubmit={values => this.handleSubmit(values)}
          validationSchema={yup.object().shape({
            passwordName: yup
              .string()
              .required(),
            password: yup
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
                         editable={false}

              />
              {touched.passwordName && errors.passwordName &&
              <Text style={styles.formError}>{errors.passwordName}</Text>
              }
              <TextInput style={styles.form}
                         value={values.password}
                         onChangeText={handleChange('password')}
                         placeholder="Password"
                         onBlur={() => setFieldTouched('password')}
                         secureTextEntry={this.state.passwordHidden}
              />
              {touched.password && errors.password &&
              <Text style={styles.formError}>{errors.password}</Text>
              }
              <Button
                title="Update Password"
                buttonStyle={styles.updateButton}
                disabled={!isValid}
                onPress={handleSubmit}
              />
              <Button
                title="Toggle Password Visibility"
                buttonStyle={styles.toggleButton}
                onPress={this.togglePasswordVisibility}
              />
              <Button
                title="Delete"
                buttonStyle={styles.deleteButton}
                onPress={this.handleDelete}
              />
            </Fragment>
          )}
        </Formik>
      </View>

    );
  }

  /***
   * This methods toggles the visibility of the password field of the form
   * so a user can edit the password with more ease. Changes the state whenever pressed
   */
  togglePasswordVisibility = () => {
    this.setState(previousState => (
      { passwordHidden: !previousState.passwordHidden }
    ));
  };

  /***
   * Called when the delete button is pressed, asks the user to
   * confirm deletion of their password.
   */
  handleDelete = () => {
    Alert.alert('Delete Password',
      'Are you sure you wish to delete your password?',
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
   * When a user confirms password deletion the PasswordSerVice is used to
   * delete the password then the user is navigated back to their list of
   * passwords
   */
  confirmedDelete = () => {
    this.passwordService.deletePassword(this.password).then(() => {
      this.navigateBack();
    });
  };

  handleSubmit(values: Password){
    this.passwordService.updatePassword(values).then((pass) => {
      if (pass) {
        this.props.navigation.navigate('ViewPasswords');
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
    height:'40%',
    marginLeft: '10%',
  },
  updateButton: {
    backgroundColor: '#3880ff',
    marginBottom: 20,
  },
  toggleButton: {
    backgroundColor: '#0cd1e8',
    marginBottom: 20,
  },
  deleteButton: {
    backgroundColor: '#f04141',
    marginBottom: 20,
  },
});
