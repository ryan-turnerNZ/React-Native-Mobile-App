import React from 'react';
import {View, Text, ActivityIndicator, StyleSheet, Alert} from 'react-native';
import PasswordService from '../services/PasswordService';
import {Icon, ListItem} from 'react-native-elements';
import {handleBackButton, removeBackButtonHandler} from '../services/BackHandler';
import type {Password} from '../services/PasswordService';

/***
 * This file defines the ViewPassword screen and its functions/features
 */
export default class ViewPassword extends React.Component{

  passwordService: PasswordService;

  //Array for containing all the users passwords
  passwords: Array<{passwordName: string, password: string}> = [];

  /***
   * Initializes the page, creates an instance of PasswordService, and calls
   * for the password list to be populated
   */
  constructor(){
    super();
    //Sets the state value for loading to true
    this.state = {
      isLoading: true,
    };
    this.passwordService = new PasswordService();
    this.populateList();
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
   * This method uses the PasswordService to retrieve
   * the users passwords and populate the array with them
   */
  populateList() {
    this.passwordService.getPasswords().then((result) => {
      this.passwords = result;
      //After loading is finished the state value for loading is set to false so the page updates
      this.setState({
        isLoading: false,
      });
    });
  }

  /***
   * This method creates the view of the page and defines its representation on the screen
   * @returns The representation of the page in React Components
   */
  render() {
    //When the passwords are still being loaded a spinning indicator appears on screen
    if (this.state.isLoading){
      return (
        <View style={styles.activity}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }
    /***
     * If the user has no passwords a page is loaded
     * with an icon link to the AddPassword screen, and
     * some text informs them of their lack of passwords
     */
    else if (this.passwords.length === 0){
      return (
        <View style={styles.container}>
          <Text style={styles.emptyText}>
            You Have No Passwords
          </Text>
          <Text style={styles.emptySubText}>
            You can add one by entering in the details in the Add a Password screen
          </Text>
          <Icon
            name={'add-circle-outline'}
            onPress={() => this.props.navigation.navigate('AddPassword')}
            color={'#3880ff'}
            size={50}
            raised={true}
            containerStyle={styles.addButton}
          />
        </View>
      );
    }
    //If the user has passwords the list of them is shown
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          Your Passwords
        </Text>
        <Text style={styles.subTitle}>
          Press to edit password, Hold to view password
        </Text>
        {
          this.passwords.map((l, i) => (
            <ListItem
              key={i}
              title={l.passwordName}
              rightIcon = {{
                name: 'chevron-right',
              }}
              onPress={() => this.navigatePassword(l)}
              onLongPress={() => this.showPassword(l)}
              bottomDivider
            />
          ))
        }
      </View>

    );
  }

  /***
   * Called when the user longPresses a password. This method shows the details
   * about the password
   *
   * @param password Password to show details about
   */
  showPassword(password: Password){
    Alert.alert(
      'Password Details',
      'Password Name: ' + password.passwordName + '\nPassword: ' + password.password,
      [
        {
          text: 'Close',
        },
      ]

    );
  }

  /**
   * When a password is clicked the user is navigated to a page containing
   * details about the password
   *
   * @param password Password to show the details of in the navigated page
   */
  navigatePassword(password: Password) {
    this.props.navigation.navigate('PasswordDetails', {password: password});
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
  activity: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    justifyContent: 'flex-start',
    backgroundColor:  '#f4f5f8',
    fontSize: 32,
  },
  emptySubText: {
    fontSize: 16,
    color: '#999999',
    justifyContent: 'flex-start',
    textDecorationLine: 'underline',
    textDecorationColor: '#adadad',
    backgroundColor:  '#f4f5f8',
    marginBottom: 15,
  },
  addButton: {
    left: 0,
    right: 0,
    top: '25%',
    bottom: 0,
    position: 'absolute',
    alignItems: 'center',
    backgroundColor:  '#f4f5f8',
  },
  title: {
    fontSize: 32,
    justifyContent: 'flex-start',
    backgroundColor:  '#f4f5f8',

  },
  subTitle: {
    fontSize: 16,
    color: '#999999',
    justifyContent: 'flex-start',
    textDecorationLine: 'underline',
    textDecorationColor: '#adadad',
    backgroundColor:  '#f4f5f8',
    marginBottom: 15,
  },
});
