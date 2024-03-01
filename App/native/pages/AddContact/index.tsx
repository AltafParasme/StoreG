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
  PermissionsAndroid
} from 'react-native';
import { PrimaryButton } from '../../../components/Buttons';
import NavigationService from '../../../utils/NavigationService';
import { Constants } from '../../../styles';
import {shopGContact} from '../utils';
import Contacts from 'react-native-contacts';
import AsyncStorage from '@react-native-community/async-storage';
import { withTranslation } from 'react-i18next';
import {LogFBEvent, Events, SetScreenName, } from '../../../Events';
import { AppText } from '../../../components/Texts';


class AddContact extends Component {
  constructor(private router: Router) {super();
    this.saveToContact = this.saveToContact.bind(this);
  }

  async componentDidMount() {
    SetScreenName(Events.LOAD_ADD_CONTACT_SCREEN.eventName());
    LogFBEvent(Events.LOAD_ADD_CONTACT_SCREEN, null); 
  }
  saveToContact() {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS,
        {
          'title': 'Contacts',
          'message': 'We will save Nyota helpline number in your phone for future support.'
        }
      ).then(() => {
        Contacts.addContact(shopGContact, (err, contacts) => {
          if (err === 'denied'){
            // Log unable to save in contacts
            //NavigationService.navigate('Home');
            NavigationService.navigate('AddressPincode');
          } else {
            AsyncStorage.setItem("isShopGContactsSaved","TRUE").then(() => {
            //NavigationService.navigate('Home');
            NavigationService.navigate('AddressPincode');
            });
          }
        })
      });
      LogFBEvent(Events.ADD_CONTACT_ADD_CONTACT_BUTTON_CLICK, null);
    } 

  render() {
    const {t} = this.props;
    return (
      <SafeAreaView style={styles.container} >
        <View style={styles.sectionStyleM} >
          <AppText style={styles.textL }> {t('Hello!')} </AppText>
          <AppText style={ styles.textS}>{t('We need your permissions to get started! Please allow access to contact you on call or sms for the best experience.')}</AppText>
        </View>
        <View style={styles.sectionStyleM} >
        <Image
          style={styles.imageContent}
          source={{uri: 'https://cdn.shopg.in/icon/add_contact_image.png'}}
          resizeMode='contain'
        />
        </View>
        <View style={styles.sectionStyleL} >
          <AppText style={styles.textM } >{t('Contact permissions needed')}</AppText>
          <AppText style={styles.textS}>{t('We use this to save Nyota’s helpline number in your phone.')}</AppText>
          <PrimaryButton
                  onPress={this.saveToContact}
                  title={
                    <AppText white size="M">{t(`CONTINUE`)}</AppText>
                  }
                  style={{
                    backgroundColor: Constants.primaryColor,
                    height: 45,
                    width: '100%',
                    marginTop: 70
                  }}
                  textStyle={{
                    color: Constants.white,
                    fontWeight: 'bold',
                    fontSize: 16
                  }}
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
      justifyContent: 'center',
      margin: 30
    },
    sectionStyleL: {
      flex:.4,
      alignItems: 'center',
      justifyContent: 'center',
      margin: 30,
      top:-30,
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
      color: Constants.grey,
      fontFamily: "Roboto-Regular"
    },
    textBold: {
      fontWeight:"bold",
    },
    imageContent: {
      width: '100%',
      height: '120%',
    }

  });

export default withTranslation()(AddContact);