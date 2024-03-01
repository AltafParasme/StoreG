import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import {AppText} from '../../../../components/Texts';
import {Constants} from '../../../../styles';
import {Icon} from 'react-native-elements';
import {listItemsCLBonus} from '../../../../Constants';
import {
  widthPercentageToDP,
  heightPercentageToDP,
  scaledSize,
} from '../../../../utils';
import {FlatList} from 'react-native-gesture-handler';
import {connect} from 'react-redux';
import {withTranslation} from 'react-i18next';

class CLBonusDetails extends Component {
  render() {
    const {clConfig, t} = this.props;
    const isCLDemand = clConfig && clConfig.clType === 'DEMAND';

    return (
      <View style={{alignItems: 'center'}}>
        <View
          style={{
            width: widthPercentageToDP(94),
          }}>
          <FlatList
            data={listItemsCLBonus}
            listKey={(item, index) => index.toString()}
            renderItem={({item, index}) => {
              item.titleSecond = isCLDemand ? '4% ' : item.titleSecond;
              return (
                <View
                  style={[styles.bonusInfoView, {backgroundColor: item.color}]}>
                  <View style={{width: widthPercentageToDP(64)}}>
                    <AppText white style={{fontStyle: 'italic'}}>
                      {t(item.titleFirst)}
                      <AppText bold size="L">
                        {t(item.titleSecond)}
                      </AppText>
                      <AppText>{t(item.titleThird)}</AppText>
                      {item.titleFourth ? (
                        <AppText bold size="L">
                          {t(item.titleFourth)}
                        </AppText>
                      ) : null}
                      {item.titleFifth ? (
                        <AppText>{t(item.titleFifth)}</AppText>
                      ) : null}
                    </AppText>
                    <View
                      style={{
                        marginTop: heightPercentageToDP(2),
                      }}>
                      {item.content.map((contentData, itr) => {
                        return (
                          <View
                            key={itr}
                            style={[
                              {
                                flexDirection: 'row',
                                width: widthPercentageToDP(75),
                              },
                              itr !== 0
                                ? {marginTop: heightPercentageToDP(1)}
                                : {},
                            ]}>
                            <View
                              style={[
                                styles.circleView,
                                {
                                  backgroundColor: item.color,
                                },
                              ]}>
                              <Icon
                                name="done"
                                type="material"
                                color={Constants.white}
                                size={widthPercentageToDP(4)}
                                containerStyle={{
                                  alignSelf: 'center',
                                  top: heightPercentageToDP(0.5),
                                }}
                              />
                            </View>
                            <AppText white style={{textAlign: 'center'}}>
                              {t(contentData.first)}
                              <AppText bold>{t(contentData.second)}</AppText>
                            </AppText>
                          </View>
                        );
                      })}
                    </View>
                  </View>
                  <View style={styles.targetBox}>
                    <AppText size="XXS" white>
                      {t(`TARGET ${index + 1}`)}
                    </AppText>
                  </View>
                </View>
              );
            }}
            ListFooterComponent={() => {
              return (
                <View
                style={{
                  width: widthPercentageToDP(100),
                  //backgroundColor: Constants.red,
                  padding: scaledSize(3),
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <AppText size="S" bold black style={{textAlign: 'center'}}>
                  {t(
                    'Bonus and commision payment will happen #NL#on Delivered Orders',
                    {NL: '\n'},
                  )}
                </AppText>
              </View>
              )
            }}
          />
        </View>

        <View
          style={{
            marginTop: heightPercentageToDP(2),
            marginHorizontal: widthPercentageToDP(2),
          }}>
          <View style={{height: heightPercentageToDP(4.5)}}>
            <AppText bold style={{marginLeft: widthPercentageToDP(2)}}>
              {t('Base Commission Structure')}
            </AppText>
          </View>

          <View
            style={{
              borderRadius: 5,
              width: widthPercentageToDP(94),
              borderWidth: 1,
              borderColor: '#d6d6d6',
              paddingHorizontal: widthPercentageToDP(5),
              paddingBottom: heightPercentageToDP(2),
            }}>
            <View style={styles.commissionTableViewHeader}>
              <View
                style={{
                  width: widthPercentageToDP(25),
                }}>
                <AppText size="XS">{t('Category')}</AppText>
              </View>
              <View>
                <AppText size="XS">{t('Commission')}</AppText>
              </View>
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View
                style={{
                  width: widthPercentageToDP(25),
                }}>
                <AppText size="XS">{t('Kitchen')}</AppText>
              </View>
              {isCLDemand ? (
                <View>
                  <AppText size="XS" style={{textAlign: 'center'}}>
                    16%
                  </AppText>
                </View>
              ) : (
                <AppText size="XS">20%</AppText>
              )}
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View style={{width: widthPercentageToDP(25)}}>
                <AppText size="XS">{t('Accessories')}</AppText>
              </View>
              {isCLDemand ? (
                <AppText size="XS" style={{textAlign: 'center'}}>
                  16%
                </AppText>
              ) : (
                <AppText size="XS">20%</AppText>
              )}
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View style={{width: widthPercentageToDP(25)}}>
                <AppText size="XS">{t('Home')}</AppText>
              </View>
              {isCLDemand ? (
                <AppText size="XS" style={{textAlign: 'center'}}>
                  16%
                </AppText>
              ) : (
                <AppText size="XS">20%</AppText>
              )}
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View style={{width: widthPercentageToDP(25)}}>
                <AppText size="XS">{t('Fresh')}</AppText>
              </View>
              {isCLDemand ? (
                <AppText size="XS" style={{textAlign: 'center'}}>
                  4%
                </AppText>
              ) : (
                <AppText size="XS">8%</AppText>
              )}
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View style={{width: widthPercentageToDP(25)}}>
                <AppText size="XS">{t('Grocery')}</AppText>
              </View>
              {isCLDemand ? (
                <AppText size="XS" style={{textAlign: 'center'}}>
                  4%
                </AppText>
              ) : (
                <AppText size="XS">8%</AppText>
              )}
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  circleView: {
    width: scaledSize(23),
    height: scaledSize(23),
    borderRadius: 23 / 2,
    borderWidth: 1,
    marginHorizontal: widthPercentageToDP(2),
    borderColor: Constants.white,
  },
  bonusInfoView: {
    flexDirection: 'row',
    borderRadius: 6,
    marginTop: heightPercentageToDP(1),
    padding: heightPercentageToDP(2),
    justifyContent: 'space-between',
    width: widthPercentageToDP(94),
  },
  commissionTableViewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: heightPercentageToDP(2),
    paddingTop: heightPercentageToDP(1.7),
  },
  commisionTableView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#d6d6d6',
    paddingTop: heightPercentageToDP(1.4),
  },
  targetBox: {
    width: widthPercentageToDP(20),
    height: heightPercentageToDP(3),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 3,
    borderColor: Constants.white,
  },
  bottomView: {
    marginTop: heightPercentageToDP(3),
    width: widthPercentageToDP(94),
    marginHorizontal: widthPercentageToDP(2),
  },
  dotView: {
    width: scaledSize(5),
    height: scaledSize(5),
    borderRadius: 5 / 2,
    borderWidth: 1,
    marginTop: widthPercentageToDP(2),
    marginRight: widthPercentageToDP(2),
    backgroundColor: Constants.black,
  },
});

const mapStateToProps = state => ({
  clConfig: state.clOnboarding.clConfig,
});

export default withTranslation()(connect(mapStateToProps)(CLBonusDetails));
