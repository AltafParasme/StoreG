import React, {Component} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import {Button, ThemeProvider} from 'react-native-elements';
import {withTranslation} from 'react-i18next';
import i18n from '../../../../i18n.js';
import {
  setDefaultLanguage,
  scaledSize,
  widthPercentageToDP,
} from '../../../utils';
import {Colors, Fonts} from '../../../../assets/global.js';
import {Constants} from '../../../styles';
import {connect} from 'react-redux';
import {Images} from '../../../../assets/images/index';
import {LogFBEvent, Events} from '../../../Events';

// home/language
class LangSheet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  changeLanguage = language => {
    const {dispatch, closeAction} = this.props;
    // this.setState({
    //   loading: true,
    // });
    this.props.changeVideoLanguage(language);
    
    LogFBEvent(Events.VIDEO_LANGUAGE_SELECTION_CLICK, {language: language});
  };

  render() {
    const {selectedLanguage, t} = this.props;
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.innerView}>
          <Text style={styles.header}>{t(`Select language`)}</Text>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={styles.buttonView}>
              <Button
                onPress={() => this.changeLanguage('english')}
                title="English"
                type="clear"
                icon={
                  selectedLanguage == 'english' && (
                    <View style={styles.iconView}>
                      <Image source={Images.selected} style={styles.icon} />
                    </View>
                  )
                }
                buttonStyle={styles.buttonStyle}
                iconRight={true}
              />
              <Button
                onPress={() => this.changeLanguage('kannada')}
                title="ಕನ್ನಡ"
                type="clear"
                icon={
                  selectedLanguage == 'kannada' && (
                    <View style={styles.iconView}>
                      <Image source={Images.selected} style={styles.icon} />
                    </View>
                  )
                }
                buttonStyle={styles.buttonStyle}
                iconRight={true}
              />
              <Button
                onPress={() => this.changeLanguage('hindi')}
                title="हिंदी"
                type="clear"
                icon={
                  selectedLanguage == 'hindi' && (
                    <View style={styles.iconView}>
                        <Image source={Images.selected} style={styles.icon} />
                    </View>
                    )
                }
                buttonStyle={styles.buttonStyle}
                iconRight={true}
               />  
              
            </View>
            <View styles={{borderWidth: 1}}>
              {this.state.loading && (
                <ActivityIndicator
                  color="black"
                  style={styles.activityIndicator}
                  size="large"
                />
              )}
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: widthPercentageToDP(93),
  },
  innerView: {
    margin: widthPercentageToDP(3),
  },
  header: {
    marginHorizontal: widthPercentageToDP(2),
    fontSize: scaledSize(18),
    fontFamily: Fonts.roboto,
    fontWeight: '800',
  },
  buttonView: {
    marginTop: 10,
  },
  iconView: {
    marginRight: 10,
    alignItems: 'center',
  },
  icon: {
    height: 15,
    width: 15,
    resizeMode: 'contain',
    marginLeft: 10,
  },
  activityIndicator: {
    right: scaledSize(10),
    top: scaledSize(30),
  },
  buttonStyle: {
    alignSelf: 'flex-start',
    width: widthPercentageToDP(90),
    justifyContent: 'flex-start',
  },
});

const Buttontheme = {
  Button: {
    titleStyle: {
      color: 'red',
    },
  },
};

const mapStateToProps = state => ({
  language: state.home.language,
});

const mapDispatchToProps = dispatch => ({
  dispatch,
});

export default withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(LangSheet)
);
