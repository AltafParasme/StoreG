import * as React from 'react';
import { Component } from 'react';
import { View, StyleSheet} from 'react-native';
import {AppText} from '../../../components/Texts';
import { heightPercentageToDP, widthPercentageToDP, scaledSize} from '../../../utils';
import { Constants } from '../../../styles';
import {Icon} from 'react-native-elements';
import { FlatList } from 'react-native-gesture-handler';

export default class ShipmentEarnings extends Component {

    renderItemOffers = (item, index) => {
        const {t} = this.props;
        let colors = ['#3da78b', '#e57373', '#f3b796', '#6b1a63', '#ec3d5a'];
        let labelText = item.earningCategory === 'delivery' ? 'DELIVERY' : 'DEMAND';
        let commissionPercent = item.earningCategory === 'delivery' ? item.delivery : item.demand;
        let commissionVal = item.earningCategory === 'delivery' ?  item.deliveryCommision : item.demandCommision;
        return (
            <View style={styles.renderItemMainView}>
                <View style={[styles.renderItemSecondView, {backgroundColor: colors[index % colors.length]}]}>
                <View style={styles.labelView}>
                <AppText style={{fontSize: 8, color: '#e57373'}}>{labelText}</AppText>
                </View>
                    <View style={{alignItems: 'center'}}>
                    <AppText white>₹ {commissionVal}</AppText>
                    <AppText size='XS' white bold style={{textAlign: 'center', paddingTop: heightPercentageToDP(1)}}>{(item && item.name) ? item.name.toUpperCase() : ''}</AppText>
                    </View>
                    
                </View>
                <View style={{ alignItems: 'center', marginTop: heightPercentageToDP(2)}}>
                    <AppText size='XS' bold style={{textAlign: 'center'}}>₹ {item.totalPrice || item.shipmentTotalPrice || 0}</AppText>
                    <View style={styles.renderItemFirstContent}>
                    <AppText size='XS' style={{textAlign: 'center'}}>{t('Total Order Value')}</AppText>
                        </View>
                </View>
                <View style={styles.renderItemSecondContent}>
                    <View style={{paddingLeft: widthPercentageToDP(4)}}>
                    <AppText size='XS' bold style={{textAlign: 'center'}}>{commissionPercent || 0} %</AppText>
                    <View style={styles.subViews}>
                    <AppText size='XS' style={{textAlign: 'center'}}>{t('Base Commission')}</AppText>
                        </View>
                    </View>
                    <View style={{paddingRight: widthPercentageToDP(6)}}>
                    <AppText size='XS' bold style={{textAlign: 'center'}}>{item.items}</AppText>
                    <View style={styles.subViews}>
                    <AppText size='XS' style={{textAlign: 'center'}}>{t('No. of Items')}</AppText>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    render() {
        const {t, data,earningList} = this.props;
        let shipmentClType = (data && data.shipmentClType) ? data.shipmentClType.toUpperCase().split('+') : [];
        let earningsVal = (data && data.totalEarning) ? data.totalEarning : '';
        let dataList = (data && data.earningCategories) ? data.earningCategories : (earningList) ? earningList : [];
        if(earningList){
            return (
                <View style={styles.earningStyling}>
                    <FlatList
                        horizontal
                        ItemSeparatorComponent={() => {
                            return (
                            <Icon
                            type="feather"
                            name="plus"
                            iconStyle={{fontWeight: 'bold'}}
                            containerStyle={{
                            top: widthPercentageToDP(7),
                            }}
                            size={22}
                        />
                        )}}
                        showsHorizontalScrollIndicator={false}
                        data={dataList}
                        extraData={this.state}
                        renderItem={({item, index}) => this.renderItemOffers(item, index)}
                        />
                </View>
            )         
        }
        return (
            <View style={{marginVertical: heightPercentageToDP(2)}}>
            <View style={{marginTop: heightPercentageToDP(2), alignItems: 'center'}}>
                <AppText bold size='M'>{t('Earnings  ')}
                    <AppText greenishBlue>₹{earningsVal}</AppText>
                </AppText>
                <AppText size='XS' style={{lineHeight: 16, paddingTop: heightPercentageToDP(0.4)}}>{t(`Base Commission #shipmentClType#`, {
                    shipmentClType: data.shipmentClType ? `(${data.shipmentClType})` : null
                })}</AppText>
                </View>
                <View style={{
                    backgroundColor: Constants.white, 
                    marginTop: heightPercentageToDP(2),
                    paddingVertical: heightPercentageToDP(2)
                    }}
                    >
                    <View style={{alignItems: 'center', marginLeft: widthPercentageToDP(2),}}>
                        <FlatList
                        horizontal
                        ItemSeparatorComponent={() => {
                            return (
                            <Icon
                            type="feather"
                            name="plus"
                            iconStyle={{fontWeight: 'bold'}}
                            containerStyle={{
                              top: widthPercentageToDP(7),
                            }}
                            size={22}
                          />
                        )}}
                        showsHorizontalScrollIndicator={false}
                        data={dataList}
                        extraData={this.state}
                        renderItem={({item, index}) => this.renderItemOffers(item, index)}
                        />
                    </View>

                        <View style={{marginTop: heightPercentageToDP(2)}}>
                        {
                            shipmentClType.map(type => {
                                    return (
                                        <View style={{flexDirection: 'row', marginBottom: heightPercentageToDP(1)}}>
                                            <View
                                                style={{
                                                    
                                                }}
                                            />
                                            <View style={{marginLeft: widthPercentageToDP(2), flexDirection: 'row'}}>
                                            <AppText bold size='XS' style={{lineHeight: 16}}>{t(`#TYPE#: `, {TYPE: type})}</AppText>
                                            {type === 'DEMAND' ? (
                                            <AppText size='XS' style={{lineHeight: 16}}>{t(` Category wise % commissions on `)}<AppText bold style={{color: '#ec3d5a'}}>{t('orders you get.')}</AppText></AppText>)
                                            : type === 'DELIVERY' ? (
                                                <AppText size='XS' style={{lineHeight: 16}}>{t(` Flat % commissions on `)}<AppText bold style={{color: '#ec3d5a'}}>{t('orders you deliver.')}</AppText></AppText>
                                            )
                                            : null
                                            }
                                            </View>
                                            </View>
                                    )
                            })
                        }
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    renderItemMainView: {
        borderWidth: 0.5,
        height: heightPercentageToDP(31), 
        width: widthPercentageToDP(60),
        borderRadius: 6,
        borderColor: '#d6d6d6',
        paddingBottom: heightPercentageToDP(1.6),
        marginHorizontal: widthPercentageToDP(2),
    },
    dotCircle: {
        backgroundColor: Constants.black,
        height: scaledSize(6),
        width: scaledSize(6),
        borderRadius: 8 / 2,
        marginTop: heightPercentageToDP(0.5),
        marginLeft: widthPercentageToDP(4)
    },
    renderItemSecondView: {
        height: heightPercentageToDP(11),
        borderTopLeftRadius: 6,
        borderTopRightRadius: 6,
        //alignItems: 'center',
        paddingVertical: heightPercentageToDP(1.4)
    },
    renderItemFirstContent: {
        height: heightPercentageToDP(5), 
        width: widthPercentageToDP(20),
        marginTop: heightPercentageToDP(1)
    },
    renderItemSecondContent: {
        alignItems: 'center', 
        marginTop: heightPercentageToDP(1),
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    labelView: {
        backgroundColor: Constants.black, 
        marginLeft: widthPercentageToDP(2),
        borderRadius: 4,
        width: widthPercentageToDP(13),
        alignItems: 'center',
        padding: heightPercentageToDP(0.4)
    },
    subViews: {
        height: heightPercentageToDP(5), 
        width: widthPercentageToDP(20),
        marginTop: heightPercentageToDP(1)
    },
    earningStyling:{
        marginLeft: widthPercentageToDP(2),                    
        backgroundColor: Constants.white, 
    }
})