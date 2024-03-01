import * as React from 'react';
import { PureComponent } from 'react';
import {BackHandler, TouchableOpacity, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import idx from 'idx';
import {withTranslation} from 'react-i18next';
import CLBusiness from '../CLBusiness';
import ShippingList from '../ShippingList/ShippingList.js'
import {changeField} from '../Login/actions';
import {liveAnalytics} from '../ShopgLive/redux/actions';
import NavigationService from '../../../utils/NavigationService';
import { AppText } from '../../../components/Texts';
import {LogFBEvent, Events} from '../../../Events';
import { scaledSize, heightPercentageToDP, widthPercentageToDP } from '../../../utils';
import { Constants } from '../../../styles';

class MyOrderCheckoutBase extends PureComponent {
    
    componentWillMount = () => {
        BackHandler.addEventListener(
            'hardwareBackPress',
            this.handleBackButtonClick,
          );  
    }

    componentDidMount = () => {
        if(!this.props.isLoggedIn) {
            this.props.onChangeField('loginInitiatedFrom', 'MyOrderBusinessCheckout');
            NavigationService.navigate('Login');
        }  
        const {fireAppLaunchEvent, launchEventDetails, login} = this.props;

        if(fireAppLaunchEvent) {
            const userId = this.props.login.userPreferences.uid;
            const sid = this.props.login.userPreferences.sid;
            let eventData = { source:launchEventDetails.source, medium: launchEventDetails.medium, referrerUserId: launchEventDetails.userId, refereeUserId: userId, isNewUser: !this.props.login.userRegistered };
            if(launchEventDetails && launchEventDetails.taskId){
                eventData['taskId'] = launchEventDetails.taskId;
            }
            let userPrefData = {userId: userId, sid: sid};  
            this.props.onAnalytics(
              'App_DeepLink_Launch',
              eventData,
              userPrefData
            );
            changeField('fireAppLaunchEvent', false)
          }
    }

    componentWillUnmount = () => {
        BackHandler.removeEventListener(
            'hardwareBackPress',
            this.handleBackButtonClick,
          );  
    }

    handleBackButtonClick() {
        NavigationService.goBack();
        return true;
    }


    onPressLogin = () => {
        LogFBEvent(Events.LOGIN_TO_CONTINUE, {
            screen: 'MyOrderCheckout',
        });
        NavigationService.navigate('Login');
    }

   render() {
        
       const {login, navigation, isLoggedIn, t} = this.props;
       const userMode = idx(login, _ => _.userPreferences.userMode);
       const clType = idx(login, _ => _.clDetails.mallInfo.clDetails.clType);
     
        if(!isLoggedIn) {
            return (
                <TouchableOpacity
                style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
                onPress={this.onPressLogin}>
                <AppText size="XXL" bold black>
                    {t('Kindly login to continue')}
                </AppText>
                <AppText style={styles.buttonLogin} size="L" bold greenishBlue>
                    {t(' Press here ')}
                </AppText>
            </TouchableOpacity>
            )
        }

        return (
            userMode === 'CL' ? (
                <CLBusiness navigation={navigation} clType={clType}/>
            ) : (
                <ShippingList navigation={navigation}/>
            )   
        )       
    }
}
const styles = StyleSheet.create({
      buttonLogin:{
        height: heightPercentageToDP(5),
        lineHeight: heightPercentageToDP(5),
        textAlign: 'center',
        alignSelf: 'center',
        borderRadius: scaledSize(6),
        borderWidth: scaledSize(1),
        borderColor: Constants.greenishBlue,
      },
});

const mapStateToProps = state => {
    return {
      login: state.login,
      fireAppLaunchEvent: state.login.fireAppLaunchEvent,
      launchEventDetails:state.login.launchEventDetails,
      isLoggedIn: state.login.isLoggedIn
    }}

const mapDispatchToProps = dispatch => ({
    onAnalytics: (eventName, eventData, userPrefData) => {
        dispatch(liveAnalytics(eventName, eventData, userPrefData));
    },
    onChangeField: (fieldName: string, value: any) => {
        dispatch(changeField(fieldName, value));
    }
})

const MyOrderCheckout = connect(
    mapStateToProps,
    mapDispatchToProps
  )(MyOrderCheckoutBase);
  
export default withTranslation()(MyOrderCheckout);
      