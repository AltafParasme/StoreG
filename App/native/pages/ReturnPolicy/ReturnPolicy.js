import React, {Component} from 'react';
import Icons from 'react-native-vector-icons/MaterialIcons';
import {
  View,
  BackHandler,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {withTranslation} from 'react-i18next';
import {connect} from 'react-redux';
import {Header} from 'react-native-elements';
import idx from 'idx';
import {Constants} from '../../../styles';
import {AppConstants} from '../../../Constants';
import NavigationService from '../../../utils/NavigationService';
import {AppText} from '../../../components/Texts';
import {Images} from '../../../../assets/images';
import {widthPercentageToDP, heightPercentageToDP} from '../../../utils';

class ReturnPolicyBase extends Component {
  constructor() {
    super();
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  componentWillMount() {
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick
    );
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick
    );
  }

  handleBackButtonClick() {
    NavigationService.goBack(null);
    return true;
  }

  componentDidMount() {
    //this.props.onCurrentUser();
  }

  componentDidUpdate() {
    //console.log('user profile props are ', this.props);
  }

  handleBackButtonClick() {
    this.props.navigation.goBack(null);
    return true;
  }

  render() {
    const {t} = this.props;
    const userMode = idx(this.props.login, _ => _.userPreferences.userMode);
    const callNumber =
      userMode == 'CL'
        ? AppConstants.supportCLCallNumber
        : AppConstants.supportCallNumber;

    return (
      <View style={{flex: 1}}>
        <Header
          containerStyle={styles.header}
          leftComponent={
            <TouchableOpacity onPress={this.handleBackButtonClick}>
              <Icons name={'arrow-back'} size={28} color="#000" />
            </TouchableOpacity>
          }
          rightComponent={
            <TouchableOpacity onPress={this.navigateTo}>
              <Image style={styles.imageContent} source={Images.logo} />
            </TouchableOpacity>
          }
        />

        <View style={styles.container}>
          <View style={styles.textBoxStyle}>
            <AppText>{'\u2022'}</AppText>
            <AppText>
              {' '}
              {t(
                `  All grocery, personal care products which are unopened can be returned within 2 days from delivery date.`
              )}{' '}
            </AppText>
          </View>
          <View style={styles.textBoxStyle}>
            <AppText>{'\u2022'}</AppText>
            <AppText>
              {' '}
              {t(
                `  All other items can be returned within 7 days provided they are not damaged, broken after it has been delivered to you.`
              )}{' '}
            </AppText>
          </View>
          <View style={styles.textBoxStyle}>
            <AppText>{'\u2022'}</AppText>
            <AppText>
              {t(
                `  If you have any questions or concerns, we are always reachable at contact@shopg.in on email and ${callNumber} on phone`
              )}
            </AppText>
          </View>
        </View>
        <View style={styles.footer}>
          <AppText bold style={{textAlign: 'center'}}>
            © REYBHAV TECHNOLOGIES PRIVATE LIMITED.
          </AppText>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  contentBox: {
    flex: 1,
  },
  container: {
    flex: 0.8,
    alignSelf: 'center',
    margin: heightPercentageToDP(2),
    flexDirection: 'column',
    justifyContent: 'center',
  },
  header: {
    backgroundColor: Constants.white,
    height: heightPercentageToDP(8),
    paddingBottom: heightPercentageToDP(3),
  },
  card: {
    marginTop: 0,
    marginLeft: 0,
    marginRight: 0,
  },
  imageContent: {
    width: widthPercentageToDP(30),
    height: heightPercentageToDP(30),
    resizeMode: 'contain',
  },
  profileBox: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: Constants.primaryColor,
  },
  nameText: {
    marginTop: 10,
    fontSize: 24,
    color: Constants.white,
  },
  mobileNumber: {
    marginTop: 10,
    fontSize: 24,
    color: Constants.white,
  },
  textBoxStyle: {
    flexDirection: 'row',
    margin: heightPercentageToDP(2),
  },
  center: {
    width: '100%',
    alignItems: 'center',
  },
  editBtn: {
    marginTop: 10,
    height: 30,
    color: Constants.white,
    backgroundColor: Constants.primaryColor,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Constants.white,
  },
  titleContainer: {
    justifyContent: 'center',
    flex: 0.2,
  },
  listTitle: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  footerIcon: {
    color: Constants.black,
  },
  wpIcon: {
    color: Constants.green,
    marginLeft: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    margin: 'auto',
  },
});

const mapStateToProps = state => ({
  login: state.login,
});

const mapDipatchToProps = (dispatch: Dispatch) => ({
  dispatch,
  // other callbacks go here...
});

const ReturnPolicy = connect(
  mapStateToProps,
  mapDipatchToProps
)(ReturnPolicyBase);

export default withTranslation()(ReturnPolicy);
