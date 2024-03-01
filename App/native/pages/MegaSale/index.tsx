import * as React from 'react';
import { PureComponent } from 'react';
import {StyleSheet, Image, View, ImageBackground, TouchableOpacity, ScrollView} from 'react-native';
import {connect} from 'react-redux';
import idx from 'idx';
import { Icon } from 'react-native-elements'
import Icons from 'react-native-vector-icons/MaterialIcons';
import Markdown from 'react-native-simple-markdown';
import {withTranslation} from 'react-i18next';
import RNFetchBlob from 'rn-fetch-blob';
import Share from 'react-native-share';
import moment from 'moment';
import NavigationService from '../../../utils/NavigationService';
import {AppText} from '../../../components/Texts';
import {Header} from '../../../components/Header/Header';
import { widthPercentageToDP, heightPercentageToDP, scaledSize } from '../../../utils';
import {liveAnalytics} from '../ShopgLive/redux/actions';
import {getDhamakaCashback} from '../CLOnboarding/actions';
import { Images } from '../../../../assets/images';
import { Constants } from '../../../styles';
import { buildDeepLink, shareDhamakaSalesinGroup} from '../../pages/utils';
import { LogFBEvent, Events } from '../../../Events';

class MegaSale extends PureComponent {
    constructor (props) {
        super(props);
        this.onShare = this.onShare.bind(this);
    }
    componentDidMount = () => {
        //this.props.getDhamakaCashback(true, true);
    }

    handleBackButtonClick() {
        NavigationService.goBack();
        return true;
    }

    onShare = async () => {
            const {t, dhamakaCashbackDetails, groupSummary} = this.props;
            shareDhamakaSalesinGroup(
                'MegaSale', 
                'DhamakaCashback',
                t,
                null,
                groupSummary,
                dhamakaCashbackDetails,
                this.props.login.userPreferences,
                null,
                null,
                null
                );
    };

   render() {
        
        const { 
            dhamakaCashbackDetails,
            t
        } = this.props;
        const offerTotalOrderLimit = idx(dhamakaCashbackDetails, _ => _.userDetails.offerDetails.OFFER_TOTAL_ORDER_LIMIT);
        const offerCashbackPercent = idx(dhamakaCashbackDetails, _ => _.userDetails.offerDetails.OFFER_CASHBACK_PERCENT);
        const offerCashbackMax = idx(dhamakaCashbackDetails, _ => _.userDetails.offerDetails.OFFER_CASHBACK_MAX);
        const orderValue = idx(dhamakaCashbackDetails, _ => _.userDetails.orderValue);
        const offerEndDate = idx(dhamakaCashbackDetails, _ => _.userDetails.offerDetails.OFFER_END_DATE);
        const formattedEndDate = moment(offerEndDate, 'YYYY-MM-DDTHH:mm:ss.SSS[Z]').format('Do');
        const formattedEnDateMonth = moment(offerEndDate, 'YYYY-MM-DDTHH:mm:ss.SSS[Z]').format('MMM');
        const eligibleForCashback = idx(dhamakaCashbackDetails, _ => _.tnc.ELIGIBLE_FOR_CASHBACK);
        const notEligibleForCashback = idx(dhamakaCashbackDetails, _ => _.tnc.NOT_ELIGIBLE_FOR_CASHBACK);
        const eligibleForCashbackRules = idx(dhamakaCashbackDetails, _ => _.tnc.ELIGIBLE_FOR_CASHBACK.rules) || [];
        const notEligibleForCashbackRules = idx(dhamakaCashbackDetails, _ => _.tnc.NOT_ELIGIBLE_FOR_CASHBACK.rules) || [];

        let orderRemainingValue = offerTotalOrderLimit - orderValue;
        if(orderRemainingValue < 0){
            orderRemainingValue = 0;
        }
        return(
            <ScrollView style={styles.scrollView} >
            <ImageBackground style={styles.container}>
            <View style={{ flexDirection: 'row', marginTop: heightPercentageToDP(2)}}>
             <View style={styles.headerLeft}>
                <TouchableOpacity onPress={this.handleBackButtonClick}>
                <Icons
                    name={'arrow-back'}
                    size={28}
                    color="#fff"
                    style={{marginLeft: '3%', top: '3%'}}
                />
                </TouchableOpacity>
            </View>
            <View style={{ flex: 0.5, alignItems: 'flex-end', }}>
              <TouchableOpacity style={{ marginRight: widthPercentageToDP(2), flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}} onPress={this.onShare}>
             <AppText white size="S">{t(`Share  `)}</AppText>   
            <View style={styles.whatsappCircle}>
                  <Icon
                    type="font-awesome"
                    name="whatsapp"
                    color={Constants.white}
                    size={widthPercentageToDP(6)}
                    containerStyle={{
                      alignSelf: 'center',
                    }}
                  />
                </View>
                </TouchableOpacity>  
            </View>
            </View>
            <View style={styles.center}>
                <Image source={{ uri: `http://cdn.shopg.in/shopg_live/${formattedEnDateMonth}/flat-30-cb.png`}} style={styles.imageStyle} />
                <AppText white bold size="L">{t(`Buy for ₹#OFFERTOTALORDERLIMIT# &`, { OFFERTOTALORDERLIMIT : offerTotalOrderLimit})}</AppText> 
                <AppText white bold size="L">{t(`Get ₹#OFFERCASHBACKMAX# Cashback`, { OFFERCASHBACKMAX: offerCashbackMax})}</AppText>
                <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', marginVertical: heightPercentageToDP(2)}}>
                        <View style={styles.center}>
                          <AppText white bold>{`Already Ordered - `}<AppText style={{ color: '#ffcc00'}}>{`${orderValue}`}</AppText></AppText> 
                          <AppText white bold>{t(`Need to buy till #FORMATTEDENDDATE# #FORMATTEDENDDATEMONTH# - `, {FORMATTEDENDDATE: formattedEndDate,FORMATTEDENDDATEMONTH:formattedEnDateMonth})}<AppText style={{ color: '#ffcc00'}}>{t(`#ORDERREMAININGVALUE#`, { ORDERREMAININGVALUE: orderRemainingValue})}</AppText></AppText> 
                        </View> 
                </View>

            </View>

            <View style={styles.eligibleBox}>
                <View style={styles.titleBox}>
                    <AppText bold black size="S">{eligibleForCashback && eligibleForCashback.text}</AppText>
                </View>
                <View>
                    {
                        eligibleForCashbackRules.map((item) => {
                            return (
                                <View style={styles.row}>
                                    {/* <Image source={Images.confirm} style={styles.iconStyle} /> */}
                                    <Icon
                                        type="antdesign"
                                        name="checkcircle"
                                        color={Constants.primaryColor}
                                        size={widthPercentageToDP(6)}
                                            containerStyle={{
                                            alignSelf: 'center',
                                            marginRight: widthPercentageToDP(2)
                                        }}
                                    />
                                    <View style={{ width: widthPercentageToDP(80)}}>
                                        <Markdown>{item}</Markdown>
                                    </View>
                                </View>
                            )
                        })
                    }
                </View>
            </View>
            <View style={styles.notEligibleBox}>
                 <View style={styles.titleBox}>
                    <AppText bold black size="S">{notEligibleForCashback && notEligibleForCashback.text}</AppText>
                </View>
                <View>
                    {
                        notEligibleForCashbackRules.map((item) => {
                            return (
                                <View style={styles.row}>
                                    <Icon
                                        type="entypo"
                                        name="circle-with-cross"
                                        color={Constants.red}
                                        size={widthPercentageToDP(6)}
                                            containerStyle={{
                                            alignSelf: 'center',
                                            marginRight: widthPercentageToDP(2)
                                        }}
                                    />
                                    <View style={{ width: widthPercentageToDP(80)}}>
                                        <Markdown style={{ width: widthPercentageToDP(80)}}>{item}</Markdown>
                                    </View>
                                </View>
                            )
                        })
                    }
                </View>
            </View>
            </ImageBackground>
             </ScrollView>
        );
   }
}

