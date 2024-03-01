/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

 import React, {Fragment, PureComponent} from 'react';
 import {
   Dimensions,
   View,
   Image,
   Animated,
   SafeAreaView,
   StyleSheet,
   BackHandler,
   FlatList,
   Modal,
 } from 'react-native';
 import {State, PinchGestureHandler} from 'react-native-gesture-handler';
 import LocationComponent from '../../../components/LocationComponent/LocationComponent';
 import {connect, Dispatch} from 'react-redux';
 import moment from 'moment';
 import {Colors, Fonts} from '../../../../assets/global';
 import {Images} from '../../../../assets/images';
 import {withTranslation} from 'react-i18next';
 import NavigationService from '../../../utils/NavigationService';
 import {Constants} from '../../../styles';
 import {AppText} from '../../../components/Texts';
 import {widthPercentageToDP, heightPercentageToDP} from '../../../utils';
 
 class LocationScreen extends PureComponent {
   constructor(props) {
     super(props);
   }
 
   componentWillMount() {
     BackHandler.addEventListener(
       'hardwareBackPress',
       this.handleBackButtonClick,
     );
   }
 
   componentWillUnmount() {
     BackHandler.removeEventListener(
       'hardwareBackPress',
       this.handleBackButtonClick,
     );
   }
 
   handleBackButtonClick() {
     NavigationService.goBack();
     return true;
   }
 
   render() {
     const {t } = this.props;
     return (
       <SafeAreaView style={styles.container}>
           <View>
            <LocationComponent page={"LOCATION"} shouldAskPermission={true}/>
           </View>
 
       </SafeAreaView>
     );
   }
 }
 
 const styles = StyleSheet.create({
   container: {
     flex: 1,
     backgroundColor: '#f5f5f5',
   },
 });
 
 export default withTranslation()(LocationScreen);
 