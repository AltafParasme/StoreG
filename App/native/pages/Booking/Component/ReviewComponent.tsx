import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    StyleSheet
  } from 'react-native';
  import {Card, Icon} from 'react-native-elements';
  import {AppText} from '../../../../components/Texts';
  import { widthPercentageToDP, heightPercentageToDP } from '../../../../utils';
  import {Constants } from '../../../../styles';
  import {withTranslation} from 'react-i18next';

  class ReviewComponent extends Component {
      render() { 
          const {t, data, color} = this.props;
          return ( 
              <View style={styles.mainView}>
                  <View style={{ marginVertical: heightPercentageToDP(1.6), marginHorizontal: widthPercentageToDP(3.3)}}>
                      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <View style={{flexDirection: 'row'}}>
                        <Icon
                  type="MaterialIcons"
                  name="account-circle"
                  color={color}
                  size={36}
                />
                <View style={{marginLeft: widthPercentageToDP(3), width: widthPercentageToDP(28)}}>
                    <AppText bold textProps={{numberOfLines: 1}}>{t(data.name)}</AppText>
                    <AppText size="XS" textProps={{numberOfLines: 1}} style={{color: '#091427'}}>{t(data.address)}</AppText>
                </View>
               
                </View>
                <View style={styles.ratingView}>
                <AppText size="XXS" white bold style={{textAlign: 'center'}}>{data.rating}</AppText>
                <Icon
                  type="MaterialIcons"
                  name="star"
                  color={Constants.white}
                  size={8}
                />
                </View>
                      </View>
                      <View style={{marginTop: heightPercentageToDP(1.6)}}>
                        {data.review ? <AppText size="XS" style={{lineHeight: 16}}>{t(`"${data.review}"`)}</AppText> : null}
                      </View>
                  </View>
              </View>

           );
      }
  }

  const styles = StyleSheet.create({
      mainView: {
        marginRight: widthPercentageToDP(3),
        flex: 1,
        width: widthPercentageToDP(59),
        backgroundColor: '#f9f9f9',
        borderRadius: 4,
        borderColor: '#efefef',
        borderWidth: 1,
      },
      ratingView: {
        height: heightPercentageToDP(1.6),
        paddingHorizontal: widthPercentageToDP(1.4),
        flexDirection:'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 2,
        backgroundColor: '#dda50b'
      }
  })
   
  export default withTranslation()(ReviewComponent);