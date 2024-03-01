import React, {PureComponent, Component} from 'react';
import {
  View,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import {withTranslation} from 'react-i18next';
import idx from 'idx';
import {Images} from '../../../../../assets/images/index';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from '../../../../utils';
import {Constants} from '../../../../styles';
import {AppText} from '../../../../components/Texts';
import {Events} from '../../../../Events';
import { isIncluded } from '../../utils';

class ProductShareItem extends PureComponent {

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
                  <Button
                    title={isSharedItem ? t('SHARED') : t('SHARE')}
                    icon={
                      isSharedItem ? (
                        <Icon
                        name="check"
                        size={12}
                        color={Constants.white}
                      />
                      )
                      : (
                      <Icon
                        name="whatsapp"
                        size={18}
                        color="white"
                      />)
                    }
                    titleStyle={{ color: Constants.white, fontSize: 12, paddingLeft: widthPercentageToDP(0.5) }} 
                    buttonStyle={{ backgroundColor: Constants.primaryColor, width: widthPercentageToDP(29), flex: 1, borderRadius: 4 }}
                    containerStyle={{justifyContent: 'center', alignItems: 'center', flex: 1, width: widthPercentageToDP(29) }} 
                    onPress={() => this.props.shareOffer(item, isSharedItem)}
                    >
                  </Button>
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
  }
});

export default withTranslation()(ProductShareItem);
