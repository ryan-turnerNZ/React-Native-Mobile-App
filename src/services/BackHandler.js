import {BackHandler} from 'react-native';

/***
 * This class allows for the back button to perform as the native andrriod back
 * button does. Instead of exiting app the a custom method can be used instead
 */
const handleBackButton = callback => {
  BackHandler.addEventListener('hardwareBackPress', () => {
    callback();
    return true;
  });
};

const removeBackButtonHandler = () => {
  BackHandler.removeEventListener('hardwareBackPress', () => {});
};

export {handleBackButton, removeBackButtonHandler};
