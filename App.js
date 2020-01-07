import {createSwitchNavigator, createAppContainer} from 'react-navigation';
import Login from './src/screens/Login';
import Register from './src/screens/Register';
import Home from './src/screens/Home';
import {AppRegistry, YellowBox} from 'react-native';
import AddPassword from './src/screens/AddPassword';
import ViewPassword from './src/screens/ViewPassword';
import SuggestPassword from './src/screens/SuggestPassword';
import PasswordDetails from './src/screens/PasswordDetails';
import Settings from './src/screens/Settings';
import ChangePassword from './src/screens/ChangePassword';


const MainNavigator = createSwitchNavigator({
  Login: {screen: Login},
  Register: {screen: Register},
  Home: {screen: Home},
  AddPassword: {screen: AddPassword},
  ViewPassword: {screen: ViewPassword},
  SuggestPassword: {screen: SuggestPassword},
  PasswordDetails: {screen: PasswordDetails},
  Settings: {screen: Settings},
  ChangePassword: {screen: ChangePassword},

},{
  initialRouteName: 'Login',
});

AppRegistry.registerComponent('MainNavigator', () => MainNavigator);
YellowBox.ignoreWarnings(['Setting a timer']);

export default createAppContainer(MainNavigator);