const styles = StyleSheet.create({
    scrollView: {
        maxHeight: heightPercentageToDP(100), 
        backgroundColor: '#2F108B'
    },
    container: {
        flexDirection: 'column',
        flex:1,
    },
    headerLeft: {
        flex: 0.5,
        marginLeft: widthPercentageToDP(1),
        flexDirection: 'row',
        alignItems: 'center',
        height: '100%',
    },
    center: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    imageStyle: {
        height: heightPercentageToDP(14),
        width: widthPercentageToDP(65),
        resizeMode: 'contain'
    },
    iconStyle: {
        marginTop: heightPercentageToDP(0.5),
        height: 15, width: 15,
        resizeMode: 'contain'
    },
    leftBox: {
        flex: 0.48,   
        borderRightColor: Constants.white, 
        borderRightWidth: widthPercentageToDP(0.2),
        justifyContent: 'center',
        alignItems: 'center'
    },
    line: {
        flex: 0.04,
        height: 7,
        borderLeftColor: Constants.white,
        borderLeftWidth: widthPercentageToDP(0.2),
        borderRightColor: Constants.white,
        borderRightWidth: widthPercentageToDP(0.2)
    },
    rightBox: {
        flex: 0.48,
        justifyContent: 'center',
        alignItems: 'center'
    },
    eligibleBox: {
        margin: heightPercentageToDP(2),
        paddingHorizontal: widthPercentageToDP(2),
        backgroundColor: Constants.white,
        borderColor: Constants.white, 
        borderWidth: widthPercentageToDP(0.2),
        borderRadius: 4
    },
    notEligibleBox: {
        margin: heightPercentageToDP(2),
        paddingHorizontal: widthPercentageToDP(2),
        backgroundColor: Constants.white,
        borderColor: Constants.white, 
        borderWidth: widthPercentageToDP(0.2),
        borderRadius: 4
    },
    titleBox: {
        paddingVertical: heightPercentageToDP(2),
    },
    row: {
        flexDirection: 'row',
        marginVertical: heightPercentageToDP(0.5)
    },
    whatsappCircle: {
        backgroundColor: '#1ad741',
        alignItems: 'center',
        justifyContent: 'center',
        width: scaledSize(37),
        height: scaledSize(37),
        borderRadius: 37 / 2,
      },
  });

const mapStateToProps = state => {
    return {
      login: state.login,
      groupSummary: state.groupSummary,
      dhamakaCashbackDetails: state.clOnboarding.dhamakaCashbackDetails,
    }}

const mapDispatchToProps = dispatch => ({
    getDhamakaCashback: (tnc, clUsers) => {
        dispatch(getDhamakaCashback(tnc, clUsers));
    },
})
export  default withTranslation()(connect(
    mapStateToProps,
    mapDispatchToProps
    )(MegaSale));
      