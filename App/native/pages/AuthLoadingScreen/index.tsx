import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View,
  Text
} from 'react-native';
import NavigationService from '../../../utils/NavigationService';

class AuthLoadingScreen extends React.Component {
  componentDidMount() {
    //this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem('accessToken');

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    if(!userToken)
      NavigationService.navigate('Login'); 
    //this.props.navigation.navigate(userToken ? 'App' : 'Auth');
  };

  // Render any loading content that you like here
  render() {
    return (
      <View>
        <ActivityIndicator />
        <Text>Loading screen ...</Text>
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

export default AuthLoadingScreen;