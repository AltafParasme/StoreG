import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {withTranslation} from 'react-i18next';
import {View, StyleSheet, ActivityIndicator,Image,FlatList} from 'react-native';
import {GetGroupShippingData} from '../../ShippingList/redux/actions';
import {AppText} from '../../../../components/Texts';
import clWeeklyApiResp from './clWeeklyApiResp';
import {Placeholder, PlaceholderLine, Fade} from 'rn-placeholder';
import {heightPercentageToDP, widthPercentageToDP, scaledSize} from '../../../../utils';
import {Constants} from '../../../../styles';
import {Icon} from 'react-native-elements';
import moment from 'moment';
import {Images} from '../../../../../assets/images';

class CLWeekComponent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      data: [],
      isCalled: false,
      currentWeek: null,
    };
    this.getAllData = this.getAllData.bind(this);
  }

  componentDidUpdate() {
    const {week} = this.props;
    if (this.state.currentWeek !== week) {
      this.getAllData();
      this.setState({
        currentWeek: week,
      });
    }

    if(this.props.refreshChildComponent) {
      this.getAllData();
      this.props.dispatch({
        type: 'shippingList/SET_STATE',
        payload: {
          refreshChildComponent: false
        },
      });
    }
  }

  renderSeparator = () => {
    return (
      <View style={styles.targetBoxSaperator} />
    );
  }

  bonusRender = ({item, index}) => {
    const {t,groupShippingData} = this.props;
    let {clOrderSummaryTotalEarning} = groupShippingData;
    let currentSales =
    (clOrderSummaryTotalEarning && clOrderSummaryTotalEarning.currentSales) ? clOrderSummaryTotalEarning.currentSales : 0;

    let targetReched = (item.end > currentSales) && (currentSales >= item.start) ;
    return (
      <View style={[styles.targetBox,{backgroundColor: targetReched ? Constants.primaryColor : Constants.white}]}>
        <View style={styles.targetBoxUpper}>

          {
            (targetReched)
            ?
            <Image source={Images.target_on} style={styles.icon} />
            :
            <Image source={Images.target_off} style={styles.icon} />
          }
          

        </View>
        <View style={styles.targetBoxMiddle}>
        
        <View style={{width:'70%',justifyContent:'center',alignItems:'center'}}>
          <AppText bold size='XS' style={{textAlign: 'center',color: targetReched ? Constants.white : Constants.black}}>
            {t(item.type)}
          </AppText>
        </View>


      {
        (item.end>9999)
        ?
        <AppText bold size='XS' style={{color: targetReched ? Constants.white : Constants.black}}>
          {t('\u20B9'+item.start + ' +')}
        </AppText>
        :
        <AppText bold size='XS' style={{color: targetReched ? Constants.white : Constants.black}}>
          {t('\u20B9'+item.start+` - `+'\u20B9'+item.end)}
        </AppText>
      }


        
        </View>
        <View style={styles.targetBoxBottom}>
          <View style={{backgroundColor:Constants.white,flex:1,margin:widthPercentageToDP(2),borderWidth:1,borderColor:Constants.screenbackground,justifyContent:'center',alignItems:'center',flexDirection:'row'}}>
            <View style={{alignItems:'center',justifyContent:'center',flex:3.6}}>
              <AppText bold size='XXS' style={{color: targetReched ? Constants.primaryColor : Constants.black}}>
                {t(`UPTO #COMMISSIONS#%`,{COMMISSIONS:item.baseCommision})}
              </AppText>
              <AppText bold  style={{fontSize:widthPercentageToDP(2),color: targetReched ? Constants.primaryColor : Constants.black}}>
                {t(`COMMISSION`)}
              </AppText>
            </View>

            {
              (item.bonus>0)
              ?
              <View style={{alignItems:'center',justifyContent:'center',flex:0.4}}>
                <AppText bold size='XXS' style={{color: targetReched ? Constants.primaryColor : Constants.black}}>
                  {t(`+`)}
                </AppText>
              </View>
              : null
            }

            {
              (item.bonus>0)
              ?
              <View style={{alignItems:'center',justifyContent:'center',flex:2}}>
                <AppText bold size='XXS' style={{color: targetReched ? Constants.primaryColor : Constants.black}}>
                  {t(`#BONUS#%`,{BONUS:item.bonus})}
                </AppText>
                <AppText bold style={{fontSize:widthPercentageToDP(2),color: targetReched ? Constants.primaryColor : Constants.black}}>
                  {t(`BONUS`)}
                </AppText>
              </View>
              : null
            }

          </View>
        </View>
      </View>
    );
  };

  getAllData = () => {
    const {week} = this.props;
    let year = new Date().getFullYear();
    let start = week && week.split('-')[0];
      let month = start && start.split(' ')[0];
      let end = week && week.split('-')[1];
      if (end && end.length > 3) {
        month = end.split(' ')[0];
        end = end.split(' ')[1];
      }
      end = moment(`${end}-${month}-${year}`).format('DD-MMM-YYYY');

      this.props.getGroupShippingData(
        moment(`${start}-${year}`).format('DD-MMM-YYYY'),
        end,
      );
  }

  render() {
    const {groupShippingData, clConfig, t, week, clWeeklyLoading,clEarningDetail} = this.props;
    let {clOrderSummaryTotalEarning} = groupShippingData;
    let currentSales =
      clOrderSummaryTotalEarning && clOrderSummaryTotalEarning.currentSales;

    let commission = clConfig && clConfig.clType === 'DEMAND' ? '4%' : '8%';
    let leftVal =
      clOrderSummaryTotalEarning &&
      clOrderSummaryTotalEarning.monthlyTargetValue - currentSales;
    
    let bonusInfo =
      clOrderSummaryTotalEarning &&
      clOrderSummaryTotalEarning.monthlyTargetValue >= 10000
        ? `(For 8% Bonus)`
        : clOrderSummaryTotalEarning &&
          clOrderSummaryTotalEarning.monthlyTargetValue >= 5000
        ? `(For 5% Bonus)`
        : null;

    if (clWeeklyLoading) {
      return (
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            marginHorizontal: heightPercentageToDP(4),
            marginTop: heightPercentageToDP(3),
          }}>
          <Placeholder Animation={Fade}>
            <View>
              <PlaceholderLine
                height={heightPercentageToDP(1.4)}
                width={widthPercentageToDP(16)}
              />

              <PlaceholderLine
                height={heightPercentageToDP(1.4)}
                width={widthPercentageToDP(22)}
              />

              <PlaceholderLine
                height={heightPercentageToDP(1.4)}
                width={widthPercentageToDP(16)}
              />
            </View>
          </Placeholder>
        </View>
      );
    }

    if (clOrderSummaryTotalEarning && clConfig) {
        return (
          <View>
            <View style={styles.headerStyle}>
              <AppText size='XS' black>
                {t(`Targets & earnings shown below are for ${week}`)}
              </AppText>
            </View>

            
            <FlatList
              horizontal
              data={(clEarningDetail && clEarningDetail.earningSchemes.bonusEarningScheme && clEarningDetail.earningSchemes.bonusEarningScheme.length) ? clEarningDetail.earningSchemes.bonusEarningScheme : []}
              renderItem={this.bonusRender}
              ItemSeparatorComponent={this.renderSeparator}
            />

            { leftVal > 0 ? (
            <View style={styles.topViewNotReachedTarget}>
              <View style={{marginLeft: widthPercentageToDP(2)}}>
                <AppText size="M" bold>
                  ₹ {clOrderSummaryTotalEarning.monthlyTargetValue}
                </AppText>
                <View style={{width: widthPercentageToDP(24)}}>
                  <AppText size="XS">
                    {t(`Target Sales `)}
                    <AppText greenishBlue>{t(bonusInfo)}</AppText>
                  </AppText>
                </View>
              </View>
              <View style={styles.lineView} />
              <View style={{marginLeft: widthPercentageToDP(2)}}>
                <AppText size="M" bold>
                  ₹ {currentSales}
                </AppText>
                {bonusInfo ? (
                  <View style={{width: widthPercentageToDP(22)}}>
                    <AppText size="XS">{t(`Current Sales ${week}`)}</AppText>
                  </View>
                ) : null}
              </View>
              <View style={styles.equalToView} />
              <View style={{marginLeft: widthPercentageToDP(2)}}>
                <AppText size="M" bold>
                  ₹ {leftVal}
                </AppText>
                <View style={{width: widthPercentageToDP(22)}}>
                  <AppText size="XS">
                    {t(`Amount left to reach target`)}
                  </AppText>
                </View>
              </View>
            </View>)
          : (
            <View style={styles.midView}>
              <AppText size="M" bold>
                ₹ {currentSales}
              </AppText>
              <View>
                <AppText size="XS" style={{textAlign: 'center'}}>
                  {t(`Current Sales`)}
                </AppText>
                <AppText
                  size="XS"
                  style={{textAlign: 'center', color: Constants.primaryColor}}>
                  {t(`(For 8% Bonus)`)}
                </AppText>
              </View>
            </View>)}
          </View>
        );
    } else {
      return <View />;
    }
  }
}

