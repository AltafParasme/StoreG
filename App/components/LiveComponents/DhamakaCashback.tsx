import React, { Component } from 'react';
import { View , StyleSheet, TouchableOpacity, ImageBackground, Image, ActivityIndicator} from 'react-native';
import idx from 'idx';
import {withTranslation} from 'react-i18next';
import {connect} from 'react-redux';
import { Button } from 'react-native-elements';
import moment from 'moment';
import {
    scaledSize,
    heightPercentageToDP,
    widthPercentageToDP,
  } from '../../utils';
  import {
    changeField,
    getDhamakaCashback
  } from '../../native/pages/CLOnboarding/actions';
import {AppText} from '../Texts';
import {Constants} from '../../styles';
import NavigationService from '../../utils/NavigationService';
import { Images } from '../../../assets/images';

class DhamakaCashback extends Component {
  
    componentDidMount() {
        this.props.getDhamakaCashback(false, true);
    }

    onPress = () => {
        NavigationService.navigate('MegaSale')
    }
   
    render() { 
        const { 
            itemData,
            dhamakaCashbackDetails,
            t
        } = this.props;

        const offerTotalOrderLimit = idx(dhamakaCashbackDetails, _ => _.userDetails.offerDetails.OFFER_TOTAL_ORDER_LIMIT);
        const offerCashbackPercent = idx(dhamakaCashbackDetails, _ => _.userDetails.offerDetails.OFFER_CASHBACK_PERCENT);
        const offerCashbackMax = idx(dhamakaCashbackDetails, _ => _.userDetails.offerDetails.OFFER_CASHBACK_MAX);
        const offerStartDate = idx(dhamakaCashbackDetails, _ => _.userDetails.offerDetails.OFFER_START_DATE);
        const offerEndDate = idx(dhamakaCashbackDetails, _ => _.userDetails.offerDetails.OFFER_END_DATE);
        const formattedEndDate = moment(offerEndDate, 'YYYY-MM-DDTHH:mm:ss.SSS[Z]').format('Do');
        const formattedEnDateMonth = moment(offerEndDate, 'YYYY-MM-DDTHH:mm:ss.SSS[Z]').format('MMM');
        const orderValue = idx(dhamakaCashbackDetails, _ => _.userDetails.orderValue);
        const imageBackground = (orderValue >= offerTotalOrderLimit) ? itemData.backgroundImageGotCashback : itemData.backgroundImage;
        const termsText = itemData.termsText;
        let orderRemainingValue = offerTotalOrderLimit - orderValue;
        if(orderRemainingValue < 0){
            orderRemainingValue = 0;
        }
        if(!dhamakaCashbackDetails) {
            return (
                <ActivityIndicator
                    color="black"
                    size="large"
                />
            )
        }
        return ( 
            <TouchableOpacity style={styles.container} onPress={this.onPress}>
            <ImageBackground 
                source={{uri:imageBackground}}
                style={{flex:1}}>
            <View style={styles.textBox}>
                <AppText white bold size="L">{t(`Buy for ₹#OFFERTOTALORDERLIMIT# &`, { OFFERTOTALORDERLIMIT : offerTotalOrderLimit})}</AppText> 
                <AppText white bold size="L">{t(`Get ₹#OFFERCASHBACKMAX# Cashback`, { OFFERCASHBACKMAX: offerCashbackMax})}</AppText>
                <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', marginVertical: heightPercentageToDP(2)}}>
                       <View style={styles.center}>
                          <AppText white bold>{`Already Ordered - `}<AppText style={{ color: '#ffcc00'}}>{`${orderValue}`}</AppText></AppText> 
                          <AppText white bold>{t(`Need to buy till #FORMATTEDENDDATE# #FORMATTEDENDDATEMONTH# - `, {FORMATTEDENDDATE: formattedEndDate,FORMATTEDENDDATEMONTH:formattedEnDateMonth})}<AppText style={{ color: '#ffcc00'}}>{t(`#ORDERREMAININGVALUE#`, { ORDERREMAININGVALUE: orderRemainingValue})}</AppText></AppText> 
                        </View> 
                </View>
            </View>
                <View style={styles.center}>
                    <View style={styles.cashbackBtn}>
                        <AppText bold greenishBlue>{t(`Cashback Details`)}</AppText>
                    </View>
                    <AppText white size="S" style={styles.termsText}>{t(`#TEXT##NL#`, {TEXT: termsText, NL: '\n', FORMATTEDENDDATE: formattedEndDate,FORMATTEDENDDATEMONTH:formattedEnDateMonth, OFFERTOTALORDERLIMIT : offerTotalOrderLimit})}</AppText>
                </View>
            </ImageBackground>
            </TouchableOpacity>
         );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        flex:1,
        height: heightPercentageToDP(42)
    },
    textBox: {
        marginTop: heightPercentageToDP(14),
        alignItems: 'center',
        justifyContent: 'center',
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
    titleBox: {
        paddingVertical: heightPercentageToDP(2),
    },
    cashbackBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        width: widthPercentageToDP(40),
        padding: widthPercentageToDP(2),
        backgroundColor: Constants.white   
    },
    termsText: {
        textAlign: 'center', 
        marginTop: heightPercentageToDP(0.5)
    }
})

const mapStateToProps = state => ({
    dhamakaCashbackDetails: state.clOnboarding.dhamakaCashbackDetails,
  });
  
  const mapDispatchToProps = dispatch => ({
    dispatch,
    getDhamakaCashback: (tnc, clUsers) => {
      dispatch(getDhamakaCashback(tnc, clUsers));
    },
    // ChangeField: (key, value) => {
    //   dispatch(changeField(key, value));
    // },
  });
  
  export default withTranslation()(
    connect(mapStateToProps, mapDispatchToProps)(DhamakaCashback)
  );