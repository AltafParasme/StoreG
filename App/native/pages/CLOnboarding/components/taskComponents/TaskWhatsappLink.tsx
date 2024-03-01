import React, { Component } from 'react';
import {AppText} from '../../../../../components/Texts';
import {View, Image, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator} from 'react-native';
import {connect} from 'react-redux';
import {updateCLConfig} from '../../actions';
import {withTranslation} from 'react-i18next';
import { heightPercentageToDP, widthPercentageToDP } from '../../../../../utils';
import { Constants } from '../../../../../styles';

class TaskWhatsappLink extends Component {
    constructor(props) {
        super(props);
        this.state = {
          inputs: this.props.clDetails && this.props.clDetails.clConfig.whatsAppLink,
          isButtonDisabled: true,
        };
        this.onPressConfirm = this.onPressConfirm.bind(this);
        this.markTaskComplete = this.markTaskComplete.bind(this);
      }

    componentDidMount() {
      if(this.props.clDetails && this.props.clDetails.clConfig.whatsAppLink && !this.props.isDone) {
        this.markTaskComplete();
      }
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
      let inputBody = {whatsAppLink: this.state.inputs}
      this.props.onUpdateCLConfig(inputBody, () => {
        this.markTaskComplete();
      });
      //this.markTaskComplete();
    }

    render() {
        const {t, clConfig, userPref, isCLConfigUpdated, isCLConfigLoading, data, widgetId} = this.props;
       
        return (
            <View style={styles.mainView}>
               <TextInput
                    style={styles.textInputStyle}
                    onChangeText={inputs => {
                      if (inputs && inputs.trim() !== "") {
                        this.setState({
                          inputs: inputs,
                          isButtonDisabled: false,
                        });
                      } else {
                        this.setState({
                          inputs: inputs,
                          isButtonDisabled: true,
                        });
                      }
                      }
                    }
                    value={this.state.inputs}
                    placeholder="Enter your whatsapp group link"
                    placeholderTextColor="#B9BBBF"
                    editable={true}
                    />
                <TouchableOpacity 
                style={[styles.buttonStyle, this.state.isButtonDisabled 
                  ? {backgroundColor: Constants.lightGreenishBlue} 
                  : {backgroundColor: Constants.primaryColor}]}
                disabled={isCLConfigLoading || this.state.isButtonDisabled}
                onPress={this.onPressConfirm}
                >
                  {
                    isCLConfigLoading
                    ? (
                      <ActivityIndicator color={Constants.white} size="small"/> 
                    )
                    : (
                    <AppText white bold size="S">{t('CONFIRM')}</AppText>
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
    //padding: heightPercentageToDP(1),
    //backgroundColor: Constants.primaryColor
    }
})

const mapStateToProps = state => ({
    userPref: state.login.userPreferences,
    clDetails: state.login.clDetails,
    clConfig: state.clOnboarding.clConfig,
    isCLConfigUpdated: state.clOnboarding.isCLConfigUpdated,
    isCLConfigLoading: state.clOnboarding.isCLConfigLoading,
  });

const mapDipatchToProps = (dispatch: Dispatch) => ({
    dispatch,
    onUpdateCLConfig: (inputBody, successCallBack) => {
      dispatch(updateCLConfig(inputBody, successCallBack));
    }
  });
  
  export default withTranslation()(
    connect(mapStateToProps, mapDipatchToProps)(TaskWhatsappLink),
  );