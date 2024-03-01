import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {AppText} from '../../../../components/Texts';
import NavigationService from '../../../../utils/NavigationService';
import {withTranslation} from 'react-i18next';
import {getStarterKit} from '../../CLOnboarding/actions';
import {Images} from '../../../../../assets/images';

import {LogFBEvent, Events} from '../../../../Events';
import {
  scaledSize,
  widthPercentageToDP,
  heightPercentageToDP,
} from '../../../../utils';
import {Icon} from 'react-native-elements';

class CLFlowBanner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
    };
  }

  clOnboarding() {
    NavigationService.navigate('CLOnboarding');
    LogFBEvent(Events.CL_ONBOARDING_BANNER_CLICK, null);
  }


  render() {
    const {t} = this.props;

    return (
      <TouchableOpacity
      onPress={this.clOnboarding}
      style={{width: widthPercentageToDP(91), alignSelf: 'center'}}
      >
      <LinearGradient
        start={{x: 0, y: 0}} 
        end={{x: 1, y: 0}}
        colors={['#7e3a77', '#ec3d5a']}
        style={{paddingHorizontal: widthPercentageToDP(1), borderRadius: 6}}
       >
        <View>
          <View style={styles.upperView}>
          <View style={styles.iconView}>
          <Image source={Images.clBanner} style={{width: widthPercentageToDP(20), height: heightPercentageToDP(9)}} />
            </View>
            <View style={{flex: 0.95, height: heightPercentageToDP(12)}}>
              <AppText bold white size="S" style={{lineHeight: 26}}>
                {t('EARN UPTO ₹15,000 / month*')}
              </AppText>
              <AppText white size="S">
                {t('Become a Glowfit Community Leader today!')}
              </AppText>
              <AppText white size="XXS" style={{paddingTop: heightPercentageToDP(0.7)}}>
                {t('Interested? Tap here & reach out to us!')}
              </AppText>
            </View>
           
          </View>
        </View>
      </LinearGradient>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  iconView: {
    marginRight: widthPercentageToDP(3),
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0.27,
  },
  upperView: {
    flexDirection: 'row',
    margin: heightPercentageToDP(1),
    justifyContent: 'space-between',
  },
});


export default withTranslation()(CLFlowBanner);
