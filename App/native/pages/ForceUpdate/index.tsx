/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Fragment, Component} from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  Image,
  Linking,
  BackHandler,
} from 'react-native';
import {SvgXml} from 'react-native-svg';
import { connect} from 'react-redux';
import { PrimaryButton } from '../../../components/Buttons';
import NavigationService from '../../../utils/NavigationService';
import { Constants } from '../../../styles';
import { withTranslation } from 'react-i18next';
import { AppText } from '../../../components/Texts';
import forceUpdate from '../../../../assets/jsStringSvgs/force_update'
import { scaledSize } from "../../../utils";
import { LoginState } from '../Login/types'
import {LogFBEvent, Events, SetScreenName, } from '../../../Events';

class ForceUpdateBase extends Component {
  constructor(private router: Router) {super();
    this.state = {
      isForceUpdateSkipped: false,
      isNotForceUpdate: false,
    }
    this.updateApp = this.updateApp.bind(this);
  }

  componentDidMount() {
    const app_update_type = this.props.login.app_update_type
    if (app_update_type !== 'FORCE') {
      this.setState({ isNotForceUpdate: true})
    }
    // BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    // if (this.state.isForceUpdateSkipped) {
    //   NavigationService.navigate('Home');
    // }
    SetScreenName(Events.LOAD_APP_FORCE_UPDATE_SCREEN.eventName());
    LogFBEvent(Events.LOAD_APP_FORCE_UPDATE_SCREEN, null); 
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  handleBackButton() {
    return true;
  }

  updateApp() { 
    const force_update_store_url = this.props.login.updateUrl
    Linking.openURL(force_update_store_url);
    LogFBEvent(Events.LINK_TO_APP_UPDATE_CLICK, null);
  } 

  render() {
    const {t} = this.props;
    return (
      <SafeAreaView style={styles.container} >

        <View style={styles.sectionStyleM} >
        <SvgXml
            xml={forceUpdate}
            width={scaledSize(200)}
            height={scaledSize(300)}
          />
        </View>
        <View style={styles.sectionStyleL} >
        <View style={{flex: 1.5, justifyContent:'center', alignItems: 'center', top: 60}}>
          <AppText style={styles.textM } >{t('Update your app')}</AppText>
          <AppText style={styles.textS}>{t('Please download the latest version of the app to get a')}</AppText>
          <AppText size="XL" color="" style={[styles.textS, { color: Constants.primaryColor}]}>{t('better experience')}</AppText>
          </View>
          {this.state.isNotForceUpdate ? (
          <PrimaryButton
                  onPress={() => {
                    this.setState({isForceUpdateSkipped: true})
                    NavigationService.navigate('Home')
                    LogFBEvent(Events.SKIP_APP_UPDATE_CLICK, null);
                  }}
                  title={
                    <AppText white size="M">{t(`SKIP`)}</AppText>
                  }
                  style={styles.buttonStyle}
                  textStyle={styles.buttonTextStyle}
                  disabled={false}
          /> ) : null 
                }
              <PrimaryButton
                  onPress={() => {
                    this.updateApp()
                  }}
                  title={
                    <AppText white size="M">{t(`UPDATE NOW`)}</AppText>
                  }
                  style={styles.buttonStyle}
                  textStyle={styles.buttonTextStyle}
                  disabled={false}
          /> 
        </View>
      </SafeAreaView>
    );
  };
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: Constants.white,
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'stretch',
    },
    sectionStyleM: {
      flex:.3,
      alignItems: 'center',
      justifyContent: 'space-between',
      margin: 30
    },
    buttonStyle: {
      backgroundColor: Constants.primaryColor,
      height: 45,
      width: '100%',
      marginTop: 20,
      top: "30%"
    },
    buttonTextStyle: {
      color: Constants.white,
      fontWeight: 'bold',
      fontSize: 16
    },
    sectionStyleL: {
      flex: 0.5,
      alignItems: 'center',
      justifyContent: 'space-between',
      margin: 30,
      top:-20,
    },
    textL: {
      fontSize:32,
      color: Constants.black,
      fontFamily: "Roboto-Medium",
    },
    textS: {
      fontSize:16,
      color: Constants.grey,
      fontFamily: "Roboto-Regular",
      textAlign: 'center',
    },
    textM: {
      fontSize:20,
      fontWeight:"bold",
      paddingBottom: "5%",
      color: Constants.grey,
      fontFamily: "Roboto-Regular",
      top: 2
    },
    textBold: {
      fontWeight:"bold",
    },
    imageContent: {
      width: '100%',
      height: '120%',
    }

  });

  const mapStateToProps = (state: LoginState) => ({
    login: state.login
  });

  const ForceUpdate = withTranslation()(connect(
    mapStateToProps,
  )(ForceUpdateBase));

export default ForceUpdate;