import React, { Component } from 'react';
import {AppText} from '../../../../../components/Texts';
import {View, Linking, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator} from 'react-native';
import {connect} from 'react-redux';
import idx from 'idx';
import {withTranslation} from 'react-i18next';
import { heightPercentageToDP, widthPercentageToDP } from '../../../../../utils';
import { Constants } from '../../../../../styles';
import {request, requestMultiple, check, checkMultiple, PERMISSIONS, RESULTS} from 'react-native-permissions';
import { shopGContact, showToastr } from '../../../utils';
import Contacts from 'react-native-contacts';

class TaskAddContactsToCL extends Component {
    constructor(props) {
        super(props);
        this.state = {
          inputs: this.props.clDetails && this.props.clDetails.clConfig.whatsAppLink,
          isButtonDisabled: true,
          isLoading:false
        };
        this.onPressConfirm = this.onPressConfirm.bind(this);
        this.markTaskComplete = this.markTaskComplete.bind(this);
      }

    componentDidMount() {
        this.setState({isButtonDisabled:this.props.isDone})
    }
    
    markTaskComplete = () => {
      const {userPref, data, widgetId} = this.props;
      const widgetType = data.widgetType;

      let eventProps = {
          taskId: widgetId,
          widgetType: widgetType,
        };
      let userPrefData = {
        userId: userPref.uid,
        sid: userPref.sid,
      };
      this.props.onCompleteTask(eventProps, userPrefData);
    }

    onPressConfirm = () => {
      this.requestPermission(false);
    }

    requestPermission = requested => {
        checkMultiple([PERMISSIONS.ANDROID.WRITE_CONTACTS, PERMISSIONS.ANDROID.READ_CONTACTS])
        .then(statuses => {
            if(statuses[PERMISSIONS.ANDROID.WRITE_CONTACTS] == RESULTS.GRANTED && statuses[PERMISSIONS.ANDROID.READ_CONTACTS] == RESULTS.GRANTED){
                this.saveClUsers();             
            } else {
                if (!requested) {
                    // here request permission
                    requestMultiple([PERMISSIONS.ANDROID.WRITE_CONTACTS, PERMISSIONS.ANDROID.READ_CONTACTS]).then(result => {
                      // …
                      this.requestPermission(true);
                    });
                  }
            }
        })
        .catch(error => {
          // …
        });
    }

    saveClUsers = () => {
      const {t,clUsers,clDetails} = this.props;
      this.setState({isLoading:true})
      const whatsAppLink = idx(
        clDetails,
        _ => _.clConfig.whatsAppLink
      );
      Contacts.getAll((err, contacts) => {
        if (err) {
          throw err;
        }
        clUsers.map(data => {
          let isNumberExists = false;
          contacts.map(contact => {
            contact.phoneNumbers.map(phoneNumber => {
              if(phoneNumber.number.includes(data.phoneNumber)){
                isNumberExists = true;
              }  
            })
          });

          if(!isNumberExists){
            let contactToAdd = {...shopGContact};
            contactToAdd['phoneNumbers'] = [{
              label: 'mobile',
              number: data.phoneNumber,
            }];
            contactToAdd['givenName'] = 'Glowfit_' + data.name;
            contactToAdd['jobTitle'] = 'My mart users';
            contactToAdd['note'] = 'Glowfit note';
            contactToAdd['familyName'] = 'Glowfit';
            Contacts.addContact(contactToAdd, (err, contacts) => {
                if (err === 'denied'){
                  // Log unable to save in contacts
                  showToastr(t('Unable to save in contacts'))
                } else {
                  // Contacts saved success
                  showToastr(t('Contacts saved success'))
                }
              });
          }
        });


        this.setState({isLoading:false})

        if(whatsAppLink) {
          Linking.openURL(whatsAppLink).then(() => {
            this.markTaskComplete();
              this.setState({isButtonDisabled:true})
          }, (err) => {
            if(err)
            showToastr(t('Something went wrong. Please add valid whatsApp link'))
          })
        }
        else showToastr(t('Please add whatsApp link'))

       // contacts returned
      })
    }

    render() {
        const {t} = this.props;
        const {isLoading,isButtonDisabled} = this.state;
       
        return (
            <View style={styles.mainView}>
                <TouchableOpacity 
                style={[styles.buttonStyle, isButtonDisabled 
                  ? {backgroundColor: Constants.lightGreenishBlue} 
                  : {backgroundColor: Constants.primaryColor}]}
                disabled={isButtonDisabled}
                onPress={this.onPressConfirm}>
                  {
                    isLoading
                    ? (
                      <ActivityIndicator color={Constants.white} size="small"/> 
                    )
                    : (
                    <AppText white bold size="S">{t('Save To Contacts')}</AppText>
                    )
                  }
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    mainView: {
    flex: 1, 
    alignItems: 'center', 
    marginTop: heightPercentageToDP(3)
    },
    textInputStyle: {
    height: heightPercentageToDP(7),
    width: widthPercentageToDP(80),
    borderColor: 'gray', 
    borderWidth: 1 
    },
    buttonStyle: {
    width: widthPercentageToDP(80),
    height: heightPercentageToDP(5),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: heightPercentageToDP(1.5),
    }
})

const mapStateToProps = state => ({
    userPref: state.login.userPreferences,
    clDetails: state.login.clDetails,
    clConfig: state.clOnboarding.clConfig,
    clUsers: state.clOnboarding.clUsers,
  });

const mapDipatchToProps = (dispatch: Dispatch) => ({
    dispatch,
  });
  
  export default withTranslation()(
    connect(mapStateToProps, mapDipatchToProps)(TaskAddContactsToCL),
  );