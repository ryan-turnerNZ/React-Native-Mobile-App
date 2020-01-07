import React from 'react';
import {Alert, Image, StyleSheet, View} from 'react-native';
import {ListItem} from 'react-native-elements';
import {handleBackButton, removeBackButtonHandler} from '../services/BackHandler';
import LoginService from '../services/LoginService';

//List of pageNames and their descriptors to be used for navigating and populating the screen with nav buttons
let pages:  Array<{pageName: string, descriptor: string}> = [{pageName: 'AddPassword', descriptor: 'Add a Password'},
  {pageName: 'ViewPassword', descriptor: 'View Passwords'},
  {pageName: 'SuggestPassword', descriptor: 'Suggest a Password'},
  {pageName: 'Settings', descriptor: 'Settings'}];

export default class Home extends React.Component{

  loginService: LoginService;
  /***
   * Constructor initializes the page and creates an instance
   * of the LoginService for use in the page
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
   * This method tells the application what to do when the back button is pressed.
   * Creates an alert asking the user to confirm if they wish to
   * logout of the app
   */
  navigateBack = () => {
    Alert.alert(
      'Logout',
      'Are you sure you wish to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: this.confirmedLogout,
        },
      ],
      {cancelable: true},
    );
  };

  /***
   * When the user confirms their logout they are logged out
   * using the LoginService then navigated back to the Login
   * screen
   */
  confirmedLogout = () => {
    this.loginService.logoutUser().then(() => {
      this.props.navigation.navigate('Login');
    });
  };


  /***
   * Visual representation of the page rendered using React Components
   *
   * @returns {*} The visual representation for the screen
   */
  render() {
    return (
      <View style={styles.container}>
        <Image source={require('../images/vault.png') } style={styles.vaultImage} />
        {
          //Uses the map of page names and descriptors the pages array to create nav buttons
          pages.map((l, i) => (
            <ListItem
              key={i}
              title={l.descriptor}
              // On press the user is naviagted to the page button they clicked
              onPress={() => this.handleNavigation(l.pageName)}
              rightIcon = {{
                name: 'chevron-right',
              }}
              bottomDivider
            />
          ))
        }

      </View>

    );
  }

  /***
   * Navigates the user to the specified page name
   *
   * @param pageName the page name to be navigated to
   */
  handleNavigation(pageName: string) {
    this.props.navigation.navigate(pageName);
  }
}

/***
 * Styles sheet containing the styles for the page
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
  vaultImage: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
    height: '40%',
    marginLeft: '5%',
    marginBottom: 30,
  },
});
