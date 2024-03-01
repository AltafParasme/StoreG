import React, {PureComponent, Component} from 'react';
import {
  View,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import { Button } from 'react-native-elements';
import {Icon} from 'react-native-elements';
import {withTranslation} from 'react-i18next';
import idx from 'idx';
import {Images} from '../../../../../../assets/images/index';
import {
  heightPercentageToDP,
  widthPercentageToDP,
  scaledSize
} from '../../../../../utils';
import {Constants} from '../../../../../styles';
import {AppText} from '../../../../../components/Texts';
import {Events} from '../../../../../Events';
import { isIncluded } from '../../../utils';

class OfferShare extends PureComponent {

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.shareLoading !== nextProps.shareLoading || this.props.sharedItems !== nextProps.sharedItems) {
      return true;
    }
    return false;
  }

  componentDidUpdate() {
    const {sharedItems, item} = this.props;
    
  }

  render() {
    
    const {t, item, pointsPerTask,shareLoading,selectedProductId, sharedItems} = this.props;
    let isSharedItem = sharedItems && item ? isIncluded(sharedItems, item.id) : false;
    return (
        <View style={styles.cardStyle}>
            <View style={{justifyContent: 'center', alignItems: 'center', borderColor: "#d6d6d6", borderWidth: widthPercentageToDP(0.2), borderRadius: 4, flex: 0.54}}>
                <Image
                  resizeMethod={'resize'}
                  resizeMode={'contain'}
                  style={{width: widthPercentageToDP(29), flex: 0.54, resizeMode: 'contain'}}
                  source={{uri: item.mediaJson.square}}
                />
              </View>
              <View style={{ justifyContent: 'center', alignItems: 'center', flex: pointsPerTask ? 0.32 : 0.15}}>
              <AppText
                  size={'XS'}
                  black
                  textProps={{numberOfLines: 2}}
                  style={styles.textStyle}>
                  {t(item.mediaJson.title.text)}
                </AppText>
                { pointsPerTask ? 
                  <View style={styles.coinBox}>
                  <Image source={Images.coin} style={styles.coinImageStyle} />
                  <View style={{ flexDirection: 'column', paddingLeft: widthPercentageToDP(0.5) }}>
                    <AppText bold secondaryColor size="XS" style={{ marginLeft: widthPercentageToDP(0.5)}}>
                      {t(`EARN`)}
                    </AppText>
                    <AppText style={{letterSpacing:widthPercentageToDP(0.5)}} bold secondaryColor size="XS">
                      {t(`#POINTSPERTASK# COINS`, { POINTSPERTASK : pointsPerTask })}
                    </AppText>
                  </View>
                  </View>
                : null }
              </View>
              <View style={{ flex: 0.14 }}>
                {
                  (shareLoading && (selectedProductId==item.id))
                  ?
                  <View style={styles.loaderStyle}>
                    <ActivityIndicator color="black" size="small" />
                  </View>
                  :
                  <TouchableOpacity style={{ width: widthPercentageToDP(18) }} onPress={() => this.props.shareOffer(item, isSharedItem)}>
                  {isSharedItem ? 
                  <View style={{ marginLeft: widthPercentageToDP(1), alignItems: 'center', justifyContent: 'center'}}> 
                    <View
                      style={styles.circleView}>
                    <Icon
                          name="done"
                          type="material"
                          color={Constants.white}
                          size={widthPercentageToDP(4.5)}
                          containerStyle={{
                            alignSelf: 'center',
                            top: heightPercentageToDP(0.5)
                          }}
                        />
                    </View>
                  </View> :
                  <View style={{ marginLeft: widthPercentageToDP(1), alignItems: 'center', justifyContent: 'center'}}> 
                      <View style={styles.whatsappCircle}>
                        <Icon
                          name="whatsapp"
                          type="font-awesome"
                          color={Constants.white}
                          size={widthPercentageToDP(4.5)}
                          containerStyle={{
                            alignSelf: 'center',
                          }}
                        />
                      </View>
                      </View>}
                      <View style={styles.circleContainer}>
                      <AppText style={{width: widthPercentageToDP(20), textAlign: 'center'}} black bold size="XS">{t(`Share with group`)}</AppText>
                        </View> 
                </TouchableOpacity>
                }

              </View>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  cardStyle: {
    flex: 1, 
    alignItems: 'center',
    justifyContent: 'center',
    width: widthPercentageToDP(29),
    height: heightPercentageToDP(43),
    marginHorizontal: widthPercentageToDP(1),
  },
  textStyle: {
    flexWrap: 'wrap',
  },
  coinBox: {
    flexDirection: 'row',
    marginTop: heightPercentageToDP(1)
  },
  coinImageStyle: {
    width: widthPercentageToDP(4),
    height: heightPercentageToDP(4),
    resizeMode: 'contain'
  },
  loaderStyle:{
    flex: 1, 
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleContainer: {
    position: 'absolute',
    top: 25
  },
  whatsappCircle: {
    marginHorizontal: widthPercentageToDP(3),
    backgroundColor: '#1ad741',
    alignItems: 'center',
    justifyContent: 'center',
    width: scaledSize(26),
    height: scaledSize(26),
    borderRadius: 28 / 2,
  },
  circleView: {
    width: scaledSize(25),
    height: scaledSize(25),
    borderRadius: 27 / 2,
    borderWidth: 1,
    elevation: 5,
    marginHorizontal: widthPercentageToDP(3),
    borderColor: Constants.white,
    backgroundColor: Constants.green
  },
});

export default withTranslation()(OfferShare);
