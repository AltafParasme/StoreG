import React, {PureComponent, Component} from 'react';
import {View, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import {Fonts, Colors} from '../../../../../assets/global';
import {withTranslation} from 'react-i18next';
import {connect} from 'react-redux';
import ShopgLive from '../../ShopgLive';
import {
    scaledSize,
    widthPercentageToDP,
    heightPercentageToDP,
  } from '../../../../utils';
  import {
    Placeholder,
    PlaceholderLine,
    Fade,
    PlaceholderMedia,
    ShineOverlay,
  } from 'rn-placeholder';
import {getWidgets,getLiveOfferListInBulk} from '../../Home/redux/action';
import CartStrip from '../../Home/component/CartStrip';
import idx from 'idx';

class ClaimCoins extends PureComponent {
    constructor(props) {
        super(props);
    }

    componentDidMount(){
        const userId = this.props.userPref.uid;
        this.props.onGetWidgets(true, true, 'ClaimCoins', userId,
        callback = () => {
            this.fetchLiveComponents()
        });
    }

    shouldComponentUpdate(nextProps, nextState) {
        const { querySnapshot : querySnapshotLatest } = nextProps.shopglive;
        const {pageUpdating, querySnapshot} = this.props.shopglive;
    
        if(querySnapshotLatest.length != querySnapshot.length && pageUpdating !== 'ClaimCoins')
        return false;

        return true;
    }


    fetchLiveComponents = () => {
        const {querySnapshot} = this.props.shopglive;
        let tags = '';
        if (querySnapshot.length > 0) {
            querySnapshot.map((item, index) => {
                const pageArray = idx(item, _ => _.data.page);
                if(pageArray.includes('ClaimCoins')){
                    tags += `${item.data.widgetData.tags[0].slug},`;
                }
            })

          if(tags.length > 0) {
            tags = tags.substring(0, tags.length - 1);
            this.props.getOffersListInBulk(tags, 1, 5);
          }
        }
      }

    render() {
        const {fetchingData,cart,totalCartItems,hasCart} = this.props;
        if(fetchingData){
            return (
                <View style={{flex: 1, marginTop: heightPercentageToDP(3)}}>
                    <PlaceholderLine
                    width={25}
                    style={styles.placeHolderLineStyle}
                    />
                    <Placeholder
                    Animation={ShineOverlay}
                    style={{
                        marginVertical: heightPercentageToDP(2),
                    }}
                    >
                    <PlaceholderMedia
                        style={styles.placeHolderMediaStyle}
                        />
                    </Placeholder>
                    <Placeholder
                    Animation={ShineOverlay}
                    style={{
                        marginVertical: heightPercentageToDP(2),
                    }}
                    >
                    <PlaceholderMedia
                        style={styles.placeHolderMediaStyle}
                        />
                    </Placeholder>
                    <Placeholder
                    Animation={ShineOverlay}
                    style={{
                        marginVertical: heightPercentageToDP(2),
                    }}
                    >
                    <PlaceholderMedia
                        style={styles.placeHolderMediaStyle}
                        />
                    </Placeholder>
                </View>
               );
        }

        return (
                <View style={styles.container}>
                    <ScrollView>
                        <ShopgLive
                            screenName="ClaimCoins"
                            isCLMode={false}/>
                        <View style={{height:hasCart ? heightPercentageToDP(25) : heightPercentageToDP(10),width:widthPercentageToDP(10)}}/>
                    </ScrollView>

                    {
                        (hasCart)
                        ?
                        <View style={styles.bottomTabView}>
                            <CartStrip
                                cart={cart}
                                totalCartItems={totalCartItems}
                            />
                        </View>
                        : null
                    }

                </View>
        );
    }
}

const styles = StyleSheet.create({
    container: { 
      backgroundColor: Colors.white,
      flex:1,
      width:widthPercentageToDP(100),
      height:heightPercentageToDP(100)
    },
    placeHolderMainView: {
        marginVertical: 6,
        marginHorizontal: 15,
        borderRadius: 4,
      },
    placeHolderMediaStyle: {
        width: widthPercentageToDP(100),
        height: heightPercentageToDP(9),
        marginRight: widthPercentageToDP(5),
    },
    placeHolderLineStyle: {
        paddingBottom: heightPercentageToDP(2),
        marginTop: heightPercentageToDP(3),
        marginBottom: heightPercentageToDP(2),
        marginLeft: widthPercentageToDP(4),
    },
    bottomTabView: {
        height: heightPercentageToDP(9.5),
        position: 'absolute',
        bottom: heightPercentageToDP(7),
        left: 0,
        right: 0,
        backgroundColor: '#fff',
      },
});

const mapStateToProps = state => ({
    userPref: state.login.userPreferences,
    fetchingData:state.ShopgLive.fetchingData,
    cart: state.home.cart,
    hasCart: state.home.hasCart,
    totalCartItems: state.home.totalCartItems,
    shopglive: state.ShopgLive,
});
  
const mapDispatchToProps = dispatch => ({
    dispatch,
    onGetWidgets: (isPublic, isPrivate, page, userId,callback) => {
        dispatch(getWidgets(isPublic, isPrivate, page, userId,callback));
    },
    getOffersListInBulk: (tags,page,size) => {
        dispatch(getLiveOfferListInBulk(tags,page,size));
    },
});
  
export default withTranslation()(
    connect(mapStateToProps, mapDispatchToProps)(ClaimCoins),
);