const styles = StyleSheet.create({
  icon: {
    height: widthPercentageToDP(6),
    width: widthPercentageToDP(6),
    resizeMode: 'contain',
    marginLeft: widthPercentageToDP(0.5)
  },
  targetBox:{
    height:heightPercentageToDP(21),
    width:widthPercentageToDP(33),
    borderTopWidth:1,
    borderBottomWidth:1,
    borderColor:Constants.screenbackground
  },
  targetBoxSaperator:{
    height:heightPercentageToDP(21),
    width:1,
    backgroundColor:Constants.screenbackground
  },
  targetBoxUpper:{
    flex:1.5,
    alignItems:'center',
    marginTop:widthPercentageToDP(2)
  },
  targetBoxMiddle:{
    flex:3,
    justifyContent:'center',
    alignItems:'center',
    paddingVertical:widthPercentageToDP(2)
  },
  targetBoxBottom:{
    flex:2.5,
  },
  headerStyle:{
    height:heightPercentageToDP(6),
    backgroundColor:Constants.screenbackground,
    alignItems:'center',
    justifyContent:'center'
  },
  topViewNotReachedTarget: {
    margin: heightPercentageToDP(2),
    flexDirection: 'row',
    marginVertical: heightPercentageToDP(1.5),
  },
  topMostView: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    borderBottomWidth: 0.6, 
    marginVertical: heightPercentageToDP(0.4),
    borderBottomColor: '#d6d6d6'
  },
  straightLineView: {
    borderWidth: 0.5,
    borderColor: '#d6d6d6',
    bottom: heightPercentageToDP(6.8),
    left: widthPercentageToDP(24),
    position: 'absolute',
    width: widthPercentageToDP(52)
  },
  topTextView: {
    width: widthPercentageToDP(40), 
    alignItems: 'center', 
    marginTop: heightPercentageToDP(1)
  },
  topViewReachedTarget: {
    alignItems: 'center',
    backgroundColor: '#f2fffe',
    padding: heightPercentageToDP(1),
  },
  lineView: {
    width: widthPercentageToDP(4),
    height: heightPercentageToDP(0.5),
    backgroundColor: Constants.orange,
    top: heightPercentageToDP(3.5),
    marginHorizontal: widthPercentageToDP(2.5),
  },
  circleView: {
    width: scaledSize(17),
    height: scaledSize(17),
    borderRadius: 17 / 2,
    borderWidth: 1,
    elevation: 5,
    marginHorizontal: widthPercentageToDP(2),
    borderColor: Constants.white,
  },
  equalToView: {
    width: widthPercentageToDP(4),
    height: heightPercentageToDP(1.6),
    borderBottomWidth: 2.5,
    borderTopWidth: 2.5,
    borderColor: Constants.orange,
    top: heightPercentageToDP(3),
    marginHorizontal: widthPercentageToDP(2.3),
  },
  midView: {
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: heightPercentageToDP(2),
  },
});

const mapStateToProps = state => ({
  groupShippingData: state.ShippingList.groupShippingData,
  clWeeklyLoading: state.ShippingList.clWeeklyLoading,
  refreshChildComponent: state.ShippingList.refreshChildComponent,
  clConfig: state.clOnboarding.clConfig,
  clEarningDetail:state.ShippingList.clEarningDetail,
});

const mapDispatchToProps = dispatch => ({
  dispatch,
  getGroupShippingData: (startDate, endDate) => {
    dispatch(GetGroupShippingData(startDate, endDate));
  },
});
export default withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(CLWeekComponent),
);
