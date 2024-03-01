import React, { Component } from 'react';
import {  View, ImageBackground, Image , TouchableOpacity, StyleSheet} from 'react-native';
import {Images} from '../../../../../assets/images';
import NavigationService from '../../../../utils/NavigationService';
import {AppText} from '../../../../components/Texts'; 
import {withTranslation} from 'react-i18next';
import {LogFBEvent, Events} from '../../../../Events';
import {Icon} from 'react-native-elements';
import { heightPercentageToDP, widthPercentageToDP, scaledSize } from '../../../../utils';
import { Constants } from '../../../../styles';
import CLTopStrip from './CLTopStrip';

class CLLeaderBoardStrip extends Component {
  onPressStrip = () => {
    NavigationService.navigate('MyOrderBusinessCheckout', {
      actionId: 2,
    });
    LogFBEvent(Events.CL_LEADERBOARD_STRIP_CLICK, null);
  }
    render() {
      const {t,TaskData, clType} = this.props;
        return (
            <View style={{alignItems:'center',justifyContent:'center',backgroundColor:'#fff3eb'}}>
              <TouchableOpacity
                  style={{alignItems: 'center', 
                  }}
                  onPress={this.onPressStrip}>
                <ImageBackground
                  source={Images.leaderBack}
                  imageStyle={{ borderBottomLeftRadius: 4, borderBottomRightRadius: 4 }}
                  style={styles.imageBackgroundStyle}
                  >
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Image source={Images.coin} 
                style={styles.imageStyle} 
                />
                <View style={{justifyContent: 'center'}}>
                    <AppText bold  size='XS'  style={{color: '#f3b900'}}>{t('Community Leader Monthy Reward Program')}</AppText>
                    <AppText bold size='XS' white>{t('CHANCE TO WIN UPTO ₹25 LAKH')}</AppText>
                </View>
              
                <Icon
                  type="feather"
                  name="chevron-right"
                  color={Constants.white}
                  size={widthPercentageToDP(6)}
                  containerStyle={{
                    alignSelf: 'center',
                  }}
                />
                </View>
          
                </ImageBackground>
              </TouchableOpacity>
              <View style={styles.emptyView}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    imageStyle: {
      height: scaledSize(32), 
      width: scaledSize(32),
      marginRight: widthPercentageToDP(2)
    },
    imageBackgroundStyle: {
      height: heightPercentageToDP(8),
      width: widthPercentageToDP(96), 
      padding: heightPercentageToDP(1.3),
      justifyContent: 'center'
    },
    taskMadiBG: {
      height: heightPercentageToDP(60),
      width: widthPercentageToDP(100), 
    },
    emptyView:{
      height:heightPercentageToDP(1),
      width:widthPercentageToDP(2)
    }
});


export default withTranslation()(CLLeaderBoardStrip);
 