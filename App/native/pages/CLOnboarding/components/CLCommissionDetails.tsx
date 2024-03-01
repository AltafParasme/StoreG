import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {withTranslation} from 'react-i18next';
import {View, StyleSheet, FlatList} from 'react-native';
import idx from 'idx';
import {AppText} from '../../../../components/Texts';
import {heightPercentageToDP, widthPercentageToDP} from '../../../../utils';
import {Constants} from '../../../../styles';

const commonMarginTop = heightPercentageToDP(1);
const commonPaddingHorizontal = widthPercentageToDP(2);


class CLCommissionDetails extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
        demandBase:[],
        deliveryBase:[]
    };
  }

  componentDidMount() {
      const {earningSchemes} = this.props.clEarningDetail;
      if(earningSchemes && earningSchemes.baseEarningScheme){
        let demandBase = [];
        let deliveryBase = [];
        earningSchemes.baseEarningScheme.map((item) => {
            if(item.earningCategory == 'delivery'){
                deliveryBase.push(item);
            } else {
                demandBase.push(item);
            }
        })
        this.setState({demandBase:demandBase});
        this.setState({deliveryBase:deliveryBase});
        }
    }
  

  commissionRender = ({item, index}) => {
    const {t} = this.props;
    let value = item.earningCategory == 'delivery' ? item.delivery : item.demand;
    if(value) {
    return (
        <View style={styles.doubleBed}>
            <View style={{flex:2,marginLeft:widthPercentageToDP(2)}}>
                <AppText bold size='XS'>
                    {t(item.name)}
                </AppText>
                <AppText size='XS'>
                    {t(item.desc)}
                </AppText>
            </View>
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                <AppText bold size='XS'>
                    {t(((item.earningCategory == 'delivery') ? item.delivery : item.demand) + `%`)}
                </AppText>
            </View>
        </View>
    );
    }
    else {
        return null; 
    }
  };

  weeklyCommissionRender = ({item, index}) => {
    const {t} = this.props;
    return (
        <View style={styles.doubleBed}>
            <View style={{flex:1.2,justifyContent:'center',alignItems:'center'}}>
            {
                (item.end>9999)
                ?
                <AppText black bold size='XS'>
                {t('\u20B9'+item.start + ' +')}
                </AppText>
                :
                <AppText black bold size='XS'>
                {t('\u20B9'+item.start+` - `+'\u20B9'+item.end)}
                </AppText>
            }
            </View>
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                <AppText bold size='XS'>
                    {t(item.bonusCategories[0].bonus+'%')}
                </AppText>
            </View>
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                <AppText bold size='XS'>
                    {t(item.bonusCategories[1].bonus+'%')}
                </AppText>
            </View>
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                <AppText bold size='XS'>
                    {t(item.bonusCategories[2].bonus+'%')}
                </AppText>
            </View>
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                <AppText bold size='XS'>
                    {t(item.bonusCategories[3].bonus+'%')}
                </AppText>
            </View>
        </View>
    );
  };

  weeklyCommissionRenderSheme = ({item, index}) => {
    const {t} = this.props;
    let slab = item.end > 99999 ? t('\u20B9'+item.start+` +`) : t('\u20B9'+item.start+` - `+'\u20B9'+item.end);
    return (
        <View style={styles.doubleBed}>
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
            {
                <AppText black bold size='XS'>
                {slab}
                </AppText>
            }
            </View>
            <View style={{flex:2,justifyContent:'center',alignItems:'center'}}>
                <AppText bold size='XS'>
                    {t(item.bonusCategories[0].bonus+'%')}
                </AppText>
            </View>
        </View>
    );
  };

  render() {
    const {t,clEarningDetail, clConfig} = this.props;
    const {demandBase,deliveryBase} = this.state;
    const FULFILLMENT_CL =
    clConfig &&
    clConfig.clType &&
    (clConfig.clType == 'FULFILLMENT' ||
      clConfig.clType == 'SHOPG_FULFILLMENT')
      ? true
      : false;

    return (
        <View style={styles.container}>
            <AppText size='S' style={{marginTop:commonMarginTop}}>
                {t(`KEEP IN MIND`)}
            </AppText>

            <View style={{alignItems:'center',width:widthPercentageToDP(90),marginTop:commonMarginTop,flexDirection:'row',paddingHorizontal:commonPaddingHorizontal}}>
                <View style={styles.dot}/>
                <AppText black bold size='XS'>
                    {t(`Commissions   =   `)}
                </AppText>
                <AppText bold size='XS' style={{color:Constants.orangeTextCommision}}>
                    {t(` Base `)}
                </AppText>
                <AppText black bold size='XS'>
                    {t(`  +  `)}
                </AppText>
                <AppText bold size='XS' style={{color:Constants.orangeTextCommision}}>
                    {t(` Bonus`)}
                </AppText>
                <AppText black bold size='XS'>
                    {t(` Commissions`)}
                </AppText>
            </View>

            <View style={{alignItems:'center',width:widthPercentageToDP(90),marginTop:commonMarginTop,flexDirection:'row',paddingHorizontal:commonPaddingHorizontal}}>
                <View>
                    <View style={styles.dot}/>
                    <AppText bold size='XS' >
                        {t(` `)}
                    </AppText>
                </View>
                <View style={{justifyContent:'center',alignItems:'center'}}>
                    <AppText bold size='XS' style={{color:Constants.orangeTextCommision}}>
                        {t(`Base Commission`)}
                    </AppText>
                    <AppText bold size='XS' >
                        {t(`   `)}
                    </AppText>
                </View>
                <View style={{justifyContent:'center',alignItems:'center'}}>
                    <AppText bold size='XS' >
                        {t(`   =   `)}
                    </AppText>
                    <AppText bold size='XS' >
                        {t(` `)}
                    </AppText>                
                </View>

                <View style={{justifyContent:'center',alignItems:'center'}}>
                    <AppText bold size='XS' >
                        {t(`Demand`)}
                    </AppText>
                    <AppText bold size='XXS' style={{color:Constants.pinkTextColor}}>
                        {t(`(Get orders)`)}
                    </AppText>
                </View>
                {FULFILLMENT_CL ?
                <View style={{justifyContent:'center',alignItems:'center'}}>
                    <AppText bold size='XS' >
                        {t(`   +   `)}
                    </AppText>
                    <AppText bold size='XS' >
                        {t(`          `)}
                    </AppText>
                </View>: null} 
                {FULFILLMENT_CL ? <View style={{justifyContent:'center',alignItems:'center'}}> 
                    <AppText bold size='XS' >
                        {t(`Delivery Based`)}
                    </AppText>
                    <AppText bold size='XXS' style={{color:Constants.pinkTextColor}}>
                        {t(`(Deliver orders)`)}
                    </AppText>
                </View>:null}
            </View>

            <View style={styles.commissionBox}>
            
                <AppText bold size='XS' style={{marginTop:commonMarginTop}}>
                    {t(`DEMAND WISE BASE COMMISSIONS`)}
                </AppText>
                <AppText size='XS'>
                    {t(`Category wise % commissions on`)}
                </AppText>
                <AppText bold size='XS' style={{color:Constants.pinkTextColor,marginBottom:commonMarginTop}}>
                    {t(`orders you get`)}
                </AppText>
                <View style={styles.singleLine}/>
                <View style={styles.doubleBed}>
                    <View style={{flex:2,marginLeft:widthPercentageToDP(2),justifyContent:'center'}}>
                        <AppText size='XS'>
                            {t(`Categories`)}
                        </AppText>
                    </View>
                    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                        <AppText size='XS'>
                            {t(`Percentage#NL#commission`,{NL:'\n'})}
                        </AppText>
                    </View>
                </View>
                <View style={styles.singleLine}/>
                <FlatList
                  data={demandBase}
                  renderItem={this.commissionRender}
                />

            </View>

            {FULFILLMENT_CL ? <View style={styles.commissionBox}>
            
                <AppText bold size='XS' style={{marginTop:commonMarginTop}}>
                    {t(`DELIVERY WISE BASE COMMISSION`)}
                </AppText>
                <AppText size='XS'>
                    {t(` Delivery wise Flat % commissions on`)}
                </AppText>
                <AppText bold size='XS' style={{color:Constants.pinkTextColor,marginBottom:commonMarginTop}}>
                    {t(`orders you deliver`)}
                </AppText>
                <View style={styles.singleLine}/>
                <View style={styles.doubleBed}>
                    <View style={{flex:2,marginLeft:widthPercentageToDP(2),justifyContent:'center'}}>
                        <AppText size='XS'>
                            {t(`Delivery`)}
                        </AppText>
                    </View>
                    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                        <AppText size='XS'>
                            {t(`Percentage#NL#commission`,{NL:'\n'})}
                        </AppText>
                    </View>
                </View>
                <View style={styles.singleLine}/>
                <FlatList
                  data={deliveryBase}
                  renderItem={this.commissionRender}
                />

            </View>: null}

            {FULFILLMENT_CL? <View style={{alignItems:'center',width:widthPercentageToDP(90),marginTop:commonMarginTop,flexDirection:'row',paddingHorizontal:commonPaddingHorizontal}}>
                <View style={styles.dot}/>
                <AppText bold size='XS' style={{color:Constants.orangeTextCommision}}>
                    {t(`Bonus Commission`)}
                </AppText>
                <AppText bold size='XS' >
                    {t(`   =   Weekly Target Based`)}
                </AppText>
            </View> : null}

            {FULFILLMENT_CL ? <View style={styles.commissionBox}>
            
            
                <AppText bold size='XS' style={{marginTop:2*commonMarginTop,color:'#fa6400'}}>
                    {t(`SCHEME A`)}
                </AppText>
                <AppText bold size='XS' style={{marginVertical:2*commonMarginTop}}>
                    {t(`WEEKLY TARGET WISE BONUS COMMISSION`)}
                </AppText>
                <View style={styles.singleLine}/>
                <View style={styles.doubleBed}>
                    <View style={{flex:1.2,justifyContent:'center',alignItems:'center'}}>
                        <AppText size='XS'>
                            {t(`Weekly Tar#NL#get Range`,{NL:'\n'})}
                        </AppText>
                    </View>
                    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                        <AppText size='XS'>
                            {t(`Grocery#NL#& Fresh`,{NL:'\n'})}
                        </AppText>
                    </View>
                    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                        <AppText size='XS'>
                            {t(`Non-#NL#Essentials`,{NL:'\n'})}
                        </AppText>
                    </View>
                    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                        <AppText size='XS'>
                            {t(`Core#NL#Staples`,{NL:'\n'})}
                        </AppText>
                    </View>
                    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                        <AppText size='XS'>
                            {t(`80% Task Completion`,{NL:'\n'})}
                        </AppText>
                    </View>
                </View>
                <View style={styles.singleLine}/>
                <FlatList
                  data={(clEarningDetail && clEarningDetail.earningSchemes && clEarningDetail.earningSchemes.bonusEarningScheme && clEarningDetail.earningSchemes.bonusEarningScheme.length) ? clEarningDetail.earningSchemes.bonusEarningScheme : []}
                  renderItem={this.weeklyCommissionRender}
                />

            </View> : null}
            {FULFILLMENT_CL ? <View style={{marginVertical:2*commonMarginTop,flex:1,justifyContent:'center',alignItems:'center'}}>
                        <AppText size='XS'>
                            {t(`OR`)}
                        </AppText>
                    </View> : null }

            {FULFILLMENT_CL ? <View style={styles.commissionBox}>
            
            
            <AppText bold size='XS' style={{marginTop:2*commonMarginTop,color:'#fa6400'}}>
                {t(`SCHEME B`)}
            </AppText>
            <AppText bold size='XS' style={{marginVertical:2*commonMarginTop}}>
                {t(`WEEKLY TARGET WISE BONUS COMMISSION`)}
            </AppText>
            <View style={styles.singleLine}/>
            <View style={styles.doubleBed}>
                <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                    <AppText size='XS'>
                        {t(`Weekly Target#NL#Range`,{NL:'\n'})}
                    </AppText>
                </View>
                <View style={{flex:2,justifyContent:'center',alignItems:'center'}}>
                    <AppText size='XS'>
                        {t('Bonus % commission on Ohayo Products')}
                    </AppText>
                </View>
                
            </View>
            <View style={styles.singleLine}/>
            <FlatList
              data={(clEarningDetail && clEarningDetail.earningSchemes && clEarningDetail.earningSchemes.ohayoEarningScheme && clEarningDetail.earningSchemes.ohayoEarningScheme.length) ? clEarningDetail.earningSchemes.ohayoEarningScheme : []}
              renderItem={this.weeklyCommissionRenderSheme}
            />

        </View> : null}

        {FULFILLMENT_CL ? <View style={{alignItems:'center',width:widthPercentageToDP(90),flexDirection:'row',marginTop:commonMarginTop,paddingHorizontal:commonPaddingHorizontal}}>
            <View style={styles.dot}/>
            <AppText black bold size='XS'>
                {t(`EITHER SCHEME A OR SCHEME B:`)}
            </AppText>
        </View> : null}

        {FULFILLMENT_CL ? <View style={{alignItems:'center',width:widthPercentageToDP(90),flexDirection:'row',marginTop:commonMarginTop,paddingHorizontal:commonPaddingHorizontal}}>
            <View style={[styles.dot,{backgroundColor:'transparent'}]}/>
            <AppText black size='XS'>
                {t(`which ever is applicable according to your target sales.If Ohayo target is achieved then the bonus will be paid for Ohayo products irrespective of over all sales target being achieved.`)}
            </AppText>
        </View> : null}

        
        {FULFILLMENT_CL ? <View style={{alignItems:'center',width:widthPercentageToDP(90),flexDirection:'row',marginTop:commonMarginTop,paddingHorizontal:commonPaddingHorizontal}}>
            <View style={styles.dot}/>
            <AppText black bold size='XS'>
                {t(`OHAYO PRODUCTS ARE COUNTED UNDER NON ESSENTIALS`)}
            </AppText>
        </View>:null}

        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  },
  dot:{
    backgroundColor:'black',
    height:heightPercentageToDP(1),
    width:heightPercentageToDP(1),
    borderRadius:heightPercentageToDP(1),
    justifyContent:'center',
    alignItems:'center',
    marginRight:widthPercentageToDP(2)
  },
  commissionBox:{
    borderColor:Constants.screenbackground,
    borderWidth:1,
    borderRadius:widthPercentageToDP(2),
    marginTop:commonMarginTop,
    width:widthPercentageToDP(90),
    alignItems:'center'
  },
  singleLine:{
    width:widthPercentageToDP(90),
    height:1,
    backgroundColor:Constants.screenbackground,
  },
  doubleBed:{
    width:widthPercentageToDP(90),
    flexDirection:'row',
    marginVertical:commonMarginTop
  }
});

const mapStateToProps = state => ({
    clEarningDetail:state.ShippingList.clEarningDetail,
    clConfig: state.clOnboarding.clConfig,
});

const mapDispatchToProps = dispatch => ({
  dispatch,
});
export default withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(CLCommissionDetails),
);