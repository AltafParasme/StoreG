import React, {Component} from 'react';
import {connect} from 'react-redux';
import {View, StyleSheet, FlatList, Image} from 'react-native';
import Share from 'react-native-share';
import LinearGradient from 'react-native-linear-gradient';
import {Colors} from '../../../../../assets/global';
import {withTranslation} from 'react-i18next';
import {AppText} from '../../../../components/Texts';
import Button from '../../../../components/Button/Button';
import {Icon} from 'react-native-elements';
import {getStarterKit} from '../actions';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from '../../../../utils';
import {Images} from '../../../../../assets/images';
import { Constants } from '../../../../styles';

class CLCreationBottomSheet extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.onGetCLOnboarding();

  }
 
  render() {
    const {t, clDetails} = this.props;
    
    return (
      <View style={styles.topContainer}>
        <View style={[styles.firstSubSection, {flex: 0.08}]}>
          <View style={{alignItems: 'flex-end'}}>
            <Image style={styles.mallImageContent} source={Images.shopGMart} />
          </View>
        </View>
        <View style={styles.secondView}>
          <View
            style={{position: 'absolute', bottom: heightPercentageToDP(55)}}>
            <Image style={styles.mallImageLogo} source={Images.clSheet} />
          </View>
          <View style={styles.secondSubSection}>
            <View style={styles.upperTextView}>
             <View style={{paddingHorizontal: widthPercentageToDP(4)}}>
              <AppText size="L" bold style={{lineHeight: 24}}>
                {t('Congratulations! 👏👍😎')}
              </AppText>
              <AppText size="L" bold style={{lineHeight: 24}}>
                {t('You are a Nyota Community Leader.')}
              </AppText>
              <AppText
                style={{color: Constants.greyishBlack, paddingTop: heightPercentageToDP(1.1)}}>
                {t('#OWNER# | Owner', {
                  OWNER: clDetails && clDetails.mallInfo.name ? clDetails && clDetails.mallInfo.name : null,
                })}
              </AppText>
              </View>
            </View>
           
            <LinearGradient
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            colors={['#7e3a77', '#ec3d5a']}
            style={styles.linearGradientView}>
                     <View style={{marginTop: heightPercentageToDP(2), alignItems: 'center'}}>
              <AppText white bold>{t('Complete simple tasks as a Community Leader')}</AppText>
              <View style={{marginVertical: heightPercentageToDP(3), flexDirection: 'row'}}>
                <View style={{alignItems: 'center'}}>
                  <Image source={Images.createTask} 
                    style={styles.contentIconImage} />
                  <AppText bold size="XS" white style={{textAlign: 'center', paddingTop: heightPercentageToDP(2)}}>{t('TASK 1')}</AppText>
                  <View style={{width: widthPercentageToDP(36), alignItems: 'center', marginTop: heightPercentageToDP(1)}}>
                    <AppText white style={{textAlign: 'center'}}>{t('Create a whatsapp group of friends')}</AppText>
                  </View>
                </View>
                <View 
                style={{ 
                  marginHorizontal: widthPercentageToDP(5)
                  }}>
                <Icon
                  name={'chevron-right'}
                  type={'font-awesome'}
                  color={Constants.white}
                  size={20}
                  containerStyle={{
                    top: heightPercentageToDP(4),
                  }}
                />
              </View>
                <View style={{alignItems: 'center',}}>
                  <Image source={Images.shareTask} style={styles.contentIconImage}/>
                  <AppText bold size="XS" white style={{textAlign: 'center', paddingTop: heightPercentageToDP(2)}}>{t('TASK 2')}</AppText>
                  <View style={{width: widthPercentageToDP(36), alignItems: 'center', marginTop: heightPercentageToDP(1)}}>
                    <AppText white style={{textAlign: 'center'}}>{t('Share daily offers on WhatsApp every day')}</AppText>
                  </View>
                </View>
              </View>
              </View>
            </LinearGradient>
          </View>
          <View style={styles.bottomView}>
            <Button
              onPress={() => this.props.closeAction('continue')}
              styleContainer={[styles.supportBtn]}>
              <AppText white bold size="M">
                {t('SHOW MY TASKS')}
              </AppText>
            </Button>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  topContainer: {
    flex: 1,
  },
  upperTextView: {
    paddingBottom: heightPercentageToDP(2.3),
    paddingVertical: heightPercentageToDP(1.5),
  },
  linearGradientView: {
    height: heightPercentageToDP(30),
    width: widthPercentageToDP(94),
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 5
  },
  contentIconImage: {
    height: heightPercentageToDP(10),
    width: widthPercentageToDP(21),
    resizeMode: 'contain'
  },
  supportBtn: {
    marginHorizontal: widthPercentageToDP(3),
    marginBottom: heightPercentageToDP(1),
    borderRadius: 5,
    elevation: 3,
    backgroundColor: Colors.blue,
    flex: 1,
    height: heightPercentageToDP(6.2),
    color: Colors.blue,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mallImageContent: {
    width: widthPercentageToDP(40),
    height: heightPercentageToDP(7),
    resizeMode: 'contain',
  },
  mallImageLogo: {
    width: widthPercentageToDP(18),
    height: heightPercentageToDP(9),
    left: widthPercentageToDP(4),
    resizeMode: 'contain',
  },
  secondView: {
    justifyContent: 'flex-end',
    backgroundColor: Colors.white,
    flex: 0.93,
  },
  secondSubSection: {
    flex: 1,
    marginTop: heightPercentageToDP(5),
  },
  bottomView: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignContent: 'center',
  },
  firstSubSection: {
    margin: heightPercentageToDP(2),
  },
});

const mapStateToProps = state => ({
    clConfig: state.clOnboarding.clConfig,
    clDetails: state.login.clDetails,
  });
  
  const mapDispatchToProps = dispatch => ({
    dispatch,
    onGetCLOnboarding: () => {
        dispatch(getStarterKit());
      },
  });
  
  export default withTranslation()(
    connect(mapStateToProps, mapDispatchToProps)(CLCreationBottomSheet),
  );
